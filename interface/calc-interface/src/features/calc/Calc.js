import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { typeEquation, appendToEquation, minusCharacter, plusMinus, clear } from './calcSlice'
import { styles } from './css'
import { selectAllMemories, fetchMemories } from './calcSlice'

export function Calc() {
  const inputBox = useSelector(state => state.calc.inputBox)
  const dispatch = useDispatch()

  const appendChar = (char) => {
    return <button onClick={() => dispatch(appendToEquation(char))} style={styles.button}>{char}</button>
  }

const PostsList = () => {
  const dispatch = useDispatch()
  const memories = useSelector(selectAllMemories)

  const memoryStatus = useSelector(state => state.calc.calc_fetch_status)

  useEffect(() => {
    if (memoryStatus === 'idle') {
      dispatch(fetchMemories())
    }
  }, [memoryStatus, dispatch])

  console.log(memories)
}
PostsList()
  return (
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
          {appendChar("=")}
        </div>

        {/* fourth row */}
        <div style={styles.containerBox}>
          <button onClick={() => dispatch(minusCharacter())} style={styles.button}>{"<-"}</button>
          <button onClick={() => dispatch(clear())} style={styles.button}>{"clr"}</button>
          {appendChar("/")}

        </div>




    </div></div>
  )
}
