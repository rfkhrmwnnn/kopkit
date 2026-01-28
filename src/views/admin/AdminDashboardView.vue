<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Search, Bell, Menu } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(true)

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Mock Data
const stats = [
  { title: 'Total Revenue', value: 'Rp 15.400.000', change: '+12.5%', isPositive: true },
  { title: 'Total Orders', value: '1,245', change: '+5.2%', isPositive: true },
  { title: 'Active Users', value: '892', change: '-2.4%', isPositive: false },
  { title: 'Products', value: '142', change: '+8', isPositive: true },
]

const recentOrders = [
  { id: '#ORD-9921', customer: 'Budi Santoso', product: 'Nasi Goreng Spesial', status: 'Completed', amount: 'Rp 65.000' },
  { id: '#ORD-9922', customer: 'Siti Aminah', product: 'Seragam Batik (L)', status: 'Pending', amount: 'Rp 85.000' },
  { id: '#ORD-9923', customer: 'Rudi Hartono', product: 'Kopi Hitam x2', status: 'Shipped', amount: 'Rp 10.000' },
  { id: '#ORD-9924', customer: 'Dewi Lestari', product: 'ATK Bundle A', status: 'Processing', amount: 'Rp 150.000' },
]
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="bg-slate-900 text-white transition-all duration-300 flex flex-col"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 class="font-black tracking-widest text-xl" v-if="isSidebarOpen">KOPKIT ADM</h1>
        <h1 class="font-black text-xl" v-else>K</h1>
      </div>
      
      <nav class="flex-1 py-6 space-y-2 px-3">
        <a href="#" class="flex items-center px-4 py-3 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-900/50">
          <LayoutDashboard class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Dashboard</span>
        </a>
        <a href="#" class="flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ShoppingBag class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Products</span>
        </a>
        <a href="#" class="flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <Users class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Customers</span>
        </a>
        <a href="#" class="flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <Settings class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Settings</span>
        </a>
      </nav>
      
      <div class="p-4 border-t border-slate-800">
        <button @click="logout" class="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut class="w-5 h-5" />
          <span class="ml-3 font-medium" v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-20">
        <button @click="isSidebarOpen = !isSidebarOpen" class="text-slate-500 hover:text-slate-700">
          <Menu class="w-6 h-6" />
        </button>
        
        <div class="flex items-center space-x-6">
          <div class="relative hidden md:block">
            <Search class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search anything..." class="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-500 w-64">
          </div>
          <button class="relative text-slate-500 hover:text-slate-700">
            <Bell class="w-6 h-6" />
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="flex items-center space-x-3 border-l pl-6 border-slate-100">
            <div class="text-right hidden md:block">
              <p class="text-xs text-slate-500">Super Admin</p>
              <p class="text-sm font-bold text-slate-800">Administrator</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">A</div>
          </div>
        </div>
      </header>
      
      <!-- Dashboard Content -->
      <main class="flex-1 overflow-y-auto bg-slate-50 p-6">
        <div class="max-w-7xl mx-auto space-y-6">
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
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-brand-500 h-full rounded-full" style="width: 70%"></div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Orders -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 class="font-bold text-lg text-slate-800 mb-6">Recent Orders</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-xs text-slate-400 border-b border-slate-50">
                      <th class="pb-3 pl-2">Order ID</th>
                      <th class="pb-3">Customer</th>
                      <th class="pb-3">Product</th>
                      <th class="pb-3">Amount</th>
                      <th class="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm">
                    <tr v-for="order in recentOrders" :key="order.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td class="icon py-4 pl-2 font-mono text-brand-600">{{ order.id }}</td>
                      <td class="py-4 font-medium">{{ order.customer }}</td>
                      <td class="py-4 text-slate-500">{{ order.product }}</td>
                      <td class="py-4 font-bold text-slate-700">{{ order.amount }}</td>
                      <td class="py-4">
                        <span 
                          class="px-3 py-1 rounded-full text-xs font-bold"
                          :class="{
                            'bg-green-100 text-green-600': order.status === 'Completed',
                            'bg-orange-100 text-orange-600': order.status === 'Pending' || order.status === 'Processing',
                            'bg-blue-100 text-blue-600': order.status === 'Shipped'
                          }"
                        >
                          {{ order.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Quick Actions / Ad Space (Optional) -->
            <div class="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-2">Admin Pro Features</h3>
                <p class="text-brand-100 mb-6">Upgrade to unlock advanced analytics and multi-store management.</p>
                <button class="bg-white text-brand-700 font-bold py-3 px-6 rounded-xl hover:bg-brand-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div class="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
