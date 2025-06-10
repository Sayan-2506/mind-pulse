<template>
    <div v-if="isAuthenticated">
        <div class="flex bg-[#F8FAFC] h-screen">
            <!-- sidebar -->
            <div class="w-[338px] p-8 flex flex-col overflow-y-scroll">
                <div class="flex flex-col justify-between h-full">
                    <div>
                        <div>
                            <div class="h-16 w-16">
                                <UAvatar v-if="profile.avatar" :src="`${runtimeConfig.public.apiBase}${profile.avatar}`"
                                    size="4xl" />
                                <USkeleton v-else class="h-16 w-16 rounded-full bg-gray-400" />
                            </div>
                            <div>
                                <h4 class="text-xl font-bold text-[#3D474D] mt-4">{{ profile.first_name }} {{
                                    profile.last_name
                                    }}
                                </h4>
                                <p class="text-sm text-[#6B7280]">{{ profile.email }}</p>
                                <USkeleton v-if="!profile.first_name" class="h-4 w-40 mt-4 bg-gray-400" />
                                <USkeleton v-if="!profile.first_name" class="h-3 w-24 mt-4 bg-gray-400" />
                            </div>
                        </div>

                        <!-- today main container -->
                        <div>
                            <p class="text-xs font-bold text-[#C2C2C5] mt-8 mb-4">Today</p>
                            <div class="ml-2 space-y-2">
                                <div v-for="note in todayEntries" class="p-2 rounded-lg">
                                    <h3 class="text-sm font-bold text-gray-600 truncate">
                                        {{ note.burden.substring(0, 50) }}
                                    </h3>
                                    <div class="leading-none truncate text-black">
                                        <span class="text-xs text-gray-600 mr-4">{{ new
                                            Date(note.created_at).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit', minute: '2-digit'
                                            })
                                            }}</span>
                                        <span v-if="note.burden.length > 50" class="text-xs text-gray-600"> {{
                                            note.burden.substring(50, 100) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /today main container -->
                        <!-- last main container -->
                        <div>
                            <p class="text-xs font-bold text-[#C2C2C5] mt-8 mb-4">Last day</p>
                            <div class="ml-2 space-y-2">
                                <div v-for="note in earlierEntries" class="p-2 rounded-lg">
                                    <h3 class="text-sm font-bold text-gray-600 truncate">
                                        {{ note.burden.substring(0, 50) }}
                                    </h3>
                                    <div class="leading-none truncate text-black">
                                        <span class="text-xs text-gray-600 mr-4">{{ new
                                            Date(note.date).toLocaleDateString('ru-RU',
                                                {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })

                                        }}</span>
                                        <span v-if="note.burden.length > 50" class="text-xs text-gray-600"> {{
                                            note.burden.substring(50, 100) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /last main container -->
                    </div>
                    <div class="flex flex-col gap-2">
                        <nuxt-link to="/">
                            <UButton class="w-full cursor-pointer" color="secondary" variant="outline">Main</UButton>
                        </nuxt-link>
                        <UButton @click="logout" class="cursor-pointer" color="error" variant="outline">Logout</UButton>
                    </div>
                </div>
            </div>

            <!-- /sidebar -->
            <!-- note container -->
            <div class="w-full flex flex-col overflow-auto">
                <div class="flex justify-between items-start w-full p-8">
                    <StatsChart :entries="dailyEntries" />
                    <div v-if="!dailyEntries[0]" class="w-full h-64">
                        <USkeleton class="w-full h-full bg-gray-400" />
                    </div>
                </div>
                <div class="mx-auto px-8">
                    <div class="flex flex-wrap gap-3 mb-2">
                        <div>
                            <label for="wins" class="block mb-2 text-sm font-medium text-[#8A9499]">Wins</label>
                            <textarea v-model="newWeekly.wins" name="wins" id="wins"
                                class="text-[#3D474D] overflow-y-auto no-scrollbar my-4 font-playfair bg-transparent focus:outline-none resize-none flex-grow border-1 border-[#dce2e6] rounded-lg p-3.5 w-[360px] h-[150px]">
                    </textarea>
                        </div>
                        <div>
                            <label for="exhaustion"
                                class="block mb-2 text-sm font-medium text-[#8A9499]">Exhaustion</label>
                            <textarea v-model="newWeekly.exhaustion" name="exhaustion" id="exhaustion"
                                class="text-[#3D474D] my-4 font-playfair bg-transparent focus:outline-none resize-none flex-grow border-1 border-[#dce2e6] rounded-lg p-3.5 w-[360px] h-[150px]">
                    </textarea>
                        </div>
                        <div>
                            <label for="improvements"
                                class="block mb-2 text-sm font-medium text-[#8A9499]">Improvements</label>
                            <textarea v-model="newWeekly.improvements" name="improvements" id="improvements"
                                class="text-[#3D474D] my-4 font-playfair bg-transparent focus:outline-none resize-none flex-grow border-1 border-[#dce2e6] rounded-lg p-3.5 w-[360px] h-[150px]">
                    </textarea>
                        </div>
                    </div>
                    <UButton class="cursor-pointer" @click="fetchAddWeekly" label="Save" color="info" size="md" />
                </div>

                <div class="px-8 mt-8">
                    <h3 class="text-lg font-bold text-[#3D474D] mb-4">Weekly reflections</h3>
                    <div v-if="!weeklyReflections[0]" v-for="n in 2" :key="n"
                        class="bg-white p-4 rounded-lg shadow mb-4 flex flex-col w-full max-w-[600px]">
                        <USkeleton class="h-4 w-40 mb-2 bg-gray-400" />
                        <USkeleton class="h-4 w-full mb-2 bg-gray-400" />
                        <USkeleton class="h-4 w-4/5 mb-2 bg-gray-400" />
                        <USkeleton class="h-4 w-3/4 bg-gray-400" />
                    </div>
                    <div v-for="reflection in weeklyReflections" :key="reflection.id"
                        class="bg-white p-4 rounded-lg shadow mb-4 flex flex-col w-full max-w-[600px]">
                        <p class="text-sm text-[#6B7280] mb-2">{{ reflection.week_start }}</p>
                        <p class="text-base text-[#3D474D] mb-2"><strong>Wins:</strong> {{ reflection.wins }}</p>
                        <p class="text-base text-[#3D474D] mb-2"><strong>Exhaustion:</strong> {{ reflection.exhaustion
                            }}
                        </p>
                        <p class="text-base text-[#3D474D]"><strong>Improvements:</strong> {{ reflection.improvements }}
                        </p>
                    </div>
                </div>
            </div>
            <!-- /note container -->
        </div>
    </div>
</template>

<script setup>
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns'
import { logout } from '~/utils/auth'

definePageMeta({
    middleware: ['auth']
})

const { $authFetch } = useNuxtApp()
const isAuthenticated = ref(false)
const runtimeConfig = useRuntimeConfig()
const profile = ref({})
const dailyEntries = ref([])
const todayEntries = ref([])
const earlierEntries = ref([])
const weeklyReflections = ref([])
const newWeekly = ref({
    wins: '',
    exhaustion: '',
    improvements: '',
});
const isLoading = ref(false)
const toast = useToast()
const errorMessage = ref("")


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
    }
}

async function fetchDailyEntries() {
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }

        const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/daily-entries/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // 👇 получаем начало и конец текущей недели (понедельник – воскресенье)
        const now = new Date()
        const weekStart = startOfWeek(now, { weekStartsOn: 1 })  // понедельник
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 })      // воскресенье

        // 👇 фильтрация записей
        dailyEntries.value = response.filter(entry => {
            const entryDate = parseISO(entry.date)
            return isWithinInterval(entryDate, { start: weekStart, end: weekEnd })
        })

        todayEntries.value = response.filter(entry => {
            const entryDate = new Date(entry.created_at).toDateString()
            const todayDate = new Date().toDateString()
            return entryDate === todayDate
        })

        const yesterdayDate = new Date()
        yesterdayDate.setHours(0, 0, 0, 0)  // ставим на начало дня, чтобы сравнение было точным
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)

        earlierEntries.value = response.filter(note => {
            const noteDate = new Date(note.created_at)
            return noteDate < yesterdayDate && noteDate.toDateString() !== yesterdayDate.toDateString()
        })


        console.log('dailyEntries', earlierEntries)
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: 'Failed to load energy',
            color: 'error',
            icon: 'i-lucide-circle-alert',
            timeout: 3000,
        });
    }
}

