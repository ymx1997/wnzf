/**
 * 房源相关的所有接口
 */

import api from '../../axios';

//  轮播图接口
export function getFilters(id) {
    return api.get('/houses/condition',{
        params:{
            id
        }
    })
}







