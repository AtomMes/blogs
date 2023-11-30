<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(["logout", "close"]);
defineProps(["show"]);
let count = 0;

const listener = (e) => {
  if (count === 0) {
    count++;
    return;
  }
  if (!document.getElementById("clickBox").contains(e.target)) {
    count = 0;
    emit("close");
    removeListener();
  }
};

window.addEventListener("click", listener);
const removeListener = () => {
  window.removeEventListener("click", listener);
};

const onLogout = () => {
  emit("logout");
  removeListener();
};
</script>

<template>
  <div
    v-show="show"
    id="clickBox"
    class="absolute z-50 right-0 py-2 bg-white rounded-md shadow-2xl w-max"
  >
    <router-link
      :to="{
        name: 'profile',
        params: {
          id: userStore.user.id,
        },
      }"
      class="text-center block px-4 py-1 text-sm hover:bg-gray-50 text-gray-900"
      @click="
        $emit('close');
        removeListener();
      "
    >
      Profile
    </router-link>
    <router-link
      :to="{ name: 'create-blog' }"
      class="text-center block px-4 py-1 text-sm text-gray-900 hover:bg-gray-50"
      @click="
        $emit('close');
        removeListener();
      "
    >
      Create Blog
    </router-link>
    <button
      class="w-full block px-4 py-1 text-sm text-gray-900 hover:bg-gray-50"
      @click="onLogout"
    >
      Logout
    </button>
  </div>
</template>
