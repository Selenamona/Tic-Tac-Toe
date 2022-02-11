// 井字棋
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// 渲染小棋格
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// 渲染棋盘
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xISNext: true,
      cellNumber: null
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner
      ? "Winner: " + winner
      : `Next player: ${this.state.xISNext ? "X" : "O"}`;
    console.log(history, 123);
    const moves = history.map((step, move) => {
      console.log(step, move);
      const desc = move
        ? `Go to move #${move}, position：${step.position}`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div> {status} </div> <ol> {moves} </ol>
        </div>
      </div>
    );
  }

  // 下棋
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 创建新的数组，不影响原数组
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xISNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: `${(this.state.cellNumber % 3) + 1}col ${
            Math.floor(this.state.cellNumber / 3) + 1
          }row`
        }
      ]),
      xISNext: !this.state.xISNext,
      stepNumber: history.length,
      cellNumber: i
    });
  }

  // 历史记录跳转
  jumpTo(i) {
    this.setState({
      stepNumber: i,
      xISNext: i % 2 === 0
    });
  }
}

// 计算赢方
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
