<script setup>
import UserImage from "@/components/UserImage.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
</script>

<template>
  <div class="overflow-hidden pt-5 sticky top-0 border-r">
    <div class="flex flex-col gap-3 justify-center items-center pb-5 border-b">
      <UserImage :img="userStore.user.img" class="w-40 rounded-xl" />
      <p class="text-[20px] font-semibold break-all text-center px-5">
        {{ userStore.user.name }}
      </p>
    </div>
    <div class="flex flex-col">
      <router-link
        :to="{ name: 'profile', params: { id: userStore.user.id } }"
        class="text-left p-3 hover:bg-gray-200"
      >
        Profile
      </router-link>
      <router-link
        :to="{ name: 'create-blog' }"
        class="text-left p-3 hover:bg-gray-200"
      >
        Blog Create
      </router-link>
    </div>
  </div>
</template>
