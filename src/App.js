import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      stage: "input",
      word: [],
      guess: null
    }

    this.handleStateChange = this.handleStateChange.bind(this)
    this.startGame = this.startGame.bind(this)
    this.handleWordStateChange = this.handleWordStateChange.bind(this)
    this.processGuess = this.processGuess.bind(this)
  }

  maxStep = 10

  handleStateChange(stateKey, value) {
    this.setState( {[stateKey]: value} )
  }

  handleWordStateChange(value) {
    const word = []
    for (let i=0; i < value.length; i++) {
      word.push({
          letter: value.charAt(i).toLowerCase(),
          guessed: false
      })
    }
    this.setState({word: word})
  }

  startGame() {
    if (this.state.word.length === 0) {
      alert("Please enter a word!")
      return
    }
    
    this.setState({stage: "playing"})
  }

  processGuess() {
    let successfulGuess = false
    let allGuessed = true
    const wordCopy = this.state.word

    for (let letterObj of wordCopy) {
      if (letterObj.letter === this.state.guess) {
        successfulGuess = true
        letterObj.guessed = true
      }
      if (!letterObj.guessed) {
        allGuessed = false
      }
    }
    this.setState({word: wordCopy})

    if (!successfulGuess) {
      const newStep = this.state.step + 1
      this.setState({step: newStep})
      if (newStep === this.maxStep) {
        this.setState({stage: "loser"})
        return
      }
    }

    if (allGuessed) {
      this.setState({stage: "winner"})
      return
    }
  }

  resetGame() {
    this.setState({
      step: 0,
      stage: "input",
      word: [],
      guess: null
    })
  }

  render() {
    return (
      <div className="gameWindow">

      <h3>Welcome to Hangman!</h3>

      <ImageDisplay step={this.state.step}></ImageDisplay>

      {
        this.state.stage === "input" ? 
        <StartForm startGame={this.startGame} handleChange={this.handleWordStateChange}></StartForm> : null
      }

      {
        this.state.stage !== "input" ?
        <HangmanWord word={this.state.word}></HangmanWord> : null
      }

      {
        this.state.stage === "playing" ? 
        <GuessForm processGuess={this.processGuess} handleChange={this.handleStateChange}></GuessForm> : null
      }

      {
        this.state.stage === "winner" ?
        <p>You won! Congratulations!</p> : null
      }

      {
        this.state.stage === "loser" ?
        <p>You lost! Try again next time!</p> : null
      }

      </div>
    );
  }
}

class StartForm extends Component {

  handleKeyPress(keypressEvent) {
    if (!keypressEvent.key.match(/[a-z]/i)) {
      keypressEvent.preventDefault()
      return
    }
  }

  render() {
    return (
      <div className="startForm">
        <input
          type="text"
          placeholder="Enter a word"
          onKeyPress={e => this.handleKeyPress(e)}
          onChange={e => this.props.handleChange(e.target.value)}
        />
        <button className="startButton" type="button" onClick={this.props.startGame}>Start Game</button>
      </div>
    )
  }
}

class GuessForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formValue: ""
    }
  }

  handleKeyPress(keypressEvent) {
    const theoreticalValue = this.state.formValue + keypressEvent.key
    if ((theoreticalValue.length > 1 || !keypressEvent.key.match(/[a-z]/i)) && keypressEvent.key !== "") {
      keypressEvent.preventDefault()
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
          onKeyPress={e => this.handleKeyPress(e)}
          onChange={e => this.sendGuess(e.target.value.toLowerCase())}
        />
        <button className="guessButton" type="button" onClick={this.props.processGuess}>GUESS</button>
      </div>
    )
  }
}

class HangmanWord extends Component {

  render() {
    const letters = []
    for (let [index, letterObj] of this.props.word.entries()) {
      letters.push(
        <span key={index} className="hangmanLetter">{letterObj.guessed ? letterObj.letter.toUpperCase() : '_'}</span>
      )
    }

    return (
      <div className="hangmanWord">
        {letters}
      </div>
    )
  }
}

class ImageDisplay extends Component {

  render() {
    return (
      <div className="imageDisplay">
        <img alt={`Incorrect guesses: ${this.props.step}`}className="hangmanImage" src={`images/${this.props.step}.jpg`}></img>
      </div>
    )
  }
}

export default App;
