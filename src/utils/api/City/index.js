/**
 * 城市接口
 */

import api from '../../axios';

//  根据城市名称查询该城市信息
export function getCityInfo(name) {
    return api.get('/area/info',{
        params:{
            name
        }
    })
}

//  根据城市列表数据
export function getCityList(level=1) {
    return api.get('/area/city',{
        params:{
            level
        }
    })
}

//  获取热门城市
export function getHotCity() {
    return api.get('/area/hot')
}

// 根据关键词和城市ID获取小区列表
export function getCommunity(id,name) {
    return api.get('/area/community',{
        params:{
            id,name
        }
    })
}

// 地图下钻查询房源信息
// 多用
/**
 * 
 * @param {*} id
 * 1. 城市ID =》 获取当前城市区的数据
 * 2. 区ID =》 获取当前区下街道的数据
 * 3. 街道/镇ID =》 获取到小区的数据
 */
export function getMapHouse(id) {
    return api.get('/area/map', {
        params: {
            id
        }
    })
}