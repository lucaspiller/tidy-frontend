import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import chunk from 'lodash/chunk'
import { fetchSelectedAlbumIfNeeded } from '../ducks/selectedAlbum'
import { itemsSortedByDate } from '../selectors/items'
import ItemList from './item_list'
import StickyHeader from './sticky_header'
import InfiniteScrollList from './infinite_scroll_list'
import moment from 'moment'

export default class Album extends React.Component {
  itemUrl(item) {
    const albumId = this.props.album.id
    return `/albums/${albumId}/items/${item.id}`
  }

  formatDates(minDate, maxDate) {
    minDate = moment(this.props.album.minDate).format('MMMM YYYY')
    maxDate = moment(this.props.album.maxDate).format('MMMM YYYY')

    if (minDate == maxDate) {
      return minDate
    } else {
      return `${minDate} - ${maxDate}`
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const albumId = this.props.params.albumId
    dispatch(fetchSelectedAlbumIfNeeded(albumId))

    this.resize = () => {
      this.setState({
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  handleLoadMore() {
    const albumId = this.props.params.albumId
    const { dispatch } = this.props
    dispatch(fetchSelectedAlbumIfNeeded(albumId, true))
  }

  render() {
    const { name }   = this.props.album
    const items      = this.props.items
    const dates      = this.formatDates()
    const itemsCount = this.props.album.itemsCount
    const _this      = this

    return (
      <div className="album-component">
        <StickyHeader>
          <h1>{name}</h1>

          <span>
            {dates}
            &nbsp;&bull;&nbsp;
            {itemsCount} items
          </span>
        </StickyHeader>

        <InfiniteScrollList onLoadMore={_this.handleLoadMore.bind(_this)} className="item-list">
          {chunk(items, 100).map(function(chunk, index) { return _this.renderItems(chunk, index) })}
          <div className="clearfix" />
        </InfiniteScrollList>
      </div>
    )
  }

  renderItems(items, index) {
    return (
      <ItemList key={index} items={items} urlFn={this.itemUrl.bind(this)} />
    )
  }
}

Album.propTypes = {
  album:    React.PropTypes.object.isRequired,
  items:    React.PropTypes.array.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const selectedAlbum = state.selectedAlbum

  return {
    album: selectedAlbum,
    items: itemsSortedByDate(selectedAlbum.items)
  }
}

export default connect(mapStateToProps)(Album)
