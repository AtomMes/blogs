<script setup>
defineProps([
  "label",
  "inputValue",
  "placeholder",
  "errorMessage",
  "showError",
]);
defineEmits(["update:inputValue"]);
</script>
<template>
  <label class="font-semibold">{{ label }}</label>
  <input
    class="border w-full mt-0.5 rounded-[6px] p-2"
    :placeholder="placeholder"
    @input="$emit('update:inputValue', $event.target.value)"
    :value="inputValue"
    v-bind="$attrs"
  />
  <label v-if="showError" class="text-xs text-red-500">{{
      errorMessage
    }}</label>
</template>
