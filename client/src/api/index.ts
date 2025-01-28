import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStateStore } from '@/stores/AppState'

import { camelCaseKeys, snakeCaseKeys } from '@/utils/formatters'

const headers = {}

const api = axios.create({
    baseURL: import.meta.env.VUE_APP_API_URL || import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/',
    headers: headers,
    responseType: 'json',
    transformRequest: [
        (data) => {
            data = data instanceof FormData ? data : snakeCaseKeys(data)
            return data
        },
        ...axios.defaults.transformRequest,
    ],
    transformResponse: [
        (data) => {
            if (!data) return null
            data = JSON.parse(data)
            data = camelCaseKeys(data)
            return data
        },
        ...axios.defaults.transformResponse,
    ],
})

api.interceptors.request.use(function (config) {
    const authStore = useAuthStore()

    if (authStore.isLoggedIn) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
})
// Refresh interceptor
api.interceptors.response.use(
    (res) => {
        return res
    },
    async (err) => {
        const originalConfig = err.config
        const authStore = useAuthStore()
        const router = useRouter()
        const { logout, setAccessToken } = authStore
        console.log(err)
        if (originalConfig && originalConfig.url === '/auth/token/refresh/' && err.response) {
            logout()
            router.push('/auth/login')
            return new Promise(() => {})
        }
        if (originalConfig && originalConfig.url !== '/auth/login' && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && useAuthStore().isLoggedIn.value && !originalConfig._retry) {
                originalConfig._retry = true
                originalConfig._retryCount += 1

                try {
                    const rs = await api.post('/auth/token/refresh/', {
                        refresh: authStore.refreshToken,
                    })

                    setAccessToken(rs.data.access)
                    originalConfig.headers['Authorization'] = `Bearer ${rs.data.access}`
                    return api(originalConfig)
                } catch (_error) {
                    console.log(_error)
                    return Promise.reject(_error)
                }
            }
        }

        if (err.response) {
            return err.response
        }
    }
)

export default api
