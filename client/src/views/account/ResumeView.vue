<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { ApiData } from '@/types/ApiTypes'
import { Resume, ResumeLink } from '@/types/Resume'
import { useDialog } from 'primevue/usedialog'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'
import TextInput from '@/components/forms/TextInput.vue';
import { useRouter } from 'vue-router'
import CertificationCard from '@/components/cards/resume/CertificationCard.vue'
import LinkCard from '@/components/cards/resume/LinkCard.vue'
import SkillCard from '@/components/cards/resume/SkillCard.vue'
import EducationCard from '@/components/cards/resume/EducationCard.vue'
import ExperienceCard from '@/components/cards/resume/ExperienceCard.vue'
import ProjectCard from '@/components/cards/resume/ProjectCard.vue'
import VolunteerCard from '@/components/cards/resume/VolunteerCard.vue'
import HonorCard from '@/components/cards/resume/HonorCard.vue'
import LanguageCard from '@/components/cards/resume/LanguageCard.vue'
const router = useRouter()
const dialog = useDialog()

const api = inject('api')
const toast = useToast()

const resumeId = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const summary = ref<string>('')
const links = ref<ResumeLink[]>([])


const fetchResume = async () => {
    const result = await api.get('/resumes/')

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: "Error fetching resume",
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    const resume: ApiData<Resume> = result.data
    if (resume.results.length === 0) {
        return
    }

    resumeId.value = resume.results[0].id
    firstName.value = resume.results[0].firstName
    lastName.value = resume.results[0].lastName
    email.value = resume.results[0].email
    phone.value = resume.results[0].phone
    summary.value = resume.results[0].summary
    links.value = resume.results[0].profileLinks
}

onMounted(async () => {
    await fetchResume()
})

</script>

<template>
    <div class="my-3 flex flex-column gap-3">
        <Card>
            <template #content>
                <div class="flex flex-column md:flex-row gap-4 justify-content-center align-items-center">
                    <Button
                        @click="populateFromLinkedIn"
                        severity="info"
                        size="large"
                    >
                        <i class="pi pi-linkedin"></i>
                        <span>Populate from LinkedIn</span>
                    </Button>
                    <Button
                        @click="populateFromResume"
                        severity="info"
                        outlined
                        size="large"
                    >
                        <i class="pi pi-file-pdf"></i>
                        <span>Populate from Resume</span>
                    </Button>
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                <div class="flex justify-content-between align-items-center">
                    <h2 class="heading-md pl-3 pt-2 font-bold">Personal Information</h2>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col gap-2">
                    <TextInput label="First Name" v-model="firstName" />
                    <TextInput label="Last Name" v-model="lastName" />
                </div>
                <div class="flex flex-col gap-2">
                    <TextInput label="Email" type="email" v-model="email" />
                    <TextInput label="Phone" type="tel" v-model="phone" />
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex flex-column gap-2 w-full mb-2">
                        <label for="summary">
                            <span class="body-md">Professional Summary</span>
                        </label>
                        <Textarea id="summary" v-model="summary" />
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-content-end">
                    <Button label="Save" @click="saveResume"/>
                </div>
            </template>
        </Card>

        <LinkCard
            :links="links"
            :resumeId="resumeId"
            @linksUpdated="fetchResume"
        />

        <EducationCard />

        <ExperienceCard />

        <ProjectCard />

        <CertificationCard />

        <VolunteerCard />

        <HonorCard />

        <LanguageCard />
    </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@import '@/assets/scss/scheme/colors';

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background-color: color.adjust($background, $lightness: -10%);
    font-size: 16px;
    color: color.adjust($primary-text, $lightness: 10%);
    border-radius: 0.5rem;
}

.section-data {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border-radius: 4px;
    background-color: color.adjust($background, $lightness: -10%);
    margin-top: 10px;
}

.link-card-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .link-card {
        display: flex;
        background-color: $highlights;
        flex-direction: column;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        color: $grey;
    }
}

.education-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .education-card {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: $highlights;
        color: $grey;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
    }
}

.experience-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .experience-card {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: $highlights;
        color: $grey;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
    }
}



</style>
