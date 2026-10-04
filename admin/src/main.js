import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import store from './store'
import 'element-plus/theme-chalk/el-message.css'
import PanelHead from './components/panelHead.vue'

//刷新后的动态路由添加
try {
  const localData = localStorage.getItem('pz_v3pz')
  const routerList = localData ? JSON.parse(localData).menu.routerList : []
  if (routerList && routerList.length) {
    // 必须重新执行一次 dynamicMenu：组件（函数）无法被 JSON 持久化，刷新后会丢
    store.commit('dynamicMenu', routerList)
    store.state.menu.routerList.forEach(item => {
      router.addRoute('main', item)
    })
  }
} catch (e) {
  console.warn('[route] 本地菜单缓存解析失败，已忽略：', e)
}

router.beforeEach((to,from) => {
  const token = localStorage.getItem('pz_token')
  if(!token && to.path !== '/login'){
    return '/login'
  }
  else if(token && to.path ==='/login'){
    return '/'
  }
  else{
    return true
  }
})



import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('PanelHead',PanelHead)

//路由挂载
app.use(router)
//store挂载
app.use(store)
app.mount('#app')
