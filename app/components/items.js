import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchItemsIfNeeded } from '../ducks/items'
import { itemsGroupedByDate } from '../selectors/items'
import ItemList from './item_list'
import InfiniteScrollList from './infinite_scroll_list'
import moment from 'moment'

export default class Items extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchItemsIfNeeded())
  }

  handleLoadMore() {
    const itemId = this.props.params.itemId
    const { dispatch } = this.props
    dispatch(fetchItemsIfNeeded(true))
  }

  render() {
    const _this = this
    return (
      <div className="items-component">
        <InfiniteScrollList onLoadMore={_this.handleLoadMore.bind(_this)} className="item-list">
          {this.props.itemsByDate.map(this.renderDate.bind(this))}
        </InfiniteScrollList>
      </div>
    )
  }

  itemUrl(item) {
    return `/items/${item.id}`
  }

  thumbnailImage(item) {
    return `/api/items/${item.id}/thumb`
  }

  renderDate(dateItems, i) {
    const { date, items } = dateItems
    const formattedDate   = this.formatDate(date)

    return (
      <div className="date" key={i}>
        <header>
          <h1>{formattedDate}</h1>
        </header>
        <div className="items">
          <ItemList items={items} urlFn={this.itemUrl.bind(this)} />
        </div>
      </div>
    )
  }

  formatDate(date) {
    return moment(date).format('Do MMMM YYYY')
  }
}

Items.propTypes = {
  itemsByDate: React.PropTypes.array.isRequired,
  items:       React.PropTypes.array.isRequired,
  dispatch:    React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const items = state.items.items
  const dates = itemsGroupedByDate(items)
  if (dates.length == 0 && items.length != 0) {
    debugger
  }
  return {
    itemsByDate: itemsGroupedByDate(items),
    items:       items
  }
}

export default connect(mapStateToProps)(Items)
