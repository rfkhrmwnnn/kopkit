<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { Package, Truck, CheckCircle, MapPin, LogOut, Home } from 'lucide-vue-next'

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
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
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

const getStatusIcon = (status) => {
  if (status === 'Dikemas') return Package
  if (status === 'Dikirim') return Truck
  return CheckCircle
}

const getStatusColor = (status) => {
  if (status === 'Dikemas') return 'text-orange-500 bg-orange-50 border-orange-200'
  if (status === 'Dikirim') return 'text-blue-500 bg-blue-50 border-blue-200'
  return 'text-green-500 bg-green-50 border-green-200'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-0">
    <div class="bg-brand-900 pb-32 pt-10 px-4 rounded-b-[3rem] shadow-lg relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
      <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>

      <div class="max-w-3xl mx-auto flex justify-between items-start relative z-10">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 backdrop-blur-sm">
            {{ authStore.user?.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-white text-2xl font-bold">Halo, {{ authStore.user?.username }}</h1>
            <p class="text-brand-200 text-sm">{{ authStore.user?.role === 'admin' ? 'Administrator' : 'Premium Member' }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
            <router-link to="/home" class="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors" title="Back to Dashboard">
              <Home class="w-5 h-5" />
            </router-link>
            <button @click="handleLogout" class="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors" title="Logout">
              <LogOut class="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-4 -mt-24 space-y-6 relative z-10">
      <!-- Address Card -->
      <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-bold text-gray-800 flex items-center">
            <MapPin class="w-5 h-5 mr-2 text-brand-500" /> Shipping Address
          </h2>
          <button 
            v-if="!isEditingAddress" 
            @click="isEditingAddress = true"
            class="text-sm text-brand-600 font-medium hover:underline"
          >
            Edit
          </button>
          <div v-else class="space-x-2">
            <button @click="updateAddress" class="text-xs bg-brand-600 text-white px-3 py-1 rounded">Save</button>
            <button @click="isEditingAddress = false" class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">Cancel</button>
          </div>
        </div>
        
        <div v-if="!isEditingAddress">
          <p class="text-gray-600 leading-relaxed">{{ authStore.user?.address }}</p>
        </div>
        <textarea v-else v-model="newAddress" rows="3" class="w-full border rounded p-2"></textarea>
      </div>

      <!-- Orders -->
      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-4 px-2">Order History</h2>
        
        <div v-if="orders.length > 0" class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div class="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
              <div>
                <span class="text-xs text-gray-400 font-mono">{{ order.id }}</span>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(order.date) }}</p>
              </div>
              <div class="flex items-center px-3 py-1 rounded-full text-xs font-bold border" :class="getStatusColor(order.status)">
                <component :is="getStatusIcon(order.status)" class="w-3 h-3 mr-1.5" />
                {{ order.status }}
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Items</p>
                    <ul class="text-sm text-gray-800 space-y-1">
                        <li v-for="item in order.items" :key="item.id" class="flex justify-between">
                            <span>{{ item.quantity }}x {{ item.name }}</span>
                        </li>
                    </ul>
                </div>
                <div class="text-right flex flex-col justify-end">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                    <p class="text-lg font-bold text-brand-700">{{ formatPrice(order.total) }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ order.paymentMethod === 'cash' ? 'COD' : order.paymentMethod.toUpperCase() }}</p>
                </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
           <Package class="w-12 h-12 mx-auto mb-2 text-gray-200" />
           <p>No orders yet.</p>
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
