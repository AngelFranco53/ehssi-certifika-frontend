<template>
	<v-container class="p-4" fluid>
        <v-img src="@/assets/logo.jpeg">
            
        </v-img>
		<v-row justify="center">
			<v-col cols="12" sm="8" md="6">
				<v-card class="p-4" elevation="0">
                    <v-form @submit.prevent="onSubmit" ref="formRef">
						<v-text-field
							v-model="movilStore.formData.curp"
                            @update:focused="movilStore.searchByCurp()"
							label="CURP"
							outlined
							dense
							clearable
                            variant="outlined"
						/>

						<v-text-field 
                            v-model="movilStore.formData.name" 
                            label="Nombre" 
                            outlined 
                            dense 
                            clearable  
                            variant="outlined"
                            :disabled="movilStore.getDisabled"
                        />

						<v-text-field 
                            v-model="movilStore.formData.paternal_surname" 
                            label="Apellido paterno" 
                            outlined 
                            dense 
                            clearable  
                            variant="outlined"
                            :disabled="movilStore.getDisabled"
                        />

						<v-text-field 
                            v-model="movilStore.formData.maternal_surname" 
                            label="Apellido materno" 
                            outlined 
                            dense 
                            clearable  
                            variant="outlined"
                            :disabled="movilStore.getDisabled"
                        />

						<v-text-field 
                            v-model="movilStore.formData.position" 
                            label="Puesto" 
                            outlined 
                            dense 
                            clearable  
                            variant="outlined"
                            :disabled="movilStore.getDisabled"
                        />

						<div class="mt-4 flex justify-end">
							<v-btn color="#7FA7C9" type="submit" variant="tonal" :disabled="movilStore.getDisabled">Guardar</v-btn>
						</div>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { useMovilStore } from '@/stores/movilStore'
import { ref, computed } from 'vue'

const movilStore = useMovilStore()
const formRef = ref(null)

function onSubmit() {
    movilStore.onSubmit()
    
}
</script>

<style scoped>
.flex { display: flex; }
.justify-end { justify-content: flex-end; }
.mx-auto { margin-left: auto; margin-right: auto; }
</style>