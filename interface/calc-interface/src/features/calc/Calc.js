import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { typeEquation, appendToEquation, minusCharacter, plusMinus, clear } from './calcSlice'
import { styles } from './css'
import { selectAllMemories, selectAllCalculations, fetchMemories, fetchCalculations, postCalculation } from './calcSlice'

export function Calc() {

  const selectRef = useRef(null);

  const inputBox = useSelector(state => state.calc.inputBox)

  const dispatch = useDispatch()

  const appendChar = (char) => {
    return <button onClick={() => dispatch(appendToEquation(char))} style={styles.button}>{char}</button>
  }

  const selectChange = (e) => {
    dispatch(fetchCalculations(e.target.value))

  }


const RenderCalculationBox = () => {
  const calculations = useSelector(selectAllCalculations)
  const sorted = calculations.slice().sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.datetime_created) - new Date(a.datetime_created);
  });
  const calculationsList = sorted.length > 0
  && sorted.map((item, i) => {
  return (
    <option key={i} value={item.id}>{item.inputs + '=' + item.result}</option>
  )
})
  return calculationsList
}

const RenderMemorySelect = () => {

  const memories = useSelector(selectAllMemories)
  const sorted = memories.slice().sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.datetime_created) - new Date(a.datetime_created);
  });

  useEffect(() => {
    // fire only once to initialize
     dispatch(fetchCalculations(selectRef.current.value))
   }, []);

  const memoriesList = sorted.length > 0
  && sorted.map((item, i) => {
  return (
    <option key={i} value={item.id}>{"id:" + item.id + " name: " + item.session_name}</option>
  )
})
  return memoriesList
}

const Calc = () => {
  const dispatch = useDispatch()

  const memoryStatus = useSelector(state => state.calc.calc_fetch_status)

  useEffect(() => {
    if (memoryStatus === 'idle') {
      dispatch(fetchMemories("test"))
    }
  }, [memoryStatus, dispatch])

}

Calc()
  return (
    <div style={{...styles.side}}>
    <div style={styles.buttonBox}>
    <div style={{width: '250px'}}>
      <input onChange={(e) => dispatch(typeEquation(e.target.value))} style={styles.input} value={inputBox} />
    <div style={styles.buttonBox}>

        {/* container for the buttons */}

        <div style={styles.containerBox}>
          {appendChar("7")}
          {appendChar("4")}
          {appendChar("1")}
          <button onClick={() => dispatch(plusMinus())} style={styles.button}>{"+/-"}</button>
        </div>


        <div style={styles.containerBox}>
          {appendChar("8")}
          {appendChar("5")}
          {appendChar("2")}
          {appendChar("0")}
        </div>

        <div style={styles.containerBox}>
          {appendChar("9")}
          {appendChar("6")}
          {appendChar("3")}
          {appendChar(".")}
        </div>

        <div style={styles.containerBox}>
          {appendChar("*")}
          {appendChar("-")}
          {appendChar("+")}
          <button onClick={() => dispatch(postCalculation({"inputs": inputBox, "calculator_memory": selectRef.current.value}))} style={styles.button}>{"="}</button>
        </div>

        {/* fourth row */}
        <div style={styles.containerBox}>
          <button onClick={() => dispatch(minusCharacter())} style={styles.button}>{"<-"}</button>
          <button onClick={() => dispatch(clear())} style={styles.button}>{"clr"}</button>
          {appendChar("/")}

        </div>

      </div>

      <select ref={selectRef} onChange={(e) => selectChange(e)}>{RenderMemorySelect()}</select>

      </div>

    </div>
        <div style={styles.selectBox}>{RenderCalculationBox()}</div>
        </div>
  )
}
