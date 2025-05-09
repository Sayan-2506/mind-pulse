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
      async onResponseError({ request, response, options }) {
        if (response.status === 401 && !isRefreshing) {
          isRefreshing = true
          try {
            const runtimeConfig = useRuntimeConfig()
            const refreshResponse = await $fetch(`${runtimeConfig.public.apiBase}/api/token/refresh/`, {
              method: 'POST',
              body: { refresh: localStorage.getItem('refresh_token') }
            })
            const newToken = refreshResponse.access
            localStorage.setItem('access_token', newToken)
  
            // Обновляем заголовок для текущего запроса
            options.headers = options.headers || {}
            options.headers['Authorization'] = `Bearer ${newToken}`
  
            // Повторяем все запросы из очереди
            processQueue(null, newToken)
  
            // Повторяем исходный запрос
            return $fetch(request, options)
          } catch (error) {
            processQueue(error)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            navigateTo('/login')
            throw error
          } finally {
            isRefreshing = false
          }
        } else if (response.status === 401) {
          // Если обновление уже идет, добавляем запрос в очередь
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