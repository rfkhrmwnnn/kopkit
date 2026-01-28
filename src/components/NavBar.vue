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
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Cart', path: '/cart', icon: ShoppingCart },
  { name: 'Profile', path: '/profile', icon: User },
]
</script>

<template>
  <nav class="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl md:relative md:bottom-auto md:left-auto md:right-auto md:bg-transparent md:border-0 md:shadow-none z-50 md:rounded-none animate-slide-up">
    <div class="px-2 md:px-0">
      <div class="flex justify-around md:justify-start md:space-x-8 py-3 items-center">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative group md:flex-row md:space-x-2 md:p-0"
          :class="isActive(item.path) ? 'text-brand-600 bg-brand-50 md:bg-transparent md:text-brand-600 scale-105 shadow-sm md:shadow-none font-bold' : 'text-slate-400 hover:text-brand-500 hover:bg-slate-50 md:hover:bg-transparent'"
        >
          <div class="relative">
             <component :is="item.icon" class="w-6 h-6 mb-1 md:mb-0 transition-transform group-hover:scale-110" :class="isActive(item.path) ? 'fill-current' : ''" />
              <!-- Cart Badge -->
              <span 
                v-if="item.name === 'Cart' && cartStore.totalItems > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce shadow-sm"
              >
                {{ cartStore.totalItems }}
              </span>
          </div>
          <span class="text-[10px] md:text-sm font-medium">{{ item.name }}</span>
          
          <!-- Desktop Active Indicator -->
          <span 
             v-if="isActive(item.path)" 
             class="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-600 rounded-full"
          ></span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
