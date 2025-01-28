<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeHonor } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Editor from 'primevue/editor'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultHonor: ResumeHonor = {
    id: null,
    name: null,
    issuingOrganization: null,
    issuingOrgDescription: null,
    issuingOrgUrl: null,
    issueDate: null,
    expiryDate: null,
    credentialId: null,
    credentialUrl: null,
}

const honorFormOpen = ref(false)
const honorItems = ref<ResumeHonor[]>([])
const activeHonor = ref<ResumeHonor | null>(null)
const editMode = ref(false)

const fetchHonors = async () => {
    const result = await api.get(`/honors/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching honors',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    honorItems.value = result.data['results']
}

onMounted(async () => {
    await fetchHonors()
})

const openHonorForm = (honor?: ResumeHonor) => {
    if (honor?.id) {
        honorFormOpen.value = true
        activeHonor.value = Object.assign({}, honor)
        editMode.value = true
    } else {
        honorFormOpen.value = true
        activeHonor.value = Object.assign({}, defaultHonor)
        editMode.value = false
    }
}

const cancelHonorForm = () => {
    honorFormOpen.value = false
    activeHonor.value = Object.assign({}, defaultHonor)
    editMode.value = false
}

const addHonor = async () => {
    const honorData: ResumeHonor = {
        name: activeHonor.value.name,
        year: activeHonor.value.year,
        details: activeHonor.value.details,
    }

    const result = await api.post('/honors/', honorData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding honor',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeHonor.value = Object.assign({}, defaultHonor)
        editMode.value = false
        honorFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Honor added',
        detail: 'Honor added successfully',
        severity: 'success',
        life: 3000
    })

    honorFormOpen.value = false
    activeHonor.value = Object.assign({}, defaultHonor)
    editMode.value = false
    await fetchHonors()
}

const updateHonor = async () => {
    const honorData: ResumeHonor = {
        name: activeHonor.value.name,
        year: activeHonor.value.year,
        details: activeHonor.value.details,
    }

    const result = await api.put(`/honors/${activeHonor.value.id}/`, honorData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating honor',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeHonor.value = Object.assign({}, defaultHonor)
        editMode.value = false
        honorFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Honor updated',
        detail: 'Honor updated successfully',
        severity: 'success',
        life: 3000
    })

    honorFormOpen.value = false
    activeHonor.value = Object.assign({}, defaultHonor)
    editMode.value = false
    await fetchHonors()
}

const deleteHonor = async (id: number) => {
    const result = await api.delete(`/honors/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting honor',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Honor deleted',
        detail: 'Honor deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchHonors()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Honors & Awards</h2>
                <Button
                    @click="openHonorForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Honor/Award
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!honorFormOpen && honorItems.length === 0" class="empty-state">
                <p class="body-md">No honors & awards added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="honor in honorItems" :key="honor.id" class="honor-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="heading-md heavy">{{ honor.name }}</div>
                            <div class="body-md italic">{{ honor.year }}</div>
                        </div>
                        <div v-if="honor.details" class="flex flex-column py-3 gap-1">
                            <p class="body-sm light italic" v-html="honor.details ? honor.details : 'No description listed'"></p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openHonorForm(honor)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteHonor(honor.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="honorFormOpen"
                class="honor-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeHonor.name"
                        label="Name"
                        placeholder="e.g. Employee of the Month"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeHonor.year"
                        label="Year"
                        type="number"
                        placeholder="e.g. 2022"
                    />
                    
                </div>  

                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Details</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeHonor.details"
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
                        @click="cancelHonorForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateHonor() : addHonor()"
                        :label="editMode ? 'Update Honor/Award' : 'Add Honor/Award'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.honor-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.honor-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


