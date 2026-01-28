<script setup>
import { computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { Search, Heart } from 'lucide-vue-next'

const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  alert('Added to cart!')
}

const toggleLike = (product) => {
  if (!authStore.user) {
    alert('Please login to like products')
    return
  }
  productStore.toggleLike(authStore.user.username, product.id)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 tracking-wider hover:scale-105 transition-transform cursor-pointer">SHOP</h1>
        
        <!-- Search Bar -->
        <div class="relative w-full md:w-96 group">
          <input 
            v-model="productStore.searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-sans shadow-sm group-hover:shadow-md"
          >
          <Search class="absolute left-3 top-3 text-gray-400 w-5 h-5 group-hover:text-brand-500 transition-colors" />
        </div>

        <div class="hidden md:block">
          <NavBar />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Categories -->
      <div class="mb-8 overflow-x-auto pb-2 custom-scrollbar animate-slide-up">
        <div class="flex space-x-3">
          <button 
            v-for="category in productStore.categories" 
            :key="category"
            @click="productStore.selectedCategory = category"
            class="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap active:scale-95"
            :class="productStore.selectedCategory === category ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-brand-200'"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-if="productStore.filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="(product, index) in productStore.filteredProducts" 
          :key="product.id" 
          class="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 flex flex-col group animate-slide-up"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
             <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
             <!-- Like Button -->
             <button 
               @click.stop="toggleLike(product)"
               class="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all z-20 group-hover:scale-110"
               :class="{ 'text-red-500': productStore.isLiked(authStore.user?.username, product.id), 'text-slate-400': !productStore.isLiked(authStore.user?.username, product.id) }"
             >
                <Heart class="w-5 h-5 transition-transform active:scale-95" :class="{ 'fill-current': productStore.isLiked(authStore.user?.username, product.id) }" />
             </button>

             <!-- Quick Add overlay -->
             <button @click.stop="addToCart(product)" class="absolute bottom-3 right-3 bg-white text-brand-600 p-2.5 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-50 hover:scale-110 z-10 md:flex hidden items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
             </button>
             <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          <div class="mb-2">
             <span class="text-[10px] font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{{ product.category }}</span>
          </div>
          <h3 class="font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">{{ product.name }}</h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{{ product.description }}</p>
          
          <div class="mt-auto flex items-center justify-between">
            <p class="text-brand-700 font-extrabold text-lg">{{ formatPrice(product.price) }}</p>
            <button 
              @click="addToCart(product)"
              class="md:hidden bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20 text-slate-400 animate-fade-in">
        <Search class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p class="text-lg">No products found matching your search.</p>
        <button @click="productStore.resetFilter()" class="mt-4 text-brand-600 font-bold hover:underline">Clear Filters</button>
      </div>
    </main>
    
    <div class="md:hidden">
      <NavBar />
    </div>
  </div>
</template>
