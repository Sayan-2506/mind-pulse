// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
    if (!localStorage.getItem('access_token') && to.path !== '/login') {
      return navigateTo('/login')
    }
  })