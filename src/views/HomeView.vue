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
    <header class="bg-white shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-black text-brand-600 tracking-wider">KOPKIT</h1>
        <div class="hidden md:block">
          <NavBar />
        </div>
        <div class="md:hidden">
          <!-- Mobile Header content if needed -->
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <!-- Welcome Section -->
      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <PromoCarousel />
      </section>

      <!-- Featured Products -->
      <section>
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-xl font-bold text-gray-800">Featured Products</h2>
          <router-link to="/shop" class="text-brand-600 text-sm font-medium hover:underline">View All</router-link>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="product in featuredProducts" :key="product.id" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
               <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            </div>
            <h3 class="font-semibold text-gray-900 line-clamp-1">{{ product.name }}</h3>
            <p class="text-brand-600 font-bold mt-1">{{ formatPrice(product.price) }}</p>
            <button 
              @click="addToCart(product)"
              class="mt-auto w-full py-2 bg-brand-50 text-brand-600 font-medium rounded-lg text-sm hover:bg-brand-100 transition-colors"
            >
              + Add
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
