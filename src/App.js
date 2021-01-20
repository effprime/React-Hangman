import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      running: false,
      word: null,
      guess: null
    }

    this.handleFormStateChange = this.handleFormStateChange.bind(this)
    this.startGame = this.startGame.bind(this)
    this.processGuess = this.processGuess.bind(this)
  }

  handleFormStateChange(stateKey, value) {
    this.setState( {[stateKey]: value} )
  }

  startGame() {
    if (!this.state.word) {
      alert("Please enter a word!")
      return
    }

    // alert("Starting!")
    this.setState({running: true})
  }

  processGuess() {
    console.log(this.state.guess)
  }

  render() {
    return (
      <div className="gameWindow">

      {
        !this.state.running ? 
        <StartForm startGame={this.startGame} handleChange={this.handleFormStateChange}></StartForm> : null
      }
      {
        this.state.running ? 
        <Guesser processGuess={this.processGuess} handleChange={this.handleFormStateChange}></Guesser> : null
      }

      </div>
    );
  }
}

class StartForm extends Component {
  render() {
    return (
      <div className="startForm">
      <input
        type="text"
        placeholder="Enter a word"
        onChange={e => this.props.handleChange("word", e.target.value)}
      />
      <button className="startButton" type="button" onClick={this.props.startGame}>Start Game</button>
      </div>
    )
  }
}

class Guesser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formValue: ""
    }
  }

  validateGuess(event) {
    const theoreticalValue = this.state.formValue + event.key
    if ((theoreticalValue.length > 1 || !event.key.match(/[a-z]/i)) && event.key !== "") {
      event.preventDefault()
      return
    }
  }

  sendGuess(letter) {
    this.setState({formValue: letter})
    this.props.handleChange("guess", letter)
  }

  render() {
    return (
      <div className="guessForm">
      <input
        type="text"
        placeholder="Guess a letter"
        onKeyPress={e => this.validateGuess(e)}
        onChange={e => this.sendGuess(e.target.value)}
      />
      <button className="guessButton" type="button" onClick={this.props.processGuess}>GUESS</button>
      </div>
    )
  }
}

export default App;
