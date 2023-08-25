<template>
  <app-form>
    <h1 class="text-h6 text-weight-bold q-pt-md">
      Регистрация
    </h1>
    <q-input
      outlined
      v-model="state.fullName"
      class="q-pt-lg"
      label="ФИО"
    />
    <q-input
      outlined
      v-model="state.login"
      class="q-pt-sm"
      label="Логин"
    />
    <q-input
      outlined
      v-model="state.password"
      class="q-pt-sm"
      label="Пароль"
      type="password"
    />
    <q-select
      outlined
      use-input
      v-model="state.kindergarten"
      :model-value="state.kindergarten?.name"
      :options="state.kindergartens"
      input-debounce="250"
      option-label="name"
      option-value="id"
      @filter="filterFn"
      class="q-pt-lg"
      label="Садик (ИНН или Имя)"
    />
    <RouterLink class="q-mt-auto" to="/auth">
      <q-btn
        style="width: 100%"
        outline
        color="primary"
        no-caps
      >
        Авторизация
      </q-btn>
    </RouterLink>
    <q-btn
      class="q-mt-sm"
      color="primary"
      @click="onEnterClick"
      :disable="isEnterDisabled"
      no-caps
    >
      Войти
    </q-btn>
  </app-form>
</template>

<script setup>
import AppForm from "@/components/form/AppForm";
import {computed, reactive, watchEffect} from "vue";
import router, {routes} from "@/router/router";
import {store} from "@/store/store";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  fullName: '',
  login: '',
  password: '',
  kindergarten: {},
  kindergartens: []
});

function filterFn (value, update) {
  if (!value) {
    store.supabase
      .from("Organization")
      .select("*")
      .then(({ data }) => {
        if (!data) {
          return;
        }

        update(() => {
          state.kindergartens = data;
        })
      })
    return;
  }

  if (!isNaN(Number(value))) {
    store.supabase
      .from("Organization")
      .select("*")
      .eq("id", value)
      .then(({ data }) => {
        if (!data) {
          return;
        }

        update(() => {
          state.kindergartens = data;
        })
      })
    return;
  }

  store.supabase
    .from("Organization")
    .select("*")
    .textSearch("name", value)
    .then(({ data }) => {
      if (!data) {
        return;
      }

      update(() => {
        state.kindergartens = data;
      })
    })
}

const isEnterDisabled = computed(() => {
  return !(state.fullName && state.password && state.login && state.kindergarten.id);
});

const onEnterClick = async () => {
  const { error } = await store.supabase
    .from("Mentor")
    .insert({
      login: state.login,
      password: state.password,
      fullName: state.fullName,
      organizationId: state.kindergarten.id
    })

  if (error) {
    if (error.code === "23505") {
      if (error.details.toLowerCase().includes('login')) {
        await appAlert("Пользователь с таким Логином уже существует");
      }

      return;
    }

    await appAlert(error.details);

    return;
  }

  store.user.data = {
    login: state.login,
    password: state.password,
    fullName: state.fullName,
    organizationId: state.kindergarten.id
  };
  store.user.isAuth = true;
  router.push({
    path: routes.tutorPage.path,
    replace: true
  });
}

watchEffect(() => {
  if (store.user.isAuth) {
    router.push({
      path: routes.tutorPage.path,
      replace: true
    });
  }
})
</script>
