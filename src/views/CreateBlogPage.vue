<script setup>
import {computed, reactive} from 'vue';
import blogService from '@/services/blogService';
import {v4 as uuidv4} from 'uuid';
import {useUserStore} from '@/stores/userStore';
import {useRouter} from 'vue-router';
import {maxLength, required} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import BaseInput from '@/components/BaseInput.vue';
import {blogDescriptionError, blogTitleError} from '@/assets/errorMessages';

const userStore = useUserStore();
const router = useRouter();

const blog = reactive({
  title: null,
  description: null,
  authorId: userStore.user.id,
  id: null,
  date: null,
});

const rules = {
  title: {
    required,
    maxLength: maxLength(64),
  },
  description: {
    required,
    maxLength: maxLength(200),
  },
};
const v$ = useVuelidate(rules, blog);

const titleErrorMessage = computed(() => {
  return blogTitleError(blog.title);
});
const descriptionErrorMessage = computed(() => {
  return blogDescriptionError(blog.description);
});

const createBlog = () => {
  v$.value.$touch();
  if (!v$.value.$error) {
    blogService.create({ ...blog, id: uuidv4(), date: Date() }).then((res) => {
      router.push({ name: 'full-blog', params: { id: res.data.id } });
    });
  }
};
</script>

<template>
  <div
    class="shadow-2xl rounded-xl w-full px-8 py-6 max-w-[450px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <p class="text-[24px] text-center font-bold mb-1">Create a blog</p>
    <p class="text-[18px] text-center text-gray-400 mb-5">
      Enter to share your thoughts
    </p>
    <form
      @submit.prevent="createBlog"
      class="flex flex-col justify-center gap-4 w-full mb-1 mt-2"
    >
      <div>
        <BaseInput
          :class="{ 'border-red-500': v$.title.$error }"
          @update:input-value="(newValue) => (v$.title.$model = newValue)"
          :input-value="v$.title.$model"
          label="Title"
          placeholder="What's your blog about"
          :error-message="titleErrorMessage"
          :show-error="v$.title.$error"
          @blur="v$.title.$touch()"
          @input="v$.title.$reset()"
        />
      </div>
      <div>
        <BaseInput
          :class="{ 'border-red-500': v$.description.$error }"
          @update:input-value="(newValue) => (v$.description.$model = newValue)"
          :input-value="v$.description.$model"
          label="Description"
          placeholder="Write more details about it"
          :error-message="descriptionErrorMessage"
          :show-error="v$.description.$error"
          @blur="v$.description.$touch()"
          @input="v$.description.$reset()"
        />
      </div>
      <div class="flex justify-end w-full relative mt-4">
        <button
          class="border rounded-[6px] py-1 pb-2 bg-emerald-400 hover:bg-emerald-500 transition text-white text-center text-[18px] w-full font-semibold"
          type="submit"
        >
          Share
        </button>
      </div>
    </form>
  </div>
</template>
