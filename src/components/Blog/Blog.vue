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
import {logged} from '@/assets/functions/isLogged';
import router from '@/router';
import ConfirmPopup from '@/components/Shared/ConfirmPopup.vue';

const props = defineProps(['blog']);
const emit = defineEmits(['deleteBlog']);
const userStore = useUserStore();
const route = useRoute();

const myProfile = ref(false); //to check if it's my profile(edit and delete buttons)
const profile = ref(false); //to check if it's profile page at all(width, comment)
const fullBlog = ref(false); //to check if it's full blog page
const editMode = ref(false); //blog edit
const author = ref(null); //blog author
const loading = ref(false); //is blog in load(skeleton)
const confirm = ref(false); //deletion confirmation
const blogData = ref(null); //blog itself

//Likes related
const likeId = computed(() => userStore.user.id + props.blog.id); //unique like id + easier search
const isLiked = ref(null); //is blog liked by current user
const likesCount = ref(null); //how many likes does it have
const likeLoading = ref(false); //prevent multiple loads

//Comments related
const visibleComments = ref(false); //is comments section open
const comments = ref(null); //comments array
const newComment = ref(null); //comment message (from array)
let commentLoading = false; //prevent multiple loads
const onLike = async () => {
  if (logged()) {
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
  } else {
    await router.push({ name: 'login' });
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
  if (logged()) {
    if (!commentLoading) {
      commentLoading = true;
      if (!commentExists.value) {
        commentLoading = false;
        return;
      }
      await blogService.addComment({
        id: uuidv4(),
        authorId: userStore.user.id,
        blogId: props.blog.id,
        comment: newComment.value,
        date: Date(),
      });
      newComment.value = null;
      await getComments();
      commentLoading = false;
    }
  } else {
    await router.push({ name: 'login' });
  }
};

const commentExists = computed(() => {
  return !!newComment.value && !!newComment.value.split(' ').join('');
});

const deleteBlog = async () => {
  await blogService.deleteBlog(props.blog.id);
  emit('deleteBlog', props.blog.id);
  confirm.value = false;
};

watchEffect(async () => {
  myProfile.value =
    route.name === 'profile' && route.params.id === userStore.user.id;
  profile.value = route.name === 'profile';
  fullBlog.value = route.name === 'full-blog';
  loading.value = true;
  const response = await userService.getUserById(props.blog.authorId);
  author.value = response.data[0];
  await getComments();
  blogData.value = await blogService.isLiked(likeId.value).then((res) => {
    isLiked.value = !!res.data.length;
  });
  await blogService.getBlogLikes(props.blog.id).then((res) => {
    likesCount.value = res.data.length;
  });
  loading.value = false;
});
</script>

<template>
  <template v-if="!loading">
    <EditBlog
      :blog="blog"
      :editMode="editMode"
      @close-edit-mode="editMode = false"
    />
    <ConfirmPopup
      v-if="confirm"
      @cancel="confirm = false"
      @confirm="deleteBlog"
      button-text="Delete"
      warning-text="Are you sure you want to delete this blog?"
    />
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
        'max-w-full md:!max-w-[50%] w-full': profile,
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50':
          profile && visibleComments,
      }"
    >
      <div
        class="relative w-full flex flex-col gap-2 transition hover:bg-gray-100 rounded-xl p-3"
        :class="{ 'bg-gray-100': profile && visibleComments }"
      >
        <BlogInfo
          :author="author"
          :myId="userStore.user.id"
          :profile="profile"
          :visibleComments="visibleComments"
          :myProfile="myProfile"
          :blog="blog"
          @deleteBlog="confirm = true"
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
          :fullBlog="fullBlog"
          :authorId="author.id"
          :myId="userStore.user.id"
          :profile="profile"
          :myProfile="myProfile"
          @openEditMode="editMode = true"
        />
        <div v-show="fullBlog || visibleComments">
          <BlogCommentSection
            @addComment="addComment"
            @update:newComment="(newValue) => (newComment = newValue)"
            :newComment="newComment"
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
    <BlogSkeleton :class="profile && 'max-w-full md:max-w-[50%] w-full px-2'" />
    <div
      class="h-[1px] my-3 mx-3 md:max-w-[40%] w-full bg-gray-200 last:hidden md:hidden"
      :class="!profile && 'hidden'"
    />
  </template>
</template>
