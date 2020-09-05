import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import './styles.css';


export default function App() {
  return (
    <Jogo/>
  );
}


class Jogo extends React.Component {
  render() {
    return (
      <div>
        <Tabuleiro />
      </div>
    );
  }
}

class Tabuleiro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quadrados: Array(9).fill(null),
      historico: [Array(9).fill(null)],
      step: 0
    };
  }

  renderizarQuadrado = (i) => {
    return (
      <Quadrado
        value={this.state.quadrados[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  };

  randomPlay = () => {
    console.log("aoba");

    let { quadrados } = this.state;
    let quadrado = Math.floor(Math.random() * quadrados.length);

    while (this.state.quadrados[quadrado]) {
      quadrado = Math.floor(Math.random() * quadrados.length);
    }

    this.handleClick(quadrado);
  };

  handleClickHistory = (i) => {
    let { historico } = this.state;
    if (i == 0) historico = [Array(9).fill(null)];
    this.setState({ quadrados: historico[i], step: i, historico });
  };

  handleClick = (i) => {
    const quadrados = this.state.quadrados.slice();
    let { historico, step } = this.state;

    if (calculateWinner(quadrados)) {
      alert("Jogo já acabou");
      return;
    }
    if (quadrados[i]) {
      alert("Quadrado ocupado!");
      return;
    }
    quadrados[i] = this.state.step % 2 == 0 ? "✖️" : "⭕";

    if (step == historico.length - 1) {
      historico.push(quadrados);
    } else {
      historico.splice(step + 1);
      historico.push(quadrados);
    }

    step = historico.length - 1;
    this.setState({
      quadrados: quadrados,
      historico,
      step
    });
  };

  render() {
    const vencedor = calculateWinner(this.state.quadrados);
    const status = vencedor
      ? "🏆 Vencedor: " + vencedor
      : "Vez do jogador: " + (this.state.step % 2 == 0 ? "✖️" : "⭕");
    return (
      <div className="game">
        <div>
          <div>{status}</div>
          <div className="game-board">
            <div className="board-row">
              {this.renderizarQuadrado(0)}
              {this.renderizarQuadrado(1)}
              {this.renderizarQuadrado(2)}
            </div>

            <div className="board-row">
              {this.renderizarQuadrado(3)}
              {this.renderizarQuadrado(4)}
              {this.renderizarQuadrado(5)}
            </div>

            <div className="board-row">
              {this.renderizarQuadrado(6)}
              {this.renderizarQuadrado(7)}
              {this.renderizarQuadrado(8)}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.randomPlay}
          >
            Jogada aleatoria
          </button>
        </div>
        <div className="game-info">
          <span className="game-history">Movimentos</span>
          <div className="list-group">
            {this.state.historico &&
              this.state.historico.map((h, i) => {
                return (
                  <Historico
                    key={i}
                    isActive={i == this.state.step}
                    value={i}
                    onClick={() => this.handleClickHistory(i)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

class Quadrado extends React.Component {
  /*constructor (props){
    super (props);
    this.state = {
      value: null
    }
  }*/

  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Historico extends React.Component {
  render() {
    let className = "list-group-item list-group-item-action";
    if (this.props.isActive) {
      className += " active";
    }
    return (
      <div className="list-item" 
      onClick={this.props.onClick}
      >

        <p
        >
          {this.props.value == 0
            ? "Reiniciar"
            : `Voltar ao passo ${this.props.value}`}
        </p>
      </div>
    );
  }
}

/*function Quadrado(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}*/

function calculateWinner(quadrados) {
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
      quadrados[a] &&
      quadrados[a] === quadrados[b] &&
      quadrados[a] === quadrados[c]
    )
      return quadrados[a];
  }
  return null;
}

// ReactDOM.render(<Jogo />, document.getElementById("root"));

/*ReactDOM.render(
  <Tabuleiro quadrados={Array(9).fill().map((v, pos) => pos)} />,
  document.getElementById("root")  
);*/

/*ReactDOM.render(
  <Quadrado onClick={() => alert("Clicou!")} value={2 + 2} />,
  document.getElementById("root")
);*/
