import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSelectedItemIfNeeded } from '../ducks/selectedItem'

export default class Item extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    const itemId = this.props.params.itemId
    dispatch(fetchSelectedItemIfNeeded(itemId))
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
    const { id } = this.props.item
    const src = this.imgSrc(this.props.item)

    return (
      <div className="item-component">
        <div id="item">
          <img src={src} />
        </div>
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
