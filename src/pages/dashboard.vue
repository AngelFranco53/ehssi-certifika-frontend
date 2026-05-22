<template>
  <Stats/>
  <ItemIterator
      title="Recent Activities"
      :items="dashboardStore.getRecentCourses"
  />
</template>

<script setup>
import Stats from '@/components/dashboard/Stats';
import HeaderButton from '@/components/dashboard/HeaderButton.vue';
import ItemIterator from '@/components/dashboard/ItemIterator';

import { usePageHeader } from '@/composables/usePageHeader'
import { onBeforeUnmount, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';

const { setPageHeader, setHeaderAppend, clearHeaderAppend } = usePageHeader();
const dashboardStore = useDashboardStore();

onMounted(() => {
  setPageHeader('Dashboard', 'Welcome to your dashboard')
  setHeaderAppend(HeaderButton);
  dashboardStore.fetchDashboardData();
})

onBeforeUnmount(() => {
    clearHeaderAppend();
});
</script>

<route lang="yaml">
meta:
  layout: auth
</route>