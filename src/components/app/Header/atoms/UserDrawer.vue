<template>
    <v-menu
        location="bottom"
        origin="top right"
        transition="scale-transition"
    >
        <template
            v-slot:activator="{ props }"
        >
            <v-sheet
                v-bind="props"
                class="flex items-center justify-between cursor-pointer mr-2"
            >
                <div
                    class="flex flex-col mr-4"
                >
                    <p class="text-sm font-medium text-right">
                        Antonio Rodríguez
                    </p>
                    <p class="text-xs text-gray-500 text-right">
                        Administrador
                    </p>
                </div>
                <div>
                    <v-avatar color="#BC4800" size="32" >
                        <v-icon
                            size="20"
                        >
                            mdi-account
                        </v-icon>
                    </v-avatar>
                </div>
            </v-sheet>
            
        </template>

        <v-card
            width="200"
        >
            <v-list>
                <v-list-item
                    v-for="(action, index) in actions"
                    :key="index"
                >
                    <v-btn 
                        :text="action.title" 
                        :color="action.color"
                        @click="action.onClick" 
                        :prepend-icon="action.icon"
                        block
                        variant="tonal"
                    ></v-btn>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();

const actions = [
    {
        title: 'Mi Perfil',
        icon: 'mdi-account',
        color: '#6275AF',
        onClick: () => {
            console.log('Mi Perfil');
        },
    },
    {
        title: 'Cerrar Sesión',
        icon: 'mdi-logout',
        color: '#003EA8',
        onClick: () => {
            auth.logout();
        },
    },
]
</script>