<template>
  <q-dialog v-model="store.alert.isOpen">
    <q-card>
      <q-card-section
        style="
          width: 450px;
          max-width: calc(100vw - 48px);
          min-height: 40px;
          margin: 16px 0;
        "
        class="q-pt-none"
      >
        {{ store.alert.text }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Хорошо" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { store } from "@/store/store";
</script>
