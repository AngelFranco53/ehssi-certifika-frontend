import { defineStore } from 'pinia'
import client from '@/plugins/axios' // Import your Axios instance

export const useCatalogStore = defineStore('catalog', {
    state: () => ({
        courses: [],
        companies: [],
        teaches: [],
        activities: [
            { code: '01', name: 'Cultivo, crianza y aprovechamiento' },
            { code: '01.1', name: 'Agricultura y silvicultura' },
            { code: '01.2', name: 'Ganadería' },
            { code: '01.3', name: 'Pesca y acuacultura' },
            { code: '02', name: 'Extracción y suministro' },
            { code: '02.1', name: 'Exploración' },
            { code: '02.2', name: 'Extracción' },
            { code: '02.3', name: 'Refinación y beneficio' },
            { code: '02.4', name: 'Provisión de energía' },
            { code: '02.5', name: 'Provisión de agua' },
            { code: '03', name: 'Construcción' },
            { code: '03.1', name: 'Planeación y dirección de obras' },
            { code: '03.2', name: 'Edificación y urbanización' },
            { code: '03.3', name: 'Acabado' },
            { code: '03.4', name: 'Instalación y mantenimiento' },
            { code: '04', name: 'Tecnología' },
            { code: '04.1', name: 'Mecánica' },
            { code: '04.2', name: 'Electricidad' },
            { code: '04.3', name: 'Electrónica' },
            { code: '04.4', name: 'Informática' },
            { code: '04.5', name: 'Telecomunicaciones' },
            { code: '04.6', name: 'Procesos industriales' },
            { code: '05', name: 'Procesamiento y fabricación' },
            { code: '05.1', name: 'Minerales no metálicos' },
            { code: '05.2', name: 'Metales' },
            { code: '05.3', name: 'Alimentos y bebidas' },
            { code: '05.4', name: 'Textiles y prendas de vestir' },
            { code: '05.5', name: 'Materia orgánica' },
            { code: '05.6', name: 'Productos químicos' },
            { code: '05.7', name: 'Productos metálicos y de hule y plástico' },
            { code: '05.8', name: 'Productos eléctricos y electrónicos' },
            { code: '05.9', name: 'Productos impresos' },
            { code: '06', name: 'Transporte' },
            { code: '06.1', name: 'Ferroviario' },
            { code: '06.2', name: 'Autotransporte' },
            { code: '06.3', name: 'Aéreo' },
            { code: '06.4', name: 'Marítimo y fluvial' },
            { code: '06.5', name: 'Servicios de apoyo' },
            { code: '07', name: 'Provisión de bienes y servicios' },
            { code: '07.1', name: 'Comercio' },
            { code: '07.2', name: 'Alimentación y hospedaje' },
            { code: '07.3', name: 'Turismo' },
            { code: '07.4', name: 'Deporte y esparcimiento' },
            { code: '07.5', name: 'Servicios personales' },
            { code: '07.6', name: 'Reparación de artículos de uso doméstico y personal' },
            { code: '07.7', name: 'Limpieza' },
            { code: '07.8', name: 'Servicio postal y mensajería' },
            { code: '08', name: 'Gestión y soporte administrativo' },
            { code: '08.1', name: 'Bolsa, banca y seguros' },
            { code: '08.2', name: 'Administración' },
            { code: '08.3', name: 'Servicios legales' },
            { code: '09', name: 'Salud y protección social' },
            { code: '09.1', name: 'Servicios médicos' },
            { code: '09.2', name: 'Inspección sanitaria y del medio ambiente' },
            { code: '09.3', name: 'Seguridad social' },
            { code: '09.4', name: 'Protección de bienes y/o personas' },
            { code: '10', name: 'Comunicación' },
            { code: '10.1', name: 'Publicación' },
            { code: '10.2', name: 'Radio, cine, televisión y teatro' },
            { code: '10.3', name: 'Interpretación artística' },
            { code: '10.4', name: 'Traducción e interpretación lingüística' },
            { code: '10.5', name: 'Publicidad, propaganda y relaciones públicas' },
            { code: '11', name: 'Desarrollo y extensión del conocimiento' },
            { code: '11.1', name: 'Investigación' },
            { code: '11.2', name: 'Enseñanza' },
            { code: '11.3', name: 'Difusión cultural' },
            { code: '1000', name: 'Producción general' },
            { code: '2000', name: 'Servicios' },
            { code: '3000', name: 'Administración, contabilidad y economía' },
            { code: '4000', name: 'Comercialización' },
            { code: '6000', name: 'Seguridad' },
            { code: '7000', name: 'Desarrollo personal y familiar' },
            { code: '8000', name: 'Uso de tecnologías de la información y comunicación' },
            { code: '9000', name: 'Participación social' }
        ]
    }),
    getters: {
        getCourses: (state) => state.courses,
        getCompanies: (state) => state.companies,
        getTeaches: (state) => state.teaches,
        getActivities: (state) => state.activities
    },
    actions: {
        async fetchCatalogs() {
            try {
                await client.get('/catalogs').then((response) => {
                    this.courses = response.data.data.courses
                    this.companies = response.data.data.companies
                    this.teaches = response.data.data.teachers
                }).catch((error) => {
                    console.error('Error fetching catalogs:', error)
                })
            } catch (error) {
                console.error('Error fetching catalogs:', error)
            }
        },
        async syncCatalogs() {
            try {
                await client.post('/catalogs/sync').then((response) => {
                    console.log('Catalogs synchronized successfully:', response.data)
                    this.fetchCatalogs() // Refresh catalogs after synchronization
                }).catch((error) => {
                    console.error('Error synchronizing catalogs:', error)
                })
            } catch (error) {
                console.error('Error synchronizing catalogs:', error)
            }
        }
    }
})