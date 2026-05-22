<template>
  <Loader/>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import Loader from '@/components/app/Loader.vue';
</script>
