/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile';


import './index.css'
import Index from '../Index'
import House from '../House'
import Profile from '../Profile'
import TabBarConfig from '../../utils/tabBarConfig';


class Home extends Component {

    state = {
        selectedTab: this.props.location.pathname
    };

    renderTabBar = () => {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
            >
                {
                    TabBarConfig.map((item) => <TabBar.Item
                        title={item.title}
                        key={item.path}
                        icon={
                            <i className={`iconfont ${item.icon}`} />
                        }
                        selectedIcon={<i className={`iconfont ${item.icon}`} />}
                        selected={this.state.selectedTab === item.path}
                        onPress={() => {
                            this.props.history.push(item.path);
                            this.setState({
                                selectedTab: item.path,
                            });
                        }}
                    />)
                }
            </TabBar>
        )

    }

    render() {
        return (
            <div className="home">
                {/* 配置二级路由 */}
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/house" component={House}></Route>
                <Route path="/home/profile" component={Profile}></Route>
                {/* 标签栏TabBar组件 */}
                <div className="tabbar">
                    {
                        this.renderTabBar()
                    }
                </div>
            </div>
        )
    }
}

export default Home