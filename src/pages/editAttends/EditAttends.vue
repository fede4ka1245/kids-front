<template>
  <app-form>
    <h1 class="text-h6 text-weight-bold q-pt-md text-center">
      {{ dateLabel }}
    </h1>
    <q-select
      outlined
      :model-value="currentAttend?.childName"
      :options="state.filteredAttends"
      @update:model-value="({ id }) => {
        setTargetAttend(id);
      }"
      @filter="attendsFilter"
      use-input
      option-label="childName"
      option-value="id"
      class="q-pt-lg"
      label="Ученик"
    />
    <q-select
        outlined
        :model-value="currentAttend?.attend"
        :options="attendValues"
        @update:model-value="updateAttend"
        class="q-pt-sm"
        label="Значение"
    />
    <div class="q-mt-auto flex">
      <q-btn
          class="q-mt-sm q-mr-sm"
          style="flex: 1"
          color="primary"
          outline
          @click="getPrevAttend"
          no-caps
      >
	Предыдущий ребенок
      </q-btn>
      <q-btn
          class="q-mt-sm"
          color="primary"
          style="flex: 1"
          outline
          @click="getNextAttend"
          no-caps
      >
	Следующий ребенок
      </q-btn>
    </div>
    <q-btn
        style="width: 100%"
        color="primary"
        class="q-mt-sm"
        @click="onCloseClick"
        :loading="state.loading"
        no-caps
    >
      Сохранить изменения
    </q-btn>
  </app-form>
</template>

<script setup>
import AppForm from "@/components/form/AppForm";
import {computed, reactive} from "vue";
import moment from "moment";
import router, {routes} from "@/router/router";
import {store} from "@/store/store";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  loading: false,
  attends: [...store.attends],
  targetIndex: 0,
  filteredAttends: [...store.attends]
})

const attendValues = [
  "Я", "ПР"
]

const currentAttend = computed(() => {
  return state.attends[state.targetIndex]
});

const updateAttend = (value) => {
  state.attends[state.targetIndex] = {
    ...state.attends[state.targetIndex],
    attend: value
  }
}

const getNextAttend = () => {
  if (state.targetIndex === state.attends.length - 1) {
    state.targetIndex = 0;
  } else {
    state.targetIndex++;
  }
}

const getPrevAttend = () => {
  if (state.targetIndex === 0) {
    state.targetIndex = state.attends.length - 1;
  } else {
    state.targetIndex--;
  }
}

const filterAttendsByName = (targetName) => {
  if (!targetName) {
    return [...state.attends];
  }

  return [...state.attends].filter(({ childName }) => {
    return childName.toLowerCase().includes(targetName.toLowerCase());
  })
}

function attendsFilter (value, update) {
  const filtered = filterAttendsByName(value);

  update(() => {
    state.filteredAttends = filtered;
  })
}

const setTargetAttend = (targetId) => {
  state.targetIndex = state.attends.findIndex(({ id }) => id === targetId);
}

const dateLabel = computed(() => {
  return `Заполните посещаемость за ${moment().format('DD.MM')}`
})

const onCloseClick = async () => {
  state.loading = true;
  const { error } = await store.supabase
    .from("Attend")
    .upsert(state.attends)
  state.loading = false;

  await router.push(routes.tutorPage.path);

  if (!error) {
    await appAlert("Данные сохранены!");
  } else {
    await appAlert("Ошибка при сохранении данных!");
  }
}
</script>
