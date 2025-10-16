<script setup>
import { ArrowDownTrayIcon, TableCellsIcon } from '@heroicons/vue/24/outline'

defineEmits(['export-pdf', 'export-csv'])
</script>

<template>
  <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">匯出報價單</h2>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>選擇格式匯出</span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- PDF Button - Primary -->
      <button
        @click="$emit('export-pdf')"
        class="group relative flex flex-col items-center justify-center gap-3 px-8 py-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
      >
        <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
        <ArrowDownTrayIcon class="w-8 h-8 group-hover:scale-110 transition-transform" />
        <div class="text-center">
          <div class="text-lg">匯出 PDF</div>
          <div class="text-xs opacity-90 mt-1">專業報價單格式</div>
        </div>
      </button>
      
      <!-- CSV Button - Secondary -->
      <button
        @click="$emit('export-csv')"
        class="group relative flex flex-col items-center justify-center gap-3 px-8 py-6 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-100"
      >
        <TableCellsIcon class="w-8 h-8 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
        <div class="text-center">
          <div class="text-lg group-hover:text-blue-600 transition-colors">匯出 CSV</div>
          <div class="text-xs text-gray-500 group-hover:text-blue-600 mt-1 transition-colors">資料表格格式</div>
        </div>
      </button>
    </div>
    
    <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-sm font-medium text-amber-900">匯出後資料將自動清除</p>
          <p class="text-xs text-amber-700 mt-1">請確認資料無誤後再進行匯出</p>
        </div>
      </div>
    </div>
  </div>
</template>
