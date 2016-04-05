import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchAlbumsIfNeeded } from '../ducks/albums'

export default class Albums extends React.Component {
  albumUrl(album) {
    return `/albums/${album.id}`
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAlbumsIfNeeded())
  }

  render() {
    const { albums } = this.props
    const albumUrl = this.albumUrl

    return (
      <div>
        <h1>Albums</h1>

        <ul>
          {albums.map((album, i) =>
            <li key={i}>
              <Link to={albumUrl(album)}>{album.name}</Link>
            </li>
          )}
        </ul>

        <p>
          {albums.length} album(s)
        </p>
      </div>
    )
  }
}

Albums.propTypes = {
  albums:      React.PropTypes.array.isRequired,
  isFetching:  React.PropTypes.bool.isRequired,
  lastUpdated: React.PropTypes.number,
  dispatch:    React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {
    isFetching,
    lastUpdated,
    albums: albums
  } = state.albums || {
    isFetching: true,
    albums: []
  }

  return {
    albums,
    isFetching,
    lastUpdated
  }

}

export default connect(mapStateToProps)(Albums)
