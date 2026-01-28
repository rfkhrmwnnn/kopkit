import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function addToCart(product) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(id) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(id)
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }
})
