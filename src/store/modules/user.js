import { getToken, setToken, removeToken, setTimeStamp, removeTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from "@/api/user";
const state = {
  // vuex 持久化
  // 持久化的目的是一刷新 Token 还在，仍然保持登录状态，一直刷新从 cookie 获取 token
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    // vuex 变化 => 缓存数据
    setToken(token)
    // vuex 和缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除 vuex 的 token
    removeToken() // 先清除 vuex 再清除缓存 vuex 和缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const result = await login(data)
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 存时间戳
    setTimeStamp()
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo()  // 获取返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    return baseResult
  },
  // 登出的action
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    removeTimeStamp()
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  // getters
}