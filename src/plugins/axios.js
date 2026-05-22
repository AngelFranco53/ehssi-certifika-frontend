import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useErrorStore } from '@/stores/app/errorStore'
import { useOverlayStore } from '@/stores/app/overlayStore'
import { useSonnerStore } from '@/stores/app/sonnerStore'

const baseConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        
    },
}
const client = axios.create(baseConfig)

client.interceptors.request.use(
    (req) => {
        const authStore = useAuthStore();
        const errorStore = useErrorStore();
        const overlayStore = useOverlayStore();

        overlayStore.push();
        errorStore.clear();

        if (authStore.token) {
            req.headers['Authorization'] = `Bearer ${authStore.token}`;
        }

        return req;
    }
);

client.interceptors.response.use(
    async (res) => {
        const overlayStore = useOverlayStore();
        const sonnerStore = useSonnerStore();

        overlayStore.pop();
        sonnerStore.push('Operación realizada con éxito.', res.data.message, 'success');
        
        return res;
    },
    (error) => {
        const errorStore = useErrorStore();
        const overlayStore = useOverlayStore();
        const authStore = useAuthStore();
        overlayStore.pop();

        if (error.status == 422) {
            const keys = Object.keys(error.response.data.errors);
            for (const key of keys) {
                errorStore.set(error.response.data.errors[key][0]);
            }
        }

        if (error.status == 400) {
            errorStore.set(error.response.data.message || 'Solicitud incorrecta.');
        }

        if (error.status == 401) {
            errorStore.set('Usuario no autorizado. Por favor inicie sesión nuevamente.');
        }

        if ([401, 403].includes(error.status) && !!authStore.token) {
            authStore.logout();
        }

        return Promise.reject(error);
    }
);

// ─── Instancia en segundo plano ───────────────────────────────────────────────
// No activa el overlay ni limpia errores, para no interrumpir la experiencia
// del usuario. Los errores se rechazan silenciosamente (se loguean en consola).
const backgroundClient = axios.create(baseConfig)

backgroundClient.interceptors.request.use(
    (req) => {
        const authStore = useAuthStore();

        if (authStore.token) {
            req.headers['Authorization'] = `Bearer ${authStore.token}`;
        }

        return req;
    }
);

backgroundClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const authStore = useAuthStore();

        if ([401, 403].includes(error.status) && !!authStore.token) {
            authStore.logout();
        }

        console.warn('[backgroundClient] Error en petición silenciosa:', error?.response?.data ?? error.message);
        return Promise.reject(error);
    }
);

export const install = (app) => {
    app.config.globalProperties.$axios = client
    app.config.globalProperties.$backgroundAxios = backgroundClient
}

export { backgroundClient }
export default client;