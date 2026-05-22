<template>
    <HeaderItemIterator v-model="activeGrid" :title="props.title" />

    <v-data-iterator :items="items" :items-per-page="-1">
        <template
            v-slot:default="{ items }"
        >
            <v-row
                v-if="activeGrid"
                class="mt-4"
            >
                <v-col
                    v-for="item in items"
                    :key="item.id"
                    cols="12"
                    md="4"
                >
                    <ItemGridSheet 
                        :item="item.raw"
                        class="cursor-pointer"
                        @click="$router.push('/impart-courses/details/' + item.raw.id)"
                    />
                </v-col>
            </v-row>

            <v-row
                v-else
                class="mt-4"
            >
                <v-col
                    v-for="item in items"
                    :key="item.id"
                    cols="12"
                >
                    <ItemListSheet :item="item.raw" class="cursor-pointer"  @click="$router.push('/impart-courses/details/' + item.raw.id)"/>
                </v-col>
            </v-row>
        </template>
    </v-data-iterator>
</template>

<script setup>
import HeaderItemIterator from './atoms/HeaderItemIterator.vue';
import ItemGridSheet from './atoms/ItemGridSheet.vue';
import ItemListSheet from './atoms/ItemListSheet.vue';

import { ref } from 'vue';

const activeGrid = ref(true)

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    }
})
</script>