<script setup>
import NavBar from '@/components/NavBar.vue'
import { useCartStore } from '@/stores/cart'
import { Trash2, Plus, Minus } from 'lucide-vue-next'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <header class="bg-white shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-black text-brand-600 tracking-wider">CART</h1>
        <div class="hidden md:block"><NavBar /></div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <div v-if="cartStore.items.length > 0" class="flex flex-col lg:flex-row gap-8">
        <!-- Cart Items -->
        <div class="flex-1 space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div class="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
               <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-gray-900">{{ item.name }}</h3>
                <p class="text-brand-600 text-sm font-semibold">{{ formatPrice(item.price) }}</p>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="p-1 hover:bg-white rounded-md transition-colors">
                    <Minus class="w-4 h-4 text-gray-600" />
                  </button>
                  <span class="mx-3 text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="p-1 hover:bg-white rounded-md transition-colors">
                    <Plus class="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button @click="cartStore.removeFromCart(item.id)" class="text-red-500 hover:text-red-700 p-2">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h2 class="text-lg font-bold mb-4">Order Summary</h2>
          <div class="space-y-2 mb-4 border-b pb-4">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
            </div>
          </div>
          <div class="flex justify-between font-bold text-lg text-brand-900 mb-6">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.totalPrice * 1.1) }}</span>
          </div>
          <router-link 
            to="/checkout"
            class="block w-full text-center py-3 px-4 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Checkout
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <h2 class="text-xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
        <router-link to="/shop" class="text-brand-600 hover:underline">Start Shopping</router-link>
      </div>
    </main>

    <div class="md:hidden"><NavBar /></div>
  </div>
</template>
