import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: process.env.NUXT_PUBLIC_API_URL ||'http://localhost:3001' , // Gọi trực tiếp đến cổng 3001
    timeout: 10000,
  });

  return {
    provide: {
      api,
    },
  };
});