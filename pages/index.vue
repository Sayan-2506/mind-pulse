<template>
    <div v-if="isAuthenticated">
        <div>
            <div>
                <div class="grid grid-cols-4 h-[60px] px-6 py-4 w-full shadow-md">
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
                    <div class="flex items-center justify-center">
                        <UModal class="cursor-pointer" v-model:open="toDoOpen" title="Add Task">
                            <UButton label="Add task" color="neutral" variant="outline" />

                            <template #body>
                                <div class="flex flex-col gap-4 mb-4">
                                    <div>
                                        <label for="title"
                                            class="block mb-2 text-sm font-medium text-white">Title</label>
                                        <input v-model="newTask.title" type="text" class="form-style">
                                    </div>
                                    <div>
                                        <label for="status"
                                            class="block mb-2 text-sm font-medium text-white">Status</label>
                                        <select v-model="newTask.status" id="status" class="form-style">
                                            <option value="TO_DO">To Do</option>
                                            <option value="IN_PROGRESS">Doing</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="energy"
                                            class="block mb-2 text-sm font-medium text-white">Energy</label>
                                        <select v-model="newTask.priority" id="energy" class="form-style">
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <DatePicker v-model="newTask.due_date" class="custom-datepicker"
                                            inputId="over_label" showIcon iconDisplay="input" dateFormat="dd.mm.yy" />
                                    </div>
                                    <div>
                                        <label for="description"
                                            class="block mb-2 text-sm font-medium text-white">Description</label>
                                        <textarea v-model="newTask.description" id="description" rows="4"
                                            class="form-style" placeholder="Write description here"></textarea>
                                    </div>
                                </div>
                                <UButton label="Add task" color="neutral" @click="createTask" />
                            </template>
                        </UModal>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-3 gap-4 min-h-screen">
                    <div class="bg-gray-200">
                        <div class="flex items-center px-4 bg-[#2ED7D8] h-10 mb-4 text-white">
                            <h4 class="font-medium">To Do</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2 ">

                            <div v-for="task in tasks['TO_DO']" @click="modalBtnFunc(task)" class="task-style">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span :class="getPriorityClass(task.priority)"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-200">
                        <div class="flex items-center px-4 bg-blue-400 h-10 mb-4 text-white">
                            <h4 class="font-medium">In Progress</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2">

                            <div v-for="task in tasks['IN_PROGRESS']" @click="modalBtnFunc(task)" class="task-style">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span :class="getPriorityClass(task.priority)"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="bg-gray-200">
                        <div class="flex items-center px-4 bg-indigo-500 h-10 mb-4 text-white">
                            <h4 class="font-medium">Done</h4>
                        </div>
                        <div class="px-2.5 flex flex-col gap-2">

                            <div v-for="task in tasks['DONE']" @click="modalBtnFunc(task)" class="task-style">
                                <h4 class="text-black">{{ task.title }}</h4>
                                <div class="flex justify-between items-center text-xs">
                                    <span :class="getPriorityClass(task.priority)"
                                        class="rounded-full px-2 py-0.5 text-xs font-medium text-white">{{
                                            task.priority }}</span>
                                    <span class="text-gray-400">{{ task.due_date }}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <UModal v-model:open="modalBtn" :title="selectedTask.title" :ui="{ footer: 'justify-end' }">

                    <template #body>
                        <div class="p-5">
                            <div class="flex flex-col gap-4 mb-4">
                                <div>
                                    <label for="title" class="block mb-2 text-sm font-medium text-white">Title</label>
                                    <input v-model="selectedTask.title" type="text" class="form-style">
                                </div>
                                <div>
                                    <label for="status" class="block mb-2 text-sm font-medium text-white">Status</label>
                                    <select v-model="selectedTask.status" id="status" class="form-style">
                                        <option value="TO_DO">To Do</option>
                                        <option value="IN_PROGRESS">Doing</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="energy" class="block mb-2 text-sm font-medium text-white">Energy</label>
                                    <select v-model="selectedTask.priority" id="energy" class="form-style">
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <DatePicker v-model="selectedTask.due_date" class="custom-datepicker" showIcon
                                        iconDisplay="input" dateFormat="dd.mm.yy" />
                                </div>
                                <div>
                                    <label for="description" class="block mb-2 text-sm font-medium text-white">
                                        Description</label>
                                    <textarea v-model="selectedTask.description" id="description" rows="4"
                                        class="block p-2.5 w-full text-sm rounded-lg border bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Write description here"></textarea>
                                </div>
                            </div>
                            <div class="flex justify-start gap-2">
                                <UButton class="cursor-pointer" label="Cancel" color="neutral" variant="outline"
                                    @click="modalBtn = false" />
                                <UButton @click="updateTask" class="cursor-pointer" label="Save" color="neutral" />
                            </div>
                        </div>
                    </template>
                </UModal>
            </div>
        </div>
    </div>
