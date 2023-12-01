<script setup>
defineProps(['buttonText', 'warningText']);
const emit = defineEmits(['cancel', 'confirm']);
</script>
<template>
  <div class="fixed top-0 left-0 bg-[#00000050] w-full h-full z-40" />
  <div
    class="flex flex-col fixed w-full max-w-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl">
    <div class="flex flex-col px-10 py-4">
      <p class="text-[24px] font-semibold text-center">Attention</p>
      <p class="text-center self-center" >{{ warningText }}</p>
    </div>
    <div class="w-full h-[1px] bg-gray-200" />
    <div class="flex gap-2 px-10 py-3">
      <button class="px-2 py-1 w-full bg-red-500 transition hover:bg-red-600 text-white rounded-[4px]"
              @click="emit('confirm')">{{ buttonText }}
      </button>
      <button class="px-2 py-1 w-full bg-gray-300 transition hover:bg-gray-400 text-white rounded-[4px]"
              @click="emit('cancel')">Cancel
      </button>
    </div>
  </div>
</template>
