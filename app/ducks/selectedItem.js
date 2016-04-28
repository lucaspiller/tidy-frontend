import fetch from 'isomorphic-fetch'

const RESET   = 'selectedItem/RESET'
const REQUEST = 'selectedItem/REQUEST'
const RECEIVE = 'selectedItem/RECEIVE'

const initialState = {
  isFetching:    false,
  didInvalidate: true
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: true,
        id:            action.id,
        lastUpdated:   null
      })
    case REQUEST:
      return Object.assign({}, state, {
        isFetching:    true,
        didInvalidate: false,
        id:            action.id,
        lastUpdated:   null
      })
    case RECEIVE:
      return Object.assign({}, state, {
        isFetching:    false,
        didInvalidate: false,
        id:            action.id,
        lastUpdated:   action.receivedAt
      }, action.item)
    default:
      return state
  }
}

function resetItem(id) {
  return {
    type: RESET,
    id:   id
  }
}

function requestItem(id) {
  return {
    type: REQUEST,
    id:   id
  }
}

function receiveItem(json) {
  return {
    type:         RECEIVE,
    id:           json.item.id,
    item:         json.item,
    receivedAt:   Date.now()
  }
}

function fetchItem(id) {
  return dispatch => {
    dispatch(requestItem(id))
    return fetch(`/api/items/${id}`)
      .then(response => response.json())
      .then(json => dispatch(receiveItem(json)))
  }
}

function shouldResetItem(state, id) {
  const item = state.selectedItem
  return (item && item.id != id)
}

function shouldFetchItem(state, id) {
  const item = state.selectedItem
  if (!item) {
    return true
  } else if (item.id != id) {
    return true
  } else if (item.isFetching) {
    return false
  } else {
    return item.didInvalidate
  }
}

export function fetchSelectedItemIfNeeded(id) {
  id = parseInt(id)
  return (dispatch, getState) => {
    if (shouldResetItem(getState(), id)) {
      dispatch(resetItem(id))
    }

    if (shouldFetchItem(getState(), id)) {
      dispatch(fetchItem(id))
    }
  }
}
