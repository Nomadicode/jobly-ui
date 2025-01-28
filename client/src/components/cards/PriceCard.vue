<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    features: {
        type: Array,
        required: true
    },
    featured: {
        type: Boolean,
        required: false,
        default: false
    },
    buttonLabel: {
        type: String,
        required: true
    },
    buttonClick: {
        type: Function,
        required: true
    }
})

const { title, price, features, featured, buttonLabel, buttonClick } = toRefs(props);
</script>

<template>
    <div class="pricing-card" :class="{ 'featured': featured }">
        <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        <div class="price">{{ price }}</div>
        <ul class="features">
            <li v-for="feature in features" :key="feature">
                <i class="pi pi-check"></i>
                {{ feature }}
            </li>
        </ul>
        <Button
            label="Get Started"
            outlined
            @click="buttonClick"
        />
    </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@import '@/assets/scss/scheme/colors';

.pricing-card {
    background: color.adjust($background-dark, $lightness: -5%);
    padding: 30px;
    border-radius: 12px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    border: 1px solid color.adjust($background-dark, $lightness: -15%);

    &.featured {
        border: 2px solid $success-color;
        transform: scale(1.05);
    }

    .featured-badge {
        position: absolute;
        top: -12px;
        right: 20px;
        background: $success-color;
        color: $white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
    }

    .price {
        font-size: 36px;
        font-weight: bold;
        color: $primary-text;

        .period {
            font-size: 16px;
            color: color.adjust($primary-text, $lightness: 20%);
        }
    }

    .features {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;

        li {
            display: flex;
            align-items: center;
            gap: 8px;
            color: color.adjust($primary-text, $lightness: 20%);

            i {
                color: $success-color;
            }
        }
    }
}
</style>

