import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance

export const useImpartCourseStore = defineStore('impartCourse', {
    state: () => ({
        courses: [],
        courseDetails: null,
        pupils: [],
        stats: {},
        company: null,
        formData: {
            name: '',
            companySupervisor: '',
            personnelSupervisor: '',
            startDate: '',
            endDate: '',
            courseId: null,
            companyId: null,
            courseTeacher: null,
            companyRfc: null,
            activity:null
        }
    }),
    getters: {  
        getCourses: (state) => state.courses,
        getCourseDetails: (state) => state.courseDetails,
        getStats: (state) => state.stats,
        getPupils: (state) => state.pupils,
        getCompany: (state) => state.company
    },
    actions: {
        async fetchCourses() {
            try {
                const response = await client.get('/impart-courses')
                this.courses = response.data.data.courses
            } catch (error) {
                console.error('Failed to fetch courses:', error)
            }
        },
        async fetchCourseDetails(courseId) {
            try {   
                const response = await client.get(`/impart-courses/${courseId}`)
                this.courseDetails = response.data.data.course ?? null
                this.pupils = response.data.data.pupils
                this.stats = response.data.data.stats
                this.company = response.data.data.company
            } catch (error) {
                console.error('Failed to fetch course details:', error)
            }
        },
        async createCourse() {
            try {
                const response = await client.post('/impart-courses', this.formData)
                console.log('Course created successfully:', response.data)
                this.fetchCourses() // Refresh the course list after creation
            } catch (error) {
                console.error('Failed to create course:', error)
            }
        }
    }
})