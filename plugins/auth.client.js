import { refreshToken, getAccessToken } from '~/utils/auth'

export default defineNuxtPlugin((nuxtApp) => {
  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    failedQueue = []
  }

  const fetch = $fetch.create({
    async onRequest({ options }) {
      if (process.client) {
        try {
          const token = await getAccessToken()
          options.headers = options.headers || {}
          options.headers['Authorization'] = `Bearer ${token}`
        } catch (error) {
          console.error('auth.client.js: Failed to get access token:', error)
        }
      }
    },
    async onResponseError({ request, response, options }) {
      if (request.includes('/api/register/') || request.includes('/api/token/')) {
        return
      }

      if (response.status === 401 && !isRefreshing && process.client) {
        isRefreshing = true
        try {
          const newToken = await refreshToken()
          options.headers = options.headers || {}
          options.headers['Authorization'] = `Bearer ${newToken}`
          processQueue(null, newToken)
          return $fetch(request, options)
        } catch (error) {
          processQueue(error)
          await navigateTo('/login', { redirectCode: 302 })
          throw error
        } finally {
          isRefreshing = false
        }
      } else if (response.status === 401 && process.client) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            options.headers['Authorization'] = `Bearer ${token}`
            return $fetch(request, options)
          })
          .catch((error) => Promise.reject(error))
      }
    }
  })

  return {
    provide: {
      authFetch: fetch
    }
  }
})