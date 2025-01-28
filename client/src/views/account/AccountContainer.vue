<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ButtonGroup from 'primevue/buttongroup'
import Button from 'primevue/button'

const router = useRouter()
const activeTab = computed(() => {
    return router.currentRoute.value.path.split('/').pop()
})

const navigateTo = (path: string) => {
    router.push(path)
}

</script>

<template>
    <div class="container">
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/scheme/colors';

.container {
    padding: 10px;
    min-height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $background-dark;
    color: $text-light;

    .content {
        width: 100%;
        max-width: 900px;
    }
}
</style>

