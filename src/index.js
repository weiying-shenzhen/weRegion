import { requestAnimationFrame } from 'raf-plus'

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
            }),
            hasMouseDown: false,
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
        this.canvasClientRect = this.canvas.getBoundingClientRect()
        const { top, left } = this.canvasClientRect
        const startX = this.startX = this.moveX = e.clientX - left
        const startY = this.startY = this.moveY = e.clientY - top

        this._strokRect({
            startX,
            startY,
        })
    }
    _onMouseMove(e) {
        if (!this.hasMouseDown) { return }
        const { top, left } = this.canvasClientRect
        const moveX = this.moveX = e.clientX - left
        const moveY = this.moveY = e.clientY - top
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
        requestAnimationFrame(() => {
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
        })
    }
    clear() {
        const { canvas, ctx } = this

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    isRectCross(rect1, rect2) {
        if (!rect2) {
            const { startX, startY, width, height } = this

            rect2 = {
                x: startX,
                y: startY,
                width,
                height,
            }
        }

        const { x: x1, y: y1, width: width1, height: height1 } = rect1
        const { x: x2, y: y2, width: width2, height: height2 } = rect2
        
        const cx1 = width1 / 2 + x1
        const cy1 = height1 / 2 + y1

        const cx2 = width2 / 2 + x2
        const cy2 = height2 / 2 + y2

        const isXCross = Math.abs(cx2 - cx1) <= Math.abs(width1 / 2) + Math.abs(width2 / 2)
        const isYCross = Math.abs(cy2 - cy1) <= Math.abs(height1 / 2) + Math.abs(height2 / 2)

        return isXCross && isYCross
    }
}