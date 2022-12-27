import settings from "./Settings.js";

const config = {
    reset() {
        this.PADDLE_MIN_Y = 0
        this.PADDLE_MAX_Y = settings.BOARD_HEIGHT-settings.PADDLE_HEIGHT
        this.PADDLE_ON_BOARD_CENTER_Y = settings.BOARD_HEIGHT/2 - settings.PADDLE_HEIGHT/2
        this.PLAYABLE_BOARD_WIDTH = settings.BOARD_WIDTH - 2 * settings.PADDLE_X_MARGIN - 2 * settings.PADDLE_WIDTH
    }
}

class Paddle {
    constructor(posX) {
        this.posX = posX
        this.reset()
    }

    update(ctx) {
        this.move()
        this.draw(ctx)
    }

    startMoving(moveDirection) {
        this.moveY = moveDirection
    }

    stopMoving(moveDirection) {
        if (this.moveY < 0 && moveDirection < 0
            || this.moveY > 0 && moveDirection > 0) {
            this.moveY = 0;
        }
    }

    move() {
        if (this.moveY === 0) return;
        const newY = this.posY + this.moveY
        if (newY < config.PADDLE_MIN_Y || newY > config.PADDLE_MAX_Y) {
            this.moveY = 0
        }
        this.posY += this.moveY
    }

    draw(ctx) {
        ctx.fillStyle = settings.PADDLE_COLOR
        ctx.fillRect(this.posX, this.posY, settings.PADDLE_WIDTH, settings.PADDLE_HEIGHT)
    }

    reset() {
        this.posY = settings.BOARD_HEIGHT/2 - settings.PADDLE_HEIGHT/2;
        this.moveY = 0;

        config.reset()
    }
}

export const PaddleMove = {
    DOWN: settings.PADDLE_SPEED,
    UP: -settings.PADDLE_SPEED,
}

export class LeftPaddle extends Paddle {
    constructor() {
        super(settings.PADDLE_X_MARGIN);
    }
}

export class RightPaddle extends Paddle {
    constructor() {
        super(settings.BOARD_WIDTH - settings.PADDLE_X_MARGIN - settings.PADDLE_WIDTH);
    }
}

export class AIPaddle  {
    get posX() {
        return this.paddle.posX
    }
    get posY() {
        return this.paddle.posY
    }
    get moveY() {
        return this.paddle.moveY
    }

    constructor(paddle, ball) {
        this.paddle = paddle
        this.ball = ball
    }

    update(ctx) {
        this.move()
        this.paddle.update(ctx)
    }

    move() {
        const ballToPaddleDeltaX = Math.abs(this.paddle.posX - this.ball.posX) + this.ball.velocityX
        const ballToPaddleDeltaY = this.paddle.posY + settings.PADDLE_HEIGHT/2 - this.ball.posY
        if (this.ball.velocityX > 0) {
            if (Math.abs(ballToPaddleDeltaY) > settings.PADDLE_HEIGHT/2) {
                const direction = ballToPaddleDeltaY > 0 ? -1 : 1
                if (this.ball.velocityX > settings.AI_PADDLE_SPEED || ballToPaddleDeltaX < config.PLAYABLE_BOARD_WIDTH / 3) {
                    this.paddle.startMoving(settings.AI_PADDLE_SPEED * direction)

                } else if (ballToPaddleDeltaX > config.PLAYABLE_BOARD_WIDTH / 2) {
                    this.paddle.startMoving(settings.AI_PADDLE_SPEED * direction / 2)
                }
            } else {
                this.paddle.moveY = 0
            }
        } else {
            const paddleYDifference = config.PADDLE_ON_BOARD_CENTER_Y - this.paddle.posY
            if (Math.abs(config.PADDLE_ON_BOARD_CENTER_Y - this.paddle.posY) > settings.AI_PADDLE_SPEED) {
                const direction = paddleYDifference < 0 ? -1 : 1
                this.paddle.startMoving(direction * settings.AI_PADDLE_SPEED/2)
            } else {
                this.paddle.moveY = 0
            }
        }
    }

    reset() {
        this.paddle.reset()
    }
}
