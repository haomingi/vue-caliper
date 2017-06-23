<template>
  <div class="caliper">
    <canvas id="canv" @touchstart.stop.prevent="canvasStart" @touchmove.stop.prevent="canvasMove" @touchend.stop.prevent="canvasEnd" @transitionend.stop.prevent="transitionEnd" ref="canv" :width="widths" height="70" :style="{transitionDuration: transitions + 'ms', transform: 'translate3d(' + translateX + 'px, 0px, 0px)'}"></canvas>
  </div>
</template>
<script>
  export default{
    props: {
      value: {
        type: Number,
        default: 0
      },
      list: {
        type: Array,
        required: true
      },
      intervalNum: {
        type: Number,
        default: 10
      },
      setMinNum: {
        type: Number,
        default: 0
      },
      widths: {
        type: Number,
        default: 3500
      }
    },
    data () {
      return {
        amount: this.value,
        width: 0,
        sum: 0,
        num: 0,
        minNum: 0,
        transformLeft: '',
        //用于惯性缓动的变量
        startX: 0,
        // 上一次位置
        lastX: 0,
        lastMoveTime: 0,
        lastMoveStart: 0,
        stopInertiaMove: false,
        moveBool: false,
        nowMove: 0,
        lastTime: 0,
        //用来判断是否惯性滑动
        ai: 0,
        bi: null,
        moveFun: null,
        direction: '',
        cc: null,
        index: 0,
        translateX: 0,
        transitions: 0
      }
    },
    mounted () {
      //画刻度尺
      var canvas = this.$refs.canv
      var self = this
      this.transformLeft = this.translateX
      if (canvas.getContext) {
        var ctx = canvas.getContext('2d')
        //开始一个新的绘制路径
        ctx.beginPath()
        this.width = window.innerWidth / 2 - canvas.offsetLeft
        //smallNum小格数量用于for循环，intervalNum为出现长刻度间隙, defaultNum为默认起始刻度（通过传入数值计算位置展示），minNum为最小展示的数字位置
        var smallNum = 0, intervalNum = this.intervalNum, defaultNum = this.amount
//        this.minNum = this.setMinNum / this.intervalNum
        this.list.forEach((item, index) => {
          //计算当前对象小格画多少个
          smallNum = (item['line'] - item['move']) / item['interval']
          let h = 0
          for (; h <= smallNum; h++) {
            //代表的数值等于最小数值时存储
            if (!this.minNum && item['interval'] * h == this.setMinNum) {
              this.minNum = (h * 10)
            }
            //计算默认展示参数的位置
            if ((h * item['interval'] + item['move']) == this.amount) {
              defaultNum = (h * 10) + this.width - window.innerWidth / 2 - canvas.offsetLeft
            }
            //长 短线判断
            if (!(h % intervalNum)) {
              //定义直线的起点坐标
              ctx.moveTo((h * 10) + this.width, 70)
              //定义直线的终点坐标
              ctx.lineTo((h * 10) + this.width, 50)
              //绘制一条带颜色的直线
              ctx.strokeStyle = '#ccc'
              //加文字
              ctx.fillStyle = '#ccc'
              //文字大小
              ctx.font = '12pt Arial'
              ctx.textAlign = 'center'
              ctx.fillText(h * item['interval'] + item['move'], (h * 10) + this.width, 40)
            } else {
              //定义直线的起点坐标
              ctx.moveTo((h * 10) + this.width, 70)
              //定义直线的终点坐标
              ctx.lineTo((h * 10) + this.width, 60)
              //绘制一条带颜色的直线
              ctx.strokeStyle = '#ccc'
            }
            //存储最后一次for画线时的位置，list中多个对象时，第二个对象要在第一个对象的结束位置开始画
            if (h == smallNum) {
              this.width += (h * 10)
              //存储当前循环最后一次画线位置
              item['transformLine'] = this.width - window.innerWidth / 2 - canvas.offsetLeft
            }
            //存储当前循环第一次画线位置
            if (!h) {
              item['transformMove'] = this.width - window.innerWidth / 2 - canvas.offsetLeft
            }
          }
        })
//        console.log(this.list)
        this.width -= window.innerWidth / 2 - canvas.offsetLeft
        ctx.stroke()
  //    关闭当前的绘制路径
        ctx.closePath()
        //尺度绘画结束
      }
      //第一次计算数值
      this.havaNum()
      //此处设置defaultNum
      this.translateX = -defaultNum
    },
    methods: {
      canvasStart (e) {
        //moveBool判断是否在惯性滑动中
        if (this.moveBool) {
          this.nowMove = Date.now()
          //防止惯性滑动时过快双击，闪屏问题，比较两次点击时间
          if (this.nowMove - this.lastTime < 200) {
//            console.log('太快了，歇歇吧。')
            this.lastTime = this.nowMove
            return false
          }
          this.lastTime = this.nowMove
          clearInterval(this.cc)
          this.lastPosition()
          this.moveBool = false
        }
        //手指事件只有一个手指
        var touch = e.touches[0]
        //获取手指落下的x坐标
        this.startX = Number(touch.pageX)
        //计算数值
        this.havaNum()
        /**
         * 惯性缓动代码
         */
        this.lastX = this.startX
        this.lastMoveStart = this.lastX
        this.lastMoveTime = Date.now()
        this.stopInertiaMove = true
      },
      canvasMove (e) {
        //获取移动手指的x坐标
        var touch = e.touches[0]
        var nowX = Number(touch.pageX)
        if (nowX < this.lastX) {
          this.num = nowX - this.lastX
          //设置一个canvas的transform值的速度
//          this.sum = Math.floor(this.num / 70) * 10
          this.sum = this.num
          this.direction = 'left'
        } else {
          this.num = -(this.lastX - nowX)
          //设置一个canvas的transform值的速度
          this.sum = this.num
          this.direction = 'right'
        }
        this.lastX = nowX
        //重新获取左边距。让下次的移动在原始的基础上变动
        this.havaNum()
        this.translateX = this.translateX + this.sum
        /**
         * 缓动代码
         * ai变量是为了判断move与end之间的时间，过快时候 触发缓动
         */
        this.ai = 1
        window.clearTimeout(this.bi)
        this.bi = setTimeout(() => {
          this.ai = 0
        }, 50)
        var nowTime = Date.now()
        //一个定时回调,300ms执行,先清除初始位置的覆盖，两次move触发时间大于300，则重新给初始位置赋值 为了处理move过程中的停顿
        window.clearTimeout(this.moveFun)
        this.moveFun = setTimeout(() => {
          this.lastMoveTime = nowTime
          this.lastMoveStart = nowX
        }, 300)
      },
      canvasEnd (e) {
        //在重新获取左边距，判断得到最后的显示左边距
        var newS = this.translateX
        /**
         * 判断当前所处在可选择范围内,才调用惯性滑动,否则直接重置
         */
        if (this.currentLocation(newS)) {
          //判断ai变量的数值 当滑动距离小于三像素时候，惯性不生效
          if (!this.ai && this.lastX !== this.startX) {
            //落下手指位置 与 最后一次Move位置不一致
            //为了防止点击鼠标离开时候多移动的十像素 此处是无惯性鼠标离开处理
            this.lastPosition(newS)
          } else if (this.ai && (parseInt(this.lastX - this.lastMoveStart) > 3 || parseInt(this.lastX - this.lastMoveStart) < -3)) {
//            console.log('此时要惯性滑动')
            var nowTime = Date.now()
            /**
             * 动画所需要变量
             */
            //最后一段时间手指划动速度  初速度
            var v = (this.lastX - this.lastMoveStart) / (nowTime - this.lastMoveTime)
            //加速度方向 向左滑动v小于0,取1.向右滑动v大于0,取-1
            var dir = v > 0 ? 1 : -1
            v = v > 0 ? v : -v
//            console.log(v)
            //惯性时间
            var inert = 1000
            var AverageNumber = 10
            var jia = v / (inert / AverageNumber)
            var self = this
            //动画开始
            self.moveBool = true
            this.stopInertiaMove = false
            //动画
            this.animateSlide(v, AverageNumber, jia, dir)
          }
        }
      },
      //过渡结束，重置
      transitionEnd (e) {
        this.transitions = 0
      },
      //传入当前左边距，判断所处位置是否在可选区域，否则的话设置为最大、最小值。返回true false代表是否可惯性滑动
      currentLocation (num) {
        var s = true
        if (num >= -this.minNum) {
          this.translateX = -this.minNum
          this.transitions = 300
          s = false
        } else if (num <= -this.width) {
          this.translateX = -this.width
          this.transitions = 300
          s = false
        }
        this.havaNum()
        return s
      },
      //计算当前数值，根据左边距判断当前所在区间，每小格代表的数值,本来是要定时器处理，但后来页面运行速度卡顿，修改为当move时候调用获取
      havaNum () {
        var self = this
        var canvas = this.$refs.canv
        var newS2 = parseInt(this.translateX)
        if ((newS2 % 10) != 0) {
          return false
        }
        if (!(self.list[this.index]['transformMove'] < -newS2 && -newS2 <= self.list[this.index]['transformLine'])) {
          if (self.list[this.index]['transformLine'] <= -newS2) {
            this.index += 1
          } else {
            this.index -= 1
          }
        }
        //最左最右可滑动
        if (this.index > self.list.length - 1) {
          this.index = self.list.length - 1
          return false
        } else if (this.index < 0) {
          this.index = 0
          return false
        }
        if (newS2 > -self.minNum || newS2 < -self.width) {
          return false
        }
        var r = (-(newS2 + self.list[this.index]['transformMove']) * self.list[this.index]['interval'] / 10) + self.list[this.index]['move']
        this.amount = r
      },
      //最后停下位置取整
      lastPosition (newS = this.translateX) {
        var moveL = 0
        //判断超过正格多少像素 不大于5像素 则还原
//        console.log((-newS) % 10)
        if ((-newS) % 10 >= 5) {
          if (this.direction == 'left') {
//            console.log('左滑动')
            moveL = newS - (newS % 10) - 10
          } else {
//            console.log('右滑动')
            moveL = newS - (newS % 10) + 10
          }
        } else {
          moveL = newS - (newS % 10)
        }
        //判断是否在不可选范围
//        if (this.currentLocation(moveL)) {
//          this.transitions = '30ms'
//        }
//        this.transitions = 10
        this.translateX = moveL
        this.havaNum()
      },
      animateSlide (V, T, a, dir) {
        var self = this
        function inertiaMove () {
          if (self.stopInertiaMove) return
          V -= a
          var S = (V * T) - 1 / 2 * a * Math.pow(T, 2)
//          console.log(S)
          if (V < 0 || S < 0) {
            clearInterval(self.cc)
            //取整
            self.lastPosition()
            //计算数值
            self.havaNum()
            self.moveBool = false
            return false
          }
          var nums = self.translateX
          if (self.currentLocation(nums + S * dir)) {
            self.translateX = nums + S * dir
          } else {
            clearInterval(self.cc)
            self.lastPosition()
            self.havaNum()
            self.moveBool = false
          }
        }
        self.cc && clearInterval(self.cc)
        self.cc = setInterval(inertiaMove, T)
      }
    },
    watch: {
      amount (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
