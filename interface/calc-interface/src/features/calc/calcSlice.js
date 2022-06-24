import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const sym = ["*", "/", "+", "-", "(", ")", " ", "."]

const acceptable = num + sym
export const calcSlice = createSlice({
  name: 'calc',
  initialState: {
    inputBox: "",
    calculator_memories: [],
    calc_fetch_status: 'idle',
    calc_fetch_error: null,
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
      if (state.inputBox === "" && sym.indexOf(param.payload) > -1) {
        return
      }
      if (sym.indexOf(state.inputBox.slice(-1)) > -1 && sym.indexOf(param.payload) > -1) {
        state.inputBox = state.inputBox.slice(0, -1)
      }

      state.inputBox = state.inputBox + param.payload
    },

    minusCharacter(state) {
      state.inputBox = state.inputBox.slice(0, -1) // remove last char
    },
    plusMinus(state) {
      state.inputBox = state.inputBox +  "*-1"
    },
    clear(state) {
      state.inputBox = ""
    }

  },
    extraReducers(builder) {
        builder
          .addCase(fetchMemories.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchMemories.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            state.calculator_memories = state.calculator_memories.concat(action.payload)
          })
          .addCase(fetchMemories.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      }
 })

export const fetchMemories = createAsyncThunk('calc/fetchMemories', async () => {
  const response = await client.get('http://localhost:8000/calculator_memories')
  return response.data
})

export const selectAllMemories = state => state.calculator_memories

export const selectMemoriesById = (state, postId) =>
  state.calculator_memories.find(post => post.id === postId)

// Action creators are generated for each case reducer function
export const { typeEquation, appendToEquation, minusCharacter, plusMinus, clear } = calcSlice.actions

export default calcSlice.reducer
