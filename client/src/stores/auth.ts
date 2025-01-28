import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('Auth', {
    state: () => {
        const accessToken: string = ref('')
        const refreshToken: string = ref('')

        const isLoggedIn: boolean = computed(() => (accessToken.value ? true : false))

        function logout() {
            accessToken.value = null
            refreshToken.value = null
        }

        function setAccessToken(newToken: string) {
            accessToken.value = newToken
        }

        function setRefreshToken(newToken: string) {
            refreshToken.value = newToken
        }

        return { accessToken, refreshToken, isLoggedIn, setAccessToken, setRefreshToken, logout }
    },
    persist: true,
})
