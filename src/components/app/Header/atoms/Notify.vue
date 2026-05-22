<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                icon
            >
                <v-icon
                    color="#616161"
                    icon="mdi-bell"
                ></v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(item, index) in items"
                :key="index"
                lines="2"
                :title="item.title"
                :subtitle="item.description"
            >
                <template
                    v-slot:append="{ item }"
                >
                    <v-icon
                        color="#616161"
                        icon="mdi-close"
                        @click="items.splice(index, 1)"
                    ></v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
const items = [
    { title: 'Profile', description: 'View your profile' },
    { title: 'Settings', description: 'Manage your settings' },
    { title: 'Logout', description: 'Sign out of your account' },
  ]
</script>