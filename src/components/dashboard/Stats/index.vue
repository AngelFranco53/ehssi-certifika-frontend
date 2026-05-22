<template>
    <v-row>
        <v-col
            cols="12"
            md="6"
        >
            <MothCoursesStat 
                :value="1234"
                :icon="'mdi-book-open-variant'"
                :change="5"
                :title="'Total de Cursos'"
            />
        </v-col>
        <v-col
            cols="12"
            md="6"
        >
            <MothCoursesStat 
                :value="5678"
                :icon="'mdi-account-multiple'"
                :change="-2"
                :title="'Total de Estudiantes'"
            />
        </v-col>
    </v-row>
</template>

<script setup>
import MothCoursesStat from './atoms/MothCoursesStat.vue';
</script>