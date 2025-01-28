<script setup lang="ts">
import { ref, inject } from 'vue'

import { useRouter } from 'vue-router'
import Chip from 'primevue/chip'

const api = inject('api')
const router = useRouter()

const jobTabs = ref([
    { label: 'Saved', count: 0 },
    { label: 'Applied', count: 0 },
    { label: 'Interviews', count: 0 },
    { label: 'Offers', count: 0 },
    { label: 'Rejected', count: 0 },
    { label: 'Accepted', count: 0 },
    { label: 'Archived', count: 0 },
])

const activeTab = ref('Saved')

let jobs = ref([])

const fetchJobs = async () => {
    const response = await api.get(`/account/jobs/${activeTab.value}`)
    jobs.value = response.data
}

const handleTabClick = (tab: string) => {
    activeTab.value = tab
}

</script>

<template>
    <div>
        <div class="flex flex-column justify-between items-center">
            <h1 class="heading-md font-bold">My Jobs</h1>

            <div class="job-tabs">
                <Chip
                    v-for="tab in jobTabs"
                    :key="tab.label"
                    :label="tab.label"
                    :value="tab.label"
                    :class="{
                        'chip-active': tab.label === activeTab,
                        'chip-inactive': tab.label !== activeTab
                    }"
                    @click="handleTabClick(tab.label)"
                >
                    <span class="chip-count">{{ tab.count }}</span>
                    <span class="chip-label">{{ tab.label }}</span>
                </Chip>
            </div>
        </div>

        <div class="job-list">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@import '@/assets/scss/scheme/colors';

.job-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;

    .chip-inactive {
        background-color: $primary-text;
        color: $background;
    }
}
</style>
