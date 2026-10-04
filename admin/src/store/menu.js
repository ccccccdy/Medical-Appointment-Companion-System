// 菜单路径 -> 懒加载组件的映射，放在模块作用域，只执行一次
const modules = import.meta.glob('../views/**/*.vue')
// 菜单路径找不到对应组件时的兜底页面，避免挂载后白屏
const fallbackView = () => import('../views/error/404.vue')

// 本地缓存容错：缓存被写坏时退回默认值，不能让 store 初始化直接失败
const getLocalMenu = () => {
    try {
        const localData = localStorage.getItem('pz_v3pz')
        return localData ? JSON.parse(localData).menu : null
    } catch {
        return null
    }
}

const state = getLocalMenu() || {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1)
            state.selectMenu.push(payload)
    },
    closeMenu(state, payload) {
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        if (index > -1) state.selectMenu.splice(index, 1)
    },
    dynamicMenu(state, payload) {
        // 把后端下发的菜单数据中的 meta.path 映射成真实的懒加载组件
        function routerSet(routers) {
            routers.forEach(route => {
                // 没有子菜单，说明是最终页面，拼接组件路径
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    route.component = modules[url] || fallbackView
                    if (!modules[url]) {
                        console.warn(`[menu] 菜单路径没有对应组件：${url}`)
                    }
                }
                else {
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        // 拿到完整的路由数据
        state.routerList = payload
    },
    updateMenuActive(state, payload) {
        state.menuActive = payload
    }
}

export default {
    state,
    mutations
}