</template>

<script setup>
import { refreshToken, getAccessToken, logout } from '~/utils/auth'
import DatePicker from 'primevue/datepicker';
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
const copySelectedTask = ref({})
const toDoOpen = ref(false)

const toast = useToast()

const modalBtn = ref(false)

function modalBtnFunc(task) {
    modalBtn.value = !modalBtn.value
    selectedTask.value = task
    copySelectedTask.value = { ...task }
}


// const debouncedFn = useDebounceFn(async () => {
//     await createTask()
// }, 1000)


const newTask = ref({
    title: '',
    description: '',
    due_date: new Date(),
    priority: '',
    status: ''
});

async function createTask() {
    try {
        toDoOpen.value = false
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
                due_date: newTask.value.due_date.toISOString().split('T')[0]
            }
        })
        newTask.title = ''
        newTask.priority = ''
        newTask.value.priority = '',
            newTask.value.status = '',
            newTask.due_date = new Date()

        await fetchTasks()
        toast.add({
            title: 'Success!',
            description: 'Task created!',
            color: 'success', // Опционально: цвет тоста
            icon: 'i-ph-check-circle-bold', // Опционально: иконка
            duration: 1500, // Время в миллисекундах, через которое тост исчезнет
            progress: false, // Опционально: показывать прогресс
        });
    } catch (error) {
        console.error('index.vue: Failed to create task:', error)
        toast.add({
            title: 'Error!',
            description: 'Failed to create task',
            color: 'error', // Опционально: цвет тоста
            icon: 'i-lucide-circle-alert', // Опционально: иконка
            timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
        });
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
        toast.add({
            title: 'Error!',
            description: 'Failed to load tasks',
            color: 'error', // Опционально: цвет тоста
            icon: 'i-lucide-circle-alert', // Опционально: иконка
            timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
        });
    } finally {
        isLoading.value = false
    }
}


async function updateTask() {
    const diff = {};
    const taskId = selectedTask.value.id
    // if (!taskId) {
    //     console.error('index.vue: Task ID is missing');
    //     return;
    // }
    for (const key in selectedTask.value) {
        if (selectedTask.value[key] !== copySelectedTask.value[key]) {
            diff[key] = selectedTask.value[key]
        }
    }

    if (Object.entries(diff).length) {
        try {
            const token = await getAccessToken()
            if (!token) {
                await navigateTo('/login', { redirectCode: 302 })
                return
            }
            await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/${taskId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    ...diff
                }
            })
            await fetchTasks() // Refresh tasks after update
            modalBtn.value = false
            toast.add({
                title: 'Success!',
                description: 'Task updated!',
                color: 'success', // Опционально: цвет тоста
                icon: 'i-ph-check-circle-bold', // Опционально: иконка
                duration: 1500, // Время в миллисекундах, через которое тост исчезнет
                progress: false, // Опционально: показывать прогресс
            });
        } catch (error) {
            console.error('index.vue: Failed to update task status:', error)
            notification.value = { message: 'Failed to update task', type: 'error' }
            setTimeout(() => notification.value = null, 3500)
        }
    }
}


function getPriorityClass(priority) {
    switch (priority) {
        case 'HIGH':
            return 'bg-red-500';
        case 'MEDIUM':
            return 'bg-yellow-500';
        case 'LOW':
            return 'bg-green-500';
        default:
            return '';
    }
}


onMounted(async () => {
    await fetchTasks()
})
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