import {
  computed,
  readonly,
  ref,
} from 'vue'
import {
  isSafeAccountId,
  validateDisplayName,
} from './securityService.js'

const USERS_STORAGE_KEY = 'wasteless-users'
const REMEMBERED_USER_KEY =
  'wasteless-remembered-user'
const SESSION_USER_KEY =
  'wasteless-session-user'

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const UNSAFE_EMAIL_PATTERN = /[<>\p{Cc}]/u
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/

const seedAccounts = [
  {
    id: 'seed-admin',
    name: 'WasteLess Administrator',
    email: 'admin@wasteless.test',
    role: 'admin',
    passwordSalt:
      'y/SM95SRMBe46BTicwor3g==',
    passwordHash:
      'a3vp7Lm9Wnuxv2DJ3HgT+GPNT42MSWN+qaHiVrcD1ws=',
    createdAt:
      '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'seed-user',
    name: 'Demo User',
    email: 'user@wasteless.test',
    role: 'user',
    passwordSalt:
      'yN7r3rKcFsxWSU8UBOkhLQ==',
    passwordHash:
      'Qt10f5rkc3EppMGI4FRiK1S3YTeWs4qGtX42jNoDj+E=',
    createdAt:
      '2026-09-01T08:10:00.000Z',
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

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(value) {
  return Uint8Array.from(
    atob(value),
    (character) => character.charCodeAt(0),
  )
}

function isValidEncodedBytes(
  value,
  expectedLength,
) {
  if (typeof value !== 'string') {
    return false
  }

  try {
    return (
      base64ToBytes(value).length ===
      expectedLength
    )
  } catch {
    return false
  }
}

function normaliseTimestamp(value) {
  if (typeof value !== 'string') {
    return new Date().toISOString()
  }

  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    return new Date().toISOString()
  }

  return new Date(timestamp).toISOString()
}

export function normaliseEmail(email) {
  if (typeof email !== 'string') {
    return ''
  }

  return email.trim().toLowerCase()
}

export function isValidEmail(email) {
  const safeEmail = normaliseEmail(email)

  return (
    safeEmail.length <= 120 &&
    EMAIL_PATTERN.test(safeEmail) &&
    !UNSAFE_EMAIL_PATTERN.test(safeEmail)
  )
}

export function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    PASSWORD_PATTERN.test(password)
  )
}

function normaliseStoredUser(user) {
  if (
    !user ||
    typeof user !== 'object' ||
    Array.isArray(user)
  ) {
    return null
  }

  const nameResult =
    validateDisplayName(user.name)
  const safeEmail =
    normaliseEmail(user.email)

  if (
    !isSafeAccountId(user.id) ||
    !nameResult.success ||
    !isValidEmail(safeEmail) ||
    !isValidEncodedBytes(
      user.passwordSalt,
      16,
    ) ||
    !isValidEncodedBytes(
      user.passwordHash,
      32,
    )
  ) {
    return null
  }

  return {
    id: user.id,
    name: nameResult.value,
    email: safeEmail,
    role:
      user.id === 'seed-admin'
        ? 'admin'
        : 'user',
    passwordSalt: user.passwordSalt,
    passwordHash: user.passwordHash,
    createdAt:
      normaliseTimestamp(user.createdAt),
  }
}

function readUsers() {
  const storedUsers = readJson(
    localStorage,
    USERS_STORAGE_KEY,
    [],
  )

  if (!Array.isArray(storedUsers)) {
    return []
  }

  const validUsers = []
  const usedIds = new Set()
  const usedEmails = new Set()

  for (const storedUser of storedUsers) {
    const validUser =
      normaliseStoredUser(storedUser)

    if (
      !validUser ||
      usedIds.has(validUser.id) ||
      usedEmails.has(validUser.email)
    ) {
      continue
    }

    usedIds.add(validUser.id)
    usedEmails.add(validUser.email)
    validUsers.push(validUser)
  }

  return validUsers
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

function extractSessionUserId(sessionValue) {
  if (
    !sessionValue ||
    typeof sessionValue !== 'object'
  ) {
    return ''
  }

  const userId =
    typeof sessionValue.userId === 'string'
      ? sessionValue.userId
      : sessionValue.id

  return isSafeAccountId(userId)
    ? userId
    : ''
}

function readStoredSession() {
  const rememberedSession = readJson(
    localStorage,
    REMEMBERED_USER_KEY,
    null,
  )

  const rememberedUserId =
    extractSessionUserId(rememberedSession)

  if (rememberedUserId) {
    return {
      userId: rememberedUserId,
      rememberUser: true,
    }
  }

  const browserSession = readJson(
    sessionStorage,
    SESSION_USER_KEY,
    null,
  )

  const sessionUserId =
    extractSessionUserId(browserSession)

  if (sessionUserId) {
    return {
      userId: sessionUserId,
      rememberUser: false,
    }
  }

  return null
}

function createSalt() {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  return bytesToBase64(salt)
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()

  const keyMaterial =
    await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    )

  const derivedBits =
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: base64ToBytes(salt),
        iterations: 120000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256,
    )

  return bytesToBase64(
    new Uint8Array(derivedBits),
  )
}

