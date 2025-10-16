<script setup>
import { ref, watch } from 'vue'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success', // 'success' or 'error'
    validator: (value) => ['success', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    if (props.duration > 0) {
      setTimeout(() => {
        close()
      }, props.duration)
    }
  }
})

function close() {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for animation to complete
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm w-full sm:w-96"
    >
      <div
        :class="[
          'rounded-2xl shadow-2xl border-2 p-5 backdrop-blur-sm',
          type === 'success' 
            ? 'bg-green-50/95 border-green-200' 
            : 'bg-red-50/95 border-red-200'
        ]"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              type === 'success' ? 'bg-green-100' : 'bg-red-100'
            ]"
          >
            <CheckCircleIcon
              v-if="type === 'success'"
              class="w-6 h-6 text-green-600"
            />
            <XCircleIcon
              v-else
              class="w-6 h-6 text-red-600"
            />
          </div>
          
          <!-- Content -->
          <div class="flex-1 pt-0.5">
            <h3
              :class="[
                'text-base font-semibold mb-1',
                type === 'success' ? 'text-green-900' : 'text-red-900'
              ]"
            >
              {{ type === 'success' ? '操作成功' : '操作失敗' }}
            </h3>
            <p
              :class="[
                'text-sm',
                type === 'success' ? 'text-green-700' : 'text-red-700'
              ]"
            >
              {{ message }}
            </p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="close"
            :class="[
              'flex-shrink-0 rounded-lg p-1.5 transition-colors',
              type === 'success' 
                ? 'text-green-600 hover:bg-green-100' 
                : 'text-red-600 hover:bg-red-100'
            ]"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
