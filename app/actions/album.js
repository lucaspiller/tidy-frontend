import fetch from 'isomorphic-fetch'

export const REQUEST_ALBUM  = 'REQUEST_ALBUM'
export const RECEIVE_ALBUM  = 'RECEIVE_ALBUM'

function requestAlbum(id) {
  return {
    type: REQUEST_ALBUM,
    id: id
  }
}

function receiveAlbum(json) {
  return {
    type: RECEIVE_ALBUM,
    id: json.album.id,
    name: json.album.name,
    items: json.album.items,
    receivedAt: Date.now()
  }
}

function fetchAlbum(id) {
  return dispatch => {
    dispatch(requestAlbum(id))
    return fetch(`/api/albums/${id}`)
      .then(response => response.json())
      .then(json => dispatch(receiveAlbum(json)))
  }
}

function shouldFetchAlbum(state, id) {
  const album = state.albumsById[id]
  if (!album) {
    return true
  } else if (album.isFetching) {
    return false
  } else {
    return album.didInvalidate
  }
}

export function fetchAlbumIfNeeded(id) {
  id = parseInt(id)
  return (dispatch, getState) => {
    if (shouldFetchAlbum(getState(), id)) {
      return dispatch(fetchAlbum(id))
    }
  }
}
