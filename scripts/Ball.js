import settings from "./Settings.js";

const config = {
    reset() {
        this.BALL_MIN_X = 0
        this.BALL_MAX_X = settings.BOARD_WIDTH - settings.BALL_SIZE
        this.BALL_MIN_Y = 0
        this.BALL_MAX_Y = settings.BOARD_HEIGHT - settings.BALL_SIZE

        this.LEFT_PADDLE_COLLISION_X = settings.PADDLE_X_MARGIN + settings.PADDLE_WIDTH
        this.RIGHT_PADDLE_COLLISION_X = settings.BOARD_WIDTH - settings.PADDLE_X_MARGIN - settings.PADDLE_WIDTH
    }
}

export default class Ball {
    constructor(game) {
        this.game = game
        this.reset()
    }

    update(ctx) {
        this.move()
        this.collide(this.game.leftPaddle, this.game.rightPaddle)
        this.draw(ctx)
    }

    move() {
        if (this.game.isRunning) {
            this.posX += this.velocityX
            this.posY += this.velocityY
        }
    }

    collide(leftPaddle, rightPaddle) {
        if (this.posX <= config.BALL_MIN_X) {
            this.game.firstPlayerScore = this.game._firstPlayerScore+1
            this.velocityX = 0
            this.velocityY = 0
            this.speed = 0
            this.posX = config.BALL_MIN_X + 2
            this.game.end()
            setTimeout(() => {
                this.reset()
                this.game.leftPaddle.reset()
                this.game.rightPaddle.reset()
            }, 1500)
        } else if (this.posX >= config.BALL_MAX_X) {
            this.game.secondPlayerScore = this.game._secondPlayerScore+1
            this.velocityX = 0
            this.velocityY = 0
            this.posX = config.BALL_MAX_X
            this.game.end()
            setTimeout(() => this.reset(), 1500)
        } else if (this.posY <= config.BALL_MIN_Y) {
            this.posY = config.BALL_MIN_Y
            this.velocityY = -this.velocityY

        } else if (this.posY >= config.BALL_MAX_Y) {
            this.posY = config.BALL_MAX_Y
            this.velocityY = -this.velocityY

        } else if (this.posX <= config.LEFT_PADDLE_COLLISION_X
            && this.velocityX < 0
            && this.posX >= config.LEFT_PADDLE_COLLISION_X + this.velocityX - settings.BALL_SIZE
            && this.posY + settings.BALL_SIZE >= leftPaddle.posY
            && this.posY <= leftPaddle.posY + settings.PADDLE_HEIGHT) {

            const collidePoint = (this.posY - (leftPaddle.posY + settings.PADDLE_HEIGHT/2)) / (settings.PADDLE_HEIGHT / 2)
            const angleRad = collidePoint * (Math.PI/4)
            this.velocityX = this.speed * Math.cos(angleRad);
            this.velocityY = this.speed * Math.sin(angleRad);

            this.posX = config.LEFT_PADDLE_COLLISION_X
            this.speed += settings.BALL_ACCELERATION

        } else if (this.posX + settings.BALL_SIZE >= config.RIGHT_PADDLE_COLLISION_X
            && this.velocityX > 0
            && this.posX <= config.RIGHT_PADDLE_COLLISION_X + this.velocityX + settings.BALL_SIZE
            && this.posY + settings.BALL_SIZE >= rightPaddle.posY
            && this.posY <= rightPaddle.posY + settings.PADDLE_HEIGHT) {

            const collidePoint = (this.posY - (rightPaddle.posY + settings.PADDLE_HEIGHT/2)) / (settings.PADDLE_HEIGHT / 2)
            const angleRad = collidePoint * (Math.PI/4)
            this.velocityX = -this.speed * Math.cos(angleRad);
            this.velocityY = this.speed * Math.sin(angleRad);

            this.posX = config.RIGHT_PADDLE_COLLISION_X - settings.BALL_SIZE
            this.speed += settings.BALL_ACCELERATION
        }
    }

    draw(ctx) {
        ctx.fillStyle = settings.BALL_COLOR
        ctx.fillRect(this.posX, this.posY, settings.BALL_SIZE, settings.BALL_SIZE)
    }

    reset() {
        this.posX = settings.BOARD_WIDTH/2 - settings.BALL_SIZE/2
        this.posY = settings.BOARD_HEIGHT/2 - settings.BALL_SIZE/2
        this.speed = settings.BALL_SPEED;
        const direction =  Math.random() < 0.50 ? -1 : 1

        this.velocityX = direction * settings.BALL_SPEED;
        this.velocityY = 0;

        config.reset()
    }
}