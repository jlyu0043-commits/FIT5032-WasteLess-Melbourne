<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  isStrongPassword,
  isValidEmail,
  useAuth,
} from '../services/authService'

const router = useRouter()
const { login, register } = useAuth()

const loginEmail = ref('')
const loginPassword = ref('')
const rememberMe = ref(false)
const showLoginPassword = ref(false)
const loginError = ref('')
const loginSuccess = ref('')
const loginLoading = ref(false)

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')
const showRegisterPassword = ref(false)

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const registerError = ref('')
const registerSuccess = ref('')
const registerLoading = ref(false)

async function loginUser() {
  loginError.value = ''
  loginSuccess.value = ''

  if (
    loginEmail.value.trim() === '' ||
    loginPassword.value === ''
  ) {
    loginError.value =
      'Please enter your email and password.'
    return
  }

  if (!isValidEmail(loginEmail.value)) {
    loginError.value =
      'Please enter a valid email address.'
    return
  }

  loginLoading.value = true

  try {
    const result = await login({
      email: loginEmail.value,
      password: loginPassword.value,
      rememberUser: rememberMe.value,
    })

    if (!result.success) {
      loginError.value = result.message
      return
    }

    loginSuccess.value = 'Login successful.'
    loginPassword.value = ''
    await router.push('/account')
  } finally {
    loginLoading.value = false
  }
}

async function registerUser() {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  registerError.value = ''
  registerSuccess.value = ''

  let hasError = false

  if (registerName.value.trim() === '') {
    nameError.value = 'Name is required.'
    hasError = true
  }

  if (
    registerEmail.value.trim() === '' ||
    !isValidEmail(registerEmail.value)
  ) {
    emailError.value = 'Valid email is required.'
    hasError = true
  }

  if (!isStrongPassword(registerPassword.value)) {
    passwordError.value =
      'Use at least 8 characters with uppercase, lowercase and a number.'
    hasError = true
  }

  if (
    registerPassword.value !== confirmPassword.value
  ) {
    confirmPasswordError.value =
      'Passwords do not match.'
    hasError = true
  }

  if (hasError) {
    return
  }

  registerLoading.value = true

  try {
    const result = await register({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
    })

    if (!result.success) {
      registerError.value = result.message
      return
    }

    registerSuccess.value =
      'Account created successfully.'
    registerPassword.value = ''
    confirmPassword.value = ''
    await router.push('/account')
  } finally {
    registerLoading.value = false
  }
}
</script>

