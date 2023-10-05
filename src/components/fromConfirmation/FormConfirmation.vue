<template>
  <section>
    <div style="width: calc(50% - 5px)">
      <q-btn color="primary" outline class="btn" @click="props.dismissHandler">
        Отмена
      </q-btn>
    </div>
    <div style="width: calc(50% - 5px)" @click="props.onDisabledButtonClick">
      <q-btn
        :disable="isConfirmButtonDisabled"
        color="primary"
        class="btn"
        @click="props.confirmHandler"
      >
        {{ props.confirmationButtonLabel || "Сохранить" }}
      </q-btn>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  dismissHandler: {
    type: Function,
    required: true,
  },
  confirmHandler: {
    type: Function,
    required: true,
  },
  onDisabledButtonClick: {
    type: Function,
    default: () => {},
  },
  isConfirmButtonDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  confirmationButtonLabel: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
section {
  display: flex;
  justify-content: space-between;
  margin: 1em 0 1em 0;
}

.btn {
  width: 100%;
}
</style>
