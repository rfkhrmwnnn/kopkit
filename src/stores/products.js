import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
  const categories = ref(['All', 'Makanan', 'Minuman', 'ATK', 'Seragam'])
  const products = ref([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      price: 15000,
      category: 'Makanan',
      description: 'Nasi goreng dengan telur, ayam, dan kerupuk.',
      image: 'https://placehold.co/400x400/orange/white?text=Nasi+Goreng'
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      price: 3000,
      category: 'Minuman',
      description: 'Es teh manis segar penghilang dahaga.',
      image: 'https://placehold.co/400x400/brown/white?text=Es+Teh'
    },
    {
      id: 3,
      name: 'Pensil 2B',
      price: 2000,
      category: 'ATK',
      description: 'Pensil 2B berkualitas tinggi untuk ujian.',
      image: 'https://placehold.co/400x400/gray/white?text=Pensil+2B'
    },
    {
      id: 4,
      name: 'Buku Tulis 58 Lembar',
      price: 4000,
      category: 'ATK',
      description: 'Buku tulis sidu 58 lembar.',
      image: 'https://placehold.co/400x400/blue/white?text=Buku+Tulis'
    },
    {
      id: 5,
      name: 'Kopi Hitam',
      price: 5000,
      category: 'Minuman',
      description: 'Kopi hitam kapal api.',
      image: 'https://placehold.co/400x400/black/white?text=Kopi'
    },
    {
      id: 6,
      name: 'Roti Bakar',
      price: 12000,
      category: 'Makanan',
      description: 'Roti bakar coklat keju.',
      image: 'https://placehold.co/400x400/yellow/white?text=Roti+Bakar'
    },
    {
      id: 7,
      name: 'Seragam Batik',
      price: 85000,
      category: 'Seragam',
      description: 'Seragam batik identitas koperasi.',
      image: 'https://placehold.co/400x400/purple/white?text=Batik'
    },
  ])

  const searchQuery = ref('')
  const selectedCategory = ref('All')

  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
  })

  function addProduct(product) {
    const newId = products.value.length > 0 ? Math.max(...products.value.map(p => p.id)) + 1 : 1
    products.value.push({ ...product, id: newId })
  }

  function removeProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
  }
  function updateProduct(updatedProduct) {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = { ...updatedProduct }
    }
  }

  // --- Likes Functionality ---
  const getLikedProducts = (username) => {
    return JSON.parse(localStorage.getItem(`liked_products_${username}`) || '[]')
  }

  const isLiked = (username, productId) => {
    if (!username) return false
    const liked = getLikedProducts(username)
    return liked.includes(productId)
  }

  const toggleLike = (username, productId) => {
    if (!username) return
    let liked = getLikedProducts(username)
    if (liked.includes(productId)) {
      liked = liked.filter(id => id !== productId)
    } else {
      liked.push(productId)
    }
    localStorage.setItem(`liked_products_${username}`, JSON.stringify(liked))
    // Trigger reactivity if needed, but for now direct localStorage read in components or forced refresh might be needed
    // Better way: use a reactive ref map or let components handle it. 
    // For simplicity with Pinia: we can expose a reactive Set or Array if we want global state. 
    // But since it's user specific, passing username is key.
  }

  return { products, categories, searchQuery, selectedCategory, filteredProducts, addProduct, removeProduct, updateProduct, isLiked, toggleLike }
})
