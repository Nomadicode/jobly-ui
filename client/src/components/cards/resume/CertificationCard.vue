<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeCertification } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Editor from 'primevue/editor'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultCertification: ResumeCertification = {
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

const certificationFormOpen = ref(false)
const certificationItems = ref<ResumeCertification[]>([])
const activeCertification = ref<ResumeCertification | null>(null)
const editMode = ref(false)

const fetchCertifications = async () => {
    const result = await api.get(`/certifications/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching certifications',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    certificationItems.value = result.data['results']
}

onMounted(async () => {
    await fetchCertifications()
})

const openCertificationForm = (certification?: ResumeCertification) => {
    if (certification?.id) {
        certificationFormOpen.value = true
        activeCertification.value = Object.assign({}, certification)
        editMode.value = true
    } else {
        certificationFormOpen.value = true
        activeCertification.value = Object.assign({}, defaultCertification)
        editMode.value = false
    }
}

const cancelCertificationForm = () => {
    certificationFormOpen.value = false
    activeCertification.value = Object.assign({}, defaultCertification)
    editMode.value = false
}

const addCertification = async () => {
    const certificationData = {
        name: activeCertification.value.name,
        issuingOrganization: activeCertification.value.issuingOrganization,
        issuingOrgDescription: activeCertification.value.issuingOrgDescription,
        issuingOrgUrl: activeCertification.value.issuingOrgUrl,
        issueDate: activeCertification.value.issueDate ? new Date(activeCertification.value.issueDate).toISOString().split('T')[0] : null,
        expiryDate: activeCertification.value.expiryDate ? new Date(activeCertification.value.expiryDate).toISOString().split('T')[0] : null,
        credentialId: activeCertification.value.credentialId,
        credentialUrl: activeCertification.value.credentialUrl,
        details: activeCertification.value.details,
    }

    const result = await api.post('/certifications/', certificationData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding certification',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeCertification.value = Object.assign({}, defaultCertification)
        editMode.value = false
        certificationFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Certification added',
        detail: 'Certification added successfully',
        severity: 'success',
        life: 3000
    })

    certificationFormOpen.value = false
    activeCertification.value = Object.assign({}, defaultCertification)
    editMode.value = false
    await fetchCertifications()
}

const updateCertification = async () => {
    const certificationData = {
        name: activeCertification.value.name,
        issuingOrganization: activeCertification.value.issuingOrganization,
        issuingOrgDescription: activeCertification.value.issuingOrgDescription,
        issuingOrgUrl: activeCertification.value.issuingOrgUrl,
        issueDate: activeCertification.value.issueDate ? new Date(activeCertification.value.issueDate).toISOString().split('T')[0] : null,
        expiryDate: activeCertification.value.expiryDate ? new Date(activeCertification.value.expiryDate).toISOString().split('T')[0] : null,
        credentialId: activeCertification.value.credentialId,
        credentialUrl: activeCertification.value.credentialUrl,
        details: activeCertification.value.details,
    }

    const result = await api.put(`/certifications/${activeCertification.value.id}/`, certificationData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating certification',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeCertification.value = Object.assign({}, defaultCertification)
        editMode.value = false
        certificationFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Certification updated',
        detail: 'Certification updated successfully',
        severity: 'success',
        life: 3000
    })

    certificationFormOpen.value = false
    activeCertification.value = Object.assign({}, defaultCertification)
    editMode.value = false
    await fetchCertifications()
}

const deleteCertification = async (id: number) => {
    const result = await api.delete(`/certifications/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting certification',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Certification deleted',
        detail: 'Certification deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchCertifications()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Certifications</h2>
                <Button
                    @click="openCertificationForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Certification
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!certificationFormOpen && certificationItems.length === 0" class="empty-state">
                <p class="body-md">No certifications added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="certification in certificationItems" :key="certification.id" class="certification-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="heading-md heavy">{{ certification.name }}</div>
                            <div class="body-md italic">{{ certification.issueDate }} - {{ certification.expiryDate ? certification.expiryDate : 'Present' }}</div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <a class="body-md heavy" :href="certification.issuingOrgUrl" target="_blank">{{ certification.issuingOrganization }}</a>
                            <a class="body-md heavy" :href="certification.credentialUrl" target="_blank">{{ certification.credentialUrl }}</a>
                        </div>
                        <div v-if="certification.details" class="flex flex-column py-3 gap-1">
                            <p class="body-sm light italic" v-html="certification.details ? certification.details : 'No description listed'"></p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openCertificationForm(certification)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteCertification(certification.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="certificationFormOpen"
                class="certification-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeCertification.name"
                        label="Name"
                        placeholder="e.g. AWS Certified Developer"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeCertification.issueDate"
                        label="Issue Date"
                        type="date"
                        placeholder="e.g. 2022-01-01"
                    />
                    
                    <TextInput
                        v-model="activeCertification.expiryDate"
                        label="Expiry Date"
                        type="date"
                        optional
                        placeholder="e.g. 2022-06-01"
                    />      
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeCertification.issuingOrganization"
                        label="Issuing Organization"
                        placeholder="e.g. AWS"
                    />
                    <TextInput
                        v-model="activeCertification.issuingOrgUrl"
                        label="Issuing Organization URL"
                        optional
                        placeholder="e.g. https://aws.amazon.com"
                    />
                </div>


                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Details</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeCertification.details"
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
                        @click="cancelCertificationForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateCertification() : addCertification()"
                        :label="editMode ? 'Update Certification' : 'Add Certification'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.certification-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.certification-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


