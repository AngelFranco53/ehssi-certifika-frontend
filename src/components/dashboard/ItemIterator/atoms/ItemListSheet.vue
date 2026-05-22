<template>
	<v-sheet
		elevation="1"
		class="w-full p-4 transition-shadow duration-200 hover:shadow-md"
		rounded="lg"
	>
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex items-center gap-4 min-w-0">
				<v-avatar size="100" rounded="lg" class="shrink-0">
					<v-img src="@/assets/couse.jpg" cover></v-img>
				</v-avatar>

				<div class="min-w-0">
					<div class="flex flex-wrap items-center gap-2">
						<v-chip
							density="compact"
							rounded="lg"
							color="#6275AF"
							variant="tonal"
						>
							{{ item.code }}
						</v-chip>

						<span class="text-sm text-gray-500 flex items-center gap-1">
							<v-icon size="18">
								mdi-clock-time-four
							</v-icon>
							{{ item.duration }} Hrs.
						</span>
					</div>

					<h3 class="mt-2 text-lg font-bold text-gray-900 truncate">
						{{ item.course }}
					</h3>

					<p class="mt-1 text-sm text-gray-500">
						Desde {{ props.item.startDate }} - Hasta {{ props.item.endDate }}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-3 lg:items-end lg:text-right">
				<div class="flex -space-x-2 justify-end">
					<div class="flex -space-x-2">
                        <v-avatar size="28" class="border-2 border-white">
                            <v-img src="https://i.pravatar.cc/40?img=11"></v-img>
                        </v-avatar>
                        <v-avatar size="28" class="border-2 border-white">
                            <v-img src="https://i.pravatar.cc/40?img=22"></v-img>
                        </v-avatar>
                        <v-avatar size="28" class="border-2 border-white">
                            <v-img src="https://i.pravatar.cc/40?img=33"></v-img>
                        </v-avatar>
                        <v-avatar size="28" class="border-2 border-white bg-primary text-white text-xs font-bold" v-if="props.item.enrolled > 3">
                            +{{ props.item.enrolled - 3 }}
                        </v-avatar>
                    </div>
				</div>

				<div>
					<p class="text-sm text-gray-500">
						{{ item.enrolled }} alumnos inscritos
					</p>

					<div class="mt-2 w-full lg:w-48">
						<v-progress-linear
							:model-value="item.progress"
							height="6"
							rounded
							color="#845988"
						/>
						<p class="mt-2 text-xs text-gray-500">
							{{ item.progress }}% completado
						</p>
					</div>
				</div>
			</div>
		</div>
	</v-sheet>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	item: {
		type: Object,
		default: () => ({
			name: 'Curso de Vue.js',
			date: '2024-06-01',
			course: 'Frontend',
			duration: '20 hrs',
			enrolled: 120,
			progress: 50,
			extraStudents: 8,
			image: 'https://picsum.photos/80/80',
			students: [
				'https://i.pravatar.cc/40?img=11',
				'https://i.pravatar.cc/40?img=22',
				'https://i.pravatar.cc/40?img=33',
			],
		}),
	},
})

const visibleStudents = computed(() => (props.item.students ?? []).slice(0, 3))
</script>