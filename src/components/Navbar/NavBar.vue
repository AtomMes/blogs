<script setup>
import {RouterLink, useRouter} from 'vue-router';
import {useUserStore} from '@/stores/userStore';
import {ref} from 'vue';
import NavbarDropdown from '@/components/Navbar/NavbarDropdown.vue';
import UserImage from '@/components/Shared/UserImage.vue';
import ConfirmPopup from '@/components/Shared/ConfirmPopup.vue';

const userStore = useUserStore();
const router = useRouter();

let show = ref(false);
let logout = ref(false);
const toClose = () => (show.value = false);
const toOpen = () => (show.value = true);
const onLogout = async () => {
  logout.value = false
  show.value = !show.value;
  await router.push({ name: 'login' });
  userStore.logOut();
  localStorage.removeItem('user');
};
</script>

<template>
  <nav class="flex h-16 px-2">
    <ConfirmPopup warningText="Are you sure you want to log out?" buttonText="Logout" @cancel="logout = false;"
                  @confirm="onLogout" v-if="logout" />
    <div
      class="flex justify-between items-center w-full max-w-5xl mx-auto"
      v-if="userStore.user.id"
    >
      <RouterLink :to="{ name: 'home' }">
        <p class="font-bold">LOGO</p>
      </RouterLink>
      <div class="relative">
        <button @click="toOpen" class="flex items-center rounded-md">
          <UserImage :img="userStore.user.img" class="w-10 rounded-[5px]" />
        </button>
        <NavbarDropdown
          @logout="logout = true; show = false"
          @close="toClose"
          :show="show"
          v-if="show"
        />
      </div>
    </div>
    <div
      class="flex justify-between items-center w-full max-w-5xl mx-auto px-2"
      v-else
    >
      <RouterLink :to="{ name: 'home' }">
        <p class="font-bold">LOGO</p>
      </RouterLink>
      <div class="flex gap-3">
        <RouterLink :to="{ name: 'login' }">
          <p class="font-bold">Login</p>
        </RouterLink>
        <RouterLink :to="{ name: 'register' }">
          <p class="font-bold">Register</p>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
img {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
