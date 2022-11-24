import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'

// next() 放行  next(false) 中断  next(地址) 跳转地址
// 前置路由首位
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // 有 Token 才能获取资料
    if (store.getters.token) {
        if (!store.getters.name) {
            // 加判断，如果已经获取就不再获取
            await store.dispatch('user/getUserInfo')
        }
        if (to.path === '/login') {
            // next(当前页) 不会触发 afterEach
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next({ path: '/login' })
        }
    }
    NProgress.done()
})
// 后置路由守卫，跳转后
router.afterEach(() => {
    NProgress.done()
})