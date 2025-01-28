<script setup lang="ts">
import { ref, onMounted } from 'vue'
import JobCard from '@/components/cards/JobCard.vue'
import Button from 'primevue/button'

const job = ref({})

const fetchJob = async () => {
    const response = await fetch('https://www.themuse.com/api/public/jobs?page=1&per_page=1')
    const data = await response.json()
    job.value = mapJob(data.results[0])
}

const mapJob = (job: any) => {
    return {
        title: job.name,
        company: job.company.name,
        location: job.locations.map((location: any) => location.name).join(', '),
        description: job.contents,
        postedDate: job.publication_date,
        salary: job.salary_min
    }
}

onMounted(() => {
    fetchJob()
})

const saveJob = () => {
    console.log('save job')
}

const rejectJob = () => {
    console.log('reject job')
}

const applyJob = () => {
    console.log('apply job')
}
</script>

<template>
  <div class="container">
    <JobCard
      v-bind="job"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 54px);
}
</style>
