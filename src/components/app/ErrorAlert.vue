<template>
    <v-alert
        type="error"
        v-if="errors.length > 0"
        title="Error"
        closable
        @close="errorStore.clear"
    >
        <ul>
            <li 
                v-for="error in errors" 
                :key="error"
            >
                {{ error }}
            </li>
        </ul>
    </v-alert>
</template>

<script setup>
import { computed } from 'vue'
import { useErrorStore } from '@/stores/app/errorStore'

const errorStore = useErrorStore();
const errors = computed(() => errorStore.stack);
</script>