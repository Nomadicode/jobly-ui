<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeEducation } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Editor from 'primevue/editor'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultEducation = {
    id: null,
    institution: null,
    institutionDescription: null,
    degree: null,
    fieldOfStudy: null,
    startDate: null,
    endDate: null,
    isPresent: false,
    gpa: null,
    highlights: [],
    details: null
}

const educationFormOpen = ref(false)
const educationItems = ref<ResumeEducation[]>([])
const activeEducation = ref<ResumeEducation | null>(null)
const editMode = ref(false)

const fetchEducation = async () => {
    const result = await api.get(`/education/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching education',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    educationItems.value = result.data['results']
}

onMounted(async () => {
    await fetchEducation()
})

const openEducationForm = (education?: ResumeEducation) => {
    if (education?.id) {
        educationFormOpen.value = true
        activeEducation.value = Object.assign({}, education)
        editMode.value = true
    } else {
        educationFormOpen.value = true
        activeEducation.value = Object.assign({}, defaultEducation)
        editMode.value = false
    }
}

const cancelEducationForm = () => {
    educationFormOpen.value = false
    activeEducation.value = Object.assign({}, defaultEducation)
    editMode.value = false
}

const addEducation = async () => {
    const educationData = {
        institution: activeEducation.value.institution,
        degree: activeEducation.value.degree,
        fieldOfStudy: activeEducation.value.fieldOfStudy,
        startDate: activeEducation.value.startDate ? new Date(activeEducation.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeEducation.value.endDate ? new Date(activeEducation.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeEducation.value.endDate ? false : true,
        gpa: activeEducation.value.gpa,
        details: activeEducation.value.details
    }

    const result = await api.post('/education/', educationData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding education',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeEducation.value = Object.assign({}, defaultEducation)
        editMode.value = false
        educationFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Education added',
        detail: 'Education added successfully',
        severity: 'success',
        life: 3000
    })

    educationFormOpen.value = false
    activeEducation.value = Object.assign({}, defaultEducation)
    editMode.value = false
    await fetchEducation()
}

const updateEducation = async () => {
    const educationData = {
        institution: activeEducation.value.institution,
        degree: activeEducation.value.degree,
        fieldOfStudy: activeEducation.value.fieldOfStudy,
        startDate: activeEducation.value.startDate ? new Date(activeEducation.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeEducation.value.endDate ? new Date(activeEducation.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeEducation.value.endDate ? false : true,
        gpa: activeEducation.value.gpa,
        details: activeEducation.value.details
    }

    const result = await api.put(`/education/${activeEducation.value.id}/`, educationData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating education',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeEducation.value = Object.assign({}, defaultEducation)
        editMode.value = false
        educationFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Education updated',
        detail: 'Education updated successfully',
        severity: 'success',
        life: 3000
    })

    educationFormOpen.value = false
    activeEducation.value = Object.assign({}, defaultEducation)
    editMode.value = false
    await fetchEducation()
}

const deleteEducation = async (id: number) => {
    const result = await api.delete(`/education/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting education',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Education deleted',
        detail: 'Education deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchEducation()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Education</h2>
                <Button
                    @click="openEducationForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Education
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!educationFormOpen && educationItems.length === 0" class="empty-state">
                <p class="body-md">No education added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="education in educationItems" :key="education.id" class="education-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="body-lg heavy">{{ education.institution }}</div>
                            <div class="body-md light italic">{{ education.startDate }} - {{ education.endDate ? education.endDate : 'Present' }}</div>
                        </div>
                        <div class="flex flex-row justify-content-between">
                            <p class="body-md light italic">{{ education.degree }} in <span class="body-md medium">{{ education.fieldOfStudy }}</span></p>
                            <p class="body-md light italic">GPA: {{ education.gpa || 'N/A' }}</p>
                        </div>
                        <div v-if="education.details" class="flex flex-column py-3 gap-1">
                            <p class="body-md medium">Accomplishments</p>
                            <p class="body-sm light italic">{{ education.details ? education.details : 'No accomplishments listed' }}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openEducationForm(education)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteEducation(education.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="educationFormOpen"
                class="education-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeEducation.institution"
                        label="Institution"
                        placeholder="e.g. University of California, Los Angeles"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeEducation.fieldOfStudy"
                        label="Field of Study"
                        placeholder="e.g. Computer Science"
                    />
                    
                    <TextInput
                        v-model="activeEducation.degree"
                        label="Degree"
                        placeholder="e.g. Bachelor of Science"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeEducation.startDate"
                        label="Start Date"
                        type="date"
                        placeholder="e.g. 2018-09-01"
                    />

                    <TextInput
                        v-model="activeEducation.endDate"
                        label="End Date"
                        type="date"
                        optional
                        placeholder="e.g. 2022-06-01"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeEducation.gpa"
                        label="GPA"
                        placeholder="e.g. 3.5"
                        optional
                    />
                </div>

                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Accomplishments</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeEducation.details"
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

                <div class="flex justify-content-end gap-2">
                    <Button
                        @click="cancelEducationForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateEducation() : addEducation()"
                        :label="editMode ? 'Update Education' : 'Add Education'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.education-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.education-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


