/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/**
 * 默认首页
 */
import React, { Component } from 'react'
import { Carousel, Flex } from 'antd-mobile';
import { BASE_URL } from '../../utils/axios';
import { getSwiper } from '../../utils/api/Home';
import './index.css';
import Navs from '../../utils/navConfig';



export default class Index extends Component {
    state = {
        swiper: [],
        imgHeight: 176,
        isPlay: false,
    }
    componentDidMount() {
        this.getSwiper()
    }

    //   获取轮播图数据
    getSwiper = async () => {
        const { status, data } = await getSwiper();
        // console.log('page', res);
        if (status === 200) {
            this.setState({
                swiper: data
            }, () => {
                // 确保swiper有数据=>this.state.swiper
                this.setState({
                    isPlay: true
                })
            })
        }
    }

    // 渲染轮播图
    renderSwiper = () => {
        return (
            <Carousel
                autoplay={this.state.isPlay}
                autoplayInterval={2000}
                infinite
            >
                {this.state.swiper.map(val => (
                    <a
                        key={val.id}
                        href="http://www.itheima.com"
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                        <img
                            src={`${BASE_URL}${val.imgSrc}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                                // fire window resize event to change height
                                // 窗口大小改变的时候=>自适应=>移动端适配
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                    </a>
                ))}
            </Carousel>
        )
    }

    // 渲染栏目导航
    renderNavs = () => {
        return (
            <Flex className="nav">
            {
                Navs.map((item) => <Flex.Item onClick={
                    () => {
                        this.props.history.push(item.path)
                    }
                } key={item.id}>
                    <img src={item.img} />
                    <p>{item.name}</p></Flex.Item>)
            }
        </Flex>
        )
    }

    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                {
                    this.renderSwiper()
                }

                {/* 栏目导航 */}
                {
                    this.renderNavs()
                }
            </div>
        );
    }
}
