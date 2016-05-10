import React from 'react'
import { Link } from 'react-router'
import partition from 'linear-partitioning'
import LazyImage from './lazy_image'
import InfiniteScrollList from './infinite_scroll_list'

export default class ItemList extends React.Component {
  render() {
    return (
      <div>
        {this.renderPartitions()}
      </div>
    )
  }

  renderPartitions() {
    if (this.props.items.length == 0) {
      return
    }

    const defaultRatio = 1
    const itemListPadding = 40

    const viewportWidth = window.innerWidth - itemListPadding
    const idealHeight = Math.ceil(window.innerHeight / 3.5)
    const summedWidth = this.props.items.reduce((sum, item) => {
      return sum + item.aspectRatio * idealHeight
    }, 0)
    const rows = Math.ceil(summedWidth / viewportWidth)

    const weights = this.props.items.map((item) => {
      return item.aspectRatio || defaultRatio
    })

    const partitions = partition(weights, rows)

    let index = 0
    return partitions.map((row) => {
      const summedRatio = row.reduce((sum, ratio) => sum + ratio)
      return row.map(() => {
        const item = this.props.items[index++]
        const ratio = item.aspectRatio || defaultRatio
        const width = (viewportWidth / summedRatio) * ratio
        const height = width / ratio
        return this.renderItem(item, index, width, height)
      })
    })
  }

  renderItem(item, i, width, height) {
    const url          = this.props.urlFn(item)
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
