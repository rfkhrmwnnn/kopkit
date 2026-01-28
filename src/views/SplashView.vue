<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/login')
  }, 2000)
})
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-brand-900 text-white z-50">
    <div class="text-center animate-fade-in">
      <h1 class="text-6xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
        Kopkit
      </h1>
      <p class="mt-4 text-slate-400 text-lg">Koperasi Kita Digital</p>
    </div>
  </div>
</template>

<style scoped>
/* Keyframes handled in tailwind config or arbitrary values */
</style>
