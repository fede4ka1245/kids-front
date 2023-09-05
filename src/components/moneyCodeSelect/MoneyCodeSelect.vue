<template>
  <q-select
    v-if="props.isMultiply"
    ref="select"
    :model-value="props.modelValue"
    :options="dynamicMoneyCodes"
    :option-label="getOptionLabel"
    outlined
    multiple
    label="Валюты"
    use-input
    use-chips
    input-debounce="2"
    popup-content-style="height: 50vh"
    @filter="filter"
    @add="onMoneyCodeAdd"
    @remove="onMoneyCodeRemove"
  >
    <template #selected-item="scope">
      <q-chip
        removable
        dense
        :tabindex="scope.index"
        @remove="
          () => {
            onMoneyCodeRemove({ index: scope.index });
          }
        "
      >
        {{ scope.opt }}
      </q-chip>
    </template>
  </q-select>
  <q-select
    v-else
    ref="select"
    :model-value="props.modelValue"
    :options="dynamicMoneyCodes"
    :option-label="getOptionLabel"
    outlined
    label="Валюты"
    use-input
    input-debounce="2"
    popup-content-style="height: 50vh"
    @filter="filter"
    @update:model-value="onMoneyCodeUpdate"
  >
    <template #selected-item="scope">
      {{ scope.opt }}
    </template>
  </q-select>
</template>

<script setup>
import { ref } from "vue";
import { getRates } from "@/logic/reports/getRates";
import { getMoneyCodes } from "@/logic/reports/getMoneyCodes";

const props = defineProps({
  modelValue: {
    required: true,
    type: null,
  },
  onCodeSelect: {
    type: Function,
    required: true,
  },
  onCodeRemove: {
    type: Function,
    default: () => undefined,
  },
  isError: {
    type: Boolean,
    default: () => false,
  },
  isMultiply: {
    type: Boolean,
    default: () => true,
  },
  currentCodes: {
    type: Array,
    default: () => getMoneyCodes(),
  },
});

const dynamicMoneyCodes = ref(props.currentCodes);
const rates = getRates();
const select = ref(null);

const onMoneyCodeUpdate = (moneyCode) => {
  props.onCodeSelect(moneyCode);
};

const onMoneyCodeAdd = ({ value }) => {
  select.value?.updateInputValue("");
  props.onCodeSelect(value);
};

const onMoneyCodeRemove = ({ index }) => {
  props.onCodeRemove(index);
};

const getOptionLabel = (option) => {
  return `${option} (${rates[option]?.name})`;
};

const filter = (value, update) => {
  update(() => {
    if (value === "") {
      dynamicMoneyCodes.value = props.currentCodes;
    } else {
      const input = value.toLowerCase();
      dynamicMoneyCodes.value = props.currentCodes.filter(
        (code) =>
          rates[code].name.toLowerCase().includes(input) ||
          code.toLowerCase().startsWith(input)
      );
    }
  });
};
</script>
