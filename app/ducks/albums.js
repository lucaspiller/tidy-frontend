import fetch from 'isomorphic-fetch'
import union from 'lodash/union'

const REQUEST = 'albums/REQUEST'
const RECEIVE = 'albums/RECEIVE'

const initialState = {
  isFetching:    false,
  didInvalidate: true,
  morePages:     true,
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
        morePages:     action.morePages,
        albums:        union(state.albums, action.albums),
        nextPageUrl:   action.nextPageUrl,
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
    nextPageUrl: json.nextPageUrl,
    morePages: json.albums.length > 0,
    receivedAt: Date.now()
  }
}

function fetchAlbums(nextPageUrl) {
  return dispatch => {
    dispatch(requestAlbums())
    return fetch(nextPageUrl)
      .then(response => response.json())
      .then(json => dispatch(receiveAlbums(json)))
  }
}

function shouldFetchAlbums(state, fetchNextPage) {
  const albums = state.albums
  if (!albums) {
    return true
  } else if (albums.isFetching) {
    return false
  } else if (fetchNextPage && albums.morePages) {
    return true
  } else {
    return albums.didInvalidate
  }
}

export function fetchAlbumsIfNeeded(fetchNextPage) {
  return (dispatch, getState) => {
    if (shouldFetchAlbums(getState(), fetchNextPage)) {
      const {
        nextPageUrl = `/api/albums`
      } = getState().albums
      dispatch(fetchAlbums(nextPageUrl))
    }
  }
}
