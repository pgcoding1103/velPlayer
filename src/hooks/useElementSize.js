import { nextTick, ref } from 'vue'

const useElementSize = target => {
  const width = ref(0)
  const height = ref(0)
  const handleResize = () => {
    nextTick(() => {
      const el = document.querySelector(target)
      width.value = el.offsetWidth
      height.value = el.offsetHeight
    })
  }
  handleResize()
  window.addEventListener('resize', handleResize)
  return {
    width,
    height
  }
}

export default useElementSize
