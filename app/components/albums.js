import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchAlbumsIfNeeded } from '../ducks/albums'
import { albumsGroupedByYear } from '../selectors/albums'
import LazyImage from './lazy_image'

export default class Albums extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAlbumsIfNeeded())
  }

  render() {
    return (
      <div>
        <h1>Albums</h1>

        {this.props.albumsByYear.map(this.renderYear.bind(this))}

        <p>
          {this.props.albums.length} album(s)
        </p>
      </div>
    )
  }

  albumUrl(album) {
    return `/albums/${album.id}`
  }

  previewImage(album) {
    return `/api/albums/${album.id}/thumb`
  }

  renderYear(yearAlbums, i) {
    const { year, albums } = yearAlbums
    return (
      <div key={i}>
        <h1>{year}</h1>
        {albums.map(this.renderAlbum.bind(this))}
      </div>
    )
  }

  renderAlbum(album, i) {
    const url = this.albumUrl(album)
    const previewUrl = this.previewImage(album)
    const {name, itemsCount, minDate, maxDate} = album;

    return (
      <div key={i}>
        <Link to={url}>
          <LazyImage src={previewUrl} />
          {name}
          <div>
            {itemsCount} items
          </div>
          <div>
            {minDate} - {maxDate}
          </div>
        </Link>
      </div>
    )
  }
}

Albums.propTypes = {
  albumsByYear: React.PropTypes.array.isRequired,
  albums:       React.PropTypes.array.isRequired,
  dispatch:     React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const albums = state.albums.albums
  return {
    albumsByYear: albumsGroupedByYear(albums),
    albums:       albums
  }
}

export default connect(mapStateToProps)(Albums)
