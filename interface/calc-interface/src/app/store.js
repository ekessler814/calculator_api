import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import calcReducer from '../features/calc/calcSlice'

export default configureStore({
  reducer: {
    calc: calcReducer
  },
  middleware: [thunkMiddleware],
})
