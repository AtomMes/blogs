<script setup>
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col items-center justify-center"
  >
    <p class="text-[50px] font-bold text-center">No Internet Connection</p>
    <div
      class="h-60 w-60 flex items-center mt-8 mb-8 justify-center pb-1 rounded-full bg-red-600"
    >
      <p class="text-[150px] text-white">!</p>
    </div>
    <p>
      Your computer does not have access to the internet
      <router-link to="/" class="text-emerald-500 underline font-semibold"
      >try again</router-link
      >
    </p>
  </div>
</template>
