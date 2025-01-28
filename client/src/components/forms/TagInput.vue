<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

const emit = defineEmits(['update:modelValue']);
const modelValue = defineModel<string[]>({ required: true });

const props = defineProps({
    label: { type: String, required: true },
    placeholder: { type: String, required: false }
})

const tags = ref<string[]>([])
const inputValue = ref('')

onMounted(() => {
    tags.value = modelValue.value || []
})

const addTag = () => {
    if (inputValue.value) {
        tags.value.push(inputValue.value)
        emit('update:modelValue', tags.value)
        inputValue.value = ''
    }
}

const removeTag = (tag: string) => {
    tags.value = tags.value.filter(t => t !== tag)
    emit('update:modelValue', tags.value)
}
</script>

<template>
    <div class="flex flex-column gap-1">
        <label :for="id">
            <span class="body-md">{{ props.label }}</span>
        </label>

        <InputText
            v-model="inputValue"
            :placeholder="props.placeholder"
            @keydown.enter="addTag"
        />

        <div class="flex flex-row gap-1">
            <Tag
                v-for="tag in tags"
                :key="tag"
                :value="tag"
                @click="removeTag(tag)"
            />
        </div>      
    </div>
</template>

<style lang="scss" scoped>
</style>