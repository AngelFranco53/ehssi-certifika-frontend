<template>
  <v-sheet
    elevation="1"
    rounded="lg"
    class="p-4"
    max-height="170"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <v-avatar
          variant="tonal"
          color="#7FA7C9"
          rounded="lg"
        >
          <v-icon
            color="#1D4E89"
            icon="mdi-qrcode-scan"
          />
        </v-avatar>
        <div>
            <h3 class="text-sm uppercase tracking-wide text-gray-600">
              Acceso por QR
            </h3>
            <p class="text-xs text-gray-500">
              Escanea para abrir este curso
            </p>
        </div>
      </div>

      <div class="flex justify-center bg-gray-400/20 rounded-lg p-4">
        <v-img
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent('http://localhost:3000/movil/' + props.value)}`"
          alt="QR de acceso al curso"
          width="110"
          height="110"
          cover
        />
      </div>
    </div>

  </v-sheet>
</template>

<script setup>
const props = defineProps({
  value: { type: String, default: 'https://certifika.app/impart-courses' }
})
</script>
