<template>
  <div class="flex column q-ma-lg">
    <h1 class="text-h5 text-weight-bold q-pt-md">
      Администрирование организацией "{{ store.user.data?.childgarten?.name }}"
    </h1>
    <h1 class="text-h6 text-weight-bold q-pt-md">
      Воспитатели
    </h1>
    <default-table
      :loading="state.isMentorsLoading"
      class="q-mt-sm"
      :columns="mentorsColumns"
      :rows="rows"
    >
      <template #header-cell-edit="{ props }">
        <q-th style="min-width: 50px; white-space: break-spaces">
          {{ props.col.label }}
        </q-th>
      </template>
      <template #header-cell-mentor="{ props }">
        <q-th style="width: 50%; white-space: break-spaces">
          {{ props.col.label }}
        </q-th>
      </template>
      <template #header-cell-group="{ props }">
        <q-th style="width: 50%; white-space: break-spaces">
          {{ props.col.label }}
        </q-th>
      </template>
      <template #body-cell-edit="{ props }">
        <q-td class="flex flex-center">
          <q-btn
            style="width: 32px; height: 32px"
            round
            flat
            color="grey"
            icon="more_horiz"
          >
            <q-menu style="width: 180px">
              <q-list>
                <q-item
                  v-close-popup
                  class="flex-center"
                  clickable
                  @click="() => onEdit(props.row)"
                >
                  <div class="full-width text-lefts">Изменить</div>
                </q-item>
                <q-item
                  v-close-popup
                  class="flex-center danger"
                  clickable
                  @click="() => onDelete(props.row)"
                >
                  <div class="full-width text-lefts text-red-7">Удалить</div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </default-table>
    <div class="flex justify-center q-mb-md q-mt-md">
      <q-btn
        style="border-radius: 50%; width: 50px; height: 50px"
        icon="add"
        text-color="primary"
        @click="addMentor"
      />
    </div>
    <q-btn
      class="q-mt-lg"
      color="negative"
      outline
      no-caps
      @click="onLogout"
    >
      Выйти
    </q-btn>
  </div>
</template>

<script setup>
import {store} from "@/store/store";
import {appConfirm} from "@/components/appConfirm/appConfirm";
import {storageKey} from "@/logic/localStorage/storageKey";
import router, {routes} from "@/router/router";
import DefaultTable from "@/components/table/DefaultTable.vue";
import {computed, reactive, watchEffect} from "vue";
import {openModalPage} from "@/modalPages/helpers/openModalPage";
import {modalName} from "@/modalPages/helpers/modalName";
import {appAlert} from "@/components/appAlert/appAlert";

const state = reactive({
  mentors: [],
  groups: [],
  isMentorsLoading: false
});

const mentorsColumns = [
  {
    align: "left",
    name: "mentor",
    field: "mentor",
    label: "Воспитатель",
    sortable: false
  },
  {
    align: "left",
    name: "group",
    field: "group",
    label: "Группа",
    sortable: false
  },
  {
    align: "center",
    width: "30px",
    name: "edit",
    field: "edit",
  },
];

const rows = computed(() => {
  return [...state.mentors.map((mentor) => {

    return {
      ...mentor,
      mentor: mentor?.fullName,
      group: mentor?.groupName,
    };
  })];
});

const onEdit = async (mentor) => {
  const {
    fullName,
    login,
    password,
    group
  } = await openModalPage(modalName.modalEditMentor, {
    header: "Редактировать воспитателя",
    mentor: {
      fullName: mentor.fullName,
      login: mentor.login,
      password: mentor.password,
      group: mentor?.mentorGroup
    }
  });

  const { error, data } = await store.supabase
    .from("Mentor")
    .upsert({
      id: mentor.id,
      login: login,
      password: password,
      fullName: fullName,
      organizationId: store.user.data.kindergarten?.id,
      groupId: group.id
    })
    .select("*");

  if (error || !data) {
    await appAlert("Ошибка обновления пользователя!");
  } else {
    const mewMentors = [...state.mentors];
    const targetIndex = state.mentors.findIndex(({ id }) => mentor?.id === id);

    mewMentors[targetIndex] = {
      id: mentor.id,
      login: login,
      password: password,
      fullName: fullName,
      organizationId: store.user.data.kindergarten?.id,
      groupId: group.id,
      groupName: group.name,
      mentorGroup: group
    }

    state.mentors = mewMentors;
  }

  store.loading = false;

  store.loading = false;
}

const onDelete = async (mentor) => {
  if (!await appConfirm("Вы уверены, что хотите удалить пользователя?")) {
    return;
  }

  store.loading = true;

  const { error } = await store.supabase
    .from("Mentor")
    .delete()
    .eq("id", mentor.id);

  if (error) {
    await alert("Ошибка при удалении пользователя");
  } else {
    state.mentors = [...state.mentors].filter(({ id }) => {
      return id !== mentor.id;
    });
  }

  store.loading = false;
}

watchEffect(async () => {
  state.isMentorsLoading = true;

  try {
    const groups = await store.supabase
      .from("Group")
      .select("*")
      .eq("organizationId", store.user.data?.childgarten?.id)
      .then(({ data }) => {
        return data;
      })
    const mentors = await store.supabase
      .from("Mentor")
      .select("*")
      .eq("organizationId", store.user.data?.childgarten?.id)
      .then(({ data }) => {
        return data;
      });

    state.mentors = [...mentors.map((mentor) => {
      const group = groups.find((group) => mentor?.groupId === group?.id);

      return {
        ...mentor,
        groupName: group?.name,
        mentorGroup: group
      }
    })];
    state.groups = groups;
  } finally {
    state.isMentorsLoading = false;
  }
});

const addMentor = async () => {
  const {
    fullName,
    login,
    password,
    group
  } = await openModalPage(modalName.modalEditMentor, {
    header: "Добавить воспитателя"
  });

  store.loading = true;

  const { error, data } = await store.supabase
    .from("Mentor")
    .insert({
      login: login,
      password: password,
      fullName: fullName,
      organizationId: store.user.data.kindergarten?.id,
      groupId: group.id
    })
    .select("*")

  if (error || !data) {
    if (error.code === "23505") {
      if (error.details.toLowerCase().includes('login')) {
        await appAlert("Пользователь с таким Логином уже существует");
      }
    }

    await appAlert("Ошибка сохранения пользователя!");
  } else {
    state.mentors.push({
      id: data[0]?.id,
      fullName,
      login,
      password,
      mentorGroup: group,
      groupName: group.name
    });
  }

  store.loading = false;
};

const onLogout = async () => {
  if (!await appConfirm('Вы уверены, что хотите выйти?')) {
    return;
  }

  store.user.isAuth = false;
  store.user.isAdmin = false;
  store.user.data = undefined;
  localStorage.removeItem(storageKey.user);
  router.push({
    path: routes.auth.path,
    replace: true
  });
}
</script>