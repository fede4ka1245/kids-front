<template>
  <q-btn
      round
      dark-percentage
      unelevated
      text-color="grey-9"
      icon="reply"
      class="button-back q-pl-md q-pt-lg"
      @click="back"
  />
  <h1 class="text-h6 text-weight-bold q-pt-md text-center">
    {{ dateLabel }}
  </h1>
  <div class="flex bi-align-center q-pt-md q-mx-md">
    <div class="text-weight-bold text-left text-green">
      Посещений: {{ stats.attends }}
    </div>
    <div class="q-mx-md text-weight-bold text-left text-red">
      Пропусков: {{ stats.skips }}
    </div>
  </div>
  <div class="q-ma-md">
    <q-btn
        color="primary"
        style="width: 100%"
        outline
        @click="onPreviousAttendsOpen"
        no-caps
        :loading="state.previousAttendsLoading"
    >
      Просмотр последнего сохраненного табеля
    </q-btn>
  </div>
  <default-table
      style="height: max-content; border: 1px gray solid; margin-bottom: 100px; "
      class="q-ma-md"
      :columns="columns"
      :rows="state.attends"
  >
    <template #header-cell-childName="{ props }">
      <q-th style="min-width: 50px; white-space: break-spaces">
        {{ props.col.label }}
      </q-th>
    </template>
    <template #header-cell-name="{ props }">
      <q-th style="width: 50%; white-space: break-spaces">
        {{ props.col.label }}
      </q-th>
    </template>
    <template #body-cell-attend="{ props }">
      <q-td class="flex flex-center">
        <q-checkbox
            left-label
            :model-value="props.row.attend === `Я`"
            :label="props.row.attend"
            @click="() => onToggleAttendClick(props.row)"
        />
      </q-td>
    </template>
  </default-table>
  <div class="q-pt-sm q-pb-lg q-px-sm full-width" style="position: fixed; left: 0; background: white; z-index: 10; bottom: 0; border-top: 1px solid gray">
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
  </div>
<!--  <app-form>-->
    <!--    <q-select-->
<!--      outlined-->
<!--      :model-value="currentAttend?.childName"-->
<!--      :options="state.filteredAttends"-->
<!--      @update:model-value="({ id }) => {-->
<!--        setTargetAttend(id);-->
<!--      }"-->
<!--      @filter="attendsFilter"-->
<!--      use-input-->
<!--      option-label="childName"-->
<!--      option-value="id"-->
<!--      class="q-pt-lg"-->
<!--      label="Ученик"-->
<!--    />-->
<!--    <q-select-->
<!--        outlined-->
<!--        :model-value="currentAttend?.attend"-->
<!--        :options="attendValues"-->
<!--        @update:model-value="updateAttend"-->
<!--        class="q-pt-sm"-->
<!--        label="Значение"-->
<!--    />-->
<!--    <div class="q-mt-auto flex">-->
<!--      <q-btn-->
<!--          class="q-mt-sm q-mr-sm"-->
<!--          style="flex: 1"-->
<!--          color="primary"-->
<!--          outline-->
<!--          @click="getPrevAttend"-->
<!--          no-caps-->
<!--      >-->
<!--	Предыдущий ребенок-->
<!--      </q-btn>-->
<!--      <q-btn-->
<!--          class="q-mt-sm"-->
<!--          color="primary"-->
<!--          style="flex: 1"-->
<!--          outline-->
<!--          @click="getNextAttend"-->
<!--          no-caps-->
<!--      >-->
<!--	Следующий ребенок-->
<!--      </q-btn>-->
<!--    </div>-->
<!--    <q-btn-->
<!--        style="width: 100%"-->
<!--        color="primary"-->
<!--        class="q-mt-sm"-->
<!--        @click="onCloseClick"-->
<!--        :loading="state.loading"-->
<!--        no-caps-->
<!--    >-->
<!--      Сохранить изменения-->
<!--    </q-btn>-->
<!--  </app-form>-->
      <q-dialog
          v-model="state.isPreviousAttendsShown"
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
                @click="togglePreviousAttends"
            />
            <h1 class="text-h6 text-weight-bold q-pt-md text-center">
              Последний сохраненный табель
            </h1>
            <default-table
                style="height: max-content; border: 1px gray solid; margin-top: 24px"
                :columns="columns"
                :rows="state.previousAttends"
            >
              <template #header-cell-childName="{ props }">
                <q-th style="min-width: 50px; white-space: break-spaces">
                  {{ props.col.label }}
                </q-th>
              </template>
              <template #header-cell-name="{ props }">
                <q-th style="width: 50%; white-space: break-spaces">
                  {{ props.col.label }}
                </q-th>
              </template>
              <template #body-cell-attend="{ props }">
                <q-td class="flex flex-center text-grey-7">
                  <q-checkbox
                      left-label
                      disable
                      :model-value="props.row.attend === `Я`"
                      :label="props.row.attend"
                  />
                </q-td>
              </template>
            </default-table>
          </div>
        </div>
      </q-dialog>
