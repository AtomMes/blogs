<script setup>
import {useRoute, useRouter} from 'vue-router';
import {ref, watchEffect} from 'vue';
import userService from '@/services/userService';
import blogService from '@/services/blogService';
import {useUserStore} from '@/stores/userStore';
import EditProfile from '@/components/Profile/EditProfile.vue';
import LoadingCircle from '@/components/Shared/LoadingCircle.vue';
import ProfileFeed from '@/components/Profile/ProfileFeed.vue';
import ProfileUserData from '@/components/Profile/ProfileUserData.vue';
import Error from '@/components/Shared/Error.vue';

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
  <div class="flex justify-center">
    <div class="my-14 w-full max-w-5xl flex flex-col gap-2">
      <template v-if="!loading && user">
        <EditProfile
          :user="user"
          @closeEdit="toggleEdit"
          @updateUser="updateUser"
          v-if="myProfile && edit"
        />
        <ProfileUserData
          :myProfile="myProfile"
          :user="user"
          @logout="logOut"
          @toggleEdit="toggleEdit"
        />
        <ProfileFeed
          :myProfile="myProfile"
          :userBlogs="userBlogs"
          :user="user"
          @deleteBlog="deleteBlog"
        />
      </template>
      <template v-else-if="loading && !user">
        <div class="w-full">
          <LoadingCircle class="w-52 h-52" />
        </div>
      </template>
      <template v-else>
        <Error title="Not Found" description="The user you are looking for doesn't exist" button-text="go back"
               circle-text="404" />
      </template>
    </div>
  </div>
</template>
