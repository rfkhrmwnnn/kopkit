import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // Store Info
  const storeName = ref('Kopkit - Koperasi Kita')
  const adminEmail = ref('admin@kopkit.com')
  const maintenanceMode = ref(false)

  // Payment Methods
  const paymentMethods = ref([
    { id: 'cash', name: 'Cash on Delivery (COD)', enabled: true },
    { id: 'transfer', name: 'Bank Transfer (BCA)', enabled: true },
    { id: 'qris', name: 'QRIS', enabled: true },
  ])

  // Shipping Methods
  const shippingMethods = ref([
    { id: 'regular', name: 'Regular (JNE/J&T)', price: 10000, enabled: true },
    { id: 'express', name: 'Instant (Gojek/Grab)', price: 25000, enabled: true },
    { id: 'pickup', name: 'Ambil Sendiri', price: 0, enabled: true },
  ])

  function togglePaymentMethod(id) {
    const method = paymentMethods.value.find(m => m.id === id)
    if (method) method.enabled = !method.enabled
  }

  function toggleShippingMethod(id) {
    const method = shippingMethods.value.find(m => m.id === id)
    if (method) method.enabled = !method.enabled
  }

  function updateShippingPrice(id, newPrice) {
    const method = shippingMethods.value.find(m => m.id === id)
    if (method) method.price = newPrice
  }

  return { 
    storeName, adminEmail, maintenanceMode,
    paymentMethods, shippingMethods,
    togglePaymentMethod, toggleShippingMethod, updateShippingPrice
  }
})
