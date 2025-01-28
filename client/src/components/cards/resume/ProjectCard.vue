<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { ResumeProject } from '@/types/Resume'
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

const defaultProject: ResumeProject = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    projectUrl: null,
    highlights: [],
    details: null,
    relatedSkills: []
}

const projectFormOpen = ref(false)
const projectItems = ref<ResumeProject[]>([])
const activeProject = ref<ResumeProject | null>(null)
const editMode = ref(false)

const fetchProjects = async () => {
    const result = await api.get(`/projects/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error fetching projects',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    projectItems.value = result.data['results']
}

onMounted(async () => {
    await fetchProjects()
})

const openProjectForm = (project?: ResumeProject) => {
    if (project?.id) {
        projectFormOpen.value = true
        activeProject.value = Object.assign({}, project)
        editMode.value = true
    } else {
        projectFormOpen.value = true
        activeProject.value = Object.assign({}, defaultProject)
        editMode.value = false
    }
}

const cancelProjectForm = () => {
    projectFormOpen.value = false
    activeProject.value = Object.assign({}, defaultProject)
    editMode.value = false
}

const addProject = async () => {
    const projectData = {
        title: activeProject.value.title,
        startDate: activeProject.value.startDate ? new Date(activeProject.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeProject.value.endDate ? new Date(activeProject.value.endDate).toISOString().split('T')[0] : null,
        projectUrl: activeProject.value.projectUrl,
        highlights: activeProject.value.highlights,
        details: activeProject.value.details,
        relatedSkills: activeProject.value.relatedSkills
    }

    const result = await api.post('/projects/', projectData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error adding project',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeProject.value = Object.assign({}, defaultProject)
        editMode.value = false
        projectFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Project added',
        detail: 'Project added successfully',
        severity: 'success',
        life: 3000
    })

    projectFormOpen.value = false
    activeProject.value = Object.assign({}, defaultProject)
    editMode.value = false
    await fetchProjects()
}

const updateProject = async () => {
    const projectData = {
        title: activeProject.value.title,
        startDate: activeProject.value.startDate ? new Date(activeProject.value.startDate).toISOString().split('T')[0] : null,
        endDate: activeProject.value.endDate ? new Date(activeProject.value.endDate).toISOString().split('T')[0] : null,
        projectUrl: activeProject.value.projectUrl,
        highlights: activeProject.value.highlights,
        details: activeProject.value.details,
        relatedSkills: activeProject.value.relatedSkills
    }

    const result = await api.put(`/projects/${activeProject.value.id}/`, projectData)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error updating project',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        activeProject.value = Object.assign({}, defaultProject)
        editMode.value = false
        projectFormOpen.value = false
        return
    }

    toast.add({
        summary: 'Project updated',
        detail: 'Project updated successfully',
        severity: 'success',
        life: 3000
    })

    projectFormOpen.value = false
    activeProject.value = Object.assign({}, defaultProject)
    editMode.value = false
    await fetchProjects()
}

const deleteProject = async (id: number) => {
    const result = await api.delete(`/projects/${id}/`)

    if (result.status < 200 || result.status > 299) {
        toast.add({
            summary: 'Error deleting project',
            detail: result.data.detail,
            severity: 'error',
            life: 3000
        })
        return
    }

    toast.add({
        summary: 'Project deleted',
        detail: 'Project deleted successfully',
        severity: 'success',
        life: 3000
    })

    await fetchProjects()
}

</script>

<template>
    <Card>
        <template #header>
            <div class="px-3 pt-3 flex justify-content-between align-items-center">
                <h2 class="heading-md font-bold">Projects</h2>
                <Button
                    @click="openProjectForm(null)"
                    link
                    size="small"
                >
                    <i class="pi pi-plus"></i>
                    Add Project
                </Button>
            </div>
        </template>

        <template #content>
            <div v-if="!projectFormOpen && projectItems.length === 0" class="empty-state">
                <p class="body-md">No projects added yet</p>
            </div>

            <div class="flex flex-column gap-3">
                <div v-for="project in projectItems" :key="project.id" class="project-card">
                    <div class="flex flex-column w-full pr-3">
                        <div class="flex flex-row justify-content-between align-items-center">
                            <div class="heading-md heavy">{{ project.title }}</div>
                            <div class="body-md italic">{{ project.startDate }} - {{ project.endDate ? project.endDate : 'Present' }}</div>
                        </div>

                        <div class="flex flex-row justify-content-between">
                            <a class="body-md heavy" :href="project.projectUrl" target="_blank">{{ project.projectUrl }}</a>
                        </div>
                        
                        <div class="flex flex-row gap-1 pt-3 flex-wrap">
                            <Tag
                                v-for="skill in project.relatedSkills"
                                :key="skill"
                                :value="skill"
                            />
                        </div>

                        <div v-if="project.details" class="flex flex-column py-3 gap-1">
                            <p class="body-sm light italic" v-html="project.details ? project.details : 'No description listed'"></p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-auto">
                        <Button
                            @click="openProjectForm(project)"
                            icon="pi pi-pencil"
                            size="small"
                            link
                            severity="info"
                        />
                        <Button
                            @click="deleteProject(project.id)"
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="projectFormOpen"
                class="project-form"
            >   
                <div class="flex flex-column md:flex-row gap-1">
                    <TextInput
                        v-model="activeProject.title"
                        label="Title"
                        placeholder="e.g. React Portfolio"
                    />
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeProject.startDate"
                        label="Start Date"
                        type="date"
                        placeholder="e.g. 2022-01-01"
                    />
                    
                    <TextInput
                        v-model="activeProject.endDate"
                        label="End Date"
                        type="date"
                        optional
                        placeholder="e.g. 2022-06-01"
                    />      
                </div>

                <div class="flex flex-column md:flex-row gap-1 md:gap-4">
                    <TextInput
                        v-model="activeProject.projectUrl"
                        label="Project URL"
                        type="url"
                        optional
                        placeholder="e.g. https://github.com/johndoe/react-portfolio"
                    />
                </div>


                <div class="flex flex-column gap-1">
                    <div class="flex flex-column gap-1">
                        <label class="flex flex-row justify-content-between">
                            <span class="body-md">Details</span>
                            <span class="body-sm italic">Optional</span>
                        </label>
                        <Editor
                            v-model="activeProject.details"
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
                    v-model="activeProject.relatedSkills"
                    label="Skills"
                    placeholder="e.g. JavaScript, Python, etc."
                />

                <div class="flex justify-content-end gap-2">
                    <Button
                        @click="cancelProjectForm"
                        label="Cancel"
                        outlined
                        severity="danger"
                    />
                    <Button
                        @click="editMode ? updateProject() : addProject()"
                        :label="editMode ? 'Update Project' : 'Add Project'"
                    />
                </div>
            </div>

        </template>
    </Card>
</template>

<style lang="scss" scoped>
.project-card {
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.project-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
}
</style>


