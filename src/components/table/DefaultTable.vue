<template>
  <div class="wrapper">
    <q-table
      virtual-scroll
      class="app-table"
      separator="cell"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :hide-header="tableProps.hideHeader"
      hide-pagination
      :loading="tableProps.loading"
      :table-header-style="{
      background: '#808080',
      color: 'white',
      fontWeight: 'bold',
    }"
      table-class="app-table"
      :pagination="{
      rowsPerPage: 0,
    }"
    >
      <template #body-cell="props">
        <q-td :props="props">
          <div class="cell">
            {{ props.value }}
          </div>
        </q-td>
      </template>
      <template v-for="slotName in Object.keys($slots)" #[slotName]="props">
        <slot :name="slotName" :props="props"></slot>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const tableProps = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  hideHeader: {
    type: Boolean,
    default: () => false,
  },
});
</script>

<style>
.app-table tr:nth-child(even) {
  background-color: #dfdfdf;
}

.app-table table {
  max-width: 100%;
}

.wrapper {
  max-width: 100%;
  overflow: scroll;
  border-radius: 8px;
  background: #dfdfdf;
}

.app-table tbody {
  height: max-content;
}

.app-table td {
  padding: 0 !important;
}

.app-table .cell {
  text-overflow: ellipsis;
  white-space: break-spaces;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
}

.app-table th {
  text-align: center;
  padding: 0 !important;
  min-width: 30px;
}

.app-table .positive {
  background: #eef0cb !important;
}

.app-table .negative {
  background: #f5d1c5 !important;
}
</style>
