import Game from "./Game.js";

const leftPlayerScore = document.querySelector('#left-player-score')
const rightPlayerScore = document.querySelector('#right-player-score')

const onPlayerScored = (firstPlayerScore, secondPlayerScore) => {
    leftPlayerScore.innerHTML = firstPlayerScore
    rightPlayerScore.innerHTML = secondPlayerScore
}

const stateButton = document.querySelector('#state-button')

stateButton.addEventListener('click', (e) => {
    if (game.isRunning) {
        game.pause()
        e.target.innerHTML = 'START'
    } else {
        game.start()
        e.target.innerHTML = 'PAUSE'
    }
})

document.querySelector('#restart-button')
    .addEventListener('click', () => {
        game.restart()
        stateButton.innerHTML = 'START'
    })

const game = new Game(onPlayerScored)
game.run();