<script setup>
import BlogComment from '@/components/Blog/BlogComment.vue';

defineProps(['comments', 'commentMessage', 'commentExists']);
defineEmits(['update:commentMessage', 'addComment']);
</script>
<template>
  <div class="flex justify-between items-center border-b pb-1">
    <input
      class="w-full outline-none h-8 rounded-t-xl bg-inherit px-2 underline-none"
      placeholder="Leave a comment..."
      @input="$emit('update:commentMessage', $event.target.value)"
      v-bind="$attrs"
      :value="commentMessage"
      @keydown.enter="$emit('addComment')"
    />
    <button
      @click="$emit('addComment')"
      v-show="commentExists"
      class="text-emerald-400 px-2 outline-emerald-300 h-fit"
    >
      Add
    </button>
  </div>
  <div class="flex flex-col-reverse gap-1 max-h-[500px] overflow-auto">
    <BlogComment v-for="comment in comments" :comment="comment" :key="comment.id" />
  </div>
</template>
