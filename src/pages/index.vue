<template>
  <v-row justify="center" align="center" class="mt-4">
    <v-img src="@/assets/logo.jpeg" width="140" class="h-64"/>
  </v-row>

  <v-row justify="center" align="center" class="mb-4">
    <v-sheet>
      <h1 class="text-3xl font-bold">Bienvenido a Certifika</h1>
    </v-sheet>
  </v-row>

  <v-row justify="center" align="center" class="mb-8">
    <v-sheet>
      <p class="text-center text-gray-600">
        <span class="font-bold">Certifika</span> - Sistema de Gestión de Certificados para Instituciones Educativas
      </p>
    </v-sheet>
  </v-row>

  <v-card class="mx-auto pa-4" outlined>
    <v-card-title>Iniciar Sesión</v-card-title>
    <v-card-text>
      <ErrorAlert/>
      <v-form  @submit.prevent="auth.login()">
        <v-text-field

          v-model="auth.form.username"
          label="username"
          type="email"
          required
          variant="outlined"
        />
        <v-text-field
          v-model="auth.form.password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          required
          variant="outlined"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-btn
          color="#6275AF"
          type="submit"
          class="mt-4"
        >
          Iniciar Sesión
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>

</template>

<script setup>
import ErrorAlert from '@/components/app/ErrorAlert.vue';

import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue';

const auth = useAuthStore()
const showPassword = ref(false)

</script>

<route lang="yaml">
meta:
  layout: default
</route>

<style scoped>
.v-card { width: 100%; max-width: 420px; }
</style>
