<template>
  <q-td :class="className">
    <div class="cell">
      {{ props.value }}
    </div>
  </q-td>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    default: "",
    required: false,
    type: [String, Number],
  },
});

const className = computed(() => {
  let sum;
  if (typeof props.value !== "number") {
    sum = Number(props.value.split(" ")[0]);
  } else {
    sum = Number(props.value);
  }

  if (Number(sum) > 0) {
    return "positive";
  } else if (Number(sum) < 0) {
    return "negative";
  } else {
    return "";
  }
});
</script>
