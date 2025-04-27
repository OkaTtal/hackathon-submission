import React, { useState, useEffect } from "react";
import { cloneDeep } from 'lodash';
import { useEvent, getColors } from "./util";
import Swipe from "react-easy-swipe";
import * as motion from "motion/react-client"
import lv1Img from './assets/lv1.jpg';
import { ConnectButton,useCurrentAccount  } from '@mysten/dapp-kit';
import './game.css';
import { AnyDataTag } from "@tanstack/react-query";

type Grid = number[][];
let checkissue = true
function App() {
  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;

  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const [gameOver, setGameOver] = useState<boolean>(false);

  const init = () => {
    let newGrid = cloneDeep(grid);
    addNumber(newGrid);
    addNumber(newGrid);
    setGrid(newGrid);
  };
  
  function ConnectedAccount() {
    const account = useCurrentAccount();
  
    if (!account) {
      return null;
    }
    checkissue = false
  
    return <div>Connected to {account.address}</div>;
  }

  const addNumber = (newGrid: Grid) => {
    let added = false;
    let gridFull = false;
    let attempts = 0;
    while (!added) {
      if (gridFull) {
        break;
      }
      let rand1 = Math.floor(Math.random() * 4);
      let rand2 = Math.floor(Math.random() * 4);
      attempts++;
      if (newGrid[rand1][rand2] === 0) {
        newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
        added = true;
      }
      if (attempts > 50) {
        gridFull = true;
        let gameOverr = checkIfGameOver();
        if (gameOverr) {
          alert("game over");
        }
      }
    }
  };

  const swipeLeft = (dummy?: boolean): Grid | void => {
    if(checkissue){
      return
    }
    let oldGrid = grid;
    let newGrid = cloneDeep(grid);

    for (let i = 0; i < 4; i++) {
      let b = newGrid[i];
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast++;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] += b[fast];
            b[fast] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNumber(newGrid);
    }
    if (dummy) {
      return newGrid;
    } else {
      setGrid(newGrid);
    }
  };

  const swipeRight = (dummy?: boolean): Grid | void => {
    if(checkissue){
      return

    }
    let oldData = grid;
    let newGrid = cloneDeep(grid);

    for (let i = 3; i >= 0; i--) {
      let b = newGrid[i];
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast--;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] += b[fast];
            b[fast] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (JSON.stringify(newGrid) !== JSON.stringify(oldData)) {
      addNumber(newGrid);
    }
    if (dummy) {
      return newGrid;
    } else {
      setGrid(newGrid);
    }
  };

  const swipeDown = (dummy?: boolean): Grid | void => {
    if(checkissue){
      return

    }
    let b = cloneDeep(grid);
    let oldData = JSON.parse(JSON.stringify(grid)) as Grid;
    for (let i = 3; i >= 0; i--) {
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] += b[fast][i];
            b[fast][i] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (JSON.stringify(b) !== JSON.stringify(oldData)) {
      addNumber(b);
    }
    if (dummy) {
      return b;
    } else {
      setGrid(b);
    }
  };

  const swipeUp = (dummy?: boolean): Grid | void => {
    if(checkissue){
      return

    }
    let b = cloneDeep(grid);
    let oldData = JSON.parse(JSON.stringify(grid)) as Grid;
    for (let i = 0; i < 4; i++) {
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] += b[fast][i];
            b[fast][i] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (JSON.stringify(oldData) !== JSON.stringify(b)) {
      addNumber(b);
    }
    if (dummy) {
      return b;
    } else {
      setGrid(b);
    }
  };

  const checkIfGameOver = (): boolean => {
    let checker = swipeLeft(true);
    if (JSON.stringify(grid) !== JSON.stringify(checker)) {
      return false;
    }

    let checker2 = swipeDown(true);
    if (JSON.stringify(grid) !== JSON.stringify(checker2)) {
      return false;
    }

    let checker3 = swipeRight(true);
    if (JSON.stringify(grid) !== JSON.stringify(checker3)) {
      return false;
    }

    let checker4 = swipeUp(true);
    if (JSON.stringify(grid) !== JSON.stringify(checker4)) {
      return false;
    }

    return true;
  };

  const resetGame = () => {
    setGameOver(false);
    const emptyGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addNumber(emptyGrid);
    addNumber(emptyGrid);
    setGrid(emptyGrid);
  };
  const start = () =>{
    if(!ConnectedAccount()){
      const result = confirm('You need connect your wallet first!');
    }else{
      
    }
  }

  const handleKeyDown = (e: Event) => {
    const event = e as KeyboardEvent;
    if (gameOver) {
      return;
    }
    switch (event.keyCode) {
      case UP:
        swipeUp();
        break;
      case DOWN:
        swipeDown();
        break;
      case LEFT:
        swipeLeft();
        break;
      case RIGHT:
        swipeRight();
        break;
      default:
        break;
    }

    let gameOverr = checkIfGameOver();
    if (gameOverr) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEvent("keydown", handleKeyDown);
  return (
    <div className="App" 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "#D2E3F1",
      //whole bg

    }}>
      <div
        style={{
          width: 345,
          margin: "auto",
          marginTop: 30,
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              fontFamily: "sans-serif",
              flex: 1,
              fontWeight: "700",
              fontSize: 40,
              marginLeft: 113,
              color: "#2775b6",
            }}
          >
            SwSui
          </div>
          <div className="App" id = 'ewallet'>
              <header className="App-header">
              <div className={ConnectedAccount() ? "wallet-wrapper connected" : "wallet-wrapper"}>
                  <ConnectButton />
                  <img src='/ewallet.jpg' alt="Connect" className={ConnectedAccount() ? "ywallet-img" : "nwallet-img"} />
                </div>
              </header>
            </div>
        </div>
        <div
          style={{
            background: "#A3BBDB",
            //grid background
            width: "max-content",
            height: "max-content",
            margin: "auto",
            padding: 5,
            borderRadius: 25,
            marginTop: 10,
            position: "relative",
          }}
        >
          {gameOver && (
            <div style={style.gameOverOverlay as React.CSSProperties}>
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontFamily: "sans-serif",
                    fontWeight: "900",
                    color: "#776E65",
                  }}
                >
                  Game Over
                </div>
                <div>
                  <div
                    style={{
                      flex: 1,
                      marginTop: "auto",
                    }}
                  >
                    <div onClick={resetGame} style={style.tryAgainButton}>
                      Try Again
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
             {!ConnectedAccount() && (
            <div style={style.gameOverOverlay as React.CSSProperties}>
              <div>
                <div>
                  <div
                    style={{
                      flex: 1,
                      marginTop: "auto",
                    }}
                  >
                    <div style={style.startButton}>
                      Sign to unlock
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Swipe
            onSwipeDown={() => {
              swipeDown();
            }}
            onSwipeLeft={() => swipeLeft()}
            onSwipeRight={() => swipeRight()}
            onSwipeUp={() => swipeUp()}
            style={{ overflowY: "hidden" }}
          >
            {grid.map((row, oneIndex) => {
              return (
                <div style={{ display: "flex" }} key={oneIndex}>
                  {row.map((digit, index) => (
                    <Block num={digit} key={index} />
                  ))}
                </div>
              );
            })}
          </Swipe>
        </div>
      </div>
    </div>
  );
   
}

