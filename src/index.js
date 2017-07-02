export default class WeRegion {
    constructor(el, options = {}) {
        const defaultOptions = {
            width: 0,
            height: 0,
            borderColor: '#0099FF',
            bodyColor: 'rgba(195, 213, 237, 0.6)',
            lineDash: [4, 2],
            zIndex: 9527,
            move: undefined,
            end: undefined,
        }
        const canvas = typeof el === 'string' ? document.querySelector(el) : el

        if (canvas === undefined) {
            throw new Error('A element or dom selector must be passed')
        }

        Object.assign(this, {
            canvas,
            ctx: canvas.getContext('2d'),
            canvasClientRect: canvas.getBoundingClientRect(),
            options: Object.assign({}, defaultOptions, options, {
                width: parseFloat(options.width) || canvas.parentNode.clientWidth,
                height: parseFloat(options.height) || canvas.parentNode.clientHeight,
            })
        })

        this._initCanvas()
        this._initEvents()
    }
    _initCanvas() {
        const { ctx, options } = this
        const { bodyColor, borderColor, lineDash } = options

        this._initCanvasSize()

        ctx.fillStyle = bodyColor
        ctx.strokeStyle = borderColor
        ctx.setLineDash(lineDash)
    }
    _initCanvasSize() {
        const { canvas, ctx, options } = this
        const { width, height, zIndex } = options

        const ratio = window.devicePixelRatio || 1

        canvas.width = width * ratio
        canvas.height = height * ratio
        ctx.scale(ratio, ratio)

        canvas.style.cssText = `width:${width}px;height:${height}px;position:absolute;z-index:${zIndex}`
    }
    _initEvents() {
        const { canvas } = this

        canvas.addEventListener('mousedown', this._onMouseDown.bind(this), false)
        canvas.addEventListener('mousemove', this._onMouseMove.bind(this), false)
        canvas.addEventListener('mouseup', this._onMouseUp.bind(this), false)
        canvas.addEventListener('mouseleave', this._onMouseLeave.bind(this), false)
    }
    _onMouseDown(e) {
        this.hasMouseDown = true
        const { top, left } = this.canvasClientRect
        const startX = this.startX = e.pageX - left
        const startY = this.startY = e.pageY - top

        this._strokRect({
            startX,
            startY,
        })
    }
    _onMouseMove(e) {
        if (!this.hasMouseDown) { return }
        const { top, left } = this.canvasClientRect
        const moveX = this.moveX = e.pageX - left
        const moveY = this.moveY = e.pageY - top
        this._strokRect({
            moveX,
            moveY,
        })
    }
    _onMouseUp() {
        if (!this.hasMouseDown) { return }
        this.hasMouseDown = false

        const { startX, startY, moveX, moveY } = this
        const width = this.width = moveX - startX
        const height = this.height = moveY - startY

        if (typeof this.options.end === 'function') {
            this.options.end({
                startX,
                startY,
                width,
                height,
            })
        }
        this.clear()
    }
    _onMouseLeave() {
        this._onMouseUp()
    }
    _strokRect({ moveX, moveY }) {
        const { ctx, startX, startY } = this

        this.clear()

        const width = this.width = moveX - startX
        const height = this.height = moveY - startY

        ctx.strokeRect(startX, startY, width, height)
        ctx.fillRect(startX, startY, width, height)

        if (typeof this.options.move === 'function') {
            this.options.move({
                startX,
                startY,
                width,
                height,
            })
        }
    }
    clear() {
        const { canvas, ctx } = this

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    isRectCross({ x, y, w, h }) {
        const { startX, startY, width, height } = this

        const cx1 = w / 2 + x
        const cy1 = h / 2 + y

        const cx2 = width / 2 + startX
        const cy2 = height / 2 + startY

        const isXCross = Math.abs(cx2 - cx1) <= w / 2 + Math.abs(width / 2)
        const isYCross = Math.abs(cy2 - cy1) <= h / 2 + Math.abs(height / 2)

        return isXCross && isYCross
    }
}