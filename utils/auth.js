export async function refreshToken() {
    const runtimeConfig = useRuntimeConfig()
    try {
      const response = await $fetch(`${runtimeConfig.public.apiBase}/api/token/refresh/`, {
        method: 'POST',
        body: { refresh: localStorage.getItem('refresh_token') }
      })
      localStorage.setItem('access_token', response.access)
      return response.access
    } catch (error) {
      console.error('Token refresh failed:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigateTo('/login')
      throw error
    }
  }
  
  export function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigateTo('/login')
  }
  
  export function getAccessToken() {
    return localStorage.getItem('access_token')
  }