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

const intervalId = ref(null)

const fetchOrders = () => {
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  if (authStore.user) {
    // Only update if changes found or deeply checking, but simple replacement is fine for now
    orders.value = savedOrders.filter(o => o.username === authStore.user.username).reverse()
  }
}

onMounted(() => {
  fetchOrders()
  
  if (authStore.user) {
    newAddress.value = authStore.user.address
  }

  // Real-time polling
  intervalId.value = setInterval(fetchOrders, 2000)
})

import { onUnmounted } from 'vue'

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
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

import { useProductStore } from '@/stores/products'

const productStore = useProductStore()

// --- Likes Modal ---
const isLikesModalOpen = ref(false)
const likedProducts = ref([])

const openLikesModal = () => {
  if (authStore.user) {
    const userLikes = productStore.getLikedProducts(authStore.user.username)
    // Filter full product objects
    likedProducts.value = productStore.products.filter(p => userLikes.includes(p.id))
  }
  isLikesModalOpen.value = true
}

// --- History Modal ---
const isHistoryModalOpen = ref(false)
const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

// --- Account Settings ---
const isSettingsModalOpen = ref(false)
const editProfileForm = ref({
  password: '',
  address: ''
})

const openSettingsModal = () => {
  editProfileForm.value = {
    password: authStore.user?.password || '', // Password might not be stored in user object in logic before, but let's assume valid fields
    address: authStore.user?.address || ''
  }
  isSettingsModalOpen.value = true
}

const saveSettings = () => {
  // We only update what is allowed. Username should be immutable usually.
  authStore.updateProfile({
    address: editProfileForm.value.address,
    // Note: In real app, password change requires old password verification
    ...(editProfileForm.value.password ? { password: editProfileForm.value.password } : {}) 
  })
  isSettingsModalOpen.value = false
  alert('Profile updated successfully')
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
            <button @click="openHistoryModal" class="text-xs text-brand-600 font-bold flex items-center hover:underline">
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
            <button @click="openLikesModal" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
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
            <button @click="openSettingsModal" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <Settings class="w-5 h-5 mr-3 text-gray-500" />
                  <span class="text-sm">Account Settings</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
             <a href="https://wa.me/6283869785398" target="_blank" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div class="flex items-center text-gray-700">
                  <HelpCircle class="w-5 h-5 mr-3 text-green-500" />
                  <span class="text-sm">Help Centre</span>
               </div>
               <ChevronRight class="w-4 h-4 text-gray-400" />
            </a>
         </div>
      </div>

       <!-- Recent Orders List -->
      <div v-if="orders.length > 0" class="space-y-3">
         <h3 class="text-sm font-bold text-gray-500 px-2 mt-2">Recent Purchases</h3>
         <div v-for="order in orders.slice(0, 3)" :key="order.id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2">
            <div class="flex justify-between items-start border-b border-gray-50 pb-2">
               <div>
                 <span class="font-bold text-sm text-gray-800">{{ order.items[0]?.name }} <span v-if="order.items.length > 1" class="font-normal text-gray-500 text-xs">+ {{ order.items.length - 1 }} others</span></span>
                 <div class="text-[10px] text-gray-400 font-mono mt-0.5">{{ order.id }}</div>
               </div>
               <span class="text-brand-600 text-[10px] uppercase font-bold bg-brand-50 px-2 py-1 rounded">{{ order.status }}</span>
            </div>
            
            <div v-if="order.resi" class="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
               <span class="text-xs text-slate-500">Tracking Number (Resi):</span>
               <span class="text-xs font-mono font-bold text-slate-800 select-all">{{ order.resi }}</span>
            </div>

            <div class="flex justify-between items-center pt-1">
               <span class="text-xs text-gray-500">{{ formatDate(order.date) }}</span>
               <span class="text-sm font-bold text-brand-600">{{ formatPrice(order.total) }}</span>
            </div>
            <div class="mt-2 text-right">
               <button class="bg-brand-600 text-white text-xs px-4 py-2 rounded shadow-sm hover:bg-brand-700 font-bold transition-all active:scale-95">Buy Again</button>
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

    <!-- Account Settings Modal -->
    <div v-if="isSettingsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
         <h3 class="text-xl font-bold text-slate-800 mb-4">Account Settings</h3>
         <div class="space-y-4">
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
               <input :value="authStore.user?.username" type="text" disabled class="w-full border px-3 py-2 rounded-lg border-gray-200 bg-gray-50 text-gray-500">
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
               <textarea v-model="editProfileForm.address" rows="3" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"></textarea>
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
               <input v-model="editProfileForm.password" type="password" placeholder="Leave blank to keep current" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
            </div>
         </div>
         <div class="flex justify-end space-x-3 mt-6">
            <button @click="isSettingsModalOpen = false" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button @click="saveSettings" class="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700 shadow-md">Save Changes</button>
         </div>
      </div>
    </div>

    <!-- My Likes Modal -->
    <div v-if="isLikesModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-scale-in max-h-[80vh] flex flex-col">
         <div class="flex justify-between items-center mb-4">
           <h3 class="text-xl font-bold text-slate-800">My Likes</h3>
           <button @click="isLikesModalOpen = false" class="text-slate-400 hover:text-slate-600"><div class="text-2xl">&times;</div></button>
         </div>
         <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            <div v-if="likedProducts.length === 0" class="text-center py-10 text-slate-400">No liked products yet.</div>
            <div v-for="product in likedProducts" :key="product.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
               <img :src="product.image" class="w-16 h-16 rounded-lg object-cover bg-gray-100">
               <div class="flex-1">
                  <h4 class="font-bold text-slate-800">{{ product.name }}</h4>
                  <p class="text-brand-600 font-bold text-sm">{{ formatPrice(product.price) }}</p>
               </div>
               <button 
                  @click="productStore.toggleLike(authStore.user?.username, product.id); likedProducts = likedProducts.filter(p => p.id !== product.id)" 
                  class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
               >
                  <Heart class="w-5 h-5 fill-current" />
               </button>
            </div>
         </div>
      </div>
    </div>

    <!-- History Modal -->
    <div v-if="isHistoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-scale-in max-h-[80vh] flex flex-col">
         <div class="flex justify-between items-center mb-4">
           <h3 class="text-xl font-bold text-slate-800">Purchase History</h3>
           <button @click="isHistoryModalOpen = false" class="text-slate-400 hover:text-slate-600"><div class="text-2xl">&times;</div></button>
         </div>
         <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            <div v-if="orders.length === 0" class="text-center py-10 text-slate-400">No purchase history found.</div>
            <div v-for="order in orders" :key="order.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
               <div class="flex justify-between items-center border-b border-slate-50 pb-2">
                   <div>
                       <span class="font-bold text-slate-800">Order {{ order.id }}</span>
                       <div class="text-xs text-slate-400">{{ formatDate(order.date) }}</div>
                   </div>
                   <span class="px-2 py-1 rounded text-xs font-bold uppercase bg-brand-50 text-brand-600">{{ order.status }}</span>
               </div>
               
               <div v-if="order.resi" class="bg-slate-50 p-2 rounded text-xs flex justify-between">
                  <span class="text-slate-500">Tracking (Resi):</span>
                  <span class="font-mono font-bold">{{ order.resi }}</span>
               </div>

               <div class="space-y-2">
                  <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between items-center text-sm">
                      <span class="text-slate-700">{{ item.name }} <span class="text-xs text-slate-400">x{{ item.quantity }}</span></span>
                      <span class="font-medium text-slate-900">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
               </div>
               
               <div class="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-slate-800">
                  <span>Total</span>
                  <span>{{ formatPrice(order.total) }}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>
