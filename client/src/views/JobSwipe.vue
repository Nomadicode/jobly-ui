<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import JobCard from '@/components/cards/JobCard.vue'

const job = ref({})

const api = inject('api')

const fetchJob = async () => {
    const response = await api.get('/jobs/random')
    job.value = mapJob(response.data)
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
  padding: 20px;
}

</style>
