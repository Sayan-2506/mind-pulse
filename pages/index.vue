<template>
    <div v-if="isAuthenticated">
        <div>
            <div>
                <div class="grid grid-cols-3 h-[60px] px-6 py-4 w-full shadow-md">
                    <div class="flex items-center justify-center">
                        <h4 class="font-semibold">
                            Dashboard
                        </h4>
                    </div>
                    <div class="flex justify-between items-center mx-auto gap-5">
                        <button class="cursor-pointer">Analytics</button>
                        <button class="cursor-pointer">Weekly Reflection</button>
                    </div>
                    <div class="flex items-center justify-center">
                        <button type="button" class="p-2.5 group rounded-full cursor-pointer">
                            <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 20 18">
                                <path
                                    d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                            </svg>
                            <span class="sr-only">Show participants</span>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-200 h-screen">
                        <div class="flex items-center px-4 bg-[#2ED7D8] h-10 mb-4 text-white">
                            <h4 class="font-medium">To Do</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2 ">

                            <div v-for="task in tasks['TO_DO']" @click="modalBtnFunc(task)"
                                class="cursor-pointer px-5 py-4 flex flex-col justify-items-end justify-between h-24 shadow-md rounded-lg bg-white">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span
                                        :class="{ 'bg-red-500': task.priority === 'HIGH', 'bg-yellow-500': task.priority === 'MEDIUM', 'bg-green-500': task.priority === 'LOW' }"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>
                            <div v-focustrap v-if="toDoOpen" class="shadow-md rounded-lg bg-white">
                                <Textarea @input="
                                    () => {
                                        debouncedFn()
                                    }
                                " autofocus v-model="newTask.title" class="create-textarea" autoResize rows="1" />
                            </div>
                            <div @click="toDoOpenFunc" v-else="!toDoOpen"
                                class="px-2 py-2 cursor-pointer text-[13px] w-[146px] rounded-lg bg-white m-auto text-center">
                                <button class="cursor-pointer rounded-full font-medium text-black">Add Task</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-200 h-screen">
                        <div class="flex items-center px-4 bg-blue-400 h-10 mb-4 text-white">
                            <h4 class="font-medium">In Progress</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2">

                            <div v-for="task in tasks['IN_PROGRESS']" @click="modalBtnFunc(task)"
                                class="cursor-pointer px-5 py-4 flex flex-col justify-items-end justify-between h-24 shadow-md rounded-lg bg-white">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span
                                        :class="{ 'bg-red-500': task.priority === 'HIGH', 'bg-yellow-500': task.priority === 'MEDIUM', 'bg-green-500': task.priority === 'LOW' }"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="bg-gray-200 h-screen">
                        <div class="flex items-center px-4 bg-indigo-500 h-10 mb-4 text-white">
                            <h4 class="font-medium">Done</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2">

                            <div v-for="task in tasks['DONE']" @click="modalBtnFunc(task)"
                                class="cursor-pointer px-5 py-4 flex flex-col justify-items-end justify-between h-24 shadow-md rounded-lg bg-white">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span
                                        :class="{ 'bg-red-500': task.priority === 'HIGH', 'bg-yellow-500': task.priority === 'MEDIUM', 'bg-green-500': task.priority === 'LOW' }"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div v-if="modalBtn"
                    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center min-h-screen">
                    <div  class="p-4 w-[500px] max-h-full">
                        <!-- Modal content -->
                        <div class="relative rounded-lg shadow-sm bg-gray-700">
                            <!-- Modal header -->
                            <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-600">
                                <h3 class="text-lg font-semibold text-white">
                                    {{ selectedTask.title }}
                                </h3>
                                <button @click="modalBtnFunc" type="button"
                                    class="cursor-pointer text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <!-- Modal body -->
                            <form class="p-5">
                                <div class="flex flex-col gap-4 mb-4">
                                    <div>
                                        <label for="status"
                                            class="block mb-2 text-sm font-medium text-white">Status</label>
                                        <select v-model="selectedTask.status" id="status"
                                            class="border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500">
                                            <option value="TO_DO">To Do</option>
                                            <option value="IN_PROGRESS">Doing</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="energy"
                                            class="block mb-2 text-sm font-medium text-white">Energy</label>
                                        <select v-model="selectedTask.priority" id="energy"
                                            class="border  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500">
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <DatePicker v-model="selectedTask.due_date" class="custom-datepicker"
                                            inputId="over_label" showIcon iconDisplay="input" />
                                    </div>
                                    <div>
                                        <label for="description" class="block mb-2 text-sm font-medium text-white">
                                            Description</label>
                                        <textarea v-model="selectedTask.description" id="description" rows="4"
                                            class="block p-2.5 w-full text-sm rounded-lg border bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Write description here"></textarea>
                                    </div>
                                </div>
                                <button type="submit"
                                    class="cursor-pointer text-white inline-flex items-center hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600">
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { refreshToken, getAccessToken, logout } from '~/utils/auth'
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import FocusTrap from 'primevue/focustrap';
import { useDebounceFn } from '@vueuse/core'


