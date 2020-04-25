/**
 * 城市列表=》选择
 */
import React, { Component } from 'react'
import { getCityList, getHotCity } from '../../utils/api/City'
import { getCurCity } from '../../utils/quanju';

import { List, AutoSizer } from 'react-virtualized'
import './index.scss'
import { NavBar, Icon } from 'antd-mobile';



class CityList extends Component {

    // 设置状态数据
    state = {
        // 归类的城市数据
        cityList:{},
        // 归类的城市索引
        cityIndex:[]
    }

    componentDidMount() {
        this.getCityList()
    }

    // 格式化列表的title
    formatLetter=(letter)=>{
        switch (letter) {
            case '#':
            return '当前城市';
            case 'hot':
            return '热门城市';
            default:
                // 处理成大写
            return letter.toUpperCase()
        }
    }

    rowRenderer = ({
        key,
        index,
        isScrolling,
        isVisible,
        style,
    }) => {
        // 获取处理完的状态数据
        const {cityList, cityIndex} = this.state;
        // 对象的键
        let letter = cityIndex[index];
        // console.log(index,letter);
        // 对象的值
        let item = cityList[letter];
        // console.log(letter, item);

        return (
            <div key={key} style={style} className="city-item">
                <div className="title">{this.formatLetter(letter)}</div>
                {
                    item.map((item)=><div key={item.value} className="name">{item.label}</div>)
                }
            </div>
        )
    }

    // 获取城市列表的数据
    getCityList = async () => {
        const { status, data } = await getCityList();
        if (status === 200) {
            // 按首字母归类数据
            let { cityList, cityIndex } = this.formatCities(data);
            // 加入热门城市数据
            const { status: st, data: hot } = await getHotCity()
            if (st === 200) {
                cityList['hot'] = hot;
                cityIndex.unshift('hot')
            }
            // 加入当前城市
            const res = await getCurCity();
            cityList['#'] = [res];
            cityIndex.unshift('#')
            // 响应式
            this.setState({
                cityList,
                cityIndex
            })

            // console.log(cityList, cityIndex);
        }
    }

    // 按城市首字母归类城市数据
    formatCities = (data) => {
        // 归类的数据
        let cityList = {}, cityIndex;
        // 遍历数据归类
        data.forEach((item) => {
            // 获取当前的城市首字母
            let first = item.short.slice(0, 1);
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

    // 动态计算高度
    excueHeight=({index}) => {
        const {cityIndex, cityList} = this.state;
        // 计算公式：title高度50 + 当前归类的城市数量*36
        let curKey = cityIndex[index]
        // console.log(curKey);
        return 36 + cityList[curKey].length*50
    }

    render() {
        return (
            <div className="cityList">
                {/* 导航栏 */}
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >城市选择</NavBar>
                {/* 城市列表 */}
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.excueHeight}
                            rowRenderer={this.rowRenderer}
                            width={width}
                        />
                    )}
                </AutoSizer>
            </div>
        )
    }
}

export default CityList