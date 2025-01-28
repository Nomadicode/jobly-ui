import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useSubscriptionStore = defineStore('Subscription', {
    state: () => {
        const subscription: string = ref({
            id: '1234567890',
            status: 'active',
            plan: 'Jobly Pro',
            billingPeriod: 'Monthly',
            nextBillingDate: '2025-02-28',
            amount: '$29.99',
            paymentMethod: 'Visa ending in 4242',
        })

        async function fetchSubscription() {
            // const response =    await api.get('/account/subscription')
            // subscription.value = response.data
        // }
        }

        return { subscription, fetchSubscription }
    },
    persist: true,
})
