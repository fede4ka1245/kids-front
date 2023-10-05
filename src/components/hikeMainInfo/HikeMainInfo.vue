<template>
  <q-select
    ref="reportInput"
    :options="data.filteredRoutes"
    option-label="name"
    class="item"
    outlined
    use-input
    label="Маршрут"
    :model-value="props.hike.name"
    :error="props.isNameError"
    @update:model-value="onRouteUpdate"
    @filter="filterSearch"
  >
  </q-select>
  <q-select
    :options="data.hikes"
    :option-label="getDateOptionLabel"
    :model-value="props.hike?.dates"
    :error="props.isDateError"
    class="item"
    outlined
    label="Сроки"
    popup-content-style="width: 50vh"
    @update:model-value="onDateUpdate"
    @filter="filterSearch"
  />
</template>

<script setup>
import { reactive, ref } from "vue";

const reportInput = ref();

const props = defineProps({
  hike: {
    type: Object,
    required: true,
  },
  updateHikeName: {
    type: Function,
    required: true,
  },
  updateHikeInformation: {
    type: Function,
    required: true,
  },
  isNameError: {
    type: Boolean,
    default: () => false,
  },
  isDateError: {
    type: Boolean,
    default: () => false,
  },
});

const onRouteUpdate = (targetRoute) => {
  setTimeout(() => reportInput.value.blur(), 0);
  if (!targetRoute?.name) {
    props.updateHikeName("");
    props.updateHikeInformation("", "", "", "", "");
    data.hikes = [];
    data.targetRouteId = "";
    return;
  }

  props.updateHikeName(targetRoute?.name);
  props.updateHikeInformation("", "", "", "", "");
  data.hikes = targetRoute.hikes;
  data.targetRouteId = targetRoute.id;
};

const onDateUpdate = (targetHike) => {
  props.updateHikeInformation(
    [targetHike.beginDate, targetHike.endDate].join(" - "),
    targetHike.id,
    data.targetRouteId,
    targetHike.coordinator,
    targetHike.instructor
  );
};

const getDateOptionLabel = (optionHike) => {
  if (!optionHike) {
    return "";
  }

  if (!optionHike.beginDate) {
    return optionHike;
  }

  const hikeDates = [optionHike?.beginDate, optionHike?.endDate].join(" - ");
  if (!optionHike?.instructor) {
    return hikeDates;
  }
  return hikeDates + " (" + optionHike.instructor + ")";
};

const data = reactive({
  routes: [],
  filteredRoutes: [],
  hikes: [],
  targetRouteId: "",
});

async function filterSearch(input, update) {
  if (data.routes.length) {
    data.filteredRoutes = data.routes.filter((route) =>
      route.name.toLowerCase().includes(input.toLowerCase())
    );
    update();

    return;
  }

  data.routes = await cachedRequestRoutes();
  data.filteredRoutes = [...data.routes];
  update();

  if (props.hike.name) {
    const targetRoute = data.routes.find(
      (route) => route.name === props.hike.name
    );

    data.hikes = targetRoute.hikes;
    data.targetRouteId = targetRoute.id;
  }
}
</script>

<style scoped>
.item {
  padding: 0;
  margin-bottom: 5px;
}
</style>
