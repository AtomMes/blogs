<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";
import NavbarDropdown from "@/components/NavbarDropdown.vue";
import UserImage from "@/components/UserImage.vue";

const userStore = useUserStore();
const router = useRouter();

let show = ref(false);
const toClose = () => (show.value = !show.value);
const toOpen = () => (show.value = true);
const logOut = async () => {
  show.value = !show.value;
  await router.push({ name: "login" });
  userStore.logOut();
  localStorage.removeItem("user");
};
</script>

<template>
  <nav class="flex h-16">
    <div
      class="flex justify-between items-center w-full max-w-5xl mx-auto px-1"
      v-if="userStore.user.id"
    >
      <RouterLink :to="{ name: 'home' }">
        <p class="font-bold">LOGO</p>
      </RouterLink>
      <div class="relative">
        <button @click="toOpen" class="flex items-center p-2 rounded-md">
          <UserImage :img="userStore.user.img" class="w-10 rounded-[5px]" />
        </button>
        <NavbarDropdown
          @logout="logOut"
          @close="toClose"
          :show="show"
          v-if="show"
        />
      </div>
    </div>
    <div
      class="flex justify-between items-center w-full max-w-5xl mx-auto"
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
