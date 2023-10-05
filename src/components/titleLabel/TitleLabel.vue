<template>
  <div class="main">
    <h1 class="title">
      {{ props.title }}
    </h1>
    <p class="label">
      {{ props.label || "-" }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: () => "",
  },
  title: {
    type: String,
    default: () => "",
  },
});
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  padding: 0;
  margin: 0 0 3px 0;
  line-height: 1;
}

.label {
  font-weight: 700;
  font-size: 16px;
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>
