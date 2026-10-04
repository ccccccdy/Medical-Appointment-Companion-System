<template>
    <h1>用户登陆</h1>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
                v-model="form.userName"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="form.passWord"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            </van-cell-group>
            <div class="btn">
                <van-button type="primary" round block native-type="submit">提交</van-button>
            </div>
    </van-form>
    
</template>
<script setup>
import { reactive,getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
//获取当前vue实例
const { proxy } = getCurrentInstance()

//表单数据
const form = reactive({
    userName:'',
    passWord:''
})
//表单提交
const onSubmit = async () => {
    const { data } = await proxy.$api.login(form)
    if(data.code === 10000) {
        localStorage.setItem('h5_token',data.data.token)
        localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))
        router.push('/home')
    }
    else {
        // 失败必须给出反馈，否则用户只会看到按钮没反应
        showNotify({ message: data.message || '登录失败，请检查账号密码' })
    }
}
</script>
<style lang="less" scoped>
    h1{
        text-align: center;
    }
    .btn{
        margin: 16px;
    }
</style>