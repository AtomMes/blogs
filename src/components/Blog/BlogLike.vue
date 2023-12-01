<script setup>
import LikeIcon from "@/icons/LikeIcon.vue";

defineProps(["isLiked", "likesCount"]);
defineEmits(["onLike"]);
</script>
<template>
  <button
    class="flex justify-center gap-1 items-center bg-e"
    @click="$emit('onLike')"
  >
    <LikeIcon
      :fill="isLiked ? '#10b981' : '#00000000'"
      :stroke="isLiked ? '#10b981' : '#00000050'"
      class="transition"
    />
    <p :class="isLiked ? 'text-emerald-500 font-semibold' : 'text-gray-400'">
      {{ likesCount || 0 }}
    </p>
  </button>
</template>
