import { jwtDecode } from 'jwt-decode'

export async function refreshToken() {
  const runtimeConfig = useRuntimeConfig()
  const refreshTokenCookie = useCookie('refresh_token')
  if (!refreshTokenCookie.value) {
    throw new Error('No refresh token available')
  }

  const response = await $fetch(`${runtimeConfig.public.apiBase}/api/token/refresh/`, {
    method: 'POST',
    body: { refresh: refreshTokenCookie.value }
  })

  const accessToken = useCookie('access_token', {
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  accessToken.value = response.access
  return response.access
}

export async function getAccessToken() {
  const accessTokenCookie = useCookie('access_token')
  if (!accessTokenCookie.value) {
    try {
      return await refreshToken()
    } catch (error) {
      console.error('auth.js: Failed to refresh token:', error)
      throw new Error('Unable to obtain access token')
    }
  }

  try {
    const decoded = jwtDecode(accessTokenCookie.value)
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp < now) {
      return await refreshToken()
    }
    return accessTokenCookie.value
  } catch (error) {
    console.error('auth.js: Invalid access token:', error)
    return await refreshToken()
  }
}

export async function logout() {
  const accessToken = useCookie('access_token')
  const refreshToken = useCookie('refresh_token')
  accessToken.value = null
  refreshToken.value = null
  const router = useRouter()
  await router.push('/login')
}