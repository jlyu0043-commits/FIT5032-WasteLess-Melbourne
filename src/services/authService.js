import { computed, readonly, ref } from 'vue'

const USERS_STORAGE_KEY = 'wasteless-users'
const REMEMBERED_USER_KEY = 'wasteless-remembered-user'
const SESSION_USER_KEY = 'wasteless-session-user'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/

const seedAccounts = [
  {
    id: 'seed-admin',
    name: 'WasteLess Administrator',
    email: 'admin@wasteless.test',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    id: 'seed-user',
    name: 'Demo User',
    email: 'user@wasteless.test',
    password: 'User123!',
    role: 'user',
  },
]

function readJson(storage, key, fallbackValue) {
  try {
    const storedValue = storage.getItem(key)

    if (!storedValue) {
      return fallbackValue
    }

    return JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function readUsers() {
  const storedUsers = readJson(localStorage, USERS_STORAGE_KEY, [])
  return Array.isArray(storedUsers) ? storedUsers : []
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

function readCurrentUser() {
  const rememberedUser = readJson(
    localStorage,
    REMEMBERED_USER_KEY,
    null,
  )

  if (rememberedUser?.id) {
    return rememberedUser
  }

  const sessionUser = readJson(
    sessionStorage,
    SESSION_USER_KEY,
    null,
  )

  return sessionUser?.id ? sessionUser : null
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) =>
    character.charCodeAt(0),
  )
}

function createSalt() {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  return bytesToBase64(salt)
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(salt),
      iterations: 120000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )

  return bytesToBase64(new Uint8Array(derivedBits))
}

function createUserId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(normaliseEmail(email))
}

export function isStrongPassword(password) {
  return PASSWORD_PATTERN.test(password)
}

const currentUserState = ref(readCurrentUser())

function saveCurrentUser(user, rememberUser) {
  const safeUser = publicUser(user)

  localStorage.removeItem(REMEMBERED_USER_KEY)
  sessionStorage.removeItem(SESSION_USER_KEY)

  const selectedStorage = rememberUser
    ? localStorage
    : sessionStorage
  const selectedKey = rememberUser
    ? REMEMBERED_USER_KEY
    : SESSION_USER_KEY

  if (!writeJson(selectedStorage, selectedKey, safeUser)) {
    return false
  }

  currentUserState.value = safeUser
  return true
}

async function initialiseAccounts() {
  const users = readUsers()
  let accountsChanged = false

  for (const seedAccount of seedAccounts) {
    const accountExists = users.some(
      (user) => user.email === seedAccount.email,
    )

    if (accountExists) {
      continue
    }

    const passwordSalt = createSalt()
    const passwordHash = await hashPassword(
      seedAccount.password,
      passwordSalt,
    )

    users.push({
      id: seedAccount.id,
      name: seedAccount.name,
      email: seedAccount.email,
      role: seedAccount.role,
      passwordSalt,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    accountsChanged = true
  }

  if (accountsChanged) {
    writeJson(localStorage, USERS_STORAGE_KEY, users)
  }

  if (
    currentUserState.value &&
    !users.some((user) => user.id === currentUserState.value.id)
  ) {
    logout()
  }

  return users
}

const authReady = initialiseAccounts()

async function register({ name, email, password }) {
  await authReady
  const users = readUsers()
  const safeName = name.trim()
  const safeEmail = normaliseEmail(email)

  if (!safeName || safeName.length > 60) {
    return {
      success: false,
      message: 'Please enter a name of 60 characters or fewer.',
    }
  }

  if (!isValidEmail(safeEmail) || safeEmail.length > 120) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  if (!isStrongPassword(password)) {
    return {
      success: false,
      message:
        'Password must contain at least 8 characters, including uppercase, lowercase and a number.',
    }
  }

  const accountExists = users.some(
    (user) => normaliseEmail(user.email) === safeEmail,
  )

  if (accountExists) {
    return {
      success: false,
      message: 'This email address is already registered.',
    }
  }

  const passwordSalt = createSalt()
  const passwordHash = await hashPassword(
    password,
    passwordSalt,
  )

  const newUser = {
    id: createUserId(),
    name: safeName,
    email: safeEmail,
    role: 'user',
    passwordSalt,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  const updatedUsers = [...users, newUser]

  if (!writeJson(localStorage, USERS_STORAGE_KEY, updatedUsers)) {
    return {
      success: false,
      message: 'Your account could not be saved. Please try again.',
    }
  }

  if (!saveCurrentUser(newUser, false)) {
    return {
      success: false,
      message: 'Your account was created, but sign in was unsuccessful.',
    }
  }

  return {
    success: true,
    user: publicUser(newUser),
  }
}

async function login({ email, password, rememberUser }) {
  await authReady
  const users = readUsers()
  const safeEmail = normaliseEmail(email)
  const matchingUser = users.find(
    (user) => normaliseEmail(user.email) === safeEmail,
  )

  if (!matchingUser) {
    return {
      success: false,
      message: 'The email or password is incorrect.',
    }
  }

  const enteredPasswordHash = await hashPassword(
    password,
    matchingUser.passwordSalt,
  )

  if (enteredPasswordHash !== matchingUser.passwordHash) {
    return {
      success: false,
      message: 'The email or password is incorrect.',
    }
  }

  if (!saveCurrentUser(matchingUser, rememberUser)) {
    return {
      success: false,
      message: 'Your session could not be saved. Please try again.',
    }
  }

  return {
    success: true,
    user: publicUser(matchingUser),
  }
}

function logout() {
  localStorage.removeItem(REMEMBERED_USER_KEY)
  sessionStorage.removeItem(SESSION_USER_KEY)
  currentUserState.value = null
}

export function useAuth() {
  return {
    authReady,
    currentUser: readonly(currentUserState),
    isAuthenticated: computed(() => Boolean(currentUserState.value)),
    isAdmin: computed(
      () => currentUserState.value?.role === 'admin',
    ),
    login,
    logout,
    register,
  }
}
