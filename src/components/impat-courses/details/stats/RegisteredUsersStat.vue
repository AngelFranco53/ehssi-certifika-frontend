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
        color="#6275AF"
        rounded="lg"
      >
        <v-icon
          color="#2563EB"
          icon="mdi-account-multiple"
        />
      </v-avatar>

      <v-chip
        color="#6275AF"
        text="Este curso"
      />
    </div>

    <div>
      <h2 class="text-3xl font-bold mt-4">
        {{ props.value }}
      </h2>
      <span class="text-gray-600 uppercase tracking-wide text-sm">
        Usuarios registrados
      </span>
    </div>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  value: { type: Number, default: 248 },
})
</script>
