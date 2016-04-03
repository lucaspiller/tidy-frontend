import fetch from 'isomorphic-fetch'

export const REQUEST_ALBUMS = 'REQUEST_ALBUMS'
export const RECEIVE_ALBUMS = 'RECEIVE_ALBUMS'

function requestAlbums() {
  return {
    type: REQUEST_ALBUMS
  }
}

function receiveAlbums(json) {
  return {
    type: RECEIVE_ALBUMS,
    albums: json.albums,
    receivedAt: Date.now()
  }
}

function fetchAlbums() {
  return dispatch => {
    dispatch(requestAlbums())
    return fetch(`/api/albums`)
      .then(response => response.json())
      .then(json => dispatch(receiveAlbums(json)))
  }
}

function shouldFetchAlbums(state) {
  const albums = state.albums
  if (!albums) {
    return true
  } else if (albums.isFetching) {
    return false
  } else {
    return albums.didInvalidate
  }
}

export function fetchAlbumsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchAlbums(getState())) {
      return dispatch(fetchAlbums())
    }
  }
}
