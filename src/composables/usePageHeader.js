import { ref, shallowRef } from 'vue'

const title = ref('')
const subtitle = ref('')
const appendComponent = shallowRef(null)
const appendProps = ref({})

export function usePageHeader() {
  const setPageHeader = (newTitle, newSubtitle = '') => {
    title.value = newTitle
    subtitle.value = newSubtitle
  }

  const clearPageHeader = () => {
    title.value = ''
    subtitle.value = ''
  }

  const setHeaderAppend = (component, props = {}) => {
    appendComponent.value = component
    appendProps.value = props
  }

  const clearHeaderAppend = () => {
    appendComponent.value = null
    appendProps.value = {}
  }

  return {
    title,
    subtitle,
    appendComponent,
    appendProps,
    setPageHeader,
    clearPageHeader,
    setHeaderAppend,
    clearHeaderAppend
  }
}
