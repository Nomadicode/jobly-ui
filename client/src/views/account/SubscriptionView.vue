<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'

import Button from 'primevue/button'
import Card from 'primevue/card'
import DataView from 'primevue/dataview'
import Tag from 'primevue/tag'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const billingHistory = ref([
    {
        price: '$29.99',
        date: '2025-02-28',
        status: 'Paid',
        plan: 'Jobly Pro',
        paymentMethod: 'Visa ending in 4242',
    }, 
    {
        price: '$29.99',
        date: '2025-02-28',
        status: 'Paid',
        plan: 'Jobly Pro',
        paymentMethod: 'Visa ending in 4242',
    }
])

onMounted(async () => {
    await subscriptionStore.fetchSubscription()
})

</script>

<template>
    <div class="flex flex-column gap-4">
        <h1 class="heading-lg font-bold">My Subscription</h1>

        <Card>
            <template #header>
                <div class="flex justify-content-between align-items-center p-2 pr-3">
                    <h2 class="heading-md pl-3 pt-2 font-bold">Current Plan Details</h2>
                    <Tag
                        :severity="subscriptionStore.subscription?.status || 'active'"
                        :value="subscriptionStore.subscription?.status || 'Active'"
                    />
                </div>
            </template>

            <template #content>
                <div class="flex flex-column gap-4">
                    <div class="subscription-details">
                        <div class="detail-row">
                            <span class="label">Plan Name:</span>
                            <span class="value body-lg">{{ subscriptionStore.subscription?.plan }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Billing Period:</span>
                            <span class="value body-lg">{{ subscriptionStore.subscription?.billingPeriod }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Next Billing Date:</span>
                            <span class="value body-lg">{{ subscriptionStore.subscription?.nextBillingDate }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Amount:</span>
                            <span class="value body-lg">{{ subscriptionStore.subscription?.amount }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Payment Method:</span>
                            <span class="value body-lg">{{ subscriptionStore.subscription?.paymentMethod }}</span>
                        </div>
                    </div>

                    <div class="subscription-actions flex flex-column gap-3">
                        <div class="flex justify-content-between gap-3">
                            <Button
                                v-if="subscriptionStore.subscription?.plan === 'Jobly Free'"
                                label="Upgrade to Pro" 
                                severity="success"
                                icon="pi pi-arrow-up"
                                size="large"
                            />
                            <Button
                                v-if="subscriptionStore.subscription?.plan === 'Jobly Pro'"
                                label="Cancel Plan" 
                                severity="danger"
                                icon="pi pi-times"
                                size="large"
                                outlined
                            />
                            <Button 
                                label="Update Payment Method" 
                                severity="info"
                                icon="pi pi-credit-card"
                                outlined
                                size="large"
                            />
                            <Button 
                                label="Pause Subscription" 
                                severity="secondary"
                                icon="pi pi-pause"
                                outlined
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                <h2 class="heading-md pl-3 pt-2 font-bold">Billing History</h2>
            </template>
            
            <template #content>
                <DataView :value="billingHistory" layout="list">
                    <template #list="slotProps">
                        <div class="flex flex-column gap-4">
                            <div v-for="(item, index) in billingHistory" :key="index">
                                <div class="billing-history-item flex justify-content-between align-items-center p-3 border-round" :class="{ 'surface-hover': index % 2 === 0 }">
                                    <div class="flex flex-column gap-1">
                                        <span class="heading-md">{{ item.plan }}</span>
                                        <span class="body-md italic">{{ item.date }}</span>
                                    </div>
                                    
                                    <div class="flex align-items-center gap-3">
                                        <span class="font-semibold text-lg">{{ item.price }}</span>
                                        <Tag :severity="item.status === 'Paid' ? 'success' : 'warning'" :value="item.status" />
                                        <Button 
                                            icon="pi pi-download" 
                                            text 
                                            rounded
                                            severity="secondary"
                                            v-tooltip.top="'Download Invoice'"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </template>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/scheme/colors';

.status-badge {
    background-color: $background-dark;
    color: $text-light;
}

.subscription-details {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
            font-weight: bold;
        }
        
        .value {
            font-weight: normal;
        }
    }
}
</style>