</template>

<script setup>
import AppForm from "@/components/form/AppForm";
import {computed, onMounted, reactive} from "vue";
import moment from "moment";
import router, {routes} from "@/router/router";
import {store} from "@/store/store";
import {appAlert} from "@/components/appAlert/appAlert";
import {closeModalPage} from "@/modalPages/helpers/closeModalPage";
import {modalName} from "@/modalPages/helpers/modalName";
import EditMentor from "@/modalPages/modalPages/EditMentor.vue";
import DefaultTable from "@/components/table/DefaultTable.vue";
import {getCurrentAttends} from "@/logic/getAttends";
import {storageKey} from "@/logic/localStorage/storageKey";

const state = reactive({
  loading: false,
  attends: [...store.attends],
  targetIndex: 0,
  filteredAttends: [...store.attends],
  isPreviousAttendsShown: false,
  previousAttendsLoading: false,
  previousAttends: [],
})

const attendValues = [
  "Я", "ПР"
]

const togglePreviousAttends = () => {
  state.isPreviousAttendsShown = !state.isPreviousAttendsShown;
}

const onPreviousAttendsOpen = async () => {
  const groupId = state?.attends?.[0]?.groupId;

  if (!groupId) {
    await appAlert("Данные не найдены! Попробуйте еще раз.");
    state.previousAttendsLoading = false;
    return;
  }

  state.previousAttendsLoading = true;
  const { data, error } = await store.supabase
      .from("PreviousAttends")
      .select("*")
      .eq("groupId", +groupId)

  if (!data || !data?.[0]?.content || error) {
    await appAlert("Данные не найдены!");
    state.previousAttendsLoading = false;
    return;
  }

  const { content } = data?.[0];
  state.previousAttends = JSON.parse(content);

  state.previousAttendsLoading = false;
  togglePreviousAttends();
}

const previousAttendsStats = computed(() => {
  if (!state.previousAttends.length) {
    return {};
  }

  const length = state.previousAttends.length;
  const attends = [...state.previousAttends].filter(({ attend }) => attend === 'Я').length;

  return {
    attends,
    skips: length - attends,
  }
});

const onToggleAttendClick = (row) => {
  const newValue = row.attend === 'Я' ? 'ПР' : 'Я';
  const targetIndex = state.attends.findIndex(({ id }) => row.id === id);

  if (targetIndex === undefined) return;

  state.attends[targetIndex] = {
    ...state.attends[targetIndex],
    attend: newValue
  }
}

const columns = [
  {
    align: "left",
    name: "child",
    field: "childName",
    label: "Имя",
    sortable: false
  },
  {
    align: "center",
    width: "30px",
    name: "attend",
    field: "attend",
    label: "Явка / Пропуск",
  },
];

const stats = computed(() => {
  const length = state.attends.length;
  const attends = [...state.attends].filter(({ attend }) => attend === 'Я').length;

  return {
    attends,
    skips: length - attends,
  }
});

const back = async () => {
  await router.push(routes.tutorPage.path);
}

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

onMounted(async () => {
  if (store.attends?.length) {
    return;
  }
  const user = JSON.parse(localStorage.getItem(storageKey.user));

  state.loading = true;
  const { data, error } = await getCurrentAttends(String(user.data?.group?.groupId).replaceAll(" ", ""), user.data?.organizationId);
  state.loading = false;

  if (data.length === 0 || error) {
    return;
  }

  store.attends = data;
  state.attends = data;
})

const onCloseClick = async () => {
  const groupId = state?.attends?.[0]?.groupId;

  if (!groupId) {
    await appAlert("Данные не найдены! Попробуйте еще раз.");
    return;
  }

  state.loading = true;
  const { error } = await store.supabase
    .from("Attend")
    .upsert(state.attends)
  await store.supabase
      .from("PreviousAttends")
      .upsert([{ groupId: +groupId, content: JSON.stringify(state.attends) }])
  state.loading = false;

  if (!error) {
    await appAlert("Данные сохранены!");
  } else {
    await appAlert("Ошибка при сохранении данных!");
  }

  await back();
}
</script>
