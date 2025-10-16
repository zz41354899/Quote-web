<script setup>
import { computed, ref } from 'vue'
import { PlusIcon, TrashIcon, Bars3Icon } from '@heroicons/vue/24/outline'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-item', 'remove-item', 'update-total', 'reorder-items', 'show-import'])

const draggedItem = ref(null)
const draggedIndex = ref(null)

// Format number with thousand separators
function formatNumber(num) {
  return new Intl.NumberFormat('zh-TW').format(num)
}

// Handle quantity or unit price change
function handleValueChange(item) {
  emit('update-total', item)
}

// Computed total amount
const totalAmount = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

// Drag and drop handlers
function handleDragStart(event, item, index) {
  draggedItem.value = item
  draggedIndex.value = index
  event.target.style.opacity = '0.5'
}

function handleDragEnd(event) {
  event.target.style.opacity = '1'
  draggedItem.value = null
  draggedIndex.value = null
}

function handleDragOver(event) {
  event.preventDefault()
}

function handleDrop(event, targetIndex) {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    return
  }
  
  const newItems = [...props.items]
  const [removed] = newItems.splice(draggedIndex.value, 1)
  newItems.splice(targetIndex, 0, removed)
  
  emit('reorder-items', newItems)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 mb-6 hover:shadow-lg transition-all">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900">報價項目</h2>
      <div class="flex gap-3 w-full sm:w-auto">
        <button
          @click="$emit('show-import')"
          class="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>匯入</span>
        </button>
        <button
          @click="$emit('add-item')"
          class="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-100 font-medium"
        >
          <PlusIcon class="w-5 h-5" />
          <span>新增</span>
        </button>
      </div>
    </div>
    
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="w-10"></th>
            <th class="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">品項名稱</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">數量</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">單價</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">小計</th>
            <th class="w-12"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            draggable="true"
            @dragstart="handleDragStart($event, item, index)"
            @dragend="handleDragEnd"
            @dragover="handleDragOver"
            @drop="handleDrop($event, index)"
            class="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-move"
          >
            <td class="py-4 px-3 text-center">
              <Bars3Icon class="w-5 h-5 text-gray-400 mx-auto" />
            </td>
            <td class="py-4 px-3">
              <input
                v-model="item.description"
                type="text"
                placeholder="請輸入品項名稱"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3">
              <input
                v-model.number="item.quantity"
                type="number"
                min="0"
                step="1"
                @input="handleValueChange(item)"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3">
              <input
                v-model.number="item.unitPrice"
                type="number"
                min="0"
                step="1"
                @input="handleValueChange(item)"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3 text-right font-medium text-gray-900">
              {{ formatNumber(item.total) }}
            </td>
            <td class="py-4 px-3 text-center">
              <button
                @click="$emit('remove-item', item.id)"
                class="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="刪除項目"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Mobile Card View -->
    <div class="md:hidden space-y-5">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">品項名稱</label>
          <input
            v-model="item.description"
            type="text"
            placeholder="請輸入品項名稱"
            class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">數量</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="0"
              @input="handleValueChange(item)"
              class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">單價</label>
            <input
              v-model.number="item.unitPrice"
              type="number"
              min="0"
              @input="handleValueChange(item)"
              class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            />
          </div>
        </div>
        
        <div class="flex justify-between items-center py-4 px-4 bg-blue-50 border border-blue-200 rounded-xl mb-3">
          <span class="text-sm font-semibold text-blue-900">小計</span>
          <span class="text-xl font-bold text-blue-900">NT$ {{ formatNumber(item.total) }}</span>
        </div>
        
        <button
          @click="$emit('remove-item', item.id)"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all font-medium active:scale-95"
        >
          <TrashIcon class="w-5 h-5" />
          <span>刪除項目</span>
        </button>
      </div>
    </div>
    
    <!-- Total Amount -->
    <div class="mt-8 pt-6 border-t border-gray-100">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-600">總金額</span>
        <span class="text-2xl font-bold text-gray-900">NT$ {{ formatNumber(totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>
