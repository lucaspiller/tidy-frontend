import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import partition from 'linear-partitioning'
import chunk from 'lodash/chunk'
import { fetchSelectedAlbumIfNeeded } from '../ducks/selectedAlbum'
import { itemsSortedByDate } from '../selectors/items'
import LazyImage from './lazy_image'
import StickyHeader from './sticky_header'
import moment from 'moment'

export default class Album extends React.Component {
  itemUrl(albumId, item) {
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

  render() {
    const { name } = this.props.album
    const items = this.props.items
    const dates = this.formatDates()
    const itemsCount = items.length
    const _this = this

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

        <div className="item-list">
          {chunk(items, 500).map(function(chunk) { return _this.renderItems(chunk) })}
          <div className="clearfix" />
        </div>
      </div>
    )
  }

  renderItems(items) {
    if (items.length == 0) {
      return
    }

    const defaultRatio = 1
    const itemListPadding = 40

    const viewportWidth = window.innerWidth - itemListPadding
    const idealHeight = Math.ceil(window.innerHeight / 3.5)
    const summedWidth = items.reduce((sum, item) => {
      return sum + item.aspectRatio * idealHeight
    }, 0)
    const rows = Math.ceil(summedWidth / viewportWidth)

    const weights = items.map((item) => {
      return item.aspectRatio || defaultRatio
    })

    const partitions = partition(weights, rows)

    let index = 0
    return partitions.map((row) => {
      const summedRatio = row.reduce((sum, ratio) => sum + ratio)
      return row.map(() => {
        const item = items[index++]
        const ratio = item.aspectRatio || defaultRatio
        const width = (viewportWidth / summedRatio) * ratio
        const height = width / ratio
        return this.renderItem(item, index, width, height)
      })
    })
  }

  renderItem(item, i, width, height) {
    const albumId      = this.props.album.id
    const url          = this.itemUrl(albumId, item)
    const thumbnailUrl = item.thumbnailUrl
    const style = {
      width: width,
      height: height
    }
    return (
      <div className="item" key={i} style={style}>
        <Link to={url}>
          <LazyImage src={thumbnailUrl} />
        </Link>
      </div>
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
