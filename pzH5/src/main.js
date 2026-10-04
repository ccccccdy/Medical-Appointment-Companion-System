import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './api/index.js'

const app = createApp(App)

//在实例上绑定api属性
app.config.globalProperties.$api = api

router.beforeEach((to, from) => {
    const token = localStorage.getItem('h5_token')
    // 未登录只能进入登录页
    if( to.path !== '/login' && !token ){
        return '/login'
    }
    // 已登录不再停留在登录页
    if( to.path === '/login' && token ){
        return '/home'
    }
})
//路由挂载
app.use(router)
app.mount('#app')
