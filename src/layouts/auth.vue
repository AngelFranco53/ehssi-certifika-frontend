<template>
    <SideBar></SideBar>
    <Header></Header>
    <v-main >
        <v-container
            fluid
            class="p-4"
        >
            <div class="flex justify-between items-center mb-4">
                <div>
                    <span
                        v-if="title"
                        class="text-4xl font-bold mb-1 block"
                        style="color: #1A237E;"
                    >
                        {{ title }}
                    </span>
                    <span
                        v-if="subtitle"
                        class="text-md block"
                        style="color: #616161;"
                    >
                        {{ subtitle }}
                    </span>
                </div>
                <div>
                    <component
                        :is="appendComponent"
                        v-if="appendComponent"
                        v-bind="appendProps"
                    ></component>
                </div>
            </div>

            <v-divider
                v-if="title || subtitle"
                class="my-4"
            ></v-divider>

            <router-view />
        </v-container>
    </v-main>
</template>

<script setup>
import { usePageHeader } from '@/composables/usePageHeader'

import Header from '@/components/app/Header';
import SideBar from '@/components/app/SideBar';

const { title, subtitle, appendComponent, appendProps } = usePageHeader()
</script>

<style scoped>

</style>