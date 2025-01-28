import { defineStore } from 'pinia'
import type { User } from '@/types/user'

interface UserState {
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userId: null,
        firstName: null,
        lastName: null,
        email: null
    }),
    persist: {
        key: 'user-store',
        storage: localStorage,
    },
    actions: {
        setUserData(userData: User) {
            this.userId = userData.id
            this.firstName = userData.firstName
            this.lastName = userData.lastName
            this.email = userData.email
        },
        clearUserData() {
            this.userId = null
            this.firstName = null
            this.lastName = null
            this.email = null
        }
    }
})
