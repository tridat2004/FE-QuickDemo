// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',
  // Global CSS
  css: [
    '@/assets/css/global.css'
  ],

  // App configuration
  app: {
    head: {
      title: 'NewsHub - Dashboard Tin Tức',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard quản lý tin tức hiện đại với tính năng tìm kiếm, lọc và phân trang' },
        { name: 'keywords', content: 'dashboard, tin tức, news, quản lý, tìm kiếm, lọc' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '',
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: '/api'
    }
  },

  // Auto import components
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Modules
  modules: [
    // Add modules here if needed
    // '@nuxtjs/tailwindcss', // if you want to use Tailwind instead
  ],

  // Build configuration
  build: {
    // Build options
  },

  // Server configuration
  nitro: {
    // Server options
  }
})