<script setup>
const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success', validator: (value) => ['success', 'error'].includes(value) },
  duration: { type: Number, default: 3000 }
})

const isVisible = ref(true)

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      isVisible.value = false
    }, props.duration)
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed top-4 right-4 p-4 rounded-lg shadow-md text-white animate-fade-in',
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]"
  >
    {{ message }}
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>