/**
 * 用户相关的所有接口
 */

import api from '../../axios';
import { getToken } from '../../quanju';

//  登录
export function login(data) {
    return api.post('./user/login', data)
}

// 获取当前登录人信息
export function getUserData() {
    return api.get('/user', {
        headers: {
            authorization: getToken()
        }
    })
}

// 登出接口
export function logout() {
    return api.post('/user/logout', null, {
        headers: {
            authorization: getToken()
        }
    })
}