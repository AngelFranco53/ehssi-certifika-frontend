<template>
    <v-card 
        rounded="lg"
    >
        <v-card-title>
            Impartir nuevo curso
        </v-card-title>
        <v-card-text>
            <v-form @submit.prevent="crearRegistro" ref="formRef">
                <v-row>
                    <v-col cols="12" md="10">
                        <v-text-field
                            v-model="impartCourseStore.formData.name"
                            label="Nombre del curso"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="impartCourseStore.formData.companySupervisor"
                            label="Patron o representante legal"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="impartCourseStore.formData.personnelSupervisor"
                            label="Representante de los trabajadores"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="impartCourseStore.formData.startDate"
                            label="Fecha de inicio"
                            type="date"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="impartCourseStore.formData.endDate"
                            label="Fecha de terminación"
                            type="date"
                            variant="outlined"
                            density="comfortable"
                            required
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-combobox
                            v-model="impartCourseStore.formData.companyId"
                            v-model:search="searchTerm"
                            :items="catalogStore.getCompanies"
                            label="Nombre de la empresa"
                            variant="outlined"
                            density="comfortable"
                            required
                            item-title="name"
                            item-value="id"
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-combobox
                            v-model="impartCourseStore.formData.courseId"
                            v-model:search="searchTerm"
                            :items="catalogStore.getCourses"
                            label="Curso"
                            variant="outlined"
                            density="comfortable"
                            required
                            item-title="name"
                            item-value="id"
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-combobox
                            v-model="impartCourseStore.formData.courseTeacher"
                            v-model:search="searchTerm"
                            :items="catalogStore.getTeaches"
                            label="Instructor"
                            variant="outlined"
                            density="comfortable"
                            required
                            item-title="name"
                            item-value="id"
                        />
                    </v-col>
                    
                    <v-col
                        v-if="!catalogStore.getCompanies.includes(impartCourseStore.formData.companyId)"
                    >
                        <v-select
                            v-model="impartCourseStore.formData.activity"
                            :items="catalogStore.getActivities"
                            item-title="name"
                            label="Actividad de la empresa"
                            variant="outlined"
                            density="comfortable"
                            required
                            return-object
                        />
                        <v-text-field 
                            v-model="impartCourseStore.formData.companyRfc"
                            label="RFC de la empresa"
                            variant="outlined"
                            density="comfortable"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" class="d-flex ga-3">
                        <v-btn color="#2563EB" type="submit" variant="tonal">
                            Crear registro
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useCatalogStore } from '@/stores/catalogStore'
import { useImpartCourseStore } from '@/stores/impartCourseStore'
import { onMounted, ref } from 'vue'

const catalogStore = useCatalogStore()
const impartCourseStore = useImpartCourseStore()
const formRef = ref(null)
const searchTerm = ref('')

onMounted(() => {
    catalogStore.fetchCatalogs()
})

const emit = defineEmits(['close'])

function close() {
    formRef.value.reset()

    emit('close')
}

async function crearRegistro() {
    try {
        await impartCourseStore.createCourse()
        close()
    } catch (error) {
        console.error('Error al crear el registro:', error)
    }
}
</script>