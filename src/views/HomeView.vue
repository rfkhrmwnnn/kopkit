<script setup>
import { computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import PromoCarousel from '@/components/PromoCarousel.vue'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const productStore = useProductStore()
const cartStore = useCartStore()

// Show top 4 products as "Featured"
const featuredProducts = computed(() => productStore.products.slice(0, 4))

const addToCart = (product) => {
  cartStore.addToCart(product)
  // Typically show toast
  alert('Added to cart!')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <!-- Desktop Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 tracking-wider hover:scale-105 transition-transform cursor-pointer">KOPKIT</h1>
        <div class="hidden md:block">
          <NavBar />
        </div>
        <div class="md:hidden">
          <!-- Mobile Header content if needed -->
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <!-- Welcome Section -->
      <section class="animate-fade-in">
        <h2 class="text-2xl font-bold text-slate-800 mb-6 animate-slide-up">Dashboard Dashboard</h2> <!-- Kept 'Dashboard' from original but might want 'Welcome' conceptually -->
        <PromoCarousel class="animate-scale-in" />
      </section>

      <!-- Featured Products -->
      <section>
        <div class="flex justify-between items-end mb-6 animate-slide-up" style="animation-delay: 100ms;">
          <h2 class="text-xl font-bold text-slate-800">Featured Products</h2>
          <router-link to="/shop" class="text-brand-600 text-sm font-bold hover:text-brand-800 transition-colors flex items-center group">
             View All <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </router-link>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="(product, index) in featuredProducts" 
            :key="product.id" 
            class="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col animate-slide-up"
            :style="{ animationDelay: `${150 + index * 100}ms` }"
          >
            <div class="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
               <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
               <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 class="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{{ product.name }}</h3>
            <p class="text-brand-600 font-extrabold mt-1 text-lg">{{ formatPrice(product.price) }}</p>
            <button 
              @click="addToCart(product)"
              class="mt-auto w-full py-2.5 bg-brand-50 text-brand-700 font-bold rounded-xl text-sm hover:bg-brand-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Mobile Nav Wrapper -->
    <div class="md:hidden">
      <NavBar />
    </div>
  </div>
</template>
