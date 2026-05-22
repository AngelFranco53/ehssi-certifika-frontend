import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses', {
    state: () => ({
        formData:{
            name: '',
            description: '',
            duration: '',
            startDate: '',
            endDate: '',
        },
        items: [],
        itme: {}
    }),
    getters: {
        getCourses: (state) => state.items,
        getcourse: (state) => state.item
    },
    actions: {
        fetchCourses() {

        }
    }
})
