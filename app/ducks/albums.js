import fetch from 'isomorphic-fetch'

const REQUEST = 'albums/REQUEST'
const RECEIVE = 'albums/RECEIVE'

const initialState = {
  isFetching:    false,
  didInvalidate: true,
  albums:        []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching:    true,
        didInvalidate: false
      })
    case RECEIVE:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: false,
        albums:        action.albums,
        lastUpdated:   action.receivedAt
      })
    default:
      return state
  }
}

function requestAlbums() {
  return {
    type: REQUEST
  }
}

function receiveAlbums(json) {
  return {
    type: RECEIVE,
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
