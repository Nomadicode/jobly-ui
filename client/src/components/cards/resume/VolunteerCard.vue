<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeVolunteer } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Editor from 'primevue/editor'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultVolunteer: ResumeVolunteer = {
    id: null,
    title: null,
    organization: null,
    organizationDescription: null,
    startDate: null,
    endDate: null,
    isPresent: false,
    highlights: [],
    details: null,
}

const volunteerFormOpen = ref(false)
const volunteerItems = ref<ResumeVolunteer[]>([])
const activeVolunteer = ref<ResumeVolunteer | null>(null)
const editMode = ref(false)

const fetchVolunteer = async () => {
    const result = await api.get(`/volunteer-experience/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    volunteerItems.value = result.data['results']
}

onMounted(async () => {
    await fetchVolunteer()
})

const openVolunteerForm = (volunteer?: ResumeVolunteer) => {
    if (volunteer?.id) {
        volunteerFormOpen.value = true
        activeVolunteer.value = Object.assign({}, volunteer)
        editMode.value = true
    } else {
        volunteerFormOpen.value = true
        activeVolunteer.value = Object.assign({}, defaultVolunteer)
        editMode.value = false
    }
}

const cancelVolunteerForm = () => {
    volunteerFormOpen.value = false
    activeVolunteer.value = Object.assign({}, defaultVolunteer)
    editMode.value = false
}

const addVolunteer = async () => {
    const volunteerData: ResumeVolunteer = {
        organization: activeVolunteer.value.organization,
        organizationDescription: activeVolunteer.value.organizationDescription,
        position: activeVolunteer.value.position,
        location: activeVolunteer.value.location,
        startDate: activeVolunteer.value.startDate ? new Date(activeVolunteer.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeVolunteer.value.endDate ? new Date(activeVolunteer.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeVolunteer.value.endDate ? false : true,
        highlights: activeVolunteer.value.highlights,
        details: activeVolunteer.value.details,
    }

    const result = await api.post('/volunteer-experience/', volunteerData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding volunteer experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeVolunteer.value = Object.assign({}, defaultVolunteer)
        editMode.value = false
        volunteerFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Volunteer experience added',
        detail: 'Volunteer experience added successfully',
        severity: 'success',
        life: 3000
    })

    volunteerFormOpen.value = false
    activeVolunteer.value = Object.assign({}, defaultVolunteer)
    editMode.value = false
    await fetchVolunteer()
}

const updateVolunteer = async () => {
    const volunteerData: ResumeVolunteer = {
        organization: activeVolunteer.value.organization,
        organizationDescription: activeVolunteer.value.organizationDescription,
        position: activeVolunteer.value.position,
        location: activeVolunteer.value.location,
        startDate: activeVolunteer.value.startDate ? new Date(activeVolunteer.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeVolunteer.value.endDate ? new Date(activeVolunteer.value.endDate).toISOString().split('T')[0] : null,
        isPresent: activeVolunteer.value.endDate ? false : true,
        highlights: activeVolunteer.value.highlights,
        details: activeVolunteer.value.details,
    }

    const result = await api.put(`/volunteer-experience/${activeVolunteer.value.id}/`, volunteerData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating volunteer experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeVolunteer.value = Object.assign({}, defaultVolunteer)
        editMode.value = false
        volunteerFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Volunteer experience updated',
        detail: 'Volunteer experience updated successfully',
        severity: 'success',
        life: 3000
    })

    volunteerFormOpen.value = false
    activeVolunteer.value = Object.assign({}, defaultVolunteer)
    editMode.value = false
    await fetchVolunteer()
}

const deleteVolunteer = async (id: number) => {
    const result = await api.delete(`/volunteer-experience/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting volunteer experience',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Volunteer experience deleted',
        detail: 'Volunteer experience deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchVolunteer()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Volunteer Experience</h2>
                <Button
                    @click="openVolunteerForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Experience
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!volunteerFormOpen && volunteerItems.length === 0" class="empty-state">
                <p class="body-md">No volunteer experience added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="volunteer in volunteerItems" :key="volunteer.id" class="volunteer-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="heading-md heavy">{{ volunteer.position }}</div>
                            <div class="body-md italic">{{ volunteer.startDate }} - {{ volunteer.endDate ? volunteer.endDate : 'Present' }}</div>
                        </div>
                        <div class="flex flex-row justify-content-between">
                            <p class="body-md heavy">{{ volunteer.organization }}</p>
                        </div>
                        <div v-if="volunteer.details" class="flex flex-column py-3 gap-1">
                            <p class="body-sm light italic" v-html="volunteer.details ? volunteer.details : 'No description listed'"></p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openVolunteerForm(volunteer)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteVolunteer(volunteer.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="volunteerFormOpen"
                class="volunteer-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeVolunteer.organization"
                        label="Organization"
                        placeholder="e.g. Google"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeVolunteer.position"
                        label="Position"
                        placeholder="e.g. Software Engineer"
                    />
                    
                    <TextInput
                        v-model="activeVolunteer.location"
                        label="Location"
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeVolunteer.startDate"
                        label="Start Date"
                        type="date"
                        placeholder="e.g. 2018-09-01"
                    />

                    <TextInput
                        v-model="activeVolunteer.endDate"
                        label="End Date"
                        type="date"
                        optional
                        placeholder="e.g. 2022-06-01"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1">
                    <Checkbox
                        v-model="activeVolunteer.isPresent"
                        label="Currently Volunteering Here"
                    />
                </div>

                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Details</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeVolunteer.details"
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
                        @click="cancelVolunteerForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateVolunteer() : addVolunteer()"
                        :label="editMode ? 'Update Volunteer Experience' : 'Add Volunteer Experience'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.volunteer-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.volunteer-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