function createUserId() {
  if (
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return (
    `user-${Date.now()}-` +
    Math.random().toString(16).slice(2)
  )
}

const currentUserState = ref(null)

function saveCurrentUser(
  user,
  rememberUser,
) {
  const safeUser = publicUser(user)
  const sessionValue = {
    userId: safeUser.id,
  }

  localStorage.removeItem(
    REMEMBERED_USER_KEY,
  )
  sessionStorage.removeItem(
    SESSION_USER_KEY,
  )

  const selectedStorage = rememberUser
    ? localStorage
    : sessionStorage

  const selectedKey = rememberUser
    ? REMEMBERED_USER_KEY
    : SESSION_USER_KEY

  if (
    !writeJson(
      selectedStorage,
      selectedKey,
      sessionValue,
    )
  ) {
    return false
  }

  currentUserState.value = safeUser
  return true
}

function initialiseAccounts() {
  let users = readUsers()

  for (const seedAccount of seedAccounts) {
    const accountExists = users.some(
      (user) => {
        return (
          user.id === seedAccount.id &&
          user.email === seedAccount.email
        )
      },
    )

    if (accountExists) {
      continue
    }

    users = users.filter((user) => {
      return (
        user.id !== seedAccount.id &&
        user.email !== seedAccount.email
      )
    })

    users.push({
      ...seedAccount,
    })
  }

  writeJson(
    localStorage,
    USERS_STORAGE_KEY,
    users,
  )

  const storedSession = readStoredSession()

  if (!storedSession) {
    currentUserState.value = null
    return users
  }

  const matchingUser = users.find(
    (user) => {
      return user.id === storedSession.userId
    },
  )

  if (!matchingUser) {
    logout()
    return users
  }

  saveCurrentUser(
    matchingUser,
    storedSession.rememberUser,
  )

  return users
}

const authReady = Promise.resolve().then(
  initialiseAccounts,
)

async function register({
  name,
  email,
  password,
}) {
  await authReady

  const users = readUsers()
  const nameResult =
    validateDisplayName(name)
  const safeEmail =
    normaliseEmail(email)

  if (!nameResult.success) {
    return {
      success: false,
      message: nameResult.message,
    }
  }

  if (!isValidEmail(safeEmail)) {
    return {
      success: false,
      message:
        'Please enter a valid email address.',
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
    (user) => {
      return (
        normaliseEmail(user.email) ===
        safeEmail
      )
    },
  )

  if (accountExists) {
    return {
      success: false,
      message:
        'This email address is already registered.',
    }
  }

  let passwordSalt
  let passwordHash

  try {
    passwordSalt = createSalt()
    passwordHash = await hashPassword(
      password,
      passwordSalt,
    )
  } catch {
    return {
      success: false,
      message:
        'Your account could not be secured. Please try again.',
    }
  }

  const newUser = {
    id: createUserId(),
    name: nameResult.value,
    email: safeEmail,
    role: 'user',
    passwordSalt,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  const updatedUsers = [
    ...users,
    newUser,
  ]

  if (
    !writeJson(
      localStorage,
      USERS_STORAGE_KEY,
      updatedUsers,
    )
  ) {
    return {
      success: false,
      message:
        'Your account could not be saved. Please try again.',
    }
  }

  if (!saveCurrentUser(newUser, false)) {
    return {
      success: false,
      message:
        'Your account was created, but sign in was unsuccessful.',
    }
  }

  return {
    success: true,
    user: publicUser(newUser),
  }
}

async function login({
  email,
  password,
  rememberUser,
}) {
  await authReady

  const users = readUsers()
  const safeEmail =
    normaliseEmail(email)

  if (
    !isValidEmail(safeEmail) ||
    typeof password !== 'string' ||
    password.length === 0 ||
    password.length > 128
  ) {
    return {
      success: false,
      message:
        'The email or password is incorrect.',
    }
  }

  const matchingUser = users.find(
    (user) => {
      return (
        normaliseEmail(user.email) ===
        safeEmail
      )
    },
  )

  if (!matchingUser) {
    return {
      success: false,
      message:
        'The email or password is incorrect.',
    }
  }

  let enteredPasswordHash

  try {
    enteredPasswordHash =
      await hashPassword(
        password,
        matchingUser.passwordSalt,
      )
  } catch {
    return {
      success: false,
      message:
        'The email or password is incorrect.',
    }
  }

  if (
    enteredPasswordHash !==
    matchingUser.passwordHash
  ) {
    return {
      success: false,
      message:
        'The email or password is incorrect.',
    }
  }

  if (
    !saveCurrentUser(
      matchingUser,
      Boolean(rememberUser),
    )
  ) {
    return {
      success: false,
      message:
        'Your session could not be saved. Please try again.',
    }
  }

  return {
    success: true,
    user: publicUser(matchingUser),
  }
}

function logout() {
  localStorage.removeItem(
    REMEMBERED_USER_KEY,
  )
  sessionStorage.removeItem(
    SESSION_USER_KEY,
  )

  currentUserState.value = null
}

export function useAuth() {
  return {
    authReady,
    currentUser:
      readonly(currentUserState),
    isAuthenticated: computed(() => {
      return Boolean(currentUserState.value)
    }),
    isAdmin: computed(() => {
      return (
        currentUserState.value?.role ===
        'admin'
      )
    }),
    login,
    logout,
    register,
  }
}