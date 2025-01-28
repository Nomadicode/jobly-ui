<script lang="ts" setup>
</script>

<template>
<div class="modal">
    <div class="flex flex-column gap-2">
        <TextInput
            label="Skills"
            v-model="title"
            placeholder="e.g. Portfolio, GitHub, LinkedIn"
        />
        
        <div class="flex flex-column gap-2">
            <Chip v-for="skill in skills" :key="skill" :label="skill" />
        </div>

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