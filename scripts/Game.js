import settings from "./Settings.js";

import Board from "./Board.js";
import Ball from "./Ball.js";
import { AIPaddle, LeftPaddle, PaddleMove, RightPaddle } from "./Paddle.js";

const canvas = document.querySelector('#canvas')
canvas.width = settings.BOARD_WIDTH
canvas.height = settings.BOARD_HEIGHT
const ctx = canvas.getContext('2d')

const config = {
    reset() {
        this.lastDrawingTime = 0
        this.fpsInterval = 1000 / settings.FRAMES_PER_SECONDS
    }
}
export default class Game {
    constructor(onPlayerScored) {
        this.onPlayerScored = onPlayerScored
        this._firstPlayerScore = 0
        this._secondPlayerScore = 0

        this.isRunning = false;
        this.board = new Board()
        this.leftPaddle = new LeftPaddle()
        this.ball = new Ball(this)
        this.rightPaddle = new AIPaddle(new RightPaddle(), this.ball)
        this.update = this.update.bind(this)

        registerEvents(this)

        config.reset()
    }

    update() {
        if (this.isRunning)
            requestAnimationFrame(this.update)

        const now = Date.now()
        const elapsed = now - config.lastDrawingTime

        if (elapsed >= config.fpsInterval) {

            this.board.update(ctx)
            this.leftPaddle.update(ctx)
            this.rightPaddle.update(ctx)
            this.ball.update(ctx)

            config.lastDrawingTime = now
        }
    }

    run() {
        requestAnimationFrame(this.update);
    }

    pause() {
        this.isRunning = false
    }

    start() {
        if (this._firstPlayerScore === 10 || this._secondPlayerScore === 10) {
            this.restart()
        }
        this.isRunning = true
        this.run()
    }

    restart() {
        this.pause()
        this.reset()
        this.update()
    }

    end() {
        if (this._firstPlayerScore === 10 || this._secondPlayerScore === 10) {
            this.pause()
        }
    }

    set firstPlayerScore(val) {
        this._firstPlayerScore = val
        this.onPlayerScored(this._firstPlayerScore, this._secondPlayerScore)
    }

    set secondPlayerScore(val) {
        this._firstPlayerScore = val
        this.onPlayerScored(this._firstPlayerScore, this._secondPlayerScore)
    }

    reset() {
        this.board.reset()
        this.leftPaddle.reset()
        this.rightPaddle.reset()
        this.ball.reset()
        this._firstPlayerScore = 0
        this._secondPlayerScore = 0
        this.onPlayerScored(0, 0)
        config.reset()
    }
}

const registerEvents = game => {
    document.addEventListener('keydown', e => {
        if (game.isRunning) {
            switch (e.key.toLowerCase()) {
                case 'w':
                    game.leftPaddle.startMoving(PaddleMove.UP)
                    break;
                case 's':
                    game.leftPaddle.startMoving(PaddleMove.DOWN)
                    break;
            }
        }
    })

    document.addEventListener('keyup', e => {
        if (game.isRunning) {
            switch (e.key) {
                case 'w':
                    game.leftPaddle.stopMoving(PaddleMove.UP)
                    break;
                case 's':
                    game.leftPaddle.stopMoving(PaddleMove.DOWN)
                    break;
            }
        }
    })
}

