<script setup lang="ts">
import Button from 'primevue/button'
import PriceCard from '@/components/cards/PriceCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pricingCards = [
  {
    title: 'Jobly Free',
    price: '$0',
    features: [
      'Ad supported',
      'Basic job matching',
      'Up to 10 auto-applied jobs',
      'Swipe to apply',
      'Basic application tracking'
    ],
    buttonLabel: 'Get Started',
    buttonClick: () => router.push('/signup'),
    featured: false
  },
  {
    title: 'Jobly Premium',
    price: '$29.99',
    features: [
      'Ad free',
      'Advanced AI job matching',
      'Unlimited auto-applied jobs',
      'Unlimited AI cover letters',
      'Offline auto-applications',
      'Advanced application tracking',
      'Priority support'
    ],
    buttonLabel: 'Upgrade to Pro',
    featured: true,
    buttonClick: () => router.push('/signup?plan=pro')
  }
]

</script>

<template>
  <main class="container mx-auto">
    <section class="hero mx-auto">
      <h1 class="hero-title text-4xl font-bold text-center">
        Match with your dream job
      </h1>

      <p class="hero-subtitle text-lg text-center">
        Set your job search on autopilot. Add your job preferences and let Jobly do the rest.
      </p>

      <div class="hero-actions flex gap-2">
        <Button
          label="Create Account"
          @click="router.push('/signup')"
        />
        <Button
          label="Login"
          severity="secondary"
          @click="router.push('/login')"
        />
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-bold">Subscribe to Jobly Pro</h2>

      <div class="pricing-container">
        <PriceCard
          v-for="card in pricingCards"
          :key="card.title"
          :title="card.title"
          :price="card.price"
          :features="card.features"
          :buttonLabel="card.buttonLabel"
          :buttonClick="card.buttonClick"
          :featured="card.featured"
        />
      </div>
    </section>
    
    <section class="light">
      <h2 class="text-2xl font-bold">How it works</h2>
      
      <div class="features-container">
        <div class="feature-card">
          <i class="pi pi-send text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Automatic AI Applications</h3>
          <p class="text-center">Let our AI automatically customize and send job applications tailored to each position.</p>
        </div>

        <div class="feature-card">
          <i class="pi pi-check-circle text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Advanced Job Matching</h3>
          <p class="text-center">Our AI analyzes your profile and preferences to find the perfect job matches.</p>
        </div>

        <div class="feature-card">
          <i class="pi pi-chart-line text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Application Tracking</h3>
          <p class="text-center">Keep track of all your job applications in one place with detailed status updates.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "sass:color";
@import '@/assets/scss/scheme/colors';

.container {
  height: calc(100vh - 100px);
  width: 100vw;
  overflow-x: hidden;
}

section {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  background-color: color.adjust($background-dark, $lightness: -10%);
  color: $white;

  &.light {
    background-color: $background-dark;
    color: $primary-text;
  }
}

.hero {
  position: relative;
  height: 600px;
  box-shadow: 0 0 0 1000px rgba(0,0,0,0.5) inset;
  background-image: url('@/assets/images/hero-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .hero-title {
    color: $white;
    line-height: 3rem;
  }

  .hero-subtitle {
    color: color.adjust($white, $lightness: -20%);
    line-height: 2rem;
  }
}

.pricing-container {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.features-container {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-card {
  background: color.adjust($background-dark, $lightness: -5%);
  padding: 30px;
  border-radius: 12px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;
  border: 1px solid color.adjust($background-dark, $lightness: -15%);

  i {
    color: $primary-color;
  }

  p {
    color: color.adjust($primary-text, $lightness: 20%);
  }
}
</style>