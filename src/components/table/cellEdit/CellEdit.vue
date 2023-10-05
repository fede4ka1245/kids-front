<template>
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
            @click="props.fix"
          >
            <div class="full-width text-lefts">Изменить</div>
          </q-item>
          <q-item
            v-close-popup
            class="flex-center"
            clickable
            @click="onDeleteClick"
          >
            <div class="full-width text-lefts">Удалить</div>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-td>
</template>

<script setup>
import { appConfirm } from "@/components/appConfirm/appConfirm";

const onDeleteClick = async () => {
  const result = await appConfirm("Вы уверены, что хотите удалить значение?");

  if (result) {
    props.delete();
  }
};

const props = defineProps({
  fix: {
    type: Function,
    default: undefined,
  },
  delete: {
    type: Function,
    default: undefined,
  },
});
</script>
