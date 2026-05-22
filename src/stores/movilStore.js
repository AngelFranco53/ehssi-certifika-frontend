import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance

export const useMovilStore = defineStore('movil', {
    state: () => ({
        formData: {
            curp: '',
            name: '',
            paternal_surname: '',
            maternal_surname: '',
            position: '',
            course: '',
        },
        disabled: true,
    } ),
    getters: {
        getDisabled() {
            return this.disabled;
        }
    },
    actions: {
        async searchByCurp() {
            if (this.formData.curp.length === 18) {
                await client.get(`/movil/search/${this.formData.curp}`)
                    .then(response => {
                        const data = response.data.data.pupil;
                        console.log('Data received from API:', data);
                        this.formData = { ...this.formData, ...data };
                    }).catch(error => {
                        console.error('Error searching by CURP:', error);
                    }).finally(() => {
                        this.disabled = false; // Enable the form after search
                    })
            }
        },
        async onSubmit() {
            await client.post('/movil/submit', this.formData)
                .then(response => {
                    console.log('Form submitted successfully:', response.data);
                    // Optionally, reset the form or show a success message
                }).catch(error => {
                    console.error('Error submitting form:', error);
                })
        }
    }
})