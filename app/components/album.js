import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSelectedAlbumIfNeeded } from '../ducks/selectedAlbum'
import LazyImage from './lazy_image'

export default class Album extends React.Component {
  itemUrl(item) {
    return `/items/${item.id}`
  }

  componentDidMount() {
    const { dispatch } = this.props
    const albumId = this.props.params.albumId
    dispatch(fetchSelectedAlbumIfNeeded(albumId))
  }

  render() {
    const { name, items } = this.props
    const itemUrl = this.itemUrl

    return (
      <div>
        <h1>{name}</h1>

        <ul>
          {items.map((item, i) =>
            <li key={i}>
              <Link to={itemUrl(item)}>
                <LazyImage src={item.thumbnailUrl} />
              </Link>
            </li>
          )}
        </ul>

        <p>
          {items.length} items(s)
        </p>
      </div>
    )
  }
}

Album.propTypes = {
  name:        React.PropTypes.string,
  items:       React.PropTypes.array.isRequired,
  isFetching:  React.PropTypes.bool.isRequired,
  lastUpdated: React.PropTypes.number,
  dispatch:    React.PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
  const albumId = ownProps.params.albumId

  const {
    isFetching,
    lastUpdated,
    name,
    items,
  } = state.selectedAlbum || {
    isFetching: true,
    items: []
  }

  return {
    name,
    items,
    isFetching,
    lastUpdated
  }

}

export default connect(mapStateToProps)(Album)
