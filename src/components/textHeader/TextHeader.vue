<template>
  <div class="main">
    <p>
      <slot></slot>
    </p>
    <div
      v-if="!!props.description"
      class="icon text-grey-8"
      @click="onHelpClick"
    >
      <q-icon name="help" size="sm" color="gray" />
    </div>
  </div>
</template>

<script setup>
import { appAlert } from "@/components/appAlert/appAlert";

const props = defineProps({
  description: {
    type: String,
    default: () => "",
  },
});

const onHelpClick = () => {
  appAlert(props.description || "Описание");
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition: all ease-in 200ms;
  cursor: pointer;
}

.icon:active {
  background: rgba(128, 128, 128, 0.4);
  border: solid 1px rgba(128, 128, 128, 0.6);
}

@media (hover: hover) and (pointer: fine) {
  .icon:hover {
    background: rgba(128, 128, 128, 0.4);
    border: solid 1px rgba(128, 128, 128, 0.6);
  }
}

p {
  margin: 1em 5px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}
</style>
