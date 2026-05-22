<template>
	<v-card>
		<v-card-title>
			{{ props.isEdit ? 'Editar Curso' : 'Crear Curso' }}
		</v-card-title>
		<v-card-text>
			<v-form class="course-form" ref="formRef">
				<div class="form-group">
					<v-text-field
						id="codigo"
						name="codigo"
						label="Codigo"
						placeholder="Ingrese el codigo"
						variant="outlined"
						v-model="courseStore.formData.code"
					/>
				</div>
		
				<div class="form-group">
					<v-text-field
						id="nombre"
						name="nombre"
						label="Nombre"
						placeholder="Ingrese el nombre"
						variant="outlined"
						v-model="courseStore.formData.name"
					/>
				</div>
		
				<div class="form-group">
					<v-text-field
						id="duracion"
						name="duracion"
						label="Duracion"
						placeholder="Ingrese la duracion"
						variant="outlined"
						v-model="courseStore.formData.duration"
					/>
				</div>
		
				<div class="form-group">
					<v-select
						id="estatus"
						name="estatus"
						label="Estatus"
						:items="[
							{ title: 'Seleccione un estatus', value: '' },
							{ title: 'Activo', value: '1' },
							{ title: 'Inactivo', value: '2' },
						]"
						variant="outlined"
						v-model="courseStore.formData.status"
					/>
				</div>
			</v-form>
		</v-card-text>
		
		<v-card-actions
			class="flex items-center justify-between"
		>
			<v-btn
				text="Cancelar"
				variant="tonal"
				color="#F44336"
				@click="close"
			></v-btn>
			<v-btn
				text="Crear"
				variant="tonal"
				color="#2563EB"
				@click="create"
				v-if="!props.isEdit"
			></v-btn>
			<v-btn
				text="Actualizar"
				variant="tonal"
				color="#2563EB"
				@click="update"
				v-else
			></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup>
import { useCourseStore } from '@/stores/coursesStore';
import { ref, defineEmits } from 'vue';

const courseStore = useCourseStore();
const formRef = ref(null);

const emit = defineEmits('close');
const props = defineProps({
	isEdit: {
		type: Boolean,
		default: false
	}
});

function close() {
	formRef.value.reset();

	emit('close');
}

async function create(){
	try {
		await courseStore.createCourse();
		close();
	} catch (error) {
		console.error('Error al crear el curso:', error);
	}
}

async function update(){
	try {
		await courseStore.updateCourse();
		close();
	} catch (error) {
		console.error('Error al actualizar el curso:', error);
	}
}
</script>