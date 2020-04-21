/**
 * 默认首页
 */
import React, { Component } from 'react'
import { Carousel } from 'antd-mobile';

import axios from 'axios';
export default class Index extends Component {
    state = {
        swiper: [],
        imgHeight: 176,
      }
      componentDidMount() {
          this.getSwiper()
      }

    //   获取轮播图数据
    getSwiper= async ()=>{
    const res = await axios.get('http://api-haoke-dev.itheima.net/home/swiper');
    if (res.status === 200) {
        // 处理图片路径
        // res.data.body.forEach((item)=>{
        //     item.imgSrc = `http://api-haoke-dev.itheima.net${item.imgSrc}`
        // })
        this.setState({
            swiper:res.data.body
        })
    }
    }

      render() {
        return (
          <div className="index">
              {/* 轮播图 */}
            <Carousel
              autoplay={true}
              infinite
            >
              {this.state.swiper.map(val => (
                <a
                  key={val.id}
                  href="http://www.itheima.com"
                  style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                >
                  <img
                    src={`http://api-haoke-dev.itheima.net${val.imgSrc}`}
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
          </div>
        );
      }
}
