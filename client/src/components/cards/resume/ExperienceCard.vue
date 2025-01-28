<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeWorkExperience } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Editor from 'primevue/editor'
import Tag from 'primevue/tag'

import TagInput from '@/components/forms/TagInput.vue'
import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultExperience = {
    id: null,
    title: null,
    companyName: null,
    companyDescription: null,
    startDate: null,
    endDate: null,
    position: null,
    location: null,
    isPresent: false,
    highlights: [],
    details: null,
    skills: []
}

const experienceFormOpen = ref(false)
const experienceItems = ref<ResumeWorkExperience[]>([])
const activeExperience = ref<ResumeWorkExperience | null>(null)
const editMode = ref(false)

const fetchExperience = async () => {
    const result = await api.get(`/work-experience/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    experienceItems.value = result.data['results']
}

onMounted(async () => {
    await fetchExperience()
})

const openExperienceForm = (experience?: ResumeWorkExperience) => {
    if (experience?.id) {
        experienceFormOpen.value = true
        activeExperience.value = Object.assign({}, experience)
        editMode.value = true
    } else {
        experienceFormOpen.value = true
        activeExperience.value = Object.assign({}, defaultExperience)
        editMode.value = false
    }
}

const cancelExperienceForm = () => {
    experienceFormOpen.value = false
    activeExperience.value = Object.assign({}, defaultExperience)
    editMode.value = false
}

const addExperience = async () => {
    const experienceData = {
        companyName: activeExperience.value.companyName,
        position: activeExperience.value.position,
        location: activeExperience.value.location,
        startDate: activeExperience.value.startDate ? new Date(activeExperience.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeExperience.value.endDate ? new Date(activeExperience.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeExperience.value.endDate ? false : true,
        highlights: activeExperience.value.highlights,
        details: activeExperience.value.details,
        skills: activeExperience.value.skills
    }

    const result = await api.post('/work-experience/', experienceData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeExperience.value = Object.assign({}, defaultExperience)
        editMode.value = false
        experienceFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Experience added',
        detail: 'Experience added successfully',
        severity: 'success',
        life: 3000
    })

    experienceFormOpen.value = false
    activeExperience.value = Object.assign({}, defaultExperience)
    editMode.value = false
    await fetchExperience()
}

const updateExperience = async () => {
    const experienceData = {
        companyName: activeExperience.value.companyName,
        position: activeExperience.value.position,
        location: activeExperience.value.location,
        startDate: activeExperience.value.startDate ? new Date(activeExperience.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeExperience.value.endDate ? new Date(activeExperience.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeExperience.value.endDate ? false : true,
        highlights: activeExperience.value.highlights,
        details: activeExperience.value.details,
        skills: activeExperience.value.skills
    }

    const result = await api.put(`/work-experience/${activeExperience.value.id}/`, experienceData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeExperience.value = Object.assign({}, defaultExperience)
        editMode.value = false
        experienceFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Experience updated',
        detail: 'Experience updated successfully',
        severity: 'success',
        life: 3000
    })

    experienceFormOpen.value = false
    activeExperience.value = Object.assign({}, defaultExperience)
    editMode.value = false
    await fetchExperience()
}

const deleteExperience = async (id: number) => {
    const result = await api.delete(`/work-experience/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Experience deleted',
        detail: 'Experience deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchExperience()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Work Experience</h2>
                <Button
                    @click="openExperienceForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Experience
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!experienceFormOpen && experienceItems.length === 0" class="empty-state">
                <p class="body-md">No experience added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="experience in experienceItems" :key="experience.id" class="experience-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="heading-md heavy">{{ experience.position }}</div>
                            <div class="body-md italic">{{ experience.startDate }} - {{ experience.endDate ? experience.endDate : 'Present' }}</div>
                        </div>
                        <div class="flex flex-row justify-content-between">
                            <p class="body-md heavy">{{ experience.companyName }}</p>
                        </div>
                        <div class="flex flex-row gap-1 pt-3 flex-wrap">
                            <Tag
                                v-for="skill in experience.skills"
                                :key="skill"
                                :value="skill"
                            />
                        </div>
                        <div v-if="experience.details" class="flex flex-column py-3 gap-1">
                            <p class="body-sm light italic" v-html="experience.details ? experience.details : 'No description listed'"></p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openExperienceForm(experience)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteExperience(experience.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="experienceFormOpen"
                class="experience-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeExperience.companyName"
                        label="Company Name"
                        placeholder="e.g. Google"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeExperience.position"
                        label="Position"
                        placeholder="e.g. Software Engineer"
                    />
                    
                    <TextInput
                        v-model="activeExperience.location"
                        label="Location"
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeExperience.startDate"
                        label="Start Date"
                        type="date"
                        placeholder="e.g. 2018-09-01"
                    />

                    <TextInput
                        v-model="activeExperience.endDate"
                        label="End Date"
                        type="date"
                        optional
                        placeholder="e.g. 2022-06-01"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1">
                    <Checkbox
                        v-model="activeExperience.isPresent"
                        label="Currently Working Here"
                    />
                </div>

                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Accomplishments</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeExperience.details"
                            editor-style="height: 200px;"
                            :pt="{
                                toolbar: {
                                    container: 'w-full'
                                }
                            }"
                        >
                            <template #toolbar>
                                <span class="ql-formats">
                                    <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                                    <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                                    <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                                    <button v-tooltip.bottom="'List'" class="ql-list" value="ordered"></button>
                                    <button v-tooltip.bottom="'Bullet'" class="ql-list" value="bullet"></button>
                                </span>
                            </template>
                        </Editor>
                    </div>
                </div>

                <TagInput
                    v-model="activeExperience.skills"
                    label="Skills"
                    placeholder="e.g. JavaScript, Python, etc."
                />

                <div class="flex justify-content-end gap-2">
                    <Button
                        @click="cancelExperienceForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateExperience() : addExperience()"
                        :label="editMode ? 'Update Experience' : 'Add Experience'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.experience-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.experience-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


