<template>
    <v-main>
        
    <v-container
        fluid
    >
        <router-view />        
    </v-container>
    </v-main>
    <AppFooter />
</template>

<script lang="ts" setup>
import AppFooter from '@/components/app/AppFooter.vue';
</script>

