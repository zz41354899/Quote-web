<script setup>
import { ref } from 'vue'
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/vue/24/outline'
import Papa from 'papaparse'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'import'])

const fileInput = ref(null)
const dragActive = ref(false)

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event) {
  event.preventDefault()
  dragActive.value = false
  
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDragOver(event) {
  event.preventDefault()
  dragActive.value = true
}

function handleDragLeave() {
  dragActive.value = false
}

function processFile(file) {
  if (!file.name.endsWith('.csv')) {
    alert('請選擇 CSV 檔案')
    return
  }
  
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        const items = results.data.map(row => ({
          id: crypto.randomUUID(),
          description: row['品項名稱'] || row['description'] || '',
          quantity: parseInt(row['數量'] || row['quantity'] || 1),
          unitPrice: parseFloat(row['單價'] || row['unitPrice'] || 0),
          total: 0
        }))
        
        // Calculate totals
        items.forEach(item => {
          item.total = item.quantity * item.unitPrice
        })
        
        emit('import', items)
        emit('close')
      } catch (error) {
        console.error('CSV 解析錯誤:', error)
        alert('CSV 格式錯誤，請確認檔案格式')
      }
    },
    error: (error) => {
      console.error('CSV 讀取錯誤:', error)
      alert('無法讀取 CSV 檔案')
    }
  })
}

function triggerFileInput() {
  fileInput.value.click()
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-slide-up">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">批量匯入報價項目</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Description -->
        <p class="text-gray-600 mb-6">
          上傳 CSV 檔案快速匯入多個報價項目。CSV 檔案應包含以下欄位：
        </p>
        
        <!-- CSV Format -->
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <p class="text-sm font-mono text-gray-700">
            品項名稱,數量,單價<br>
            產品A,2,1000<br>
            產品B,1,500
          </p>
        </div>
        
        <!-- Drop Zone -->
        <div
          :class="[
            'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          ]"
          @click="triggerFileInput"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <DocumentArrowUpIcon class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p class="text-lg font-semibold text-gray-700 mb-2">
            點擊選擇檔案或拖曳到此處
          </p>
          <p class="text-sm text-gray-500">
            支援 CSV 格式
          </p>
        </div>
        
        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          class="hidden"
          @change="handleFileSelect"
        />
        
        <!-- Actions -->
        <div class="flex gap-3 mt-6">
          <button
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            取消
          </button>
          <button
            @click="triggerFileInput"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            選擇檔案
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
