<template>
    <v-list
        nav
        density="compact"
    >
        <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            :value="item.value"
            rounded="lg"
        />
    </v-list>
</template>

<script setup>

const items = [
    { title: 'Dashboard', icon: 'mdi-home', to: '/dashboard', value: 'dashboard' },
    { title: 'Cursos', icon: 'mdi-human-male-board', to: '/courses', value: 'courses' },
    { title: 'Cursos Impartidos', icon: 'mdi-cast-education', to: '/impart-courses', value: 'impart-courses' }

]

</script>
