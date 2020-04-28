/* eslint-disable default-case */
import React, { Component } from 'react'

// 过滤器的头
import FilterTitle from '../FilterTitle'
// picker组件=》做条件选择
import FilterPicker from '../FilterPicker'
// 更多条件
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { getCurCity } from '../../../../utils/quanju'
import { getFilters } from '../../../../utils/api/House'

// 默认数据
// 过滤器title默认的高亮状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// 当前选中的picker值的默认数据
const selectedValues = {
  // 没有选中值（默认值）
  area: ["area", "null"], // 包含区域和地铁
  mode: ["null"],
  price: ["null"],
  more: []
}

export default class Filter extends Component {
  // 定义状态数据
  state = {
    // 高亮的数据
    titleSelectedStatus,
    // 是否显示picker
    openType: ''
  }

  componentDidMount() {
    this.getFilterData();
    // 当前选中的值
    this.selectedValues = { ...selectedValues };
  }


  // 获取筛选条件的数据
  getFilterData = async () => {
    // 当前城市的ID
    let { value } = await getCurCity();
    let { status, data } = await getFilters(value);
    if (status === 200) {
      // 把数据存储到this上
      this.filterDatas = data;
      console.log('过滤器所有的数据：', this.filterDatas)
    }
  }

  // 提供：修改数据高亮数据的方法
  onTitleClick = (type) => {
    // 拷贝一份新的高亮状态
    let newSelected = { ...titleSelectedStatus, [type]: true };
    // console.log(newSelected)
    this.setState({
      titleSelectedStatus: newSelected,
      openType: type
    })

  }

  // 是否显示前三个过滤器的内容=》picker
  isShowPicker = () => {
    const { openType } = this.state;
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 处理确定的时候，查询selectedValues对应的选择器是否有数据 =》 高亮对应的title
  handlerSel = () => {
    // 存储新的高亮状态
    const newStatus = { ...titleSelectedStatus };
    // 遍历存储的选中数据，确定是否高亮
    Object.keys(this.selectedValues).forEach((key) => {
      // 获取当前 picker选中的值
      let cur = this.selectedValues[key];
      // 判断是否高亮
      if (key === 'area' && (cur[1] !== 'null' || cur[0] === 'subway')) {
        newStatus[key] = true
      } else if (key === 'mode' && cur[0] !== 'null') {
        newStatus[key] = true
      } else if (key === 'price' && cur[0] !== 'null') {
        newStatus[key] = true
      } else if (key === 'more' && cur.length > 0) {
        newStatus[key] = true
      }
      else {
        newStatus[key] = false
      }

    })

    return newStatus;

  }

  // 处理所有筛选器数据 => 后台需要的格式
  formatFilters = (selDatas) => {
    // 获取存储的筛选条件数据
    const { area, mode, price, more } = selDatas;
    // 组装数据
    const filters = {};
    // 区域下边：区域 | 地铁
    let areaKey = area[0], aval;
    if (area.length === 2) {
      aval = area[1]
    } else {
      if (area[2] === 'null') {
        aval = area[1]
      } else {
        aval = area[2]
      }
    }
    filters[areaKey] = aval;
    // 出租方式 价格
    filters.rentType = mode[0]
    filters.price = price[0]
    // 更多
    filters.more = more.join(',')
    return filters
  }

  // 点击确定的时候执行
  onOk = (curSel) => {
    // 存储到组件this（实例）
    const { openType } = this.state;
    this.selectedValues[openType] = curSel;
    console.log('当前选中的过滤条件：', curSel, this.selectedValues);
    
    this.setState({
      openType: '',
      // 处理高亮状态
      titleSelectedStatus: this.handlerSel()
    }, () => {
      this.props.onFilter(this.formatFilters(this.selectedValues))
    })
  }

  // 点击取消的时候
  onCancle = () => {
    this.setState({
      openType: '',
      // 处理高亮状态
      titleSelectedStatus: this.handlerSel()
    })
  }

  // 渲染picker并提供对应的数据
  renderPicker = () => {
    if (this.isShowPicker()) {
      // 获取对应picker的数据
      const { area, subway, rentType, price } = this.filterDatas;
      const { openType } = this.state;
      // 传递对应的picker数据
      let data, cols = 1;
      // 当前选中的值
      let curSel = this.selectedValues[openType];
      // 根据openType去取当前点击的picker数据
      switch (openType) {
        case 'area':
          data = [area, subway];
          cols = 3;
          break;
        case 'mode':
          data = rentType
          break;
        case 'price':
          data = price
          break;
      }

      return <FilterPicker data={data} key={openType} value={curSel} cols={cols} onOk={this.onOk} onCancle={this.onCancle} />
    }
  }

  // 渲染第四个筛选器
  renderFilterMore = () => {
    const { openType } = this.state;
    if (openType === 'more') {
      // 传递后台过滤条件的数据
      // console.log(this.filterDatas);
      const { oriented, floor, roomType, characteristic } = this.filterDatas;
      let data = { oriented, floor, roomType, characteristic };
      return (
        <FilterMore
          data={data}
          value={this.selectedValues[openType]}
          onOk={this.onOk}
          onCancle={this.onCancle}
        />
      )
    }

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
          <FilterTitle onTitleClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}