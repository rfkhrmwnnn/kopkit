<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const address = ref('')
const paymentMethod = ref('cash')
const isProcessing = ref(false)

onMounted(() => {
  if (authStore.user) {
    address.value = authStore.user.address || ''
  }
  if (cartStore.items.length === 0) {
    router.push('/shop')
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const confirmOrder = () => {
  isProcessing.value = true
  
  // Simulate API
  setTimeout(() => {
    // Save order
    const orderIndex = Math.floor(Math.random() * 10000)
    const newOrder = {
      id: `ORD-${orderIndex}`,
      date: new Date().toISOString(),
      items: [...cartStore.items],
      total: cartStore.totalPrice * 1.1,
      status: 'Dikemas', // Packed
      address: address.value,
      paymentMethod: paymentMethod.value
    }

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(existingOrders))
    
    // Update user address if changed
    authStore.updateAddress(address.value)
    
    // Clear cart
    cartStore.clearCart()
    
    isProcessing.value = false
    router.push('/profile')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-brand-600 px-6 py-4 flex items-center">
        <button @click="$router.back()" class="text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 class="text-xl font-bold text-white">Confirm Order</h1>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Shipping Address -->
        <section>
          <h2 class="text-lg font-bold text-gray-900 mb-3">Shipping Address</h2>
          <textarea 
            v-model="address"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="Enter your full shipping address..."
          ></textarea>
        </section>

        <!-- Payment Method -->
        <section>
          <h2 class="text-lg font-bold text-gray-900 mb-3">Payment Method</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
             <label class="border rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-50" :class="{'ring-2 ring-brand-500 bg-brand-50': paymentMethod === 'cash'}">
               <input type="radio" value="cash" v-model="paymentMethod" class="sr-only">
               <span class="font-medium">Cash on Delivery</span>
             </label>
             <label class="border rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-50" :class="{'ring-2 ring-brand-500 bg-brand-50': paymentMethod === 'transfer'}">
               <input type="radio" value="transfer" v-model="paymentMethod" class="sr-only">
               <span class="font-medium">Bank Transfer</span>
             </label>
             <label class="border rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-50" :class="{'ring-2 ring-brand-500 bg-brand-50': paymentMethod === 'qris'}">
               <input type="radio" value="qris" v-model="paymentMethod" class="sr-only">
               <span class="font-medium">QRIS</span>
             </label>
          </div>
        </section>

        <!-- Summary -->
        <section class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between mb-2">
             <span>Items Total</span>
             <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <div class="flex justify-between mb-2">
             <span>Tax (10%)</span>
             <span>{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
          </div>
          <div class="flex justify-between font-bold text-xl border-t pt-2 mt-2">
             <span>Grand Total</span>
             <span class="text-brand-600">{{ formatPrice(cartStore.totalPrice * 1.1) }}</span>
          </div>
        </section>

        <button 
          @click="confirmOrder"
          :disabled="isProcessing || !address"
          class="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all"
          :class="isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:shadow-xl'"
        >
          {{ isProcessing ? 'Processing...' : 'Confirm Payment' }}
        </button>
      </div>
    </div>
  </div>
</template>
