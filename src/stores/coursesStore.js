import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance

export const useCourseStore = defineStore('courses', {
    state: () => ({
        courses: [],
        course: {},
        formData: {
            code: '',
            name: '',
            duration: '',
            status: '',
        }
    }),
    getters: {
        getCourses: (state) => state.courses,
        getCourse: (state) => state.course,
    },
    actions: {  
        async fetchCourses() {
            try {
                const response = await client.get('/courses')
                this.courses = response.data.data.courses
            } catch (error) {
                console.error('Failed to fetch courses:', error)
            }
        },
        async fetchCourse(id) {
            try {
                const response = await client.get(`/courses/${id}`)
                this.course = response.data.data.course

                this.formData = {
                    code: this.course.code,
                    name: this.course.name,
                    duration: this.course.duration,
                    status: this.course.status,
                }
            } catch (error) {
                console.error('Failed to fetch course:', error)
            }
        },
        async createCourse() {
            try {
                const response = await client.post('/courses', this.formData)
                
                this.fetchCourses() // Refresh the courses list after creating a new course
            } catch (error) {
                console.error('Failed to create course:', error)
            }
        },
        async updateCourse() {
            try {
                const response = await client.put(`/courses/${this.course.id}`, this.formData)
                this.fetchCourses() // Refresh the courses list after updating a course
            } catch (error) {
                console.error('Failed to update course:', error)
            }
        }
    }
})