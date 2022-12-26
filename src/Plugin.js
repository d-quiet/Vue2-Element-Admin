const myPlugin = {
    // 全局方法
    install: function (Vue, options) {
        Vue.fn = function () {
            console.log(11111)
        }

        // 添加全局资源
        Vue.directive('permission', {
            inserted(el, binding, vnode, oldVnode) {
                const roles = ['viewer']
                const permission = binding.value
                const hasPermission = permission.some(item => {
                    if (roles.includes(item)) {
                        return true
                    }
                })
                if (!hasPermission) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
        })


        // 挂载在实例上
        Vue.prototype.$messageMe = function (msg) {
            alert(msg || '2222222')
        }
    }
}
export default myPlugin