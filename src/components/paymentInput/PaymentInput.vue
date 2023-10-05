<template>
  <div class="main">
§
    <div class="code">
      <money-code-select
        :model-value="props.code"
        :current-codes="props.codes"
        :on-code-select="props.updateCode"
        :is-error="props.moneyCodeError"
        :is-multiply="false"
      />
    </div>
    <!--    <q-select-->
    <!--      class="code"-->
    <!--      outlined-->
    <!--      use-input-->
    <!--      label="Валюта"-->
    <!--      :options="moneyCodes"-->
    <!--      :model-value="props.code"-->
    <!--      :error="props.moneyCodeError"-->
    <!--      @update:model-value="props.updateCode"-->
    <!--      @filter="filter"-->
    <!--    />-->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MoneyCodeSelect from "@/components/moneyCodeSelect/MoneyCodeSelect.vue";

const props = defineProps({
  codes: {
    type: Array,
    default: () => [],
  },
  code: {
    type: String,
    default: () => "",
  },
  updateCode: {
    type: Function,
    default: undefined,
  },
  sum: {
    type: String,
    default: () => "",
  },
  updateSum: {
    type: Function,
    required: true,
  },
  moneyCodeError: {
    type: Boolean,
    default: () => false,
  },
  sumError: {
    type: Boolean,
    default: () => false,
  },
});

let moneyCodes = ref(props.codes);

const filter = (value, update) => {
  update(() => {
    if (value === "") {
      moneyCodes.value = props.codes;
    } else {
      const needle = value.toLowerCase();
      moneyCodes.value = props.codes.filter((code) =>
        code.toLowerCase().startsWith(needle)
      );
    }
  });
};

onMounted(() => {
  if (props.codes?.length === 1) {
    props.updateCode(props.codes[0]);
  }
});
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.sum {
  flex: 1;
  height: 100%;
  padding: 0;
}

.code {
  width: 40%;
  overflow: hidden;
  max-height: 100%;
  margin-left: 6px;
  padding: 0;
}
</style>
