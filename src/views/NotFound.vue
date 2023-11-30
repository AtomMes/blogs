<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col items-center justify-center"
  >
    <p class="text-[50px] font-bold text-center">Not Found</p>
    <div
      class="h-60 w-60 flex items-center mt-8 mb-8 justify-center pb-1 rounded-full bg-red-600"
    >
      <p class="text-[110px] text-white">404</p>
    </div>
    <p>
      The content you are looking for doesn't exist
      <router-link to="/" class="text-emerald-500 underline font-semibold"
      >go back</router-link
      >
    </p>
  </div>
</template>
<script setup>
</script>
