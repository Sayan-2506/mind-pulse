export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
      try {
        const token = await getAccessToken()
        console.log('auth middleware: Token:', token)
        if (!token) {
          return navigateTo('/login', { redirectCode: 302 })
        }
      } catch (error) {
        console.error('auth middleware: Failed to get access token:', error)
        return navigateTo('/login', { redirectCode: 302 })
      }
    }
  })
  