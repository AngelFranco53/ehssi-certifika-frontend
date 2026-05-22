<template>
    <ItemIterator 
        title="Todos los cursos"
        :items="courses.getCourses"
    />

    <v-dialog
        v-model="showCourseDialog"
        width="800"
    >
        <ImpartCourseForm
            @close="showCourseDialog = false"
        />
    </v-dialog>
</template>

<script setup>
import { usePageHeader } from '@/composables/usePageHeader'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useImpartCourseStore } from '@/stores/impartCourseStore';

import HeaderButton from '@/components/impat-courses/HeaderButton.vue';
import ItemIterator from '@/components/dashboard/ItemIterator';
import ImpartCourseForm from '@/components/impat-courses/ImpartCourseForm.vue';

const showCourseDialog = ref(false);
const courses = useImpartCourseStore();
const { setPageHeader, setHeaderAppend, clearHeaderAppend } = usePageHeader();
onMounted(() => {
    courses.fetchCourses();
    setPageHeader('Cursos impartidos', 'Lista de cursos impartidos por el usuario')
    setHeaderAppend(HeaderButton, {
        onClick: () => {
            showCourseDialog.value = true;
        }
    });
})

onBeforeUnmount(() => {
    clearHeaderAppend();
});

</script>

<route lang="yaml">
meta:
  layout: auth
</route>