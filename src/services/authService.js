import {
  computed,
  readonly,
  ref,
} from 'vue'

import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
} from './firebase.js'

import {
  validateDisplayName,
} from './securityService.js'


const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/u

const UNSAFE_EMAIL_PATTERN =
  /[<>\p{Cc}]/u

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/


const currentUserState = ref(null)


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


function publicUser(firebaseUser, profile) {
  return {
    id: firebaseUser.uid,
    name:
      profile?.name ||
      firebaseUser.displayName ||
      '',
    email:
      profile?.email ||
      firebaseUser.email ||
      '',
    role:
      profile?.role === 'admin'
        ? 'admin'
        : 'user',
    createdAt:
      profile?.createdAt?.toDate?.()?.toISOString?.() ||
      '',
  }
}


async function loadUserProfile(firebaseUser) {
  if (!firebaseUser) {
    return null
  }

  const userRef = doc(
    db,
    'users',
    firebaseUser.uid,
  )

  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: 'user',
    }
  }

  return snapshot.data()
}


function getFriendlyAuthError(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered.'

    case 'auth/invalid-email':
      return 'Please enter a valid email address.'

    case 'auth/weak-password':
      return 'Please choose a stronger password.'

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.'

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.'

    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your connection.'

    default:
      return 'Authentication failed. Please try again.'
  }
}


async function register({
  name,
  email,
  password,
}) {
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

  try {
    // Registration uses session persistence by default.
    await setPersistence(
      auth,
      browserSessionPersistence,
    )

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        safeEmail,
        password,
      )

    const firebaseUser =
      credential.user

    const profile = {
      name: nameResult.value,
      email: safeEmail,
      role: 'user',
      createdAt: serverTimestamp(),
    }

    await setDoc(
      doc(
        db,
        'users',
        firebaseUser.uid,
      ),
      profile,
    )

    currentUserState.value =
      publicUser(
        firebaseUser,
        profile,
      )

    return {
      success: true,
      user: currentUserState.value,
    }
  } catch (error) {
    return {
      success: false,
      message:
        getFriendlyAuthError(error),
    }
  }
}


async function login({
  email,
  password,
  rememberUser,
}) {
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

  try {
    await setPersistence(
      auth,
      rememberUser
        ? browserLocalPersistence
        : browserSessionPersistence,
    )

    const credential =
      await signInWithEmailAndPassword(
        auth,
        safeEmail,
        password,
      )

    const profile =
      await loadUserProfile(
        credential.user,
      )

    currentUserState.value =
      publicUser(
        credential.user,
        profile,
      )

    return {
      success: true,
      user: currentUserState.value,
    }
  } catch (error) {
    return {
      success: false,
      message:
        getFriendlyAuthError(error),
    }
  }
}


async function logout() {
  currentUserState.value = null

  try {
    await signOut(auth)
  } catch {
    // UI state is already cleared.
  }
}


let resolveAuthReady

const authReady =
  new Promise((resolve) => {
    resolveAuthReady = resolve
  })


let initialAuthResolved = false


onAuthStateChanged(
  auth,
  async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        currentUserState.value = null
      } else {
        const profile =
          await loadUserProfile(
            firebaseUser,
          )

        currentUserState.value =
          publicUser(
            firebaseUser,
            profile,
          )
      }
    } catch {
      currentUserState.value = null
    } finally {
      if (!initialAuthResolved) {
        initialAuthResolved = true
        resolveAuthReady()
      }
    }
  },
)


export function useAuth() {
  return {
    authReady,

    currentUser:
      readonly(currentUserState),

    isAuthenticated:
      computed(() => {
        return Boolean(
          currentUserState.value,
        )
      }),

    isAdmin:
      computed(() => {
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