import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  typeEquation,
  appendToEquation,
  minusCharacter,
  plusMinus,
  clear,
  setMemory,
  setCalc,
  setHighlighted,
} from "./calcSlice";
import { styles } from "./css";
import {
  selectAllMemories,
  selectAllCalculations,
  fetchMemories,
  fetchCalculations,
  postCalculation,
} from "./calcSlice";

const sortElementsByDate = (calculations) => {
  return calculations.slice().sort(function (a, b) {
    // sort by datetime, descending from newest
    return new Date(b.datetime_created) - new Date(a.datetime_created);
  });
};

export function Calc() {
  const selectRef = useRef(null);
  const inputBox = useSelector((state) => state.calc.inputBox);
  const selectVal = useSelector((state) => state.calc.memory_select);

  const dispatch = useDispatch();

  const PlusMinus = (dispatch) => {
    return (
      <button onClick={() => dispatch(plusMinus())} style={styles.button}>
        {"+/-"}
      </button>
    );
  };

  const Backspace = () => (
    <button onClick={() => dispatch(minusCharacter())} style={styles.button}>
      {"<-"}
    </button>
  );

  const Clear = () => (
    <button onClick={() => dispatch(clear())} style={styles.button}>
      {"clr"}
    </button>
  );

  const Equals = () => (
    <button
      onClick={() =>
        dispatch(
          postCalculation({
            inputs: inputBox,
            calculator_memory: selectRef.current.value,
          })
        )
      }
      style={styles.button}
    >
      {"="}
    </button>
  );

  const AppendChar = ({ char }) => {
    return (
      <button
        onClick={() => dispatch(appendToEquation(char))}
        style={styles.button}
      >
        {char}
      </button>
    );
  };

  // Render display div that shows history of calcations
  const RenderCalculationBox = () => {
    const calculations = useSelector(selectAllCalculations);
    const selectedCalc = useSelector((state) => state.calc.calc_select);
    const highlightedCalc = useSelector((state) => state.calc.calc_highlighted);
    const sorted = sortElementsByDate(calculations);
    const selectedStyle = {
      backgroundColor: "blue",
      color: "white",
    };

    const calculationsList =
      sorted.length > 0 &&
      sorted.map((item, i) => {
        // debugger
        const highlighted = highlightedCalc === item.id;
        const highlightedStyle = highlighted
          ? {
              backgroundColor: "yellow",
            }
          : {};
        return (
          <option
            style={{
              ...highlightedStyle,
              ...(item.id === selectedCalc ? selectedStyle : {}),
            }}
            onMouseEnter={({ target }) => {
              dispatch(setHighlighted(parseInt(target.value)));
            }}
            onMouseLeave={() => {
              dispatch(setHighlighted(""));
            }}
            onClick={() => {
              const { result, id } = item;
              dispatch(setCalc({ result, id }));
            }}
            key={"calculator-opt-" + item.id}
            value={item.id}
          >
            {item.inputs + "=" + item.result}
          </option>
        );
      });
    return calculationsList;
  };

  const RenderMemorySelect = () => {
    const memories = useSelector(selectAllMemories);
    const sorted = sortElementsByDate(memories);

    const selectChange = (e) => {
      dispatch(fetchCalculations(e.target.value));
      dispatch(setMemory(e.target.value));
    };

    const memoriesList =
      sorted.length > 0 &&
      sorted.map((item, i) => {
        return (
          <option key={i} value={item.id}>
            {"id:" + item.id + " name: " + item.session_name}
          </option>
        );
      });

    if (!selectVal) {
      (memoriesList || []).unshift(
        <option key={selectVal} value={selectVal}>
          Select memory id
        </option>
      );
    }

    return (
      <select
        style={styles.memorySelect}
        ref={selectRef}
        value={selectVal}
        onChange={(e) => selectChange(e)}
      >
        {/* selector changes currently selected calculator memory model */}
        {memoriesList}
      </select>
    );
  };

  const Calc = () => {
    const dispatch = useDispatch();
    const memoryStatus = useSelector((state) => state.calc.calc_fetch_status);

    useEffect(() => {
      if (memoryStatus === "idle") {
        dispatch(fetchMemories());
      }
    }, [memoryStatus, dispatch]);
  };

  Calc();
  return (
    <div style={{ ...styles.side }}>
      <div style={styles.buttonBox}>
        <div>
          {/* input box for our equation */}
          <input
            onChange={(e) => dispatch(typeEquation(e.target.value))}
            style={styles.input}
            value={inputBox}
          />
          {/* container for the columns of buttons */}
          <div style={styles.buttonBox}>
            {/* first column */}
            <div style={styles.containerBox}>
              <AppendChar char={"7"} />
              <AppendChar char={"4"} />
              <AppendChar char={"1"} />
              <PlusMinus />
            </div>

            {/* second column */}
            <div style={styles.containerBox}>
              <AppendChar char={"8"} />
              <AppendChar char={"5"} />
              <AppendChar char={"2"} />
              <AppendChar char={"0"} />
            </div>

            {/* third column */}
            <div style={styles.containerBox}>
              <AppendChar char={"9"} />
              <AppendChar char={"6"} />
              <AppendChar char={"3"} />
              <AppendChar char={","} />
            </div>

            {/* fourth column */}
            <div style={styles.containerBox}>
              <AppendChar char={"*"} />
              <AppendChar char={"-"} />
              <AppendChar char={"+"} />
              {<Equals />}
            </div>

            {/* fifth column */}
            <div style={styles.containerBox}>
              <Backspace />
              <Clear />
              <AppendChar char={"/"} />
            </div>
          </div>
          <RenderMemorySelect />
        </div>
      </div>
      <div style={styles.selectBox}>
        <RenderCalculationBox />
      </div>
    </div>
  );
}
