<template>
  <q-input
    outlined
    :model-value="props.date"
    :error="props.error"
    place
    label="Дата"
  >
    <q-popup-proxy ref="popup" color="orange" cover>
      <q-date
        :model-value="props.date"
        :options="options"
        mask="DD.MM.YYYY"
        color="orange"
        @update:model-value="onDateChange"
      >
      </q-date>
    </q-popup-proxy>
  </q-input>
</template>

<script setup>
import { getFormattedCurrentDate } from "@/logic/reports/getFormattedCurrentDate";
import { ref } from "vue";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  onDateChange: {
    type: Function,
    required: true,
  },
  error: {
    type: Boolean,
    default: () => false,
  },
});

const popup = ref(null);
const onDateChange = (date) => {
  props.onDateChange(date);
  popup?.value?.hide();
};

const options = (date) => {
  const [year, month, day] = [...date.split("/")].map((datePart) =>
    Number(datePart)
  );
  const [currentDay, currentMonth, currentYear] = [
    ...getFormattedCurrentDate().split("."),
  ].map((datePart) => Number(datePart));

  if (
    year > currentYear ||
    (year === currentYear && month > currentMonth) ||
    (year === currentYear && month === currentMonth && day > currentDay)
  ) {
    return false;
  } else {
    return true;
  }
};
</script>
