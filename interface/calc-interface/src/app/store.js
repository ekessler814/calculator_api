import { configureStore } from '@reduxjs/toolkit'
import calcReducer from '../features/calc/calcSlice'

export default configureStore({
  reducer: {
    calc: calcReducer
  }
})
