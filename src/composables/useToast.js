import { ref } from 'vue'

const toastState = ref({
  show: false,
  type: 'success',
  message: ''
})

export function useToast() {
  function showToast(type, message) {
    toastState.value = {
      show: true,
      type,
      message
    }
  }

  function showSuccess(message) {
    showToast('success', message)
  }

  function showError(message) {
    showToast('error', message)
  }

  function closeToast() {
    toastState.value.show = false
  }

  return {
    toastState,
    showSuccess,
    showError,
    closeToast
  }
}
