<script setup lang="ts">
import { ref, PropType } from 'vue'
import Drawer from "primevue/drawer"

const props = defineProps({
    header: { type: String, required: false },
    links: { type: Array as PropType<Array<{ icon: string; label: string; href: string }>>, required: false }
})

const menuOpen = ref(false)
</script>

<template>
    <Drawer v-model:visible="menuOpen" :header="props.header" position="right">
        <ul class="base-menu">
            <li class="base-menu__item" v-for="link in props.links" :key="link.label">
                <RouterLink @click="menuOpen = false" :to="link.href" class="base-menu__item-link">
                    <div class="menu-item__link">
                        <i v-if="link.icon" :class="link.icon" />
                        <span>{{ link.label }}</span>
                    </div>
                </RouterLink>
            </li>
        </ul>

        <div class="bottom-menu">
            <slot name="bottom-menu" />
        </div>
    </Drawer>

    <button class="menu-toggle" @click="menuOpen = true">
        <i class="icon icon-menu" />
    </button>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@import '@/assets/scss/scheme/colors';
@import '@/assets/scss/scheme/typography';

.base-menu {
    display: flex;
    flex-direction: column;

    &__item {
        a {
            display: block;
            padding: 20px 10px;
            text-decoration: none;
            color: $grey;

            &:hover {
                background-color: color.adjust($secondary-text, $lightness: 10%);
            }
        }

        .router-link-exact-active {
            background-color: color.adjust($secondary-text, $lightness: 12%);
        }
    }
}

.menu-item__link {
    display: flex;
    align-items: center;
    gap: 20px;

    i {
        font-size: $body-md;
    }

    span {
        font-size: $body-md;
    }
}

.menu-toggle {
    border: 0;
    background-color: inherit;
    padding: 8px;
    font-size: 18px;
    line-height: 0;
    cursor: pointer;
}

.bottom-menu {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
}
</style>
