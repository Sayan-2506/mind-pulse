<!-- components/StatsChart.vue -->
<template>
  <div class="w-full h-64">
    <VChart :option="chartOptions" autoresize class="w-full h-full" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'

// 👇 Получаем пропсы
const props = defineProps({
  entries: {
    type: Array,
    required: true
  }
})

// 👇 Формируем опции для графика на основе entries
const chartOptions = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const energyByDay = new Array(7).fill(null)

  props.entries.forEach(entry => {
    const date = parseISO(entry.date)
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1 // понедельник = 0
    energyByDay[dayIndex] = entry.energy
  })

  return {
    title: { text: "This week status analytics" },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: days
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Energy',
        type: 'line',
        data: energyByDay,
        smooth: true
      }
    ]
  }
})
</script>
