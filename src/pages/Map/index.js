/**
 * 地图找房
 */
import React, { Component } from 'react'
import styles from './index.module.css'
import { NavBar, Icon } from 'antd-mobile'
import { getCurCity } from '../../utils/quanju'

class Map extends Component {

    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap = async () => {
        const { BMap } = window;
        // 打断点
        // console.log(BMap);
        // 创建地图实例
        const map = new BMap.Map("container");
        // 地图定位的经纬度设置(天安门)
        // let point = new BMap.Point(116.404, 39.915);
        // // 设置地图的位置和缩放级别
        // map.centerAndZoom(point, 15);
        // 获取当前定位城市的信息
        let { value, label } = await getCurCity();
        // 创建地址解析器实例
        let myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(null, function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMap.Marker(point));
                // 添加空间 =》 平移缩放控件
                map.addControl(new BMap.NavigationControl());
                // 比例尺
                map.addControl(new BMap.ScaleControl());

                // 创建文本覆盖物
                // 覆盖物参数
                let opts = {
                    position : point, // 指定文本标注所在的地理位置
                    offset : new BMap.Size(0, 0) // 设置文本偏移量
                }
                // 初始化覆盖物实例
                let label = new BMap.Label(null, opts); // 创建文本标注对象
                // 使用html创建覆盖物
                label.setContent(
                    `
                    <div class="${styles.bubble}">
                    <p class="${styles.bubbleName}">天安门</p>
                    <p>1888套</p>
                    </div>`
                )
                // 设置覆盖物的样式
                label.setStyle({
                    background: 'transparent',
                    border: 0
                });
                // 调用百度地图的实例提供的addOverlay方法 =》添加覆盖物到地图
                map.addOverlay(label);
            }
        },
        label)
    }

    render() {
        return (
            <div className={styles.mapBox}>
                {/* 导航栏 */}
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >地图找房</NavBar>
                {/* 地图 */}
                <div id="container"></div>
            </div>
        )
    }
}

export default Map