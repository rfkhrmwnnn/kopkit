import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const router = useRouter()

  function login(username, password) {
    // Check Hardcoded
    if (username === 'admin' && password === 'kopkit123') {
      user.value = { username: 'admin', role: 'admin', address: 'Kantor Pusat' }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } else if (username === 'demo' && password === 'demo123') {
      user.value = { username: 'demo', role: 'user', address: 'Jl. Contoh No. 123' }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }

    // Check Registered Users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      user.value = { username: foundUser.username, role: 'user', address: foundUser.address }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }

    return false
  }

  function register(username, password, address) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // Check if exists
    if (registeredUsers.some(u => u.username === username) || username === 'admin' || username === 'demo') {
      return false // User exists
    }

    const newUser = { username, password, address, role: 'user' }
    registeredUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    
    // Auto login
    user.value = { username, role: 'user', address }
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  function updateAddress(newAddress) {
    if (user.value) {
      user.value.address = newAddress
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Update in registeredUsers if applicable
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const index = registeredUsers.findIndex(u => u.username === user.value.username)
      if (index !== -1) {
        registeredUsers[index].address = newAddress
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      }
    }
  }

  function updateProfile(data) {
    if (user.value) {
      // Update local state
      user.value = { ...user.value, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))

      // Update registeredUsers
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const index = registeredUsers.findIndex(u => u.username === user.value.username)
      if (index !== -1) {
        registeredUsers[index] = { ...registeredUsers[index], ...data }
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      }
    }
  }

  return { user, login, logout, register, updateAddress, updateProfile }
})
