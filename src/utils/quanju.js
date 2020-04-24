/**
 * 全局公共方法
 */
import { getCityInfo } from './api/City';

// 返回Promise =》 外边调用者可通过async和await方式获取resolve的数据
// 城市信息存储到本地=》localStorage
const CURR_CITY = 'curr_city';

// 根据百度地图API获取定位城市名字
const getCityName = async () => {
    return new Promise((resolve, reject) => {
        let myCity = new window.BMap.LocalCity();
        myCity.get((res) => {
            resolve(res.name)
        })
    })
}
export async function getCurCity() {
    // 先从本地获取之前保存过的城市定位信息
    let curCity = JSON.parse(localStorage.getItem('CURR_CITY'))
    // 获取到城市名字=》作比对
    let res = await getCityName()
    let realName = res.substr(0, 3)
    if (!curCity || realName !== curCity.label) {
        // 如果没有（第一次定位）
        // 获取定位信息 返回promise对象=》resolve结果
        return new Promise(async (resolve, reject) => {
            // 调用接口获取城市详细信息
            const { status, data } = await getCityInfo(realName)
            // alert("当前定位城市:"+myCity);
            if (status === 200) {
                // 存储到本地
                localStorage.setItem(CURR_CITY, JSON.stringify(data))
                // 传递数据
                resolve(data)
            } else {
                reject('error')
            }
        })
    } else {
        // 如果有，返回本地存储获取的信息
        return Promise.resolve(curCity)
    }
}