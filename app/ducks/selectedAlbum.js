import fetch from 'isomorphic-fetch'
import union from 'lodash/union'

const RESET   = 'selectedAlbum/RESET'
const REQUEST = 'selectedAlbum/REQUEST'
const RECEIVE = 'selectedAlbum/RECEIVE'

const initialState = {
  isFetching:    false,
  didInvalidate: true,
  items:         []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return {
        isFetching:    false,
        didInvalidate: true,
        id:            action.id,
        items:         [],
        lastUpdated:   undefined
      }
    case REQUEST:
      return Object.assign({}, state, {
        isFetching:    true,
        didInvalidate: false,
        id:            action.id
      })
    case RECEIVE:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: false,
        id:            action.id,
        nextPageUrl:   action.nextPageUrl,
        lastUpdated:   action.receivedAt
      }, action.album, {
        items: union(state.items, action.album.items)
      })
    default:
      return state
  }
}

function resetAlbum(id) {
  return {
    type: RESET,
    id:   id
  }
}

function requestAlbum(id) {
  return {
    type: REQUEST,
    id:   id
  }
}

function receiveAlbum(json) {
  return {
    type:        RECEIVE,
    id:          json.album.id,
    album:       json.album,
    nextPageUrl: json.nextPageUrl,
    receivedAt:  Date.now()
  }
}

function fetchAlbum(id, nextPageUrl) {
  return dispatch => {
    dispatch(requestAlbum(id))
    return fetch(nextPageUrl)
      .then(response => response.json())
      .then(json => dispatch(receiveAlbum(json)))
  }
}

function shouldResetAlbum(state, id) {
  const album = state.selectedAlbum
  return (album && album.id != id)
}

function shouldFetchAlbum(state, id, fetchNextPage) {
  const album = state.selectedAlbum
  if (!album) {
    return true
  } else if (album.id != id) {
    return true
  } else if (album.isFetching) {
    return false
  } else if (fetchNextPage) {
    return true
  } else {
    return album.didInvalidate
  }
}

export function fetchSelectedAlbumIfNeeded(id, fetchNextPage) {
  id = parseInt(id)
  return (dispatch, getState) => {
    if (shouldResetAlbum(getState(), id)) {
      dispatch(resetAlbum(id))
    }

    if (shouldFetchAlbum(getState(), id, fetchNextPage)) {
      const {
        nextPageUrl = `/api/albums/${id}`
      } = getState().selectedAlbum
      dispatch(fetchAlbum(id, nextPageUrl))
    }
  }
}
