<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = () => {
  if (auth.login(username.value, password.value)) {
    if (username.value === 'admin') {
      router.push('/admin')
    } else {
      router.push('/home')
    }
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-100 px-4 relative overflow-hidden">
    <!-- Decorative Blobs -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
    <div class="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>

    <div class="max-w-md w-full space-y-8 glass p-8 rounded-3xl relative z-10 animate-scale-in">
      <div class="text-center animate-slide-up">
        <!-- Monochrome Logo -->
        <h1 class="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 uppercase">
          Kopkit
        </h1>
        <h2 class="mt-6 text-3xl font-bold text-slate-800">Welcome Back</h2>
        <p class="mt-2 text-sm text-slate-500">
          Sign in to your cooperative account
        </p>
      </div>
      
      <form class="mt-8 space-y-6 animate-slide-up" style="animation-delay: 100ms;" @submit.prevent="handleLogin">
        <div class="rounded-md space-y-4">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 bg-white/50 focus:bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 bg-white/50 focus:bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg animate-bounce-soft">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-brand-500/30 shadow-lg hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </div>
        
        <div class="text-center mt-4">
          <router-link to="/register" class="text-brand-600 hover:text-brand-800 font-bold transition-colors">
            Don't have an account? Register
          </router-link>
        </div>
      </form>
      
      <div class="mt-6 border-t border-slate-200 pt-4 animate-slide-up" style="animation-delay: 200ms;">
        <p class="text-xs text-center text-slate-400">
          Demo: demo / demo123 <br>
          Admin: admin / kopkit123
        </p>
      </div>
    </div>
  </div>
</template>
