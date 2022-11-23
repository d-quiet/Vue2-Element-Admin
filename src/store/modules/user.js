import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from "@/api/user";
const state = {
  // vuex 持久化
  // 持久化的目的是一刷新 Token 还在，仍然保持登录状态，一直刷新从 cookie 获取 token
  token: getToken()
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
  }
}

const actions = {
  async login(context, data) {
    const result = await login(data)
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  // getters
}