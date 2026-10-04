<template>
  <div class="not-found">
    <p class="code">404</p>
    <p class="text">页面不存在，或当前账号没有访问权限</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
</script>

<style lang="less" scoped>
.not-found {
  padding: 80px 0;
  text-align: center;
  background-color: #fff;
  .code {
    font-size: 60px;
    font-weight: bold;
    color: #409eff;
  }
  .text {
    margin: 15px 0 25px;
    color: #999999;
  }
}
</style>
