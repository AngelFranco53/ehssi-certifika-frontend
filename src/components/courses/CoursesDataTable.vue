<template>
<v-data-table :items="courseStore.getCourses" :headers="headers" class="elevation-1 mt-4 rounded-lg">
        <template v-slot:item.name="{ item }">
            <p class="font-semibold"> {{ item.name }}</p>
        </template>
        <template v-slot:item.duration="{ item }">
            <span>
                <v-icon>
                    mdi-clock-time-four
                </v-icon>
                {{ item.duration }} Hrs.
            </span>
        </template>
        <template v-slot:item.status="{ item }">
            <v-chip :color="item.status == 1 ? '#4CAF50' : '#F44336'" rounded="lg" variant="tonal">
                {{ item.status_label }}
            </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
            <div
                class="flex gap-4"
            >
                <v-icon
                    color="#2563EB"
                    @click = "edit(item)"
                >
                    mdi-pencil
                </v-icon>
                <!-- <v-icon
                    color="#F44336"
                >
                    mdi-cancel
                </v-icon> -->
            </div>
        </template>
    </v-data-table>
</template>

<script setup>
import { useCourseStore } from '@/stores/coursesStore';

const courseStore = useCourseStore();
const headers = [
    { title: 'Nombre', key: 'name' },
    { title: 'Duración', key: 'duration' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]

const emit = defineEmits(['edit']);

const edit = async (item) => {
    await courseStore.fetchCourse(item.id); 
    emit('edit');
}
</script>