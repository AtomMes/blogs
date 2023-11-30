<script setup>
import UserImage from "@/components/UserImage.vue";
defineProps(["author", "date"]);
</script>
<template>
  <div class="flex justify-between items-center">
    <router-link
      :to="{ name: 'profile', params: { id: author.id } }"
      class="flex items-center gap-1"
    >
      <UserImage :img="author.img" class="w-10 rounded-[5px]" />
      <div class="flex flex-col ml-[2px]">
        <p
          class="py-[3px] font-bold text-[17px] leading-none truncate max-w-[80%]"
        >
          {{ author.name }}
        </p>
        <p class="h-min leading-none text-gray-400 break-all">
          {{ author.email }}
        </p>
      </div>
    </router-link>
    <p v-if="date" class="text-gray-500 whitespace-nowrap">{{ date }}</p>
  </div>
</template>
