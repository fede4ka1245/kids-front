<template>
  <div class="app">
    <div class="app-container">
      <router-view></router-view>
      <div>
        <modal-root />
      </div>
      <app-loader
        v-if="store.loading"
      />
      <app-confirm />
      <app-alert />
      <pwa-instraction />
    </div>
  </div>
</template>

<script setup>
import ModalRoot from "@/modalPages/modalRoot/ModalRoot";
import {onMounted, watch, watchEffect} from "vue";
import AppConfirm from "@/components/appConfirm/AppConfirm.vue";
import AppAlert from "@/components/appAlert/AppAlert.vue";
import { appAlert } from "@/components/appAlert/appAlert";
import {storageKey} from "@/helpers/localStorage/storageKey";
import {store} from "@/store/store";
import AppLoader from "@/components/appLoader/AppLoader";
import PwaInstraction from "@/components/pwaInstraction/PwaInstraction";

onMounted(() => {
  if (localStorage.getItem(storageKey.user)) {
    store.user = JSON.parse(localStorage.getItem(storageKey.user));

    if (store.user?.data?.id) {
      store.supabase
        .from("Mentor")
        .select("*")
        .eq("id", store.user?.data?.id)
        .then(async ({data, error}) => {
          if (!data[0] || error) {
            store.user.isAuth = false;
            return;
          }

          store.user.data = { ...store.user.data, ...data[0] };
          store.user.isAuth = true;
        })
    } else {
      store.user.isAuth = false;
    }
  }

  window.onerror = (msg) => {
    appAlert(msg);
  };
});

watchEffect(async () => {
  if (store.user?.data?.organizationId) {
    store.user.data.childgarten = await store.supabase
      .from("Organization")
      .select("*")
      .eq("id", store.user?.data?.organizationId)
      .then(({ data }) => {
        return data[0];
      })
  }
});

watchEffect(async () => {
  if (store.user?.data?.groupId) {
    store.user.data.group = await store.supabase
      .from("Group")
      .select("*")
      .eq("id", store.user?.data?.groupId)
      .then(({ data }) => {
        return data[0];
      })
  }
});

watch(
    () => store.user,
    (newValue) => {
      localStorage.setItem(storageKey.user, JSON.stringify(newValue));
    },
    { deep: true }
)
</script>

<style>
* {
  overscroll-behavior-y: none;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.content {
  padding: 1em;
}

.app-container {
  max-width: 650px;
  margin: 0 auto;
}

.app {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
