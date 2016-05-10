import fetch from 'isomorphic-fetch'
import union from 'lodash/union'

const REQUEST = 'items/REQUEST'
const RECEIVE = 'items/RECEIVE'

const initialState = {
  isFetching:    false,
  didInvalidate: true,
  morePages:     true,
  items:         []
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
        items:         union(state.items, action.items),
        nextPageUrl:   action.nextPageUrl,
        lastUpdated:   action.receivedAt
      })
    default:
      return state
  }
}

function requestItems() {
  return {
    type: REQUEST
  }
}

function receiveItems(json) {
  return {
    type: RECEIVE,
    items: json.items,
    nextPageUrl: json.nextPageUrl,
    morePages: json.items.length > 0,
    receivedAt: Date.now()
  }
}

function fetchItems(nextPageUrl) {
  return dispatch => {
    dispatch(requestItems())
    return fetch(nextPageUrl)
      .then(response => response.json())
      .then(json => dispatch(receiveItems(json)))
  }
}

function shouldFetchItems(state, fetchNextPage) {
  const items = state.items
  if (!items) {
    return true
  } else if (items.isFetching) {
    return false
  } else if (fetchNextPage && items.morePages) {
    return true
  } else {
    return items.didInvalidate
  }
}

export function fetchItemsIfNeeded(fetchNextPage) {
  return (dispatch, getState) => {
    if (shouldFetchItems(getState(), fetchNextPage)) {
      const {
        nextPageUrl = `/api/items`
      } = getState().items
      dispatch(fetchItems(nextPageUrl))
    }
  }
}
