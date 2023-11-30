<script setup>
import Author from '@/components/Author.vue';
import {useRoute} from 'vue-router';
import {ref, watchEffect} from 'vue';

const props = defineProps(['author', 'profile', 'visibleComments', 'myProfile', 'blog']);
const expanded = ref(false);
const route = useRoute();

watchEffect(() => {
  expanded.value = route.name === 'full-blog';
});
const date = props.blog.date.split(' ')[1] + " " + props.blog.date.split(' ')[2]
</script>

<template>
  <router-link
    :class="{ 'pointer-events-none': profile && visibleComments }"
    :to="{ name: 'full-blog', params: { id: blog.id } }"
    class="pb-5"
  >
    <div class="flex w-full items-center">
      <Author
        :author="author"
        class="w-full"
        :class="myProfile && `pr-3`"
        :date="date"
      />
    </div>
    <p :class="!expanded ? 'truncate' : 'break-all'" class="text-4xl py-1">
      {{ blog.title }}
    </p>
    <p :class="!expanded ? 'truncate' : 'break-all'" class="text-xl py-1">
      {{ blog.description }}
    </p>
  </router-link>
</template>
