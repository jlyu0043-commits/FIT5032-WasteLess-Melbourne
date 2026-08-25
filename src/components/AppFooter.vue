<template>
  <footer class="app-footer">
    <div class="container footer-content">
      <div class="footer-links">
        <span class="footer-logo">♻</span>
        <a href="#">Contact</a>
        <a href="#">Privacy</a>
        <a href="#">Accessibility</a>
      </div>

      <p>© 2026 WasteLess Melbourne. All rights reserved.</p>
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
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 35px;
}

.footer-logo {
  color: #438c2b;
  font-size: 36px;
}

.footer-links a {
  color: #334155;
  text-decoration: none;
}

.footer-links a:hover {
  color: #438c2b;
}

.app-footer p {
  margin: 0;
  color: #475569;
}

@media (max-width: 767px) {
  .footer-content {
    padding-top: 25px;
    padding-bottom: 25px;
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 18px;
  }
}
</style>