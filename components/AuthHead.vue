<script setup>
defineProps({
  title: "",
  link: ""
});
</script>

<template>
    <div class="px-[30px] py-[20px]">
        <div class="flex justify-between items-center">
            <NuxtImg class="w-[190px] h-[62px]" src="/meister.png" />
            <NuxtLink :to="{ path: link }" class="text-base font-medium text-[#0af]">{{ title }}</NuxtLink>
        </div>
    </div>
</template>