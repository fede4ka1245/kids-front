<template>
  <app-form>
    <h1 class="text-h6 text-weight-bold q-pt-md">
      Вход в админ панель организации
    </h1>
    <q-form
      autocomplete="new-password"
    >
      <q-select
        outlined
        aria-autocomplete="none"
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
        autocomplete="new-password"
      />
      <q-input
        outlined
        aria-autocomplete="none"
        autocomplete="new-password"
        v-model="state.secretCode"
        class="q-pt-sm"
        label="Секретный код"
        type="password"
      />
    </q-form>
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
import {computed, reactive} from "vue";
import router, {routes} from "@/router/router";
import {store} from "@/store/store";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  secretCode: '',
  kindergarten: {
    name: '',
    id: ''
  },
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
  return !(state.secretCode && state.kindergarten.id);
});

const onEnterClick = async () => {
  store.loading = true;

  const { data } = await store.supabase
    .from("Organization")
    .select("*")
    .eq("secretCode", state.secretCode)
    .eq("id", state.kindergarten.id)

  if (data) {
    store.user.data = {
      organizationId: state.kindergarten.id,
      kindergarten: state.kindergarten
    };
    store.user.isAdmin = true;
    store.user.isAuth = true;
    router.push({
      path: routes.adminPage.path,
      replace: true
    });
    store.loading = false;
    return;
  }

  appAlert('Ошибка при входа, проверьте, что верно указали "Секрктный код"');
  store.loading = false;
}
</script>
