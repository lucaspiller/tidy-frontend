import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSelectedItemIfNeeded } from '../ducks/selectedItem'
import ItemMenu from './item_menu'
import ImageLoader from './image_loader'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    const itemId = this.props.params.itemId
    dispatch(fetchSelectedItemIfNeeded(itemId))

    const { item } = this.props
    this.computeFullSize(item)
  }

  componentWillReceiveProps(props, _state) {
    const { item } = props
    this.computeFullSize(item)
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

  computeFullSize(item) {
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

      this.setState({
        width:  width,
        height: height
      })
    }
  }

  fullSrc() {
    if (this.state.width && this.state.height) {
      return `/api/items/${this.props.item.id}/full?width=${this.state.width}&height=${this.state.height}`
    }
  }

  thumbnailSrc() {
    return `/api/items/${this.props.item.id}/thumb`
  }

  render() {
    const item      = this.props.item
    const returnUrl = this.returnUrl()
    const infoUrl   = this.infoUrl()

    let className = "item-component"
    if (this.props.children) {
      className += " overlay"
    }

    const thumbnailSrc = this.thumbnailSrc()
    const fullSrc      = this.fullSrc()

    return (
      <div className={className}>
        <div id="item">
          <ImageLoader thumbnailSrc={thumbnailSrc} fullSrc={fullSrc} width={this.state.width} height={this.state.height} />
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
