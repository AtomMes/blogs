<script setup>
import {RouterLink, useRouter} from 'vue-router';
import {useUserStore} from '@/stores/userStore';
import ProfileIcon from '@/icons/ProfileIcon.vue';
import CreateBlogIcon from '@/icons/CreateBlogIcon.vue';
import LogoutIcon from '@/icons/LogoutIcon.vue';
import {onUnmounted} from 'vue';

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(['logout', 'close']);
defineProps(['show']);
let count = 0;

const listener = (e) => {
  if (count === 0) {
    count++;
    return;
  }
  if (!document.getElementById('clickBox').contains(e.target)) {
    count = 0;
    emit('close');
    removeListener();
  }
};

window.addEventListener('click', listener);
const removeListener = () => {
  window.removeEventListener('click', listener);
};
const onLogout = () => {
  emit('logout');
  removeListener();
};

onUnmounted(() => {
  emit('close');
});

</script>

<template>
  <div
    v-show="show"
    id="clickBox"
    class="absolute z-50 right-0 py-2 bg-white rounded-md shadow-2xl w-40"
  >
    <router-link
      :to="{
        name: 'profile',
        params: {
          id: userStore.user.id,
        },
      }"
      class="text-left flex gap-1 px-2 py-2 text-sm hover:bg-gray-50 text-gray-900"
      @click="
        $emit('close');
        removeListener();
      "
    >
      <ProfileIcon width="20" height="20" />
      Profile
    </router-link>
    <router-link
      :to="{ name: 'create-blog' }"
      class="text-left flex gap-1 px-2 py-2 text-sm text-gray-900 hover:bg-gray-50 border-b"
      @click="
        $emit('close');
        removeListener();
      "
    >
      <CreateBlogIcon width="20" height="20" fill="#00000090" />
      Create Blog
    </router-link>
    <button
      class="w-full flex gap-1 text-left px-2 py-2 text-sm text-gray-900 hover:bg-gray-50"
      @click="onLogout"
    >
      <LogoutIcon width="20" height="20" />
      Logout
    </button>
  </div>
</template>