async function fetchWeeklyReflections() {
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }

        const response = await $authFetch(`${runtimeConfig.public.apiBase}/api/weekly-reflections/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        weeklyReflections.value = response
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: 'Failed to load weekly reflections',
            color: 'error',
            icon: 'i-lucide-circle-alert',
            timeout: 3000,
        });
    }
}

async function fetchAddWeekly() {
    isLoading.value = true
    try {
        const token = await getAccessToken()
        if (!token) {
            await navigateTo('/login', { redirectCode: 302 })
            return
        }
        const now = new Date()
        const weekStart = startOfWeek(now, { weekStartsOn: 1 })  // понедельник

        await $authFetch(`${runtimeConfig.public.apiBase}/api/weekly-reflections/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                wins: newWeekly.value.wins,
                exhaustion: newWeekly.value.exhaustion,
                improvements: newWeekly.value.improvements,
                week_start: weekStart.toISOString().split('T')[0],
            }
        })

        newWeekly.value.wins = '',
            newWeekly.value.exhaustion = '',
            newWeekly.value.improvements = '',
            newWeekly.value.week_start = new Date(),

            await fetchWeeklyReflections()
        toast.add({
            title: 'Success!',
            description: 'Saved!',
            color: 'success', // Опционально: цвет тоста
            icon: 'i-ph-check-circle-bold', // Опционально: иконка
            duration: 1500, // Время в миллисекундах, через которое тост исчезнет
            progress: false, // Опционально: показывать прогресс
        });
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: 'Failed to saved',
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

onMounted(async () => {
    await Promise.all([fetchProfile(), fetchDailyEntries(), fetchWeeklyReflections()])
})
</script>