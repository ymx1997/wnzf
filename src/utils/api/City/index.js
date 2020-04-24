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
