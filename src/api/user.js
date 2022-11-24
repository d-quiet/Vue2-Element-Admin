import request from '@/utils/request'

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}

// 用户头像接口 
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

// 登录接口
export function login(data) {
    return request({
        url: '/sys/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {

}

export function logout() {

}
