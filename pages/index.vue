<template>
    <div v-if="isAuthenticated">
        <UModal class="cursor-pointer" v-model:open="quest" title="What's weighing on you?">
            <template #body>
                <div class="flex flex-col gap-4 mb-4">
                    <div>
                        <textarea v-model="newQuest.burden" id="description" rows="4" class="form-style"
                            placeholder="Write burden here"></textarea>
                    </div>
                    <div>
                        <label for="energy" class="block mb-2 text-sm font-medium text-white">Energy check</label>
                        <input type="number" v-model="newQuest.energy" id="energy" class="form-style"
                            placeholder="Enter your energy level (1-10)" min="1" max="10" />
                    </div>
                </div>
                <UButton label="Save" color="neutral" @click="createQuest" />
            </template>
        </UModal>
        <div>
            <div>
                <div class="flex justify-between items-center h-[60px] px-6 py-4 w-full shadow-md">
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
                                        <select v-model="newTask.energy" id="energy" class="form-style">
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="priority"
                                            class="block mb-2 text-sm font-medium text-white">Priority</label>
                                        <select v-model="newTask.priority" id="priority" class="form-style">
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input v-model="selectedTask.due_date" type="date" class="form-style">
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
                        <button type="button" class="p-2.5 group rounded-full cursor-pointer">
                            <nuxt-link to="/profile">
                                <UAvatar :src="`${runtimeConfig.public.apiBase}${profile.avatar}`" />
                            </nuxt-link>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-3 gap-4 h-screen">
                    <div class="bg-gray-200 rounded-lg">
                        <div class="flex items-center px-4 bg-[#2ED7D8] h-10 mb-4 text-white rounded-t-lg">
                            <h4 class="font-medium">To Do</h4>
                        </div>
                        <Draggable v-model="tasks.TO_DO" group="tasks" item-key="id" tag="div" data-status="TO_DO"
                            @end="onDragEnd" class="px-2.5 flex flex-col gap-2 min-h-[200px] h-full" :animation="300">
                            <template #item="{ element: task }">
                                <div class="task-style cursor-pointer" @click.stop="modalBtnFunc(task)">
                                    <h4 class="text-black">{{ task.title }}</h4>
                                    <div class="flex justify-between items-center text-xs"><span
                                            :class="[getPriorityClass(task.priority), 'rounded-full px-2 py-0.5 text-xs font-medium text-white']">{{
                                                task.priority }}</span><span class="text-gray-400">{{ task.due_date
                                            }}</span></div>
                                </div>
                            </template>
                        </Draggable>
                        <div v-if="!tasks.TO_DO.length" class="text-gray-500 text-center py-4">Нет задач</div>
                    </div>
                    <div class="bg-gray-200 rounded-lg">
                        <div class="flex items-center px-4 bg-blue-400 h-10 mb-4 text-white rounded-t-lg">
                            <h4 class="font-medium">In Progress</h4>
                        </div>
                        <Draggable v-model="tasks.IN_PROGRESS" group="tasks" item-key="id" tag="div"
                            data-status="IN_PROGRESS" @end="onDragEnd"
                            class="px-2.5 flex flex-col gap-2 min-h-[200px] h-full" :animation="300"><template
                                #item="{ element: task }">
                                <div class="task-style cursor-pointer" @click.stop="modalBtnFunc(task)">
                                    <h4 class="text-black">{{ task.title }}</h4>
                                    <div class="flex justify-between items-center text-xs"><span
                                            :class="[getPriorityClass(task.priority), 'rounded-full px-2 py-0.5 text-xs font-medium text-white']">{{
                                                task.priority }}</span><span class="text-gray-400">{{ task.due_date
                                            }}</span></div>
                                </div>
                            </template>
                        </Draggable>
                        <div v-if="!tasks.IN_PROGRESS.length" class="text-gray-500 text-center py-4">Нет задач</div>
                    </div>
                    <div class="bg-gray-200 rounded-lg">
                        <div class="flex items-center px-4 bg-indigo-500 h-10 mb-4 text-white rounded-t-lg">
                            <h4 class="font-medium">Done</h4>
                        </div>
                        <Draggable v-model="tasks.DONE" group="tasks" item-key="id" tag="div" data-status="DONE"
                            @end="onDragEnd" class="px-2.5 flex flex-col gap-2 min-h-[200px] h-full" :animation="300">
                            <template #item="{ element: task }">
                                <div class="task-style cursor-pointer" @click.stop="modalBtnFunc(task)">
                                    <h4 class="text-black">{{ task.title }}</h4>
                                    <div class="flex justify-between items-center text-xs"><span
                                            :class="[getPriorityClass(task.priority), 'rounded-full px-2 py-0.5 text-xs font-medium text-white']">{{
                                                task.priority }}</span><span class="text-gray-400">{{ task.due_date
                                            }}</span></div>
                                </div>
                            </template>
                        </Draggable>
                        <div v-if="!tasks.DONE.length" class="text-gray-500 text-center py-4">Нет задач</div>
                    </div>
                </div>

                <UModal v-model:open="modalBtn" :ui="{ footer: 'justify-end' }">
                    <template #header>
                        <div class="flex items-center justify-between w-full">
                            <h3 class="text-lg font-semibold text-white">{{ selectedTask.title }}</h3>
                            <div class="flex gap-1">
                                <UButton @click="confirmDeleteTask" class="cursor-pointer" icon="i-lucide-trash"
                                    size="xs" color="error" variant="ghost" />
                                <UButton class="cursor-pointer" icon="i-lucide-x" size="xs" color="neutral"
                                    variant="ghost" @click="modalBtn = false" />
                            </div>
                        </div>
                    </template>
                    <template #body>
                        <div>
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
                                    <select v-model="selectedTask.energy" id="energy" class="form-style">
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="priority"
                                        class="block mb-2 text-sm font-medium text-white">Priority</label>
                                    <select v-model="selectedTask.priority" id="priority" class="form-style">
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <input v-model="selectedTask.due_date" type="date" class="form-style">
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
                <template>
                    <UModal v-model:open="showDeleteDialog" title="Are you sure?" :ui="{ footer: 'justify-end' }">
                        <UButton color="neutral" variant="subtle" label="Open" />

                        <template #footer>
                            <UButton class="cursor-pointer" label="Close" color="neutral" variant="outline"
                                @click="showDeleteDialog = false" />
                            <UButton class="cursor-pointer" label="Delete" color="error" variant="outline"
                                @click="deleteTask" />
                        </template>
                    </UModal>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { refreshToken, getAccessToken, logout } from '~/utils/auth'
