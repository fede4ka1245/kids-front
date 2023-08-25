<template>
  <app-form>
    <h1 class="text-h6 text-weight-bold q-pt-md">
      Авторизация
    </h1>
    <q-input
        outlined
        v-model="state.login"
        class="q-pt-lg"
        label="Логин"
    />
    <q-input
        outlined
        v-model="state.password"
        class="q-pt-sm"
        label="Пароль"
        type="password"
    />
    <RouterLink class="q-mt-auto" to="/reg">
      <q-btn
        style="width: 100%"
        outline
        color="primary"
        no-caps
      >
        Регистрация
      </q-btn>
    </RouterLink>
    <q-btn
      class="q-mt-sm"
      color="primary"
      :disable="isEnterDisabled"
      @click="onEnterClick"
      no-caps
    >
      Войти
    </q-btn>
  </app-form>
</template>

<script setup>
import AppForm from "@/components/form/AppForm";
import {computed, reactive, watch, watchEffect} from "vue";
import router, {routes} from "@/router/router";
import {store} from "@/store/store";
import {storageKey} from "@/helpers/localStorage/storageKey";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  login: '',
  password: ''
})

const isEnterDisabled = computed(() => {
  return !(state.password && state.login);
});

const onEnterClick = async () => {
  const { error, data } = await store.supabase
      .from("Mentor")
      .select("*")
      .eq("login", state.login)
      .eq("password", state.password)

  if (error || !data[0]) {
    await appAlert("Пользователь не найден!");
    return;
  }

  store.user.data = data[0];
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
