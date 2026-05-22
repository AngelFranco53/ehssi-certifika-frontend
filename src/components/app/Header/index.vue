<template>
    <v-app-bar
        color="#FFF"
        elevation="1"
    >
        <template
            v-slot:prepend
        >
            <v-text-field 
                label="Buscar" 
                variant="outlined" 
                hide-details 
                width="400px" 
                density="compact" 
                rounded="xl" 
                color="#757681"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
                
        </template>
        <template
            v-slot:append
        >
            <Notify />
            <v-divider
                class="m-2"
                vertical
            ></v-divider>
            <UserDrawer />
        </template>
    </v-app-bar>
</template>


<script setup>
import UserDrawer from './atoms/UserDrawer.vue';
import Notify from './atoms/Notify.vue';
</script>