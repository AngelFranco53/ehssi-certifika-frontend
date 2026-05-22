<template>
  <v-sheet
    elevation="1"
    rounded="lg"
    class="p-4"
    min-height="170"
  >
    <div class="flex items-center justify-between">
      <v-avatar
        variant="tonal"
        color="#64A689"
        rounded="lg"
      >
        <v-icon
          color="#1C7C54"
          icon="mdi-check-decagram"
        />
      </v-avatar>

      <v-chip
        color="#64A689"
        text="progreso"
      />
    </div>

    <div>
      <h2 class="text-3xl font-bold mt-4">
        {{ props.value }}%
      </h2>
      <span class="text-gray-600 uppercase tracking-wide text-sm">
        Finalizacion del curso
      </span>
    </div>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  value: { type: Number, default: 82 },
})
</script>
