# vue-caliper
caliper component. Easy to use.

## Install
```
npm run dev
```
## Examples
[http://localhost:9999](https://haomingi.github.io/vue-caliper/dists/index.html)

## Usage

```js
import VueCaliper from 'vue-caliper'

//src/index.js中注册该组件

new Vue({
el: '#example',
data: {
  day: 30,
  mes: 30,
  listDay: [
    {
      'move': 0,
      'line': 375,
      'interval': 1,
      'transformMove': 0,
      'transformLine': 0
    }
  ],
  setMinDay: 1,
  texts: '项目期限(天)',
  colorClasses: 'orangeday'
},
methods: {
  onChange (val) {
    this.mes = val
  }
}
});
```
```html
<vue-caliper
      v-model="day"
      :list="listDay"
      :set-min-num="setMinDay"
      :interval-num="15"
      :widths="4200"
      @change="onChange"
></vue-caliper>
```

## Api
### Properties
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| value                | `Number`  | `0`          | 默认展示数值    |
| list                 | `Array`   | ``           | 展示的列表数据，不同区块每格子对应数值可不同    |
| interval-num         | `Number`  | `10`         | 设置两长线之间有多少个小格子    |
| set-min-num          | `Number`  | `0`          | 设置最小可选中数值    |
| widths               | `Number`  | `3500`       | 宽度    |

### Events
| Name            | Type             | Description                 |
|-----------------|------------------|-----------------------------|
| change()        | `Number`         | 数值改变，冒泡给父组件      |