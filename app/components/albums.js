import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchAlbumsIfNeeded } from '../ducks/albums'
import { albumsGroupedByYear } from '../selectors/albums'
import LazyImage from './lazy_image'
import moment from 'moment'

export default class Albums extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAlbumsIfNeeded())
  }

  render() {
    return (
      <div className="albums-component">
        <h1>Albums</h1>

        <div className="album-list">
          {this.props.albumsByYear.map(this.renderYear.bind(this))}
        </div>

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
      <div className="year" key={i}>
        <h1>{year}</h1>
        <div className="albums">
          {albums.map(this.renderAlbum.bind(this))}
        </div>
      </div>
    )
  }

  formatDates(minDate, maxDate) {
    minDate = moment(minDate).format('MMMM YYYY')
    maxDate = moment(maxDate).format('MMMM YYYY')

    if (minDate == maxDate) {
      return minDate
    } else {
      return `${minDate} - ${maxDate}`
    }
  }

  renderAlbum(album, i) {
    const url = this.albumUrl(album)
    const previewUrl = this.previewImage(album)
    const {name, itemsCount, minDate, maxDate} = album
    const dates = this.formatDates(minDate, maxDate)

    return (
      <div className="album" key={i}>
        <Link to={url}>
          <LazyImage src={previewUrl} />
          <div className="overlay"></div>
          <header>
            <h4>{name}</h4>

            <div>
              <span>
                {dates}
                &nbsp;&bull;&nbsp;
                {itemsCount} items
              </span>
            </div>
          </header>
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
