<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const emits = defineEmits(['reject', 'save', 'apply'])

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: false
    },
    salary: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    jobType: {
        type: String,
        required: false,
        default: 'Full-Time'
    },
    jobLocationType: {
        type: String,
        required: false,
        default: 'On-Site'
    },
    companyUrl: {
        type: String,
        required: false
    },
    postedDate: {
        type: String,
        required: false
    }
})

const tags = computed(() => {
    return [
        props.jobLocationType ? props.jobLocationType : '',
        props.location ? props.location : '',
        props.jobType ? props.jobType : ''
    ].filter(Boolean)
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
    <div class="job-card">
        <div class="job-data">
            <div class="job-card-header">
                <h2 class="job-card-title">{{ title }}</h2>

                <Button
                    class="job-card-company"
                    severity="secondary"
                    :href="companyUrl"
                    target="_blank"
                    :label="company"
                />
                
                <div class="job-tags">
                    <Tag
                        v-for="tag in tags"
                        severity="info"
                        :key="tag"
                        :value="tag"
                    />
                </div>
                
                <div class="job-card-details">
                    <div class="job-card-detail">{{ salary || 'No salary specified' }}</div>
                    <div class="job-card-detail">{{ formatDate(postedDate) }}</div>
                </div>
                
                <div class="job-card-description" v-html="description"></div>
            </div>
        </div>


        <div class="card-controls">
            <Button
                severity="danger"
                icon="pi pi-times"
                rounded
                @click="$emit('reject')"
            />
            <Button
                severity="info"
                icon="pi pi-heart"
                @click="$emit('save')"
                rounded
            />
            <Button
                severity="success"
                icon="pi pi-check"
                @click="$emit('apply')"
                rounded
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/scheme/colors';
@import '@/assets/scss/scheme/typography';

.job-card {
    position: relative;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    font-size: $body-lg;
    max-height: calc(100vh - 200px);
    padding: 20px 20px 0px 20px;
    overflow: hidden;
    color: $grey;
    line-height: 20px;

    &-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;

        .job-tags {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            gap: 10px;
        }
    }

    &-details {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        
        .job-card-detail {
            font-size: $body-md;
            color: $grey;
            font-style: italic;
        }
    }

    &-title {
        font-size: $header-lg;
        font-weight: 600;
        color: $grey;
    }

    &-description {
        margin-top: 12px;
    }

    .job-data {
        height: calc(100vh - 300px);
        overflow-y: auto;
    }

    .card-controls {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>

