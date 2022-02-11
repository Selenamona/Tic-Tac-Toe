/**
 * 井字棋
 * 1、在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
 * 2、在历史记录列表中加粗显示当前选择的项目。
 * 3、使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
 * 4、添加一个可以升序或降序显示历史记录的按钮。
 * 5、每当有人获胜时，高亮显示连成一线的 3 颗棋子。
 * 6、当无人获胜时，显示一个平局的消息。
 */

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// 函数组件-小棋格
function Square(props) {
  return (
    <button
      className={props.isLight ? "square light-square" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// 组件-棋盘
class Board extends React.Component {
  renderSquare(i, isLight) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isLight={isLight}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const cellTotal = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    const cellList = cellTotal.map((row, index) => {
      return (
        <div className="board-row" key={index}>
          {row.map((number) => {
            return this.renderSquare(
              number,
              this.props.winCells && this.props.winCells.includes(number)
            );
          })}
        </div>
      );
    });
    return <div>{cellList}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), rank: 0 }], // 历史记录
      stepNumber: 0, // 下棋步数，递增
      xISNext: true,
      isReverse: false //  false-正序 true-倒叙
    };
  }
  render() {
    const history = this.state.history;
    const num = this.state.isReverse
      ? history.length - 1 - this.state.stepNumber
      : this.state.stepNumber;
    const current = history[num];
    const winner = this.calculateWinner(current.squares); // 计算赢家
    const status = winner
      ? "Winner: " + winner
      : current.squares.includes(null)
      ? `Next player: ${this.state.xISNext ? "X" : "O"}`
      : "Play even！";

    // 渲染历史记录列表
    const moves = history.map((step, move) => {
      const desc = step.rank
        ? `Go to move #${step.rank}, position：${step.position}`
        : "Go to game start";
      return (
        <li key={step.rank}>
          <button
            className={
              this.state.stepNumber === step.rank ? "font-bold-class" : ""
            }
            onClick={() => this.jumpTo(step.rank)}
          >
            {desc}
          </button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winCells={this.winCells}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.reStart()}>reStart</button>
          <button onClick={() => this.changeRank()}>changeRank</button>
          <div> {status} </div> <ol> {moves} </ol>
        </div>
      </div>
    );
  }

  // 下棋, i=>点击的格子下标
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.isReverse ? 0 : history.length - 1];
    const squares = current.squares.slice(); // 创建新的数组，不影响原数组

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xISNext ? "X" : "O";
    let newArr = [
      {
        rank: history.length,
        squares: squares,
        position: `${(i % 3) + 1}col ${Math.floor(i / 3) + 1}row` // 记录每一步棋的坐标(列号, 行号)
      }
    ];
    this.setState({
      history: this.state.isReverse
        ? newArr.concat(history)
        : history.concat(newArr),
      xISNext: !this.state.xISNext,
      stepNumber: history.length
    });
  }

  // 历史记录跳转
  jumpTo(i) {
    this.setState({
      stepNumber: i,
      xISNext: i % 2 === 0
    });
  }

  // 修改排序
  changeRank() {
    const history = this.state.history.slice();
    this.setState({
      history: history.reverse(),
      isReverse: !this.state.isReverse
    });
  }
  // 计算赢方
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        this.winCells = lines[i]; // 高亮获胜棋子
        return squares[a];
      }
    }
    return null;
  }
  // 重新开始游戏
  reStart() {
    this.setState({
      history: [{ squares: Array(9).fill(null), rank: 0 }], // 历史记录
      stepNumber: 0, // 下棋步数，递增
      xISNext: true,
      isReverse: false //  false-正序 true-倒叙
    });
  }
}

// 五子棋获得所有赢法
let allwin = [];
function getCount(x, y, n) {
  let countTemp = 0,
    ym = y - n + 1,
    xm = x - n + 1;

  for (let i = 0; i < x; i++) {
    allwin[i] = [];
    for (let j = 0; j < y; j++) {
      allwin[i][j] = [];
    }
  }
  //横线
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < xm; j++) {
      for (let k = 0; k < n; k++) {
        allwin[j + k][i][countTemp] = true;
        console.log("横线", j + k, i, countTemp);
      }
      countTemp++;
    }
  }

  //纵线
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < ym; j++) {
      for (let k = 0; k < n; k++) {
        allwin[i][j + k][countTemp] = true;
        console.log("纵线", i, j + k, countTemp);
      }
      countTemp++;
    }
  }
  //正斜线
  for (let i = 0; i < xm; i++) {
    for (let j = 0; j < ym; j++) {
      for (let k = 0; k < n; k++) {
        allwin[i + k][j + k][countTemp] = true;
        console.log("正斜线", i + k, j + k, countTemp);
      }
      countTemp++;
    }
  }
  //反斜线
  for (let i = 0; i < xm; i++) {
    for (let j = 0; j < ym; j++) {
      for (let k = 0; k < n; k++) {
        allwin[i + k][j + k][countTemp] = true;
        console.log("反斜线", i + k, j + k, countTemp);
      }
      countTemp++;
    }
  }
  return countTemp;
}
var count = getCount(2, 2, 2);
// var count = getCount(3, 3, 3);
// var count = getCount(5, 5, 5);
console.log(count);
console.log(allwin);

ReactDOM.render(<Game />, document.getElementById("root"));
