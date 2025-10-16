<script setup>
import { ref, onMounted } from 'vue'
import { XMarkIcon, BookmarkIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'load-template', 'show-toast'])

const templates = ref([])
const templateName = ref('')
const showSaveForm = ref(false)
const showDeleteConfirm = ref(false)
const showSaveSuccess = ref(false)
const showNameError = ref(false)
const templateToDelete = ref(null)

onMounted(() => {
  loadTemplates()
})

function loadTemplates() {
  try {
    const saved = localStorage.getItem('quoteTemplates')
    templates.value = saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('載入範本失敗:', error)
    templates.value = []
  }
}

function saveTemplate() {
  if (!templateName.value.trim()) {
    showNameError.value = true
    return
  }
  
  const template = {
    id: crypto.randomUUID(),
    name: templateName.value.trim(),
    company: props.currentData.company,
    items: props.currentData.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total
    })),
    notes: props.currentData.notes,
    createdAt: new Date().toISOString()
  }
  
  templates.value.push(template)
  saveToStorage()
  
  templateName.value = ''
  showSaveForm.value = false
  showSaveSuccess.value = true
}

function confirmDeleteTemplate(template) {
  templateToDelete.value = template
  showDeleteConfirm.value = true
}

function deleteTemplate() {
  if (templateToDelete.value) {
    templates.value = templates.value.filter(t => t.id !== templateToDelete.value.id)
    saveToStorage()
    emit('show-toast', 'success', '範本已刪除')
    templateToDelete.value = null
  }
}

function loadTemplate(template) {
  emit('load-template', template)
  emit('close')
}

function saveToStorage() {
  try {
    localStorage.setItem('quoteTemplates', JSON.stringify(templates.value))
  } catch (error) {
    console.error('儲存範本失敗:', error)
    alert('儲存失敗，請檢查儲存空間')
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-TW')
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
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">報價範本管理</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Save New Template -->
          <div class="mb-6">
            <button
              v-if="!showSaveForm"
              @click="showSaveForm = true"
              class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <BookmarkIcon class="w-5 h-5" />
              <span>儲存目前報價單為範本</span>
            </button>
            
            <div v-else class="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <label class="block text-sm font-semibold text-gray-700 mb-2">範本名稱</label>
              <input
                v-model="templateName"
                type="text"
                placeholder="例如：標準服務報價"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                @keyup.enter="saveTemplate"
              />
              <div class="flex gap-3">
                <button
                  @click="showSaveForm = false; templateName = ''"
                  class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  取消
                </button>
                <button
                  @click="saveTemplate"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
          
          <!-- Templates List -->
          <div v-if="templates.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">已儲存的範本</h3>
            <div class="space-y-3">
              <div
                v-for="template in templates"
                :key="template.id"
                class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ template.name }}</h4>
                    <p class="text-sm text-gray-500">建立於 {{ formatDate(template.createdAt) }}</p>
                  </div>
                  <button
                    @click="confirmDeleteTemplate(template)"
                    class="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    title="刪除範本"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span class="text-sm text-gray-600">
                    {{ template.items.length }} 個項目
                  </span>
                  <button
                    @click="loadTemplate(template)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
                  >
                    載入範本
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <BookmarkIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">尚無儲存的範本</p>
            <p class="text-sm text-gray-400 mt-2">儲存常用的報價單作為範本，下次可快速套用</p>
          </div>
        </div>
      </div>
      
      <!-- Confirm Dialogs -->
      <ConfirmDialog
        :show="showDeleteConfirm"
        title="確認刪除範本"
        :message="`確定要刪除「${templateToDelete?.name}」範本嗎？此操作無法復原。`"
        type="danger"
        confirm-text="刪除"
        cancel-text="取消"
        @confirm="deleteTemplate"
        @close="showDeleteConfirm = false"
      />
      
      <ConfirmDialog
        :show="showSaveSuccess"
        title="儲存成功"
        message="範本已成功儲存！"
        type="success"
        confirm-text="確定"
        @confirm="showSaveSuccess = false"
        @close="showSaveSuccess = false"
      />
      
      <ConfirmDialog
        :show="showNameError"
        title="請輸入範本名稱"
        message="範本名稱不能為空，請輸入一個有意義的名稱。"
        type="warning"
        confirm-text="確定"
        @confirm="showNameError = false"
        @close="showNameError = false"
      />
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
