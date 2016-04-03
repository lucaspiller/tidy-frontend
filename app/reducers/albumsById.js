import {
  REQUEST_ALBUM, RECEIVE_ALBUM
} from '../actions/album'

function album(state = {
  isFetching:    false,
  didInvalidate: true,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_ALBUM:
      return Object.assign({}, state, {
        isFetching:    true,
        didInvalidate: false
      })
    case RECEIVE_ALBUM:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: false,
        name:          action.name,
        items:         action.items,
        lastUpdated:   action.receivedAt
      })
    default:
      return state
  }
}

export default function albumsById(state = { albumsById: [] }, action) {
  switch (action.type) {
    case RECEIVE_ALBUM:
    case REQUEST_ALBUM:
      return Object.assign({}, state, {
        [action.id]: album(state.albumsById[action.id], action)
      })
    default:
      return state
  }
}
