import React    from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, Link, hashHistory } from 'react-router'
import configureStore from './configureStore'

import Albums from './components/albums'
import Album from './components/album'
import Item from './components/item'
import ItemInfo from './components/item_info'

const store = configureStore()

export class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link to='/albums'>Albums</Link>
      </div>
    );
  }
}

ReactDOM.render((
  <Provider store={store} key="provider">
    <Router history={hashHistory}>
      <Route path="/" component={Home} />
      <Route path="/albums" component={Albums} />
      <Route path="/albums/:albumId" component={Album} />
      <Route path="/albums/:albumId/items/:itemId" component={Item}>
        <Route path="info" component={ItemInfo} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))
