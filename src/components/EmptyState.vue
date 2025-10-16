<script setup>
import { DocumentIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineEmits(['add-item'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md w-full text-center hover:shadow-xl transition-all animate-slide-up">
      <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
        <DocumentIcon class="w-10 h-10 text-gray-500" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">開始建立報價單</h2>
      <p class="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
        點擊下方按鈕新增第一個報價項目，開始建立您的專業報價單
      </p>
      <button
        @click="$emit('add-item')"
        class="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
      >
        <PlusIcon class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span>新增第一個項目</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
