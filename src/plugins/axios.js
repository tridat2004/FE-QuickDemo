import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase, // ✅ lấy từ runtime config
    timeout: 10000,
  })

  return {
    provide: {
      api,
    },
  }
})