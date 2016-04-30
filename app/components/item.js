import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSelectedItemIfNeeded } from '../ducks/selectedItem'
import ItemMenu from './item_menu'

export default class Item extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    const itemId = this.props.params.itemId
    dispatch(fetchSelectedItemIfNeeded(itemId))
  }

  returnUrl() {
    const albumId = this.props.params.albumId
    return `/albums/${albumId}`
  }

  infoUrl() {
    const albumId = this.props.params.albumId
    const itemId = this.props.params.itemId
    return `/albums/${albumId}/items/${itemId}/info`
  }

  imgSrc(item) {
    if (item.metadata && item.metadata.width && item.metadata.height) {
      const imageWidth  = item.metadata.width
      const imageHeight = item.metadata.height

      const imageAspectRatio  = imageWidth / imageHeight
      const screenAspectRatio = window.innerWidth / window.innerHeight

      let scaleFactor

      if (screenAspectRatio > imageAspectRatio) {
        scaleFactor = window.innerHeight / imageHeight
      } else {
        scaleFactor = window.innerWidth / imageWidth
      }

      const width  = imageWidth * scaleFactor
      const height = imageHeight * scaleFactor

      return `/api/items/${item.id}/full?width=${width}&height=${height}`
    } else {
      return `/api/items/${item.id}/thumb`
    }
  }

  render() {
    const item = this.props.item
    const src  = this.imgSrc(item)
    const returnUrl = this.returnUrl()
    const infoUrl   = this.infoUrl()

    let className = "item-component"
    if (this.props.children) {
      className += " overlay"
    }

    return (
      <div className={className}>
        <div id="item">
          <img src={src} />
        </div>
        <ItemMenu
          item={item}
          returnUrl={returnUrl}
          infoUrl={infoUrl}
        />
        {this.props.children}
      </div>
    )
  }
}

Item.propTypes = {
  item:     React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const selectedItem = state.selectedItem

  return {
    item: selectedItem
  }
}

export default connect(mapStateToProps)(Item)
