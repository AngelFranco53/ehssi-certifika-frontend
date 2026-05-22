<template>
    <CoursesDataTable 
        @edit="edit"
    />

    <v-dialog
        v-model="dialog"
        width="500"
    >
        <CoursesForm 
            :is-edit="isEdit"
            @close="dialog = false"
        />
    </v-dialog>
</template>

<script setup>
import { usePageHeader } from '@/composables/usePageHeader'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useCourseStore } from '@/stores/coursesStore';

import HeaderButton from '@/components/courses/HeaderButton.vue';
import CoursesForm from '@/components/courses/CoursesForm.vue';
import CoursesDataTable from '@/components/courses/CoursesDataTable.vue';

const dialog = ref(false);
const isEdit = ref(false);
const courseStore = useCourseStore();
const { setPageHeader, setHeaderAppend, clearHeaderAppend } = usePageHeader();
onMounted(() => {
    courseStore.fetchCourses();

    setPageHeader('Cursos', 'Lista de cursos disponibles')
    setHeaderAppend(HeaderButton, {
        onClick: () => {
            dialog.value = true;
            isEdit.value = false;
        }
    });
})

onBeforeUnmount(() => {
    clearHeaderAppend();
});

function edit(){
    isEdit.value = true;
    dialog.value = true;
}
</script>

<route lang="yaml">
meta:
  layout: auth
</route>