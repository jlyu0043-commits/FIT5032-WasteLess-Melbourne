<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '../services/authService'

const { isAdmin } = useAuth()
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-content">
      <div class="footer-links">
        <span class="footer-logo">♻</span>

        <a href="#">Contact</a>

        <a href="#">Privacy</a>

        <a href="#">Accessibility</a>

        <RouterLink
          v-if="isAdmin"
          to="/admin"
        >
          Admin Dashboard
        </RouterLink>
      </div>

      <p>
        © 2026 WasteLess Melbourne. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.footer-content {
  min-height: 95px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.footer-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-logo {
  color: #438c2b;
  font-size: 36px;
  line-height: 1;
}

.footer-links a {
  color: #334155;
  text-decoration: none;
}

.footer-links a:hover {
  color: #438c2b;
}

.footer-links .router-link-active {
  color: #347521;
  font-weight: 700;
}

.app-footer p {
  margin: 0;
  color: #475569;
  text-align: right;
}

@media (max-width: 991px) {
  .footer-content {
    padding-top: 25px;
    padding-bottom: 25px;
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
    gap: 18px;
  }

  .app-footer p {
    text-align: center;
  }
}

@media (max-width: 575px) {
  .footer-links {
    max-width: 330px;
  }

  .footer-logo {
    width: 100%;
  }

  .app-footer p {
    font-size: 14px;
  }
}
</style>