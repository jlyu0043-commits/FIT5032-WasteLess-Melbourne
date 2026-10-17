
<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../services/authService'

const router = useRouter()

const {
  currentUser,
  isAuthenticated,
  isAdmin,
  logout,
} = useAuth()

async function logoutUser() {
  logout()
  await router.push('/')
}
</script>

<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-xl">
      <div class="container app-header-container">
        <RouterLink class="navbar-brand" to="/">
          <span class="logo-icon">♻</span>
          <span class="brand-text">
            WasteLess <strong>Melbourne</strong>
          </span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          id="mainNavbar"
          class="collapse navbar-collapse"
        >
          <div class="navbar-nav">
            <RouterLink class="nav-link" to="/guide">
              Recycling Guide
            </RouterLink>

            <RouterLink class="nav-link" to="/locations">
              Find a Location
            </RouterLink>

            <RouterLink class="nav-link" to="/impact">
              Waste Impact
            </RouterLink>

            <RouterLink class="nav-link" to="/contact">
              Contact
            </RouterLink>

            <template v-if="isAuthenticated">
              <RouterLink
                v-if="isAdmin"
                class="nav-link"
                to="/admin"
              >
                Admin Dashboard
              </RouterLink>

              <RouterLink class="nav-link" to="/account">
                <span class="account-name">
                  {{ currentUser.name }}
                </span>
              </RouterLink>

              <button
                class="nav-link logout-link"
                type="button"
                @click="logoutUser"
              >
                Logout
              </button>
            </template>

            <RouterLink
              v-else
              class="nav-link"
              to="/login"
            >
              Login
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e2e8dc;
  box-shadow: 0 2px 8px rgba(30, 55, 30, 0.06);
}

.navbar {
  min-height: 108px;
  padding: 8px 0;
}

/* Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  margin: 0;
  padding: 0;
  color: #17202a;
  font-size: 30px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.navbar-brand:hover {
  color: #17202a;
}

.navbar-brand strong {
  color: #438c2b;
}

.brand-text {
  white-space: nowrap;
}

.logo-icon {
  color: #438c2b;
  font-size: 46px;
  line-height: 1;
}

/* Desktop: centered logo and navigation group */
@media (min-width: 1200px) {
  .app-header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;

    width: max-content !important;
    max-width: calc(100% - 48px) !important;

    margin-left: auto;
    margin-right: auto;
    padding: 0;
  }

  .navbar-collapse {
    display: flex !important;
    flex: 0 0 auto;
    width: auto;
    min-width: 0;
    margin-left: 30px;
  }

  .navbar-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;

    width: auto;
    gap: 24px;
    margin: 0;
    padding: 0;
  }

  .navbar-nav .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;

    flex: 0 0 auto;
    width: auto;
    max-width: 160px;
    min-height: 76px;

    padding: 10px 18px;
    border-radius: 10px;

    color: #17202a;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.22;
    text-align: center;
    white-space: normal;
    text-decoration: none;
  }

  .account-name {
    display: block;
    max-width: 115px;
    overflow-wrap: anywhere;
    text-align: center;
  }
}

/* Hover and active navigation */
.navbar-nav .nav-link:hover {
  background-color: #edf6e8;
  color: #347521;
}

.navbar-nav .router-link-active {
  background-color: #438c2b;
  color: #ffffff;
}

.navbar-nav .router-link-active:hover {
  background-color: #347521;
  color: #ffffff;
}

.logout-link {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

/* Medium desktop: 1400–1599px */
@media (min-width: 1400px) and (max-width: 1599px) {
  .navbar-brand {
    font-size: 26px;
  }

  .logo-icon {
    font-size: 40px;
  }

  .navbar-collapse {
    margin-left: 24px;
  }

  .navbar-nav {
    gap: 15px;
  }

  .navbar-nav .nav-link {
    max-width: 145px;
    min-height: 68px;
    padding: 9px 12px;
    font-size: 18px;
  }
}

/* Smaller desktop: 1200–1399px */
@media (min-width: 1200px) and (max-width: 1399px) {
  .navbar {
    min-height: 90px;
  }

  .navbar-brand {
    font-size: 21px;
    gap: 7px;
  }

  .logo-icon {
    font-size: 34px;
  }

  .navbar-collapse {
    margin-left: 16px;
  }

  .navbar-nav {
    gap: 7px;
  }

  .navbar-nav .nav-link {
    max-width: 125px;
    min-height: 62px;
    padding: 8px 8px;
    font-size: 15px;
  }

  .account-name {
    max-width: 90px;
  }
}

/* Tablet and mobile */
@media (max-width: 1199px) {
  .navbar {
    min-height: 76px;
  }

  .app-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    width: 100%;
    max-width: 100% !important;

    padding-left: 18px;
    padding-right: 18px;
  }

  .navbar-brand {
    font-size: 22px;
    gap: 8px;
  }

  .logo-icon {
    font-size: 34px;
  }

  .navbar-collapse {
    flex-basis: 100%;
    flex-grow: 1;
    padding-top: 12px;
    padding-bottom: 10px;
  }

  .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
    margin: 0;
  }

  .navbar-nav .nav-link {
    display: block;
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;

    color: #17202a;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    white-space: normal;
  }

  .account-name {
    max-width: none;
    white-space: normal;
  }
}

/* Small phones */
@media (max-width: 575px) {
  .navbar-brand {
    font-size: 20px;
    gap: 6px;
  }

  .logo-icon {
    font-size: 30px;
  }

  .navbar-toggler {
    padding: 4px 8px;
  }
}

@media (max-width: 400px) {
  .navbar-brand {
    font-size: 17px;
    gap: 5px;
  }

  .logo-icon {
    font-size: 25px;
  }

  .navbar-toggler {
    padding: 4px 7px;
  }
}
</style>
