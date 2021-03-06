(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueCaliper"] = factory();
	else
		root["VueCaliper"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue__);
/**
 * Created by 001758 on 2018/1/9.
 */


/* istanbul ignore next */
__WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default.a.install = function (Vue) {
  Vue.component(__WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default.a.name, __WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default.a);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(__WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default.a);
}
/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__vue_caliper_vue___default.a);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'vue-caliper',
  props: {
    value: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      default: 10
    },
    minValue: {
      type: Number,
      default: 0
    },
    widths: {
      type: Number,
      default: 3500
    }
  },
  data() {
    return {
      defaultValue: this.value,
      width: 0,
      movingDistance: 0, //当次移动位置距离
      minNum: 0, //最小值对应位置
      //用来判断是否惯性滑动变量
      moveBool: false, //判断是否在惯性滑动中
      nowMove: 0, //最近一次触摸屏幕时间
      lastTime: 0, //上一次触摸屏幕时间
      startX: 0, //首次触摸位置 用于惯性缓动的变量
      lastX: 0, //上一次move的位置
      initialMoveTime: 0, //初始时间
      initialMoveStart: 0, //初始位置
      triggerInertia: 0, //是否触发惯性
      direction: '', //移动方向
      index: 0,
      translateLeft: 0, //左侧偏移位置
      transitions: 0,
      triggerInertiaObj: null,
      initializeLocationObj: null,
      inertiaObject: null, //惯性对象
      calculateValueObj: null
    };
  },
  mounted() {
    //画刻度尺
    var canvas = this.$refs.canv;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      //开始一个新的绘制路径
      ctx.beginPath();
      this.width = window.innerWidth / 2 - canvas.offsetLeft;
      //smallNum小格数量用于for循环，intervalNum为出现长刻度间隙, defaultNum为默认起始刻度（通过传入数值计算位置展示），minNum为最小展示的数字位置
      var smallNum = 0,
          intervalNum = this.interval,
          defaultNum = 0;
      this.list.forEach((item, index) => {
        //计算当前对象小格画多少个
        smallNum = (item['line'] - item['move']) / item['interval'];
        let activeNum = 0;
        for (let h = 0; h <= smallNum; h++) {
          //对应数值等于最小数值时存储 最小值对应位置
          activeNum = item['interval'] * h;
          if (!this.minNum && activeNum == this.minValue) {
            this.minNum = h * 10;
          }
          //计算默认展示参数的位置
          if (!defaultNum && activeNum + item['move'] == this.defaultValue) {
            defaultNum = h * 10 + this.width - window.innerWidth / 2 - canvas.offsetLeft;
          }
          //长 短线判断
          if (!(h % intervalNum)) {
            //定义直线的起点坐标
            ctx.moveTo(h * 10 + this.width, 70);
            //定义直线的终点坐标
            ctx.lineTo(h * 10 + this.width, 50);
            //绘制一条带颜色的直线
            ctx.strokeStyle = '#ccc';
            ctx.fillStyle = '#ccc';
            ctx.font = '12pt Arial';
            ctx.textAlign = 'center';
            ctx.fillText(activeNum + item['move'], h * 10 + this.width, 40);
          } else {
            //定义直线的起点坐标
            ctx.moveTo(h * 10 + this.width, 70);
            //定义直线的终点坐标
            ctx.lineTo(h * 10 + this.width, 60);
            //绘制一条带颜色的直线
            ctx.strokeStyle = '#ccc';
          }
          //存储最后一次for画线时的位置，list中多个对象时，第二个对象要在第一个对象的结束位置开始画
          if (h == smallNum) {
            this.width += h * 10;
            //存储当前循环最后一次画线位置
            // 2018-01-10,此处计算是按照屏幕尺寸计算的，
            // 当使用的时候外面宽度不是100%时候计算会出问题！！
            // 添加-- + (window.innerWidth - this.$refs.caliper.offsetWidth)
            item['transformLine'] = this.width - window.innerWidth / 2 - canvas.offsetLeft + (window.innerWidth - this.$refs.caliper.offsetWidth);
          }
          //存储当前循环第一次画线位置
          // 同上面
          if (!h) {
            item['transformMove'] = this.width - window.innerWidth / 2 - canvas.offsetLeft + (window.innerWidth - this.$refs.caliper.offsetWidth);
          }
        }
      });
      this.width -= window.innerWidth / 2 - canvas.offsetLeft;
      ctx.stroke();
      //关闭当前的绘制路径
      ctx.closePath();
      //尺度绘画结束
    }
    //第一次计算数值
    this.havaNum();
    //此处设置defaultNum
    this.translateLeft = -defaultNum;
  },
  methods: {
    canvasStart(e) {
      //moveBool判断是否在惯性滑动中 惯性中点击 立马停止惯性
      if (this.moveBool) {
        this.nowMove = Date.now();
        //防止惯性滑动时过快双击，闪屏问题，比较两次点击时间
        if (this.nowMove - this.lastTime < 200) {
          this.lastTime = this.nowMove;
          return false;
        }
        this.lastTime = this.nowMove;
        clearInterval(this.inertiaObject);
        this.lastPosition();
        this.moveBool = false;
      }
      //手指事件只有一个手指
      var touch = e.touches[0];
      //获取手指落下的x坐标
      this.startX = Number(touch.pageX);
      /**
       * 惯性缓动代码
       */
      this.lastX = this.startX;
      //??
      this.initialMoveStart = this.lastX;
      this.initialMoveTime = Date.now();
      this.moveBool = false;
    },
    canvasMove(e) {
      //获取移动手指的x坐标
      var touch = e.touches[0];
      var nowX = Number(touch.pageX);
      if (nowX <= Number(this.lastX)) {
        this.direction = 'left';
        this.movingDistance = nowX - this.lastX;
      } else {
        this.direction = 'right';
        this.movingDistance = -(this.lastX - nowX);
      }
      this.lastX = nowX;
      //移动过程中不计算 数值
      this.havaNum();
      //重新获取左边距。让下次的移动在原始的基础上变动
      this.translateLeft = this.translateLeft + this.movingDistance;
      /**
       * 缓动代码
       * triggerInertia变量是为了判断move与end之间的时间，过快时候 触发缓动
       */
      this.triggerInertia = 1;
      window.clearTimeout(this.triggerInertiaObj);
      //一直move的时候定时回调不会走，可通过回调内triggerInertia的值，判断手指离开是不是与上次move的时间差小于50，小于出发惯性
      this.triggerInertiaObj = setTimeout(() => {
        this.triggerInertia = 0;
      }, 50);
      var nowTime = Date.now();
      //一个定时回调,300ms执行,先清除初始位置的覆盖，两次move触发时间大于300，则重新给初始位置赋值 为了处理move过程中的停顿
      window.clearTimeout(this.initializeLocationObj);
      this.initializeLocationObj = setTimeout(() => {
        //给上次移动时间 位置，重新赋值
        this.initialMoveTime = nowTime;
        this.initialMoveStart = nowX;
      }, 300);
    },
    canvasEnd(e) {
      //清除初始位置重置回调，不清除也不影响啊 貌似
      window.clearTimeout(this.initializeLocationObj);
      /**
       * 判断当前所处在可选择范围内,才调用惯性滑动,否则直接重置
       */
      if (this.currentLocation(this.translateLeft)) {
        //判断triggerInertia变量的数值=0不触发惯性;防止初始位置和最后位置一致，防止点击
        if (!this.triggerInertia && this.lastX !== this.startX) {
          //为了防止点击鼠标离开时候多移动的十像素 此处是无惯性鼠标离开处理
          this.lastPosition();
          //最后一次移动位置与初始位置小于三像素时候，惯性不生效
        } else if (this.triggerInertia && (parseInt(this.lastX - this.initialMoveStart) > 3 || parseInt(this.lastX - this.initialMoveStart) < -3)) {
          //此时要惯性滑动
          var nowTime = Date.now();
          /**
           * 动画所需要变量
           */
          //最后一段时间手指划动速度  初速度
          var v = (this.lastX - this.initialMoveStart) / (nowTime - this.initialMoveTime);
          //加速度方向 向左滑动v小于0,取1.向右滑动v大于0,取-1
          var dir = v > 0 ? 1 : -1;
          v = v > 0 ? v : -v;
          //惯性时间
          var inert = 1000;
          var AverageNumber = 10;
          var jia = v / (inert / AverageNumber);
          //动画开始
          this.moveBool = true;
          //动画
          this.animateSlide(v, AverageNumber, jia, dir);
        }
      }
    },
    //过渡结束，重置
    transitionEnd(e) {
      this.transitions = 0;
    },
    //传入当前左边距，判断所处位置是否在可选区域，否则的话设置为最大、最小值。返回true false代表是否可惯性滑动
    currentLocation(num) {
      var s = true;
      if (num >= -this.minNum) {
        this.translateLeft = -this.minNum;
        this.transitions = 300;
        s = false;
      } else if (num <= -this.width) {
        this.translateLeft = -this.width;
        this.transitions = 300;
        s = false;
      }
      return s;
    },
    //计算当前数值，根据左边距判断当前所在区间，每小格代表的数值,本来是要定时器处理，但后来页面运行速度卡顿，修改为当move时候调用获取
    havaNum() {
      if (this.moveBool) return false;
      //移动过程不需要时时计算
      if (this.calculateValueObj) window.clearTimeout(this.calculateValueObj);
      this.calculateValueObj = setTimeout(() => {
        calculateFun.call(this, null);
      }, 500);
      function calculateFun() {
        var newS2 = parseInt(this.translateLeft);
        if (newS2 % 10 != 0) {
          return false;
        }
        if (!(this.list[this.index]['transformMove'] < -newS2 && -newS2 <= this.list[this.index]['transformLine'])) {
          if (this.list[this.index]['transformLine'] <= -newS2) {
            this.index += 1;
          } else {
            if (!this.index) return;
            this.index -= 1;
          }
          //数据为不同区块时，一次划过两个区块，会造成数值计算异常。
          //进入当前判断，index+1.直到不进入当前判断，此时index的数值才是准确的。
          calculateFun.call(this, null);
        } else {
          //在当前区间内
          //最左最右可滑动
          if (this.index > this.list.length - 1) {
            this.index = this.list.length - 1;
            return false;
          } else if (this.index < 0) {
            this.index = 0;
            return false;
          }
          var r = -(newS2 + this.list[this.index]['transformMove']) * this.list[this.index]['interval'] / 10 + this.list[this.index]['move'];
          this.defaultValue = r;
        }
      }
    },
    //最后停下位置取整
    lastPosition(newS = this.translateLeft) {
      var moveL = 0;
      //判断超过正格多少像素 不大于5像素 则还原
      if (-newS % 10 >= 5) {
        if (this.direction == 'left') {
          //            console.log('左滑动')
          moveL = newS - newS % 10 - 10;
        } else {
          //            console.log('右滑动')
          moveL = newS - newS % 10;
        }
      } else {
        moveL = newS - newS % 10;
      }
      this.transitions = 100;
      this.translateLeft = moveL;
      this.havaNum();
    },
    animateSlide(V, T, a, dir) {
      function inertiaMove() {
        if (!this.moveBool) return;
        V -= a;
        var S = V * T - 1 / 2 * a * Math.pow(T, 2);
        var nums = this.translateLeft;
        if (V < 0 || S < 0) {
          clearInterval(this.inertiaObject);
          //取整
          this.moveBool = false;
          this.lastPosition();
          return false;
        }
        if (this.currentLocation(nums + S * dir)) {
          this.translateLeft = nums + S * dir;
        } else {
          clearInterval(this.inertiaObject);
          this.moveBool = false;
          this.lastPosition();
        }
      }
      this.inertiaObject && clearInterval(this.inertiaObject);
      this.inertiaObject = setInterval(() => {
        inertiaMove.call(this, null);
      }, T);
    }
  },
  watch: {
    defaultValue(val) {
      this.$emit('change', val);
    }
  }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(3)(
  /* script */
  __webpack_require__(1),
  /* template */
  __webpack_require__(4),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "F:\\vue\\vue-caliper\\src\\vue-caliper.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-caliper.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6373cb5e", Component.options)
  } else {
    hotAPI.reload("data-v-6373cb5e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "caliper",
    staticClass: "caliper",
    staticStyle: {
      "overflow": "hidden"
    }
  }, [_c('canvas', {
    ref: "canv",
    style: ({
      transitionDuration: _vm.transitions + 'ms',
      transform: 'translate3d(' + _vm.translateLeft + 'px, 0px, 0px)'
    }),
    attrs: {
      "width": _vm.widths,
      "height": "70"
    },
    on: {
      "touchstart": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        _vm.canvasStart($event)
      },
      "touchmove": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        _vm.canvasMove($event)
      },
      "touchend": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        _vm.canvasEnd($event)
      },
      "transitionend": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        _vm.transitionEnd($event)
      }
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6373cb5e", module.exports)
  }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});