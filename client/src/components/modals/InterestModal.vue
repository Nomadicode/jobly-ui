<script lang="ts" setup>
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

<style lang="scss" scoped>
</style>