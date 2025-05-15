<template>
    <div class="bg-white h-screen">
        <AuthHead title="Sign Up" link="/register" />
        <div v-if="isLoading" class="flex items-end justify-center h-64">
            <ProgressSpinner aria-label="Loading" />
        </div>
        <div v-else-if="!isLoading" class="pt-20 mx-auto w-[280px]">
            <h1 class="text-center text-[#3D474D] text-[34px] leading-[190%] font-bold">Log In</h1>

            <form @submit.prevent="login" class="max-w-sm mx-auto">
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your
                        email</label>
                    <input v-model="email" type="email" id="email"
                        class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="name@flowbite.com" required />
                </div>
                <div class="mb-5">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Your
                        password</label>
                    <input v-model="password" type="password" id="password"
                        class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required />
                </div>
                <button type="submit"
                    class="cursor-pointer text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>
            </form>
            <Notification v-if="notification" :message="notification.message" :type="notification.type"
                :duration="300000" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Notification from '~/components/Notification.vue'
import ProgressSpinner from 'primevue/progressspinner'
import FloatLabel from 'primevue/floatlabel'

const runtimeConfig = useRuntimeConfig()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const notification = ref(null)

async function login() {
  isLoading.value = true
  notification.value = null
  try {
    const response = await $fetch(`${runtimeConfig.public.apiBase}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { email: email.value, password: password.value },
    })
    console.log('login.vue: Response:', response)
    
    if (!response.access || !response.refresh) {
      throw new Error('Invalid token response')
    }

    const accessToken = useCookie('access_token', {
      maxAge: 60 * 60,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    const refreshToken = useCookie('refresh_token', {
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    accessToken.value = response.access
    refreshToken.value = response.refresh
    
    notification.value = { message: 'Login successful!', type: 'success' }
    await new Promise(resolve => setTimeout(resolve, 1000))
    await navigateTo('/', { replace: true })
  } catch (error) {
    let errorMessage = 'Login failed. Please check your credentials.'
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'Invalid email or password format.'
      } else if (error.response.status === 401) {
        errorMessage = 'Incorrect email or password.'
      } else {
        errorMessage = `Server error: ${error.response.statusText || error.message}`
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your network connection.'
    } else {
      errorMessage = `Error: ${error.message}`
    }
    notification.value = { message: errorMessage, type: 'error' }
    setTimeout(() => notification.value = null, 3500)
  } finally {
    isLoading.value = false
  }
}
</script>