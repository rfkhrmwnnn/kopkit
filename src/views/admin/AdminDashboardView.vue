<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products'
import { useConfigStore } from '@/stores/config'
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, LogOut, 
  Search, Bell, Menu, Plus, Trash2, Edit 
} from 'lucide-vue-next'

const authStore = useAuthStore()
const productStore = useProductStore()
const configStore = useConfigStore()
const router = useRouter()
const isSidebarOpen = ref(true)
const currentView = ref('dashboard') // dashboard, products, customers, settings

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// --- Mock Data for Customers ---
const customers = ref([
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'User', joined: '2023-01-15' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'Premium', joined: '2023-02-20' },
  { id: 3, name: 'Rudi Hartono', email: 'rudi@example.com', role: 'User', joined: '2023-03-10' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', role: 'User', joined: '2023-04-05' },
])

const orders = ref([])

onMounted(() => {
  const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.value = savedOrders.reverse()
})

const updateOrderStatus = (orderId, newStatus) => {
  const orderIndex = orders.value.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = newStatus
    // Update LocalStorage
    // We need to reverse back or find in original array if we want persistence properly across sessions if using just one source
    // For simplicity, reading all, updating, and saving back.
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const realIndex = allOrders.findIndex(o => o.id === orderId)
    if (realIndex !== -1) {
      allOrders[realIndex].status = newStatus
      localStorage.setItem('orders', JSON.stringify(allOrders))
    }
  }
}

const getStatusColor = (status) => {
  if (status === 'Dikemas') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (status === 'Dikirim') return 'bg-blue-100 text-blue-700 border-blue-200'
  return 'bg-green-100 text-green-700 border-green-200'
}

// --- Order Management (Edit) ---
const isOrderModalOpen = ref(false)
const editingOrder = ref({ id: '', status: '', resi: '' })

const openOrderModal = (order) => {
  editingOrder.value = { ...order }
  isOrderModalOpen.value = true
}

const saveOrderUpdate = () => {
  const orderIndex = orders.value.findIndex(o => o.id === editingOrder.value.id)
  if (orderIndex !== -1) {
    // Update local state
    orders.value[orderIndex].status = editingOrder.value.status
    orders.value[orderIndex].resi = editingOrder.value.resi
    
    // Persist to LocalStorage (Global update)
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const realIndex = allOrders.findIndex(o => o.id === editingOrder.value.id)
    if (realIndex !== -1) {
      allOrders[realIndex].status = editingOrder.value.status
      allOrders[realIndex].resi = editingOrder.value.resi || ''
      localStorage.setItem('orders', JSON.stringify(allOrders))
    }
  }
  isOrderModalOpen.value = false
}

// --- Product Management ---
const isProductModalOpen = ref(false)
const newProduct = ref({
  name: '',
  price: 0,
  category: 'Makanan',
  description: '',
  image: 'https://placehold.co/400x400/gray/white?text=Product'
})

const isEditing = ref(false)

const openAddProductModal = () => {
  isEditing.value = false
  newProduct.value = {
    name: '',
    price: 0,
    category: 'Makanan',
    description: '',
    image: 'https://placehold.co/400x400/gray/white?text=Product'
  }
  isProductModalOpen.value = true
}

const openEditProductModal = (product) => {
  isEditing.value = true
  newProduct.value = { ...product }
  isProductModalOpen.value = true
}

const saveProduct = () => {
  if (!newProduct.value.name || newProduct.value.price <= 0) {
    alert('Please fill in valid name and price')
    return
  }
  
  if (isEditing.value) {
    productStore.updateProduct(newProduct.value)
  } else {
    productStore.addProduct(newProduct.value)
  }
  isProductModalOpen.value = false
}

const deleteProduct = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    productStore.removeProduct(id)
  }
}

// --- Settings ---
// Removed local appSettings, using configStore now directly in template

const saveSettings = () => {
  alert('Settings saved successfully!')
}

