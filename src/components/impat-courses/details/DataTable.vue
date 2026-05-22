<template>
    <v-data-table
        :headers="headers"
        :items="props.items"
        class="elevation-1 rounded-lg"
    >
        <template
            v-slot:item.name="{ item }"
        >
            <p class="font-medium">
                {{ item.name }}
            </p>
        </template>

        <template
            v-slot:item.certificate="{ item }"
        >
            <v-icon
                color="green"
                @click="emit('certificate-click', item.raw ?? item)"
            >
                mdi-certificate
            </v-icon>
        </template>
    </v-data-table>
</template>

<script setup>
const emit = defineEmits(['certificate-click'])

const props = defineProps({
    items: { type: Array, default: () => [] }
})
const headers = [
    { title: 'Nombre del usuario', key: 'name' },
    { title: 'CURP', key: 'curp' },
    { title: 'Fecha de registro', key: 'date' },
    { title: 'Certificado', key: 'certificate', sortable: false, align: 'center' },
]
</script>