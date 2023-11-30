<script setup>
import { maxLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { computed, reactive, toRefs } from "vue";
import blogService from "@/services/blogService";
import { blogDescriptionError, blogTitleError } from "@/assets/errorMessages";
import BaseInput from "@/components/BaseInput.vue";

const props = defineProps(["blog", "editMode"]);
const emit = defineEmits(["closeEditMode"]);

const updatedBlog = reactive({
  title: props.blog.title,
  description: props.blog.description,
  authorId: props.blog.authorId,
  id: props.blog.id,
  date: props.blog.date,
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
const v$ = useVuelidate(rules, updatedBlog);

const titleErrorMessage = computed(() => {
  return blogTitleError(updatedBlog.title);
});
const descriptionErrorMessage = computed(() => {
  return blogDescriptionError(updatedBlog.description);
});

const save = async () => {
  v$.value.$touch();
  if (!v$.value.$error) {
    Object.keys(updatedBlog).forEach((key) => {
      if (
        updatedBlog[key] === null ||
        !updatedBlog[key].length ||
        !updatedBlog[key].split(" ").join("")
      ) {
        delete updatedBlog[key];
      }
    });
    if (Object.keys(toRefs(updatedBlog)).length !== 0) {
      await blogService.updateBlog(updatedBlog.id, updatedBlog);
      props.blog.title = updatedBlog.title;
      props.blog.description = updatedBlog.description;
      emit("closeEditMode");
    }
  }
};
</script>

<template>
  <div v-if="editMode">
    <div
      class="fixed top-0 z-20 left-0 flex items-center justify-center h-[100vh] w-[100vw] bg-[#00000044]"
      @click="$emit('closeEditMode')"
    ></div>
    <div
      class="bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl max-w-xl w-full"
    >
      <div class="flex px-4 justify-end w-full relative py-4 border-b">
        <p
          class="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] text-[20px] font-bold"
        >
          Edit Profile
        </p>
        <button
          class="bg-gray-200 p-2 rounded-full transition hover:bg-gray-300"
          @click="emit('closeEditMode')"
        >
          <img src="../../assets/close.png" alt="Close" class="w-5" />
        </button>
      </div>
      <form
        @submit.prevent="save"
        class="flex flex-col justify-center gap-4 w-full mb-1 mt-2 px-4 pb-5"
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
            @update:input-value="
              (newValue) => (v$.description.$model = newValue)
            "
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
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
