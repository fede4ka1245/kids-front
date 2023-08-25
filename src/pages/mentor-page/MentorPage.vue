<template>
  <app-form>
    <div class="flex q-mt-md">
      <q-avatar color="grey" size="90px">
        <h1 style="font-size: 32px; line-height: 32px" class="text-h4 text-weight-bold text-white">
          {{ avatarLabel }}
        </h1>
      </q-avatar>
      <div style="flex: 1" class="flex column q-ml-md">
        <h6 style="font-size: 23px; line-height: 23px" class="text-h6 text-weight-bold q-mt-sm">
          {{ store.user.data?.fullName }}
        </h6>
        <h6 style="font-size: 15px; line-height: 15px" class="text-weight-bold q-mt-sm text-primary">
          Воспитатель
        </h6>
      </div>
    </div>
    <q-select
      outlined
      disable
      :model-value="store.user?.data?.childgarten?.name"
      class="q-pt-lg"
      label="Садик"
    />
    <q-select
      outlined
      use-input
      v-model="store.user.data.group"
      :model-value="store.user.data?.group?.name"
      :options="state.groups"
      input-debounce="250"
      option-label="name"
      option-value="id"
      @filter="filterFn"
      class="q-pt-sm"
      label="Группа"
    />
    <q-btn
        style="width: 100%"
        color="primary"
        class="q-mt-auto"
        @click="onEditAttendsClick"
        :disable="isLogoutDisable"
        no-caps
        :loading="state.isEditLoading"
    >
      {{ dateLabel }}
    </q-btn>
    <q-btn
      class="q-mt-sm"
      color="negative"
      outline
      no-caps
      @click="onLogout"
    >
      Выйти
    </q-btn>
  </app-form>
</template>

<script setup>
import AppForm from "@/components/form/AppForm";
import {computed, reactive, watchEffect} from "vue";
import moment from "moment";
import router, {routes} from "@/router/router";
import {appConfirm} from "@/components/appConfirm/appConfirm";
import {storageKey} from "@/helpers/localStorage/storageKey";
import {store} from "@/store/store";
import {getCurrentAttends} from "@/modalPages/helpers/getAttends";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  groups: [],
  isEditLoading: false
})

const onEditAttendsClick = async () => {
  state.isEditLoading = true;
  const { data, error } = await getCurrentAttends(store.user.data.groupId, store.user.data.organizationId);
  state.isEditLoading = false;

  if (data.length === 0 || error) {
    await appAlert("Редактирование невозможно. Обратитесь к заведующей.");
    return;
  }

  store.attends = data;
  router.push(routes.editAttends.path);
}

const dateLabel = computed(() => {
  return `Заполнить посещаемость за ${moment().format('DD.MM')}`
})

const avatarLabel = computed(() => {
  if (!store.user.data?.fullName) {
    return '';
  }

  if (store.user.data?.fullName.split(" ").length < 1) {
    return store.user.data?.fullName.split(" ")[0][0].toUpperCase();
  }

  return (store.user.data?.fullName.split(" ")[0][0]
      + store.user.data?.fullName.split(" ")[1][0]).toUpperCase();
})

const isLogoutDisable = computed(() => {
  return !store.user.data?.group?.name;
});

function filterFn (value, update) {
  if (!value) {
    store.supabase
      .from("Group")
      .select("*")
      .eq("organizationId", store.user.data?.organizationId)
      .then(({ data }) => {
        if (!data) {
          return;
        }

        update(() => {
          state.groups = data;
        })
      })
    return;
  }

  store.supabase
    .from("Group")
    .select("*")
    .eq("organizationId", store.user.data?.organizationId)
    .textSearch("name", value)
    .then(({ data }) => {
      if (!data) {
        return;
      }

      update(() => {
        state.groups = data;
      })
    })
}

const onLogout = async () => {
  if (!await appConfirm('Вы уверены, что хотите выйти?')) {
    return;
  }

  store.user.isAuth = false;
  store.user.data = undefined;
  localStorage.removeItem(storageKey.user);
  router.push({
    path: routes.auth.path,
    replace: true
  });
}

watchEffect(async () => {
  if (!store.user.data?.group?.id) {
    return;
  }

  store.user.data.groupId = store.user.data?.group?.id;
  await store.supabase
    .from('Mentor')
    .update({ groupId: store.user.data?.group?.id })
    .eq("id", store.user.data.id)
})
</script>
