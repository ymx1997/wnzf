/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/**
 * 默认首页
 */
import React, { Component } from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile';
import { BASE_URL } from '../../utils/axios';
import { getSwiper, getGroups } from '../../utils/api/Home';
import './index.scss';
import Navs from '../../utils/navConfig';


export default class Index extends Component {
    state = {
        swiper: [],
        groups: [],
        imgHeight: 176,
        isPlay: false,
    }
    componentDidMount() {
        this.getSwiper()
        this.getGroups()
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

    // 获取租房小组数据
    getGroups = async () => {
        let { status, data } = await getGroups();
        if (status === 200) {
            this.setState({
                groups: data
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

    // 渲染租房小组
    renderGroup = () => {
        return (
            <>
            <Flex className="group-title" justify="between">
                <h3>租房小组</h3>
                <span>更多</span>
            </Flex>
            <Grid data={this.state.groups}
                columnNum={2}
                hasLine={false}
                square={false}
                renderItem={item => {
                    return (
                        //  item结构 
                        <Flex key={item.id} className="grid-item" justify="between">
                            <div className="desc">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                            <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
                        </Flex>
                    )
                }
                }
            />
            </>
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

                {/* 租房小组 */}
                <div className="group">
                {
                    this.renderGroup()
                }
                </div>
            </div>
        );
    }
}
