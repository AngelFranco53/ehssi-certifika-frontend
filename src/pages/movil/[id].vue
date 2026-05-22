<template>
    <MovilForm />
</template>

<script setup>
import router from '@/router'
import { useMovilStore } from '@/stores/movilStore'
import { onMounted } from 'vue'

import MovilForm from '@/components/movil/MovilForm.vue'

const movilStore = useMovilStore()

onMounted(() => {
    const id = router.currentRoute.value.params.id
    if (id) {
        movilStore.formData.course = id
    } else {
        movilStore.resetForm()
    }
})
</script>