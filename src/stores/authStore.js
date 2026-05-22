import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance
import router from '@/router'

export const useAuthStore = defineStore('auth', {
	state: () => ({
        user: null,
        token: null,
		form: {
            username: '',
            password: '',
        },
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
	},
	actions: {
		async login() {
			await client.post('/login', this.form). then((response) => {
				console.log(response);
				
				this.user = response.data.data.user
				this.token = response.data.data.token
				
            	router.push('/dashboard');
			}).catch((error) => {
				console.error('Login failed:', error)
			})
		},
		logout() {
			this.user = null
			this.token = null
			this.error = null
		},
	},
    persist: true,
})