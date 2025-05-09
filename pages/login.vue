<template>
    <div class="bg-white">
        <AuthHead title="Sign Up" link="/register" />
        <div class="pt-20 mx-auto w-[400px]">
            <h1 class="text-center text-[#3D474D] text-[34px] leading-[190%] font-bold">Log In</h1>

            <form @submit.prevent="submit" class="max-w-sm mx-auto">
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
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const runtimeConfig = useRuntimeConfig()

async function submit() {
  try {
    console.log('Sending login request:', { email: email.value, password: password.value })
    const response = await $fetch(`${runtimeConfig.public.apiBase}/api/token/`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    localStorage.setItem('access_token', response.access)
    localStorage.setItem('refresh_token', response.refresh)
    console.log('Login successful:', response)
    navigateTo('/')
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.data?.non_field_errors?.[0] || 
                        error.data?.email?.[0] || 
                        error.data?.password?.[0] || 
                        'Login failed'
  }
}
</script>