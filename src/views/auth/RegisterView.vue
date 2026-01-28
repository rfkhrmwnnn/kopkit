<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const address = ref('')
const error = ref('')

const handleRegister = () => {
  if (!username.value || !password.value || !address.value) {
    error.value = 'All fields are required'
    return
  }

  if (authStore.register(username.value, password.value, address.value)) {
    router.push('/home')
  } else {
    error.value = 'Username already exists'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-100 px-4 relative overflow-hidden">
    <!-- Decorative Blobs -->
    <div class="absolute top-0 right-0 w-80 h-80 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>

    <div class="max-w-md w-full space-y-8 glass p-8 rounded-3xl relative z-10 animate-scale-in">
      <div class="text-center animate-slide-up">
        <!-- Brand -->
        <h1 class="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 uppercase">
          Kopkit
        </h1>
        <h2 class="mt-6 text-2xl font-bold text-slate-800">Create Account</h2>
        <p class="mt-2 text-sm text-slate-500">
          Join our cooperative community
        </p>
      </div>
      
      <form class="mt-8 space-y-6 animate-slide-up" style="animation-delay: 100ms;" @submit.prevent="handleRegister">
        <div class="rounded-md space-y-4">
          <div>
            <label for="username" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 bg-white/50 focus:bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Choose a username"
            />
          </div>
          
          <div>
            <label for="address" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</label>
            <textarea
              v-model="address"
              id="address"
              name="address"
              rows="2"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 bg-white/50 focus:bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Enter your full address"
            ></textarea>
          </div>

          <div>
            <label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 bg-white/50 focus:bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Create a password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-xs text-center font-bold bg-red-50 py-3 rounded-xl animate-bounce-soft">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-brand-500/30 shadow-lg hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5"
          >
            Register Account
          </button>
        </div>
        
        <div class="text-center mt-4">
          <p class="text-sm text-slate-600">
            Already have an account? 
            <router-link to="/login" class="font-bold text-brand-600 hover:text-brand-800 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
