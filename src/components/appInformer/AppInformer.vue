<template>
  <section>
    <div class="flex no-wrap margin-vertical">
      <div class="text-grey-8 icon">
        <q-icon size="30px" name="error" />
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.margin-vertical {
  margin: 20px 0;
}

.icon {
  margin-right: 10px;
}
</style>
