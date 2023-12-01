<script setup>
import Error from '@/components/Shared/Error.vue';
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col gap-4 items-center justify-center"
  >
    <p class="text-[50px] font-bold text-center">No Internet Connection</p>
    <div
      class="h-60 w-60 flex items-center justify-center pb-1 rounded-full bg-red-600"
    >
      <p class="text-[150px] text-white">!</p>
    </div>
    <p>
      Your computer does not have access to the internet
      <router-link to="/" class="text-emerald-500 underline font-semibold"
      >try again
      </router-link
      >
    </p>
  </div>
  <Error title="No Internet Connection" circleText="!"
         buttonText="try again"
         description="Your computer does not have access to the internet" />
</template>
