<script setup>
import {useRoute, useRouter} from 'vue-router';
import {ref, watchEffect} from 'vue';
import userService from '@/services/userService';
import blogService from '@/services/blogService';
import Blog from '@/components/Blog/Blog.vue';
import {useUserStore} from '@/stores/userStore';
import EditProfile from '@/components/EditProfile.vue';
import UserImage from '@/components/UserImage.vue';
import LoadingCircle from '@/components/LoadingCircle.vue';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const user = ref(null);
const userBlogs = ref(null);
const edit = ref(false);
const myProfile = ref(false);
const loading = ref(false);

const getBlogs = async () => {
  const dbBlogs = await blogService.getByAuthorId(route.params.id);
  userBlogs.value = dbBlogs.data;
};

const deleteBlog = (id) => {
  userBlogs.value = userBlogs.value.filter((blog) => blog.id !== id);
};
const updateUser = async () => {
  loading.value = true;
  if (myProfile.value) {
    user.value = userStore.user;
  } else {
    try {
      await userService.getUserById(route.params.id).then(async (res) => {
        if (res.data[0]) {
          user.value = res.data[0];
        }
        loading.value = false;
      });
      loading.value = false;
    } catch (err) {
      await router.push({ name: 'home' });
    }
  }
  loading.value = false;
  await getBlogs();
};

watchEffect(() => {
  myProfile.value = route.params.id === userStore.user.id;
  updateUser();
});

const logOut = () => {
  router.push({ name: 'login' });
  userStore.logOut();
  localStorage.removeItem('user');
};

const toggleEdit = () => {
  edit.value = !edit.value;
};
</script>
<template>
  <div>
    <div class="mx-auto my-14 w-full max-w-5xl flex flex-col gap-8">
      <template v-if="!loading && user">
        <EditProfile
          :user="user"
          @closeEdit="toggleEdit"
          @updateUser="updateUser"
          v-if="myProfile && edit"
        />
        <div
          :class="myProfile && 'xs:!flex-row'"
          class="flex flex-col justify-center items-center border-b pb-3"
        >
          <UserImage :img="user.img" class="w-48 rounded-[10px]" />
          <div
            :class="myProfile && 'xs:!text-left xs:!self-end'"
            class="self-center text-center mb-2 ml-2 w-fit"
          >
            <p class="text-4xl font-bold text-black break-all">
              {{ user.name }}
            </p>
            <p class="text-[18px]">{{ user.email }}</p>
          </div>
          <div
            v-if="myProfile"
            :class="myProfile && 'self-end xs:!justify-end'"
            class="w-full mb-5 flex justify-center gap-3"
          >
            <button class="border px-3 py-1 rounded-[4px]" @click="toggleEdit">
              Edit Profile
            </button>
            <button class="border px-3 py-1 rounded-[4px]" @click="logOut">
              Log out
            </button>
          </div>
        </div>
        <template v-if="userBlogs && userBlogs.length">
          <p class="text-[30px] px-3 font-bold break-all">
            {{ user.name }}'s Blogs
          </p>
          <div class="flex flex-row flex-wrap gap-y-3">
            <Blog
              v-for="blog in userBlogs"
              :blog="blog"
              @deleteBlog="deleteBlog"
            />
          </div>
        </template>
        <template v-else-if="userBlogs?.length === 0">
          <div
            v-if="myProfile"
            class="w-fit mx-auto px-4 py-2 border border-gray-300 rounded flex"
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
            class="w-fit mx-auto px-4 py-2 border border-gray-300 rounded flex"
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
      <template v-else-if="loading && !user">
        <div class="w-full">
          <LoadingCircle class="w-52 h-52" />
        </div>
      </template>
      <template v-else>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col items-center justify-center"
        >
          <p class="text-[50px] font-bold text-center">Not Found</p>
          <div
            class="h-60 w-60 flex items-center mt-8 mb-8 justify-center pb-1 rounded-full bg-red-600"
          >
            <p class="text-[110px] text-white">404</p>
          </div>
          <p>
            The user you are looking for doesn't exist
            <router-link to="/" class="text-emerald-500 underline font-semibold"
            >go back
            </router-link
            >
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
