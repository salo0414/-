import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'


//创建axios实例
const service = axios.create({
    baseURL: '/api',//请求的前缀
    timeout: 5000//超时时间
})

// 防止并发请求同时触发多次“登录过期”跳转
let isRedirectingToLogin = false

//请求拦截器
service.interceptors.request.use(
    // 在发送请求之前做些什么
    // 例如：添加 token 到请求头
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    // 对请求错误做些什么
    error => {
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    // 对响应数据做点什么
    (response) => {
        const{data,config} = response
        // 该后端用 code + success 标识结果，成功码可能是 "200" 或 "SUCCESS"，统一转字符串判断
        const code = String(data.code)
        const isSuccess = data.success === true || code === '200' || code === 'SUCCESS'
        // 成功：返回业务数据，页面无需再 .data.data
        if (isSuccess) {
            return data.data !== undefined ? data.data : data
        }
        // -1 登录过期：清空本地登录信息并回到登录页（登录接口本身不跳转，避免死循环）
        if (code === '-1') {
            ElMessage.error(data.msg || '登录过期，请重新登录')
            if (!config.url.includes('/login')) {
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                window.location.href = '/auth/login'
            }
            return Promise.reject(new Error(data.msg || '登录过期，请重新登录'))
        }
        // 其他业务错误码：提示并抛出，交给调用方的 catch 处理
        const message = data.msg || data.message || '请求失败'
        ElMessage.error(message)
        return Promise.reject(new Error(message))
    },
    // 对响应错误做点什么
    error => {
        // 后端对 token 缺失/失效统一返回 403（无响应体）：清空登录信息并回到登录页，
        // 否则页面只会静默变空，看不出是登录状态问题
        const status = error.response?.status
        const isLoginRequest = error.config?.url?.includes('/user/login')
        if ((status === 401 || status === 403) && !isLoginRequest && !isRedirectingToLogin) {
            isRedirectingToLogin = true
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            if (!window.location.pathname.startsWith('/auth/login')) {
                ElMessage.error('登录已过期，请重新登录')
                window.location.href = '/auth/login'
            }
        }
        return Promise.reject(error)
    }
)

// 导出axios实例
export default service