<script setup>
import blogService from "@/services/blogService";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Feed from "@/components/Feed.vue";

const blogs = ref(null);
const loading = ref(false);
const router = useRouter();
const searchText = ref(null);

watchEffect(async () => {
  loading.value = true;
  try {
    const newBlogs = await blogService.getBlogs();
    blogs.value = newBlogs.data;
  } catch (err) {
    await router.push({ name: "404" });
  }
  loading.value = false;
}, blogs);
</script>
<template>
  <div class="flex w-full max-w-5xl mx-auto gap-6">
    <div class="w-[45%] hidden md:block">
      <Sidebar />
    </div>
    <div class="min-w-[70%] w-full">
      <Feed
        :loading="loading"
        :blogs="blogs"
        :model-value="searchText"
        @update:model-value="(newValue) => (searchText = newValue)"
      />
    </div>
  </div>
</template>
