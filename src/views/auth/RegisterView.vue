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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div class="text-center">
        <!-- Brand -->
        <h1 class="text-4xl font-black tracking-widest text-slate-900 uppercase">
          Kopkit
        </h1>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Join our cooperative community
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              required
              class="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Choose a username"
            />
          </div>
          
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              v-model="address"
              id="address"
              name="address"
              rows="2"
              required
              class="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Enter your full address"
            ></textarea>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Create a password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Register Account
          </button>
        </div>
        
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Already have an account? 
            <router-link to="/login" class="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
