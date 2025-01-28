<script setup lang="ts">
import { ref, inject } from 'vue'
import TextInput from '@/components/forms/TextInput.vue'
import Button from 'primevue/button'

const props = defineProps<{
    link?: {
        url: string,
        title: string
    },
    resumeId: string
}>()

const api = inject('api')

const url = ref(props.link?.url || '')
const title = ref(props.link?.title || '')
const resumeId = ref(props.resumeId || '')

const emit = defineEmits(['cancel', 'save'])

const save = async () => {
    const response = await api.post(`/resumes/${resumeId}/links/`, {
        url: url.value,
        title: title.value
    })

    emit('save', response)
}

const cancel = () => {
    emit('cancel')
}
</script>

<template>
    <div class="modal">
        <div class="flex flex-column gap-2">
            <TextInput
                label="Title"
                v-model="title"
                placeholder="e.g. Portfolio, GitHub, LinkedIn"
            />
            
            <TextInput
                label="URL"
                v-model="url"
                placeholder="https://"
            />

            <div class="flex justify-content-end align-items-end gap-2 mt-4">
                <Button
                    label="Cancel"
                    severity="secondary"
                    @click="cancel"
                />
                <Button
                    label="Save"
                    @click="save"
                />
            </div>
        </div>
    </div>
</template>
