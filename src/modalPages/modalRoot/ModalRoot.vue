<template>
  <q-dialog
    v-model="isOpen"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <div class="content">
      <div class="app-container">
        <q-btn
          round
          dark-percentage
          unelevated
          text-color="grey-9"
          icon="reply"
          class="button-back"
          @click="closeModalPage"
        />
        <EditMentor
          v-if="getIsModalOpen(modalName.modalEditMentor)"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { store } from "@/store/store";
import { computed } from "vue";
import { closeModalPage } from "@/modalPages/helpers/closeModalPage";
import EditMentor from "@/modalPages/modalPages/EditMentor.vue";
import {modalName} from "@/modalPages/helpers/modalName";

const getIsModalOpen = (modal) => {
  return store.modalPages.activePageName === modal;
};

const isOpen = computed(() => {
  return store.modalPages.isModalOpen;
});
</script>

<style>
.button-back {
  width: 50px;
  height: 50px;
}

.content {
  padding: 0 1em 0 1em;
}

.item {
  padding-bottom: 5px;
}
</style>
