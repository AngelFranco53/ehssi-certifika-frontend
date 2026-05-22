import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        stats: [],
        recentCourses: []
    }),
    getters: {
        getStats: (state) => state.stats,
        getRecentCourses: (state) => state.recentCourses
    },
    actions: {
        async fetchDashboardData() {
            try {
                const response = await client.get('/dashboard')
                this.stats = response.data.data.stats
                this.recentCourses = response.data.data.recent_courses   
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error)
            }
        }
    }
})