<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import DatePicker from 'primevue/datepicker'

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: { type: String, required: true },
    error: { type: String, required: false },
    placeholder: { type: String, required: false },
    helperText: { type: String, required: false },
    type: { type: String, required: false, default: 'text' },
    optional: { type: Boolean, required: false, default: false },
    mode: { type: String, required: false },
    currency: { type: String, required: false }
})

const id = ref(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
const modelValue = defineModel<string>({ required: true });
</script>

<template>
    <div class="flex flex-column gap-2 w-full mb-2">
        <label :for="id">
            <span class="body-md">{{ props.label }}</span>
            <span v-if="props.optional" class="body-sm italic">Optional</span>
        </label>
        <DatePicker
            v-if="props.type === 'date'"
            :id="id"
            v-model="modelValue"
            fluid
            showIcon
            :placeholder="props.placeholder"
        />
        <Password
            v-else-if="props.type === 'password'"
            :id="id"
            v-model="modelValue"
            :feedback="false"
            toggleMask
            :placeholder="props.placeholder"
        />
        <InputNumber
            v-else-if="props.type === 'number'"
            :id="id"
            v-model="modelValue"
            :placeholder="props.placeholder"
            :mode="props.mode"
            :currency="props.currency"
        />
        <InputText
            v-else
            :id="id"
            v-model="modelValue"
            :type="props.type"
            :placeholder="props.placeholder"
        />
        <span v-if="props.error" class="body-sm error">{{ props.error }}</span>
        <span v-if="props.helperText" class="body-sm italic">{{ props.helperText }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/scheme/colors';

label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
        line-height: 1rem;
    }
}

.error {
    color: $danger-color;
}
</style>
