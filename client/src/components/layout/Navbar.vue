<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseMenu from './BaseMenu.vue'
import { useAuthStore } from '@/stores/auth'

import Button from 'primevue/button'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn) 

const links = computed(() => {
  if (isLoggedIn.value) {
    return [
        {
            icon: '',
            label: 'Swipe Jobs',
            href: '/jobs/swipe'
        }, {
            icon: '',
            label: 'My Jobs',
            href: '/account/jobs'
        }, {
            icon: '',
            label: 'Resume',
            href: '/account/resume'
        }, {
            icon: '',
            label: 'Job Preferences',
            href: '/account/settings'
        }, {
            icon: '',
            label: 'My Subscription',
            href: '/account/subscriptions'
        }
    ]
  }

  return [
    {
      icon: '',
      label: 'Home',
      href: '/'
    }, {
      icon: '',
      label: 'Create Account',
      href: '/signup'
    }, {
      icon: '',
      label: 'Login',
      href: '/login'
    }
  ]
})
</script>

<template>
  <div class="navbar">
    <a href="/">
        <span class="body-lg font-bold">Jobly</span>
        <span class="body-sm">by Nomadicode</span>
    </a>

    <BaseMenu :links="links">
      <template #bottom-menu>
        <div v-if="isLoggedIn" class="flex flex-col gap-2">
          <Button class="btn btn-primary" @click="authStore.logout">
            <span class="body-sm">Sign Out</span>
          </Button>
        </div>
      </template>
    </BaseMenu>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@import '@/assets/scss/scheme/colors';

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: $white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);

  a {
    display: flex;
    gap: 5px;
    text-decoration: none;
    align-items: center;
    color: $primary-text;

    span {
      color: $grey;
    }
  }
}
</style>

