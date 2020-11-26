import React, { useCallback, useRef, useState } from "react";
import produce from "immer";
import "../css/Grid.css";

// Grid dimension
const numRows = 50;
const numCols = 50;

// Grid neighbors
const operations = [
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const Grid = () => {
  // Grid creation
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  // Running state of the app
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  // Handle if the app is running or not => prevent from bug
  const handleRunning = () => {
    setRunning(!running);
  };

  const runApp = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runApp, 500);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          handleRunning();
          runningRef.current = true;
          runApp();
        }}
      >
        {running ? "stop" : "start"}
      </button>

      <div className="grid">
        {grid.map((rows, rowIndex) =>
          rows.map((col, colIndex) => (
            <div
              key={`${rowIndex} : ${colIndex}`}
              className={`${
                grid[rowIndex][colIndex] ? "grid__cellColored" : "grid__cell"
              }`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowIndex][colIndex] = grid[rowIndex][colIndex]
                    ? 0
                    : 1;
                });
                setGrid(newGrid);
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Grid;
