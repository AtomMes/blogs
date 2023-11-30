<script setup>
import {computed, reactive, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import userService from '@/services/userService';
import {useUserStore} from '@/stores/userStore';
import {useRouter} from 'vue-router';
import {email, maxLength, minLength, required} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import BaseInput from '@/components/BaseInput.vue';
import {mailError, nameError, passwordError} from '@/assets/errorMessages';

const userState = useUserStore();
const router = useRouter();
const show = ref(null);
const userExists = ref(false);

const user = reactive({
  name: null,
  email: null,
  password: null,
  img: null,
});

const constructUser = (user) => {
  return {
    ...user,
    id: uuidv4(),
  };
};

const rules = {
  name: {
    required,
    maxLength: maxLength(64),
  },
  email: {
    email,
    required,
    maxLength: maxLength(30),
  },
  password: {
    required,
    minLength: minLength(8),
  },
};

const v$ = useVuelidate(rules, user);

const onSubmit = async () => {
  userExists.value = false;
  v$.value.$touch();
  if (!v$.value.$error) {
    const exists = await userService.checkEmailUsage(user.email);
    if (!exists.data.length) {
      await userService.register(constructUser(user)).then((res) => {
        if (res) {
          userState.setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          router.push({ name: 'profile', params: { id: res.data.id } });
        }
      });
    } else {
      userExists.value = true;
    }
  }
};

const mailErrorMessage = computed(() => {
  return mailError(v$.value.email.$errors[0]?.$params.type);
});
const passwordErrorMessage = computed(() => {
  return passwordError(user.password);
});

const nameErrorMessage = computed(() => {
  return nameError(user.name);
});

</script>
<template>
  <div
    class="shadow-2xl rounded-xl w-full px-8 py-6 max-w-[450px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <p class="text-[24px] text-center font-bold mb-1">Welcome</p>
    <p class="text-[18px] text-center text-gray-400 mb-5">
      Enter your credentials to become a member
    </p>
    <form
      @submit.prevent="onSubmit"
      class="flex flex-col justify-center gap-4 w-full mb-1 mt-2"
    >
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
      <div>
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
      <div class="relative">
        <img
          @click="show = true"
          v-show="!show"
          src="../assets/closedEye.png"
          alt="show"
          class="cursor-pointer w-[18px] mt-[3px] absolute right-2 top-[33px]"
        />
        <img
          @click="show = false"
          v-show="show"
          src="../assets/openEye.png"
          alt="show"
          class="cursor-pointer w-[18px] mt-[6px] absolute right-2 top-[33px]"
        />
        <BaseInput
          :class="{ 'border-red-500': v$.password.$error }"
          @update:input-value="(newValue) => (v$.password.$model = newValue)"
          :input-value="v$.password.$model"
          label="Password"
          placeholder="Enter you password"
          :error-message="passwordErrorMessage"
          :show-error="v$.password.$error"
          :type="show ? 'text' : 'password'"
          @blur="v$.password.$touch()"
          @input="v$.password.$reset()"
        />
        <p class="text-red-500" v-if="userExists">*The email address is already in use</p>
      </div>
      <div class="flex justify-end w-full relative mt-4">
        <button
          class="border rounded-[6px] py-1 pb-2 bg-emerald-400 hover:bg-emerald-500 transition text-white text-center text-[18px] w-full font-semibold"
          type="submit"
        >
          Register
        </button>
      </div>
      <p class="mb-5">
        Already have an account?
        <router-link :to="{ name: 'login' }" class="font-semibold underline"
        >Login
        </router-link
        >
      </p>
    </form>
  </div>
</template>
