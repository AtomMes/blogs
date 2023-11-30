<script setup>
import { ref, watchEffect } from "vue";
import userService from "@/services/userService";
import Author from "@/components/Author.vue";

const props = defineProps(["comment"]);
const commentAuthor = ref(null);

watchEffect(async () => {
  const dbAuthor = await userService.getUserById(props.comment.authorId);
  commentAuthor.value = dbAuthor.data[0];
});

const date =
  props.comment.date.split(" ")[1] + " " + props.comment.date.split(" ")[2];
</script>

<template>
  <template v-if="commentAuthor">
    <div class="mt-4">
      <Author :author="commentAuthor" :date="date" />
      <p class="pl-[45px] pt-3 break-all">{{ comment.comment }}</p>
    </div>
  </template>
  <template v-else>
    <div class="w-full mt-4">
      <div class="flex items-center gap-1.5">
        <div class="w-10 h-10 rounded-[8px] bg-red-500" id="skeleton" />
        <div class="flex flex-col gap-0.5 flex-1">
          <div class="w-12 h-3 rounded-[2px]" id="skeleton" />
          <div class="w-16 h-2.5 rounded-[2px]" id="skeleton" />
        </div>
        <div id="skeleton" class="w-12 h-5 pt-3 rounded-[2px]" />
      </div>
      <div class="h-5 mt-3 ml-[46px] max-w-[420px] w-full" id="skeleton" />
    </div>
  </template>
</template>
