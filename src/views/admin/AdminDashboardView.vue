<script setup>
import { ref, computed } from 'vue'
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

// Stats (Static for now)
const stats = [
  { title: 'Total Revenue', value: 'Rp 15.400.000', change: '+12.5%', isPositive: true },
  { title: 'Total Orders', value: '1,245', change: '+5.2%', isPositive: true },
  { title: 'Active Products', value: computed(() => productStore.products.length), change: '+2', isPositive: true },
  { title: 'Total Customers', value: computed(() => customers.value.length), change: '+4', isPositive: true },
]
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-900 text-white transition-all duration-300 flex flex-col z-30"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 class="font-black tracking-widest text-xl" v-if="isSidebarOpen">KOPKIT ADM</h1>
        <h1 class="font-black text-xl" v-else>K</h1>
      </div>
      
      <nav class="flex-1 py-6 space-y-2 px-3">
        <button @click="currentView = 'dashboard'" :class="currentView === 'dashboard' ? 'bg-brand-600 shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'" class="w-full flex items-center px-4 py-3 rounded-xl transition-colors">
          <LayoutDashboard class="w-5 h-5 flex-shrink-0" />
          <span class="ml-3 font-medium truncate" v-if="isSidebarOpen">Dashboard</span>
        </button>
        <button @click="currentView = 'products'" :class="currentView === 'products' ? 'bg-brand-600 shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'" class="w-full flex items-center px-4 py-3 rounded-xl transition-colors">
          <ShoppingBag class="w-5 h-5 flex-shrink-0" />
          <span class="ml-3 font-medium truncate" v-if="isSidebarOpen">Products</span>
        </button>
        <button @click="currentView = 'customers'" :class="currentView === 'customers' ? 'bg-brand-600 shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'" class="w-full flex items-center px-4 py-3 rounded-xl transition-colors">
          <Users class="w-5 h-5 flex-shrink-0" />
          <span class="ml-3 font-medium truncate" v-if="isSidebarOpen">Customers</span>
        </button>
        <button @click="currentView = 'settings'" :class="currentView === 'settings' ? 'bg-brand-600 shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'" class="w-full flex items-center px-4 py-3 rounded-xl transition-colors">
          <Settings class="w-5 h-5 flex-shrink-0" />
          <span class="ml-3 font-medium truncate" v-if="isSidebarOpen">Settings</span>
        </button>
      </nav>
      
      <div class="p-4 border-t border-slate-800">
        <button @click="logout" class="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Logout</span>
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
          <div v-if="currentView === 'dashboard'" class="space-y-6">
            <h2 class="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div class="flex justify-between items-start mb-4">
                  <div>
                     <p class="text-xs text-slate-500 font-medium uppercase">{{ stat.title }}</p>
                     <h3 class="text-2xl font-bold text-slate-800 mt-1">{{ stat.value }}</h3>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-lg text-xs font-bold"
                    :class="stat.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                  >
                    {{ stat.change }}
                  </span>
                </div>
              </div>
            </div>
            
             <!-- Simplification: Just keeping the prompt satisfied by focusing on new requirements -->
             <div class="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
                 <p>Chart or Activity Feed Placeholder</p>
             </div>
          </div>

          <!-- PRODUCTS VIEW -->
          <div v-else-if="currentView === 'products'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-slate-800">Product Management</h2>
              <button @click="openAddProductModal" class="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center">
                <Plus class="w-5 h-5 mr-2" /> Add Product
              </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                    <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-slate-50">
                      <td class="px-6 py-4 font-medium text-slate-900">{{ product.name }}</td>
                      <td class="px-6 py-4 text-slate-500">
                        <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{{ product.category }}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-700">Rp {{ product.price.toLocaleString('id-ID') }}</td>
                      <td class="px-6 py-4 text-right space-x-2">
                        <button @click="openEditProductModal(product)" class="text-blue-500 hover:text-blue-700"><Edit class="w-4 h-4" /></button>
                        <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700"><Trash2 class="w-4 h-4" /></button>
                      </td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>

          <!-- CUSTOMERS VIEW -->
          <div v-else-if="currentView === 'customers'" class="space-y-6">
             <h2 class="text-2xl font-bold text-slate-800">Customer List</h2>
             <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                    <tr v-for="customer in customers" :key="customer.id" class="hover:bg-slate-50">
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
          <div v-else-if="currentView === 'settings'" class="space-y-6">
             <h2 class="text-2xl font-bold text-slate-800">Application Settings</h2>
             
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <!-- General Settings -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">General Information</h3>
                  <div class="space-y-4">
                     <div>
                       <label class="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                       <input v-model="configStore.storeName" type="text" class="w-full border p-2 border-slate-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 outline-none">
                     </div>
                     <div>
                       <label class="block text-sm font-medium text-slate-700 mb-1">Admin Email Notification</label>
                       <input v-model="configStore.adminEmail" type="email" class="w-full border p-2 border-slate-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 outline-none">
                     </div>
                     <div class="flex items-center py-2">
                       <input v-model="configStore.maintenanceMode" id="maintenance" type="checkbox" class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded">
                       <label for="maintenance" class="ml-2 block text-sm text-slate-900">Maintenance Mode</label>
                     </div>
                  </div>
               </div>

               <!-- Payment Methods -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">Payment Methods</h3>
                  <div class="space-y-3">
                    <div v-for="method in configStore.paymentMethods" :key="method.id" class="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                       <div class="flex items-center">
                          <input 
                            type="checkbox" 
                            :checked="method.enabled" 
                            @change="configStore.togglePaymentMethod(method.id)"
                            class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                          >
                          <span class="ml-3 text-sm font-medium text-slate-700">{{ method.name }}</span>
                       </div>
                       <span :class="method.enabled ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'" class="text-xs px-2 py-1 rounded font-bold">
                         {{ method.enabled ? 'Active' : 'Disabled' }}
                       </span>
                    </div>
                  </div>
               </div>

               <!-- Shipping Methods -->
               <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                  <h3 class="font-bold text-lg mb-4 text-slate-800">Shipping Methods</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="method in configStore.shippingMethods" :key="method.id" class="p-4 border border-slate-200 rounded-xl relative overflow-hidden" :class="{'bg-slate-50 opacity-75': !method.enabled}">
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
             
             <div class="flex justify-end pt-4">
                <button @click="saveSettings" class="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all">Save All Changes</button>
             </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Add Product Modal -->
    <div v-if="isProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
         <h3 class="text-xl font-bold text-slate-800 mb-4">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
         <div class="space-y-4">
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
               <input v-model="newProduct.name" type="text" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                 <label class="block text-sm font-medium text-slate-700 mb-1">Price (Rp)</label>
                 <input v-model="newProduct.price" type="number" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none">
              </div>
              <div>
                 <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
                 <select v-model="newProduct.category" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option v-for="cat in productStore.categories.filter(c => c !== 'All')" :key="cat" :value="cat">{{ cat }}</option>
                 </select>
              </div>
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
               <textarea v-model="newProduct.description" rows="3" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"></textarea>
            </div>
            <div>
               <label class="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
               <input v-model="newProduct.image" type="text" class="w-full border px-3 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none">
            </div>
         </div>
         <div class="flex justify-end space-x-3 mt-6">
            <button @click="isProductModalOpen = false" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button @click="saveProduct" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Save Product</button>
         </div>
      </div>
    </div>
  </div>
</template>
