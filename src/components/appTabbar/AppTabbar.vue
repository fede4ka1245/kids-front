<script setup>
import { ref } from "vue";
import { routes } from "@/router/router";
import IOS from "is-ios";

const tabs = [
  {
    icon: "campaign",
    label: "Текущий",
    route: routes.current,
  },
  {
    icon: "folder",
    label: "Все отчеты",
    route: routes.allReports,
  },
  {
    icon: "campaign",
    label: "Фидбэк",
    route: routes.feedback,
  },
];

const targetTabIndex = ref(0);
</script>

<template>
  <div class="app-navbar">
    <q-tabs
      v-model="targetTabIndex"
      narrow-indicator
      dense
      align="justify"
      active-class="text-orange"
    >
      <q-route-tab
        v-for="(tab, tabIndex) in tabs"
        :key="tab.label + tabIndex"
        :name="tabIndex"
        :icon="tab.icon"
        :label="tab.label"
        :to="tab.route"
        :ripple="false"
      >
      </q-route-tab>
    </q-tabs>
    <div v-if="IOS" class="ios" />
  </div>
</template>

<style scoped>
.app-navbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  max-width: 700px;
  margin: 0 auto;
}

.ios {
  height: 14px;
  width: 100%;
}
</style>
