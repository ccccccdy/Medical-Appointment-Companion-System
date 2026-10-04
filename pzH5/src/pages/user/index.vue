<template>
    <div class="container">
        <div class="user">
            <van-image :src="userInfo.avatar" width="100" height="100"/>
            <div class="text">{{ userInfo.name }}</div>
        </div>
        <div class="order">
            <div class="top">
                <div class="text1">我的订单</div>
                <div class="text2">全部</div>
            </div>
            <div class="button">
                <div class="item">
                    <van-image 
                        width="40"
                        height="40"
                        src="../../../public/images/od_10.png"
                        @click="goOrder(1)"
                    />
                    <div>待支付</div>
                </div>
                <div class="item">
                    <van-image 
                        width="40"
                        height="40"
                        src="../../../public/images/od_20.png"
                        @click="goOrder(2)"
                    />
                    <div>待服务</div>
                </div>
                <div class="item">
                    <van-image 
                        width="40"
                        height="40"
                        src="../../../public/images/od_30.png"
                        @click="goOrder(3)"
                    />
                    <div>已完成</div>
                </div>
                <div class="item">
                    <van-image 
                        width="40"
                        height="40"
                        src="../../../public/images/od_40.png"
                        @click="goOrder(4)"
                    />
                    <div>已取消</div>
                </div>
            </div>
        </div>
        <div class="foot">
            <div class="foot1">
                <div class="text1">
                    <van-image 
                        width="20"
                        height="20"
                        src="../../../public/images/ic_clients.png"
                    />
                    服务对象管理
                </div>
                <div class="text2">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="foot2">
                <div class="text1">
                    <van-image 
                        width="20"
                        height="20"
                        src="../../../public/images/ic_share.png"
                    />
                    分享转发
                </div>
                <div class="text2">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
        <van-button @click="show = true" type="danger" class="quit" size="large" >退出登陆</van-button>
        <van-dialog 
                v-model:show="show"
                title="提示"
                @cancel="show = false"
                @confirm="logout"
                show-cancel-button
        >
            <div class="quit_text">是否确认退出登陆</div>
        </van-dialog>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { safeParseJSON } from '../../utils/format'

const router = useRouter()
// 本地缓存可能缺失或被写坏，解析失败时降级为空对象，避免整页报错
const userInfo = computed(() => safeParseJSON(localStorage.getItem('h5_userInfo'), {}) || {})

//跳转按钮
const goOrder = (active) => {
    router.push(`/order?active=${active}`)
}

//点击登出弹窗
const show = ref(false)
const logout = () => {
    localStorage.removeItem('h5_token')
    localStorage.removeItem('h5_userInfo')
    router.push('/login')
}
</script>
<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
    overflow: hidden;
    .user {
      width: 95%;
      height: 200px;
      background-color: #fff;
      text-align: center;
      border-radius: 10px;
      margin: 10px;
      .img {
        margin-top: 30px;
      }
      .text {
        line-height: 30px;
        font-weight: bold;
      }
    }
    .order {
      width: 90%;
      margin: 10px;
      border-radius: 5px;
      background-color: #fff;
      padding: 10px;
      .top {
        margin: 10px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        .text1 {
          color: #333;
        }
        .text2 {
          color: #999;
        }
        border-bottom: 0.5px solid #f5f5f5;
      }
      .button {
        padding: 10px;
        display: flex;
        justify-content: space-around;
        .item {
          font-size: 14px;
          color: #999;
        }
      }
    }
    .foot {
      margin: 0 10px;
      padding: 10px;
      line-height: 50px;
      background-color: #fff;
      .foot1,
      .foot2 {
        display: flex;
        justify-content: space-between;
        color: #555;
      }
      .foot1 {
        border-bottom: 0.5px solid #f5f5f5;
      }
    }
    .quit {
      width: 90%;
      margin: 20px;
    }
    .quit_text {
      margin: 20px 0;
      text-align: center;
    }
  }
</style>