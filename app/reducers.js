import { combineReducers } from 'redux'
import albums from './reducers/albums'
import albumsById from './reducers/albumsById'

const rootReducer = combineReducers({
  albums,
  albumsById
})

export default rootReducer
