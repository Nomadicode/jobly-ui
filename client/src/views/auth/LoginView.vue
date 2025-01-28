<script setup lang="ts">
import { ref, inject } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

import TextInput from '@/components/forms/TextInput.vue'
import Button from 'primevue/button'

const api = inject('api')
const router = useRouter()
const toast = useToast()

const { setAccessToken, setRefreshToken } = useAuthStore()
const { setUserData } = useUserStore()
const email = ref('')
const password = ref('')

const login = async () => {
    const result = await api.post('/auth/login/', {
        email: email.value,
        password: password.value,
    })
    
    // An error occurred signing into the account
    if (result.status < 200 || result.status > 299) {
        toast.add({
            severity: 'error',
            summary: "Unable to login, please try again.",
            detail: result.data['errors'],
            life: 3000
        })
        return
    }

    const data = result.data
    const accessToken = data['token']['access']
    const refreshToken = data['token']['refresh']
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    setUserData(data['user'])

    router.push({ name: 'account-settings' })
}
</script>

<template>
  <div class="container">
    <h1 class="text-2xl font-bold">Login</h1>
    <div>
        <span>Don't have an account?</span>
        <Button label="Sign Up" link @click="router.push('/signup')"/>
    </div>

    <form @submit.prevent="login" class="flex flex-column gap-3">
        <TextInput label="Email" v-model="email" type="email" />
        <TextInput label="Password" v-model="password" type="password" />

        <div class="button-container">
            <Button label="Forgot Password?" link />
            <Button label="Login" type="submit" />
        </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/scheme/colors';

.container {
    display: flex;
    padding: 40px;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    height: 100vh;
    background-color: $background-dark;
    color: $text-light;

    .button-container {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>

