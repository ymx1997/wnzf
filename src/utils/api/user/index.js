/**
 * 用户相关的所有接口
 */

import api from '../../axios';

//  登录
export function login(data) {
    return api.post('./user/login', data)
}