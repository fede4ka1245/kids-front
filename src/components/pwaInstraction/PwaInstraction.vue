<template>
  <q-dialog
    persistent
    :model-value="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    v-model="state.isOpen"
    maximized
  >
    <div style="border-radius: 20px 20px 0 0 !important;" class="dialog-content main">
      <q-btn
        round
        dark-percentage
        unelevated
        text-color="grey-9"
        icon="close"
        @click="() => state.isOpen = !state.isOpen"
      />
      <iframe class="iframe" src="/pwa/pwa.html"/>
    </div>
  </q-dialog>
</template>

<script setup>
import {onMounted, reactive} from "vue";

const state = reactive({
  isOpen: false
})

onMounted(() => {
  if((window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')) {
    return;
  }

  state.isOpen = true;
})
</script>


<style scoped>
.main {
  max-width: 850px;
  margin: 0 auto;
  overflow: scroll;
}

.dialog-content {
  padding: 1em;
  margin-top: 5em;
  background: white;
  overflow: hidden !important;
}

.iframe {
  outline: none;
  width: 100%;
  height: 100%;
  border: none;
  margin-top: -10px;
  padding-bottom: 90px;
  flex: 1;
}
</style>

