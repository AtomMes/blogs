<script setup>
defineProps(['title', 'circleText', 'description', 'buttonText']);
</script>
<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col gap-4 items-center justify-center"
  >
    <p class="text-[50px] font-bold text-center">{{ title }}</p>
    <div
      class="h-60 w-60 flex items-center justify-center rounded-full bg-red-600"
    >
      <p class="text-[110px] text-white">{{ circleText }}</p>
    </div>
    <p>
      {{ description }}
      <router-link to="/" class="text-emerald-500 underline font-semibold"
      >{{ buttonText }}
      </router-link
      >
    </p>
  </div>
</template>
