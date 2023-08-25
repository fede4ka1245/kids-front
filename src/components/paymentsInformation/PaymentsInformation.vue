<template>
  <section v-for="payment in props.payments" :key="payment.label">
    <text-header :description="payment.description || '-'">{{
      payment.label
    }}</text-header>
    <payments-table
      :edit="(index) => edit(payment, index)"
      :remove="(index) => remove(payment, index)"
      :columns="getPaymentColumns(payment)"
      :rows="getRows(payment)"
    />
    <button-add :handler="() => add(payment)" />
  </section>
</template>

<script setup>
import TextHeader from "@/components/textHeader/TextHeader";
import ButtonAdd from "@/components/buttonAdd/ButtonAdd";
import PaymentsTable from "@/components/paymentsTable/PaymentsTable";
import { paymentsColumns } from "@/components/paymentsTable/paymentsColumns";
import { officePaymentColumns } from "@/components/paymentsTable/officePaymentColumns";
import { openModalPage } from "@/modalPages/helpers/openModalPage";
import { modalName } from "@/modalPages/helpers/modalName";
import { formatNumber } from "@/helpers/formatNumber";
import { getModalHeader } from "@/helpers/reports/getModalHeader";
import { paymentTableType } from "@/helpers/paymentTableType";

const getPaymentColumns = (payment) => {
  if (payment.type === paymentTableType.office) {
    return officePaymentColumns;
  }

  return paymentsColumns;
};

const remove = (payment, index) => {
  payment.payments.splice(index, 1);
};

const getRows = (payment) => {
  return payment.payments.map((targetPayment) => ({
    ...targetPayment,
    sum: `${formatNumber(targetPayment.sum)} ${targetPayment.moneyCode}`,
  }));
};

const edit = (payment, index) => {
  openModalPage(modalName.modalPayment, {
    saveData: (newPayment) => {
      payment.payments[index] = newPayment;
    },
    payment: payment.payments[index],
    moneyCodes: props.moneyCodes,
    type: payment.type,
    header: getModalHeader({
      value: payment.label,
      isEdit: true,
      type: payment.type,
    }),
    isNegativeSum: props.tablesWithNegativesSums.includes(payment.type),
  });
};

const add = (payment) => {
  openModalPage(modalName.modalPayment, {
    type: payment.type,
    saveData: (_payment) => payment.payments.push(_payment),
    moneyCodes: props.moneyCodes,
    header: getModalHeader({ value: payment.label, type: payment.type }),
    isNegativeSum: props.tablesWithNegativesSums.includes(payment.type),
  });
};

const props = defineProps({
  remove: {
    type: Function,
    default: undefined,
  },
  edit: {
    type: Function,
    default: undefined,
  },
  add: {
    type: Function,
    default: undefined,
  },
  payments: {
    type: Array,
    default: () => [],
  },
  moneyCodes: {
    type: Array,
    default: () => [],
  },
  tablesWithNegativesSums: {
    type: Array,
    default: () => [],
  },
});
</script>