import Draggable from 'vuedraggable'

definePageMeta({
    middleware: ['auth']
})


const quest = ref(false)
const { $authFetch } = useNuxtApp()
const profile = ref({})
const errorMessage = ref("")
const isLoading = ref(false)
const isAuthenticated = ref(false)
const runtimeConfig = useRuntimeConfig()
const tasks = ref({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: []
})
const selectedTask = ref({})
const copySelectedTask = ref({})
const toDoOpen = ref(false)
const showDeleteDialog = ref(false)

const toast = useToast()

const modalBtn = ref(false)

function modalBtnFunc(task) {
    modalBtn.value = !modalBtn.value
    selectedTask.value = task
    copySelectedTask.value = { ...task }
}

const newTask = ref({
    title: '',
    description: '',
    due_date: new Date(),
    priority: '',
    energy: '',
    status: ''
});

const newQuest = ref({
    burden: '',
    created_at: new Date(),
    energy: '',
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
                energy: newTask.value.energy,
                status: newTask.value.status,
                due_date: newTask.value.due_date
                

            }
        })

        newTask.value.title = ''
        newTask.value.priority = ''
        newTask.value.priority = '',
            newTask.value.energy = '',
            newTask.value.status = '',
            newTask.value.due_date = new Date()

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
        const token = await getAccessToken()
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
        console.error('index.vue: Fetch profile error:', error)
        errorMessage.value = error.data?.detail || error.message || 'Не удалось загрузить профиль'
        toast.error(errorMessage.value, {
            icon: 'i-lucide-circle-alert',
            timeout: 3000
        })
        if (error.response?.status === 401) {
            try {
                const newToken = await refreshToken()

                const headers = {
                    Authorization: `Bearer ${newToken.trim()}`
                }

                const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/profile/`, {
                    method: 'GET',
                    headers
                })
                profile.value = response
            } catch (refreshError) {
                console.error('index.vue: Refresh token error:', refreshError)
                errorMessage.value = 'Сессия истекла. Пожалуйста, войдите снова.'
                toast.error(errorMessage.value, {
                    icon: 'i-lucide-circle-alert',
                    timeout: 3000
                })
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


async function updateTaskStatus(id, newStatus) {
    isLoading.value = true
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }
        await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/${id}/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: { status: newStatus }
        })
        await fetchTasks()
        toast.add({
            title: 'Success!',
            description: 'Task status updated!',
            color: 'success',
            icon: 'i-ph-check-circle-bold',
            duration: 1500
        })
    } catch (error) {
        console.error('index.vue: Update task status error:', error)
        toast.add({
            title: 'Error!',
            description: error.message || 'Failed to update task status',
            color: 'error',
            icon: 'i-lucide-circle-alert',
            timeout: 3000
        })
        await fetchTasks()
    } finally {
        isLoading.value = false
    }
}


function onDragEnd(event) {
    if (event.from.dataset?.status != event.to.dataset?.status) {
        const id = event.item.__draggable_context.element.id
        const newStatus = event.to.dataset?.status
        updateTaskStatus(id, newStatus)
    }
}

async function deleteTask() {
    isLoading.value = true
    const taskId = selectedTask.value.id
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }
        await $authFetch(`${runtimeConfig.public.apiBase}/api/tasks/${taskId}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        await fetchTasks() // Refresh tasks after update
        showDeleteDialog.value = false
        modalBtn.value = false
        toast.add({
            title: 'Success!',
            description: 'Task deleted!',
            color: 'success', // Опционально: цвет тоста
            icon: 'i-ph-check-circle-bold', // Опционально: иконка
            duration: 1500, // Время в миллисекундах, через которое тост исчезнет
            progress: false, // Опционально: показывать прогресс
        });
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: error,
            color: 'error', // Опционально: цвет тоста
            icon: 'i-lucide-circle-alert', // Опционально: иконка
            timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
        });
    } finally {
        isLoading.value = false
    }
}

