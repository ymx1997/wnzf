/**
 * 地图找房
 */
import React, { Component } from 'react'
import styles from './index.module.css'
import { NavBar, Icon } from 'antd-mobile'
import { getCurCity } from '../../utils/quanju'
import { getMapHouse } from '../../utils/api/City'

class Map extends Component {

    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap = async () => {
        this.BMap = window.BMap;
        // 打断点
        // console.log(BMap);
        // 创建地图实例
        this.map = new this.BMap.Map("container");
        // 地图定位的经纬度设置(天安门)
        // let point = new BMap.Point(116.404, 39.915);
        // // 设置地图的位置和缩放级别
        // map.centerAndZoom(point, 15);
        // 获取当前定位城市的信息
        let { value, label } = await getCurCity();
        // 创建地址解析器实例
        let myGeo = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(null, async (point) => {
            if (point) {
                this.map.centerAndZoom(point, 11);
                // map.addOverlay(new BMap.Marker(point));
                // 添加空间 =》 平移缩放控件
                this.map.addControl(new this.BMap.NavigationControl());
                // 比例尺
                this.map.addControl(new this.BMap.ScaleControl())
                // 默认调用一次 =》 渲染覆盖物 =》 第一层区的覆盖物
                this.renderOverlay(value)
            }
        },
        label)
    }

    /**
     * 渲染覆盖物
     * *@param {*} id
     * 1. 城市ID =》 获取到当前城市区的数据
     * 2. 区ID =》 获取当前区下街道的数据
     * 3. 街道/镇ID =》 获取到小区的数据
     */
    renderOverlay = async (id) => {
        // 根据不同的ID获取地图需要的数据
        let { status, data } = await getMapHouse(id);
        // 获取一下当前地图的缩放级别 =》 获取渲染覆盖物的形状和下一层缩放级别
        const { rect,
            nextZoom } = this.getTypeAndZoom();
        if (status === 200) {
            data.forEach((item) => {
                // 根据形状创建不同的覆盖物
                if (rect === 'circle') {
                    // 创建圆形覆盖物 =》 渲染前两层覆盖物
                    this.createCircle(item, nextZoom)
                } else {
                    // 创建方形覆盖物 =》 第三层小区
                    this.createRect(item)
                }
            })
        }
    }

    // 创建圆形覆盖物
    createCircle = (item, nextZoom) => {
        // 遍历渲染当前城市所有区的覆盖物到地图
        const { coord: { longitude, latitude }, label: lab, count, value: val } = item;
        // 转换经纬度 => 地图识别的坐标点
        const ipoint = new this.BMap.Point(longitude, latitude)
        // 创建文本覆盖物
        // 覆盖物参数
        let opts = {
            position : ipoint, // 指定文本标注所在的地理位置
            offset : new this.BMap.Size(0, 0) // 设置文本偏移量
        }
        // 初始化覆盖物实例
        let label = new this.BMap.Label(null, opts); // 创建文本标注对象
        // 使用html创建覆盖物
        label.setContent(
            `
            <div class="${styles.bubble}">
            <p class="${styles.bubbleName}">${lab}</p>
            <p>${count}套</p>
            </div>`
        )
        // 设置覆盖物的样式
        label.setStyle({
            background: 'transparent',
            border: 0
        });
        // 覆盖物添加点击事件
        label.addEventListener('click', () => {
            console.log(this.map.getZoom());
            this.map.centerAndZoom(ipoint, nextZoom);
            // 清除上一层覆盖物
            setTimeout(() => {
                this.map.clearOverlays()
            })
            // 处理下一层覆盖物的创建
            this.renderOverlay(val)
        })
        // 调用百度地图的实例提供的addOverlay方法 =》添加覆盖物到地图
        this.map.addOverlay(label);
    }

    // 创建方形覆盖物
    createRect = (item) => {
        console.log('小区');
    }

    // 获取当前的覆盖物形状和下一层缩放级别
    getTypeAndZoom = () => {
        let rect, nextZoom;
        // 获取当前地图的缩放级别
        const currZoom = this.map.getZoom();
        if (currZoom >= 10 && currZoom < 12) {
            rect = 'circle';
            nextZoom = 13
        } else if (currZoom >= 12 && currZoom < 14) {
            rect = 'circle';
            nextZoom = 15
        } else if (currZoom >= 14 && currZoom < 16) {
            rect = 'rect'
        }
        return {
            rect,
            nextZoom
        }
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