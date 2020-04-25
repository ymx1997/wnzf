import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { getCurCity } from '../../../../utils/quanju.js'
import { getFilters } from '../../../../utils/api/House'


// 过滤器title默认的高亮状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {
  // 定义状态数据
  state = {
    // 高亮的数据
    titleSelectedStatus,
    // 是否显示picker
    openType:''
  }

  componentDidMount() {
    this.getFilterData()
  }

  // 获取筛选条件的数据 
  getFilterData = async ()=>{
    // 当前城市的ID
    let {value} = await getCurCity();
    let { status, data } = await getFilters(value)
    if (status === 200) {
      // 把数据存储到this上
      this.filterDatas = data
    }
  }

  // 提供：修改数据高亮数据的方法
  onTitleClick = (type) => {
    // 拷贝一份新的高亮状态
    let newSelected = { ...titleSelectedStatus,[type]:true };
    // console.log(newSelected);
    this.setState({
      titleSelectedStatus: newSelected,
      openType:type
    })
  }

  // 是否显示前三个过滤器的内容=》picker
  isShowPicker = () => {
    const {openType} = this.state;
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 点击确定的时候执行
  onOk = () => {
    this.setState({
      openType: ''
    })
  }

  // 点击取消的时候执行
  onCancle = () => {
    this.setState({
      openType: ''
    })
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.isShowPicker() ? <div onClick={this.onCancle} className={styles.mask} /> : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onTitleClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus}/>

          {/* 前三个菜单对应的内容： */}
          {
            this.isShowPicker() ? <FilterPicker onOk={this.onOk} onCancle={this.onCancle}/> : null
          }

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