function confirmDeleteTask(task) {
    showDeleteDialog.value = true
}

async function updateTask() {
    const diff = {};
    const taskId = selectedTask.value.id

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
            toast.add({
                title: 'Error!',
                description: error,
                color: 'error', // Опционально: цвет тоста
                icon: 'i-lucide-circle-alert', // Опционально: иконка
                timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
            });
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


async function createQuest() {
    try {
        quest.value = false
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }
        await $authFetch(`${runtimeConfig.public.apiBase}/api/daily-entries/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                burden: newQuest.value.burden,
                energy: newQuest.value.energy,
                created_at: new Date(),
                date: new Date().toISOString().split('T')[0],
            }
        })

        localStorage.setItem('hasSeenModal', 'true')
        newQuest.value.priority = ''
        newQuest.value.energy = '',
        newQuest.value.created_at = new Date()

        toast.add({
            title: 'Success!',
            description: 'Weighing  save!',
            color: 'success', // Опционально: цвет тоста
            icon: 'i-ph-check-circle-bold', // Опционально: иконка
            duration: 1500, // Время в миллисекундах, через которое тост исчезнет
            progress: false, // Опционально: показывать прогресс
        });
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: 'Failed to weighing save',
            color: 'error', // Опционально: цвет тоста
            icon: 'i-lucide-circle-alert', // Опционально: иконка
            timeout: 3000, // Время в миллисекундах, через которое тост исчезнет
        });
    }
}

onMounted(async () => {
    const hasSeenModal = localStorage.getItem('hasSeenModal')
    if (!hasSeenModal) {
        quest.value = true
    }
    await fetchTasks()
    await fetchProfile()
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