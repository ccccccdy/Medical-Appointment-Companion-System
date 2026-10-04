import axios from 'axios'
import { ElMessage } from 'element-plus'

// 通用请求的地址前缀：优先读环境变量，未配置时回退到默认服务地址
const baseURL = import.meta.env.VITE_API_BASE || 'https://v3pz.itndedu.com/v3pz'

const http = axios.create({
    baseURL,
    timeout: 10000, // 超时时间
})

// 不需要添加 token 的接口
const whiteUrl = ['/login', '/get/code', '/user/authentication']

// 保证「登录失效」只处理一次，避免并发请求同时触发多次跳转
let isRedirecting = false

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 去掉 query 后再匹配白名单，避免 /login?redirect=xxx 这类地址判错
    const url = (config.url || '').split('?')[0]
    const token = localStorage.getItem('pz_token')
    if (token && !whiteUrl.includes(url)) {
      config.headers['x-token'] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    const { code, message } = response.data || {}
    // 对于接口返回异常的数据，给用户一点提示
    if (code === -1) {
      ElMessage.warning(message)
    }
    // 登录态失效：清理本地缓存并整页重载（动态路由等内存状态一并重置）
    if (code === -2 && !isRedirecting) {
      isRedirecting = true
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('pz_v3pz')
      window.location.replace(window.location.origin)
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    const isTimeout = error.code === 'ECONNABORTED'
    ElMessage.error(isTimeout ? '请求超时，请稍后重试' : '网络异常，请检查！')
    return Promise.reject(error);
  });

export default http
