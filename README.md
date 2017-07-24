# WeRegion

weRegion 是一个可以不修改原逻辑，增加拉选框的功能的鼠标拉选框库。原理是通过增加一个透明 canvas 绘制拉选框。应用可参考[demo](https://weiying-shenzhen.github.io/weRegion/)

## 下载

```bash
npm install --save we-region
```
或者
```bash
yarn add we-region
```

## 使用

通过传入 DOM 选择器使用

```js
import WeRegion from 'we-region'

const weRegion = new WeRegion('.mask')
```

## 配置

weRegion 可以在实例化时，通过传入第二个参数进行配置

```js
const weRegion = new WeRegion('.mask', {
    borderColor: '#0099FF',
    bodyColor: 'rgba(195, 213, 237, 0.6)',
})
```

配置项包括

### options.move({ startX, startY, width, height })

拉选时的回调。其中 `startX` 和 `startY` 表示鼠标的起始位置，`width` 和 `height` 表示拉选框的宽高

### options.end({ startX, startY, width, height })

拉选结束时的回调，释放鼠标按钮和鼠标移除遮罩层时触发。其中 `startX` 和 `startY` 表示鼠标的起始位置，`width` 和 `height` 表示拉选框的宽高

### options.width

遮罩层的宽度，默认是取其父元素的宽度

### options.height

遮罩层的高度，默认是取其父元素的高度

### options.borderColor

选择框的边框颜色，默认是 #0099FF

### options.bodyColor

选择框的颜色，默认是 rgba(195, 213, 237, 0.6)

### options.zIndex

遮罩层的 z-index（注意需要比被覆盖的元素高），默认是 9527

## 实例方法

weRegion 提供 2 个实例方法

### `clear()`

清除遮罩层中的拉选框

### `isRectCross(rect1, rect2)`

检测给定矩形 rect1 与 rect2 是否相交。rect1 和 rect2 的签名均为 `{ x, y, width, height }`，其中 `x` 和 `y` 表示矩形的横坐标和纵坐标，`width` 和 `height` 表示矩形的宽和高。若 rect2 省略，则默认为当前拉选框的坐标和宽高

## Licence

MIT