import { createSlice } from '@reduxjs/toolkit'
const acceptable = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "*", "/", "+", "-", "(", ")", " ", "."
]
export const calcSlice = createSlice({
  name: 'calc',
  initialState: {
    inputBox: 0
  },
  reducers: {
    typeEquation(state, param)  {

      let newStr = ''
      for (let i = 0; i < param.payload.length; i++) {
        if (acceptable.indexOf(param.payload[i]) > -1) {
          newStr += param.payload[i]
        }
      }

      state.inputBox = newStr
    },
    appendToEquation(state, param) {
      state.inputBox = state.inputBox + param.payload
    },

  }
})

// Action creators are generated for each case reducer function
export const { typeEquation, appendToEquation } = calcSlice.actions

export default calcSlice.reducer
