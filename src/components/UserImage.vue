<script setup>
import image from "../assets/defaultUser.png";
defineProps(["img"]);
</script>
<template>
  <img :src="img ? img : image" alt="pfp" />
</template>
