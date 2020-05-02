import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getListByFilter } from '../../utils/api/House'
import { getCurCity } from '../../utils/quanju'

import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/axios'
import NoHouse from '../../components/NoHouse'

export default class HouseList extends React.Component {

  // 轻量的state
  // state 设置的是 => 会引起html变化的数据 => idff 虚拟DOM：jsx+state
  state = {
    // 房屋列表数据
    list: [],
    // 列表数据的总条数
    count: 0
  }

  // 渲染列表项方法
  renderHouseItem = ({
    key,
    index,
    isScrolling,
    isVisible,
    style,
  }) => {
    // 获取数据 => 渲染列表项
    const { list } = this.state;
    // 获取当前列表项的数据
    const item = list[index];
    // 数据item没有的时候
    if (!item) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    // 处理图片地址和键
    item.src = `${BASE_URL}${item.houseImg}`
    return (
      <HouseItem {...item} key={key} onClick={() => {
        this.props.history.push({ pathname: '/detail/' + item.houseCode, state: { id: item.houseCode, backUrl: this.props.location.pathname } })
      }} style={style} />
    )
  }

  async componentDidMount() {
    let { value } = await getCurCity();
    this.cityId = value;
    this.getHouseList()
  }

  // 子传父
  // 父组件提供接收数据的方法
  onFilter = (filters) => {
    console.log('父组件：', filters);
    // 过滤条件数据存到哪？ => this
    this.filters = filters;
    // 获取列表数据
    // 触发时机：每次用户选择过滤器确定的时候调用
    this.getHouseList()
  }

  // 获取列表数据
  getHouseList = async () => {
    let { status, data: { list, count } } = await getListByFilter(this.cityId, this.filters, 1, 20)
    if (status === 200) {
      // 有数据的提示
      if (count !== 0) {
        Toast.success(`获取到${count}条房源数据!`)
      }
      this.setState({
        list,
        count
      })
    }
  }

// 下拉加载更多
// 判断当前行是否加载完成
isRowLoaded = ({ index }) => {
  return !!this.state.list[index];
}
// 回调：下拉到一定位置执行 => 调用后台接口获取下一页数据 => 刷新列表
loadMoreRows = ({ startIndex, stopIndex }) => {
  return getListByFilter(this.cityId, this.filters, startIndex, stopIndex)
    .then(res => {
      if (res.status === 200) {
        this.setState({
          list: [...this.state.list, ...res.data.list]
        })
      }
    })
}

// 渲染列表
renderList = () => {
  const { count } = this.state;
  return count > 0 ? <InfiniteLoader
    minimumBatchSize={10}
    isRowLoaded={this.isRowLoaded}
    loadMoreRows={this.loadMoreRows}
    rowCount={this.state.count}
  >
    {({ onRowsRendered, registerChild }) => (
      <AutoSizer>
          {({ height, width }) => (
            <List 
              height={height}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              className={styles.houseList}
              rowCount={this.state.count}
              rowHeight={130}
              rowRenderer={this.renderHouseItem}
              width={width}
            />
          )}
        </AutoSizer>
    )}
  </InfiniteLoader> : <NoHouse>暂无房源数据</NoHouse>
}
        
    render() {
      return (
        <div className={styles.root}>
          {/* 条件筛选栏 */}
          <Filter onFilter={this.onFilter} />
          {/* 筛选结果：列表 */}
          {/* 列表 */}
          {this.renderList()}
      </div>
    )
  }
}
