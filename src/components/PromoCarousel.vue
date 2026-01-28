<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { id: 1, image: 'https://placehold.co/800x300/1e293b/white?text=Promo+Spesial+Hari+Ini', title: 'Diskon 50%' },
  { id: 2, image: 'https://placehold.co/800x300/3b82f6/white?text=Beli+Makanan+Gratis+Minum', title: 'Paket Hemat' },
  { id: 3, image: 'https://placehold.co/800x300/0ea5e9/white?text=Perlengkapan+Sekolah+Lengkap', title: 'Back to School' },
]

const currentSlide = ref(0)
let interval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const startAutoSlide = () => {
  interval = setInterval(nextSlide, 4000)
}

const stopAutoSlide = () => {
  clearInterval(interval)
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-xl shadow-lg group" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
    <div 
      class="flex transition-transform duration-700 ease-in-out" 
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <div v-for="slide in slides" :key="slide.id" class="w-full flex-shrink-0 relative">
        <img :src="slide.image" class="w-full h-48 md:h-64 object-cover" :alt="slide.title" />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 class="text-white text-xl font-bold">{{ slide.title }}</h3>
        </div>
      </div>
    </div>
    
    <!-- Indicators -->
    <div class="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
      <button 
        v-for="(slide, index) in slides" 
        :key="index"
        @click="currentSlide = index"
        class="w-2 h-2 rounded-full transition-all"
        :class="currentSlide === index ? 'bg-white w-4' : 'bg-white/50'"
      ></button>
    </div>
  </div>
</template>
