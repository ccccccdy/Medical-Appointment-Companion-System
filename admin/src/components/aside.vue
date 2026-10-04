<template>
  <el-menu
      :style="{ width: !isCollapse ? '230px' : '64px' }"
      active-text-color="#ffd04b"
      background-color="rgb(59, 130, 246)"
      class="aside-container"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :default-active="active"
    >
    <p class="logo-lg">{{ !isCollapse ? 'DIDI陪诊' : 'DIDI'}}</p>
    <TreeMenu :menuData="menuData" :index="1"/>
  </el-menu> 
</template>

<script setup>
import TreeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { reactive,computed } from 'vue'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
// const menuData = reactive(router.options.routes[0].children)
const menuData = computed(() => store.state.menu.routerList)
const isCollapse = computed(() => store.state.menu.isCollapse)

const active = computed(() => store.state.menu.menuActive)

const handleOpen = () => {}
const handleClose = () => {}
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>