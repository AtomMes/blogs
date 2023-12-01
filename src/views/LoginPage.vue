<script setup>
import {computed, reactive, ref} from 'vue';
import userService from '@/services/userService';
import {useUserStore} from '@/stores/userStore';
import router from '@/router';
import {email, maxLength, minLength, required} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import BaseInput from '@/components/Shared/BaseInput.vue';
import {mailError, passwordError} from '@/assets/functions/errorMessages';

const userState = useUserStore();

const user = reactive({
  email: '',
  password: '',
});
const show = ref(false);
const notUser = ref(false);

const rules = {
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
  v$.value.$touch();
  notUser.value = false;
  if (!v$.value.$error) {
    await userService.login(user).then((res) => {
      if (res?.data[0]) {
        userState.setUser(res.data[0]);
        localStorage.setItem('user', JSON.stringify(res.data[0]));
        router.push({ name: 'profile', params: { id: res.data[0].id } });
      } else {
        notUser.value = true;
      }
    });
  }
};

const mailErrorMessage = computed(() => {
  return mailError(v$.value.email.$errors[0]?.$params.type);
});
const passwordErrorMessage = computed(() => {
  return passwordError(user.password);
});
</script>
<template>
  <div
    class="shadow-2xl rounded-xl w-full px-8 py-6 max-w-[450px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <p class="text-[24px] text-center font-bold mb-1">Welcome</p>
    <p class="text-[18px] text-center text-gray-400 mb-5">
      Enter your credentials to log in
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
      <div class="relative">
        <img
          @click="show = true"
          v-show="!show"
          src="../assets/images/closedEye.png"
          alt="show"
          class="cursor-pointer w-[18px] mt-[3px] absolute right-2 top-[33px]"
        />
        <img
          @click="show = false"
          v-show="show"
          src="../assets/images/openEye.png"
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
        <p v-if="notUser" class="text-red-500">
          *Incorrect email address or password
        </p>
      </div>
      <div class="flex justify-end w-full relative mt-4">
        <button
          class="border rounded-[6px] py-1 pb-2 bg-emerald-400 hover:bg-emerald-500 transition text-white text-center text-[18px] w-full font-semibold"
          type="submit"
        >
          Log in
        </button>
      </div>
      <p class="mb-5">
        Don't have an account?
        <router-link :to="{ name: 'register' }" class="font-semibold underline"
        >Register
        </router-link>
      </p>
    </form>
  </div>
</template>
