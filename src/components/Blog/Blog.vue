<script setup>
import {computed, ref, watchEffect} from 'vue';
import userService from '@/services/userService';
import {useUserStore} from '@/stores/userStore';
import blogService from '@/services/blogService';
import {v4 as uuidv4} from 'uuid';
import {useRoute} from 'vue-router';
import BlogSkeleton from '@/components/Blog/BlogSkeleton.vue';
import BlogCommentSection from '@/components/Blog/BlogCommentSection.vue';
import BlogActions from '@/components/Blog/BlogActions.vue';
import BlogInfo from '@/components/Blog/BlogInfo.vue';
import EditBlog from '@/components/Blog/EditBlog.vue';

const props = defineProps(['blog']);
const emit = defineEmits(['deleteBlog']);
const userStore = useUserStore();
const route = useRoute();

const myProfile = ref(false);
const profile = ref(false);
const editMode = ref(false);
const author = ref(null);
const hovered = ref(false);
const loading = ref(false);

//Likes related
const likeId = computed(() => userStore.user.id + props.blog.id);
const isLiked = ref(null);
const likesCount = ref(null);
const blogData = ref(null);
const likesData = ref(null);
const likeLoading = ref(false);

//Comments related
const visibleComments = ref(false);
const comments = ref(null);
const commentMessage = ref(null);
const isCommenting = ref(0);
const onLike = async () => {
  if (isLiked.value) {
    likeLoading.value = true;
    await blogService.removeLike(likeId.value);
    isLiked.value = !isLiked.value;
    likesCount.value--;
    likeLoading.value = false;
  } else {
    likeLoading.value = true;
    await blogService.like({
      id: likeId.value,
      blogId: props.blog.id,
      userId: userStore.user.id,
    });
    isLiked.value = !isLiked.value;
    likesCount.value++;
    likeLoading.value = false;
  }
};

const getComments = async () => {
  const dbComments = await blogService.getBlogComments(props.blog.id);
  comments.value = dbComments.data;
};

const openComments = () => {
  visibleComments.value = !visibleComments.value;
};

const addComment = async () => {
  if (isCommenting.value === 0) {
    isCommenting.value = 1;
    if (!commentExists.value) {
      isCommenting.value = 0;
      return;
    }
    await blogService.addComment({
      id: uuidv4(),
      authorId: userStore.user.id,
      blogId: props.blog.id,
      comment: commentMessage.value,
      date: Date()
    });
    commentMessage.value = null;
    await getComments();
    isCommenting.value = 0;
  }
};

const commentExists = computed(() => {
  return !!commentMessage.value && !!commentMessage.value.split(' ').join('');
});

const deleteBlog = async () => {
  console.log('ekav')
  const sure = confirm('Are you sure you want to delete this blog?');
  if (sure) {
    await blogService.deleteBlog(props.blog.id);
    emit('deleteBlog', props.blog.id);
  }
};

watchEffect(async () => {
  myProfile.value =
    route.name === 'profile' && route.params.id === userStore.user.id;
  profile.value = route.name === 'profile';
  loading.value = true;
  const response = await userService.getUserById(props.blog.authorId);
  author.value = response.data[0];
  await getComments();
  blogData.value = await blogService.isLiked(likeId.value).then((res) => {
    isLiked.value = !!res.data.length;
  });
  likesData.value = await blogService
    .getBlogLikes(props.blog.id)
    .then((res) => {
      likesCount.value = res.data.length;
    });
  loading.value = false;
});
</script>

<template>
  <template v-if="!loading">
    <EditBlog :blog="blog" :editMode="editMode" @close-edit-mode="editMode = false" />
    <div
      v-if="profile && visibleComments"
      class="fixed w-full h-full bg-[#00000044] bg-r z-40 top-0 left-0"
      @click="openComments"
    ></div>
    <template v-if="profile && visibleComments">
      <BlogSkeleton :class="profile && 'max-w-full md:max-w-[50%]'" />
    </template>
    <div
      :class="{
        'max-w-full md:max-w-[50%] w-full px-2': profile,
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50':
          profile && visibleComments,
      }"
    >
      <div
        class="relative w-full flex flex-col transition hover:bg-gray-100 rounded-xl p-3"
        :class="{ 'bg-gray-100': profile && visibleComments }"
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
      >
        <button
          @click="deleteBlog"
          v-if="myProfile"
          :class="{ 'opacity-100': hovered, hidden: visibleComments }"
          class="opacity-0 absolute right-0 top-0 p-1 m-1 rounded-full transition hover:bg-gray-300"
        >
          <img src="../../assets/close.png" alt="Close" class="w-3.5" />
        </button>
        <BlogInfo
          :author="author"
          :profile="profile"
          :visibleComments="visibleComments"
          :myProfile="myProfile"
          :blog="blog"
        />
        <BlogActions
          @on-like="onLike"
          @open-comments="openComments"
          :likeLoading="likeLoading"
          :isLiked="isLiked"
          :likesCount="likesCount"
          :visibleComments="visibleComments"
          :commentsLength="comments?.length"
          :blogId="blog?.id"
          :profile="profile"
          :my-profile="myProfile"
          @openEditMode="editMode = !editMode"
        />
        <div v-show="visibleComments">
          <BlogCommentSection
            @addComment="addComment"
            @update:comment-message="(newValue) => (commentMessage = newValue)"
            :comment-message="commentMessage"
            :commentExists="commentExists"
            :comments="comments"
          />
        </div>
      </div>
    </div>
    <div
      class="h-[1px] my-3 mx-3 md:max-w-[40%] w-full bg-gray-200 last:hidden md:hidden"
      :class="!profile && 'hidden'"
    />
  </template>
  <template v-else>
    <BlogSkeleton
      :class="profile && 'max-w-full md:max-w-[50%] w-full px-2'"
    />
    <div
      class="h-[1px] my-3 mx-3 md:max-w-[40%] w-full bg-gray-200 last:hidden md:hidden"
      :class="!profile && 'hidden'"
    />
  </template>
</template>
