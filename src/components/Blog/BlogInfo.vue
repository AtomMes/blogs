<script setup>
import Author from '@/components/Shared/Author.vue';
import {useRoute} from 'vue-router';
import {computed, ref, watchEffect} from 'vue';
import Trash from '@/icons/Trash.vue';

const props = defineProps([
  'author',
  'profile',
  'visibleComments',
  'myProfile',
  'blog',
  'myId'
]);
const emit = defineEmits(['deleteBlog']);
const expanded = ref(false);
const route = useRoute();

watchEffect(() => {
  expanded.value = route.name === 'full-blog';
});

const date = props.blog.date.split(' ').slice(1, 3).join(' ');
const canDelete = computed(() => {
  if (props.myProfile) {
    return true;
  } else return expanded.value && props.author.id === props.myId;
});

</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex w-full items-center">
      <Author
        :author="author"
        class="w-full"
        :date="date"
      />
      <button
        @click="emit('deleteBlog')"
        v-if="canDelete  "
        :class="{ hidden: visibleComments }"
        class="rounded-full"
      >
        <Trash width="30" height="30" fill="#00000099" />
      </button>
    </div>
    <router-link
      :class="{ 'pointer-events-none': profile && visibleComments }"
      :to="{ name: 'full-blog', params: { id: blog.id } }"
      class="pb-5"
    >
      <p :class="!expanded ? 'truncate' : 'break-all'" class="text-3xl font-semibold leading-tight">
        {{ blog.title }}
      </p>
      <p :class="!expanded ? 'truncate' : 'break-all'" class="text-xl leading-tight">
        {{ blog.description }}
      </p>
    </router-link>
  </div>
</template>