const Block = ({ num }:any) => {
  const { blockStyle } = style;
  const lvimage: Record<string, string> = {
    2: '/lv1.jpg',
    4: '/lv2.jpg',
    8: '/lv3.jpg',
    16: '/lv4.jpg',
    32: '/lv5.jpg',
    64: '/lv6.jpg',
    128: '/lv7.jpg',
    256: '/lv8.jpg',
    512: '/lv9.jpg',
    1024: '/lv10.jpg',
    2048: '/lv11.jpg',
    4096: '/lv12.jpg',
    8192: '/lv13.jpg',
  };
//set grid 
  return (
    <div
      style={{
        ...blockStyle,
        background: getColors(num),
        color: num === 2 || num === 4 ? "#645B52" : "#F7F4EF",
      }}
    >
      {num !== 0 ? <img
    src={lvimage[num]}
    alt={num.toString()}
    style={{ width: "100%", height: "100%" }}
  /> : ""}
      
      {/* <img
    src={`/assets/${num}.jpg`}
    alt={num.toString()}
    style={{ width: "100%", height: "100%" }}
  /> */}
  
    </div>
  );
};

const style = {
  blockStyle: {
    height: 80,
    width: 80,
    background: "lightgray",
    margin: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 45,
    fontWeight: "800",
    color: "white",
  },
  tryAgainButton: {
    padding: 10,
    background: "#2774b6",
    color: "#F8F5F0",
    width: 80,
    borderRadius: 7,
    fontWeight: "900",
    cursor: "pointer",
    margin: "auto",
    marginTop: 20,
  },
  startButton: {
    padding: 20,
    background: 'linear-gradient(to right, #225fc8, #6695dd, #225fc8)',
  backgroundSize: '200% 100%',
  animation: 'gradientMove 5s ease infinite',
    color: "#F8F5F0",
    borderRadius: 30,
    fontWeight: "700",
    cursor: "pointer",
    margin: "auto",
    marginTop: 20,
    
  },
  gameOverOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    left: 0,
    top: 0,
    borderRadius: 5,
    background: "rgba(238,228,218,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
export default App;
