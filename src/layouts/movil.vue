<template>
  <v-app>
    <v-main class="mobile-layout">
      <div class="mobile-layout__frame">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 16px;
}

.mobile-layout__frame {
  width: 100%;
  max-width: 430px;
}
</style>