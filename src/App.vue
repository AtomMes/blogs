<script setup>
import { RouterView, useRouter } from "vue-router";
import NavBar from "@/components/Navbar/NavBar.vue";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userState = useUserStore();

if (localStorage.getItem("user")) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  userState.setUser(loggedUser);
} else {
  if (window.location.pathname !== "/register") {
    router.push({ name: "login" });
  }
}
</script>

<template>
  <header>
    <NavBar />
  </header>
  <RouterView />
</template>
