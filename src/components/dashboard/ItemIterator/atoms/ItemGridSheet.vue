<template>
    <v-sheet 
        elevation="1"
        class="p-4"
        rounded="lg"
    >
        <div
            class="flex items-center justify-between"
        >
            <div>
                <v-img
                    src="@/assets/couse.jpg"
                    width="150"
                    height="70"
                    class="rounded-lg"
                    cover
                ></v-img>
            </div>

            <div class="flex flex-col items-end">
                <v-chip
                    density="compact"
                    rounded="lg"
                >
                    {{ props.item.code}}
                </v-chip>
                <div class="mt-2 flex items-end">
                    <p class="text-sm text-gray-500">
                        {{ props.item.duration }} Hrs.
                        <v-icon size="18">
                            mdi-clock-time-four
                        </v-icon>
                    </p>
                </div>
            </div>
        </div>

        <div 
            class="mt-8 flex items-center justify-between"
        >
            <div
                class="flex flex-col"
            >
                <h3 class="text-lg font-bold">
                    {{ props.item.course }}
                </h3>
                <p class="text-sm text-gray-500">
                    Desde {{ props.item.startDate }} - Hasta {{ props.item.endDate }}
                </p>
            </div>
            <div>
                <div class="flex flex-col items-end">
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
                    <p class="mt-2 text-sm text-gray-500">
                        {{ props.item.enrolled }} alumnos inscritos
                    </p>
                </div>
            </div>
        </div>
        <v-progress-linear
            :model-value="props.item.progress"
            class="mt-4"
            height="4"
            color="#845988"
            rounded="lg"
        ></v-progress-linear>
    </v-sheet>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        default: () => ({
            name: 'Curso de Vue.js',
            date: '2024-06-01',
            course: 'Frontend',
            duration: '20 hrs',
            startDate: '2024-06-01',
            endDate: '2024-06-21',
            enrolled: 120,
            progress: 50,
            extraStudents: 8,
            image: 'https://picsum.photos/80/80',
            students: [
                'https://i.pravatar.cc/40?img=11',
                'https://i.pravatar.cc/40?img=22',
                'https://i.pravatar.cc/40?img=33',
                'https://i.pravatar.cc/40?img=44',
                'https://i.pravatar.cc/40?img=55',
            ],
        }),
    }
})
</script>