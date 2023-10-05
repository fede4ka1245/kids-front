<template>
  <section class="content">
    <div class="spinner-container">
      <q-spinner
        color="primary"
        size="3em"
        :thickness="4"
      />
    </div>
  </section>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 90px;
  height: 90px;
  border-radius: 20px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,0.2);
}

.content {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(128, 128, 128, 0.5);
}
</style>
