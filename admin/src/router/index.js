import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
// 说明：业务页面由后端下发的权限菜单驱动，通过 import.meta.glob 懒加载，
// 这里不再静态引入，避免把未使用的页面打进首屏包


const routes = [
    {
        path:'/',
        component: Layout,
        name:'main',
        redirect: () => {
            // 动态菜单缓存缺失时无法确定首页，清掉可能已失效的登录态后回登录页
            const toLogin = () => {
                localStorage.removeItem('pz_token')
                return '/login'
            }
            try {
                const localData = localStorage.getItem('pz_v3pz')
                const routerList = localData ? JSON.parse(localData).menu.routerList : []
                if(!routerList.length) return toLogin()
                //有子菜单的情况
                const child = routerList[0].children
                return child && child.length ? child[0].meta.path : routerList[0].meta.path
            }
            catch {
                return toLogin()
            }
        },
        children: [
            ]
      },
      {
        path: '/login',
        component: Login
      },
      // 兜底路由：不在动态菜单里的地址统一走 404，避免白屏
      {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/error/404.vue')
      },
]

const router = createRouter({
    routes,
    //路由匹配模式：Hash模式
    history: createWebHashHistory()
})

export default router