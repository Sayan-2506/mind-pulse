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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'


const runtimeConfig = useRuntimeConfig()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const toast = useToast()

async function login() {
  isLoading.value = true
  try {
    const response = await $fetch(`${runtimeConfig.public.apiBase}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { email: email.value, password: password.value },
    })

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

    toast.add({
      title: 'Success!',
      description: 'Login successful!',
      color: 'success', // Опционально: цвет тоста
      icon: 'i-ph-check-circle-bold', // Опционально: иконка
      duration: 1500, // Время в миллисекундах, через которое тост исчезнет
      progress: false, // Опционально: показывать прогресс
    });
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
    toast.add({
      title: 'Error!',
      description: errorMessage,
      color: 'error', // Опционально: цвет тоста
      icon: 'i-lucide-circle-alert', // Опционально: иконка
      timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
    });
  } finally {
    isLoading.value = false
  }
}
</script>