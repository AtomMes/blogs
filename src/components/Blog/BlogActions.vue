<script setup>
import LoadingCircle from '@/components/Shared/LoadingCircle.vue';
import CommentIcon from '@/icons/CommentIcon.vue';
import BlogLike from '@/components/Blog/BlogLike.vue';
import Edit from '@/icons/Edit.vue';
import {computed} from 'vue';

const props = defineProps([
  'likeLoading',
  'isLiked',
  'likesCount',
  'visibleComments',
  'commentsLength',
  'blogId',
  'profile',
  'myProfile',
  'fullBlog',
  'myId',
  'authorId'
]);
const emit = defineEmits(['onLike', 'openComments', 'openEditMode']);

const canEdit = computed(() => {
  console.log(props.blogId);
  console.log(props.myId);
  if (props.myProfile && !props.visibleComments) {
    return true;
  } else return !!(props.fullBlog && props.myId === props.authorId);
});

</script>

<template>
  <div class="flex w-full gap-1 items-center">
    <BlogLike
      v-if="!likeLoading"
      :disabled="likeLoading"
      @onLike="emit('onLike')"
      :isLiked="isLiked"
      :likesCount="likesCount"
    />
    <div v-else class="mr-3">
      <LoadingCircle class="!w-[30px] !h-[30px] cursor-pointer" />
    </div>
    <button
      @click="emit('openComments')"
      class="flex items-center justify-center"
    >
      <CommentIcon
        :fill="fullBlog || visibleComments ? '#10b981' : '#00000000'"
        :stroke="fullBlog || visibleComments ? '#10b981' : '#00000050'"
        class="transition"
      />
      <p
        :class="
          fullBlog || visibleComments ? 'text-emerald-500 font-semibold' : 'text-gray-400'
        "
      >
        {{ (commentsLength && commentsLength) || 0 }}
      </p>
    </button>
    <router-link
      :class="{ 'pointer-events-none': profile && visibleComments }"
      :to="{ name: 'full-blog', params: { id: blogId } }"
      class="w-full h-7"
    />
    <button
      v-show="canEdit"
      @click="emit('openEditMode')"
      class="self-center"
    >
      <Edit />
    </button>
  </div>
</template>
