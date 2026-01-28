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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div class="text-center">
        <!-- Monochrome Logo -->
        <h1 class="text-4xl font-black tracking-widest text-slate-900 uppercase">
          Kopkit
        </h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to your cooperative account
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm transition-all"
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
              class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm transition-all"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </div>
        
        <div class="text-center mt-4">
          <router-link to="/register" class="text-brand-600 hover:text-brand-500 font-medium">
            Don't have an account? Register (Disabled for Demo)
          </router-link>
        </div>
      </form>
      
      <div class="mt-6 border-t pt-4">
        <p class="text-xs text-center text-gray-400">
          Demo: demo / demo123 <br>
          Admin: admin / kopkit123
        </p>
      </div>
    </div>
  </div>
</template>
