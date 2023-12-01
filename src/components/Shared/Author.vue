<script setup>
import UserImage from '@/components/Shared/UserImage.vue';
import {useRouter} from 'vue-router';

const router = useRouter();
defineProps(['author', 'date']);

</script>
<template>
  <div class="flex justify-between items-center">
    <div
      @click="router.push({ name: 'profile', params: { id: author.id } })"
      class="flex items-center gap-1 cursor-pointer"
    >
      <UserImage :img="author.img" class="w-10 rounded-[5px]" />
      
      <div class="flex gap-2 items-center ">
        <p class="font-bold text-[17px] truncate">{{ author.name }}</p>
        <div class="flex gap-1 items-center">
          <p class="text-[10px] text-gray-500 leading-none">●</p>
          <p class="text-[12px] leading-none">{{ date }}</p>
        </div>
      </div>
    
    </div>
  </div>
</template>