// Stats (Dynamic)
const stats = computed(() => [
  { title: 'Total Revenue', value: 'Rp ' + orders.value.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID'), change: '+12.5%', isPositive: true },
  { title: 'Total Orders', value: orders.value.length, change: '+5.2%', isPositive: true },
  { title: 'Active Products', value: productStore.products.length, change: `+${productStore.products.length - 7}`, isPositive: true },
  { title: 'Total Customers', value: customers.value.length, change: `+${customers.value.length - 4}`, isPositive: true },
])
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-900 text-white transition-all duration-300 flex flex-col z-30 shadow-2xl"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="h-20 flex items-center justify-center border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <h1 class="font-black tracking-widest text-xl bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent transform transition-all hover:scale-105" v-if="isSidebarOpen">KOPKIT ADM</h1>
        <h1 class="font-black text-xl bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent" v-else>K</h1>
      </div>
      
      <nav class="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
        <button @click="currentView = 'dashboard'" :class="currentView === 'dashboard' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-900/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'" class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group">
          <LayoutDashboard class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
          <span class="ml-3 font-medium truncate transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Dashboard</span>
        </button>
        <button @click="currentView = 'orders'" :class="currentView === 'orders' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-900/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'" class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group">
          <ShoppingBag class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
          <span class="ml-3 font-medium truncate transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Orders</span>
        </button>
        <button @click="currentView = 'products'" :class="currentView === 'products' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-900/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'" class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group">
          <div class="relative">
             <ShoppingBag class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
             <div class="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></div>
          </div>
          <span class="ml-3 font-medium truncate transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Products</span>
        </button>
        <button @click="currentView = 'customers'" :class="currentView === 'customers' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-900/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'" class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group">
          <Users class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
          <span class="ml-3 font-medium truncate transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Customers</span>
        </button>
        <button @click="currentView = 'settings'" :class="currentView === 'settings' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-900/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'" class="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group">
          <Settings class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
          <span class="ml-3 font-medium truncate transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Settings</span>
        </button>
      </nav>
      
      <div class="p-4 border-t border-slate-800/50 bg-slate-900/30">
        <button @click="logout" class="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors group">
          <LogOut class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span class="ml-3 font-medium transition-opacity" :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-20 flex-shrink-0">
        <button @click="isSidebarOpen = !isSidebarOpen" class="text-slate-500 hover:text-slate-700">
          <Menu class="w-6 h-6" />
        </button>
        
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3 border-l pl-6 border-slate-100">
            <div class="text-right hidden md:block">
              <p class="text-xs text-slate-500">Super Admin</p>
              <p class="text-sm font-bold text-slate-800">Administrator</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">A</div>
          </div>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- DASHBOARD VIEW -->
          <div v-if="currentView === 'dashboard'" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
             <!-- Orders Summary -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow animate-slide-up" style="animation-delay: 100ms;">
                   <div class="p-4 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <ShoppingBag class="w-8 h-8"/>
                   </div>
                   <div>
                      <p class="text-sm text-slate-500">Need to Ship</p>
                      <p class="text-2xl font-bold text-slate-800">{{ orders.filter(o => o.status === 'Dikemas').length }}</p>
                   </div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow animate-slide-up" style="animation-delay: 200ms;">
                   <div class="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <Users class="w-8 h-8"/>
                   </div>
                   <div>
                      <p class="text-sm text-slate-500">Being Shipped</p>
                      <p class="text-2xl font-bold text-slate-800">{{ orders.filter(o => o.status === 'Dikirim').length }}</p>
                   </div>
                </div>
                 <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow animate-slide-up" style="animation-delay: 300ms;">
                   <div class="p-4 rounded-full bg-green-100 text-green-600 mr-4">
                      <ShoppingBag class="w-8 h-8"/>
                   </div>
                   <div>
                      <p class="text-sm text-slate-500">Completed Revenue</p>
                      <p class="text-2xl font-bold text-slate-800">Rp {{ orders.filter(o => o.status === 'Selesai').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID') }}</p>
                   </div>
                </div>
             </div>
             
             <!-- Recent Orders Table -->
             <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up" style="animation-delay: 400ms;">
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 class="font-bold text-slate-800">Recent Orders</h3>
                   <button @click="currentView = 'orders'" class="text-sm text-brand-600 hover:underline">View All</button>
                </div>
                <table class="w-full text-left">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th class="px-6 py-4">Order ID</th>
                      <th class="px-6 py-4">Customer</th>
                      <th class="px-6 py-4">Total</th>
                      <th class="px-6 py-4">Status</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="order in orders.slice(0, 5)" :key="order.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-mono text-slate-500 text-xs">{{ order.id }}</td>
                      <td class="px-6 py-4 font-medium text-slate-900">
                         {{ order.address ? order.address.substring(0, 20) + '...' : 'Customer' }}
                         <div class="text-xs text-slate-400 font-normal">Via {{ order.shippingMethod?.name || 'Shipping' }}</div>
                      </td>
                      <td class="px-6 py-4 text-slate-700 font-bold">Rp {{ order.total.toLocaleString('id-ID') }}</td>
                      <td class="px-6 py-4">
                        <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded text-xs font-bold border">
                          {{ order.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button 
                           @click="openOrderModal(order)"
                           class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors flex items-center ml-auto"
                        >
                           <Edit class="w-3 h-3 mr-1" /> Manage
                        </button>
                      </td>
                    </tr>
                  </tbody>
               </table>
               <div v-if="orders.length === 0" class="p-10 text-center text-slate-400">
                  No orders found.
               </div>
             </div>
          </div>

          <!-- ORDERS VIEW (New) -->
          <div v-else-if="currentView === 'orders'" class="space-y-6 animate-fade-in">
             <h2 class="text-2xl font-bold text-slate-800">Order Management</h2>
             <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up">
               <table class="w-full text-left">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th class="px-6 py-4">Order ID</th>
                      <th class="px-6 py-4">Customer</th>
                      <th class="px-6 py-4">Total</th>
                      <th class="px-6 py-4">Status</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-mono text-slate-500 text-xs">{{ order.id }}</td>
                      <td class="px-6 py-4 font-medium text-slate-900">
                         {{ order.address ? order.address.substring(0, 20) + '...' : 'Customer' }}
                         <div class="text-xs text-slate-400 font-normal">Via {{ order.shippingMethod?.name || 'Shipping' }}</div>
                      </td>
                      <td class="px-6 py-4 text-slate-700 font-bold">Rp {{ order.total.toLocaleString('id-ID') }}</td>
                      <td class="px-6 py-4">
                        <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded text-xs font-bold border">
                          {{ order.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button 
                           @click="openOrderModal(order)"
                           class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors flex items-center ml-auto"
                        >
                           <Edit class="w-3 h-3 mr-1" /> Manage
                        </button>
                         <span v-if="order.status === 'Selesai'" class="text-slate-400 text-xs italic block mt-1">Completed</span>
                      </td>
                    </tr>
                  </tbody>
               </table>
               <div v-if="orders.length === 0" class="p-10 text-center text-slate-400">
                  No orders found.
               </div>
             </div>
          </div>

          <!-- PRODUCTS VIEW -->
          <div v-else-if="currentView === 'products'" class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-slate-800">Product Management</h2>
              <button @click="openAddProductModal" class="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center transition-transform active:scale-95 shadow-lg shadow-brand-500/30">
                <Plus class="w-5 h-5 mr-2" /> Add Product
              </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up">
               <table class="w-full text-left">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th class="px-6 py-4">Product Name</th>
                      <th class="px-6 py-4">Category</th>
                      <th class="px-6 py-4">Price</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-medium text-slate-900">{{ product.name }}</td>
                      <td class="px-6 py-4 text-slate-500">
                        <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{{ product.category }}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-700">Rp {{ product.price.toLocaleString('id-ID') }}</td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button @click="openEditProductModal(product)" class="text-blue-500 hover:text-blue-700 transition-colors"><Edit class="w-4 h-4" /></button>
                        <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700 transition-colors"><Trash2 class="w-4 h-4" /></button>
                      </td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>

          <!-- CUSTOMERS VIEW -->
          <div v-else-if="currentView === 'customers'" class="space-y-6 animate-fade-in">
             <h2 class="text-2xl font-bold text-slate-800">Customer List</h2>
             <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up">
               <table class="w-full text-left">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th class="px-6 py-4">Name</th>
                      <th class="px-6 py-4">Email</th>
                      <th class="px-6 py-4">Role</th>
                      <th class="px-6 py-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="customer in customers" :key="customer.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-medium text-slate-900 flex items-center">
                         <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold mr-3">
                           {{ customer.name.charAt(0) }}
                         </div>
                         {{ customer.name }}
                      </td>
                      <td class="px-6 py-4 text-slate-500">{{ customer.email }}</td>
                      <td class="px-6 py-4">
                        <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{{ customer.role }}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-500">{{ customer.joined }}</td>
                    </tr>
                  </tbody>
               </table>
             </div>
          </div>

          <!-- SETTINGS VIEW -->
          <div v-else-if="currentView === 'settings'" class="space-y-6 animate-fade-in">
             <h2 class="text-2xl font-bold text-slate-800">Application Settings</h2>
             
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <!-- General Settings -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 100ms;">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">General Information</h3>
                  <div class="space-y-4">
                     <div>
                       <label class="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                       <input v-model="configStore.storeName" type="text" class="w-full border p-2 border-slate-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 outline-none transition-all focus:shadow-md">
                     </div>
                     <div>
                       <label class="block text-sm font-medium text-slate-700 mb-1">Admin Email Notification</label>
                       <input v-model="configStore.adminEmail" type="email" class="w-full border p-2 border-slate-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 outline-none transition-all focus:shadow-md">
                     </div>
                     <div class="flex items-center py-2">
                       <input v-model="configStore.maintenanceMode" id="maintenance" type="checkbox" class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded">
                       <label for="maintenance" class="ml-2 block text-sm text-slate-900">Maintenance Mode</label>
                     </div>
                  </div>
               </div>

               <!-- Payment Methods -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 200ms;">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">Payment Methods</h3>
                  <div class="space-y-3">
                    <div v-for="method in configStore.paymentMethods" :key="method.id" class="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                       <div class="flex items-center">
                          <input 
                            type="checkbox" 
                            :checked="method.enabled" 
                            @change="configStore.togglePaymentMethod(method.id)"
                            class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                          >
                          <span class="ml-3 text-sm font-medium text-slate-700">{{ method.name }}</span>
                       </div>
                       <span :class="method.enabled ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'" class="text-xs px-2 py-1 rounded font-bold transition-colors">
                         {{ method.enabled ? 'Active' : 'Disabled' }}
                       </span>
                    </div>
                  </div>
               </div>

               <!-- Shipping Methods -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 animate-slide-up" style="animation-delay: 300ms;">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">Shipping Methods</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="method in configStore.shippingMethods" :key="method.id" class="p-4 border border-slate-200 rounded-xl relative overflow-hidden transition-all hover:shadow-md" :class="{'bg-slate-50 opacity-75': !method.enabled}">
                       <div class="flex justify-between items-start mb-2">
                          <h4 class="font-bold text-slate-800">{{ method.name }}</h4>
                          <input 
                            type="checkbox" 
                            :checked="method.enabled" 
                            @change="configStore.toggleShippingMethod(method.id)"
                            class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                          >
                       </div>
                       <div class="mt-2">
                          <label class="block text-xs text-slate-500 mb-1">Base Cost (Rp)</label>
                          <input 
                            type="number" 
                            :value="method.price" 
                            @input="e => configStore.updateShippingPrice(method.id, parseInt(e.target.value))"
                            class="w-full text-sm border p-1 rounded focus:ring-1 focus:ring-brand-500 outline-none"
                            :disabled="!method.enabled"
                          >
                       </div>
                    </div>
                  </div>
               </div>
             </div>
             
             <div class="flex justify-end pt-4 animate-slide-up" style="animation-delay: 400ms;">
                <button @click="saveSettings" class="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1">Save All Changes</button>
             </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Add Product Modal -->
    <div v-if="isProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
         <h3 class="text-xl font-bold text-slate-800 mb-4">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
         <div class="space-y-4">
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
               <input v-model="newProduct.name" type="text" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                 <label class="block text-sm font-medium text-slate-700 mb-1">Price (Rp)</label>
                 <input v-model="newProduct.price" type="number" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
              </div>
              <div>
                 <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
                 <select v-model="newProduct.category" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                    <option v-for="cat in productStore.categories.filter(c => c !== 'All')" :key="cat" :value="cat">{{ cat }}</option>
                 </select>
              </div>
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
               <textarea v-model="newProduct.description" rows="3" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"></textarea>
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
               <input v-model="newProduct.image" type="text" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
            </div>
         </div>
         <div class="flex justify-end space-x-3 mt-6">
            <button @click="isProductModalOpen = false" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button @click="saveProduct" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md transition-all hover:-translate-y-0.5">Save Product</button>
         </div>
      </div>
    </div>

    <!-- Edit Order Modal -->
    <div v-if="isOrderModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
         <h3 class="text-xl font-bold text-slate-800 mb-4">Update Order {{ editingOrder.id }}</h3>
         <div class="space-y-4">
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select v-model="editingOrder.status" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                  <option value="Dikemas">Dikemas (Packed)</option>
                  <option value="Dikirim">Dikirim (Shipped)</option>
                  <option value="Selesai">Selesai (Completed)</option>
               </select>
            </div>
            
            <div v-if="editingOrder.status === 'Dikirim' || editingOrder.status === 'Selesai'" class="animate-fade-in">
               <label class="block text-sm font-medium text-slate-700 mb-1">Tracking Number (No. Resi)</label>
               <input v-model="editingOrder.resi" type="text" placeholder="Enter tracking number" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
               <p class="text-xs text-slate-500 mt-1">Required for shipped orders.</p>
            </div>
         </div>
         <div class="flex justify-end space-x-3 mt-6">
            <button @click="isOrderModalOpen = false" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button @click="saveOrderUpdate" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md transition-all hover:-translate-y-0.5">Update Order</button>
         </div>
      </div>
    </div>

  </div>
</template>