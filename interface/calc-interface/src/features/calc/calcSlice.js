import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { sortElementsByDate } from './util'

// allowed numbers
const num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// allowed symbols
const sym = ["*", "/", "+", "-", "(", ")", " ", "."];

// not all elements belong in inputBox - these do
const acceptable = num + sym

export const calcSlice = createSlice({
  name: "calc",
  initialState: {
    // holds equation
    inputBox: '',
    // downloaded calc memories
    calculator_memories: [],
    // downloaded calculations
    calculations: [],
    // selected calc memory
    memory_select: '',
    // highlighted calculation
    calc_highlighted: '',
    // selected calculation
    calc_select: '',
    // api transaction status
    calc_fetch_status: "idle",
    // api transaction error indicator
    calc_fetch_error: null,
  },
  reducers: {
    // sent when manually typing values into equation box
    typeEquation(state, param) {
       if (!state.memory_select) { return }
      let newStr = "";
      // check if any chars in string are not in acceptable
      for (let i = 0; i < param.payload.length; i++) {
        if (acceptable.indexOf(param.payload[i]) > -1) {
          newStr += param.payload[i];
        }
      }
      state.inputBox = newStr;
    },
    // sent when a single element is to be added to value of inputbox
    appendToEquation(state, param) {
      if (!state.memory_select) { return }
      // disallow only symbols in inputBox
      if (state.inputBox === "" && sym.indexOf(param.payload) > -1) {
        return;
      }
      /* if last element of inputBox is symbol and new param is
      a symbol, replace the last element if inputBox instead of append */
      if (
        sym.indexOf(state.inputBox.slice(-1)) > -1 &&
        sym.indexOf(param.payload) > -1
      ) {
        state.inputBox = state.inputBox.slice(0, -1);
      }
      // append our char
      state.inputBox = state.inputBox + param.payload;
    },
    // remove last char of inputBox
    minusCharacter(state) {
      if (!state.memory_select) { return }
      state.inputBox = state.inputBox.slice(0, -1);
    },
    // switch polarity of inputBox
    plusMinus(state) {
      if (!state.memory_select) { return }
      state.inputBox = state.inputBox + '*-1';
    },
    // set inputBox to empty
    clear(state) {
      if (!state.memory_select) { return }
      state.inputBox = '';
    },
    // set selected calc memory
    setMemory(state, param) {
      state.memory_select = param.payload
    },
    // set selected calculation
    setCalc(state, { payload }) {
      const { id, result } = payload
      state.calc_select = id
      state.inputBox = result
    },
    // set highlighted calculation
    setHighlighted(state, { payload }) {
      state.calc_highlighted = payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMemories.pending, (state, action) => {
        state.calc_fetch_status = "loading";
      })
      .addCase(fetchMemories.fulfilled, (state, action) => {
        state.calc_fetch_status = "succeeded";
        state.calculator_memories = action.payload;
      })
      .addCase(fetchMemories.rejected, (state, action) => {
        state.calc_fetch_status = "failed";
        state.calc_fetch_error = action.error.message;
      })
      .addCase(fetchCalculations.pending, (state, action) => {
        state.calc_fetch_status = "loading";
      })
      .addCase(fetchCalculations.fulfilled, (state, action) => {
        state.calc_fetch_status = "succeeded";
        state.calculations = action.payload;
        // set value of inputbox to most recent calculation
        const sorted = sortElementsByDate(state.calculations)
        state.inputBox = sorted.length ? sorted[0].result : ''
      })
      .addCase(fetchCalculations.rejected, (state, action) => {
        state.calc_fetch_status = "failed";
        state.calc_fetch_error = action.error.message;
      })
      .addCase(postCalculation.pending, (state, action) => {
        state.calc_fetch_status = "loading";
      })
      .addCase(postCalculation.fulfilled, (state, action) => {
        state.calc_fetch_status = "succeeded";
        // select then new calculation
        state.calc_select = action.payload.id
        state.calculations.push(action.payload);
        // set value of inputbox to new calculation result
        state.inputBox = action.payload.result
      })
      .addCase(postCalculation.rejected, (state, action) => {
        state.calc_fetch_status = "failed";
        state.calc_fetch_error = action.error.message;
      });
  },
});

export const fetchMemories = createAsyncThunk(
  "calc/fetchMemories",
  async () => {
    const response = await client.get(
      "http://localhost:8000/calculator_memories/"
    );
    return response.data;
  }
);

export const fetchCalculations = createAsyncThunk(
  "calc/fetchCalculations",
  async (param) => {
    const response = await client.get(
      "http://localhost:8000/calculations/?calculator_memory=" + param
    );
    return response.data;
  }
);

export const postCalculation = createAsyncThunk(
  "calc/postCalculations",
  async (params) => {
    const response = await client.post(
      "http://localhost:8000/calculations/",
      params
    );
    return response.data;
  }
);

export const selectAllMemories = (state) => state.calc.calculator_memories;

export const selectAllCalculations = (state) => state.calc.calculations;

export const selectMemoriesById = (state, postId) =>
  state.calc.calculator_memories.find((post) => post.id === postId);

export const selectCalculationById = (state, postId) =>
  state.calc.calculations.find((post) => post.id === postId);

// Action creators are generated for each case reducer function
export const {
  typeEquation,
  appendToEquation,
  minusCharacter,
  plusMinus,
  clear,
  equals,
  setMemory,
  setCalc,
  setHighlighted,
} = calcSlice.actions;

export default calcSlice.reducer;
