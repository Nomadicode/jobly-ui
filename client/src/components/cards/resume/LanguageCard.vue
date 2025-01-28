<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeLanguage } from '@/types/Resume'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Card from 'primevue/card'
import Editor from 'primevue/editor'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['onUpdate'])

const api = inject('api')
const toast = useToast()

const defaultLanguage: ResumeLanguage = {
    id: null,
    name: null,
    proficiencyLevel: null,
}

const languageFormOpen = ref(false)
const languageItems = ref<ResumeLanguage[]>([])
const activeLanguage = ref<ResumeLanguage | null>(null)
const editMode = ref(false)

const proficiencyLevels = ref([
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Expert', value: 'expert' },
])

const fetchLanguages = async () => {
    const result = await api.get(`/languages/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching languages',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    languageItems.value = result.data['results']
}

onMounted(async () => {
    await fetchLanguages()
})

const openLanguageForm = (language?: ResumeLanguage) => {
    if (language?.id) {
        languageFormOpen.value = true
        activeLanguage.value = Object.assign({}, language)
        editMode.value = true
    } else {
        languageFormOpen.value = true
        activeLanguage.value = Object.assign({}, defaultLanguage)
        editMode.value = false
    }
}

const cancelLanguageForm = () => {
    languageFormOpen.value = false
    activeLanguage.value = Object.assign({}, defaultLanguage)
    editMode.value = false
}

const addLanguage = async () => {
    const languageData: ResumeLanguage = {
        name: activeLanguage.value.name,
        proficiencyLevel: activeLanguage.value.proficiencyLevel,
    }

    const result = await api.post('/languages/', languageData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding language',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeLanguage.value = Object.assign({}, defaultLanguage)
        editMode.value = false
        languageFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Language added',
        detail: 'Language added successfully',
        severity: 'success',
        life: 3000
    })

    languageFormOpen.value = false
    activeLanguage.value = Object.assign({}, defaultLanguage)
    editMode.value = false
    await fetchLanguages()
}

const updateLanguage = async () => {
    const languageData: ResumeLanguage = {
        name: activeLanguage.value.name,
        proficiencyLevel: activeLanguage.value.proficiencyLevel,
    }

    const result = await api.put(`/languages/${activeLanguage.value.id}/`, languageData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating language',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeLanguage.value = Object.assign({}, defaultLanguage)
        editMode.value = false
        languageFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Language updated',
        detail: 'Language updated successfully',
        severity: 'success',
        life: 3000
    })

    languageFormOpen.value = false
    activeLanguage.value = Object.assign({}, defaultLanguage)
    editMode.value = false
    await fetchLanguages()
}

const deleteLanguage = async (id: number) => {
    const result = await api.delete(`/languages/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting language',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Language deleted',
        detail: 'Language deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchLanguages()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Languages</h2>
                <Button
                    @click="openLanguageForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Language
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!languageFormOpen && languageItems.length === 0" class="empty-state">
                <p class="body-md">No languages added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="language in languageItems" :key="language.id" class="language-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-column gap-1">
                            <div class="heading-md heavy">{{ language.name }}</div>
                            <div class="body-md italic">{{ language.proficiencyLevel }}</div>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openLanguageForm(language)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteLanguage(language.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="languageFormOpen"
                class="language-form"
            >   
                <div class="flex flex-column gap-1">
                    <TextInput
                        v-model="activeLanguage.name"
                        label="Name"
                        placeholder="e.g. English"
                    />
                    <Select
                        v-model="activeLanguage.proficiencyLevel"
                        :options="proficiencyLevels"
                        label="Proficiency Level"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select proficiency level"
                    />   
                </div>

                <div class="flex justify-content-end gap-2">
                    <Button
                        @click="cancelLanguageForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateLanguage() : addLanguage()"
                        :label="editMode ? 'Update Language' : 'Add Language'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.language-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.language-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


