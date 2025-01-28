<script setup lang="ts">
import { ref, inject, PropType } from 'vue'
import { useToast } from 'primevue/usetoast'
import { ResumeLink } from '@/types/Resume'
import Button from 'primevue/button'
import Card from 'primevue/card'

import TextInput from '@/components/forms/TextInput.vue'

const emit = defineEmits(['linksUpdated'])

const api = inject('api')
const toast = useToast()

const linkFormOpen = ref(false)
const activeLink = ref<ResumeLink>({
    type: null,
    url: null
})
const editMode = ref(false)


const props = defineProps({
    resumeId: {
        type: String,
        required: true
    },
    links: {
        type: Array as PropType<ResumeLink[]>,
        required: true
    }
})

const openLinkForm = (link?: ResumeLink) => {
    console.log(link)
    linkFormOpen.value = true
    if (link?.type) {
        editMode.value = true
        activeLink.value = Object.assign({}, link)
    } else {
        editMode.value = false
        activeLink.value = {
            type: null,
            url: null
        }
    }
}

const cancelLinkForm = () => {
    editMode.value = false
    linkFormOpen.value = false
    activeLink.value = {
        type: null,
        url: null
    }
}

const addLink = async () => {
    const links = [
        ...props.links,
        {
            type: activeLink.value.type,
            url: activeLink.value.url
        }
    ]

    const result = await api.put(`/resumes/${props.resumeId}/`, {
        profileLinks: links
    })

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding link',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
    }

    toast.add({
        summary: 'Link added',
        detail: 'Link added successfully',
        severity: 'success',
        life: 3000
    })

    linkFormOpen.value = false
    activeLink.value = {
        type: null,
        url: null
    }

    emit('linksUpdated')
}

const deleteLink = async (link: ResumeLink) => {
    const links = props.links.filter(l => l.type !== link.type)

    const result = await api.put(`/resumes/${props.resumeId}/`, {
        profileLinks: links
    })

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting link',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
    }

    toast.add({
        summary: 'Link deleted',
        detail: 'Link deleted successfully',
        severity: 'success',
        life: 3000
    })

    emit('linksUpdated')
}

const editLink = async (link: ResumeLink) => {
    const foundLink = props.links.find(l => l.type === link.type)   

    if (!foundLink) {
        return
    }

    const links = props.links.map(l => {
        if (l.type === link.type) {
            return link
        }
        return l
    })

    const result = await api.put(`/resumes/${props.resumeId}/`, {
        profileLinks: links
    })

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error editing link',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
    }

    toast.add({
        summary: 'Link updated',
        detail: 'Link updated successfully',
        severity: 'success',
        life: 3000
    })

    linkFormOpen.value = false
    editMode.value = false
    activeLink.value = {
        type: null,
        url: null
    }

    emit('linksUpdated')
}
</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Links</h2>
                <Button @click="openLinkForm(null)" link size="small">
                    <i class="pi pi-plus"></i>
                    Add Link
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!linkFormOpen && Object.keys(props.links).length === 0" class="empty-state">
                <p class="body-md">No links added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="link in props.links" :key="link.id" class="link-card">
                    <div class="flex flex-column gap-1">
                        <p class="body-md heavy">{{ link.type }}</p>
                        <p class="body-lg italic">{{ link.url }}</p>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openLinkForm(link)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteLink(link)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="linkFormOpen"
                class="link-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeLink.type"
                        label="Type"
                        placeholder="e.g. LinkedIn, GitHub, etc."
                    />
                    <TextInput
                        v-model="activeLink.url"
                        label="URL"
                        placeholder="e.g. https://www.linkedin.com/in/johndoe"
                    />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        @click="cancelLinkForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? editLink(activeLink) : addLink()"
                        :label="editMode ? 'Update Link' : 'Add Link'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.link-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.link-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


