<template>
  {{ formater }}
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatCountdown } from '../utils/format'

const props = defineProps({
  // 剩余时间（毫秒），由父组件传入
  second: {
    type: Number,
    default: 0,
  },
  suffix: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['counterOver'])

// 倒计时展示文案
const formater = ref('')
let timer = null
// 记录截止时间戳：每秒用 Date.now() 反算剩余时间，
// 避免定时器被浏览器降频（切后台）后越走越偏
let deadline = 0
let finished = false

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const render = () => {
  const rest = deadline - Date.now()
  if (rest <= 0) {
    formater.value = formatCountdown(0) + props.suffix
    stopTimer()
    if (!finished) {
      finished = true
      emit('counterOver')
    }
    return
  }
  formater.value = formatCountdown(rest) + props.suffix
}

const start = (second) => {
  stopTimer()
  finished = false
  deadline = Date.now() + Math.max(0, Number(second) || 0)
  render()
  if (!finished) {
    timer = setInterval(render, 1000)
  }
}

onMounted(() => start(props.second))

// 父组件重新拉取数据后需要重新计时
watch(
  () => props.second,
  (val) => start(val)
)

// 组件卸载必须清理定时器，否则会持续执行并造成内存泄漏
onBeforeUnmount(stopTimer)
</script>

<style></style>
