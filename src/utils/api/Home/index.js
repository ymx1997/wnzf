/**
 * 首页相关的所有接口
 */

 import api from '../../axios';

//  轮播图接口
export function getSwiper() {
    return api.get('/home/swiper')
}

//  租房小组接口
export function getGroups(area="AREA|88cff55c-aaa4-e2e0") {
    return api.get('/home/groups',{
        params:{
            area
        }
    })
}