<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../services/authService'

const router = useRouter()
const { currentUser, isAuthenticated, logout } = useAuth()

async function logoutUser() {
  logout()
  await router.push('/')
}
</script>

<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">
          <span class="logo-icon">♻</span>

          <span>
            WasteLess
            <strong>Melbourne</strong>
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

        <div id="mainNavbar" class="collapse navbar-collapse">
          <div class="navbar-nav ms-auto">
            <RouterLink class="nav-link" to="/guide">
              Recycling Guide
            </RouterLink>

            <RouterLink class="nav-link" to="/locations">
              Find a Location
            </RouterLink>

            <template v-if="isAuthenticated">
              <RouterLink class="nav-link" to="/account">
                {{ currentUser.name }}
              </RouterLink>

              <button
                class="nav-link logout-link"
                type="button"
                @click="logoutUser"
              >
                Logout
              </button>
            </template>

            <RouterLink v-else class="nav-link" to="/login">
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
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(30, 55, 30, 0.08);
}

.navbar {
  min-height: 90px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #17202a;
  font-size: 26px;
  font-weight: 700;
  text-decoration: none;
}

.navbar-brand:hover {
  color: #17202a;
}

.navbar-brand strong {
  color: #438c2b;
}

.logo-icon {
  color: #438c2b;
  font-size: 42px;
  line-height: 1;
}

.navbar-nav {
  gap: 14px;
}

.navbar-nav .nav-link {
  padding: 10px 16px;
  border-radius: 8px;
  color: #17202a;
  font-size: 17px;
  font-weight: 600;
}

.logout-link {
  border: 0;
  background: transparent;
  text-align: left;
}

.navbar-nav .nav-link:hover {
  background-color: #edf6e8;
  color: #347521;
}

.navbar-nav .router-link-active {
  background-color: #438c2b;
  color: white;
}

.navbar-nav .router-link-active:hover {
  background-color: #347521;
  color: white;
}

@media (max-width: 991px) {
  .navbar {
    min-height: 75px;
  }

  .navbar-collapse {
    padding: 15px 0;
  }

  .navbar-nav {
    gap: 6px;
  }

  .navbar-nav .nav-link {
    padding: 10px 12px;
  }
}

@media (max-width: 575px) {
  .navbar-brand {
    gap: 7px;
    font-size: 20px;
    white-space: nowrap;
  }

  .logo-icon {
    font-size: 30px;
  }

  .navbar-toggler {
    padding: 4px 8px;
  }
}
</style>
