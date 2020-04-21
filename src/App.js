import React from 'react';

import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
      <Switch>
        {/* 路由重定向 */}
        <Redirect exact from="/" to="/home"/>
        {/* 应用的一级路由 */}
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <Route path="/map" component={Map}></Route>
      {/* 配置404页面 */}
      <Route component={NotFound}></Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
