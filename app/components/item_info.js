import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSelectedItemIfNeeded } from '../ducks/selectedItem'
import moment from 'moment'

export default class ItemInfo extends React.Component {
  itemUrl() {
    const albumId = this.props.params.albumId
    const itemId = this.props.params.itemId
    return `/albums/${albumId}/items/${itemId}`
  }

  takenOn(timestamp) {
    if (timestamp) {
      return moment(timestamp).format("MMMM Do YYYY")
    }
  }

  dimensions(metadata) {
    if (metadata.width && metadata.height) {
      let mp = (metadata.width * metadata.height) / 1000000
      if (mp >= 2) {
        mp = Math.floor(mp)
      } else {
        mp = Math.floor(mp * 10) / 10
      }
      return `${metadata.width} x ${metadata.height} (${mp} MP)`
    }
  }

  cameraMake(metadata) {
    if (metadata.make) {
      return metadata.make
    }
  }

  cameraModel(metadata) {
    if (metadata.model) {
      return metadata.model
    }
  }

  aperture(metadata) {
    if (metadata.fNumber) {
      return `f/${metadata.fNumber}`
    }
  }

  exposure(metadata) {
    if (metadata.exposure) {
      return `1/${metadata.exposure}`
    }
  }

  focalLength(metadata) {
    if (metadata.focalLength) {
      return `${metadata.focalLength} mm`
    }
  }

  iso(metadata) {
    if (metadata.iso) {
      return metadata.iso
    }
  }

  map(metadata) {
    if (metadata.coordinates.latitude && metadata.coordinates.longitude) {
      const coord = metadata.coordinates.latitude + ',' + metadata.coordinates.longitude
      const url = `https://maps.google.com?q=${coord}`
      const src = `//maps.googleapis.com/maps/api/staticmap?size=400x200&zoom=15&maptype=terrain&format=jpg&markers=${coord}`

      return (
        <a href={url} target="_blank">
          <img src={src} />
        </a>
      )
    }
  }

  render() {
    let takenOn
    let dimensions
    let cameraMake
    let cameraModel
    let aperture
    let exposure
    let focalLength
    let iso
    let map

    if (this.props.item.metadata) {
      dimensions  = this.dimensions(this.props.item.metadata)
      takenOn     = this.takenOn(this.props.item.timestamp)
      cameraMake  = this.cameraMake(this.props.item.metadata)
      cameraModel = this.cameraModel(this.props.item.metadata)
      aperture    = this.aperture(this.props.item.metadata)
      exposure    = this.exposure(this.props.item.metadata)
      focalLength = this.focalLength(this.props.item.metadata)
      iso         = this.iso(this.props.item.metadata)
      map         = this.map(this.props.item.metadata)
    }

    const itemUrl = this.itemUrl()

    return (
      <div className="item-info-component">
        <div className="metadata">
          <dl>
            <dt>Taken On</dt>
            <dd>{takenOn || 'N/A'}</dd>

            <dt>Camera Make</dt>
            <dd>{cameraMake || 'N/A'}</dd>

            <dt>Aperture</dt>
            <dd>{aperture || 'N/A'}</dd>

            <dt>Focal Length</dt>
            <dd>{focalLength || 'N/A'}</dd>

            <dt>Dimensions</dt>
            <dd>{dimensions || 'N/A'}</dd>

            <dt>Camera Model</dt>
            <dd>{cameraModel || 'N/A'}</dd>

            <dt>Exposure</dt>
            <dd>{exposure || 'N/A'}</dd>

            <dt>ISO</dt>
            <dd>{iso || 'N/A'}</dd>
          </dl>

          {map}

          <Link to={itemUrl} className="close">
            Close
          </Link>
        </div>
      </div>
    )
  }
}

ItemInfo.propTypes = {
  item:     React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const selectedItem = state.selectedItem

  return {
    item: selectedItem
  }
}

export default connect(mapStateToProps)(ItemInfo)
