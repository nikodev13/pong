import settings from "./Settings.js";

const config = {
    reset() {
        this.NET_START_X = settings.BOARD_WIDTH / 2 - settings.NET_LINE_WIDTH / 2

        this.NET_LINE_PAUSE_LENGTH = settings.NET_LINE_HEIGHT + settings.NET_PAUSE;
        const rest = Math.floor((settings.BOARD_HEIGHT) % (this.NET_LINE_PAUSE_LENGTH)) + settings.NET_PAUSE
        this.NET_MARGIN = rest / 2
    }
}

export default class Board {
    constructor() {
        this.reset()
    }

    update(ctx) {
        this.draw(ctx)
        this.drawNet(ctx)
    }

    drawNet(ctx) {
        ctx.fillStyle = settings.NET_COLOR
        for (let i = config.NET_MARGIN; i < settings.BOARD_HEIGHT; i += (config.NET_LINE_PAUSE_LENGTH)) {
            ctx.fillStyle = settings.NET_COLOR
            ctx.fillRect(config.NET_START_X, i, settings.NET_LINE_WIDTH, settings.NET_LINE_HEIGHT)
        }
    }

    draw(ctx) {
        ctx.fillStyle = settings.BOARD_COLOR
        ctx.fillRect(0, 0, settings.BOARD_WIDTH, settings.BOARD_HEIGHT)
    }

    reset() {
        config.reset()
    }
}
