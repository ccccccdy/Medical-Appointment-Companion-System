import axios from 'axios'
import { showToast } from 'vant'
// 函数式组件需要显式引入样式；模板中使用的 Vant 组件由 VantResolver 自动按需引入
import 'vant/es/toast/style'

// 通用请求地址前缀：优先读环境变量，未配置时回退到默认服务地址
const baseURL = import.meta.env.VITE_API_BASE || 'https://v3pz.itndedu.com/v3pz'

const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: { terminal: 'h5' },
})

// 不需要携带 token 的接口
const whiteUrl = ['/login']

// 保证「登录失效」只处理一次，避免并发请求同时触发多次跳转
let isRedirecting = false

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 去掉 query 后再匹配，避免 /login?redirect=xxx 这类地址判错
    const url = (config.url || '').split('?')[0]
    const token = localStorage.getItem('h5_token')
    if (token && !whiteUrl.includes(url)) {
      config.headers['h-token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { code, message } = response.data || {}
    // 业务异常统一提示
    if (code === -1) {
      showToast(message || '操作失败')
    }
    // 登录态失效：清理本地缓存并整页重载（Vuex、路由等内存状态一并重置）
    if (code === -2 && !isRedirecting) {
      isRedirecting = true
      localStorage.removeItem('h5_token')
      localStorage.removeItem('h5_userInfo')
      window.location.replace(window.location.origin)
    }
    return response
  },
  (error) => {
    const isTimeout = error.code === 'ECONNABORTED'
    showToast(isTimeout ? '请求超时，请稍后重试' : '网络异常，请检查网络后重试')
    return Promise.reject(error)
  }
)

export default http
