<script setup>
import { computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { Search } from 'lucide-vue-next'

const productStore = useProductStore()
const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  alert('Added to cart!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <h1 class="text-2xl font-black text-brand-600 tracking-wider">SHOP</h1>
        
        <!-- Search Bar -->
        <div class="relative w-full md:w-96">
          <input 
            v-model="productStore.searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-sans"
          >
          <Search class="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        <div class="hidden md:block">
          <NavBar />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Categories -->
      <div class="mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex space-x-2">
          <button 
            v-for="category in productStore.categories" 
            :key="category"
            @click="productStore.selectedCategory = category"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            :class="productStore.selectedCategory === category ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-if="productStore.filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="product in productStore.filteredProducts" :key="product.id" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group">
          <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
             <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
             <!-- Quick Add overlay -->
             <button @click="addToCart(product)" class="absolute bottom-2 right-2 bg-white text-brand-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity md:block hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
             </button>
          </div>
          <div class="mb-2">
             <span class="text-xs text-brand-500 font-semibold bg-brand-50 px-2 py-0.5 rounded-md">{{ product.category }}</span>
          </div>
          <h3 class="font-bold text-gray-900 line-clamp-2 mb-1">{{ product.name }}</h3>
          <p class="text-xs text-gray-500 mb-3 line-clamp-2">{{ product.description }}</p>
          
          <div class="mt-auto flex items-center justify-between">
            <p class="text-brand-700 font-bold text-lg">{{ formatPrice(product.price) }}</p>
            <button 
              @click="addToCart(product)"
              class="md:hidden bg-brand-600 text-white p-2 rounded-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20 text-gray-500">
        <p>No products found.</p>
      </div>
    </main>
    
    <div class="md:hidden">
      <NavBar />
    </div>
  </div>
</template>
