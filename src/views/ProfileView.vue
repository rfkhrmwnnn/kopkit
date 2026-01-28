<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { 
  Package, Truck, CheckCircle, MapPin, LogOut, Home, 
  Settings, CreditCard, Heart, HelpCircle, ChevronRight, User 
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const orders = ref([])
const isEditingAddress = ref(false)
const newAddress = ref('')

onMounted(() => {
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.value = savedOrders.reverse() // Newest first
  
  if (authStore.user) {
    newAddress.value = authStore.user.address
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short'
  })
}

const updateAddress = () => {
  authStore.updateAddress(newAddress.value)
  isEditingAddress.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-20 md:pb-0">
    <!-- Header/Profile Info Section -->
    <div class="bg-gradient-to-r from-brand-600 to-brand-500 pb-16 pt-8 px-4 relative">
      <div class="max-w-3xl mx-auto">
         <div class="flex justify-between items-start mb-6">
            <h1 class="text-xl font-bold text-white">My Profile</h1>
            <div class="flex space-x-3">
              <router-link to="/home" class="p-2 text-white/90 hover:text-white">
                 <Home class="w-6 h-6" />
              </router-link>
              <button @click="handleLogout" class="p-2 text-white/90 hover:text-white">
                 <LogOut class="w-6 h-6" />
              </button>
            </div>
         </div>
         
         <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
               <User class="w-10 h-10 text-slate-400" />
            </div>
            <div>
               <h2 class="text-white text-lg font-bold">{{ authStore.user?.username }}</h2>
               <div class="flex items-center text-brand-100 text-xs mt-1 bg-white/20 px-2 py-0.5 rounded-full w-fit">
                  <span class="mr-1">★</span> Member Silver
               </div>
               <div class="text-brand-100 text-xs mt-1 truncate max-w-[200px]">{{ authStore.user?.address }}</div>
            </div>
         </div>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-4 -mt-10 space-y-4 relative z-10">
      
      <!-- Order Status Bar (Shopee Style) -->
      <div class="bg-white rounded-lg shadow-sm p-4">
         <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
            <h3 class="text-sm font-bold text-gray-800">My Orders</h3>
            <button class="text-xs text-gray-500 flex items-center">
               View Purchase History <ChevronRight class="w-3 h-3 ml-1" />
            </button>
         </div>
         <div class="flex justify-between text-center">
            <div class="flex flex-col items-center w-1/4">
               <Package class="w-6 h-6 text-gray-600 mb-1" />
               <span class="text-xs text-gray-600">To Pay</span>
            </div>
            <div class="flex flex-col items-center w-1/4 relative">
               <Truck class="w-6 h-6 text-gray-600 mb-1" />
               <span class="text-xs text-gray-600">To Ship</span>
               <span class="absolute -top-1 right-4 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" v-if="orders.some(o => o.status === 'Dikemas')">{{ orders.filter(o => o.status === 'Dikemas').length }}</span>
            </div>
            <div class="flex flex-col items-center w-1/4 relative">
               <Truck class="w-6 h-6 text-gray-600 mb-1" />
               <span class="text-xs text-gray-600">To Receive</span>
               <span class="absolute -top-1 right-4 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" v-if="orders.some(o => o.status === 'Dikirim')">{{ orders.filter(o => o.status === 'Dikirim').length }}</span>
            </div>
            <div class="flex flex-col items-center w-1/4">
               <CheckCircle class="w-6 h-6 text-gray-600 mb-1" />
               <span class="text-xs text-gray-600">Completed</span>
            </div>
         </div>
      </div>

      <!-- Menu List -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
         <div class="divide-y divide-gray-50">
            <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <Heart class="w-5 h-5 mr-3 text-red-500" />
                  <span class="text-sm">My Likes</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
            <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <CreditCard class="w-5 h-5 mr-3 text-blue-500" />
                  <span class="text-sm">My Vouchers</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
            <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <Settings class="w-5 h-5 mr-3 text-gray-500" />
                  <span class="text-sm">Account Settings</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
             <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <HelpCircle class="w-5 h-5 mr-3 text-green-500" />
                  <span class="text-sm">Help Centre</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
         </div>
      </div>

       <!-- Recent Orders List (Simplified) -->
      <div v-if="orders.length > 0" class="space-y-3">
         <h3 class="text-sm font-bold text-gray-500 px-2 mt-2">Recent Purchases</h3>
         <div v-for="order in orders.slice(0, 3)" :key="order.id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2">
            <div class="flex justify-between items-start border-b border-gray-50 pb-2">
               <span class="font-bold text-sm text-gray-800">{{ order.items[0]?.name }} <span v-if="order.items.length > 1" class="font-normal text-gray-500 text-xs">+ {{ order.items.length - 1 }} others</span></span>
               <span class="text-brand-600 text-xs uppercase font-bold">{{ order.status }}</span>
            </div>
            <div class="flex justify-between items-center pt-1">
               <span class="text-xs text-gray-500">{{ formatDate(order.date) }}</span>
               <span class="text-sm font-bold text-brand-600">{{ formatPrice(order.total) }}</span>
            </div>
            <div class="mt-2 text-right">
               <button class="bg-brand-600 text-white text-xs px-4 py-2 rounded shadow-sm hover:bg-brand-700">Buy Again</button>
            </div>
         </div>
      </div>

    </main>
    
    <div class="hidden md:block fixed bottom-10 right-10 z-50">
       <router-link to="/home" class="flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-brand-700 transition-all font-bold hover:-translate-y-1">
         <Home class="w-5 h-5" />
         <span>Back to Dashboard</span>
       </router-link>
    </div>

    <div class="md:hidden">
      <NavBar />
    </div>
  </div>
</template>
