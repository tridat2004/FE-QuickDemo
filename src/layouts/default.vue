<!-- layouts/default.vue -->
<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <div class="header-brand">
          <NuxtLink to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
              </svg>
            </div>
            <span class="brand-text">NewsHub</span>
          </NuxtLink>
        </div>

        <nav class="header-nav">
          <NuxtLink to="/" class="nav-link" active-class="active">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/articles" class="nav-link" active-class="active">
            Bài viết
          </NuxtLink>
          <NuxtLink to="/categories" class="nav-link" active-class="active">
            Danh mục
          </NuxtLink>
        </nav>

        <!-- Mobile menu button -->
        <button 
          @click="toggleMobileMenu"
          class="mobile-menu-btn"
          :class="{ active: isMobileMenuOpen }"
        >
          <span class="menu-line"></span>
          <span class="menu-line"></span>
          <span class="menu-line"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" :class="{ active: isMobileMenuOpen }">
        <NuxtLink 
          to="/" 
          class="mobile-nav-link" 
          @click="closeMobileMenu"
          active-class="active"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink 
          to="/articles" 
          class="mobile-nav-link" 
          @click="closeMobileMenu"
          active-class="active"
        >
          Bài viết
        </NuxtLink>
        <NuxtLink 
          to="/categories" 
          class="mobile-nav-link" 
          @click="closeMobileMenu"
          active-class="active"
        >
          Danh mục
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>NewsHub</h3>
            <p>Dashboard quản lý tin tức hiện đại và thân thiện</p>
          </div>
          <div class="footer-section">
            <h4>Liên kết</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/">Dashboard</NuxtLink></li>
              <li><NuxtLink to="/articles">Bài viết</NuxtLink></li>
              <li><NuxtLink to="/categories">Danh mục</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Liên hệ</h4>
            <ul class="footer-links">
              <li>Email: info@newshub.com</li>
              <li>Phone: +84 123 456 789</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 NewsHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-nav {
  display: flex;
  gap: 32px;
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background: #f0f4ff;
  color: #667eea;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
}

.menu-line {
  width: 24px;
  height: 2px;
  background: #4a5568;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active .menu-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active .menu-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .menu-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-nav {
  display: none;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}

@media (max-width: 768px) {
  .mobile-nav.active {
    display: block;
  }
}

.mobile-nav-link {
  display: block;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: #667eea;
}

/* Main Content */
.app-main {
  flex: 1;
}

/* Footer Styles */
.app-footer {
  background: #2d3748;
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.footer-section h3 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #e2e8f0;
}

.footer-section p {
  color: #a0aec0;
  margin: 0;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.footer-bottom {
  border-top: 1px solid #4a5568;
  padding-top: 24px;
  text-align: center;
}

.footer-bottom p {
  color: #a0aec0;
  margin: 0;
  font-size: 14px;
}
</style>