<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in tabbarList"
      :key="item.path"
      :icon="item.meta.icon"
      :to="`/${item.path}`"
    >
      {{ item.meta.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 底部 tab 直接复用路由表的子路由，避免两处维护
const tabbarList = computed(() => router.options.routes[0].children)

const active = ref(0)

const syncActive = (path) => {
  const index = tabbarList.value.findIndex((item) => `/${item.path}` === path)
  // 详情页等非 tab 页面保持原有高亮
  if (index > -1) active.value = index
}

// 用路由驱动高亮：刷新、前进后退、编程式跳转都能同步
watch(() => route.path, syncActive, { immediate: true })
</script>