<template>
  <main>
    <section class="auth-hero">
      <div class="container">
        <div class="hero-content">
          <h1>
            Welcome to
            <br />
            WasteLess
            <span>Melbourne</span>
          </h1>

          <p>
            Sign in or create an account to save useful
            recycling information.
          </p>
        </div>
      </div>
    </section>

    <section class="auth-section">
      <div class="container">
        <div class="row g-4 auth-row">
          <div class="col-12 col-lg-6">
            <article class="auth-card">
              <div class="auth-icon">
                👤
              </div>

              <h2>Login</h2>

              <p class="card-description">
                Welcome back! Please login to your account.
              </p>

              <form @submit.prevent="loginUser">
                <div class="form-group">
                  <label for="login-email">
                    Email
                  </label>

                  <div class="input-control">
                    <span>✉</span>

                    <input
                      id="login-email"
                      v-model="loginEmail"
                      type="email"
                      placeholder="Enter your email"
                      autocomplete="email"
                      maxlength="120"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="login-password">
                    Password
                  </label>

                  <div class="input-control">
                    <span>🔒</span>

                    <input
                      id="login-password"
                      v-model="loginPassword"
                      :type="
                        showLoginPassword
                          ? 'text'
                          : 'password'
                      "
                      placeholder="Enter your password"
                      autocomplete="current-password"
                      maxlength="128"
                      required
                    />

                    <button
                      class="password-button"
                      type="button"
                      aria-label="Show or hide password"
                      :aria-pressed="showLoginPassword"
                      @click="
                        showLoginPassword =
                          !showLoginPassword
                      "
                    >
                      👁
                    </button>
                  </div>
                </div>

                <div class="login-options">
                  <label class="remember-option">
                    <input
                      v-model="rememberMe"
                      type="checkbox"
                    />

                    <span>Remember me</span>
                  </label>

                  <span class="login-note">
                    Client-side account demo
                  </span>
                </div>

                <button
                  class="btn auth-button"
                  type="submit"
                  :disabled="loginLoading"
                >
                  {{ loginLoading ? 'Signing in…' : 'Login' }}
                </button>

                <p
                  v-if="loginError"
                  class="form-message error-message"
                  role="alert"
                >
                  {{ loginError }}
                </p>

                <p
                  v-if="loginSuccess"
                  class="form-message success-message"
                  aria-live="polite"
                >
                  {{ loginSuccess }}
                </p>
              </form>

              <div class="divider">
                <span></span>
                <p>or</p>
                <span></span>
              </div>

              <p class="register-link">
                Don’t have an account?
                <a href="#register-form">
                  Register
                </a>
              </p>
            </article>
          </div>

          <div class="col-12 col-lg-6">
            <article
              id="register-form"
              class="auth-card"
            >
              <div class="auth-icon">
                👥
              </div>

              <h2>Register</h2>

              <p class="card-description">
                Create an account to get started.
              </p>

              <form @submit.prevent="registerUser">
                <div class="form-group">
                  <label for="register-name">
                    Name
                  </label>

                  <div class="input-control">
                    <span>👤</span>

                    <input
                      id="register-name"
                      v-model="registerName"
                      type="text"
                      placeholder="Enter your full name"
                      autocomplete="name"
                      maxlength="60"
                      required
                    />
                  </div>

                  <p
                    v-if="nameError"
                    class="field-error"
                  >
                    {{ nameError }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="register-email">
                    Email
                  </label>

                  <div class="input-control">
                    <span>✉</span>

                    <input
                      id="register-email"
                      v-model="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      autocomplete="email"
                      maxlength="120"
                      required
                    />
                  </div>

                  <p
                    v-if="emailError"
                    class="field-error"
                  >
                    {{ emailError }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="register-password">
                    Password
                  </label>

                  <div class="input-control">
                    <span>🔒</span>

                    <input
                      id="register-password"
                      v-model="registerPassword"
                      :type="
                        showRegisterPassword
                          ? 'text'
                          : 'password'
                      "
                      placeholder="Enter your password"
                      autocomplete="new-password"
                      maxlength="128"
                      required
                    />

                    <button
                      class="password-button"
                      type="button"
                      aria-label="Show or hide password"
                      :aria-pressed="showRegisterPassword"
                      @click="
                        showRegisterPassword =
                          !showRegisterPassword
                      "
                    >
                      👁
                    </button>
                  </div>

                  <p class="password-help">
                    Minimum 8 characters with uppercase,
                    lowercase and a number
                  </p>

                  <p
                    v-if="passwordError"
                    class="field-error"
                  >
                    {{ passwordError }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="confirm-password">
                    Confirm Password
                  </label>

                  <div class="input-control">
                    <span>🔒</span>

                    <input
                      id="confirm-password"
                      v-model="confirmPassword"
                      :type="
                        showRegisterPassword
                          ? 'text'
                          : 'password'
                      "
                      placeholder="Confirm your password"
                      autocomplete="new-password"
                      maxlength="128"
                      required
                    />
                  </div>

                  <p
                    v-if="confirmPasswordError"
                    class="field-error"
                  >
                    {{ confirmPasswordError }}
                  </p>
                </div>

                <button
                  class="btn auth-button"
                  type="submit"
                  :disabled="registerLoading"
                >
                  {{
                    registerLoading
                      ? 'Creating account…'
                      : 'Register'
                  }}
                </button>

                <p
                  v-if="registerError"
                  class="form-message error-message"
                  role="alert"
                >
                  {{ registerError }}
                </p>

                <p
                  v-if="registerSuccess"
                  class="form-message success-message"
                  aria-live="polite"
                >
                  {{ registerSuccess }}
                </p>
              </form>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-hero {
  min-height: 340px;
  padding: 48px 0 120px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99) 0%,
      rgba(250, 252, 247, 0.94) 47%,
      rgba(250, 252, 247, 0.08) 78%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.hero-content {
  max-width: 700px;
}

.hero-content h1 {
  margin-bottom: 16px;
  color: #17202a;
  font-size: 54px;
  font-weight: 750;
  line-height: 1.15;
}

.hero-content h1 span {
  color: #438c2b;
}

.hero-content p {
  color: #475569;
  font-size: 19px;
}

.auth-section {
  margin-top: -90px;
  padding-bottom: 50px;
  position: relative;
  background-color: #fbfcfb;
}

.auth-row {
  align-items: stretch;
}

.auth-card {
  height: 100%;
  padding: 30px 36px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(28, 55, 27, 0.1);
}

.auth-icon {
  width: 66px;
  height: 66px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 34px;
}

.auth-card h2 {
  margin-bottom: 5px;
  color: #17202a;
  font-size: 29px;
  font-weight: 700;
  text-align: center;
}

.card-description {
  margin-bottom: 22px;
  color: #64748b;
  text-align: center;
}

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  margin-bottom: 7px;
  display: block;
  color: #17202a;
  font-weight: 600;
}

.input-control {
  min-height: 52px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #cbd5cf;
  border-radius: 9px;
  background-color: white;
}

.input-control:focus-within {
  border-color: #438c2b;
  box-shadow: 0 0 0 3px rgba(67, 140, 43, 0.12);
}

.input-control > span {
  color: #64748b;
  font-size: 19px;
}

.input-control input {
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: #334155;
}

.password-button {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.login-options {
  margin: 4px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.remember-option {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
}

.remember-option input {
  width: 18px;
  height: 18px;
  accent-color: #438c2b;
}

.login-options a,
.register-link a {
  color: #438c2b;
  text-decoration: none;
}

.login-options a:hover,
.register-link a:hover {
  color: #2f6f1f;
}

.auth-button {
  width: 100%;
  min-height: 50px;
  background-color: #4c962f;
  border-radius: 9px;
  color: white;
  font-size: 17px;
  font-weight: 700;
}

.auth-button:hover {
  background-color: #347521;
  color: white;
}

.divider {
  margin: 25px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.divider span {
  height: 1px;
  flex-grow: 1;
  background-color: #d6ddd4;
}

.divider p {
  margin: 0;
  color: #64748b;
}

.register-link {
  margin: 0;
  text-align: center;
}

.field-error {
  margin: 5px 0 0;
  color: #c0392b;
  font-size: 14px;
}

.password-help {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 13px;
}

.form-message {
  margin: 14px 0 0;
  padding: 10px 12px;
  border-radius: 7px;
  text-align: center;
  font-weight: 600;
}

.error-message {
  background-color: #fff0ee;
  color: #b42318;
}

.success-message {
  background-color: #edf7e9;
  color: #347521;
}

@media (max-width: 991px) {
  .auth-section {
    margin-top: -65px;
  }
}

@media (max-width: 767px) {
  .auth-hero {
    min-height: 390px;
    padding: 38px 0 100px;
    background-position: 65% center;
  }

  .hero-content h1 {
    font-size: 41px;
  }

  .hero-content p {
    font-size: 18px;
  }

  .auth-section {
    margin-top: -60px;
  }

  .auth-card {
    padding: 27px 20px;
  }

  .login-options {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
