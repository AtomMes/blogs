<script setup>
import {useRoute, useRouter} from 'vue-router';
import {ref, watchEffect} from 'vue';
import blogService from '@/services/blogService';
import Blog from '@/components/Blog/Blog.vue';

const route = useRoute();
const router = useRouter();
const blog = ref({
  title: null,
  description: null,
  id: null,
  authorId: null,
});

watchEffect(async () => {
  await blogService.getById(route.params.id).then((res) => {
    blog.value = res.data[0];
  });
});
</script>
<template>
  <div>
    <div class="mx-auto my-14 max-w-5xl flex flex-col gap-8">
      <template v-if="blog">
        <Blog :blog="blog" />
      </template>
      <template v-else>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col gap-4 items-center justify-center"
        >
          <p class="text-[50px] font-bold text-center">Not Found</p>
          <div
            class="h-60 w-60 flex items-center justify-center rounded-full bg-red-600"
          >
            <p class="text-[110px] text-white">404</p>
          </div>
          <p>
            The blog you are looking for doesn't exist
            <router-link to="/" class="text-emerald-500 underline font-semibold"
            >go back
            </router-link>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
