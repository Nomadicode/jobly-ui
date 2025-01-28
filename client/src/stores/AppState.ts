import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('AppState', {
    state: () => {
        const isLoading = ref(false);

        function setLoading(value: boolean) {
            isLoading.value = value
        }

        return {
            setLoading,
            isLoading,
        }
    },
    persist: true,
})