definePageMeta({
    middleware: ['auth']
})

const { $authFetch } = useNuxtApp()
const profile = ref(null)
const errorMessage = ref("")
const isLoading = ref(false)
const isAuthenticated = ref(false)
const runtimeConfig = useRuntimeConfig()
const tasks = ref([])
const selectedTask = ref({})
const toDoOpen = ref(false)


const modalBtn = ref(false)

function modalBtnFunc(task) {
    modalBtn.value = !modalBtn.value
    selectedTask.value = task
}

function toDoOpenFunc() {
    toDoOpen.value = !toDoOpen.value
}

const debouncedFn = useDebounceFn(async () => {
    await createTask()
}, 1000)

const newTask = ref({ title: '', description: '', priority: 'MEDIUM', status: 'TO_DO' })

async function createTask() {
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }
        await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                title: newTask.value.title,
                description: newTask.value.description,
                priority: newTask.value.priority,
                status: newTask.value.status,
                due_date:"2025-05-20"
            }
        })
        newTask.title = ''
        newTask.priority = 'MEDIUM'
        await fetchTasks()
        notification.value = { message: 'Task created!', type: 'success' }
        setTimeout(() => notification.value = null, 3500)
    } catch (error) {
        console.error('index.vue: Failed to create task:', error)
        notification.value = { message: 'Failed to create task', type: 'error' }
        setTimeout(() => notification.value = null, 3500)
    }
}

if (process.client) {
    const token = getAccessToken()
    if (!token) {
        await navigateTo('/login', { redirectCode: 302 })
    } else {
        isAuthenticated.value = true
    }
}


async function fetchProfile() {
    isLoading.value = true
    try {
        const token = getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }

        const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        profile.value = response
    } catch (error) {
        errorMessage.value = error.message || 'Failed to fetch profile'
        if (error.status === 401) {
            try {
                const newToken = await refreshToken()
                const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${newToken}`
                    }
                })
                profile.value = response
            } catch (refreshError) {
                errorMessage.value = 'Session expired. Please log in again.'
                await navigateTo('/login', { redirectCode: 302 })
            }
        }
    } finally {
        isLoading.value = false
    }
}


async function fetchTasks() {
    isLoading.value = true
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }

        const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        tasks.value = {
            TO_DO: response.filter(task => task.status === 'TO_DO'),
            IN_PROGRESS: response.filter(task => task.status === 'IN_PROGRESS'),
            DONE: response.filter(task => task.status === 'DONE')
        }
    } catch (error) {
        console.error('index.vue: Failed to fetch tasks:', error)
        notification.value = { message: 'Failed to load tasks', type: 'error' }
        setTimeout(() => notification.value = null, 3500)
    } finally {
        isLoading.value = false
    }
}


onMounted(async () => {
    await fetchTasks()
    document.addEventListener('click', (event) => {
        if (modalBtn.value) {
            modalBtn.value = !modalBtn.value
            console.log(modalBtn.value, 'rrr')
        }
    })
})

// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside)
// })
</script>

<style>
.custom-datepicker .p-inputtext {
    background-color: #4a5565;
}

.p-textarea.create-textarea {
    width: 100%;
    background: transparent;
    height: 100%;
    outline: none;
    border: none;
    color: black;
}

/* Стили для панели */
</style>