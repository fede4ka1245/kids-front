<template>
  <text-header> {{ props.header || 'Редактировать воспитателя' }} </text-header>
  <q-input
    class="q-mb-sm"
    outlined
    v-model="state.fullName"
    :onBlur="onBlur"
    label="ФИО воспитателя"
  />
  <q-input
    class="q-mb-sm"
    outlined
    v-model="state.login"
    label="Логин"
  />
  <q-select
    outlined
    use-input
    v-model="state.group"
    :model-value="state?.group?.name"
    :options="state.groups"
    input-debounce="250"
    option-label="name"
    option-value="id"
    @filter="filterFn"
    class="q-mb-sm"
    label="Группа"
  />
  <q-input
    class="q-mb-sm"
    outlined
    v-model="state.password"
    label="Пароль воспитателя"
  />
  <form-confirmation
    :dismiss-handler="closeModalPage"
    :confirm-handler="onConfirm"
    :is-confirm-button-disabled="isConfirmButtonDisabled"
  />
</template>

<script setup>
import { store } from "@/store/store";
import {reactive, computed, watchEffect} from "vue";
import { closeModalPage } from "@/modalPages/helpers/closeModalPage";
import FormConfirmation from "@/components/fromConfirmation/FormConfirmation";
import TextHeader from "@/components/textHeader/TextHeader";
import { transliterate } from "@/modalPages/helpers/transliterate";
import moment from "moment";

const props = store.modalPages.props;
const state = reactive({
  fullName: "",
  password: moment().unix(),
  login: "",
  group: {
    name: '',
    id: ''
  },
  groups: [],
  ...props.mentor
});

const isConfirmButtonDisabled = computed(() => {
  return !state.password || !state.fullName || !state.login;
});

const onBlur = () => {
  if (!state.fullName || state.login) {
    return;
  }

  state.login = transliterate(state.fullName).split(" ")[0].toLowerCase() + Math.floor(moment().unix() % 1000)
};

const onConfirm = () => {
  props.onSave({
    ...state
  });
  closeModalPage();
};

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
</script>

<style scoped></style>