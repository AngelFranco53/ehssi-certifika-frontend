<template>
    <v-row>
        <v-col
            cols="12"
            md="6"
        >
            <span
                class="text-2xl font-bold mb-4 d-block"
            >
                {{ title }}
            </span>
        </v-col>
        <v-col
            cols="12"
            md="6"
            align="end"
        >
            <v-btn
                variant="tonal"
                icon="mdi-view-grid"
                size="small"
                rounded="xl"
                class="mr-2"
                :color="modelValue ? '#6275AF' : '#757681'"
                @click="emit('update:modelValue', true)"
            ></v-btn>
            <v-btn
                variant="tonal"
                icon="mdi-view-list"
                size="small"
                rounded="xl"
                :color="!modelValue ? '#6275AF' : '#757681'"
                @click="emit('update:modelValue', false)"
            ></v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])
</script>