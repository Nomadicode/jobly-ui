<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import TextInput from '@/components/forms/TextInput.vue'
import Button from 'primevue/button'

const api = inject('api')
const router = useRouter()
const toast = useToast()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
    const result = await api.post('/auth/register/', {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
    })

    // An error occurred signing into the account
    if (result.status < 200 || result.status > 299) {
        toast.add({
            severity: 'error',
            summary: "Unable to create account",
            detail: result.data['errors'],
            life: 3000
        })
        return
    }

    router.push({ name: 'login' })
}
</script>

<template>
  <div class="container">
    <h1 class="text-2xl font-bold">Create an Account</h1>
    <div>
        <span>Already have an account?</span>
        <Button label="Login" link @click="router.push('/login')"/>
    </div>

    <form @submit.prevent="register" class="flex flex-column gap-3">
        <TextInput label="First Name" v-model="firstName" />
        <TextInput label="Last Name" v-model="lastName" />
        <TextInput label="Email" v-model="email" type="email" />
        <TextInput label="Password" v-model="password" type="password" />

        <div class="button-container">
            <div class="spacer"></div>
            <Button label="Register" type="submit"/>
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

