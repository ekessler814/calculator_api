import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { typeEquation, appendToEquation } from './calcSlice'
import { styles } from './css'
export function Calc() {
  const inputBox = useSelector(state => state.calc.inputBox)
  const dispatch = useDispatch()

  return (
    <div style={styles.containerBox}>
      <input onChange={(e) => dispatch(typeEquation(e.target.value))} style={styles.input} value={inputBox} />
        {/* container for the buttons */}


        {/* first row */}
        <div style={styles.buttonBox}>
          <button onClick={() => dispatch(appendToEquation("1"))} style={styles.button}>1</button>
          <button onClick={() => dispatch(appendToEquation("2"))} style={styles.button}>2</button>
          <button onClick={() => dispatch(appendToEquation("3"))} style={styles.button}>3</button>
        </div>

        {/* second row */}
        <div style={styles.buttonBox}>
          <button onClick={() => dispatch(appendToEquation("4"))} style={styles.button}>4</button>
          <button onClick={() => dispatch(appendToEquation("5"))} style={styles.button}>5</button>
          <button onClick={() => dispatch(appendToEquation("6"))} style={styles.button}>6</button>
        </div>

        {/* third row */}
        <div style={styles.buttonBox}>
          <button onClick={() => dispatch(appendToEquation("7"))} style={styles.button}>7</button>
          <button onClick={() => dispatch(appendToEquation("8"))} style={styles.button}>8</button>
          <button onClick={() => dispatch(appendToEquation("9"))} style={styles.button}>9</button>
        </div>

        {/* fourth row */}
        <div style={styles.buttonBox}>

          <button onClick={() => dispatch(appendToEquation("0"))} style={styles.button}>0</button>
          <button onClick={() => dispatch(appendToEquation("."))} style={styles.button}>.</button>

        </div>




    </div>
  )
}
