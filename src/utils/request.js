import axios from "axios"
import store from "@/store";
import { Message } from "element-ui";
import { getTimeStamp } from '@/utils/auth'
import router from "@/router";

const TimeOut = 10 // 定义超时时间
function isCheck() {
  const currentTime = Date.now()
  const time = getTimeStamp()
  return currentTime - time > TimeOut * 1000
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(async config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    if (isCheck()) {
      await store.dispatch('user/logout')
      //
      router.push('/login')
      return Promise.reject(new Error('Token 过期啦！'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
  return Promise.reject(error)
})


export default service