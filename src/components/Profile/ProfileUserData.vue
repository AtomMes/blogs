<script setup>
import UserImage from '@/components/Shared/UserImage.vue';

defineProps(['myProfile', 'user']);
const emit = defineEmits(['toggleEdit', 'logout']);
</script>

<template>
  <div
    :class="myProfile && 'xs:!flex-row'"
    class="flex flex-col justify-center items-center xs:items-end border-b pb-3 gap-3 px-2"
  >
    <UserImage :img="user.img" class="w-48 rounded-[10px]" />
    <div class="w-full flex flex-col xs:flex-row items-center justify-between mb-2">
      <p class="text-4xl font-bold text-black break-all">
        {{ user.name }}
      </p>
      <div
        v-if="myProfile"
        :class="myProfile && 'xs:!justify-end'"
        class="flex justify-center gap-3"
      >
        <button class="border rounded-[4px] px-2 py-1 whitespace-nowrap" @click="emit('toggleEdit')">
          Edit Profile
        </button>
        <button class="border rounded-[4px] px-2 py-1 whitespace-nowrap" @click="emit('logout')">
          Log out
        </button>
      </div>
    </div>
  </div>
</template>
