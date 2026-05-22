<template>
    <v-navigation-drawer
        location="left"
        permanent
    >
        <template
            v-slot:prepend
        >
            <HeaderSideBar />
        </template>
        <template
            v-slot:default
        >
            <NavSideBar />
        </template>
        <template
            v-slot:append
        >
            <p class="text-xs text-center">
                <b>Powered by</b>
                Adaptify Sowtware Inc.
            </p>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import HeaderSideBar from './atoms/HeaderSideBar.vue';
import NavSideBar from './atoms/NavSideBar.vue';
</script>