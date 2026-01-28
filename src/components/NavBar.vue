<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { Home, Search, ShoppingBag, ShoppingCart, User } from 'lucide-vue-next'

const route = useRoute()
const cartStore = useCartStore()

const isActive = (path) => route.path === path

const navItems = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Search', path: '/shop', icon: Search }, // Search leads to shop usually or search view
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Cart', path: '/cart', icon: ShoppingCart },
  { name: 'Profile', path: '/profile', icon: User },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:relative md:border-t-0 md:bg-transparent md:shadow-none z-40">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between md:justify-start md:space-x-8 py-3">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center justify-center w-full md:w-auto text-xs font-medium transition-colors duration-200 relative group"
          :class="isActive(item.path) ? 'text-brand-600' : 'text-gray-500 hover:text-brand-400'"
        >
          <component :is="item.icon" class="w-6 h-6 mb-1" />
          <span>{{ item.name }}</span>
          
          <!-- Cart Badge -->
          <span 
            v-if="item.name === 'Cart' && cartStore.totalItems > 0"
            class="absolute top-0 right-1/4 md:-right-[-10px] md:top-[-5px] bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
