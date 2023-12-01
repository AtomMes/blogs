<script setup>
import Blog from '@/components/Blog/Blog.vue';
import LoadingCircle from '@/components/Shared/LoadingCircle.vue';

defineProps(['userBlogs', 'user', 'myProfile']);
const emit = defineEmits(['deleteBlog']);
</script>

<template>
  <template v-if="userBlogs && userBlogs.length">
    <div class="px-2 flex flex-col gap-2">
      <p class="text-[30px] font-bold break-all ml-3">
        {{ user.name }}'s Blogs
      </p>
      <div class="flex flex-row flex-wrap gap-y-3">
        <Blog
          v-for="blog in userBlogs"
          :blog="blog"
          @deleteBlog="emit('deleteBlog')"
        />
      </div>
    </div>
  </template>
  <template v-else-if="userBlogs?.length === 0">
    <div
      v-if="myProfile"
      class="w-fit mx-auto border border-gray-300 rounded flex px-3 py-2"
    >
      <p>
        You don't have any posts yet, go ahead and
        <router-link
          :to="{ name: 'create-blog' }"
          class="underline text-emerald-500 font-semibold"
        >create one
        </router-link>
      </p>
    </div>
    <div
      v-else
      class="w-fit mx-auto border border-gray-300 rounded flex px-3 py-2"
    >
      <p>
        {{ user.name }} doesn't have any posts yet, check for
        <router-link
          :to="{ name: 'home' }"
          class="underline text-emerald-500 font-semibold"
        >other posts
        </router-link>
      </p>
    </div>
  </template>
  <template v-else>
    <LoadingCircle />
  </template>
</template>
