<script setup>
import UploadImage from "vue-image-crop-upload";
import { computed, reactive, ref, toRefs } from "vue";
import userService from "@/services/userService";
import { useUserStore } from "@/stores/userStore";
import UserImage from "@/components/UserImage.vue";
import { email, maxLength, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import BaseInput from "@/components/BaseInput.vue";
import { mailError, nameError, passwordError } from "@/assets/errorMessages";

const props = defineProps(["user"]);
const emit = defineEmits(["closeEdit", "updateUser"]);
const userStore = useUserStore();
const show = ref(null);
const editedUser = reactive({
  name: null,
  email: null,
  password: null,
  img: null,
});
let count = 0;

window.addEventListener("click", function (e) {
  if (count === 0) {
    count++;
    return;
  }
  if (!document.getElementById("clickBox")?.contains(e.target)) {
    count = 0;
    emit("closeEdit");
  }
});

const toggleShow = () => {
  show.value = !show.value;
};

function cropSuccess(img) {
  editedUser.img = img;
}

const rules = {
  name: {
    maxLength: maxLength(64),
  },
  email: {
    email,
    maxLength: maxLength(30),
  },
  password: {
    minLength: minLength(8),
  },
};

const v$ = useVuelidate(rules, editedUser);

const save = async () => {
  v$.value.$touch();
  if (!v$.value.$error) {
    Object.keys(editedUser).forEach((key) => {
      if (
        editedUser[key] === null ||
        !editedUser[key].length ||
        !editedUser[key].split(" ").join("")
      ) {
        delete editedUser[key];
      }
    });
    if (Object.keys(toRefs(editedUser)).length !== 0) {
      const res = await userService.updateUser(props.user.id, editedUser);
      localStorage.setItem("user", JSON.stringify(res.data));
      userStore.setUser(res.data);
      emit("closeEdit");
      emit("updateUser");
    }
  }
};

const mailErrorMessage = computed(() => {
  return mailError(v$.value.email.$errors[0]?.$params.type);
});
const passwordErrorMessage = computed(() => {
  return passwordError(editedUser.password);
});

const nameErrorMessage = computed(() => {
  return nameError(editedUser.name);
});
const closeEdit = () => {
  emit("closeEdit");
};
</script>

<template>
  <div
    class="fixed top-0 z-50 left-0 flex items-center justify-center h-[100vh] w-[100vw] bg-[#00000044]"
    v-if="user"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-2xl flex items-center flex-col"
      id="clickBox"
    >
      <div class="flex px-4 justify-end w-full relative py-4 border-b">
        <p
          class="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] text-[20px] font-bold"
        >
          Edit Profile
        </p>
        <button
          class="bg-gray-200 p-2 rounded-full transition hover:bg-gray-300"
          @click="closeEdit"
        >
          <img src="../assets/close.png" alt="Close" class="w-5" />
        </button>
      </div>
      <div class="w-full flex items-center flex-col px-4 py-3">
        <div class="w-full flex flex-col items-center">
          <div class="w-full flex justify-between">
            <p class="font-bold text-[18px]">Profile Picture</p>
            <button
              class="text-[16px] text-emerald-500 hover:text-emerald-6 00 transition font-semibold"
              @click="toggleShow"
            >
              Add
            </button>
          </div>
          <UserImage
            :img="editedUser.img ? editedUser.img : user.img"
            class="w-60"
          />
        </div>
        <UploadImage
          field="img"
          noCircle
          @crop-success="cropSuccess"
          v-model="show"
          :width="500"
          :height="500"
          lang-type="en"
          img-format="png"
        />
      </div>
      <div class="flex flex-col justify-center gap-4 w-full px-4 mb-1 mt-2">
        <div>
          <BaseInput
            :class="{ 'border-red-500': v$.email.$error }"
            @update:input-value="(newValue) => (v$.email.$model = newValue)"
            :input-value="v$.email.$model"
            label="Email"
            placeholder="example@email.com"
            :error-message="mailErrorMessage"
            :show-error="v$.email.$error"
            @blur="v$.email.$touch()"
            @input="v$.email.$reset()"
          />
        </div>
        <div class="relative">
          <BaseInput
            :class="{ 'border-red-500': v$.name.$error }"
            @update:input-value="(newValue) => (v$.name.$model = newValue)"
            :input-value="v$.name.$model"
            label="Name"
            placeholder="Enter you name"
            :error-message="nameErrorMessage"
            :show-error="v$.name.$error"
            @blur="v$.name.$touch()"
            @input="v$.name.$reset()"
          />
        </div>
        <div>
          <BaseInput
            :class="{ 'border-red-500': v$.password.$error }"
            @update:input-value="(newValue) => (v$.password.$model = newValue)"
            :input-value="v$.password.$model"
            label="Password"
            placeholder="Enter you password"
            :error-message="passwordErrorMessage"
            :show-error="v$.password.$error"
            @blur="v$.password.$touch()"
            @input="v$.password.$reset()"
          />
        </div>
      </div>
      <div class="flex justify-end w-full relative px-3 py-4">
        <button
          class="border rounded-[6px] py-1 pb-2 bg-emerald-400 hover:bg-emerald-500 transition text-white text-center text-[18px] w-full font-semibold"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
