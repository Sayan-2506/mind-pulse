<template>
    <div>
      <h1>Welcome</h1>
      <button @click="fetchProfile">Get Profile</button>
      <p v-if="profile">Hello, {{ profile.email }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  const { $authFetch } = useNuxtApp()
  const profile = ref(null)
  const errorMessage = ref("")
  const runtimeConfig = useRuntimeConfig()
  
  async function fetchProfile() {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No token found')
  
      const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      profile.value = response
    } catch (error) {
      errorMessage.value = error.message || 'Failed to fetch profile'
    }
  }
  </script>