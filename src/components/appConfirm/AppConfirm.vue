<template>
  <q-dialog v-model="store.prompt.isOpen" persistent>
    <q-card>
      <q-card-section
        style="
          width: 450px;
          max-width: calc(100vw - 48px);
          min-height: 40px;
          margin: 16px 0;
        "
        class="row items-center text-center"
      >
        <span class="q-ml-sm text-center full-width">{{
          store.prompt.text
        }}</span>
      </q-card-section>

      <q-card-actions class="btn-container">
        <q-btn
          v-close-popup
          class="btn-2"
          label="Отменить"
          color="primary"
          @click="store.prompt.onCancel"
        />
        <q-btn
          v-close-popup
          class="btn-1"
          outline
          label="Подтвердить"
          color="primary"
          @click="store.prompt.onSuccess"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { store } from "@/store/store";
</script>

<style scoped>
.btn-container {
  display: flex;
}

.btn-1,
.btn-2 {
  flex: 1;
}

.btn-2 {
  margin-left: 5px;
}
</style>
