<script setup>
import Blog from "@/components/Blog/Blog.vue";
import LoadingCircle from "@/components/Shared/LoadingCircle.vue";
import { ref, watchEffect } from "vue";

const props = defineProps(["loading", "blogs", "modelValue"]);
defineEmits(["update:modelValue"]);
const searchTextExists = ref(false);

watchEffect(() => {
  searchTextExists.value =
    !!props.modelValue && !!props.modelValue.split(" ").join("");
});
</script>

<template>
  <input
    :disabled="!blogs?.length"
    class="border w-full rounded-full mb-5 h-10 px-3.5"
    placeholder="Search a post"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  <div v-if="!loading && !blogs?.length" class="w-full">
    <div class="w-fit mx-auto px-4 py-2 border border-gray-300 rounded flex">
      <p>
        There's no posts yet, go ahead and
        <router-link
          :to="{ name: 'create-blog' }"
          class="underline text-emerald-500 font-semibold"
        >create one
        </router-link>
      </p>
    </div>
  </div>
  <div v-else-if="!loading && blogs">
    <div
      v-for="blog in blogs"
      :class="searchTextExists &&
        !blog.title?.toLowerCase().includes(modelValue?.toLowerCase()) &&
        'hidden'"
    >
      <Blog :blog="blog" />
      <div
        class="h-[1px] my-3 mx-3 max-w-full bg-gray-200"
        :class="blogs[blogs.length - 1].id === blog.id && 'hidden'"
      />
    </div>
  </div>
  <div v-else-if="loading" class="w-full">
    <LoadingCircle />
  </div>
</template>
