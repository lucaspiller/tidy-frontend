import {
  REQUEST_ALBUMS, RECEIVE_ALBUMS
} from '../actions/albums'

export default function albums(state = {
  isFetching:    false,
  didInvalidate: true,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_ALBUMS:
      return Object.assign({}, state, {
        isFetching:    true,
        didInvalidate: false
      })
    case RECEIVE_ALBUMS:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: false,
        items:         action.albums,
        lastUpdated:   action.receivedAt
      })
    default:
      return state
  }
}
