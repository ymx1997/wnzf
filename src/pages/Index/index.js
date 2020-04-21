/**
 * 默认首页
 */
import React, { Component } from 'react'
import { Carousel } from 'antd-mobile';
import { BASE_URL } from '../../utils/axios';
import { getSwiper } from '../../utils/api/Home';

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
    getSwiper= async ()=>{
    const {status, data} = await getSwiper();
    // console.log('page', res);
    if (status === 200) {
        this.setState({
            swiper: data
        },()=>{
            // 确保swiper有数据=>this.state.swiper
            this.setState({
                isPlay: true
            })
        })
    }
    }

      render() {
        return (
          <div className="index">
              {/* 轮播图 */}
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
          </div>
        );
      }
}
