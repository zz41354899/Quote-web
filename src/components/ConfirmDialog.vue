<script setup>
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '確認操作'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'success', 'danger'
    validator: (value) => ['warning', 'success', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: '確認'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

function handleConfirm() {
  emit('confirm')
  emit('close')
}

function handleCancel() {
  emit('cancel')
  emit('close')
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
      @click.self="handleCancel"
    >
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="show"
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <!-- Icon -->
          <div class="flex items-center justify-center mb-4">
            <div
              :class="[
                'w-16 h-16 rounded-full flex items-center justify-center',
                type === 'warning' ? 'bg-amber-100' : '',
                type === 'success' ? 'bg-green-100' : '',
                type === 'danger' ? 'bg-red-100' : ''
              ]"
            >
              <ExclamationTriangleIcon
                v-if="type === 'warning'"
                class="w-8 h-8 text-amber-600"
              />
              <CheckCircleIcon
                v-else-if="type === 'success'"
                class="w-8 h-8 text-green-600"
              />
              <ExclamationTriangleIcon
                v-else
                class="w-8 h-8 text-red-600"
              />
            </div>
          </div>
          
          <!-- Content -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ message }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[
                'flex-1 px-6 py-3 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl',
                type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' : '',
                type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
                type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
