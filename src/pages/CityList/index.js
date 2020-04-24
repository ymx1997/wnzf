/* eslint-disable array-callback-return */
/**
 * 城市列表=》选择
 */
import React, { Component } from 'react'
import { getCityList, getHotCity } from '../../utils/api/City'

class CityList extends Component {

    componentDidMount() {
        this.getCityList()
    }

    // 获取城市列表的数据
    getCityList= async ()=>{
        const {status, data} = await getCityList();
        if(status === 200) {
            // 按首字母归类数据
        let { cityList, cityIndex } = this.formatCities(data);
            // 加入热门城市数据
        const {status:st,data:hot} = await getHotCity()
        if(st === 200) {
            cityList['hot'] = hot;
            cityIndex.unshift('hot')
        }
        console.log(cityList, cityIndex);
        }
    }

    // 按城市首字母归类城市数据
    formatCities=(data)=>{
        // 归类的数据
        let cityList = {}, cityIndex;
        // 遍历数据归类
        data.forEach((item)=>{
            // 获取当前的城市首字母
            let first = item.short.slice(0,1);
            // 排重和归类
            // 判断存不存在当前首字母开头的键
            if (!cityList[first]) {
                // 不存在
                cityList[first] = [item]
            } else {
                // 存在
                cityList[first].push(item)
            }
        })
        // console.log('首字母归类完的数据:',cityList);
        // 获取归类的首字母数据索引
        cityIndex = Object.keys(cityList).sort()
        // console.log('首字母归类的首字母数据',cityIndex);
        // 遍历列表
        // cityIndex.map((item)=>{
        //     console.log(item,cityList[item]);
        // })
        
        return {
            cityList,
            cityIndex
        }
    }
    render() {
        return (
            <div>
                CityList
            </div>
        )
    }
}

export default CityList