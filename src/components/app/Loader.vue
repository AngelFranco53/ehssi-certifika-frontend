<template>
    <v-overlay v-model="overlayStore.isLoading" class="flex flex-col justify-center items-center" >
        <v-progress-circular
            indeterminate
            color="#2563EB"
            size="64"
            width="7"
        />
    </v-overlay>
</template>

<script setup>
import { useOverlayStore } from '@/stores/app/overlayStore';

const overlayStore = useOverlayStore();
</script>