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
  <div class="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4 flex justify-center items-start pt-10">
    <div class="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up">
      <!-- Header -->
      <div class="bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-6 flex items-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <button @click="$router.back()" class="text-white mr-4 hover:scale-110 transition-transform relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 class="text-xl font-bold text-white relative z-10">Confirm Order</h1>
      </div>
      
      <div class="p-8 space-y-8">
        <!-- Shipping Address -->
        <section class="animate-slide-up" style="animation-delay: 100ms;">
          <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center"><span class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-2 text-sm">1</span> Shipping Address</h2>
          <textarea 
            v-model="address"
            rows="3"
            class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all outline-none"
            placeholder="Enter your full shipping address..."
          ></textarea>
        </section>

        <!-- Payment Method -->
        <section class="animate-slide-up" style="animation-delay: 200ms;">
          <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center"><span class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-2 text-sm">2</span> Payment Method</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
             <label class="border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-center h-24 relative overflow-hidden group" :class="{'border-brand-500 bg-brand-50 text-brand-700': paymentMethod === 'cash', 'border-gray-100': paymentMethod !== 'cash'}">
               <input type="radio" value="cash" v-model="paymentMethod" class="sr-only">
               <div class="font-bold z-10">Cash on Delivery</div>
               <div class="text-xs text-slate-500 z-10 mt-1">Pay when arrives</div>
               <div class="absolute inset-0 bg-brand-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </label>
             <label class="border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-center h-24 relative overflow-hidden group" :class="{'border-brand-500 bg-brand-50 text-brand-700': paymentMethod === 'transfer', 'border-gray-100': paymentMethod !== 'transfer'}">
               <input type="radio" value="transfer" v-model="paymentMethod" class="sr-only">
               <div class="font-bold z-10">Bank Transfer</div>
               <div class="text-xs text-slate-500 z-10 mt-1">Manual confirmation</div>
               <div class="absolute inset-0 bg-brand-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </label>
             <label class="border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-center h-24 relative overflow-hidden group" :class="{'border-brand-500 bg-brand-50 text-brand-700': paymentMethod === 'qris', 'border-gray-100': paymentMethod !== 'qris'}">
               <input type="radio" value="qris" v-model="paymentMethod" class="sr-only">
               <div class="font-bold z-10">QRIS</div>
               <div class="text-xs text-slate-500 z-10 mt-1">Instant payment</div>
               <div class="absolute inset-0 bg-brand-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </label>
          </div>
        </section>

        <!-- Summary -->
        <section class="bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-slide-up" style="animation-delay: 300ms;">
          <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center"><span class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-2 text-sm">3</span> Order Summary</h2>
          <div class="space-y-3 text-sm text-slate-600">
             <div class="flex justify-between">
                <span>Items Total</span>
                <span class="font-medium">{{ formatPrice(cartStore.totalPrice) }}</span>
             </div>
             <div class="flex justify-between">
                <span>Tax (10%)</span>
                <span class="font-medium">{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
             </div>
             <div class="flex justify-between font-bold text-xl border-t border-slate-200 pt-4 mt-2 text-slate-800">
                <span>Grand Total</span>
                <span class="text-brand-600">{{ formatPrice(cartStore.totalPrice * 1.1) }}</span>
             </div>
          </div>
        </section>

        <button 
          @click="confirmOrder"
          :disabled="isProcessing || !address"
          class="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transition-all animate-scale-in"
          style="animation-delay: 400ms;"
          :class="isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 hover:shadow-brand-500/30 hover:-translate-y-1 transform'"
        >
          <span v-if="isProcessing" class="flex items-center justify-center">
             <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             Processing...
          </span>
          <span v-else>Confirm & Pay</span>
        </button>
      </div>
    </div>
  </div>
</template>
