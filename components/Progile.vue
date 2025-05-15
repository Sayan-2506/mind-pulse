<script setup>
import { ref, onMounted } from 'vue'
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import Notification from '~/components/Notification.vue'
import ProgressSpinner from 'primevue/progressspinner'

definePageMeta({
  middleware: ['auth']
})

const { $authFetch } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const profile = ref(null)
const tasks = ref([])
const isLoading = ref(false)
const notification = ref(null)
const modalBtn = ref(false)
const editedProfile = ref({ email: '', createdAt: null })

async function fetchProfile() {
  isLoading.value = true
  try {
    const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
      method: 'GET'
    })
    profile.value = response
    editedProfile.value = { email: response.email, createdAt: new Date(response.createdAt) }
  } catch (error) {
    console.error('profile.vue: Failed to fetch profile:', error)
    notification.value = { message: 'Failed to load profile', type: 'error' }
    setTimeout(() => notification.value = null, 3500)
  } finally {
    isLoading.value = false
  }
}

async function fetchTasks() {
  isLoading.value = true
  try {
    const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/`, {
      method: 'GET'
    })
    tasks.value = response
    console.log('Fetched tasks:', tasks.value)
  } catch (error) {
    console.error('profile.vue: Failed to fetch tasks:', error)
    notification.value = { message: 'Failed to load tasks', type: 'error' }
    setTimeout(() => notification.value = null, 3500)
  } finally {
    isLoading.value = false
  }
}

async function updateProfile() {
  isLoading.value = true
  try {
    await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
      method: 'PATCH',
      body: {
        email: editedProfile.value.email
        // Add other fields if supported by your API
      }
    })
    await fetchProfile()
    modalBtn.value = false
    notification.value = { message: 'Profile updated successfully', type: 'success' }
    setTimeout(() => notification.value = null, 3500)
  } catch (error) {
    console.error('profile.vue: Failed to update profile:', error)
    notification.value = { message: 'Failed to update profile', type: 'error' }
    setTimeout(() => notification.value = null, 3500)
  } finally {
    isLoading.value = false
  }
}

function modalBtnFunc() {
  modalBtn.value = !modalBtn.value
  if (modalBtn.value && profile.value) {
    editedProfile.value = { email: profile.value.email, createdAt: new Date(profile.value.createdAt) }
  }
}

onMounted(() => {
  fetchProfile()
  fetchTasks()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>
    <ProgressSpinner v-if="isLoading" class="w-12 h-12 mx-auto" />
    <Notification v-if="notification" :message="notification.message" :type="notification.type" />

    <!-- Profile Info -->
    <div v-if="profile" class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-lg font-semibold">User Information</h2>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Joined:</strong> {{ new Date(profile.createdAt).toLocaleDateString() }}</p>
      <button
        @click="modalBtnFunc"
        class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Edit Profile
      </button>
    </div>

    <!-- Tasks List -->
    <div v-if="tasks.length" class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Your Tasks</h2>
      <ul>
        <li v-for="task in tasks" :key="task.id" class="border-b py-2">
          <h3 class="font-medium">{{ task.title }}</h3>
          <p class="text-sm text-gray-600">{{ task.description }}</p>
          <p class="text-sm">Status: {{ task.status.replace('_', ' ') }}</p>
          <p class="text-sm">Priority: {{ task.priority }}</p>
          <p v-if="task.due_date" class="text-sm">Due: {{ task.due_date }}</p>
        </li>
      </ul>
    </div>

    <!-- Edit Profile Modal -->
    <div
      v-if="modalBtn"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <FloatLabel>
            <input
              v-model="editedProfile.email"
              type="email"
              class="border p-2 w-full"
              required
            />
            <label>Email</label>
          </FloatLabel>
          <FloatLabel class="mt-4">
            <DatePicker
              v-model="editedProfile.createdAt"
              disabled
              class="w-full"
            />
            <label>Joined Date (Read-only)</label>
          </FloatLabel>
          <div class="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              @click="modalBtnFunc"
              class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS is used, so no additional CSS needed unless custom styles are required */
</style>