<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import ConfirmDialog from 'primevue/confirmdialog'
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'
</script>

<template>
  <div class="bg-background">
    <Navbar />
    <slot />
    
    <ConfirmDialog />
    <DynamicDialog />
    <Toast />
  </div>
</template>

