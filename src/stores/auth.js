import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const router = useRouter()

  function login(username, password) {
    if (username === 'admin' && password === 'kopkit123') {
      user.value = { username: 'admin', role: 'admin', address: 'Kantor Pusat' }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } else if (username === 'demo' && password === 'demo123') {
      user.value = { username: 'demo', role: 'user', address: 'Jl. Contoh No. 123' }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    // We can't access router directly inside store setup easily without injection context sometimes, 
    // but usually calling it from component is better.
    // For now, we update state.
  }

  function updateAddress(newAddress) {
    if (user.value) {
      user.value.address = newAddress
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return { user, login, logout, updateAddress }
})
