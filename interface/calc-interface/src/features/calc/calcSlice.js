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
    calculations: [],
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
    },

  },
    extraReducers(builder) {
        builder
          //.addCase()
          .addCase(fetchMemories.pending, (state, action) => {
            state.calc_fetch_status = 'loading'
          })
          .addCase(fetchMemories.fulfilled, (state, action) => {
            state.calc_fetch_status = 'succeeded'
            // Add any fetched posts to the array
            state.calculator_memories = action.payload
          })
          .addCase(fetchMemories.rejected, (state, action) => {
            state.calc_fetch_status = 'failed'
            state.calc_fetch_error = action.error.message
          })
          .addCase(fetchCalculations.pending, (state, action) => {
            state.calc_fetch_status = 'loading'
          })
          .addCase(fetchCalculations.fulfilled, (state, action) => {
            state.calc_fetch_status = 'succeeded'
            // Add any fetched posts to the array
            state.calculations = action.payload

            const sorted = state.calculations.slice().sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.datetime_created) - new Date(a.datetime_created);
            });

            if (sorted.length) {
              state.inputBox = sorted[0].result || ""
            }
            else {
              state.inputBox = ""
            }
          })
          .addCase(fetchCalculations.rejected, (state, action) => {
            state.calc_fetch_status = 'failed'
            state.calc_fetch_error = action.error.message
          })
          .addCase(postCalculation.pending, (state, action) => {
            state.calc_fetch_status = 'loading'
          })
          .addCase(postCalculation.fulfilled, (state, action) => {
            state.calc_fetch_status = 'succeeded'
            // Add any fetched posts to the array
            state.calculations.push(action.payload)
            const sorted = state.calculations.slice().sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.datetime_created) - new Date(a.datetime_created);
            });

            if (sorted.length) {
              state.inputBox = sorted[0].result || ""
            }
            else {
              state.inputBox = ""
            }
          })
          .addCase(postCalculation.rejected, (state, action) => {
            state.calc_fetch_status = 'failed'
            state.calc_fetch_error = action.error.message
          })
      }
 })

export const fetchMemories = createAsyncThunk('calc/fetchMemories', async () => {
  const response = await client.get('http://localhost:8000/calculator_memories')
  return response.data
})

export const fetchCalculations = createAsyncThunk('calc/fetchCalculations', async (param) => {
  const response = await client.get('http://localhost:8000/calculations?calculator_memory=' + param)
  return response.data
})

export const postCalculation = createAsyncThunk('calc/postCalculations', async (params) => {
  const response = await client.post('http://localhost:8000/calculations/', params)
  return response.data
})

export const selectAllMemories = state => state.calc.calculator_memories

export const selectAllCalculations = state => state.calc.calculations

export const selectMemoriesById = (state, postId) =>
  state.calc.calculator_memories.find(post => post.id === postId)

export const selectCalculationById = (state, postId) =>
  state.calc.calculations.find(post => post.id === postId)

// Action creators are generated for each case reducer function
export const { typeEquation, appendToEquation, minusCharacter, plusMinus, clear, equals } = calcSlice.actions

export default calcSlice.reducer
