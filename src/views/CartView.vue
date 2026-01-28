<script setup>
import NavBar from '@/components/NavBar.vue'
import { useCartStore } from '@/stores/cart'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-vue-next'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 tracking-wider">CART</h1>
        <div class="hidden md:block"><NavBar /></div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <div v-if="cartStore.items.length > 0" class="flex flex-col lg:flex-row gap-8">
        <!-- Cart Items -->
        <div class="flex-1 space-y-4">
          <div v-for="(item, index) in cartStore.items" :key="item.id" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 animate-slide-up" :style="{ animationDelay: `${index * 100}ms` }">
            <div class="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative group">
               <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-slate-900">{{ item.name }}</h3>
                <p class="text-brand-600 text-sm font-extrabold">{{ formatPrice(item.price) }}</p>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-inner">
                  <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95">
                    <Minus class="w-4 h-4 text-slate-600" />
                  </button>
                  <span class="mx-3 text-sm font-bold w-4 text-center text-slate-800">{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95">
                    <Plus class="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <button @click="cartStore.removeFromCart(item.id)" class="text-red-400 hover:text-red-600 p-2 transition-colors hover:bg-red-50 rounded-full">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="w-full lg:w-96 bg-white p-6 rounded-3xl shadow-xl border border-white/20 h-fit animate-fade-in sticky top-24">
          <h2 class="text-lg font-bold mb-6 text-slate-800">Order Summary</h2>
          <div class="space-y-3 mb-6 border-b border-slate-100 pb-6">
            <div class="flex justify-between text-sm text-slate-500">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-medium text-slate-700">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-sm text-slate-500">
              <span>Tax (10%)</span>
              <span class="font-medium text-slate-700">{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
            </div>
          </div>
          <div class="flex justify-between font-bold text-xl text-slate-900 mb-8">
            <span>Total</span>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{{ formatPrice(cartStore.totalPrice * 1.1) }}</span>
          </div>
          <router-link 
            to="/checkout"
            class="block w-full text-center py-4 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1 transition-all active:scale-95"
          >
            Checkout
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-20 animate-fade-in leading-relaxed">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
           <ShoppingBag class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p class="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <router-link to="/shop" class="inline-block px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Start Shopping</router-link>
      </div>
    </main>

    <div class="md:hidden"><NavBar /></div>
  </div>
</template>
