import { openBlock, createElementBlock, renderSlot, createCommentVNode, createElementVNode, createStaticVNode, Fragment, renderList, normalizeClass, normalizeStyle, toDisplayString, resolveComponent, createVNode } from 'vue';

function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10);
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }
}
function debounce(delay, callback) {
  let lastTime;
  return function () {
    clearTimeout(lastTime);
    const [that, args] = [this, arguments];
    lastTime = setTimeout(() => {
      callback.apply(that, args);
    }, delay);
  };
}
function observerDomResize(dom, callback) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const observer = new MutationObserver(callback);
  observer.observe(dom, {
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true
  });
  return observer;
}
function getPointDistance(pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0]);
  const minusY = Math.abs(pointOne[1] - pointTwo[1]);
  return Math.sqrt(minusX * minusX + minusY * minusY);
}
function uuid(hasHyphen) {
  return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

var autoResize = {
  data() {
    return {
      dom: '',
      width: 0,
      height: 0,
      debounceInitWHFun: '',
      domObserver: ''
    };
  },
  methods: {
    async autoResizeMixinInit() {
      const {
        initWH,
        getDebounceInitWHFun,
        bindDomResizeCallback,
        afterAutoResizeMixinInit
      } = this;
      await initWH(false);
      getDebounceInitWHFun();
      bindDomResizeCallback();
      if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit();
    },
    initWH(resize = true) {
      const {
        $nextTick,
        $refs,
        ref,
        onResize
      } = this;
      return new Promise(resolve => {
        $nextTick(_ => {
          const dom = this.dom = $refs[ref];
          this.width = dom ? dom.clientWidth : 0;
          this.height = dom ? dom.clientHeight : 0;
          if (!dom) {
            console.warn('DataV: Failed to get dom node, component rendering may be abnormal!');
          } else if (!this.width || !this.height) {
            console.warn('DataV: Component width or height is 0px, rendering abnormality may occur!');
          }
          if (typeof onResize === 'function' && resize) onResize();
          resolve();
        });
      });
    },
    getDebounceInitWHFun() {
      const {
        initWH
      } = this;
      this.debounceInitWHFun = debounce(100, initWH);
    },
    bindDomResizeCallback() {
      const {
        dom,
        debounceInitWHFun
      } = this;
      this.domObserver = observerDomResize(dom, debounceInitWHFun);
      window.addEventListener('resize', debounceInitWHFun);
    },
    unbindDomResizeCallback() {
      let {
        domObserver,
        debounceInitWHFun
      } = this;
      if (!domObserver) return;
      domObserver.disconnect();
      domObserver.takeRecords();
      domObserver = null;
      window.removeEventListener('resize', debounceInitWHFun);
    }
  },
  mounted() {
    const {
      autoResizeMixinInit
    } = this;
    autoResizeMixinInit();
  },
  beforeDestroy() {
    const {
      unbindDomResizeCallback
    } = this;
    unbindDomResizeCallback();
  }
};

var script$B = {
  name: 'DvFullScreenContainer',
  mixins: [autoResize],
  data() {
    return {
      ref: 'full-screen-container',
      allWidth: 0,
      scale: 0,
      datavRoot: '',
      ready: false
    };
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        initConfig,
        setAppScale
      } = this;
      initConfig();
      setAppScale();
      this.ready = true;
    },
    initConfig() {
      const {
        dom
      } = this;
      const {
        width,
        height
      } = screen;
      this.allWidth = width;
      dom.style.width = `${width}px`;
      dom.style.height = `${height}px`;
    },
    setAppScale() {
      const {
        allWidth,
        dom
      } = this;
      const currentWidth = document.body.clientWidth;
      dom.style.transform = `scale(${currentWidth / allWidth})`;
    },
    onResize() {
      const {
        setAppScale
      } = this;
      setAppScale();
    }
  }
};

function render$B(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: "dv-full-screen-container",
    ref: $data.ref
  }, [$data.ready ? renderSlot(_ctx.$slots, "default", {
    key: 0
  }) : createCommentVNode("v-if", true)], 512 /* NEED_PATCH */);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$B = "#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n";
styleInject(css_248z$B);

script$B.render = render$B;
script$B.__file = "src/components/fullScreenContainer/src/main.vue";

function fullScreenContainer (Vue) {
  Vue.component(script$B.name, script$B);
}

var script$A = {
  name: 'DvLoading'
};

const _hoisted_1$z = {
  class: "dv-loading"
};
const _hoisted_2$z = /*#__PURE__*/createStaticVNode("<svg width=\"50px\" height=\"50px\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"transparent\" stroke-width=\"3\" stroke-dasharray=\"31.415, 31.415\" stroke=\"#02bcfe\" stroke-linecap=\"round\"><animateTransform attributeName=\"transform\" type=\"rotate\" values=\"0, 25 25;360, 25 25\" dur=\"1.5s\" repeatCount=\"indefinite\"></animateTransform><animate attributeName=\"stroke\" values=\"#02bcfe;#3be6cb;#02bcfe\" dur=\"3s\" repeatCount=\"indefinite\"></animate></circle><circle cx=\"25\" cy=\"25\" r=\"10\" fill=\"transparent\" stroke-width=\"3\" stroke-dasharray=\"15.7, 15.7\" stroke=\"#3be6cb\" stroke-linecap=\"round\"><animateTransform attributeName=\"transform\" type=\"rotate\" values=\"360, 25 25;0, 25 25\" dur=\"1.5s\" repeatCount=\"indefinite\"></animateTransform><animate attributeName=\"stroke\" values=\"#3be6cb;#02bcfe;#3be6cb\" dur=\"3s\" repeatCount=\"indefinite\"></animate></circle></svg>", 1);
const _hoisted_3$x = {
  class: "loading-tip"
};
function render$A(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$z, [_hoisted_2$z, createElementVNode("div", _hoisted_3$x, [renderSlot(_ctx.$slots, "default")])]);
}

var css_248z$A = ".dv-loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-loading .loading-tip {\n  font-size: 15px;\n}\n";
styleInject(css_248z$A);

script$A.render = render$A;
script$A.__file = "src/components/loading/src/main.vue";

function loading (Vue) {
  Vue.component(script$A.name, script$A);
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(interopRequireDefault);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayLikeToArray);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toConsumableArray);

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(_typeof_1);

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArrayLimit);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(slicedToArray);

var util$1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepClone = deepClone;
exports.eliminateBlur = eliminateBlur;
exports.checkPointIsInCircle = checkPointIsInCircle;
exports.getTwoPointDistance = getTwoPointDistance;
exports.checkPointIsInPolygon = checkPointIsInPolygon;
exports.checkPointIsInSector = checkPointIsInSector;
exports.checkPointIsNearPolyline = checkPointIsNearPolyline;
exports.checkPointIsInRect = checkPointIsInRect;
exports.getRotatePointPos = getRotatePointPos;
exports.getScalePointPos = getScalePointPos;
exports.getTranslatePointPos = getTranslatePointPos;
exports.getDistanceBetweenPointAndLine = getDistanceBetweenPointAndLine;
exports.getCircleRadianPoint = getCircleRadianPoint;
exports.getRegularPolygonPoints = getRegularPolygonPoints;
exports["default"] = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _typeof2 = interopRequireDefault(_typeof_1);

var abs = Math.abs,
    sqrt = Math.sqrt,
    sin = Math.sin,
    cos = Math.cos,
    max = Math.max,
    min = Math.min,
    PI = Math.PI;
/**
 * @description Clone an object or array
 * @param {Object|Array} object Cloned object
 * @param {Boolean} recursion   Whether to use recursive cloning
 * @return {Object|Array} Clone object
 */

function deepClone(object) {
  var recursion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!object) return object;
  var parse = JSON.parse,
      stringify = JSON.stringify;
  if (!recursion) return parse(stringify(object));
  var clonedObj = object instanceof Array ? [] : {};

  if (object && (0, _typeof2["default"])(object) === 'object') {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] && (0, _typeof2["default"])(object[key]) === 'object') {
          clonedObj[key] = deepClone(object[key], true);
        } else {
          clonedObj[key] = object[key];
        }
      }
    }
  }

  return clonedObj;
}
/**
 * @description Eliminate line blur due to 1px line width
 * @param {Array} points Line points
 * @return {Array} Line points after processed
 */


function eliminateBlur(points) {
  return points.map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return [parseInt(x) + 0.5, parseInt(y) + 0.5];
  });
}
/**
 * @description Check if the point is inside the circle
 * @param {Array} point Postion of point
 * @param {Number} rx   Circle x coordinate
 * @param {Number} ry   Circle y coordinate
 * @param {Number} r    Circle radius
 * @return {Boolean} Result of check
 */


function checkPointIsInCircle(point, rx, ry, r) {
  return getTwoPointDistance(point, [rx, ry]) <= r;
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 point1
 * @param {Array} point2 point2
 * @return {Number} Distance between two points
 */


function getTwoPointDistance(_ref3, _ref4) {
  var _ref5 = (0, _slicedToArray2["default"])(_ref3, 2),
      xa = _ref5[0],
      ya = _ref5[1];

  var _ref6 = (0, _slicedToArray2["default"])(_ref4, 2),
      xb = _ref6[0],
      yb = _ref6[1];

  var minusX = abs(xa - xb);
  var minusY = abs(ya - yb);
  return sqrt(minusX * minusX + minusY * minusY);
}
/**
 * @description Check if the point is inside the polygon
 * @param {Array} point  Postion of point
 * @param {Array} points The points that makes up a polyline
 * @return {Boolean} Result of check
 */


function checkPointIsInPolygon(point, polygon) {
  var counter = 0;

  var _point = (0, _slicedToArray2["default"])(point, 2),
      x = _point[0],
      y = _point[1];

  var pointNum = polygon.length;

  for (var i = 1, p1 = polygon[0]; i <= pointNum; i++) {
    var p2 = polygon[i % pointNum];

    if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
      if (y <= max(p1[1], p2[1])) {
        if (p1[0] !== p2[0]) {
          var xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1];

          if (p1[1] === p2[1] || y <= xinters) {
            counter++;
          }
        }
      }
    }

    p1 = p2;
  }

  return counter % 2 === 1;
}
/**
 * @description Check if the point is inside the sector
 * @param {Array} point       Postion of point
 * @param {Number} rx         Sector x coordinate
 * @param {Number} ry         Sector y coordinate
 * @param {Number} r          Sector radius
 * @param {Number} startAngle Sector start angle
 * @param {Number} endAngle   Sector end angle
 * @param {Boolean} clockWise Whether the sector angle is clockwise
 * @return {Boolean} Result of check
 */


function checkPointIsInSector(point, rx, ry, r, startAngle, endAngle, clockWise) {
  if (!point) return false;
  if (getTwoPointDistance(point, [rx, ry]) > r) return false;

  if (!clockWise) {
    var _deepClone = deepClone([endAngle, startAngle]);

    var _deepClone2 = (0, _slicedToArray2["default"])(_deepClone, 2);

    startAngle = _deepClone2[0];
    endAngle = _deepClone2[1];
  }

  var reverseBE = startAngle > endAngle;

  if (reverseBE) {
    var _ref7 = [endAngle, startAngle];
    startAngle = _ref7[0];
    endAngle = _ref7[1];
  }

  var minus = endAngle - startAngle;
  if (minus >= PI * 2) return true;

  var _point2 = (0, _slicedToArray2["default"])(point, 2),
      x = _point2[0],
      y = _point2[1];

  var _getCircleRadianPoint = getCircleRadianPoint(rx, ry, r, startAngle),
      _getCircleRadianPoint2 = (0, _slicedToArray2["default"])(_getCircleRadianPoint, 2),
      bx = _getCircleRadianPoint2[0],
      by = _getCircleRadianPoint2[1];

  var _getCircleRadianPoint3 = getCircleRadianPoint(rx, ry, r, endAngle),
      _getCircleRadianPoint4 = (0, _slicedToArray2["default"])(_getCircleRadianPoint3, 2),
      ex = _getCircleRadianPoint4[0],
      ey = _getCircleRadianPoint4[1];

  var vPoint = [x - rx, y - ry];
  var vBArm = [bx - rx, by - ry];
  var vEArm = [ex - rx, ey - ry];
  var reverse = minus > PI;

  if (reverse) {
    var _deepClone3 = deepClone([vEArm, vBArm]);

    var _deepClone4 = (0, _slicedToArray2["default"])(_deepClone3, 2);

    vBArm = _deepClone4[0];
    vEArm = _deepClone4[1];
  }

  var inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint);
  if (reverse) inSector = !inSector;
  if (reverseBE) inSector = !inSector;
  return inSector;
}
/**
 * @description Determine if the point is in the clockwise direction of the vector
 * @param {Array} vArm   Vector
 * @param {Array} vPoint Point
 * @return {Boolean} Result of check
 */


function isClockWise(vArm, vPoint) {
  var _vArm = (0, _slicedToArray2["default"])(vArm, 2),
      ax = _vArm[0],
      ay = _vArm[1];

  var _vPoint = (0, _slicedToArray2["default"])(vPoint, 2),
      px = _vPoint[0],
      py = _vPoint[1];

  return -ay * px + ax * py > 0;
}
/**
 * @description Check if the point is inside the polyline
 * @param {Array} point      Postion of point
 * @param {Array} polyline   The points that makes up a polyline
 * @param {Number} lineWidth Polyline linewidth
 * @return {Boolean} Result of check
 */


function checkPointIsNearPolyline(point, polyline, lineWidth) {
  var halfLineWidth = lineWidth / 2;
  var moveUpPolyline = polyline.map(function (_ref8) {
    var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
        x = _ref9[0],
        y = _ref9[1];

    return [x, y - halfLineWidth];
  });
  var moveDownPolyline = polyline.map(function (_ref10) {
    var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
        x = _ref11[0],
        y = _ref11[1];

    return [x, y + halfLineWidth];
  });
  var polygon = [].concat((0, _toConsumableArray2["default"])(moveUpPolyline), (0, _toConsumableArray2["default"])(moveDownPolyline.reverse()));
  return checkPointIsInPolygon(point, polygon);
}
/**
 * @description Check if the point is inside the rect
 * @param {Array} point   Postion of point
 * @param {Number} x      Rect start x coordinate
 * @param {Number} y      Rect start y coordinate
 * @param {Number} width  Rect width
 * @param {Number} height Rect height
 * @return {Boolean} Result of check
 */


function checkPointIsInRect(_ref12, x, y, width, height) {
  var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
      px = _ref13[0],
      py = _ref13[1];

  if (px < x) return false;
  if (py < y) return false;
  if (px > x + width) return false;
  if (py > y + height) return false;
  return true;
}
/**
 * @description Get the coordinates of the rotated point
 * @param {Number} rotate Degree of rotation
 * @param {Array} point   Postion of point
 * @param {Array} origin  Rotation center
 * @param {Array} origin  Rotation center
 * @return {Number} Coordinates after rotation
 */


function getRotatePointPos() {
  var rotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var point = arguments.length > 1 ? arguments[1] : undefined;
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  if (!point) return false;
  if (rotate % 360 === 0) return point;

  var _point3 = (0, _slicedToArray2["default"])(point, 2),
      x = _point3[0],
      y = _point3[1];

  var _origin = (0, _slicedToArray2["default"])(origin, 2),
      ox = _origin[0],
      oy = _origin[1];

  rotate *= PI / 180;
  return [(x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox, (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy];
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} scale  Scale factor
 * @param {Array} point  Postion of point
 * @param {Array} origin Scale center
 * @return {Number} Coordinates after scale
 */


function getScalePointPos() {
  var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1];
  var point = arguments.length > 1 ? arguments[1] : undefined;
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  if (!point) return false;
  if (scale === 1) return point;

  var _point4 = (0, _slicedToArray2["default"])(point, 2),
      x = _point4[0],
      y = _point4[1];

  var _origin2 = (0, _slicedToArray2["default"])(origin, 2),
      ox = _origin2[0],
      oy = _origin2[1];

  var _scale = (0, _slicedToArray2["default"])(scale, 2),
      xs = _scale[0],
      ys = _scale[1];

  var relativePosX = x - ox;
  var relativePosY = y - oy;
  return [relativePosX * xs + ox, relativePosY * ys + oy];
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} translate Translation distance
 * @param {Array} point     Postion of point
 * @return {Number} Coordinates after translation
 */


function getTranslatePointPos(translate, point) {
  if (!translate || !point) return false;

  var _point5 = (0, _slicedToArray2["default"])(point, 2),
      x = _point5[0],
      y = _point5[1];

  var _translate = (0, _slicedToArray2["default"])(translate, 2),
      tx = _translate[0],
      ty = _translate[1];

  return [x + tx, y + ty];
}
/**
 * @description Get the distance from the point to the line
 * @param {Array} point     Postion of point
 * @param {Array} lineBegin Line start position
 * @param {Array} lineEnd   Line end position
 * @return {Number} Distance between point and line
 */


function getDistanceBetweenPointAndLine(point, lineBegin, lineEnd) {
  if (!point || !lineBegin || !lineEnd) return false;

  var _point6 = (0, _slicedToArray2["default"])(point, 2),
      x = _point6[0],
      y = _point6[1];

  var _lineBegin = (0, _slicedToArray2["default"])(lineBegin, 2),
      x1 = _lineBegin[0],
      y1 = _lineBegin[1];

  var _lineEnd = (0, _slicedToArray2["default"])(lineEnd, 2),
      x2 = _lineEnd[0],
      y2 = _lineEnd[1];

  var a = y2 - y1;
  var b = x1 - x2;
  var c = y1 * (x2 - x1) - x1 * (y2 - y1);
  var molecule = abs(a * x + b * y + c);
  var denominator = sqrt(a * a + b * b);
  return molecule / denominator;
}
/**
 * @description Get the coordinates of the specified radian on the circle
 * @param {Number} x      Circle x coordinate
 * @param {Number} y      Circle y coordinate
 * @param {Number} radius Circle radius
 * @param {Number} radian Specfied radian
 * @return {Array} Postion of point
 */


function getCircleRadianPoint(x, y, radius, radian) {
  return [x + cos(radian) * radius, y + sin(radian) * radius];
}
/**
 * @description Get the points that make up a regular polygon
 * @param {Number} x     X coordinate of the polygon inscribed circle
 * @param {Number} y     Y coordinate of the polygon inscribed circle
 * @param {Number} r     Radius of the polygon inscribed circle
 * @param {Number} side  Side number
 * @param {Number} minus Radian offset
 * @return {Array} Points that make up a regular polygon
 */


function getRegularPolygonPoints(rx, ry, r, side) {
  var minus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PI * -0.5;
  var radianGap = PI * 2 / side;
  var radians = new Array(side).fill('').map(function (t, i) {
    return i * radianGap + minus;
  });
  return radians.map(function (radian) {
    return getCircleRadianPoint(rx, ry, r, radian);
  });
}

var _default = {
  deepClone: deepClone,
  eliminateBlur: eliminateBlur,
  checkPointIsInCircle: checkPointIsInCircle,
  checkPointIsInPolygon: checkPointIsInPolygon,
  checkPointIsInSector: checkPointIsInSector,
  checkPointIsNearPolyline: checkPointIsNearPolyline,
  getTwoPointDistance: getTwoPointDistance,
  getRotatePointPos: getRotatePointPos,
  getScalePointPos: getScalePointPos,
  getTranslatePointPos: getTranslatePointPos,
  getCircleRadianPoint: getCircleRadianPoint,
  getRegularPolygonPoints: getRegularPolygonPoints,
  getDistanceBetweenPointAndLine: getDistanceBetweenPointAndLine
};
exports["default"] = _default;
});

unwrapExports(util$1);
var util_1 = util$1.deepClone;
util$1.eliminateBlur;
util$1.checkPointIsInCircle;
util$1.getTwoPointDistance;
util$1.checkPointIsInPolygon;
util$1.checkPointIsInSector;
util$1.checkPointIsNearPolyline;
util$1.checkPointIsInRect;
util$1.getRotatePointPos;
util$1.getScalePointPos;
util$1.getTranslatePointPos;
util$1.getDistanceBetweenPointAndLine;
var util_13 = util$1.getCircleRadianPoint;
util$1.getRegularPolygonPoints;

var util = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterNonNumber = filterNonNumber;
exports.deepMerge = deepMerge;
exports.mulAdd = mulAdd;
exports.mergeSameStackData = mergeSameStackData;
exports.getTwoPointDistance = getTwoPointDistance;
exports.getLinearGradientColor = getLinearGradientColor;
exports.getPolylineLength = getPolylineLength;
exports.getPointToLineDistance = getPointToLineDistance;
exports.initNeedSeries = initNeedSeries;
exports.radianToAngle = radianToAngle;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _typeof2 = interopRequireDefault(_typeof_1);



function filterNonNumber(array) {
  return array.filter(function (n) {
    return typeof n === 'number';
  });
}

function deepMerge(target, merged) {
  for (var key in merged) {
    if (target[key] && (0, _typeof2["default"])(target[key]) === 'object') {
      deepMerge(target[key], merged[key]);
      continue;
    }

    if ((0, _typeof2["default"])(merged[key]) === 'object') {
      target[key] = (0, util$1.deepClone)(merged[key], true);
      continue;
    }

    target[key] = merged[key];
  }

  return target;
}

function mulAdd(nums) {
  nums = filterNonNumber(nums);
  return nums.reduce(function (all, num) {
    return all + num;
  }, 0);
}

function mergeSameStackData(item, series) {
  var stack = item.stack;
  if (!stack) return (0, _toConsumableArray2["default"])(item.data);
  var stacks = series.filter(function (_ref) {
    var s = _ref.stack;
    return s === stack;
  });
  var index = stacks.findIndex(function (_ref2) {
    var d = _ref2.data;
    return d === item.data;
  });
  var datas = stacks.splice(0, index + 1).map(function (_ref3) {
    var data = _ref3.data;
    return data;
  });
  var dataLength = datas[0].length;
  return new Array(dataLength).fill(0).map(function (foo, i) {
    return mulAdd(datas.map(function (d) {
      return d[i];
    }));
  });
}

function getTwoPointDistance(pointOne, pointTwo) {
  var minusX = Math.abs(pointOne[0] - pointTwo[0]);
  var minusY = Math.abs(pointOne[1] - pointTwo[1]);
  return Math.sqrt(minusX * minusX + minusY * minusY);
}

function getLinearGradientColor(ctx, begin, end, color) {
  if (!ctx || !begin || !end || !color.length) return;
  var colors = color;
  typeof colors === 'string' && (colors = [color, color]);
  var linearGradientColor = ctx.createLinearGradient.apply(ctx, (0, _toConsumableArray2["default"])(begin).concat((0, _toConsumableArray2["default"])(end)));
  var colorGap = 1 / (colors.length - 1);
  colors.forEach(function (c, i) {
    return linearGradientColor.addColorStop(colorGap * i, c);
  });
  return linearGradientColor;
}

function getPolylineLength(points) {
  var lineSegments = new Array(points.length - 1).fill(0).map(function (foo, i) {
    return [points[i], points[i + 1]];
  });
  var lengths = lineSegments.map(function (item) {
    return getTwoPointDistance.apply(void 0, (0, _toConsumableArray2["default"])(item));
  });
  return mulAdd(lengths);
}

function getPointToLineDistance(point, linePointOne, linePointTwo) {
  var a = getTwoPointDistance(point, linePointOne);
  var b = getTwoPointDistance(point, linePointTwo);
  var c = getTwoPointDistance(linePointOne, linePointTwo);
  return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c;
}

function initNeedSeries(series, config, type) {
  series = series.filter(function (_ref4) {
    var st = _ref4.type;
    return st === type;
  });
  series = series.map(function (item) {
    return deepMerge((0, util$1.deepClone)(config, true), item);
  });
  return series.filter(function (_ref5) {
    var show = _ref5.show;
    return show;
  });
}

function radianToAngle(radian) {
  return radian / Math.PI * 180;
}
});

unwrapExports(util);
util.filterNonNumber;
var util_2 = util.deepMerge;
util.mulAdd;
util.mergeSameStackData;
util.getTwoPointDistance;
util.getLinearGradientColor;
var util_7 = util.getPolylineLength;
util.getPointToLineDistance;
util.initNeedSeries;
util.radianToAngle;

var script$z = {
  name: "DvBorderBox1",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: "transparent"
    }
  },
  data() {
    return {
      ref: "border-box-1",
      border: ["left-top", "right-top", "left-bottom", "right-bottom"],
      defaultColor: ["#4fd2dd", "#235fa7"],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$y = ["width", "height"];
const _hoisted_2$y = ["fill", "points"];
const _hoisted_3$w = ["fill"];
const _hoisted_4$t = ["values"];
const _hoisted_5$q = ["fill"];
const _hoisted_6$n = ["values"];
const _hoisted_7$m = ["fill"];
const _hoisted_8$h = ["values"];
const _hoisted_9$g = {
  class: "border-box-content"
};
function render$z(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-1",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "border",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `10, 27 10, ${_ctx.height - 27} 13, ${_ctx.height - 24} 13, ${_ctx.height - 21} 24, ${_ctx.height - 11}
      38, ${_ctx.height - 11} 41, ${_ctx.height - 8} 73, ${_ctx.height - 8} 75, ${_ctx.height - 10} 81, ${_ctx.height - 10}
      85, ${_ctx.height - 6} ${_ctx.width - 85}, ${_ctx.height - 6} ${_ctx.width - 81}, ${_ctx.height - 10} ${_ctx.width - 75}, ${_ctx.height - 10}
      ${_ctx.width - 73}, ${_ctx.height - 8} ${_ctx.width - 41}, ${_ctx.height - 8} ${_ctx.width - 38}, ${_ctx.height - 11}
      ${_ctx.width - 24}, ${_ctx.height - 11} ${_ctx.width - 13}, ${_ctx.height - 21} ${_ctx.width - 13}, ${_ctx.height - 24}
      ${_ctx.width - 10}, ${_ctx.height - 27} ${_ctx.width - 10}, 27 ${_ctx.width - 13}, 25 ${_ctx.width - 13}, 21
      ${_ctx.width - 24}, 11 ${_ctx.width - 38}, 11 ${_ctx.width - 41}, 8 ${_ctx.width - 73}, 8 ${_ctx.width - 75}, 10
      ${_ctx.width - 81}, 10 ${_ctx.width - 85}, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24`
  }, null, 8 /* PROPS */, _hoisted_2$y)], 8 /* PROPS */, _hoisted_1$y)), (openBlock(true), createElementBlock(Fragment, null, renderList($data.border, item => {
    return openBlock(), createElementBlock("svg", {
      width: "150px",
      height: "150px",
      key: item,
      class: normalizeClass(`${item} border`)
    }, [createElementVNode("polygon", {
      fill: $data.mergedColor[0],
      points: "6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
    }, [createElementVNode("animate", {
      attributeName: "fill",
      values: `${$data.mergedColor[0]};${$data.mergedColor[1]};${$data.mergedColor[0]}`,
      dur: "0.5s",
      begin: "0s",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_4$t)], 8 /* PROPS */, _hoisted_3$w), createElementVNode("polygon", {
      fill: $data.mergedColor[1],
      points: "27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
    }, [createElementVNode("animate", {
      attributeName: "fill",
      values: `${$data.mergedColor[1]};${$data.mergedColor[0]};${$data.mergedColor[1]}`,
      dur: "0.5s",
      begin: "0s",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_6$n)], 8 /* PROPS */, _hoisted_5$q), createElementVNode("polygon", {
      fill: $data.mergedColor[0],
      points: "9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
    }, [createElementVNode("animate", {
      attributeName: "fill",
      values: `${$data.mergedColor[0]};${$data.mergedColor[1]};transparent`,
      dur: "1s",
      begin: "0s",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_8$h)], 8 /* PROPS */, _hoisted_7$m)], 2 /* CLASS */);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("div", _hoisted_9$g, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$z = ".dv-border-box-1 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-1 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-1 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-1 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-1 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-1 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$z);

script$z.render = render$z;
script$z.__file = "src/components/borderBox1/src/main.vue";

function borderBox1 (Vue) {
  Vue.component(script$z.name, script$z);
}

var script$y = {
  name: 'DvBorderBox2',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-2',
      defaultColor: ['#fff', 'rgba(255, 255, 255, 0.6)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$x = ["width", "height"];
const _hoisted_2$x = ["fill", "points"];
const _hoisted_3$v = ["stroke", "points"];
const _hoisted_4$s = ["stroke", "points"];
const _hoisted_5$p = ["fill"];
const _hoisted_6$m = ["fill", "cx"];
const _hoisted_7$l = ["fill", "cx", "cy"];
const _hoisted_8$g = ["fill", "cy"];
const _hoisted_9$f = {
  class: "border-box-content"
};
function render$y(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-2",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        7, 7 ${_ctx.width - 7}, 7 ${_ctx.width - 7}, ${_ctx.height - 7} 7, ${_ctx.height - 7}
      `
  }, null, 8 /* PROPS */, _hoisted_2$x), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `2, 2 ${_ctx.width - 2} ,2 ${_ctx.width - 2}, ${_ctx.height - 2} 2, ${_ctx.height - 2} 2, 2`
  }, null, 8 /* PROPS */, _hoisted_3$v), createElementVNode("polyline", {
    stroke: $data.mergedColor[1],
    points: `6, 6 ${_ctx.width - 6}, 6 ${_ctx.width - 6}, ${_ctx.height - 6} 6, ${_ctx.height - 6} 6, 6`
  }, null, 8 /* PROPS */, _hoisted_4$s), createElementVNode("circle", {
    fill: $data.mergedColor[0],
    cx: "11",
    cy: "11",
    r: "1"
  }, null, 8 /* PROPS */, _hoisted_5$p), createElementVNode("circle", {
    fill: $data.mergedColor[0],
    cx: _ctx.width - 11,
    cy: "11",
    r: "1"
  }, null, 8 /* PROPS */, _hoisted_6$m), createElementVNode("circle", {
    fill: $data.mergedColor[0],
    cx: _ctx.width - 11,
    cy: _ctx.height - 11,
    r: "1"
  }, null, 8 /* PROPS */, _hoisted_7$l), createElementVNode("circle", {
    fill: $data.mergedColor[0],
    cx: "11",
    cy: _ctx.height - 11,
    r: "1"
  }, null, 8 /* PROPS */, _hoisted_8$g)], 8 /* PROPS */, _hoisted_1$x)), createElementVNode("div", _hoisted_9$f, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$y = ".dv-border-box-2 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-2 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-2 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-2 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$y);

script$y.render = render$y;
script$y.__file = "src/components/borderBox2/src/main.vue";

function borderBox2 (Vue) {
  Vue.component(script$y.name, script$y);
}

var script$x = {
  name: 'DvBorderBox3',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-3',
      defaultColor: ['#2862b7', '#2862b7'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$w = ["width", "height"];
const _hoisted_2$w = ["fill", "points"];
const _hoisted_3$u = ["stroke", "points"];
const _hoisted_4$r = ["stroke", "points"];
const _hoisted_5$o = ["stroke", "points"];
const _hoisted_6$l = ["stroke", "points"];
const _hoisted_7$k = {
  class: "border-box-content"
};
function render$x(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-3",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        23, 23 ${_ctx.width - 24}, 23 ${_ctx.width - 24}, ${_ctx.height - 24} 23, ${_ctx.height - 24}
      `
  }, null, 8 /* PROPS */, _hoisted_2$w), createElementVNode("polyline", {
    class: "dv-bb3-line1",
    stroke: $data.mergedColor[0],
    points: `4, 4 ${_ctx.width - 22} ,4 ${_ctx.width - 22}, ${_ctx.height - 22} 4, ${_ctx.height - 22} 4, 4`
  }, null, 8 /* PROPS */, _hoisted_3$u), createElementVNode("polyline", {
    class: "dv-bb3-line2",
    stroke: $data.mergedColor[1],
    points: `10, 10 ${_ctx.width - 16}, 10 ${_ctx.width - 16}, ${_ctx.height - 16} 10, ${_ctx.height - 16} 10, 10`
  }, null, 8 /* PROPS */, _hoisted_4$r), createElementVNode("polyline", {
    class: "dv-bb3-line2",
    stroke: $data.mergedColor[1],
    points: `16, 16 ${_ctx.width - 10}, 16 ${_ctx.width - 10}, ${_ctx.height - 10} 16, ${_ctx.height - 10} 16, 16`
  }, null, 8 /* PROPS */, _hoisted_5$o), createElementVNode("polyline", {
    class: "dv-bb3-line2",
    stroke: $data.mergedColor[1],
    points: `22, 22 ${_ctx.width - 4}, 22 ${_ctx.width - 4}, ${_ctx.height - 4} 22, ${_ctx.height - 4} 22, 22`
  }, null, 8 /* PROPS */, _hoisted_6$l)], 8 /* PROPS */, _hoisted_1$w)), createElementVNode("div", _hoisted_7$k, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$x = ".dv-border-box-3 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-3 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-3 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-3 .dv-bb3-line1 {\n  stroke-width: 3;\n}\n.dv-border-box-3 .dv-bb3-line2 {\n  stroke-width: 1;\n}\n.dv-border-box-3 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$x);

script$x.render = render$x;
script$x.__file = "src/components/borderBox3/src/main.vue";

function borderBox3 (Vue) {
  Vue.component(script$x.name, script$x);
}

var script$w = {
  name: "DvBorderBox4",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    reverse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "transparent"
    }
  },
  data() {
    return {
      ref: "border-box-4",
      defaultColor: ["red", "rgba(0,0,255,0.8)"],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$v = ["width", "height"];
const _hoisted_2$v = ["fill", "points"];
const _hoisted_3$t = ["stroke", "points"];
const _hoisted_4$q = ["stroke", "points"];
const _hoisted_5$n = ["stroke", "points"];
const _hoisted_6$k = ["stroke"];
const _hoisted_7$j = ["stroke"];
const _hoisted_8$f = ["stroke"];
const _hoisted_9$e = ["stroke"];
const _hoisted_10$c = ["stroke"];
const _hoisted_11$a = ["stroke", "points"];
const _hoisted_12$9 = ["stroke", "points"];
const _hoisted_13$9 = {
  class: "border-box-content"
};
function render$w(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-4",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: normalizeClass(`dv-border-svg-container ${$props.reverse && 'dv-reverse'}`),
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        ${_ctx.width - 15}, 22 170, 22 150, 7 40, 7 28, 21 32, 24
        16, 42 16, ${_ctx.height - 32} 41, ${_ctx.height - 7} ${_ctx.width - 15}, ${_ctx.height - 7}
      `
  }, null, 8 /* PROPS */, _hoisted_2$v), createElementVNode("polyline", {
    class: "dv-bb4-line-1",
    stroke: $data.mergedColor[0],
    points: `145, ${_ctx.height - 5} 40, ${_ctx.height - 5} 10, ${_ctx.height - 35}
          10, 40 40, 5 150, 5 170, 20 ${_ctx.width - 15}, 20`
  }, null, 8 /* PROPS */, _hoisted_3$t), createElementVNode("polyline", {
    stroke: $data.mergedColor[1],
    class: "dv-bb4-line-2",
    points: `245, ${_ctx.height - 1} 36, ${_ctx.height - 1} 14, ${_ctx.height - 23}
          14, ${_ctx.height - 100}`
  }, null, 8 /* PROPS */, _hoisted_4$q), createElementVNode("polyline", {
    class: "dv-bb4-line-3",
    stroke: $data.mergedColor[0],
    points: `7, ${_ctx.height - 40} 7, ${_ctx.height - 75}`
  }, null, 8 /* PROPS */, _hoisted_5$n), createElementVNode("polyline", {
    class: "dv-bb4-line-4",
    stroke: $data.mergedColor[0],
    points: `28, 24 13, 41 13, 64`
  }, null, 8 /* PROPS */, _hoisted_6$k), createElementVNode("polyline", {
    class: "dv-bb4-line-5",
    stroke: $data.mergedColor[0],
    points: `5, 45 5, 140`
  }, null, 8 /* PROPS */, _hoisted_7$j), createElementVNode("polyline", {
    class: "dv-bb4-line-6",
    stroke: $data.mergedColor[1],
    points: `14, 75 14, 180`
  }, null, 8 /* PROPS */, _hoisted_8$f), createElementVNode("polyline", {
    class: "dv-bb4-line-7",
    stroke: $data.mergedColor[1],
    points: `55, 11 147, 11 167, 26 250, 26`
  }, null, 8 /* PROPS */, _hoisted_9$e), createElementVNode("polyline", {
    class: "dv-bb4-line-8",
    stroke: $data.mergedColor[1],
    points: `158, 5 173, 16`
  }, null, 8 /* PROPS */, _hoisted_10$c), createElementVNode("polyline", {
    class: "dv-bb4-line-9",
    stroke: $data.mergedColor[0],
    points: `200, 17 ${_ctx.width - 10}, 17`
  }, null, 8 /* PROPS */, _hoisted_11$a), createElementVNode("polyline", {
    class: "dv-bb4-line-10",
    stroke: $data.mergedColor[1],
    points: `385, 17 ${_ctx.width - 10}, 17`
  }, null, 8 /* PROPS */, _hoisted_12$9)], 10 /* CLASS, PROPS */, _hoisted_1$v)), createElementVNode("div", _hoisted_13$9, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$w = ".dv-border-box-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-4 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-4 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-4 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-4 .sw1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .sw3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-4 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-5 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-6 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-7 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-8 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-9 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n  stroke-dasharray: 100 250;\n}\n.dv-border-box-4 .dv-bb4-line-10 {\n  stroke-width: 1;\n  stroke-dasharray: 80 270;\n}\n.dv-border-box-4 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$w);

script$w.render = render$w;
script$w.__file = "src/components/borderBox4/src/main.vue";

function borderBox4 (Vue) {
  Vue.component(script$w.name, script$w);
}

var script$v = {
  name: 'DvBorderBox5',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    reverse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-5',
      defaultColor: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.20)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$u = ["width", "height"];
const _hoisted_2$u = ["fill", "points"];
const _hoisted_3$s = ["stroke", "points"];
const _hoisted_4$p = ["stroke", "points"];
const _hoisted_5$m = ["stroke", "points"];
const _hoisted_6$j = ["stroke", "points"];
const _hoisted_7$i = ["stroke", "points"];
const _hoisted_8$e = ["stroke", "points"];
const _hoisted_9$d = {
  class: "border-box-content"
};
function render$v(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-5",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: normalizeClass(`dv-border-svg-container  ${$props.reverse && 'dv-reverse'}`),
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        10, 22 ${_ctx.width - 22}, 22 ${_ctx.width - 22}, ${_ctx.height - 86} ${_ctx.width - 84}, ${_ctx.height - 24} 10, ${_ctx.height - 24}
      `
  }, null, 8 /* PROPS */, _hoisted_2$u), createElementVNode("polyline", {
    class: "dv-bb5-line-1",
    stroke: $data.mergedColor[0],
    points: `8, 5 ${_ctx.width - 5}, 5 ${_ctx.width - 5}, ${_ctx.height - 100}
          ${_ctx.width - 100}, ${_ctx.height - 5} 8, ${_ctx.height - 5} 8, 5`
  }, null, 8 /* PROPS */, _hoisted_3$s), createElementVNode("polyline", {
    class: "dv-bb5-line-2",
    stroke: $data.mergedColor[1],
    points: `3, 5 ${_ctx.width - 20}, 5 ${_ctx.width - 20}, ${_ctx.height - 60}
          ${_ctx.width - 74}, ${_ctx.height - 5} 3, ${_ctx.height - 5} 3, 5`
  }, null, 8 /* PROPS */, _hoisted_4$p), createElementVNode("polyline", {
    class: "dv-bb5-line-3",
    stroke: $data.mergedColor[1],
    points: `50, 13 ${_ctx.width - 35}, 13`
  }, null, 8 /* PROPS */, _hoisted_5$m), createElementVNode("polyline", {
    class: "dv-bb5-line-4",
    stroke: $data.mergedColor[1],
    points: `15, 20 ${_ctx.width - 35}, 20`
  }, null, 8 /* PROPS */, _hoisted_6$j), createElementVNode("polyline", {
    class: "dv-bb5-line-5",
    stroke: $data.mergedColor[1],
    points: `15, ${_ctx.height - 20} ${_ctx.width - 110}, ${_ctx.height - 20}`
  }, null, 8 /* PROPS */, _hoisted_7$i), createElementVNode("polyline", {
    class: "dv-bb5-line-6",
    stroke: $data.mergedColor[1],
    points: `15, ${_ctx.height - 13} ${_ctx.width - 110}, ${_ctx.height - 13}`
  }, null, 8 /* PROPS */, _hoisted_8$e)], 10 /* CLASS, PROPS */, _hoisted_1$u)), createElementVNode("div", _hoisted_9$d, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$v = ".dv-border-box-5 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-5 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-5 .dv-bb5-line-1,\n.dv-border-box-5 .dv-bb5-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-5 .dv-bb5-line-3,\n.dv-border-box-5 .dv-bb5-line-6 {\n  stroke-width: 5;\n}\n.dv-border-box-5 .dv-bb5-line-4,\n.dv-border-box-5 .dv-bb5-line-5 {\n  stroke-width: 2;\n}\n.dv-border-box-5 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$v);

script$v.render = render$v;
script$v.__file = "src/components/borderBox5/src/main.vue";

function borderBox5 (Vue) {
  Vue.component(script$v.name, script$v);
}

var script$u = {
  name: 'DvBorderBox6',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-6',
      defaultColor: ['rgba(255, 255, 255, 0.35)', 'gray'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$t = ["width", "height"];
const _hoisted_2$t = ["fill", "points"];
const _hoisted_3$r = ["fill"];
const _hoisted_4$o = ["fill", "cx"];
const _hoisted_5$l = ["fill", "cx", "cy"];
const _hoisted_6$i = ["fill", "cy"];
const _hoisted_7$h = ["stroke", "points"];
const _hoisted_8$d = ["stroke", "points"];
const _hoisted_9$c = ["stroke", "points"];
const _hoisted_10$b = ["stroke", "points"];
const _hoisted_11$9 = ["stroke"];
const _hoisted_12$8 = ["stroke"];
const _hoisted_13$8 = ["stroke", "points"];
const _hoisted_14$8 = ["stroke", "points"];
const _hoisted_15$6 = ["stroke", "points"];
const _hoisted_16$6 = ["stroke", "points"];
const _hoisted_17$6 = ["stroke", "points"];
const _hoisted_18$5 = ["stroke", "points"];
const _hoisted_19$5 = {
  class: "border-box-content"
};
function render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-6",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        9, 7 ${_ctx.width - 9}, 7 ${_ctx.width - 9}, ${_ctx.height - 7} 9, ${_ctx.height - 7}
      `
  }, null, 8 /* PROPS */, _hoisted_2$t), createElementVNode("circle", {
    fill: $data.mergedColor[1],
    cx: "5",
    cy: "5",
    r: "2"
  }, null, 8 /* PROPS */, _hoisted_3$r), createElementVNode("circle", {
    fill: $data.mergedColor[1],
    cx: _ctx.width - 5,
    cy: "5",
    r: "2"
  }, null, 8 /* PROPS */, _hoisted_4$o), createElementVNode("circle", {
    fill: $data.mergedColor[1],
    cx: _ctx.width - 5,
    cy: _ctx.height - 5,
    r: "2"
  }, null, 8 /* PROPS */, _hoisted_5$l), createElementVNode("circle", {
    fill: $data.mergedColor[1],
    cx: "5",
    cy: _ctx.height - 5,
    r: "2"
  }, null, 8 /* PROPS */, _hoisted_6$i), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `10, 4 ${_ctx.width - 10}, 4`
  }, null, 8 /* PROPS */, _hoisted_7$h), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `10, ${_ctx.height - 4} ${_ctx.width - 10}, ${_ctx.height - 4}`
  }, null, 8 /* PROPS */, _hoisted_8$d), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `5, 70 5, ${_ctx.height - 70}`
  }, null, 8 /* PROPS */, _hoisted_9$c), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 5}, 70 ${_ctx.width - 5}, ${_ctx.height - 70}`
  }, null, 8 /* PROPS */, _hoisted_10$b), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `3, 10, 3, 50`
  }, null, 8 /* PROPS */, _hoisted_11$9), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `7, 30 7, 80`
  }, null, 8 /* PROPS */, _hoisted_12$8), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 3}, 10 ${_ctx.width - 3}, 50`
  }, null, 8 /* PROPS */, _hoisted_13$8), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 7}, 30 ${_ctx.width - 7}, 80`
  }, null, 8 /* PROPS */, _hoisted_14$8), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `3, ${_ctx.height - 10} 3, ${_ctx.height - 50}`
  }, null, 8 /* PROPS */, _hoisted_15$6), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `7, ${_ctx.height - 30} 7, ${_ctx.height - 80}`
  }, null, 8 /* PROPS */, _hoisted_16$6), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 3}, ${_ctx.height - 10} ${_ctx.width - 3}, ${_ctx.height - 50}`
  }, null, 8 /* PROPS */, _hoisted_17$6), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 7}, ${_ctx.height - 30} ${_ctx.width - 7}, ${_ctx.height - 80}`
  }, null, 8 /* PROPS */, _hoisted_18$5)], 8 /* PROPS */, _hoisted_1$t)), createElementVNode("div", _hoisted_19$5, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$u = ".dv-border-box-6 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-6 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$u);

script$u.render = render$u;
script$u.__file = "src/components/borderBox6/src/main.vue";

function borderBox6 (Vue) {
  Vue.component(script$u.name, script$u);
}

var script$t = {
  name: 'DvBorderBox7',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-7',
      defaultColor: ['rgba(128,128,128,0.3)', 'rgba(128,128,128,0.5)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$s = ["width", "height"];
const _hoisted_2$s = ["stroke"];
const _hoisted_3$q = ["stroke", "points"];
const _hoisted_4$n = ["stroke", "points"];
const _hoisted_5$k = ["stroke", "points"];
const _hoisted_6$h = ["stroke"];
const _hoisted_7$g = ["stroke", "points"];
const _hoisted_8$c = ["stroke", "points"];
const _hoisted_9$b = ["stroke", "points"];
const _hoisted_10$a = {
  class: "border-box-content"
};
function render$t(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-7",
    style: normalizeStyle(`box-shadow: inset 0 0 40px ${$data.mergedColor[0]}; border: 1px solid ${$data.mergedColor[0]}; background-color: ${$props.backgroundColor}`),
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polyline", {
    class: "dv-bb7-line-width-2",
    stroke: $data.mergedColor[0],
    points: `0, 25 0, 0 25, 0`
  }, null, 8 /* PROPS */, _hoisted_2$s), createElementVNode("polyline", {
    class: "dv-bb7-line-width-2",
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 25}, 0 ${_ctx.width}, 0 ${_ctx.width}, 25`
  }, null, 8 /* PROPS */, _hoisted_3$q), createElementVNode("polyline", {
    class: "dv-bb7-line-width-2",
    stroke: $data.mergedColor[0],
    points: `${_ctx.width - 25}, ${_ctx.height} ${_ctx.width}, ${_ctx.height} ${_ctx.width}, ${_ctx.height - 25}`
  }, null, 8 /* PROPS */, _hoisted_4$n), createElementVNode("polyline", {
    class: "dv-bb7-line-width-2",
    stroke: $data.mergedColor[0],
    points: `0, ${_ctx.height - 25} 0, ${_ctx.height} 25, ${_ctx.height}`
  }, null, 8 /* PROPS */, _hoisted_5$k), createElementVNode("polyline", {
    class: "dv-bb7-line-width-5",
    stroke: $data.mergedColor[1],
    points: `0, 10 0, 0 10, 0`
  }, null, 8 /* PROPS */, _hoisted_6$h), createElementVNode("polyline", {
    class: "dv-bb7-line-width-5",
    stroke: $data.mergedColor[1],
    points: `${_ctx.width - 10}, 0 ${_ctx.width}, 0 ${_ctx.width}, 10`
  }, null, 8 /* PROPS */, _hoisted_7$g), createElementVNode("polyline", {
    class: "dv-bb7-line-width-5",
    stroke: $data.mergedColor[1],
    points: `${_ctx.width - 10}, ${_ctx.height} ${_ctx.width}, ${_ctx.height} ${_ctx.width}, ${_ctx.height - 10}`
  }, null, 8 /* PROPS */, _hoisted_8$c), createElementVNode("polyline", {
    class: "dv-bb7-line-width-5",
    stroke: $data.mergedColor[1],
    points: `0, ${_ctx.height - 10} 0, ${_ctx.height} 10, ${_ctx.height}`
  }, null, 8 /* PROPS */, _hoisted_9$b)], 8 /* PROPS */, _hoisted_1$s)), createElementVNode("div", _hoisted_10$a, [renderSlot(_ctx.$slots, "default")])], 4 /* STYLE */);
}

var css_248z$t = ".dv-border-box-7 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-linecap: round;\n}\n.dv-border-box-7 .dv-bb7-line-width-2 {\n  stroke-width: 2;\n}\n.dv-border-box-7 .dv-bb7-line-width-5 {\n  stroke-width: 5;\n}\n.dv-border-box-7 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$t);

script$t.render = render$t;
script$t.__file = "src/components/borderBox7/src/main.vue";

function borderBox7 (Vue) {
  Vue.component(script$t.name, script$t);
}

var script$s = {
  name: 'DvBorderBox8',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    dur: {
      type: Number,
      default: 3
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'border-box-8',
      path: `border-box-8-path-${id}`,
      gradient: `border-box-8-gradient-${id}`,
      mask: `border-box-8-mask-${id}`,
      defaultColor: ['#235fa7', '#4fd2dd'],
      mergedColor: []
    };
  },
  computed: {
    length() {
      const {
        width,
        height
      } = this;
      return (width + height - 5) * 2;
    },
    pathD() {
      const {
        reverse,
        width,
        height
      } = this;
      if (reverse) return `M 2.5, 2.5 L 2.5, ${height - 2.5} L ${width - 2.5}, ${height - 2.5} L ${width - 2.5}, 2.5 L 2.5, 2.5`;
      return `M2.5, 2.5 L${width - 2.5}, 2.5 L${width - 2.5}, ${height - 2.5} L2.5, ${height - 2.5} L2.5, 2.5`;
    }
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$r = ["width", "height"];
const _hoisted_2$r = ["id", "d"];
const _hoisted_3$p = ["id"];
const _hoisted_4$m = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "#fff",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_5$j = /*#__PURE__*/createElementVNode("stop", {
  offset: "100%",
  "stop-color": "#fff",
  "stop-opacity": "0"
}, null, -1 /* HOISTED */);
const _hoisted_6$g = [_hoisted_4$m, _hoisted_5$j];
const _hoisted_7$f = ["id"];
const _hoisted_8$b = ["fill"];
const _hoisted_9$a = ["dur", "path"];
const _hoisted_10$9 = ["fill", "points"];
const _hoisted_11$8 = ["stroke", "xlink:href"];
const _hoisted_12$7 = ["stroke", "xlink:href", "mask"];
const _hoisted_13$7 = ["from", "to", "dur"];
const _hoisted_14$7 = {
  class: "border-box-content"
};
function render$s(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-8",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("path", {
    id: $data.path,
    d: $options.pathD,
    fill: "transparent"
  }, null, 8 /* PROPS */, _hoisted_2$r), createElementVNode("radialGradient", {
    id: $data.gradient,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, _hoisted_6$g, 8 /* PROPS */, _hoisted_3$p), createElementVNode("mask", {
    id: $data.mask
  }, [createElementVNode("circle", {
    cx: "0",
    cy: "0",
    r: "150",
    fill: `url(#${$data.gradient})`
  }, [createElementVNode("animateMotion", {
    dur: `${$props.dur}s`,
    path: $options.pathD,
    rotate: "auto",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_9$a)], 8 /* PROPS */, _hoisted_8$b)], 8 /* PROPS */, _hoisted_7$f)]), createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `5, 5 ${_ctx.width - 5}, 5 ${_ctx.width - 5} ${_ctx.height - 5} 5, ${_ctx.height - 5}`
  }, null, 8 /* PROPS */, _hoisted_10$9), createElementVNode("use", {
    stroke: $data.mergedColor[0],
    "stroke-width": "1",
    "xlink:href": `#${$data.path}`
  }, null, 8 /* PROPS */, _hoisted_11$8), createElementVNode("use", {
    stroke: $data.mergedColor[1],
    "stroke-width": "3",
    "xlink:href": `#${$data.path}`,
    mask: `url(#${$data.mask})`
  }, [createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    from: `0, ${$options.length}`,
    to: `${$options.length}, 0`,
    dur: `${$props.dur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_13$7)], 8 /* PROPS */, _hoisted_12$7)], 8 /* PROPS */, _hoisted_1$r)), createElementVNode("div", _hoisted_14$7, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$s = ".dv-border-box-8 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-8 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-8 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$s);

script$s.render = render$s;
script$s.__file = "src/components/borderBox8/src/main.vue";

function borderBox8 (Vue) {
  Vue.component(script$s.name, script$s);
}

var script$r = {
  name: 'DvBorderBox9',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'border-box-9',
      gradientId: `border-box-9-gradient-${id}`,
      maskId: `border-box-9-mask-${id}`,
      defaultColor: ['#11eefd', '#0078d2'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$q = ["width", "height"];
const _hoisted_2$q = ["id"];
const _hoisted_3$o = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "x1",
  values: "0%;100%;0%",
  dur: "10s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_4$l = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "x2",
  values: "100%;0%;100%",
  dur: "10s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_5$i = ["stop-color"];
const _hoisted_6$f = ["values"];
const _hoisted_7$e = ["stop-color"];
const _hoisted_8$a = ["values"];
const _hoisted_9$9 = ["id"];
const _hoisted_10$8 = ["points"];
const _hoisted_11$7 = ["points"];
const _hoisted_12$6 = ["points"];
const _hoisted_13$6 = ["points"];
const _hoisted_14$6 = ["points"];
const _hoisted_15$5 = ["points"];
const _hoisted_16$5 = ["points"];
const _hoisted_17$5 = ["points"];
const _hoisted_18$4 = ["points"];
const _hoisted_19$4 = ["fill", "points"];
const _hoisted_20$4 = ["width", "height", "fill", "mask"];
const _hoisted_21$4 = {
  class: "border-box-content"
};
function render$r(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-9",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("linearGradient", {
    id: $data.gradientId,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, [_hoisted_3$o, _hoisted_4$l, createElementVNode("stop", {
    offset: "0%",
    "stop-color": $data.mergedColor[0]
  }, [createElementVNode("animate", {
    attributeName: "stop-color",
    values: `${$data.mergedColor[0]};${$data.mergedColor[1]};${$data.mergedColor[0]}`,
    dur: "10s",
    begin: "0s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_6$f)], 8 /* PROPS */, _hoisted_5$i), createElementVNode("stop", {
    offset: "100%",
    "stop-color": $data.mergedColor[1]
  }, [createElementVNode("animate", {
    attributeName: "stop-color",
    values: `${$data.mergedColor[1]};${$data.mergedColor[0]};${$data.mergedColor[1]}`,
    dur: "10s",
    begin: "0s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_8$a)], 8 /* PROPS */, _hoisted_7$e)], 8 /* PROPS */, _hoisted_2$q), createElementVNode("mask", {
    id: $data.maskId
  }, [createElementVNode("polyline", {
    stroke: "#fff",
    "stroke-width": "3",
    fill: "transparent",
    points: `8, ${_ctx.height * 0.4} 8, 3, ${_ctx.width * 0.4 + 7}, 3`
  }, null, 8 /* PROPS */, _hoisted_10$8), createElementVNode("polyline", {
    fill: "#fff",
    points: `8, ${_ctx.height * 0.15} 8, 3, ${_ctx.width * 0.1 + 7}, 3
              ${_ctx.width * 0.1}, 8 14, 8 14, ${_ctx.height * 0.15 - 7}
            `
  }, null, 8 /* PROPS */, _hoisted_11$7), createElementVNode("polyline", {
    stroke: "#fff",
    "stroke-width": "3",
    fill: "transparent",
    points: `${_ctx.width * 0.5}, 3 ${_ctx.width - 3}, 3, ${_ctx.width - 3}, ${_ctx.height * 0.25}`
  }, null, 8 /* PROPS */, _hoisted_12$6), createElementVNode("polyline", {
    fill: "#fff",
    points: `
              ${_ctx.width * 0.52}, 3 ${_ctx.width * 0.58}, 3
              ${_ctx.width * 0.58 - 7}, 9 ${_ctx.width * 0.52 + 7}, 9
            `
  }, null, 8 /* PROPS */, _hoisted_13$6), createElementVNode("polyline", {
    fill: "#fff",
    points: `
              ${_ctx.width * 0.9}, 3 ${_ctx.width - 3}, 3 ${_ctx.width - 3}, ${_ctx.height * 0.1}
              ${_ctx.width - 9}, ${_ctx.height * 0.1 - 7} ${_ctx.width - 9}, 9 ${_ctx.width * 0.9 + 7}, 9
            `
  }, null, 8 /* PROPS */, _hoisted_14$6), createElementVNode("polyline", {
    stroke: "#fff",
    "stroke-width": "3",
    fill: "transparent",
    points: `8, ${_ctx.height * 0.5} 8, ${_ctx.height - 3} ${_ctx.width * 0.3 + 7}, ${_ctx.height - 3}`
  }, null, 8 /* PROPS */, _hoisted_15$5), createElementVNode("polyline", {
    fill: "#fff",
    points: `
              8, ${_ctx.height * 0.55} 8, ${_ctx.height * 0.7}
              2, ${_ctx.height * 0.7 - 7} 2, ${_ctx.height * 0.55 + 7}
            `
  }, null, 8 /* PROPS */, _hoisted_16$5), createElementVNode("polyline", {
    stroke: "#fff",
    "stroke-width": "3",
    fill: "transparent",
    points: `${_ctx.width * 0.35}, ${_ctx.height - 3} ${_ctx.width - 3}, ${_ctx.height - 3} ${_ctx.width - 3}, ${_ctx.height * 0.35}`
  }, null, 8 /* PROPS */, _hoisted_17$5), createElementVNode("polyline", {
    fill: "#fff",
    points: `
              ${_ctx.width * 0.92}, ${_ctx.height - 3} ${_ctx.width - 3}, ${_ctx.height - 3} ${_ctx.width - 3}, ${_ctx.height * 0.8}
              ${_ctx.width - 9}, ${_ctx.height * 0.8 + 7} ${_ctx.width - 9}, ${_ctx.height - 9} ${_ctx.width * 0.92 + 7}, ${_ctx.height - 9}
            `
  }, null, 8 /* PROPS */, _hoisted_18$4)], 8 /* PROPS */, _hoisted_9$9)]), createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        15, 9 ${_ctx.width * 0.1 + 1}, 9 ${_ctx.width * 0.1 + 4}, 6 ${_ctx.width * 0.52 + 2}, 6
        ${_ctx.width * 0.52 + 6}, 10 ${_ctx.width * 0.58 - 7}, 10 ${_ctx.width * 0.58 - 2}, 6
        ${_ctx.width * 0.9 + 2}, 6 ${_ctx.width * 0.9 + 6}, 10 ${_ctx.width - 10}, 10 ${_ctx.width - 10}, ${_ctx.height * 0.1 - 6}
        ${_ctx.width - 6}, ${_ctx.height * 0.1 - 1} ${_ctx.width - 6}, ${_ctx.height * 0.8 + 1} ${_ctx.width - 10}, ${_ctx.height * 0.8 + 6}
        ${_ctx.width - 10}, ${_ctx.height - 10} ${_ctx.width * 0.92 + 7}, ${_ctx.height - 10}  ${_ctx.width * 0.92 + 2}, ${_ctx.height - 6}
        11, ${_ctx.height - 6} 11, ${_ctx.height * 0.15 - 2} 15, ${_ctx.height * 0.15 - 7}
      `
  }, null, 8 /* PROPS */, _hoisted_19$4), createElementVNode("rect", {
    x: "0",
    y: "0",
    width: _ctx.width,
    height: _ctx.height,
    fill: `url(#${$data.gradientId})`,
    mask: `url(#${$data.maskId})`
  }, null, 8 /* PROPS */, _hoisted_20$4)], 8 /* PROPS */, _hoisted_1$q)), createElementVNode("div", _hoisted_21$4, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$r = ".dv-border-box-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-9 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-9 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$r);

script$r.render = render$r;
script$r.__file = "src/components/borderBox9/src/main.vue";

function borderBox9 (Vue) {
  Vue.component(script$r.name, script$r);
}

var script$q = {
  name: 'DvBorderBox10',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-10',
      border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
      defaultColor: ['#1d48c4', '#d3e1f8'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$p = ["width", "height"];
const _hoisted_2$p = ["fill", "points"];
const _hoisted_3$n = ["fill"];
const _hoisted_4$k = {
  class: "border-box-content"
};
function render$q(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-10",
    ref: $data.ref,
    style: normalizeStyle(`box-shadow: inset 0 0 25px 3px ${$data.mergedColor[0]}`)
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        4, 0 ${_ctx.width - 4}, 0 ${_ctx.width}, 4 ${_ctx.width}, ${_ctx.height - 4} ${_ctx.width - 4}, ${_ctx.height}
        4, ${_ctx.height} 0, ${_ctx.height - 4} 0, 4
      `
  }, null, 8 /* PROPS */, _hoisted_2$p)], 8 /* PROPS */, _hoisted_1$p)), (openBlock(true), createElementBlock(Fragment, null, renderList($data.border, item => {
    return openBlock(), createElementBlock("svg", {
      width: "150px",
      height: "150px",
      key: item,
      class: normalizeClass(`${item} dv-border-svg-container`)
    }, [createElementVNode("polygon", {
      fill: $data.mergedColor[1],
      points: "40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
    }, null, 8 /* PROPS */, _hoisted_3$n)], 2 /* CLASS */);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("div", _hoisted_4$k, [renderSlot(_ctx.$slots, "default")])], 4 /* STYLE */);
}

var css_248z$q = ".dv-border-box-10 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 6px;\n}\n.dv-border-box-10 .dv-border-svg-container {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-10 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-10 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-10 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-10 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$q);

script$q.render = render$q;
script$q.__file = "src/components/borderBox10/src/main.vue";

function borderBox10 (Vue) {
  Vue.component(script$q.name, script$q);
}

var a$1 = /* @__PURE__ */ ((f) => (f.transparent = "rgba(0,0,0,0)", f.black = "#000000", f.silver = "#C0C0C0", f.gray = "#808080", f.white = "#FFFFFF", f.maroon = "#800000", f.red = "#FF0000", f.purple = "#800080", f.fuchsia = "#FF00FF", f.green = "#008000", f.lime = "#00FF00", f.olive = "#808000", f.yellow = "#FFFF00", f.navy = "#000080", f.blue = "#0000FF", f.teal = "#008080", f.aqua = "#00FFFF", f.aliceblue = "#f0f8ff", f.antiquewhite = "#faebd7", f.aquamarine = "#7fffd4", f.azure = "#f0ffff", f.beige = "#f5f5dc", f.bisque = "#ffe4c4", f.blanchedalmond = "#ffebcd", f.blueviolet = "#8a2be2", f.brown = "#a52a2a", f.burlywood = "#deb887", f.cadetblue = "#5f9ea0", f.chartreuse = "#7fff00", f.chocolate = "#d2691e", f.coral = "#ff7f50", f.cornflowerblue = "#6495ed", f.cornsilk = "#fff8dc", f.crimson = "#dc143c", f.cyan = "#00ffff", f.darkblue = "#00008b", f.darkcyan = "#008b8b", f.darkgoldenrod = "#b8860b", f.darkgray = "#a9a9a9", f.darkgreen = "#006400", f.darkgrey = "#a9a9a9", f.darkkhaki = "#bdb76b", f.darkmagenta = "#8b008b", f.darkolivegreen = "#556b2f", f.darkorange = "#ff8c00", f.darkorchid = "#9932cc", f.darkred = "#8b0000", f.darksalmon = "#e9967a", f.darkseagreen = "#8fbc8f", f.darkslateblue = "#483d8b", f.darkslategray = "#2f4f4f", f.darkslategrey = "#2f4f4f", f.darkturquoise = "#00ced1", f.darkviolet = "#9400d3", f.deeppink = "#ff1493", f.deepskyblue = "#00bfff", f.dimgray = "#696969", f.dimgrey = "#696969", f.dodgerblue = "#1e90ff", f.firebrick = "#b22222", f.floralwhite = "#fffaf0", f.forestgreen = "#228b22", f.gainsboro = "#dcdcdc", f.ghostwhite = "#f8f8ff", f.gold = "#ffd700", f.goldenrod = "#daa520", f.greenyellow = "#adff2f", f.grey = "#808080", f.honeydew = "#f0fff0", f.hotpink = "#ff69b4", f.indianred = "#cd5c5c", f.indigo = "#4b0082", f.ivory = "#fffff0", f.khaki = "#f0e68c", f.lavender = "#e6e6fa", f.lavenderblush = "#fff0f5", f.lawngreen = "#7cfc00", f.lemonchiffon = "#fffacd", f.lightblue = "#add8e6", f.lightcoral = "#f08080", f.lightcyan = "#e0ffff", f.lightgoldenrodyellow = "#fafad2", f.lightgray = "#d3d3d3", f.lightgreen = "#90ee90", f.lightgrey = "#d3d3d3", f.lightpink = "#ffb6c1", f.lightsalmon = "#ffa07a", f.lightseagreen = "#20b2aa", f.lightskyblue = "#87cefa", f.lightslategray = "#778899", f.lightslategrey = "#778899", f.lightsteelblue = "#b0c4de", f.lightyellow = "#ffffe0", f.limegreen = "#32cd32", f.linen = "#faf0e6", f.magenta = "#ff00ff", f.mediumaquamarine = "#66cdaa", f.mediumblue = "#0000cd", f.mediumorchid = "#ba55d3", f.mediumpurple = "#9370db", f.mediumseagreen = "#3cb371", f.mediumslateblue = "#7b68ee", f.mediumspringgreen = "#00fa9a", f.mediumturquoise = "#48d1cc", f.mediumvioletred = "#c71585", f.midnightblue = "#191970", f.mintcream = "#f5fffa", f.mistyrose = "#ffe4e1", f.moccasin = "#ffe4b5", f.navajowhite = "#ffdead", f.oldlace = "#fdf5e6", f.olivedrab = "#6b8e23", f.orange = "#ffa500", f.orangered = "#ff4500", f.orchid = "#da70d6", f.palegoldenrod = "#eee8aa", f.palegreen = "#98fb98", f.paleturquoise = "#afeeee", f.palevioletred = "#db7093", f.papayawhip = "#ffefd5", f.peachpuff = "#ffdab9", f.peru = "#cd853f", f.pink = "#ffc0cb", f.plum = "#dda0dd", f.powderblue = "#b0e0e6", f.rosybrown = "#bc8f8f", f.royalblue = "#4169e1", f.saddlebrown = "#8b4513", f.salmon = "#fa8072", f.sandybrown = "#f4a460", f.seagreen = "#2e8b57", f.seashell = "#fff5ee", f.sienna = "#a0522d", f.skyblue = "#87ceeb", f.slateblue = "#6a5acd", f.slategray = "#708090", f.snow = "#fffafa", f.springgreen = "#00ff7f", f.steelblue = "#4682b4", f.tan = "#d2b48c", f.thistle = "#d8bfd8", f.tomato = "#ff6347", f.turquoise = "#40e0d0", f.violet = "#ee82ee", f.wheat = "#f5deb3", f.whitesmoke = "#f5f5f5", f.yellowgreen = "#9acd32", f))(a$1 || {});

function i(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(r));
}
function C(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^(rgb\(|RGB\()/.test(r));
}
function b(r) {
  return typeof r != "string" ? !1 : (r = r.toLowerCase(), /^(rgba|RGBA)/.test(r));
}
function l(r) {
  return /^(rgb|rgba|RGB|RGBA)/.test(r);
}
function p(r) {
  return a$1[r];
}
function g(r) {
  if (i(r) || l(r))
    return r;
  const t = p(r);
  if (!t)
    throw new Error(`Color: Invalid Input of ${r}`);
  return t;
}
function m(r) {
  r = r.replace("#", ""), r.length === 3 && (r = Array.from(r).map((e) => e + e).join(""));
  const t = r.split("");
  return new Array(3).fill(0).map((e, n) => parseInt(`0x${t[n * 2]}${t[n * 2 + 1]}`));
}
function R(r) {
  return r.replace(/rgb\(|rgba\(|\)/g, "").split(",").slice(0, 3).map((t) => parseInt(t));
}
function a(r) {
  const e = g(r).toLowerCase();
  return i(e) ? m(e) : R(e);
}
function c(r) {
  const t = g(r);
  return b(t) ? Number(
    t.toLowerCase().split(",").slice(-1)[0].replace(/[)|\s]/g, "")
  ) : 1;
}
function f(r) {
  const t = a(r);
  return t && [...t, c(r)];
}
function V(r, t) {
  const e = a(r);
  return typeof t == "number" ? `rgba(${e.join(",")},${t})` : `rgb(${e.join(",")})`;
}
function y(r) {
  if (i(r))
    return r;
  const t = a(r), e = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${t.map(e).join("")}`;
}
function u(r) {
  if (!Array.isArray(r))
    throw new Error(`getColorFromRgbValue: ${r} is not an array`);
  const { length: t } = r;
  if (t !== 3 && t !== 4)
    throw new Error("getColorFromRgbValue: value length should be 3 or 4");
  return (t === 3 ? "rgb(" : "rgba(") + r.join(",") + ")";
}
function d(r, t = 0) {
  let e = f(r);
  return e = e.map((n, o) => o === 3 ? n : n - Math.ceil(2.55 * t)).map((n) => n < 0 ? 0 : n), u(e);
}
function h(r, t = 0) {
  let e = f(r);
  return e = e.map((n, o) => o === 3 ? n : n + Math.ceil(2.55 * t)).map((n) => n > 255 ? 255 : n), u(e);
}
function $(r, t = 100) {
  const e = a(r);
  return u([...e, t / 100]);
}

var es = /*#__PURE__*/Object.freeze({
  __proto__: null,
  darken: d,
  fade: $,
  getColorFromRgbValue: u,
  getOpacity: c,
  getRgbValue: a,
  getRgbaValue: f,
  isHex: i,
  isRgb: C,
  isRgbOrRgba: l,
  isRgba: b,
  lighten: h,
  toHex: y,
  toRgb: V
});

var script$p = {
  name: 'DvBorderBox11',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    titleWidth: {
      type: Number,
      default: 250
    },
    title: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'border-box-11',
      filterId: `border-box-11-filterId-${id}`,
      defaultColor: ['#8aaafb', '#1f33a2'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    },
    fade: $
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$o = ["width", "height"];
const _hoisted_2$o = ["id"];
const _hoisted_3$m = /*#__PURE__*/createElementVNode("feMorphology", {
  operator: "dilate",
  radius: "2",
  in: "SourceAlpha",
  result: "thicken"
}, null, -1 /* HOISTED */);
const _hoisted_4$j = /*#__PURE__*/createElementVNode("feGaussianBlur", {
  in: "thicken",
  stdDeviation: "3",
  result: "blurred"
}, null, -1 /* HOISTED */);
const _hoisted_5$h = ["flood-color"];
const _hoisted_6$e = /*#__PURE__*/createElementVNode("feComposite", {
  in: "glowColor",
  in2: "blurred",
  operator: "in",
  result: "softGlowColored"
}, null, -1 /* HOISTED */);
const _hoisted_7$d = /*#__PURE__*/createElementVNode("feMerge", null, [/*#__PURE__*/createElementVNode("feMergeNode", {
  in: "softGlowColored"
}), /*#__PURE__*/createElementVNode("feMergeNode", {
  in: "SourceGraphic"
})], -1 /* HOISTED */);
const _hoisted_8$9 = ["fill", "points"];
const _hoisted_9$8 = ["stroke", "filter", "points"];
const _hoisted_10$7 = ["stroke", "points"];
const _hoisted_11$6 = ["stroke", "points"];
const _hoisted_12$5 = ["stroke", "fill", "filter", "points"];
const _hoisted_13$5 = ["filter", "fill", "points"];
const _hoisted_14$5 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "1;0.7;1",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_15$4 = [_hoisted_14$5];
const _hoisted_16$4 = ["filter", "fill", "points"];
const _hoisted_17$4 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "0.7;0.4;0.7",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_18$3 = [_hoisted_17$4];
const _hoisted_19$3 = ["filter", "fill", "points"];
const _hoisted_20$3 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "0.5;0.2;0.5",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_21$3 = [_hoisted_20$3];
const _hoisted_22$3 = ["filter", "fill", "points"];
const _hoisted_23$2 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "1;0.7;1",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_24$2 = [_hoisted_23$2];
const _hoisted_25$1 = ["filter", "fill", "points"];
const _hoisted_26 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "0.7;0.4;0.7",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_27 = [_hoisted_26];
const _hoisted_28 = ["filter", "fill", "points"];
const _hoisted_29 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "opacity",
  values: "0.5;0.2;0.5",
  dur: "2s",
  begin: "0s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_30 = [_hoisted_29];
const _hoisted_31 = ["x"];
const _hoisted_32 = ["fill", "filter", "points"];
const _hoisted_33 = ["fill", "filter", "points"];
const _hoisted_34 = {
  class: "border-box-content"
};
function render$p(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-11",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("filter", {
    id: $data.filterId,
    height: "150%",
    width: "150%",
    x: "-25%",
    y: "-25%"
  }, [_hoisted_3$m, _hoisted_4$j, createElementVNode("feFlood", {
    "flood-color": $data.mergedColor[1],
    result: "glowColor"
  }, null, 8 /* PROPS */, _hoisted_5$h), _hoisted_6$e, _hoisted_7$d], 8 /* PROPS */, _hoisted_2$o)]), createElementVNode("polygon", {
    fill: $props.backgroundColor,
    points: `
        20, 32 ${_ctx.width * 0.5 - $props.titleWidth / 2}, 32 ${_ctx.width * 0.5 - $props.titleWidth / 2 + 20}, 53
        ${_ctx.width * 0.5 + $props.titleWidth / 2 - 20}, 53 ${_ctx.width * 0.5 + $props.titleWidth / 2}, 32
        ${_ctx.width - 20}, 32 ${_ctx.width - 8}, 48 ${_ctx.width - 8}, ${_ctx.height - 25} ${_ctx.width - 20}, ${_ctx.height - 8}
        20, ${_ctx.height - 8} 8, ${_ctx.height - 25} 8, 50
      `
  }, null, 8 /* PROPS */, _hoisted_8$9), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    filter: `url(#${$data.filterId})`,
    points: `
          ${(_ctx.width - $props.titleWidth) / 2}, 30
          20, 30 7, 50 7, ${50 + (_ctx.height - 167) / 2}
          13, ${55 + (_ctx.height - 167) / 2} 13, ${135 + (_ctx.height - 167) / 2}
          7, ${140 + (_ctx.height - 167) / 2} 7, ${_ctx.height - 27}
          20, ${_ctx.height - 7} ${_ctx.width - 20}, ${_ctx.height - 7} ${_ctx.width - 7}, ${_ctx.height - 27}
          ${_ctx.width - 7}, ${140 + (_ctx.height - 167) / 2} ${_ctx.width - 13}, ${135 + (_ctx.height - 167) / 2}
          ${_ctx.width - 13}, ${55 + (_ctx.height - 167) / 2} ${_ctx.width - 7}, ${50 + (_ctx.height - 167) / 2}
          ${_ctx.width - 7}, 50 ${_ctx.width - 20}, 30 ${(_ctx.width + $props.titleWidth) / 2}, 30
          ${(_ctx.width + $props.titleWidth) / 2 - 20}, 7 ${(_ctx.width - $props.titleWidth) / 2 + 20}, 7
          ${(_ctx.width - $props.titleWidth) / 2}, 30 ${(_ctx.width - $props.titleWidth) / 2 + 20}, 52
          ${(_ctx.width + $props.titleWidth) / 2 - 20}, 52 ${(_ctx.width + $props.titleWidth) / 2}, 30
        `
  }, null, 8 /* PROPS */, _hoisted_9$8), createElementVNode("polygon", {
    stroke: $data.mergedColor[0],
    fill: "transparent",
    points: `
          ${(_ctx.width + $props.titleWidth) / 2 - 5}, 30 ${(_ctx.width + $props.titleWidth) / 2 - 21}, 11
          ${(_ctx.width + $props.titleWidth) / 2 - 27}, 11 ${(_ctx.width + $props.titleWidth) / 2 - 8}, 34
        `
  }, null, 8 /* PROPS */, _hoisted_10$7), createElementVNode("polygon", {
    stroke: $data.mergedColor[0],
    fill: "transparent",
    points: `
          ${(_ctx.width - $props.titleWidth) / 2 + 5}, 30 ${(_ctx.width - $props.titleWidth) / 2 + 22}, 49
          ${(_ctx.width - $props.titleWidth) / 2 + 28}, 49 ${(_ctx.width - $props.titleWidth) / 2 + 8}, 26
        `
  }, null, 8 /* PROPS */, _hoisted_11$6), createElementVNode("polygon", {
    stroke: $data.mergedColor[0],
    fill: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 30),
    filter: `url(#${$data.filterId})`,
    points: `
          ${(_ctx.width + $props.titleWidth) / 2 - 11}, 37 ${(_ctx.width + $props.titleWidth) / 2 - 32}, 11
          ${(_ctx.width - $props.titleWidth) / 2 + 23}, 11 ${(_ctx.width - $props.titleWidth) / 2 + 11}, 23
          ${(_ctx.width - $props.titleWidth) / 2 + 33}, 49 ${(_ctx.width + $props.titleWidth) / 2 - 22}, 49
        `
  }, null, 8 /* PROPS */, _hoisted_12$5), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "1",
    points: `
          ${(_ctx.width - $props.titleWidth) / 2 - 10}, 37 ${(_ctx.width - $props.titleWidth) / 2 - 31}, 37
          ${(_ctx.width - $props.titleWidth) / 2 - 25}, 46 ${(_ctx.width - $props.titleWidth) / 2 - 4}, 46
        `
  }, _hoisted_15$4, 8 /* PROPS */, _hoisted_13$5), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "0.7",
    points: `
          ${(_ctx.width - $props.titleWidth) / 2 - 40}, 37 ${(_ctx.width - $props.titleWidth) / 2 - 61}, 37
          ${(_ctx.width - $props.titleWidth) / 2 - 55}, 46 ${(_ctx.width - $props.titleWidth) / 2 - 34}, 46
        `
  }, _hoisted_18$3, 8 /* PROPS */, _hoisted_16$4), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "0.5",
    points: `
          ${(_ctx.width - $props.titleWidth) / 2 - 70}, 37 ${(_ctx.width - $props.titleWidth) / 2 - 91}, 37
          ${(_ctx.width - $props.titleWidth) / 2 - 85}, 46 ${(_ctx.width - $props.titleWidth) / 2 - 64}, 46
        `
  }, _hoisted_21$3, 8 /* PROPS */, _hoisted_19$3), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "1",
    points: `
          ${(_ctx.width + $props.titleWidth) / 2 + 30}, 37 ${(_ctx.width + $props.titleWidth) / 2 + 9}, 37
          ${(_ctx.width + $props.titleWidth) / 2 + 3}, 46 ${(_ctx.width + $props.titleWidth) / 2 + 24}, 46
        `
  }, _hoisted_24$2, 8 /* PROPS */, _hoisted_22$3), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "0.7",
    points: `
          ${(_ctx.width + $props.titleWidth) / 2 + 60}, 37 ${(_ctx.width + $props.titleWidth) / 2 + 39}, 37
          ${(_ctx.width + $props.titleWidth) / 2 + 33}, 46 ${(_ctx.width + $props.titleWidth) / 2 + 54}, 46
        `
  }, _hoisted_27, 8 /* PROPS */, _hoisted_25$1), createElementVNode("polygon", {
    filter: `url(#${$data.filterId})`,
    fill: $data.mergedColor[0],
    opacity: "0.5",
    points: `
          ${(_ctx.width + $props.titleWidth) / 2 + 90}, 37 ${(_ctx.width + $props.titleWidth) / 2 + 69}, 37
          ${(_ctx.width + $props.titleWidth) / 2 + 63}, 46 ${(_ctx.width + $props.titleWidth) / 2 + 84}, 46
        `
  }, _hoisted_30, 8 /* PROPS */, _hoisted_28), createElementVNode("text", {
    class: "dv-border-box-11-title",
    x: `${_ctx.width / 2}`,
    y: "32",
    fill: "#fff",
    "font-size": "18",
    "text-anchor": "middle",
    "dominant-baseline": "middle"
  }, toDisplayString($props.title), 9 /* TEXT, PROPS */, _hoisted_31), createElementVNode("polygon", {
    fill: $data.mergedColor[0],
    filter: `url(#${$data.filterId})`,
    points: `
          7, ${53 + (_ctx.height - 167) / 2} 11, ${57 + (_ctx.height - 167) / 2}
          11, ${133 + (_ctx.height - 167) / 2} 7, ${137 + (_ctx.height - 167) / 2}
        `
  }, null, 8 /* PROPS */, _hoisted_32), createElementVNode("polygon", {
    fill: $data.mergedColor[0],
    filter: `url(#${$data.filterId})`,
    points: `
          ${_ctx.width - 7}, ${53 + (_ctx.height - 167) / 2} ${_ctx.width - 11}, ${57 + (_ctx.height - 167) / 2}
          ${_ctx.width - 11}, ${133 + (_ctx.height - 167) / 2} ${_ctx.width - 7}, ${137 + (_ctx.height - 167) / 2}
        `
  }, null, 8 /* PROPS */, _hoisted_33)], 8 /* PROPS */, _hoisted_1$o)), createElementVNode("div", _hoisted_34, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$p = ".dv-border-box-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-11 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-11 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-11 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$p);

script$p.render = render$p;
script$p.__file = "src/components/borderBox11/src/main.vue";

function borderBox11 (Vue) {
  Vue.component(script$p.name, script$p);
}

var script$o = {
  name: 'DvBorderBox12',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'border-box-12',
      filterId: `borderr-box-12-filterId-${id}`,
      defaultColor: ['#2e6099', '#7ce7fd'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    },
    fade: $
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$n = ["width", "height"];
const _hoisted_2$n = ["id"];
const _hoisted_3$l = /*#__PURE__*/createElementVNode("feMorphology", {
  operator: "dilate",
  radius: "1",
  in: "SourceAlpha",
  result: "thicken"
}, null, -1 /* HOISTED */);
const _hoisted_4$i = /*#__PURE__*/createElementVNode("feGaussianBlur", {
  in: "thicken",
  stdDeviation: "2",
  result: "blurred"
}, null, -1 /* HOISTED */);
const _hoisted_5$g = ["flood-color"];
const _hoisted_6$d = ["values"];
const _hoisted_7$c = /*#__PURE__*/createElementVNode("feComposite", {
  in: "glowColor",
  in2: "blurred",
  operator: "in",
  result: "softGlowColored"
}, null, -1 /* HOISTED */);
const _hoisted_8$8 = /*#__PURE__*/createElementVNode("feMerge", null, [/*#__PURE__*/createElementVNode("feMergeNode", {
  in: "softGlowColored"
}), /*#__PURE__*/createElementVNode("feMergeNode", {
  in: "SourceGraphic"
})], -1 /* HOISTED */);
const _hoisted_9$7 = ["fill", "stroke", "d"];
const _hoisted_10$6 = ["filter", "stroke"];
const _hoisted_11$5 = ["filter", "stroke", "d"];
const _hoisted_12$4 = ["filter", "stroke", "d"];
const _hoisted_13$4 = ["filter", "stroke", "d"];
const _hoisted_14$4 = {
  class: "border-box-content"
};
function render$o(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-12",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("filter", {
    id: $data.filterId,
    height: "150%",
    width: "150%",
    x: "-25%",
    y: "-25%"
  }, [_hoisted_3$l, _hoisted_4$i, createElementVNode("feFlood", {
    "flood-color": $options.fade($data.mergedColor[1] || $data.defaultColor[1], 70),
    result: "glowColor"
  }, [createElementVNode("animate", {
    attributeName: "flood-color",
    values: `
                ${$options.fade($data.mergedColor[1] || $data.defaultColor[1], 70)};
                ${$options.fade($data.mergedColor[1] || $data.defaultColor[1], 30)};
                ${$options.fade($data.mergedColor[1] || $data.defaultColor[1], 70)};
              `,
    dur: "3s",
    begin: "0s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_6$d)], 8 /* PROPS */, _hoisted_5$g), _hoisted_7$c, _hoisted_8$8], 8 /* PROPS */, _hoisted_2$n)]), _ctx.width && _ctx.height ? (openBlock(), createElementBlock("path", {
    key: 0,
    fill: $props.backgroundColor,
    "stroke-width": "2",
    stroke: $data.mergedColor[0],
    d: `
          M15 5 L ${_ctx.width - 15} 5 Q ${_ctx.width - 5} 5, ${_ctx.width - 5} 15
          L ${_ctx.width - 5} ${_ctx.height - 15} Q ${_ctx.width - 5} ${_ctx.height - 5}, ${_ctx.width - 15} ${_ctx.height - 5}
          L 15, ${_ctx.height - 5} Q 5 ${_ctx.height - 5} 5 ${_ctx.height - 15} L 5 15
          Q 5 5 15 5
        `
  }, null, 8 /* PROPS */, _hoisted_9$7)) : createCommentVNode("v-if", true), createElementVNode("path", {
    "stroke-width": "2",
    fill: "transparent",
    "stroke-linecap": "round",
    filter: `url(#${$data.filterId})`,
    stroke: $data.mergedColor[1],
    d: `M 20 5 L 15 5 Q 5 5 5 15 L 5 20`
  }, null, 8 /* PROPS */, _hoisted_10$6), createElementVNode("path", {
    "stroke-width": "2",
    fill: "transparent",
    "stroke-linecap": "round",
    filter: `url(#${$data.filterId})`,
    stroke: $data.mergedColor[1],
    d: `M ${_ctx.width - 20} 5 L ${_ctx.width - 15} 5 Q ${_ctx.width - 5} 5 ${_ctx.width - 5} 15 L ${_ctx.width - 5} 20`
  }, null, 8 /* PROPS */, _hoisted_11$5), createElementVNode("path", {
    "stroke-width": "2",
    fill: "transparent",
    "stroke-linecap": "round",
    filter: `url(#${$data.filterId})`,
    stroke: $data.mergedColor[1],
    d: `
          M ${_ctx.width - 20} ${_ctx.height - 5} L ${_ctx.width - 15} ${_ctx.height - 5}
          Q ${_ctx.width - 5} ${_ctx.height - 5} ${_ctx.width - 5} ${_ctx.height - 15}
          L ${_ctx.width - 5} ${_ctx.height - 20}
        `
  }, null, 8 /* PROPS */, _hoisted_12$4), createElementVNode("path", {
    "stroke-width": "2",
    fill: "transparent",
    "stroke-linecap": "round",
    filter: `url(#${$data.filterId})`,
    stroke: $data.mergedColor[1],
    d: `
          M 20 ${_ctx.height - 5} L 15 ${_ctx.height - 5}
          Q 5 ${_ctx.height - 5} 5 ${_ctx.height - 15}
          L 5 ${_ctx.height - 20}
        `
  }, null, 8 /* PROPS */, _hoisted_13$4)], 8 /* PROPS */, _hoisted_1$n)), createElementVNode("div", _hoisted_14$4, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$o = ".dv-border-box-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-12 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-12 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$o);

script$o.render = render$o;
script$o.__file = "src/components/borderBox12/src/main.vue";

function borderBox12 (Vue) {
  Vue.component(script$o.name, script$o);
}

var script$n = {
  name: 'DvBorderBox13',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      ref: 'border-box-13',
      defaultColor: ['#6586ec', '#2cf7fe'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$m = ["width", "height"];
const _hoisted_2$m = ["fill", "stroke", "d"];
const _hoisted_3$k = ["stroke"];
const _hoisted_4$h = ["stroke"];
const _hoisted_5$f = ["stroke", "d"];
const _hoisted_6$c = {
  class: "border-box-content"
};
function render$n(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-border-box-13",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    class: "dv-border-svg-container",
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("path", {
    fill: $props.backgroundColor,
    stroke: $data.mergedColor[0],
    d: `
          M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
          L ${_ctx.width - 20} 10 L ${_ctx.width - 5} 25
          L ${_ctx.width - 5} ${_ctx.height - 5} L 20 ${_ctx.height - 5}
          L 5 ${_ctx.height - 20} L 5 20
        `
  }, null, 8 /* PROPS */, _hoisted_2$m), createElementVNode("path", {
    fill: "transparent",
    "stroke-width": "3",
    "stroke-linecap": "round",
    "stroke-dasharray": "10, 5",
    stroke: $data.mergedColor[0],
    d: `M 16 9 L 61 9`
  }, null, 8 /* PROPS */, _hoisted_3$k), createElementVNode("path", {
    fill: "transparent",
    stroke: $data.mergedColor[1],
    d: `M 5 20 L 5 10 L 12 3  L 60 3 L 68 10`
  }, null, 8 /* PROPS */, _hoisted_4$h), createElementVNode("path", {
    fill: "transparent",
    stroke: $data.mergedColor[1],
    d: `M ${_ctx.width - 5} ${_ctx.height - 30} L ${_ctx.width - 5} ${_ctx.height - 5} L ${_ctx.width - 30} ${_ctx.height - 5}`
  }, null, 8 /* PROPS */, _hoisted_5$f)], 8 /* PROPS */, _hoisted_1$m)), createElementVNode("div", _hoisted_6$c, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$n = ".dv-border-box-13 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-13 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-13 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$n);

script$n.render = render$n;
script$n.__file = "src/components/borderBox13/src/main.vue";

function borderBox13 (Vue) {
  Vue.component(script$n.name, script$n);
}

var script$m = {
  name: 'DvDecoration1',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const pointSideLength = 2.5;
    return {
      ref: 'decoration-1',
      svgWH: [200, 50],
      svgScale: [1, 1],
      rowNum: 4,
      rowPoints: 20,
      pointSideLength,
      halfPointSideLength: pointSideLength / 2,
      points: [],
      rects: [],
      defaultColor: ['#fff', '#0de7c2'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    calcSVGData() {
      const {
        calcPointsPosition,
        calcRectsPosition,
        calcScale
      } = this;
      calcPointsPosition();
      calcRectsPosition();
      calcScale();
    },
    calcPointsPosition() {
      const {
        svgWH,
        rowNum,
        rowPoints
      } = this;
      const [w, h] = svgWH;
      const horizontalGap = w / (rowPoints + 1);
      const verticalGap = h / (rowNum + 1);
      let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
      this.points = points.reduce((all, item) => [...all, ...item], []);
    },
    calcRectsPosition() {
      const {
        points,
        rowPoints
      } = this;
      const rect1 = points[rowPoints * 2 - 1];
      const rect2 = points[rowPoints * 2 - 3];
      this.rects = [rect1, rect2];
    },
    calcScale() {
      const {
        width,
        height,
        svgWH
      } = this;
      const [w, h] = svgWH;
      this.svgScale = [width / w, height / h];
    },
    onResize() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$l = ["width", "height"];
const _hoisted_2$l = ["fill", "x", "y", "width", "height"];
const _hoisted_3$j = ["values", "begin"];
const _hoisted_4$g = ["fill", "x", "y", "width", "height"];
const _hoisted_5$e = ["values"];
const _hoisted_6$b = ["values"];
const _hoisted_7$b = ["values"];
const _hoisted_8$7 = ["values"];
const _hoisted_9$6 = ["fill", "x", "y", "height"];
const _hoisted_10$5 = /*#__PURE__*/createElementVNode("animate", {
  attributeName: "width",
  values: "0;40;0",
  dur: "2s",
  repeatCount: "indefinite"
}, null, -1 /* HOISTED */);
const _hoisted_11$4 = ["values"];
function render$m(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-1",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: `${$data.svgWH[0]}px`,
    height: `${$data.svgWH[1]}px`,
    style: normalizeStyle(`transform:scale(${$data.svgScale[0]},${$data.svgScale[1]});`)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.points, (point, i) => {
    return openBlock(), createElementBlock(Fragment, null, [Math.random() > 0.6 ? (openBlock(), createElementBlock("rect", {
      key: i,
      fill: $data.mergedColor[0],
      x: point[0] - $data.halfPointSideLength,
      y: point[1] - $data.halfPointSideLength,
      width: $data.pointSideLength,
      height: $data.pointSideLength
    }, [Math.random() > 0.6 ? (openBlock(), createElementBlock("animate", {
      key: 0,
      attributeName: "fill",
      values: `${$data.mergedColor[0]};transparent`,
      dur: "1s",
      begin: Math.random() * 2,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_3$j)) : createCommentVNode("v-if", true)], 8 /* PROPS */, _hoisted_2$l)) : createCommentVNode("v-if", true)], 64 /* STABLE_FRAGMENT */);
  }), 256 /* UNKEYED_FRAGMENT */)), $data.rects[0] ? (openBlock(), createElementBlock("rect", {
    key: 0,
    fill: $data.mergedColor[1],
    x: $data.rects[0][0] - $data.pointSideLength,
    y: $data.rects[0][1] - $data.pointSideLength,
    width: $data.pointSideLength * 2,
    height: $data.pointSideLength * 2
  }, [createElementVNode("animate", {
    attributeName: "width",
    values: `0;${$data.pointSideLength * 2}`,
    dur: "2s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_5$e), createElementVNode("animate", {
    attributeName: "height",
    values: `0;${$data.pointSideLength * 2}`,
    dur: "2s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_6$b), createElementVNode("animate", {
    attributeName: "x",
    values: `${$data.rects[0][0]};${$data.rects[0][0] - $data.pointSideLength}`,
    dur: "2s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_7$b), createElementVNode("animate", {
    attributeName: "y",
    values: `${$data.rects[0][1]};${$data.rects[0][1] - $data.pointSideLength}`,
    dur: "2s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_8$7)], 8 /* PROPS */, _hoisted_4$g)) : createCommentVNode("v-if", true), $data.rects[1] ? (openBlock(), createElementBlock("rect", {
    key: 1,
    fill: $data.mergedColor[1],
    x: $data.rects[1][0] - 40,
    y: $data.rects[1][1] - $data.pointSideLength,
    width: 40,
    height: $data.pointSideLength * 2
  }, [_hoisted_10$5, createElementVNode("animate", {
    attributeName: "x",
    values: `${$data.rects[1][0]};${$data.rects[1][0] - 40};${$data.rects[1][0]}`,
    dur: "2s",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_11$4)], 8 /* PROPS */, _hoisted_9$6)) : createCommentVNode("v-if", true)], 12 /* STYLE, PROPS */, _hoisted_1$l))], 512 /* NEED_PATCH */);
}

var css_248z$m = ".dv-decoration-1 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-1 svg {\n  transform-origin: left top;\n}\n";
styleInject(css_248z$m);

script$m.render = render$m;
script$m.__file = "src/components/decoration1/src/main.vue";

function decoration1 (Vue) {
  Vue.component(script$m.name, script$m);
}

var script$l = {
  name: 'DvDecoration2',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    reverse: {
      type: Boolean,
      default: false
    },
    dur: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      ref: 'decoration-2',
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      defaultColor: ['#3faacb', '#fff'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    },
    reverse() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    calcSVGData() {
      const {
        reverse,
        width,
        height
      } = this;
      if (reverse) {
        this.w = 1;
        this.h = height;
        this.x = width / 2;
        this.y = 0;
      } else {
        this.w = width;
        this.h = 1;
        this.x = 0;
        this.y = height / 2;
      }
    },
    onResize() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$k = ["width", "height"];
const _hoisted_2$k = ["x", "y", "width", "height", "fill"];
const _hoisted_3$i = ["attributeName", "to", "dur"];
const _hoisted_4$f = ["x", "y", "fill"];
const _hoisted_5$d = ["attributeName", "to", "dur"];
function render$l(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-2",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: `${_ctx.width}px`,
    height: `${_ctx.height}px`
  }, [createElementVNode("rect", {
    x: $data.x,
    y: $data.y,
    width: $data.w,
    height: $data.h,
    fill: $data.mergedColor[0]
  }, [createElementVNode("animate", {
    attributeName: $props.reverse ? 'height' : 'width',
    from: "0",
    to: $props.reverse ? _ctx.height : _ctx.width,
    dur: `${$props.dur}s`,
    calcMode: "spline",
    keyTimes: "0;1",
    keySplines: ".42,0,.58,1",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_3$i)], 8 /* PROPS */, _hoisted_2$k), createElementVNode("rect", {
    x: $data.x,
    y: $data.y,
    width: "1",
    height: "1",
    fill: $data.mergedColor[1]
  }, [createElementVNode("animate", {
    attributeName: $props.reverse ? 'y' : 'x',
    from: "0",
    to: $props.reverse ? _ctx.height : _ctx.width,
    dur: `${$props.dur}s`,
    calcMode: "spline",
    keyTimes: "0;1",
    keySplines: "0.42,0,0.58,1",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_5$d)], 8 /* PROPS */, _hoisted_4$f)], 8 /* PROPS */, _hoisted_1$k))], 512 /* NEED_PATCH */);
}

var css_248z$l = ".dv-decoration-2 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n";
styleInject(css_248z$l);

script$l.render = render$l;
script$l.__file = "src/components/decoration2/src/main.vue";

function decoration2 (Vue) {
  Vue.component(script$l.name, script$l);
}

var script$k = {
  name: "DvDecoration3",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const pointSideLength = 7;
    return {
      ref: "decoration-3",
      svgWH: [300, 35],
      svgScale: [1, 1],
      rowNum: 2,
      rowPoints: 25,
      pointSideLength,
      halfPointSideLength: pointSideLength / 2,
      points: [],
      defaultColor: ["#7acaec", "transparent"],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    calcSVGData() {
      const {
        calcPointsPosition,
        calcScale
      } = this;
      calcPointsPosition();
      calcScale();
    },
    calcPointsPosition() {
      const {
        svgWH,
        rowNum,
        rowPoints
      } = this;
      const [w, h] = svgWH;
      const horizontalGap = w / (rowPoints + 1);
      const verticalGap = h / (rowNum + 1);
      let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
      this.points = points.reduce((all, item) => [...all, ...item], []);
    },
    calcScale() {
      const {
        width,
        height,
        svgWH
      } = this;
      const [w, h] = svgWH;
      this.svgScale = [width / w, height / h];
    },
    onResize() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$j = ["width", "height"];
const _hoisted_2$j = ["fill", "x", "y", "width", "height"];
const _hoisted_3$h = ["values", "dur", "begin"];
function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-3",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: `${$data.svgWH[0]}px`,
    height: `${$data.svgWH[1]}px`,
    style: normalizeStyle(`transform:scale(${$data.svgScale[0]},${$data.svgScale[1]});`)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.points, (point, i) => {
    return openBlock(), createElementBlock("rect", {
      key: i,
      fill: $data.mergedColor[0],
      x: point[0] - $data.halfPointSideLength,
      y: point[1] - $data.halfPointSideLength,
      width: $data.pointSideLength,
      height: $data.pointSideLength
    }, [Math.random() > 0.6 ? (openBlock(), createElementBlock("animate", {
      key: 0,
      attributeName: "fill",
      values: `${$data.mergedColor.join(';')}`,
      dur: Math.random() + 1 + 's',
      begin: Math.random() * 2,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_3$h)) : createCommentVNode("v-if", true)], 8 /* PROPS */, _hoisted_2$j);
  }), 128 /* KEYED_FRAGMENT */))], 12 /* STYLE, PROPS */, _hoisted_1$j))], 512 /* NEED_PATCH */);
}

var css_248z$k = ".dv-decoration-3 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-3 svg {\n  transform-origin: left top;\n}\n";
styleInject(css_248z$k);

script$k.render = render$k;
script$k.__file = "src/components/decoration3/src/main.vue";

function decoration3 (Vue) {
  Vue.component(script$k.name, script$k);
}

var script$j = {
  name: 'DvDecoration4',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    reverse: {
      type: Boolean,
      default: false
    },
    dur: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      ref: 'decoration-4',
      defaultColor: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$i = ["width", "height"];
const _hoisted_2$i = ["stroke", "points"];
const _hoisted_3$g = ["stroke", "points"];
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-4",
    ref: $data.ref
  }, [createElementVNode("div", {
    class: normalizeClass(`container ${$props.reverse ? 'reverse' : 'normal'}`),
    style: normalizeStyle($props.reverse ? `width:${_ctx.width}px;height:5px;animation-duration:${$props.dur}s` : `width:5px;height:${_ctx.height}px;animation-duration:${$props.dur}s`)
  }, [(openBlock(), createElementBlock("svg", {
    width: $props.reverse ? _ctx.width : 5,
    height: $props.reverse ? 5 : _ctx.height
  }, [createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    points: $props.reverse ? `0, 2.5 ${_ctx.width}, 2.5` : `2.5, 0 2.5, ${_ctx.height}`
  }, null, 8 /* PROPS */, _hoisted_2$i), createElementVNode("polyline", {
    class: "bold-line",
    stroke: $data.mergedColor[1],
    "stroke-width": "3",
    "stroke-dasharray": "20, 80",
    "stroke-dashoffset": "-30",
    points: $props.reverse ? `0, 2.5 ${_ctx.width}, 2.5` : `2.5, 0 2.5, ${_ctx.height}`
  }, null, 8 /* PROPS */, _hoisted_3$g)], 8 /* PROPS */, _hoisted_1$i))], 6 /* CLASS, STYLE */)], 512 /* NEED_PATCH */);
}

var css_248z$j = ".dv-decoration-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-4 .container {\n  display: flex;\n  overflow: hidden;\n  position: absolute;\n  flex: 1;\n}\n.dv-decoration-4 .normal {\n  animation: ani-height ease-in-out infinite;\n  left: 50%;\n  margin-left: -2px;\n}\n.dv-decoration-4 .reverse {\n  animation: ani-width ease-in-out infinite;\n  top: 50%;\n  margin-top: -2px;\n}\n@keyframes ani-height {\n0% {\n    height: 0%;\n}\n70% {\n    height: 100%;\n}\n100% {\n    height: 100%;\n}\n}\n@keyframes ani-width {\n0% {\n    width: 0%;\n}\n70% {\n    width: 100%;\n}\n100% {\n    width: 100%;\n}\n}\n";
styleInject(css_248z$j);

script$j.render = render$j;
script$j.__file = "src/components/decoration4/src/main.vue";

function decoration4 (Vue) {
  Vue.component(script$j.name, script$j);
}

var script$i = {
  name: 'DvDecoration5',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    dur: {
      type: Number,
      default: 1.2
    }
  },
  data() {
    return {
      ref: 'decoration-5',
      line1Points: '',
      line2Points: '',
      line1Length: 0,
      line2Length: 0,
      defaultColor: ['#3f96a5', '#3f96a5'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    calcSVGData() {
      const {
        width,
        height
      } = this;
      let line1Points = [[0, height * 0.2], [width * 0.18, height * 0.2], [width * 0.2, height * 0.4], [width * 0.25, height * 0.4], [width * 0.27, height * 0.6], [width * 0.72, height * 0.6], [width * 0.75, height * 0.4], [width * 0.8, height * 0.4], [width * 0.82, height * 0.2], [width, height * 0.2]];
      let line2Points = [[width * 0.3, height * 0.8], [width * 0.7, height * 0.8]];
      const line1Length = util_7(line1Points);
      const line2Length = util_7(line2Points);
      line1Points = line1Points.map(point => point.join(',')).join(' ');
      line2Points = line2Points.map(point => point.join(',')).join(' ');
      this.line1Points = line1Points;
      this.line2Points = line2Points;
      this.line1Length = line1Length;
      this.line2Length = line2Length;
    },
    onResize() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$h = ["width", "height"];
const _hoisted_2$h = ["stroke", "points"];
const _hoisted_3$f = ["from", "to", "dur"];
const _hoisted_4$e = ["stroke", "points"];
const _hoisted_5$c = ["from", "to", "dur"];
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-5",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polyline", {
    fill: "transparent",
    stroke: $data.mergedColor[0],
    "stroke-width": "3",
    points: $data.line1Points
  }, [createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    attributeType: "XML",
    from: `0, ${$data.line1Length / 2}, 0, ${$data.line1Length / 2}`,
    to: `0, 0, ${$data.line1Length}, 0`,
    dur: `${$props.dur}s`,
    begin: "0s",
    calcMode: "spline",
    keyTimes: "0;1",
    keySplines: "0.4,1,0.49,0.98",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_3$f)], 8 /* PROPS */, _hoisted_2$h), createElementVNode("polyline", {
    fill: "transparent",
    stroke: $data.mergedColor[1],
    "stroke-width": "2",
    points: $data.line2Points
  }, [createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    attributeType: "XML",
    from: `0, ${$data.line2Length / 2}, 0, ${$data.line2Length / 2}`,
    to: `0, 0, ${$data.line2Length}, 0`,
    dur: `${$props.dur}s`,
    begin: "0s",
    calcMode: "spline",
    keyTimes: "0;1",
    keySplines: ".4,1,.49,.98",
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_5$c)], 8 /* PROPS */, _hoisted_4$e)], 8 /* PROPS */, _hoisted_1$h))], 512 /* NEED_PATCH */);
}

var css_248z$i = ".dv-decoration-5 {\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$i);

script$i.render = render$i;
script$i.__file = "src/components/decoration5/src/main.vue";

function decoration5 (Vue) {
  Vue.component(script$i.name, script$i);
}

var script$h = {
  name: "DvDecoration6",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const rectWidth = 7;
    return {
      ref: "decoration-6",
      svgWH: [300, 35],
      svgScale: [1, 1],
      rowNum: 1,
      rowPoints: 40,
      rectWidth,
      halfRectWidth: rectWidth / 2,
      points: [],
      heights: [],
      minHeights: [],
      randoms: [],
      defaultColor: ["#7acaec", "#7acaec"],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    calcSVGData() {
      const {
        calcPointsPosition,
        calcScale
      } = this;
      calcPointsPosition();
      calcScale();
    },
    calcPointsPosition() {
      const {
        svgWH,
        rowNum,
        rowPoints
      } = this;
      const [w, h] = svgWH;
      const horizontalGap = w / (rowPoints + 1);
      const verticalGap = h / (rowNum + 1);
      let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
      this.points = points.reduce((all, item) => [...all, ...item], []);
      const heights = this.heights = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() > 0.8 ? randomExtend(0.7 * h, h) : randomExtend(0.2 * h, 0.5 * h));
      this.minHeights = new Array(rowNum * rowPoints).fill(0).map((foo, i) => heights[i] * Math.random());
      this.randoms = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() + 1.5);
    },
    calcScale() {
      const {
        width,
        height,
        svgWH
      } = this;
      const [w, h] = svgWH;
      this.svgScale = [width / w, height / h];
    },
    onResize() {
      const {
        calcSVGData
      } = this;
      calcSVGData();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$g = ["width", "height"];
const _hoisted_2$g = ["fill", "x", "y", "width", "height"];
const _hoisted_3$e = ["values", "dur"];
const _hoisted_4$d = ["values", "dur"];
function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-6",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: `${$data.svgWH[0]}px`,
    height: `${$data.svgWH[1]}px`,
    style: normalizeStyle(`transform:scale(${$data.svgScale[0]},${$data.svgScale[1]});`)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.points, (point, i) => {
    return openBlock(), createElementBlock("rect", {
      key: i,
      fill: $data.mergedColor[Math.random() > 0.5 ? 0 : 1],
      x: point[0] - $data.halfRectWidth,
      y: point[1] - $data.heights[i] / 2,
      width: $data.rectWidth,
      height: $data.heights[i]
    }, [createElementVNode("animate", {
      attributeName: "y",
      values: `${point[1] - $data.minHeights[i] / 2};${point[1] - $data.heights[i] / 2};${point[1] - $data.minHeights[i] / 2}`,
      dur: `${$data.randoms[i]}s`,
      keyTimes: "0;0.5;1",
      calcMode: "spline",
      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
      begin: "0s",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_3$e), createElementVNode("animate", {
      attributeName: "height",
      values: `${$data.minHeights[i]};${$data.heights[i]};${$data.minHeights[i]}`,
      dur: `${$data.randoms[i]}s`,
      keyTimes: "0;0.5;1",
      calcMode: "spline",
      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
      begin: "0s",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_4$d)], 8 /* PROPS */, _hoisted_2$g);
  }), 128 /* KEYED_FRAGMENT */))], 12 /* STYLE, PROPS */, _hoisted_1$g))], 512 /* NEED_PATCH */);
}

var css_248z$h = ".dv-decoration-6 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-6 svg {\n  transform-origin: left top;\n}\n";
styleInject(css_248z$h);

script$h.render = render$h;
script$h.__file = "src/components/decoration6/src/main.vue";

function decoration6 (Vue) {
  Vue.component(script$h.name, script$h);
}

var script$g = {
  name: 'DvDecoration7',
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultColor: ['#1dc1f5', '#1dc1f5'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$f = {
  class: "dv-decoration-7"
};
const _hoisted_2$f = {
  width: "21px",
  height: "20px"
};
const _hoisted_3$d = ["stroke"];
const _hoisted_4$c = ["stroke"];
const _hoisted_5$b = {
  width: "21px",
  height: "20px"
};
const _hoisted_6$a = ["stroke"];
const _hoisted_7$a = ["stroke"];
function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$f, [(openBlock(), createElementBlock("svg", _hoisted_2$f, [createElementVNode("polyline", {
    "stroke-width": "4",
    fill: "transparent",
    stroke: $data.mergedColor[0],
    points: "10, 0 19, 10 10, 20"
  }, null, 8 /* PROPS */, _hoisted_3$d), createElementVNode("polyline", {
    "stroke-width": "2",
    fill: "transparent",
    stroke: $data.mergedColor[1],
    points: "2, 0 11, 10 2, 20"
  }, null, 8 /* PROPS */, _hoisted_4$c)])), renderSlot(_ctx.$slots, "default"), (openBlock(), createElementBlock("svg", _hoisted_5$b, [createElementVNode("polyline", {
    "stroke-width": "4",
    fill: "transparent",
    stroke: $data.mergedColor[0],
    points: "11, 0 2, 10 11, 20"
  }, null, 8 /* PROPS */, _hoisted_6$a), createElementVNode("polyline", {
    "stroke-width": "2",
    fill: "transparent",
    stroke: $data.mergedColor[1],
    points: "19, 0 10, 10 19, 20"
  }, null, 8 /* PROPS */, _hoisted_7$a)]))]);
}

var css_248z$g = ".dv-decoration-7 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n";
styleInject(css_248z$g);

script$g.render = render$g;
script$g.__file = "src/components/decoration7/src/main.vue";

function decoration7 (Vue) {
  Vue.component(script$g.name, script$g);
}

var script$f = {
  name: 'DvDecoration8',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ref: 'decoration-8',
      defaultColor: ['#3f96a5', '#3f96a5'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    xPos(pos) {
      const {
        reverse,
        width
      } = this;
      if (!reverse) return pos;
      return width - pos;
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$e = ["width", "height"];
const _hoisted_2$e = ["stroke", "points"];
const _hoisted_3$c = ["stroke", "points"];
const _hoisted_4$b = ["stroke", "points"];
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-8",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    "stroke-width": "2",
    fill: "transparent",
    points: `${$options.xPos(0)}, 0 ${$options.xPos(30)}, ${_ctx.height / 2}`
  }, null, 8 /* PROPS */, _hoisted_2$e), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    "stroke-width": "2",
    fill: "transparent",
    points: `${$options.xPos(20)}, 0 ${$options.xPos(50)}, ${_ctx.height / 2} ${$options.xPos(_ctx.width)}, ${_ctx.height / 2}`
  }, null, 8 /* PROPS */, _hoisted_3$c), createElementVNode("polyline", {
    stroke: $data.mergedColor[1],
    fill: "transparent",
    "stroke-width": "3",
    points: `${$options.xPos(0)}, ${_ctx.height - 3}, ${$options.xPos(200)}, ${_ctx.height - 3}`
  }, null, 8 /* PROPS */, _hoisted_4$b)], 8 /* PROPS */, _hoisted_1$e))], 512 /* NEED_PATCH */);
}

var css_248z$f = ".dv-decoration-8 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$f);

script$f.render = render$f;
script$f.__file = "src/components/decoration8/src/main.vue";

function decoration8 (Vue) {
  Vue.component(script$f.name, script$f);
}

var script$e = {
  name: 'DvDecoration9',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    dur: {
      type: Number,
      default: 3
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'decoration-9',
      polygonId: `decoration-9-polygon-${id}`,
      svgWH: [100, 100],
      svgScale: [1, 1],
      defaultColor: ['rgba(3, 166, 224, 0.8)', 'rgba(3, 166, 224, 0.5)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcScale
      } = this;
      calcScale();
    },
    calcScale() {
      const {
        width,
        height,
        svgWH
      } = this;
      const [w, h] = svgWH;
      this.svgScale = [width / w, height / h];
    },
    onResize() {
      const {
        calcScale
      } = this;
      calcScale();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    },
    fade: $
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$d = ["width", "height"];
const _hoisted_2$d = ["id"];
const _hoisted_3$b = ["stroke"];
const _hoisted_4$a = ["dur"];
const _hoisted_5$a = ["stroke"];
const _hoisted_6$9 = ["dur"];
const _hoisted_7$9 = ["stroke"];
const _hoisted_8$6 = ["xlink:href", "stroke", "fill"];
const _hoisted_9$5 = ["dur", "begin"];
const _hoisted_10$4 = ["stroke"];
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-9",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: `${$data.svgWH[0]}px`,
    height: `${$data.svgWH[1]}px`,
    style: normalizeStyle(`transform:scale(${$data.svgScale[0]},${$data.svgScale[1]});`)
  }, [createElementVNode("defs", null, [createElementVNode("polygon", {
    id: $data.polygonId,
    points: "15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5"
  }, null, 8 /* PROPS */, _hoisted_2$d)]), createElementVNode("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "transparent",
    stroke: $data.mergedColor[1],
    "stroke-width": "10",
    "stroke-dasharray": "80, 100, 30, 100"
  }, [createElementVNode("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 50 50;360 50 50",
    dur: `${$props.dur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_4$a)], 8 /* PROPS */, _hoisted_3$b), createElementVNode("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "transparent",
    stroke: $data.mergedColor[0],
    "stroke-width": "6",
    "stroke-dasharray": "50, 66, 100, 66"
  }, [createElementVNode("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 50 50;-360 50 50",
    dur: `${$props.dur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_6$9)], 8 /* PROPS */, _hoisted_5$a), createElementVNode("circle", {
    cx: "50",
    cy: "50",
    r: "38",
    fill: "transparent",
    stroke: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 30),
    "stroke-width": "1",
    "stroke-dasharray": "5, 1"
  }, null, 8 /* PROPS */, _hoisted_7$9), (openBlock(true), createElementBlock(Fragment, null, renderList(new Array(20).fill(0), (foo, i) => {
    return openBlock(), createElementBlock("use", {
      key: i,
      "xlink:href": `#${$data.polygonId}`,
      stroke: $data.mergedColor[1],
      fill: Math.random() > 0.4 ? 'transparent' : $data.mergedColor[0]
    }, [createElementVNode("animateTransform", {
      attributeName: "transform",
      type: "rotate",
      values: "0 50 50;360 50 50",
      dur: `${$props.dur}s`,
      begin: `${i * $props.dur / 20}s`,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_9$5)], 8 /* PROPS */, _hoisted_8$6);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("circle", {
    cx: "50",
    cy: "50",
    r: "26",
    fill: "transparent",
    stroke: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 30),
    "stroke-width": "1",
    "stroke-dasharray": "5, 1"
  }, null, 8 /* PROPS */, _hoisted_10$4)], 12 /* STYLE, PROPS */, _hoisted_1$d)), renderSlot(_ctx.$slots, "default")], 512 /* NEED_PATCH */);
}

var css_248z$e = ".dv-decoration-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dv-decoration-9 svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  transform-origin: left top;\n}\n";
styleInject(css_248z$e);

script$e.render = render$e;
script$e.__file = "src/components/decoration9/src/main.vue";

function decoration9 (Vue) {
  Vue.component(script$e.name, script$e);
}

var script$d = {
  name: 'DvDecoration10',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'decoration-10',
      animationId1: `d10ani1${id}`,
      animationId2: `d10ani2${id}`,
      animationId3: `d10ani3${id}`,
      animationId4: `d10ani4${id}`,
      animationId5: `d10ani5${id}`,
      animationId6: `d10ani6${id}`,
      animationId7: `d10ani7${id}`,
      defaultColor: ['#00c2ff', 'rgba(0, 194, 255, 0.3)'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    }
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$c = ["width", "height"];
const _hoisted_2$c = ["stroke", "points"];
const _hoisted_3$a = ["stroke", "points", "stroke-dasharray"];
const _hoisted_4$9 = ["id", "values", "begin"];
const _hoisted_5$9 = ["values", "begin"];
const _hoisted_6$8 = ["stroke", "points", "stroke-dasharray"];
const _hoisted_7$8 = ["id", "values", "begin"];
const _hoisted_8$5 = ["values", "begin"];
const _hoisted_9$4 = ["stroke", "points", "stroke-dasharray"];
const _hoisted_10$3 = ["id", "values", "begin"];
const _hoisted_11$3 = ["values", "begin"];
const _hoisted_12$3 = ["cy", "fill"];
const _hoisted_13$3 = ["id", "values", "begin"];
const _hoisted_14$3 = ["cx", "cy", "fill"];
const _hoisted_15$3 = ["id", "values", "begin"];
const _hoisted_16$3 = ["values", "begin"];
const _hoisted_17$3 = ["cx", "cy", "fill"];
const _hoisted_18$2 = ["id", "values", "begin"];
const _hoisted_19$2 = ["values", "begin"];
const _hoisted_20$2 = ["cx", "cy", "fill"];
const _hoisted_21$2 = ["id", "values", "begin"];
const _hoisted_22$2 = ["values", "begin"];
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-10",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polyline", {
    stroke: $data.mergedColor[1],
    "stroke-width": "2",
    points: `0, ${_ctx.height / 2} ${_ctx.width}, ${_ctx.height / 2}`
  }, null, 8 /* PROPS */, _hoisted_2$c), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    "stroke-width": "2",
    points: `5, ${_ctx.height / 2} ${_ctx.width * 0.2 - 3}, ${_ctx.height / 2}`,
    "stroke-dasharray": `0, ${_ctx.width * 0.2}`,
    fill: "freeze"
  }, [createElementVNode("animate", {
    id: $data.animationId2,
    attributeName: "stroke-dasharray",
    values: `0, ${_ctx.width * 0.2};${_ctx.width * 0.2}, 0;`,
    dur: "3s",
    begin: `${$data.animationId1}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_4$9), createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    values: `${_ctx.width * 0.2}, 0;0, ${_ctx.width * 0.2}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_5$9)], 8 /* PROPS */, _hoisted_3$a), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    "stroke-width": "2",
    points: `${_ctx.width * 0.2 + 3}, ${_ctx.height / 2} ${_ctx.width * 0.8 - 3}, ${_ctx.height / 2}`,
    "stroke-dasharray": `0, ${_ctx.width * 0.6}`
  }, [createElementVNode("animate", {
    id: $data.animationId4,
    attributeName: "stroke-dasharray",
    values: `0, ${_ctx.width * 0.6};${_ctx.width * 0.6}, 0`,
    dur: "3s",
    begin: `${$data.animationId3}.end + 1s`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_7$8), createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    values: `${_ctx.width * 0.6}, 0;0, ${_ctx.width * 0.6}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_8$5)], 8 /* PROPS */, _hoisted_6$8), createElementVNode("polyline", {
    stroke: $data.mergedColor[0],
    "stroke-width": "2",
    points: `${_ctx.width * 0.8 + 3}, ${_ctx.height / 2} ${_ctx.width - 5}, ${_ctx.height / 2}`,
    "stroke-dasharray": `0, ${_ctx.width * 0.2}`
  }, [createElementVNode("animate", {
    id: $data.animationId6,
    attributeName: "stroke-dasharray",
    values: `0, ${_ctx.width * 0.2};${_ctx.width * 0.2}, 0`,
    dur: "3s",
    begin: `${$data.animationId5}.end + 1s`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_10$3), createElementVNode("animate", {
    attributeName: "stroke-dasharray",
    values: `${_ctx.width * 0.2}, 0;0, ${_ctx.width * 0.3}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_11$3)], 8 /* PROPS */, _hoisted_9$4), createElementVNode("circle", {
    cx: "2",
    cy: _ctx.height / 2,
    r: "2",
    fill: $data.mergedColor[1]
  }, [createElementVNode("animate", {
    id: $data.animationId1,
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[0]}`,
    begin: `0s;${$data.animationId7}.end`,
    dur: "0.3s",
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_13$3)], 8 /* PROPS */, _hoisted_12$3), createElementVNode("circle", {
    cx: _ctx.width * 0.2,
    cy: _ctx.height / 2,
    r: "2",
    fill: $data.mergedColor[1]
  }, [createElementVNode("animate", {
    id: $data.animationId3,
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[0]}`,
    begin: `${$data.animationId2}.end`,
    dur: "0.3s",
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_15$3), createElementVNode("animate", {
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[1]}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_16$3)], 8 /* PROPS */, _hoisted_14$3), createElementVNode("circle", {
    cx: _ctx.width * 0.8,
    cy: _ctx.height / 2,
    r: "2",
    fill: $data.mergedColor[1]
  }, [createElementVNode("animate", {
    id: $data.animationId5,
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[0]}`,
    begin: `${$data.animationId4}.end`,
    dur: "0.3s",
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_18$2), createElementVNode("animate", {
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[1]}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_19$2)], 8 /* PROPS */, _hoisted_17$3), createElementVNode("circle", {
    cx: _ctx.width - 2,
    cy: _ctx.height / 2,
    r: "2",
    fill: $data.mergedColor[1]
  }, [createElementVNode("animate", {
    id: $data.animationId7,
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[0]}`,
    begin: `${$data.animationId6}.end`,
    dur: "0.3s",
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_21$2), createElementVNode("animate", {
    attributeName: "fill",
    values: `${$data.mergedColor[1]};${$data.mergedColor[1]}`,
    dur: "0.01s",
    begin: `${$data.animationId7}.end`,
    fill: "freeze"
  }, null, 8 /* PROPS */, _hoisted_22$2)], 8 /* PROPS */, _hoisted_20$2)], 8 /* PROPS */, _hoisted_1$c))], 512 /* NEED_PATCH */);
}

var css_248z$d = ".dv-decoration-10 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n";
styleInject(css_248z$d);

script$d.render = render$d;
script$d.__file = "src/components/decoration10/src/main.vue";

function decoration10 (Vue) {
  Vue.component(script$d.name, script$d);
}

var script$c = {
  name: 'DvDecoration11',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ref: 'decoration-11',
      defaultColor: ['#1a98fc', '#2cf7fe'],
      mergedColor: []
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  methods: {
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    },
    fade: $
  },
  mounted() {
    const {
      mergeColor
    } = this;
    mergeColor();
  }
};

const _hoisted_1$b = ["width", "height"];
const _hoisted_2$b = ["fill", "stroke"];
const _hoisted_3$9 = ["fill", "stroke", "points"];
const _hoisted_4$8 = ["fill", "stroke", "points"];
const _hoisted_5$8 = ["fill", "stroke", "points"];
const _hoisted_6$7 = ["fill", "stroke", "points"];
const _hoisted_7$7 = ["stroke", "points"];
const _hoisted_8$4 = ["stroke", "points"];
const _hoisted_9$3 = {
  class: "decoration-content"
};
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-11",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("polygon", {
    fill: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 10),
    stroke: $data.mergedColor[1],
    points: `20 10, 25 4, 55 4 60 10`
  }, null, 8 /* PROPS */, _hoisted_2$b), createElementVNode("polygon", {
    fill: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 10),
    stroke: $data.mergedColor[1],
    points: `20 ${_ctx.height - 10}, 25 ${_ctx.height - 4}, 55 ${_ctx.height - 4} 60 ${_ctx.height - 10}`
  }, null, 8 /* PROPS */, _hoisted_3$9), createElementVNode("polygon", {
    fill: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 10),
    stroke: $data.mergedColor[1],
    points: `${_ctx.width - 20} 10, ${_ctx.width - 25} 4, ${_ctx.width - 55} 4 ${_ctx.width - 60} 10`
  }, null, 8 /* PROPS */, _hoisted_4$8), createElementVNode("polygon", {
    fill: $options.fade($data.mergedColor[1] || $data.defaultColor[1], 10),
    stroke: $data.mergedColor[1],
    points: `${_ctx.width - 20} ${_ctx.height - 10}, ${_ctx.width - 25} ${_ctx.height - 4}, ${_ctx.width - 55} ${_ctx.height - 4} ${_ctx.width - 60} ${_ctx.height - 10}`
  }, null, 8 /* PROPS */, _hoisted_5$8), createElementVNode("polygon", {
    fill: $options.fade($data.mergedColor[0] || $data.defaultColor[0], 20),
    stroke: $data.mergedColor[0],
    points: `
          20 10, 5 ${_ctx.height / 2} 20 ${_ctx.height - 10}
          ${_ctx.width - 20} ${_ctx.height - 10} ${_ctx.width - 5} ${_ctx.height / 2} ${_ctx.width - 20} 10
        `
  }, null, 8 /* PROPS */, _hoisted_6$7), createElementVNode("polyline", {
    fill: "transparent",
    stroke: $options.fade($data.mergedColor[0] || $data.defaultColor[0], 70),
    points: `25 18, 15 ${_ctx.height / 2} 25 ${_ctx.height - 18}`
  }, null, 8 /* PROPS */, _hoisted_7$7), createElementVNode("polyline", {
    fill: "transparent",
    stroke: $options.fade($data.mergedColor[0] || $data.defaultColor[0], 70),
    points: `${_ctx.width - 25} 18, ${_ctx.width - 15} ${_ctx.height / 2} ${_ctx.width - 25} ${_ctx.height - 18}`
  }, null, 8 /* PROPS */, _hoisted_8$4)], 8 /* PROPS */, _hoisted_1$b)), createElementVNode("div", _hoisted_9$3, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$c = ".dv-decoration-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-11 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n";
styleInject(css_248z$c);

script$c.render = render$c;
script$c.__file = "src/components/decoration11/src/main.vue";

function decoration11 (Vue) {
  Vue.component(script$c.name, script$c);
}

var script$b = {
  name: 'DvDecoration12',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => []
    },
    /**
     * @description Scan animation dur
     */
    scanDur: {
      type: Number,
      default: 3
    },
    /**
     * @description Halo animation dur
     */
    haloDur: {
      type: Number,
      default: 2
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'decoration-12',
      gId: `decoration-12-g-${id}`,
      gradientId: `decoration-12-gradient-${id}`,
      defaultColor: ['#2783ce', '#2cf7fe'],
      mergedColor: [],
      pathD: [],
      pathColor: [],
      circleR: [],
      splitLinePoints: [],
      arcD: [],
      segment: 30,
      sectorAngle: Math.PI / 3,
      ringNum: 3,
      ringWidth: 1,
      showSplitLine: true
    };
  },
  watch: {
    color() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }
  },
  computed: {
    x() {
      const {
        width
      } = this;
      return width / 2;
    },
    y() {
      const {
        height
      } = this;
      return height / 2;
    }
  },
  methods: {
    init() {
      const {
        mergeColor,
        calcPathD,
        calcPathColor,
        calcCircleR,
        calcSplitLinePoints,
        calcArcD
      } = this;
      mergeColor();
      calcPathD();
      calcPathColor();
      calcCircleR();
      calcSplitLinePoints();
      calcArcD();
    },
    mergeColor() {
      const {
        color,
        defaultColor
      } = this;
      this.mergedColor = util_2(util_1(defaultColor, true), color || []);
    },
    calcPathD() {
      const {
        x,
        y,
        width,
        segment,
        sectorAngle
      } = this;
      const startAngle = -Math.PI / 2;
      const angleGap = sectorAngle / segment;
      const r = width / 4;
      let lastEndPoints = util_13(x, y, r, startAngle);
      this.pathD = new Array(segment).fill('').map((_, i) => {
        const endPoints = util_13(x, y, r, startAngle - (i + 1) * angleGap).map(_ => _.toFixed(5));
        const d = `M${lastEndPoints.join(',')} A${r}, ${r} 0 0 0 ${endPoints.join(',')}`;
        lastEndPoints = endPoints;
        return d;
      });
    },
    calcPathColor() {
      const {
        mergedColor: [color],
        segment
      } = this;
      const colorGap = 100 / (segment - 1);
      this.pathColor = new Array(segment).fill(color).map((_, i) => $(color, 100 - i * colorGap));
    },
    calcCircleR() {
      const {
        segment,
        ringNum,
        width,
        ringWidth
      } = this;
      const radiusGap = (width / 2 - ringWidth / 2) / ringNum;
      this.circleR = new Array(ringNum).fill(0).map((_, i) => radiusGap * (i + 1));
    },
    calcSplitLinePoints() {
      const {
        x,
        y,
        width
      } = this;
      const angleGap = Math.PI / 6;
      const r = width / 2;
      this.splitLinePoints = new Array(6).fill('').map((_, i) => {
        const startAngle = angleGap * (i + 1);
        const endAngle = startAngle + Math.PI;
        const startPoint = util_13(x, y, r, startAngle);
        const endPoint = util_13(x, y, r, endAngle);
        return `${startPoint.join(',')} ${endPoint.join(',')}`;
      });
    },
    calcArcD() {
      const {
        x,
        y,
        width
      } = this;
      const angleGap = Math.PI / 6;
      const r = width / 2 - 1;
      this.arcD = new Array(4).fill('').map((_, i) => {
        const startAngle = angleGap * (3 * i + 1);
        const endAngle = startAngle + angleGap;
        const startPoint = util_13(x, y, r, startAngle);
        const endPoint = util_13(x, y, r, endAngle);
        return `M${startPoint.join(',')} A${x}, ${y} 0 0 1 ${endPoint.join(',')}`;
      });
    },
    afterAutoResizeMixinInit() {
      const {
        init
      } = this;
      init();
    },
    fade: $
  }
};

const _hoisted_1$a = ["width", "height"];
const _hoisted_2$a = ["id"];
const _hoisted_3$8 = ["stroke", "stroke-width", "d"];
const _hoisted_4$7 = ["id"];
const _hoisted_5$7 = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "transparent",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_6$6 = ["stop-color"];
const _hoisted_7$6 = ["r", "cx", "cy", "stroke"];
const _hoisted_8$3 = ["cx", "cy", "fill"];
const _hoisted_9$2 = ["values", "dur"];
const _hoisted_10$2 = ["dur"];
const _hoisted_11$2 = ["cx", "cy", "fill"];
const _hoisted_12$2 = {
  key: 0
};
const _hoisted_13$2 = ["points", "stroke"];
const _hoisted_14$2 = ["d", "stroke"];
const _hoisted_15$2 = ["xlink:href"];
const _hoisted_16$2 = ["values", "dur"];
const _hoisted_17$2 = {
  class: "decoration-content"
};
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-decoration-12",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("g", {
    id: $data.gId
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.pathD, (d, i) => {
    return openBlock(), createElementBlock("path", {
      stroke: $data.pathColor[i],
      "stroke-width": _ctx.width / 2,
      fill: "transparent",
      key: d,
      d: d
    }, null, 8 /* PROPS */, _hoisted_3$8);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_2$a), createElementVNode("radialGradient", {
    id: $data.gradientId,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, [_hoisted_5$7, createElementVNode("stop", {
    offset: "100%",
    "stop-color": $options.fade($data.mergedColor[1] || $data.defaultColor[1], 30),
    "stop-opacity": "1"
  }, null, 8 /* PROPS */, _hoisted_6$6)], 8 /* PROPS */, _hoisted_4$7)]), (openBlock(true), createElementBlock(Fragment, null, renderList($data.circleR, r => {
    return openBlock(), createElementBlock("circle", {
      key: r,
      r: r,
      cx: $options.x,
      cy: $options.y,
      stroke: $data.mergedColor[1],
      "stroke-width": 0.5,
      fill: "transparent"
    }, null, 8 /* PROPS */, _hoisted_7$6);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("circle", {
    r: "1",
    cx: $options.x,
    cy: $options.y,
    stroke: "transparent",
    fill: `url(#${$data.gradientId})`
  }, [createElementVNode("animate", {
    attributeName: "r",
    values: `1;${_ctx.width / 2}`,
    dur: `${$props.haloDur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_9$2), createElementVNode("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: `${$props.haloDur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_10$2)], 8 /* PROPS */, _hoisted_8$3), createElementVNode("circle", {
    r: "2",
    cx: $options.x,
    cy: $options.y,
    fill: $data.mergedColor[1]
  }, null, 8 /* PROPS */, _hoisted_11$2), $data.showSplitLine ? (openBlock(), createElementBlock("g", _hoisted_12$2, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.splitLinePoints, p => {
    return openBlock(), createElementBlock("polyline", {
      key: p,
      points: p,
      stroke: $data.mergedColor[1],
      "stroke-width": 0.5,
      opacity: "0.5"
    }, null, 8 /* PROPS */, _hoisted_13$2);
  }), 128 /* KEYED_FRAGMENT */))])) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList($data.arcD, d => {
    return openBlock(), createElementBlock("path", {
      key: d,
      d: d,
      stroke: $data.mergedColor[1],
      "stroke-width": "2",
      fill: "transparent"
    }, null, 8 /* PROPS */, _hoisted_14$2);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("use", {
    "xlink:href": `#${$data.gId}`
  }, [createElementVNode("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: `0, ${$options.x} ${$options.y};360, ${$options.x} ${$options.y}`,
    dur: `${$props.scanDur}s`,
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_16$2)], 8 /* PROPS */, _hoisted_15$2)], 8 /* PROPS */, _hoisted_1$a)), createElementVNode("div", _hoisted_17$2, [renderSlot(_ctx.$slots, "default")])], 512 /* NEED_PATCH */);
}

var css_248z$b = ".dv-decoration-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-12 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n";
styleInject(css_248z$b);

script$b.render = render$b;
script$b.__file = "src/components/decoration12/src/main.vue";

function decoration12 (Vue) {
  Vue.component(script$b.name, script$b);
}

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(classCallCheck);

var toPrimitive = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPrimitive);

var toPropertyKey = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPropertyKey);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(defineProperty);

var bezierCurveToPolyline_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bezierCurveToPolyline = bezierCurveToPolyline;
exports.getBezierCurveLength = getBezierCurveLength;
exports["default"] = void 0;

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var sqrt = Math.sqrt,
    pow = Math.pow,
    ceil = Math.ceil,
    abs = Math.abs; // Initialize the number of points per curve

var defaultSegmentPointsNum = 50;
/**
 * @example data structure of bezierCurve
 * bezierCurve = [
 *  // Starting point of the curve
 *  [10, 10],
 *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
 *  [
 *    [20, 20], [40, 20], [50, 10]
 *  ],
 *  ...
 * ]
 */

/**
 * @description               Abstract the curve as a polyline consisting of N points
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Object}           Calculation results and related data
 * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number}           Option.cycles Number of iterations
 * @return {Number}           Option.rounds The number of recursions for the last iteration
 */

function abstractBezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var segmentsNum = bezierCurve.length - 1;
  var startPoint = bezierCurve[0];
  var endPoint = bezierCurve[segmentsNum][2];
  var segments = bezierCurve.slice(1);
  var getSegmentTPointFuns = segments.map(function (seg, i) {
    var beginPoint = i === 0 ? startPoint : segments[i - 1][2];
    return createGetBezierCurveTPointFun.apply(void 0, [beginPoint].concat((0, _toConsumableArray2["default"])(seg)));
  }); // Initialize the curve to a polyline

  var segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum);
  var segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum); // Calculate uniformly distributed points by iteratively

  var result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision);
  result.segmentPoints.push(endPoint);
  return result;
}
/**
 * @description  Generate a method for obtaining corresponding point by t according to curve data
 * @param {Array} beginPoint    BezierCurve begin point. [x, y]
 * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
 * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
 * @param {Array} endPoint      BezierCurve end point. [x, y]
 * @return {Function} Expected function
 */


function createGetBezierCurveTPointFun(beginPoint, controlPoint1, controlPoint2, endPoint) {
  return function (t) {
    var tSubed1 = 1 - t;
    var tSubed1Pow3 = pow(tSubed1, 3);
    var tSubed1Pow2 = pow(tSubed1, 2);
    var tPow3 = pow(t, 3);
    var tPow2 = pow(t, 2);
    return [beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3, beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3];
  };
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 BezierCurve begin point. [x, y]
 * @param {Array} point2 BezierCurve controlPoint1. [x, y]
 * @return {Number} Expected distance
 */


function getTwoPointDistance(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2["default"])(_ref, 2),
      ax = _ref3[0],
      ay = _ref3[1];

  var _ref4 = (0, _slicedToArray2["default"])(_ref2, 2),
      bx = _ref4[0],
      by = _ref4[1];

  return sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
}
/**
 * @description Get the sum of the array of numbers
 * @param {Array} nums An array of numbers
 * @return {Number} Expected sum
 */


function getNumsSum(nums) {
  return nums.reduce(function (sum, num) {
    return sum + num;
  }, 0);
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsDistance(segmentPoints) {
  return segmentPoints.map(function (points, i) {
    return new Array(points.length - 1).fill(0).map(function (temp, j) {
      return getTwoPointDistance(points[j], points[j + 1]);
    });
  });
}
/**
 * @description Get the distance of multiple sets of points
 * @param {Array} segmentPoints Multiple sets of point data
 * @return {Array} Distance of multiple sets of point data
 */


function getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum) {
  return getSegmentTPointFuns.map(function (getSegmentTPointFun, i) {
    var tGap = 1 / segmentPointsNum[i];
    return new Array(segmentPointsNum[i]).fill('').map(function (foo, j) {
      return getSegmentTPointFun(j * tGap);
    });
  });
}
/**
 * @description Get the sum of deviations between line segment and the average length
 * @param {Array} segmentPointsDistance Segment length of polyline
 * @param {Number} avgLength            Average length of the line segment
 * @return {Number} Deviations
 */


function getAllDeviations(segmentPointsDistance, avgLength) {
  return segmentPointsDistance.map(function (seg) {
    return seg.map(function (s) {
      return abs(s - avgLength);
    });
  }).map(function (seg) {
    return getNumsSum(seg);
  }).reduce(function (total, v) {
    return total + v;
  }, 0);
}
/**
 * @description Calculate uniformly distributed points by iteratively
 * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
 * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
 * @param {Array} segments             BezierCurve data
 * @param {Number} precision           Calculation accuracy
 * @return {Object} Calculation results and related data
 * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
 * @return {Number} Option.cycles Number of iterations
 * @return {Number} Option.rounds The number of recursions for the last iteration
 */


function calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision) {
  // The number of loops for the current iteration
  var rounds = 4; // Number of iterations

  var cycles = 1;

  var _loop = function _loop() {
    // Recalculate the number of points per curve based on the last iteration data
    var totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0); // Add last points of segment to calc exact segment length

    segmentPoints.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    var segmentPointsDistance = getSegmentPointsDistance(segmentPoints);
    var lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    var totalLength = getNumsSum(segmentlength);
    var avgLength = totalLength / lineSegmentNum; // Check if precision is reached

    var allDeviations = getAllDeviations(segmentPointsDistance, avgLength);
    if (allDeviations <= precision) return "break";
    totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1);
    var segmentPointsNum = segmentlength.map(function (length) {
      return ceil(length / totalLength * totalPointsNum);
    }); // Calculate the points after redistribution

    segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum);
    totalPointsNum = segmentPoints.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    var segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints));
    segmentPointsForLength.forEach(function (seg, i) {
      return seg.push(segments[i][2]);
    });
    segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength);
    lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
      return total + seg.length;
    }, 0);
    segmentlength = segmentPointsDistance.map(function (seg) {
      return getNumsSum(seg);
    });
    totalLength = getNumsSum(segmentlength);
    avgLength = totalLength / lineSegmentNum;
    var stepSize = 1 / totalPointsNum / 10; // Recursively for each segment of the polyline

    getSegmentTPointFuns.forEach(function (getSegmentTPointFun, i) {
      var currentSegmentPointsNum = segmentPointsNum[i];
      var t = new Array(currentSegmentPointsNum).fill('').map(function (foo, j) {
        return j / segmentPointsNum[i];
      }); // Repeated recursive offset

      for (var r = 0; r < rounds; r++) {
        var distance = getSegmentPointsDistance([segmentPoints[i]])[0];
        var deviations = distance.map(function (d) {
          return d - avgLength;
        });
        var offset = 0;

        for (var j = 0; j < currentSegmentPointsNum; j++) {
          if (j === 0) return;
          offset += deviations[j - 1];
          t[j] -= stepSize * offset;
          if (t[j] > 1) t[j] = 1;
          if (t[j] < 0) t[j] = 0;
          segmentPoints[i][j] = getSegmentTPointFun(t[j]);
        }
      }
    });
    rounds *= 4;
    cycles++;
  };

  do {
    var _ret = _loop();

    if (_ret === "break") break;
  } while (rounds <= 1025);

  segmentPoints = segmentPoints.reduce(function (all, seg) {
    return all.concat(seg);
  }, []);
  return {
    segmentPoints: segmentPoints,
    cycles: cycles,
    rounds: rounds
  };
}
/**
 * @description Get the polyline corresponding to the Bezier curve
 * @param {Array} bezierCurve BezierCurve data
 * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
 * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
 */


function bezierCurveToPolyline(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('bezierCurveToPolyline: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('bezierCurveToPolyline: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT.segmentPoints;

  return segmentPoints;
}
/**
 * @description Get the bezier curve length
 * @param {Array} bezierCurve bezierCurve data
 * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
 * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
 */


function getBezierCurveLength(bezierCurve) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  if (!bezierCurve) {
    console.error('getBezierCurveLength: Missing parameters!');
    return false;
  }

  if (!(bezierCurve instanceof Array)) {
    console.error('getBezierCurveLength: Parameter bezierCurve must be an array!');
    return false;
  }

  if (typeof precision !== 'number') {
    console.error('getBezierCurveLength: Parameter precision must be a number!');
    return false;
  }

  var _abstractBezierCurveT2 = abstractBezierCurveToPolyline(bezierCurve, precision),
      segmentPoints = _abstractBezierCurveT2.segmentPoints; // Calculate the total length of the points that make up the polyline


  var pointsDistance = getSegmentPointsDistance([segmentPoints])[0];
  var length = getNumsSum(pointsDistance);
  return length;
}

var _default = bezierCurveToPolyline;
exports["default"] = _default;
});

unwrapExports(bezierCurveToPolyline_1);
bezierCurveToPolyline_1.bezierCurveToPolyline;
bezierCurveToPolyline_1.getBezierCurveLength;

var polylineToBezierCurve_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

/**
 * @description Abstract the polyline formed by N points into a set of bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
 */
function polylineToBezierCurve(polyline) {
  var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
  var offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

  if (!(polyline instanceof Array)) {
    console.error('polylineToBezierCurve: Parameter polyline must be an array!');
    return false;
  }

  if (polyline.length <= 2) {
    console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!');
    return false;
  }

  var startPoint = polyline[0];
  var bezierCurveLineNum = polyline.length - 1;
  var bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
    return [].concat((0, _toConsumableArray2["default"])(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]]);
  });
  if (close) closeBezierCurve(bezierCurvePoints, startPoint);
  bezierCurvePoints.unshift(polyline[0]);
  return bezierCurvePoints;
}
/**
 * @description Get the control points of the Bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Number} index   The index of which get controls points's point in polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array} Control points
 */


function getBezierCurveLineControlPoints(polyline, index) {
  var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
  var offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
  var pointNum = polyline.length;
  if (pointNum < 3 || index >= pointNum) return;
  var beforePointIndex = index - 1;
  if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0;
  var afterPointIndex = index + 1;
  if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1;
  var afterNextPointIndex = index + 2;
  if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1;
  var pointBefore = polyline[beforePointIndex];
  var pointMiddle = polyline[index];
  var pointAfter = polyline[afterPointIndex];
  var pointAfterNext = polyline[afterNextPointIndex];
  return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]];
}
/**
 * @description Get the last curve of the closure
 * @param {Array} bezierCurve A set of sub-curve
 * @param {Array} startPoint  Start point
 * @return {Array} The last curve for closure
 */


function closeBezierCurve(bezierCurve, startPoint) {
  var firstSubCurve = bezierCurve[0];
  var lastSubCurve = bezierCurve.slice(-1)[0];
  bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint]);
  return bezierCurve;
}
/**
 * @description Get the symmetry point
 * @param {Array} point       Symmetric point
 * @param {Array} centerPoint Symmetric center
 * @return {Array} Symmetric point
 */


function getSymmetryPoint(point, centerPoint) {
  var _point = (0, _slicedToArray2["default"])(point, 2),
      px = _point[0],
      py = _point[1];

  var _centerPoint = (0, _slicedToArray2["default"])(centerPoint, 2),
      cx = _centerPoint[0],
      cy = _centerPoint[1];

  var minusX = cx - px;
  var minusY = cy - py;
  return [cx + minusX, cy + minusY];
}

var _default = polylineToBezierCurve;
exports["default"] = _default;
});

unwrapExports(polylineToBezierCurve_1);

var lib$3 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bezierCurveToPolyline", {
  enumerable: true,
  get: function get() {
    return bezierCurveToPolyline_1.bezierCurveToPolyline;
  }
});
Object.defineProperty(exports, "getBezierCurveLength", {
  enumerable: true,
  get: function get() {
    return bezierCurveToPolyline_1.getBezierCurveLength;
  }
});
Object.defineProperty(exports, "polylineToBezierCurve", {
  enumerable: true,
  get: function get() {
    return _polylineToBezierCurve["default"];
  }
});
exports["default"] = void 0;



var _polylineToBezierCurve = interopRequireDefault(polylineToBezierCurve_1);

var _default = {
  bezierCurveToPolyline: bezierCurveToPolyline_1.bezierCurveToPolyline,
  getBezierCurveLength: bezierCurveToPolyline_1.getBezierCurveLength,
  polylineToBezierCurve: _polylineToBezierCurve["default"]
};
exports["default"] = _default;
});

unwrapExports(lib$3);

var canvas = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawPolylinePath = drawPolylinePath;
exports.drawBezierCurvePath = drawBezierCurvePath;
exports["default"] = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

/**
 * @description Draw a polyline path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a polyline
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
function drawPolylinePath(ctx, points) {
  var beginPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var closePath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!ctx || points.length < 2) return false;
  if (beginPath) ctx.beginPath();
  points.forEach(function (point, i) {
    return point && (i === 0 ? ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(point)) : ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(point)));
  });
  if (closePath) ctx.closePath();
}
/**
 * @description Draw a bezier curve path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a bezier curve
 * @param {Array} moveTo      The point need to excute moveTo
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */


function drawBezierCurvePath(ctx, points) {
  var moveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var beginPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var closePath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (!ctx || !points) return false;
  if (beginPath) ctx.beginPath();
  if (moveTo) ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(moveTo));
  points.forEach(function (item) {
    return item && ctx.bezierCurveTo.apply(ctx, (0, _toConsumableArray2["default"])(item[0]).concat((0, _toConsumableArray2["default"])(item[1]), (0, _toConsumableArray2["default"])(item[2])));
  });
  if (closePath) ctx.closePath();
}

var _default = {
  drawPolylinePath: drawPolylinePath,
  drawBezierCurvePath: drawBezierCurvePath
};
exports["default"] = _default;
});

unwrapExports(canvas);
canvas.drawPolylinePath;
canvas.drawBezierCurvePath;

var graphs_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendNewGraph = extendNewGraph;
exports["default"] = exports.text = exports.bezierCurve = exports.smoothline = exports.polyline = exports.regPolygon = exports.sector = exports.arc = exports.ring = exports.rect = exports.ellipse = exports.circle = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _bezierCurve2 = interopRequireDefault(lib$3);





var polylineToBezierCurve = _bezierCurve2["default"].polylineToBezierCurve,
    bezierCurveToPolyline = _bezierCurve2["default"].bezierCurveToPolyline;
var circle = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_ref) {
    var shape = _ref.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Circle shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref2, _ref3) {
    var ctx = _ref2.ctx;
    var shape = _ref3.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref4) {
    var shape = _ref4.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    return (0, util$1.checkPointIsInCircle)(position, rx, ry, r);
  },
  setGraphCenter: function setGraphCenter(e, _ref5) {
    var shape = _ref5.shape,
        style = _ref5.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref6, _ref7) {
    var movementX = _ref6.movementX,
        movementY = _ref6.movementY;
    var shape = _ref7.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.circle = circle;
var ellipse = {
  shape: {
    rx: 0,
    ry: 0,
    hr: 0,
    vr: 0
  },
  validator: function validator(_ref8) {
    var shape = _ref8.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
      console.error('Ellipse shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref9, _ref10) {
    var ctx = _ref9.ctx;
    var shape = _ref10.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref11) {
    var shape = _ref11.shape;
    var rx = shape.rx,
        ry = shape.ry,
        hr = shape.hr,
        vr = shape.vr;
    var a = Math.max(hr, vr);
    var b = Math.min(hr, vr);
    var c = Math.sqrt(a * a - b * b);
    var leftFocusPoint = [rx - c, ry];
    var rightFocusPoint = [rx + c, ry];
    var distance = (0, util$1.getTwoPointDistance)(position, leftFocusPoint) + (0, util$1.getTwoPointDistance)(position, rightFocusPoint);
    return distance <= 2 * a;
  },
  setGraphCenter: function setGraphCenter(e, _ref12) {
    var shape = _ref12.shape,
        style = _ref12.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref13, _ref14) {
    var movementX = _ref13.movementX,
        movementY = _ref13.movementY;
    var shape = _ref14.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.ellipse = ellipse;
var rect = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator(_ref15) {
    var shape = _ref15.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('Rect shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref16, _ref17) {
    var ctx = _ref16.ctx;
    var shape = _ref17.shape;
    ctx.beginPath();
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref18) {
    var shape = _ref18.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    return (0, util$1.checkPointIsInRect)(position, x, y, w, h);
  },
  setGraphCenter: function setGraphCenter(e, _ref19) {
    var shape = _ref19.shape,
        style = _ref19.style;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    style.graphCenter = [x + w / 2, y + h / 2];
  },
  move: function move(_ref20, _ref21) {
    var movementX = _ref20.movementX,
        movementY = _ref20.movementY;
    var shape = _ref21.shape;
    this.attr('shape', {
      x: shape.x + movementX,
      y: shape.y + movementY
    });
  }
};
exports.rect = rect;
var ring = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator(_ref22) {
    var shape = _ref22.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Ring shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref23, _ref24) {
    var ctx = _ref23.ctx;
    var shape = _ref24.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref25) {
    var shape = _ref25.shape,
        style = _ref25.style;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r;
    var lineWidth = style.lineWidth;
    var halfLineWidth = lineWidth / 2;
    var minDistance = r - halfLineWidth;
    var maxDistance = r + halfLineWidth;
    var distance = (0, util$1.getTwoPointDistance)(position, [rx, ry]);
    return distance >= minDistance && distance <= maxDistance;
  },
  setGraphCenter: function setGraphCenter(e, _ref26) {
    var shape = _ref26.shape,
        style = _ref26.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref27, _ref28) {
    var movementX = _ref27.movementX,
        movementY = _ref27.movementY;
    var shape = _ref28.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.ring = ring;
var arc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_ref29) {
    var shape = _ref29.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('Arc shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref30, _ref31) {
    var ctx = _ref30.ctx;
    var shape = _ref31.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise);
    ctx.stroke();
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref32) {
    var shape = _ref32.shape,
        style = _ref32.style;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    var lineWidth = style.lineWidth;
    var halfLineWidth = lineWidth / 2;
    var insideRadius = r - halfLineWidth;
    var outsideRadius = r + halfLineWidth;
    return !(0, util$1.checkPointIsInSector)(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) && (0, util$1.checkPointIsInSector)(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise);
  },
  setGraphCenter: function setGraphCenter(e, _ref33) {
    var shape = _ref33.shape,
        style = _ref33.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref34, _ref35) {
    var movementX = _ref34.movementX,
        movementY = _ref34.movementY;
    var shape = _ref35.shape;
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    });
  }
};
exports.arc = arc;
var sector = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_ref36) {
    var shape = _ref36.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('Sector shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref37, _ref38) {
    var ctx = _ref37.ctx;
    var shape = _ref38.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise);
    ctx.lineTo(rx, ry);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(position, _ref39) {
    var shape = _ref39.shape;
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    return (0, util$1.checkPointIsInSector)(position, rx, ry, r, startAngle, endAngle, clockWise);
  },
  setGraphCenter: function setGraphCenter(e, _ref40) {
    var shape = _ref40.shape,
        style = _ref40.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref41, _ref42) {
    var movementX = _ref41.movementX,
        movementY = _ref41.movementY;
    var shape = _ref42.shape;
    var rx = shape.rx,
        ry = shape.ry;
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
  }
};
exports.sector = sector;
var regPolygon = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    side: 0
  },
  validator: function validator(_ref43) {
    var shape = _ref43.shape;
    var side = shape.side;
    var keys = ['rx', 'ry', 'r', 'side'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('RegPolygon shape configuration is abnormal!');
      return false;
    }

    if (side < 3) {
      console.error('RegPolygon at least trigon!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref44, _ref45) {
    var ctx = _ref44.ctx;
    var shape = _ref45.shape,
        cache = _ref45.cache;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        r = shape.r,
        side = shape.side;

    if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
      var _points = (0, util$1.getRegularPolygonPoints)(rx, ry, r, side);

      Object.assign(cache, {
        points: _points,
        rx: rx,
        ry: ry,
        r: r,
        side: side
      });
    }

    var points = cache.points;
    (0, canvas.drawPolylinePath)(ctx, points);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },
  hoverCheck: function hoverCheck(position, _ref46) {
    var cache = _ref46.cache;
    var points = cache.points;
    return (0, util$1.checkPointIsInPolygon)(position, points);
  },
  setGraphCenter: function setGraphCenter(e, _ref47) {
    var shape = _ref47.shape,
        style = _ref47.style;
    var rx = shape.rx,
        ry = shape.ry;
    style.graphCenter = [rx, ry];
  },
  move: function move(_ref48, _ref49) {
    var movementX = _ref48.movementX,
        movementY = _ref48.movementY;
    var shape = _ref49.shape,
        cache = _ref49.cache;
    var rx = shape.rx,
        ry = shape.ry;
    cache.rx += movementX;
    cache.ry += movementY;
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    });
    cache.points = cache.points.map(function (_ref50) {
      var _ref51 = (0, _slicedToArray2["default"])(_ref50, 2),
          x = _ref51[0],
          y = _ref51[1];

      return [x + movementX, y + movementY];
    });
  }
};
exports.regPolygon = regPolygon;
var polyline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref52) {
    var shape = _ref52.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('Polyline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref53, _ref54) {
    var ctx = _ref53.ctx;
    var shape = _ref54.shape,
        lineWidth = _ref54.style.lineWidth;
    ctx.beginPath();
    var points = shape.points,
        close = shape.close;
    if (lineWidth === 1) points = (0, util$1.eliminateBlur)(points);
    (0, canvas.drawPolylinePath)(ctx, points);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref55) {
    var shape = _ref55.shape,
        style = _ref55.style;
    var points = shape.points,
        close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, util$1.checkPointIsInPolygon)(position, points);
    } else {
      return (0, util$1.checkPointIsNearPolyline)(position, points, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref56) {
    var shape = _ref56.shape,
        style = _ref56.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref57, _ref58) {
    var movementX = _ref57.movementX,
        movementY = _ref57.movementY;
    var shape = _ref58.shape;
    var points = shape.points;
    var moveAfterPoints = points.map(function (_ref59) {
      var _ref60 = (0, _slicedToArray2["default"])(_ref59, 2),
          x = _ref60[0],
          y = _ref60[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: moveAfterPoints
    });
  }
};
exports.polyline = polyline;
var smoothline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref61) {
    var shape = _ref61.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('Smoothline points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref62, _ref63) {
    var ctx = _ref62.ctx;
    var shape = _ref63.shape,
        cache = _ref63.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var _bezierCurve = polylineToBezierCurve(points, close);

      var hoverPoints = bezierCurveToPolyline(_bezierCurve);
      Object.assign(cache, {
        points: (0, util$1.deepClone)(points, true),
        bezierCurve: _bezierCurve,
        hoverPoints: hoverPoints
      });
    }

    var bezierCurve = cache.bezierCurve;
    ctx.beginPath();
    (0, canvas.drawBezierCurvePath)(ctx, bezierCurve.slice(1), bezierCurve[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref64) {
    var cache = _ref64.cache,
        shape = _ref64.shape,
        style = _ref64.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, util$1.checkPointIsInPolygon)(position, hoverPoints);
    } else {
      return (0, util$1.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref65) {
    var shape = _ref65.shape,
        style = _ref65.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref66, _ref67) {
    var movementX = _ref66.movementX,
        movementY = _ref66.movementY;
    var shape = _ref67.shape,
        cache = _ref67.cache;
    var points = shape.points;
    var moveAfterPoints = points.map(function (_ref68) {
      var _ref69 = (0, _slicedToArray2["default"])(_ref68, 2),
          x = _ref69[0],
          y = _ref69[1];

      return [x + movementX, y + movementY];
    });
    cache.points = moveAfterPoints;

    var _cache$bezierCurve$ = (0, _slicedToArray2["default"])(cache.bezierCurve[0], 2),
        fx = _cache$bezierCurve$[0],
        fy = _cache$bezierCurve$[1];

    var curves = cache.bezierCurve.slice(1);
    cache.bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
      return curve.map(function (_ref70) {
        var _ref71 = (0, _slicedToArray2["default"])(_ref70, 2),
            x = _ref71[0],
            y = _ref71[1];

        return [x + movementX, y + movementY];
      });
    })));
    cache.hoverPoints = cache.hoverPoints.map(function (_ref72) {
      var _ref73 = (0, _slicedToArray2["default"])(_ref72, 2),
          x = _ref73[0],
          y = _ref73[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: moveAfterPoints
    });
  }
};
exports.smoothline = smoothline;
var bezierCurve = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator(_ref74) {
    var shape = _ref74.shape;
    var points = shape.points;

    if (!(points instanceof Array)) {
      console.error('BezierCurve points should be an array!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref75, _ref76) {
    var ctx = _ref75.ctx;
    var shape = _ref76.shape,
        cache = _ref76.cache;
    var points = shape.points,
        close = shape.close;

    if (!cache.points || cache.points.toString() !== points.toString()) {
      var hoverPoints = bezierCurveToPolyline(points, 20);
      Object.assign(cache, {
        points: (0, util$1.deepClone)(points, true),
        hoverPoints: hoverPoints
      });
    }

    ctx.beginPath();
    (0, canvas.drawBezierCurvePath)(ctx, points.slice(1), points[0]);

    if (close) {
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  },
  hoverCheck: function hoverCheck(position, _ref77) {
    var cache = _ref77.cache,
        shape = _ref77.shape,
        style = _ref77.style;
    var hoverPoints = cache.hoverPoints;
    var close = shape.close;
    var lineWidth = style.lineWidth;

    if (close) {
      return (0, util$1.checkPointIsInPolygon)(position, hoverPoints);
    } else {
      return (0, util$1.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
    }
  },
  setGraphCenter: function setGraphCenter(e, _ref78) {
    var shape = _ref78.shape,
        style = _ref78.style;
    var points = shape.points;
    style.graphCenter = points[0];
  },
  move: function move(_ref79, _ref80) {
    var movementX = _ref79.movementX,
        movementY = _ref79.movementY;
    var shape = _ref80.shape,
        cache = _ref80.cache;
    var points = shape.points;

    var _points$ = (0, _slicedToArray2["default"])(points[0], 2),
        fx = _points$[0],
        fy = _points$[1];

    var curves = points.slice(1);
    var bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
      return curve.map(function (_ref81) {
        var _ref82 = (0, _slicedToArray2["default"])(_ref81, 2),
            x = _ref82[0],
            y = _ref82[1];

        return [x + movementX, y + movementY];
      });
    })));
    cache.points = bezierCurve;
    cache.hoverPoints = cache.hoverPoints.map(function (_ref83) {
      var _ref84 = (0, _slicedToArray2["default"])(_ref83, 2),
          x = _ref84[0],
          y = _ref84[1];

      return [x + movementX, y + movementY];
    });
    this.attr('shape', {
      points: bezierCurve
    });
  }
};
exports.bezierCurve = bezierCurve;
var text = {
  shape: {
    content: '',
    position: [],
    maxWidth: undefined,
    rowGap: 0
  },
  validator: function validator(_ref85) {
    var shape = _ref85.shape;
    var content = shape.content,
        position = shape.position,
        rowGap = shape.rowGap;

    if (typeof content !== 'string') {
      console.error('Text content should be a string!');
      return false;
    }

    if (!(position instanceof Array)) {
      console.error('Text position should be an array!');
      return false;
    }

    if (typeof rowGap !== 'number') {
      console.error('Text rowGap should be a number!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref86, _ref87) {
    var ctx = _ref86.ctx;
    var shape = _ref87.shape;
    var content = shape.content,
        position = shape.position,
        maxWidth = shape.maxWidth,
        rowGap = shape.rowGap;
    var textBaseline = ctx.textBaseline,
        font = ctx.font;
    var fontSize = parseInt(font.replace(/\D/g, ''));

    var _position = position,
        _position2 = (0, _slicedToArray2["default"])(_position, 2),
        x = _position2[0],
        y = _position2[1];

    content = content.split('\n');
    var rowNum = content.length;
    var lineHeight = fontSize + rowGap;
    var allHeight = rowNum * lineHeight - rowGap;
    var offset = 0;

    if (textBaseline === 'middle') {
      offset = allHeight / 2;
      y += fontSize / 2;
    }

    if (textBaseline === 'bottom') {
      offset = allHeight;
      y += fontSize;
    }

    position = new Array(rowNum).fill(0).map(function (foo, i) {
      return [x, y + i * lineHeight - offset];
    });
    ctx.beginPath();
    content.forEach(function (text, i) {
      ctx.fillText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
      ctx.strokeText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
    });
    ctx.closePath();
  },
  hoverCheck: function hoverCheck(position, _ref88) {
    _ref88.shape;
        _ref88.style;
    return false;
  },
  setGraphCenter: function setGraphCenter(e, _ref89) {
    var shape = _ref89.shape,
        style = _ref89.style;
    var position = shape.position;
    style.graphCenter = (0, _toConsumableArray2["default"])(position);
  },
  move: function move(_ref90, _ref91) {
    var movementX = _ref90.movementX,
        movementY = _ref90.movementY;
    var shape = _ref91.shape;

    var _shape$position = (0, _slicedToArray2["default"])(shape.position, 2),
        x = _shape$position[0],
        y = _shape$position[1];

    this.attr('shape', {
      position: [x + movementX, y + movementY]
    });
  }
};
exports.text = text;
var graphs = new Map([['circle', circle], ['ellipse', ellipse], ['rect', rect], ['ring', ring], ['arc', arc], ['sector', sector], ['regPolygon', regPolygon], ['polyline', polyline], ['smoothline', smoothline], ['bezierCurve', bezierCurve], ['text', text]]);
var _default = graphs;
/**
 * @description Extend new graph
 * @param {String} name   Name of Graph
 * @param {Object} config Configuration of Graph
 * @return {Undefined} Void
 */

exports["default"] = _default;

function extendNewGraph(name, config) {
  if (!name || !config) {
    console.error('ExtendNewGraph Missing Parameters!');
    return;
  }

  if (!config.shape) {
    console.error('Required attribute of shape to extendNewGraph!');
    return;
  }

  if (!config.validator) {
    console.error('Required function of validator to extendNewGraph!');
    return;
  }

  if (!config.draw) {
    console.error('Required function of draw to extendNewGraph!');
    return;
  }

  graphs.set(name, config);
}
});

unwrapExports(graphs_1);
graphs_1.extendNewGraph;
graphs_1.text;
graphs_1.bezierCurve;
graphs_1.smoothline;
graphs_1.polyline;
graphs_1.regPolygon;
graphs_1.sector;
graphs_1.arc;
graphs_1.ring;
graphs_1.rect;
graphs_1.ellipse;
graphs_1.circle;

var regeneratorRuntime$1 = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _regeneratorRuntime() {
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(regeneratorRuntime$1);

// TODO(Babel 8): Remove this file.

var runtime = regeneratorRuntime$1();
var regenerator = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

var asyncToGenerator = createCommonjsModule(function (module) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(asyncToGenerator);

var _color = getCjsExportFromNamespace(es);

var style_class = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _classCallCheck2 = interopRequireDefault(classCallCheck);





/**
 * @description Class Style
 * @param {Object} style  Style configuration
 * @return {Style} Instance of Style
 */
var Style = function Style(style) {
  (0, _classCallCheck2["default"])(this, Style);
  this.colorProcessor(style);
  var defaultStyle = {
    /**
     * @description Rgba value of graph fill color
     * @type {Array}
     * @default fill = [0, 0, 0, 1]
     */
    fill: [0, 0, 0, 1],

    /**
     * @description Rgba value of graph stroke color
     * @type {Array}
     * @default stroke = [0, 0, 0, 1]
     */
    stroke: [0, 0, 0, 0],

    /**
     * @description Opacity of graph
     * @type {Number}
     * @default opacity = 1
     */
    opacity: 1,

    /**
     * @description LineCap of Ctx
     * @type {String}
     * @default lineCap = null
     * @example lineCap = 'butt'|'round'|'square'
     */
    lineCap: null,

    /**
     * @description Linejoin of Ctx
     * @type {String}
     * @default lineJoin = null
     * @example lineJoin = 'round'|'bevel'|'miter'
     */
    lineJoin: null,

    /**
     * @description LineDash of Ctx
     * @type {Array}
     * @default lineDash = null
     * @example lineDash = [10, 10]
     */
    lineDash: null,

    /**
     * @description LineDashOffset of Ctx
     * @type {Number}
     * @default lineDashOffset = null
     * @example lineDashOffset = 10
     */
    lineDashOffset: null,

    /**
     * @description ShadowBlur of Ctx
     * @type {Number}
     * @default shadowBlur = 0
     */
    shadowBlur: 0,

    /**
     * @description Rgba value of graph shadow color
     * @type {Array}
     * @default shadowColor = [0, 0, 0, 0]
     */
    shadowColor: [0, 0, 0, 0],

    /**
     * @description ShadowOffsetX of Ctx
     * @type {Number}
     * @default shadowOffsetX = 0
     */
    shadowOffsetX: 0,

    /**
     * @description ShadowOffsetY of Ctx
     * @type {Number}
     * @default shadowOffsetY = 0
     */
    shadowOffsetY: 0,

    /**
     * @description LineWidth of Ctx
     * @type {Number}
     * @default lineWidth = 0
     */
    lineWidth: 0,

    /**
     * @description Center point of the graph
     * @type {Array}
     * @default graphCenter = null
     * @example graphCenter = [10, 10]
     */
    graphCenter: null,

    /**
     * @description Graph scale
     * @type {Array}
     * @default scale = null
     * @example scale = [1.5, 1.5]
     */
    scale: null,

    /**
     * @description Graph rotation degree
     * @type {Number}
     * @default rotate = null
     * @example rotate = 10
     */
    rotate: null,

    /**
     * @description Graph translate distance
     * @type {Array}
     * @default translate = null
     * @example translate = [10, 10]
     */
    translate: null,

    /**
     * @description Cursor status when hover
     * @type {String}
     * @default hoverCursor = 'pointer'
     * @example hoverCursor = 'default'|'pointer'|'auto'|'crosshair'|'move'|'wait'|...
     */
    hoverCursor: 'pointer',

    /**
     * @description Font style of Ctx
     * @type {String}
     * @default fontStyle = 'normal'
     * @example fontStyle = 'normal'|'italic'|'oblique'
     */
    fontStyle: 'normal',

    /**
     * @description Font varient of Ctx
     * @type {String}
     * @default fontVarient = 'normal'
     * @example fontVarient = 'normal'|'small-caps'
     */
    fontVarient: 'normal',

    /**
     * @description Font weight of Ctx
     * @type {String|Number}
     * @default fontWeight = 'normal'
     * @example fontWeight = 'normal'|'bold'|'bolder'|'lighter'|Number
     */
    fontWeight: 'normal',

    /**
     * @description Font size of Ctx
     * @type {Number}
     * @default fontSize = 10
     */
    fontSize: 10,

    /**
     * @description Font family of Ctx
     * @type {String}
     * @default fontFamily = 'Arial'
     */
    fontFamily: 'Arial',

    /**
     * @description TextAlign of Ctx
     * @type {String}
     * @default textAlign = 'center'
     * @example textAlign = 'start'|'end'|'left'|'right'|'center'
     */
    textAlign: 'center',

    /**
     * @description TextBaseline of Ctx
     * @type {String}
     * @default textBaseline = 'middle'
     * @example textBaseline = 'top'|'bottom'|'middle'|'alphabetic'|'hanging'
     */
    textBaseline: 'middle',

    /**
     * @description The color used to create the gradient
     * @type {Array}
     * @default gradientColor = null
     * @example gradientColor = ['#000', '#111', '#222']
     */
    gradientColor: null,

    /**
     * @description Gradient type
     * @type {String}
     * @default gradientType = 'linear'
     * @example gradientType = 'linear' | 'radial'
     */
    gradientType: 'linear',

    /**
     * @description Gradient params
     * @type {Array}
     * @default gradientParams = null
     * @example gradientParams = [x0, y0, x1, y1] (Linear Gradient)
     * @example gradientParams = [x0, y0, r0, x1, y1, r1] (Radial Gradient)
     */
    gradientParams: null,

    /**
     * @description When to use gradients
     * @type {String}
     * @default gradientWith = 'stroke'
     * @example gradientWith = 'stroke' | 'fill'
     */
    gradientWith: 'stroke',

    /**
     * @description Gradient color stops
     * @type {String}
     * @default gradientStops = 'auto'
     * @example gradientStops = 'auto' | [0, .2, .3, 1]
     */
    gradientStops: 'auto',

    /**
     * @description Extended color that supports animation transition
     * @type {Array|Object}
     * @default colors = null
     * @example colors = ['#000', '#111', '#222', 'red' ]
     * @example colors = { a: '#000', b: '#111' }
     */
    colors: null
  };
  Object.assign(this, defaultStyle, style);
};
/**
 * @description Set colors to rgba value
 * @param {Object} style style config
 * @param {Boolean} reverse Whether to perform reverse operation
 * @return {Undefined} Void
 */


exports["default"] = Style;

Style.prototype.colorProcessor = function (style) {
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var processor = reverse ? _color.getColorFromRgbValue : _color.getRgbaValue;
  var colorProcessorKeys = ['fill', 'stroke', 'shadowColor'];
  var allKeys = Object.keys(style);
  var colorKeys = allKeys.filter(function (key) {
    return colorProcessorKeys.find(function (k) {
      return k === key;
    });
  });
  colorKeys.forEach(function (key) {
    return style[key] = processor(style[key]);
  });
  var gradientColor = style.gradientColor,
      colors = style.colors;
  if (gradientColor) style.gradientColor = gradientColor.map(function (c) {
    return processor(c);
  });

  if (colors) {
    var colorsKeys = Object.keys(colors);
    colorsKeys.forEach(function (key) {
      return colors[key] = processor(colors[key]);
    });
  }
};
/**
 * @description Init graph style
 * @param {Object} ctx Context of canvas
 * @return {Undefined} Void
 */


Style.prototype.initStyle = function (ctx) {
  initTransform(ctx, this);
  initGraphStyle(ctx, this);
  initGradient(ctx, this);
};
/**
 * @description Init canvas transform
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */


function initTransform(ctx, style) {
  ctx.save();
  var graphCenter = style.graphCenter,
      rotate = style.rotate,
      scale = style.scale,
      translate = style.translate;
  if (!(graphCenter instanceof Array)) return;
  ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(graphCenter));
  if (rotate) ctx.rotate(rotate * Math.PI / 180);
  if (scale instanceof Array) ctx.scale.apply(ctx, (0, _toConsumableArray2["default"])(scale));
  if (translate) ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(translate));
  ctx.translate(-graphCenter[0], -graphCenter[1]);
}

var autoSetStyleKeys = ['lineCap', 'lineJoin', 'lineDashOffset', 'shadowOffsetX', 'shadowOffsetY', 'lineWidth', 'textAlign', 'textBaseline'];
/**
 * @description Set the style of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */

function initGraphStyle(ctx, style) {
  var fill = style.fill,
      stroke = style.stroke,
      shadowColor = style.shadowColor,
      opacity = style.opacity;
  autoSetStyleKeys.forEach(function (key) {
    if (key || typeof key === 'number') ctx[key] = style[key];
  });
  fill = (0, _toConsumableArray2["default"])(fill);
  stroke = (0, _toConsumableArray2["default"])(stroke);
  shadowColor = (0, _toConsumableArray2["default"])(shadowColor);
  fill[3] *= opacity;
  stroke[3] *= opacity;
  shadowColor[3] *= opacity;
  ctx.fillStyle = (0, _color.getColorFromRgbValue)(fill);
  ctx.strokeStyle = (0, _color.getColorFromRgbValue)(stroke);
  ctx.shadowColor = (0, _color.getColorFromRgbValue)(shadowColor);
  var lineDash = style.lineDash,
      shadowBlur = style.shadowBlur;

  if (lineDash) {
    lineDash = lineDash.map(function (v) {
      return v >= 0 ? v : 0;
    });
    ctx.setLineDash(lineDash);
  }

  if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001;
  var fontStyle = style.fontStyle,
      fontVarient = style.fontVarient,
      fontWeight = style.fontWeight,
      fontSize = style.fontSize,
      fontFamily = style.fontFamily;
  ctx.font = fontStyle + ' ' + fontVarient + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily;
}
/**
 * @description Set the gradient color of canvas ctx
 * @param {Object} ctx  Context of canvas
 * @param {Style} style Instance of Style
 * @return {Undefined} Void
 */


function initGradient(ctx, style) {
  if (!gradientValidator(style)) return;
  var gradientColor = style.gradientColor,
      gradientParams = style.gradientParams,
      gradientType = style.gradientType,
      gradientWith = style.gradientWith,
      gradientStops = style.gradientStops,
      opacity = style.opacity;
  gradientColor = gradientColor.map(function (color) {
    var colorOpacity = color[3] * opacity;
    var clonedColor = (0, _toConsumableArray2["default"])(color);
    clonedColor[3] = colorOpacity;
    return clonedColor;
  });
  gradientColor = gradientColor.map(function (c) {
    return (0, _color.getColorFromRgbValue)(c);
  });
  if (gradientStops === 'auto') gradientStops = getAutoColorStops(gradientColor);
  var gradient = ctx["create".concat(gradientType.slice(0, 1).toUpperCase() + gradientType.slice(1), "Gradient")].apply(ctx, (0, _toConsumableArray2["default"])(gradientParams));
  gradientStops.forEach(function (stop, i) {
    return gradient.addColorStop(stop, gradientColor[i]);
  });
  ctx["".concat(gradientWith, "Style")] = gradient;
}
/**
 * @description Check if the gradient configuration is legal
 * @param {Style} style Instance of Style
 * @return {Boolean} Check Result
 */


function gradientValidator(style) {
  var gradientColor = style.gradientColor,
      gradientParams = style.gradientParams,
      gradientType = style.gradientType,
      gradientWith = style.gradientWith,
      gradientStops = style.gradientStops;
  if (!gradientColor || !gradientParams) return false;

  if (gradientColor.length === 1) {
    console.warn('The gradient needs to provide at least two colors');
    return false;
  }

  if (gradientType !== 'linear' && gradientType !== 'radial') {
    console.warn('GradientType only supports linear or radial, current value is ' + gradientType);
    return false;
  }

  var gradientParamsLength = gradientParams.length;

  if (gradientType === 'linear' && gradientParamsLength !== 4 || gradientType === 'radial' && gradientParamsLength !== 6) {
    console.warn('The expected length of gradientParams is ' + (gradientType === 'linear' ? '4' : '6'));
    return false;
  }

  if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
    console.warn('GradientWith only supports fill or stroke, current value is ' + gradientWith);
    return false;
  }

  if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
    console.warn("gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is " + gradientStops);
    return false;
  }

  return true;
}
/**
 * @description Get a uniform gradient color stop
 * @param {Array} color Gradient color
 * @return {Array} Gradient color stop
 */


function getAutoColorStops(color) {
  var stopGap = 1 / (color.length - 1);
  return color.map(function (foo, i) {
    return stopGap * i;
  });
}
/**
 * @description Restore canvas ctx transform
 * @param {Object} ctx  Context of canvas
 * @return {Undefined} Void
 */


Style.prototype.restoreTransform = function (ctx) {
  ctx.restore();
};
/**
 * @description Update style data
 * @param {Object} change Changed data
 * @return {Undefined} Void
 */


Style.prototype.update = function (change) {
  this.colorProcessor(change);
  Object.assign(this, change);
};
/**
 * @description Get the current style configuration
 * @return {Object} Style configuration
 */


Style.prototype.getStyle = function () {
  var clonedStyle = (0, util$1.deepClone)(this, true);
  this.colorProcessor(clonedStyle, true);
  return clonedStyle;
};
});

unwrapExports(style_class);

var curves = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.easeInOutBounce = exports.easeOutBounce = exports.easeInBounce = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutBack = exports.easeOutBack = exports.easeInBack = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.linear = void 0;
var linear = [[[0, 1], '', [0.33, 0.67]], [[1, 0], [0.67, 0.33]]];
/**
 * @description Sine
 */

exports.linear = linear;
var easeInSine = [[[0, 1]], [[0.538, 0.564], [0.169, 0.912], [0.880, 0.196]], [[1, 0]]];
exports.easeInSine = easeInSine;
var easeOutSine = [[[0, 1]], [[0.444, 0.448], [0.169, 0.736], [0.718, 0.16]], [[1, 0]]];
exports.easeOutSine = easeOutSine;
var easeInOutSine = [[[0, 1]], [[0.5, 0.5], [0.2, 1], [0.8, 0]], [[1, 0]]];
/**
 * @description Quad
 */

exports.easeInOutSine = easeInOutSine;
var easeInQuad = [[[0, 1]], [[0.550, 0.584], [0.231, 0.904], [0.868, 0.264]], [[1, 0]]];
exports.easeInQuad = easeInQuad;
var easeOutQuad = [[[0, 1]], [[0.413, 0.428], [0.065, 0.816], [0.760, 0.04]], [[1, 0]]];
exports.easeOutQuad = easeOutQuad;
var easeInOutQuad = [[[0, 1]], [[0.5, 0.5], [0.3, 0.9], [0.7, 0.1]], [[1, 0]]];
/**
 * @description Cubic
 */

exports.easeInOutQuad = easeInOutQuad;
var easeInCubic = [[[0, 1]], [[0.679, 0.688], [0.366, 0.992], [0.992, 0.384]], [[1, 0]]];
exports.easeInCubic = easeInCubic;
var easeOutCubic = [[[0, 1]], [[0.321, 0.312], [0.008, 0.616], [0.634, 0.008]], [[1, 0]]];
exports.easeOutCubic = easeOutCubic;
var easeInOutCubic = [[[0, 1]], [[0.5, 0.5], [0.3, 1], [0.7, 0]], [[1, 0]]];
/**
 * @description Quart
 */

exports.easeInOutCubic = easeInOutCubic;
var easeInQuart = [[[0, 1]], [[0.812, 0.74], [0.611, 0.988], [1.013, 0.492]], [[1, 0]]];
exports.easeInQuart = easeInQuart;
var easeOutQuart = [[[0, 1]], [[0.152, 0.244], [0.001, 0.448], [0.285, -0.02]], [[1, 0]]];
exports.easeOutQuart = easeOutQuart;
var easeInOutQuart = [[[0, 1]], [[0.5, 0.5], [0.4, 1], [0.6, 0]], [[1, 0]]];
/**
 * @description Quint
 */

exports.easeInOutQuart = easeInOutQuart;
var easeInQuint = [[[0, 1]], [[0.857, 0.856], [0.714, 1], [1, 0.712]], [[1, 0]]];
exports.easeInQuint = easeInQuint;
var easeOutQuint = [[[0, 1]], [[0.108, 0.2], [0.001, 0.4], [0.214, -0.012]], [[1, 0]]];
exports.easeOutQuint = easeOutQuint;
var easeInOutQuint = [[[0, 1]], [[0.5, 0.5], [0.5, 1], [0.5, 0]], [[1, 0]]];
/**
 * @description Back
 */

exports.easeInOutQuint = easeInOutQuint;
var easeInBack = [[[0, 1]], [[0.667, 0.896], [0.380, 1.184], [0.955, 0.616]], [[1, 0]]];
exports.easeInBack = easeInBack;
var easeOutBack = [[[0, 1]], [[0.335, 0.028], [0.061, 0.22], [0.631, -0.18]], [[1, 0]]];
exports.easeOutBack = easeOutBack;
var easeInOutBack = [[[0, 1]], [[0.5, 0.5], [0.4, 1.4], [0.6, -0.4]], [[1, 0]]];
/**
 * @description Elastic
 */

exports.easeInOutBack = easeInOutBack;
var easeInElastic = [[[0, 1]], [[0.474, 0.964], [0.382, 0.988], [0.557, 0.952]], [[0.619, 1.076], [0.565, 1.088], [0.669, 1.08]], [[0.770, 0.916], [0.712, 0.924], [0.847, 0.904]], [[0.911, 1.304], [0.872, 1.316], [0.961, 1.34]], [[1, 0]]];
exports.easeInElastic = easeInElastic;
var easeOutElastic = [[[0, 1]], [[0.073, -0.32], [0.034, -0.328], [0.104, -0.344]], [[0.191, 0.092], [0.110, 0.06], [0.256, 0.08]], [[0.310, -0.076], [0.260, -0.068], [0.357, -0.076]], [[0.432, 0.032], [0.362, 0.028], [0.683, -0.004]], [[1, 0]]];
exports.easeOutElastic = easeOutElastic;
var easeInOutElastic = [[[0, 1]], [[0.210, 0.94], [0.167, 0.884], [0.252, 0.98]], [[0.299, 1.104], [0.256, 1.092], [0.347, 1.108]], [[0.5, 0.496], [0.451, 0.672], [0.548, 0.324]], [[0.696, -0.108], [0.652, -0.112], [0.741, -0.124]], [[0.805, 0.064], [0.756, 0.012], [0.866, 0.096]], [[1, 0]]];
/**
 * @description Bounce
 */

exports.easeInOutElastic = easeInOutElastic;
var easeInBounce = [[[0, 1]], [[0.148, 1], [0.075, 0.868], [0.193, 0.848]], [[0.326, 1], [0.276, 0.836], [0.405, 0.712]], [[0.600, 1], [0.511, 0.708], [0.671, 0.348]], [[1, 0]]];
exports.easeInBounce = easeInBounce;
var easeOutBounce = [[[0, 1]], [[0.357, 0.004], [0.270, 0.592], [0.376, 0.252]], [[0.604, -0.004], [0.548, 0.312], [0.669, 0.184]], [[0.820, 0], [0.749, 0.184], [0.905, 0.132]], [[1, 0]]];
exports.easeOutBounce = easeOutBounce;
var easeInOutBounce = [[[0, 1]], [[0.102, 1], [0.050, 0.864], [0.117, 0.86]], [[0.216, 0.996], [0.208, 0.844], [0.227, 0.808]], [[0.347, 0.996], [0.343, 0.8], [0.480, 0.292]], [[0.635, 0.004], [0.511, 0.676], [0.656, 0.208]], [[0.787, 0], [0.760, 0.2], [0.795, 0.144]], [[0.905, -0.004], [0.899, 0.164], [0.944, 0.144]], [[1, 0]]];
exports.easeInOutBounce = easeInOutBounce;

var _default = new Map([['linear', linear], ['easeInSine', easeInSine], ['easeOutSine', easeOutSine], ['easeInOutSine', easeInOutSine], ['easeInQuad', easeInQuad], ['easeOutQuad', easeOutQuad], ['easeInOutQuad', easeInOutQuad], ['easeInCubic', easeInCubic], ['easeOutCubic', easeOutCubic], ['easeInOutCubic', easeInOutCubic], ['easeInQuart', easeInQuart], ['easeOutQuart', easeOutQuart], ['easeInOutQuart', easeInOutQuart], ['easeInQuint', easeInQuint], ['easeOutQuint', easeOutQuint], ['easeInOutQuint', easeInOutQuint], ['easeInBack', easeInBack], ['easeOutBack', easeOutBack], ['easeInOutBack', easeInOutBack], ['easeInElastic', easeInElastic], ['easeOutElastic', easeOutElastic], ['easeInOutElastic', easeInOutElastic], ['easeInBounce', easeInBounce], ['easeOutBounce', easeOutBounce], ['easeInOutBounce', easeInOutBounce]]);

exports["default"] = _default;
});

unwrapExports(curves);
curves.easeInOutBounce;
curves.easeOutBounce;
curves.easeInBounce;
curves.easeInOutElastic;
curves.easeOutElastic;
curves.easeInElastic;
curves.easeInOutBack;
curves.easeOutBack;
curves.easeInBack;
curves.easeInOutQuint;
curves.easeOutQuint;
curves.easeInQuint;
curves.easeInOutQuart;
curves.easeOutQuart;
curves.easeInQuart;
curves.easeInOutCubic;
curves.easeOutCubic;
curves.easeInCubic;
curves.easeInOutQuad;
curves.easeOutQuad;
curves.easeInQuad;
curves.easeInOutSine;
curves.easeOutSine;
curves.easeInSine;
curves.linear;

var lib$2 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transition = transition;
exports.injectNewCurve = injectNewCurve;
exports["default"] = void 0;

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _typeof2 = interopRequireDefault(_typeof_1);

var _curves = interopRequireDefault(curves);

var defaultTransitionBC = 'linear';
/**
 * @description Get the N-frame animation state by the start and end state
 *              of the animation and the easing curve
 * @param {String|Array} tBC               Easing curve name or data
 * @param {Number|Array|Object} startState Animation start state
 * @param {Number|Array|Object} endState   Animation end state
 * @param {Number} frameNum                Number of Animation frames
 * @param {Boolean} deep                   Whether to use recursive mode
 * @return {Array|Boolean} State of each frame of the animation (Invalid input will return false)
 */

function transition(tBC) {
  var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
  var deep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (!checkParams.apply(void 0, arguments)) return false;

  try {
    // Get the transition bezier curve
    var bezierCurve = getBezierCurve(tBC); // Get the progress of each frame state

    var frameStateProgress = getFrameStateProgress(bezierCurve, frameNum); // If the recursion mode is not enabled or the state type is Number, the shallow state calculation is performed directly.

    if (!deep || typeof endState === 'number') return getTransitionState(startState, endState, frameStateProgress);
    return recursionTransitionState(startState, endState, frameStateProgress);
  } catch (_unused) {
    console.warn('Transition parameter may be abnormal!');
    return [endState];
  }
}
/**
 * @description Check if the parameters are legal
 * @param {String} tBC      Name of transition bezier curve
 * @param {Any} startState  Transition start state
 * @param {Any} endState    Transition end state
 * @param {Number} frameNum Number of transition frames
 * @return {Boolean} Is the parameter legal
 */


function checkParams(tBC) {
  var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;

  if (!tBC || startState === false || endState === false || !frameNum) {
    console.error('transition: Missing Parameters!');
    return false;
  }

  if ((0, _typeof2["default"])(startState) !== (0, _typeof2["default"])(endState)) {
    console.error('transition: Inconsistent Status Types!');
    return false;
  }

  var stateType = (0, _typeof2["default"])(endState);

  if (stateType === 'string' || stateType === 'boolean' || !tBC.length) {
    console.error('transition: Unsupported Data Type of State!');
    return false;
  }

  if (!_curves["default"].has(tBC) && !(tBC instanceof Array)) {
    console.warn('transition: Transition curve not found, default curve will be used!');
  }

  return true;
}
/**
 * @description Get the transition bezier curve
 * @param {String} tBC Name of transition bezier curve
 * @return {Array} Bezier curve data
 */


function getBezierCurve(tBC) {
  var bezierCurve = '';

  if (_curves["default"].has(tBC)) {
    bezierCurve = _curves["default"].get(tBC);
  } else if (tBC instanceof Array) {
    bezierCurve = tBC;
  } else {
    bezierCurve = _curves["default"].get(defaultTransitionBC);
  }

  return bezierCurve;
}
/**
 * @description Get the progress of each frame state
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} frameNum   Number of transition frames
 * @return {Array} Progress of each frame state
 */


function getFrameStateProgress(bezierCurve, frameNum) {
  var tMinus = 1 / (frameNum - 1);
  var tState = new Array(frameNum).fill(0).map(function (t, i) {
    return i * tMinus;
  });
  var frameState = tState.map(function (t) {
    return getFrameStateFromT(bezierCurve, t);
  });
  return frameState;
}
/**
 * @description Get the progress of the corresponding frame according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */


function getFrameStateFromT(bezierCurve, t) {
  var tBezierCurvePoint = getBezierCurvePointFromT(bezierCurve, t);
  var bezierCurvePointT = getBezierCurvePointTFromReT(tBezierCurvePoint, t);
  return getBezierCurveTState(tBezierCurvePoint, bezierCurvePointT);
}
/**
 * @description Get the corresponding sub-curve according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Array} Sub-curve of t
 */


function getBezierCurvePointFromT(bezierCurve, t) {
  var lastIndex = bezierCurve.length - 1;
  var begin = '',
      end = '';
  bezierCurve.findIndex(function (item, i) {
    if (i === lastIndex) return;
    begin = item;
    end = bezierCurve[i + 1];
    var currentMainPointX = begin[0][0];
    var nextMainPointX = end[0][0];
    return t >= currentMainPointX && t < nextMainPointX;
  });
  var p0 = begin[0];
  var p1 = begin[2] || begin[0];
  var p2 = end[1] || end[0];
  var p3 = end[0];
  return [p0, p1, p2, p3];
}
/**
 * @description Get local t based on t and sub-curve
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} local t of sub-curve
 */


function getBezierCurvePointTFromReT(bezierCurve, t) {
  var reBeginX = bezierCurve[0][0];
  var reEndX = bezierCurve[3][0];
  var xMinus = reEndX - reBeginX;
  var tMinus = t - reBeginX;
  return tMinus / xMinus;
}
/**
 * @description Get the curve progress of t
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */


function getBezierCurveTState(_ref, t) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
      _ref2$ = (0, _slicedToArray2["default"])(_ref2[0], 2),
      p0 = _ref2$[1],
      _ref2$2 = (0, _slicedToArray2["default"])(_ref2[1], 2),
      p1 = _ref2$2[1],
      _ref2$3 = (0, _slicedToArray2["default"])(_ref2[2], 2),
      p2 = _ref2$3[1],
      _ref2$4 = (0, _slicedToArray2["default"])(_ref2[3], 2),
      p3 = _ref2$4[1];

  var pow = Math.pow;
  var tMinus = 1 - t;
  var result1 = p0 * pow(tMinus, 3);
  var result2 = 3 * p1 * t * pow(tMinus, 2);
  var result3 = 3 * p2 * pow(t, 2) * tMinus;
  var result4 = p3 * pow(t, 3);
  return 1 - (result1 + result2 + result3 + result4);
}
/**
 * @description Get transition state according to frame progress
 * @param {Any} startState   Transition start state
 * @param {Any} endState     Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */


function getTransitionState(begin, end, frameState) {
  var stateType = 'object';
  if (typeof begin === 'number') stateType = 'number';
  if (begin instanceof Array) stateType = 'array';
  if (stateType === 'number') return getNumberTransitionState(begin, end, frameState);
  if (stateType === 'array') return getArrayTransitionState(begin, end, frameState);
  if (stateType === 'object') return getObjectTransitionState(begin, end, frameState);
  return frameState.map(function (t) {
    return end;
  });
}
/**
 * @description Get the transition data of the number type
 * @param {Number} startState Transition start state
 * @param {Number} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */


function getNumberTransitionState(begin, end, frameState) {
  var minus = end - begin;
  return frameState.map(function (s) {
    return begin + minus * s;
  });
}
/**
 * @description Get the transition data of the array type
 * @param {Array} startState Transition start state
 * @param {Array} endState   Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */


function getArrayTransitionState(begin, end, frameState) {
  var minus = end.map(function (v, i) {
    if (typeof v !== 'number') return false;
    return v - begin[i];
  });
  return frameState.map(function (s) {
    return minus.map(function (v, i) {
      if (v === false) return end[i];
      return begin[i] + v * s;
    });
  });
}
/**
 * @description Get the transition data of the object type
 * @param {Object} startState Transition start state
 * @param {Object} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */


function getObjectTransitionState(begin, end, frameState) {
  var keys = Object.keys(end);
  var beginValue = keys.map(function (k) {
    return begin[k];
  });
  var endValue = keys.map(function (k) {
    return end[k];
  });
  var arrayState = getArrayTransitionState(beginValue, endValue, frameState);
  return arrayState.map(function (item) {
    var frameData = {};
    item.forEach(function (v, i) {
      return frameData[keys[i]] = v;
    });
    return frameData;
  });
}
/**
 * @description Get the transition state data by recursion
 * @param {Array|Object} startState Transition start state
 * @param {Array|Object} endState   Transition end state
 * @param {Array} frameState        Frame state progress
 * @return {Array} Transition frame state
 */


function recursionTransitionState(begin, end, frameState) {
  var state = getTransitionState(begin, end, frameState);

  var _loop = function _loop(key) {
    var bTemp = begin[key];
    var eTemp = end[key];
    if ((0, _typeof2["default"])(eTemp) !== 'object') return "continue";
    var data = recursionTransitionState(bTemp, eTemp, frameState);
    state.forEach(function (fs, i) {
      return fs[key] = data[i];
    });
  };

  for (var key in end) {
    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  return state;
}
/**
 * @description Inject new curve into curves as config
 * @param {Any} key     The key of curve
 * @param {Array} curve Bezier curve data
 * @return {Undefined} No return
 */


function injectNewCurve(key, curve) {
  if (!key || !curve) {
    console.error('InjectNewCurve Missing Parameters!');
    return;
  }

  _curves["default"].set(key, curve);
}

var _default = transition;
exports["default"] = _default;
});

unwrapExports(lib$2);
lib$2.transition;
lib$2.injectNewCurve;

var graph_class = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = interopRequireDefault(regenerator);

var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

var _typeof2 = interopRequireDefault(_typeof_1);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _style = interopRequireDefault(style_class);

var _transition = interopRequireDefault(lib$2);



/**
 * @description Class Graph
 * @param {Object} graph  Graph default configuration
 * @param {Object} config Graph config
 * @return {Graph} Instance of Graph
 */
var Graph = function Graph(graph, config) {
  (0, _classCallCheck2["default"])(this, Graph);
  config = (0, util$1.deepClone)(config, true);
  var defaultConfig = {
    /**
     * @description Weather to render graph
     * @type {Boolean}
     * @default visible = true
     */
    visible: true,

    /**
     * @description Whether to enable drag
     * @type {Boolean}
     * @default drag = false
     */
    drag: false,

    /**
     * @description Whether to enable hover
     * @type {Boolean}
     * @default hover = false
     */
    hover: false,

    /**
     * @description Graph rendering index
     *  Give priority to index high graph in rendering
     * @type {Number}
     * @example index = 1
     */
    index: 1,

    /**
     * @description Animation delay time(ms)
     * @type {Number}
     * @default animationDelay = 0
     */
    animationDelay: 0,

    /**
     * @description Number of animation frames
     * @type {Number}
     * @default animationFrame = 30
     */
    animationFrame: 30,

    /**
     * @description Animation dynamic curve (Supported by transition)
     * @type {String}
     * @default animationCurve = 'linear'
     * @link https://github.com/jiaming743/Transition
     */
    animationCurve: 'linear',

    /**
     * @description Weather to pause graph animation
     * @type {Boolean}
     * @default animationPause = false
     */
    animationPause: false,

    /**
     * @description Rectangular hover detection zone
     *  Use this method for hover detection first
     * @type {Null|Array}
     * @default hoverRect = null
     * @example hoverRect = [0, 0, 100, 100] // [Rect start x, y, Rect width, height]
     */
    hoverRect: null,

    /**
     * @description Mouse enter event handler
     * @type {Function|Null}
     * @default mouseEnter = null
     */
    mouseEnter: null,

    /**
     * @description Mouse outer event handler
     * @type {Function|Null}
     * @default mouseOuter = null
     */
    mouseOuter: null,

    /**
     * @description Mouse click event handler
     * @type {Function|Null}
     * @default click = null
     */
    click: null
  };
  var configAbleNot = {
    status: 'static',
    animationRoot: [],
    animationKeys: [],
    animationFrameState: [],
    cache: {}
  };
  if (!config.shape) config.shape = {};
  if (!config.style) config.style = {};
  var shape = Object.assign({}, graph.shape, config.shape);
  Object.assign(defaultConfig, config, configAbleNot);
  Object.assign(this, graph, defaultConfig);
  this.shape = shape;
  this.style = new _style["default"](config.style);
  this.addedProcessor();
};
/**
 * @description Processor of added
 * @return {Undefined} Void
 */


exports["default"] = Graph;

Graph.prototype.addedProcessor = function () {
  if (typeof this.setGraphCenter === 'function') this.setGraphCenter(null, this); // The life cycle 'added"

  if (typeof this.added === 'function') this.added(this);
};
/**
 * @description Processor of draw
 * @param {CRender} render Instance of CRender
 * @param {Graph} graph    Instance of Graph
 * @return {Undefined} Void
 */


Graph.prototype.drawProcessor = function (render, graph) {
  var ctx = render.ctx;
  graph.style.initStyle(ctx);
  if (typeof this.beforeDraw === 'function') this.beforeDraw(this, render);
  graph.draw(render, graph);
  if (typeof this.drawed === 'function') this.drawed(this, render);
  graph.style.restoreTransform(ctx);
};
/**
 * @description Processor of hover check
 * @param {Array} position Mouse Position
 * @param {Graph} graph    Instance of Graph
 * @return {Boolean} Result of hover check
 */


Graph.prototype.hoverCheckProcessor = function (position, _ref) {
  var hoverRect = _ref.hoverRect,
      style = _ref.style,
      hoverCheck = _ref.hoverCheck;
  var graphCenter = style.graphCenter,
      rotate = style.rotate,
      scale = style.scale,
      translate = style.translate;

  if (graphCenter) {
    if (rotate) position = (0, util$1.getRotatePointPos)(-rotate, position, graphCenter);
    if (scale) position = (0, util$1.getScalePointPos)(scale.map(function (s) {
      return 1 / s;
    }), position, graphCenter);
    if (translate) position = (0, util$1.getTranslatePointPos)(translate.map(function (v) {
      return v * -1;
    }), position);
  }

  if (hoverRect) return util$1.checkPointIsInRect.apply(void 0, [position].concat((0, _toConsumableArray2["default"])(hoverRect)));
  return hoverCheck(position, this);
};
/**
 * @description Processor of move
 * @param {Event} e Mouse movement event
 * @return {Undefined} Void
 */


Graph.prototype.moveProcessor = function (e) {
  this.move(e, this);
  if (typeof this.beforeMove === 'function') this.beforeMove(e, this);
  if (typeof this.setGraphCenter === 'function') this.setGraphCenter(e, this);
  if (typeof this.moved === 'function') this.moved(e, this);
};
/**
 * @description Update graph state
 * @param {String} attrName Updated attribute name
 * @param {Any} change      Updated value
 * @return {Undefined} Void
 */


Graph.prototype.attr = function (attrName) {
  var change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (!attrName || change === undefined) return false;
  var isObject = (0, _typeof2["default"])(this[attrName]) === 'object';
  if (isObject) change = (0, util$1.deepClone)(change, true);
  var render = this.render;

  if (attrName === 'style') {
    this.style.update(change);
  } else if (isObject) {
    Object.assign(this[attrName], change);
  } else {
    this[attrName] = change;
  }

  if (attrName === 'index') render.sortGraphsByIndex();
  render.drawAllGraph();
};
/**
 * @description Update graphics state (with animation)
 *  Only shape and style attributes are supported
 * @param {String} attrName Updated attribute name
 * @param {Any} change      Updated value
 * @param {Boolean} wait    Whether to store the animation waiting
 *                          for the next animation request
 * @return {Promise} Animation Promise
 */


Graph.prototype.animation =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(attrName, change) {
    var wait,
        changeRoot,
        changeKeys,
        beforeState,
        animationFrame,
        animationCurve,
        animationDelay,
        animationFrameState,
        render,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            wait = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

            if (!(attrName !== 'shape' && attrName !== 'style')) {
              _context2.next = 4;
              break;
            }

            console.error('Only supported shape and style animation!');
            return _context2.abrupt("return");

          case 4:
            change = (0, util$1.deepClone)(change, true);
            if (attrName === 'style') this.style.colorProcessor(change);
            changeRoot = this[attrName];
            changeKeys = Object.keys(change);
            beforeState = {};
            changeKeys.forEach(function (key) {
              return beforeState[key] = changeRoot[key];
            });
            animationFrame = this.animationFrame, animationCurve = this.animationCurve, animationDelay = this.animationDelay;
            animationFrameState = (0, _transition["default"])(animationCurve, beforeState, change, animationFrame, true);
            this.animationRoot.push(changeRoot);
            this.animationKeys.push(changeKeys);
            this.animationFrameState.push(animationFrameState);

            if (!wait) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return");

          case 17:
            if (!(animationDelay > 0)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 20;
            return delay(animationDelay);

          case 20:
            render = this.render;
            return _context2.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(resolve) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return render.launchAnimation();

                      case 2:
                        resolve();

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description Extract the next frame of data from the animation queue
 *              and update the graph state
 * @return {Undefined} Void
 */


Graph.prototype.turnNextAnimationFrame = function (timeStamp) {
  var animationDelay = this.animationDelay,
      animationRoot = this.animationRoot,
      animationKeys = this.animationKeys,
      animationFrameState = this.animationFrameState,
      animationPause = this.animationPause;
  if (animationPause) return;
  if (Date.now() - timeStamp < animationDelay) return;
  animationRoot.forEach(function (root, i) {
    animationKeys[i].forEach(function (key) {
      root[key] = animationFrameState[i][0][key];
    });
  });
  animationFrameState.forEach(function (stateItem, i) {
    stateItem.shift();
    var noFrame = stateItem.length === 0;
    if (noFrame) animationRoot[i] = null;
    if (noFrame) animationKeys[i] = null;
  });
  this.animationFrameState = animationFrameState.filter(function (state) {
    return state.length;
  });
  this.animationRoot = animationRoot.filter(function (root) {
    return root;
  });
  this.animationKeys = animationKeys.filter(function (keys) {
    return keys;
  });
};
/**
 * @description Skip to the last frame of animation
 * @return {Undefined} Void
 */


Graph.prototype.animationEnd = function () {
  var animationFrameState = this.animationFrameState,
      animationKeys = this.animationKeys,
      animationRoot = this.animationRoot,
      render = this.render;
  animationRoot.forEach(function (root, i) {
    var currentKeys = animationKeys[i];
    var lastState = animationFrameState[i].pop();
    currentKeys.forEach(function (key) {
      return root[key] = lastState[key];
    });
  });
  this.animationFrameState = [];
  this.animationKeys = [];
  this.animationRoot = [];
  return render.drawAllGraph();
};
/**
 * @description Pause animation behavior
 * @return {Undefined} Void
 */


Graph.prototype.pauseAnimation = function () {
  this.attr('animationPause', true);
};
/**
 * @description Try animation behavior
 * @return {Undefined} Void
 */


Graph.prototype.playAnimation = function () {
  var render = this.render;
  this.attr('animationPause', false);
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref4 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(resolve) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return render.launchAnimation();

            case 2:
              resolve();

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
};
/**
 * @description Processor of delete
 * @param {CRender} render Instance of CRender
 * @return {Undefined} Void
 */


Graph.prototype.delProcessor = function (render) {
  var _this = this;

  var graphs = render.graphs;
  var index = graphs.findIndex(function (graph) {
    return graph === _this;
  });
  if (index === -1) return;
  if (typeof this.beforeDelete === 'function') this.beforeDelete(this);
  graphs.splice(index, 1, null);
  if (typeof this.deleted === 'function') this.deleted(this);
};
/**
 * @description Return a timed release Promise
 * @param {Number} time Release time
 * @return {Promise} A timed release Promise
 */


function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
});

unwrapExports(graph_class);

var crender_class = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var _color$1 = interopRequireDefault(_color);

var _bezierCurve = interopRequireDefault(lib$3);



var _graphs = interopRequireDefault(graphs_1);

var _graph = interopRequireDefault(graph_class);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @description           Class of CRender
 * @param {Object} canvas Canvas DOM
 * @return {CRender}      Instance of CRender
 */
var CRender = function CRender(canvas) {
  (0, _classCallCheck2["default"])(this, CRender);

  if (!canvas) {
    console.error('CRender Missing parameters!');
    return;
  }

  var ctx = canvas.getContext('2d');
  var clientWidth = canvas.clientWidth,
      clientHeight = canvas.clientHeight;
  var area = [clientWidth, clientHeight];
  canvas.setAttribute('width', clientWidth);
  canvas.setAttribute('height', clientHeight);
  /**
   * @description Context of the canvas
   * @type {Object}
   * @example ctx = canvas.getContext('2d')
   */

  this.ctx = ctx;
  /**
   * @description Width and height of the canvas
   * @type {Array}
   * @example area = [300，100]
   */

  this.area = area;
  /**
   * @description Whether render is in animation rendering
   * @type {Boolean}
   * @example animationStatus = true|false
   */

  this.animationStatus = false;
  /**
   * @description Added graph
   * @type {[Graph]}
   * @example graphs = [Graph, Graph, ...]
   */

  this.graphs = [];
  /**
   * @description Color plugin
   * @type {Object}
   * @link https://github.com/jiaming743/color
   */

  this.color = _color$1["default"];
  /**
   * @description Bezier Curve plugin
   * @type {Object}
   * @link https://github.com/jiaming743/BezierCurve
   */

  this.bezierCurve = _bezierCurve["default"]; // bind event handler

  canvas.addEventListener('mousedown', mouseDown.bind(this));
  canvas.addEventListener('mousemove', mouseMove.bind(this));
  canvas.addEventListener('mouseup', mouseUp.bind(this));
};
/**
 * @description        Clear canvas drawing area
 * @return {Undefined} Void
 */


exports["default"] = CRender;

CRender.prototype.clearArea = function () {
  var _this$ctx;

  var area = this.area;

  (_this$ctx = this.ctx).clearRect.apply(_this$ctx, [0, 0].concat((0, _toConsumableArray2["default"])(area)));
};
/**
 * @description           Add graph to render
 * @param {Object} config Graph configuration
 * @return {Graph}        Graph instance
 */


CRender.prototype.add = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = config.name;

  if (!name) {
    console.error('add Missing parameters!');
    return;
  }

  var graphConfig = _graphs["default"].get(name);

  if (!graphConfig) {
    console.warn('No corresponding graph configuration found!');
    return;
  }

  var graph = new _graph["default"](graphConfig, config);
  if (!graph.validator(graph)) return;
  graph.render = this;
  this.graphs.push(graph);
  this.sortGraphsByIndex();
  this.drawAllGraph();
  return graph;
};
/**
 * @description Sort the graph by index
 * @return {Undefined} Void
 */


CRender.prototype.sortGraphsByIndex = function () {
  var graphs = this.graphs;
  graphs.sort(function (a, b) {
    if (a.index > b.index) return 1;
    if (a.index === b.index) return 0;
    if (a.index < b.index) return -1;
  });
};
/**
 * @description         Delete graph in render
 * @param {Graph} graph The graph to be deleted
 * @return {Undefined}  Void
 */


CRender.prototype.delGraph = function (graph) {
  if (typeof graph.delProcessor !== 'function') return;
  graph.delProcessor(this);
  this.graphs = this.graphs.filter(function (graph) {
    return graph;
  });
  this.drawAllGraph();
};
/**
 * @description        Delete all graph in render
 * @return {Undefined} Void
 */


CRender.prototype.delAllGraph = function () {
  var _this = this;

  this.graphs.forEach(function (graph) {
    return graph.delProcessor(_this);
  });
  this.graphs = this.graphs.filter(function (graph) {
    return graph;
  });
  this.drawAllGraph();
};
/**
 * @description        Draw all the graphs in the render
 * @return {Undefined} Void
 */


CRender.prototype.drawAllGraph = function () {
  var _this2 = this;

  this.clearArea();
  this.graphs.filter(function (graph) {
    return graph && graph.visible;
  }).forEach(function (graph) {
    return graph.drawProcessor(_this2, graph);
  });
};
/**
 * @description      Animate the graph whose animation queue is not empty
 *                   and the animationPause is equal to false
 * @return {Promise} Animation Promise
 */


CRender.prototype.launchAnimation = function () {
  var _this3 = this;

  var animationStatus = this.animationStatus;
  if (animationStatus) return;
  this.animationStatus = true;
  return new Promise(function (resolve) {
    animation.call(_this3, function () {
      _this3.animationStatus = false;
      resolve();
    }, Date.now());
  });
};
/**
 * @description Try to animate every graph
 * @param {Function} callback Callback in animation end
 * @param {Number} timeStamp  Time stamp of animation start
 * @return {Undefined} Void
 */


function animation(callback, timeStamp) {
  var graphs = this.graphs;

  if (!animationAble(graphs)) {
    callback();
    return;
  }

  graphs.forEach(function (graph) {
    return graph.turnNextAnimationFrame(timeStamp);
  });
  this.drawAllGraph();
  requestAnimationFrame(animation.bind(this, callback, timeStamp));
}
/**
 * @description Find if there are graph that can be animated
 * @param {[Graph]} graphs
 * @return {Boolean}
 */


function animationAble(graphs) {
  return graphs.find(function (graph) {
    return !graph.animationPause && graph.animationFrameState.length;
  });
}
/**
 * @description Handler of CRender mousedown event
 * @return {Undefined} Void
 */


function mouseDown(e) {
  var graphs = this.graphs;
  var hoverGraph = graphs.find(function (graph) {
    return graph.status === 'hover';
  });
  if (!hoverGraph) return;
  hoverGraph.status = 'active';
}
/**
 * @description Handler of CRender mousemove event
 * @return {Undefined} Void
 */


function mouseMove(e) {
  var offsetX = e.offsetX,
      offsetY = e.offsetY;
  var position = [offsetX, offsetY];
  var graphs = this.graphs;
  var activeGraph = graphs.find(function (graph) {
    return graph.status === 'active' || graph.status === 'drag';
  });

  if (activeGraph) {
    if (!activeGraph.drag) return;

    if (typeof activeGraph.move !== 'function') {
      console.error('No move method is provided, cannot be dragged!');
      return;
    }

    activeGraph.moveProcessor(e);
    activeGraph.status = 'drag';
    return;
  }

  var hoverGraph = graphs.find(function (graph) {
    return graph.status === 'hover';
  });
  var hoverAbleGraphs = graphs.filter(function (graph) {
    return graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect);
  });
  var hoveredGraph = hoverAbleGraphs.find(function (graph) {
    return graph.hoverCheckProcessor(position, graph);
  });

  if (hoveredGraph) {
    document.body.style.cursor = hoveredGraph.style.hoverCursor;
  } else {
    document.body.style.cursor = 'default';
  }

  var hoverGraphMouseOuterIsFun = false,
      hoveredGraphMouseEnterIsFun = false;
  if (hoverGraph) hoverGraphMouseOuterIsFun = typeof hoverGraph.mouseOuter === 'function';
  if (hoveredGraph) hoveredGraphMouseEnterIsFun = typeof hoveredGraph.mouseEnter === 'function';
  if (!hoveredGraph && !hoverGraph) return;

  if (!hoveredGraph && hoverGraph) {
    if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
    hoverGraph.status = 'static';
    return;
  }

  if (hoveredGraph && hoveredGraph === hoverGraph) return;

  if (hoveredGraph && !hoverGraph) {
    if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
    hoveredGraph.status = 'hover';
    return;
  }

  if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
    if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
    hoverGraph.status = 'static';
    if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
    hoveredGraph.status = 'hover';
  }
}
/**
 * @description Handler of CRender mouseup event
 * @return {Undefined} Void
 */


function mouseUp(e) {
  var graphs = this.graphs;
  var activeGraph = graphs.find(function (graph) {
    return graph.status === 'active';
  });
  var dragGraph = graphs.find(function (graph) {
    return graph.status === 'drag';
  });
  if (activeGraph && typeof activeGraph.click === 'function') activeGraph.click(e, activeGraph);
  graphs.forEach(function (graph) {
    return graph && (graph.status = 'static');
  });
  if (activeGraph) activeGraph.status = 'hover';
  if (dragGraph) dragGraph.status = 'hover';
}
/**
 * @description         Clone Graph
 * @param {Graph} graph The target to be cloned
 * @return {Graph}      Cloned graph
 */


CRender.prototype.clone = function (graph) {
  var style = graph.style.getStyle();

  var clonedGraph = _objectSpread({}, graph, {
    style: style
  });

  delete clonedGraph.render;
  clonedGraph = (0, util$1.deepClone)(clonedGraph, true);
  return this.add(clonedGraph);
};
});

unwrapExports(crender_class);

var lib$1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CRender", {
  enumerable: true,
  get: function get() {
    return _crender["default"];
  }
});
Object.defineProperty(exports, "extendNewGraph", {
  enumerable: true,
  get: function get() {
    return graphs_1.extendNewGraph;
  }
});
exports["default"] = void 0;

var _crender = interopRequireDefault(crender_class);



var _default = _crender["default"];
exports["default"] = _default;
});

var CRender = unwrapExports(lib$1);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);











function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var pie$1 = {
  shape: {
    rx: 0,
    ry: 0,
    ir: 0,
    or: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator(_ref) {
    var shape = _ref.shape;
    var keys = ['rx', 'ry', 'ir', 'or', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('Pie shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref2, _ref3) {
    var ctx = _ref2.ctx;
    var shape = _ref3.shape;
    ctx.beginPath();
    var rx = shape.rx,
        ry = shape.ry,
        ir = shape.ir,
        or = shape.or,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        clockWise = shape.clockWise;
    rx = parseInt(rx) + 0.5;
    ry = parseInt(ry) + 0.5;
    ctx.arc(rx, ry, ir > 0 ? ir : 0, startAngle, endAngle, !clockWise);
    var connectPoint1 = (0, util$1.getCircleRadianPoint)(rx, ry, or, endAngle).map(function (p) {
      return parseInt(p) + 0.5;
    });
    var connectPoint2 = (0, util$1.getCircleRadianPoint)(rx, ry, ir, startAngle).map(function (p) {
      return parseInt(p) + 0.5;
    });
    ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(connectPoint1));
    ctx.arc(rx, ry, or > 0 ? or : 0, endAngle, startAngle, clockWise);
    ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(connectPoint2));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
};
var agArc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    gradientStartAngle: null,
    gradientEndAngle: null
  },
  validator: function validator(_ref4) {
    var shape = _ref4.shape;
    var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number';
    })) {
      console.error('AgArc shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref5, _ref6) {
    var ctx = _ref5.ctx;
    var shape = _ref6.shape,
        style = _ref6.style;
    var gradient = style.gradient;
    gradient = gradient.map(function (cv) {
      return (0, _color.getColorFromRgbValue)(cv);
    });

    if (gradient.length === 1) {
      gradient = [gradient[0], gradient[0]];
    }

    var gradientArcNum = gradient.length - 1;
    var gradientStartAngle = shape.gradientStartAngle,
        gradientEndAngle = shape.gradientEndAngle,
        startAngle = shape.startAngle,
        endAngle = shape.endAngle,
        r = shape.r,
        rx = shape.rx,
        ry = shape.ry;
    if (gradientStartAngle === null) gradientStartAngle = startAngle;
    if (gradientEndAngle === null) gradientEndAngle = endAngle;
    var angleGap = (gradientEndAngle - gradientStartAngle) / gradientArcNum;
    if (angleGap === Math.PI * 2) angleGap = Math.PI * 2 - 0.001;

    for (var i = 0; i < gradientArcNum; i++) {
      ctx.beginPath();
      var startPoint = (0, util$1.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * i);
      var endPoint = (0, util$1.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * (i + 1));
      var color = (0, util.getLinearGradientColor)(ctx, startPoint, endPoint, [gradient[i], gradient[i + 1]]);
      var arcStartAngle = startAngle + angleGap * i;
      var arcEndAngle = startAngle + angleGap * (i + 1);
      var doBreak = false;

      if (arcEndAngle > endAngle) {
        arcEndAngle = endAngle;
        doBreak = true;
      }

      ctx.arc(rx, ry, r, arcStartAngle, arcEndAngle);
      ctx.strokeStyle = color;
      ctx.stroke();
      if (doBreak) break;
    }
  }
};
var numberText = {
  shape: {
    number: [],
    content: '',
    position: [0, 0],
    toFixed: 0,
    rowGap: 0,
    formatter: null
  },
  validator: function validator(_ref7) {
    var shape = _ref7.shape;
    var number = shape.number,
        content = shape.content,
        position = shape.position;

    if (!(number instanceof Array) || typeof content !== 'string' || !(position instanceof Array)) {
      console.error('NumberText shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref8, _ref9) {
    var ctx = _ref8.ctx;
    var shape = _ref9.shape;
    var number = shape.number,
        content = shape.content,
        toFixed = shape.toFixed,
        rowGap = shape.rowGap,
        formatter = shape.formatter;
    var textSegments = content.split('{nt}');
    var textString = '';
    textSegments.forEach(function (t, i) {
      var currentNumber = number[i];
      if (typeof currentNumber !== 'number') currentNumber = '';

      if (typeof currentNumber === 'number') {
        currentNumber = currentNumber.toFixed(toFixed);
        if (typeof formatter === 'function') currentNumber = formatter(currentNumber);
      }

      textString += t + (currentNumber || '');
    });

    graphs_1.text.draw({
      ctx: ctx
    }, {
      shape: _objectSpread(_objectSpread({}, shape), {}, {
        content: textString,
        rowGap: rowGap
      })
    });
  }
};
var lineIcon = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator(_ref10) {
    var shape = _ref10.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('lineIcon shape configuration is abnormal!');
      return false;
    }

    return true;
  },
  draw: function draw(_ref11, _ref12) {
    var ctx = _ref11.ctx;
    var shape = _ref12.shape;
    ctx.beginPath();
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    var halfH = h / 2;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.moveTo(x, y + halfH);
    ctx.lineTo(x + w, y + halfH);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    var radius = halfH - 5 * 2;
    if (radius <= 0) radius = 3;
    ctx.arc(x + w / 2, y + halfH, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fill();
  },
  hoverCheck: function hoverCheck(position, _ref13) {
    var shape = _ref13.shape;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    return (0, util$1.checkPointIsInRect)(position, x, y, w, h);
  },
  setGraphCenter: function setGraphCenter(e, _ref14) {
    var shape = _ref14.shape,
        style = _ref14.style;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;
    style.graphCenter = [x + w / 2, y + h / 2];
  }
};
(0, lib$1.extendNewGraph)('pie', pie$1);
(0, lib$1.extendNewGraph)('agArc', agArc);
(0, lib$1.extendNewGraph)('numberText', numberText);
(0, lib$1.extendNewGraph)('lineIcon', lineIcon);

var color = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorConfig = void 0;
var colorConfig = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e062ae', '#e690d1', '#e7bcf3', '#9d96f5', '#8378ea', '#96bfff'];
exports.colorConfig = colorConfig;
});

unwrapExports(color);
color.colorConfig;

var grid = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridConfig = void 0;
var gridConfig = {
  /**
   * @description Grid left margin
   * @type {String|Number}
   * @default left = '10%'
   * @example left = '10%' | 10
   */
  left: '10%',

  /**
   * @description Grid right margin
   * @type {String|Number}
   * @default right = '10%'
   * @example right = '10%' | 10
   */
  right: '10%',

  /**
   * @description Grid top margin
   * @type {String|Number}
   * @default top = 60
   * @example top = '10%' | 60
   */
  top: 60,

  /**
   * @description Grid bottom margin
   * @type {String|Number}
   * @default bottom = 60
   * @example bottom = '10%' | 60
   */
  bottom: 60,

  /**
   * @description Grid default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  style: {
    fill: 'rgba(0, 0, 0, 0)'
  },

  /**
   * @description Grid render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = -30
   */
  rLevel: -30,

  /**
   * @description Grid animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Grid animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 30
};
exports.gridConfig = gridConfig;
});

unwrapExports(grid);
grid.gridConfig;

var axis = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yAxisConfig = exports.xAxisConfig = void 0;
var xAxisConfig = {
  /**
   * @description Axis name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Whether to display this axis
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Axis position
   * @type {String}
   * @default position = 'bottom'
   * @example position = 'bottom' | 'top'
   */
  position: 'bottom',

  /**
   * @description Name gap
   * @type {Number}
   * @default nameGap = 15
   */
  nameGap: 15,

  /**
   * @description Name location
   * @type {String}
   * @default nameLocation = 'end'
   * @example nameLocation = 'end' | 'center' | 'start'
   */
  nameLocation: 'end',

  /**
   * @description Name default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  nameTextStyle: {
    fill: '#333',
    fontSize: 10
  },

  /**
   * @description Axis min value
   * @type {String|Number}
   * @default min = '20%'
   * @example min = '20%' | 0
   */
  min: '20%',

  /**
   * @description Axis max value
   * @type {String|Number}
   * @default max = '20%'
   * @example max = '20%' | 0
   */
  max: '20%',

  /**
   * @description Axis value interval
   * @type {Number}
   * @default interval = null
   * @example interval = 100
   */
  interval: null,

  /**
   * @description Min interval
   * @type {Number}
   * @default minInterval = null
   * @example minInterval = 1
   */
  minInterval: null,

  /**
   * @description Max interval
   * @type {Number}
   * @default maxInterval = null
   * @example maxInterval = 100
   */
  maxInterval: null,

  /**
   * @description Boundary gap
   * @type {Boolean}
   * @default boundaryGap = null
   * @example boundaryGap = true
   */
  boundaryGap: null,

  /**
   * @description Axis split number
   * @type {Number}
   * @default splitNumber = 5
   */
  splitNumber: 5,

  /**
   * @description Axis line configuration
   * @type {Object}
   */
  axisLine: {
    /**
     * @description Whether to display axis line
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },

  /**
   * @description Axis tick configuration
   * @type {Object}
   */
  axisTick: {
    /**
     * @description Whether to display axis tick
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis tick default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },

  /**
   * @description Axis label configuration
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description Whether to display axis label
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,

    /**
     * @description Axis label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#333',
      fontSize: 10,
      rotate: 0
    }
  },

  /**
   * @description Axis split line configuration
   * @type {Object}
   */
  splitLine: {
    /**
     * @description Whether to display axis split line
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Axis split line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#d4d4d4',
      lineWidth: 1
    }
  },

  /**
   * @description X axis render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = -20
   */
  rLevel: -20,

  /**
   * @description X axis animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description X axis animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.xAxisConfig = xAxisConfig;
var yAxisConfig = {
  /**
   * @description Axis name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Whether to display this axis
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Axis position
   * @type {String}
   * @default position = 'left'
   * @example position = 'left' | 'right'
   */
  position: 'left',

  /**
   * @description Name gap
   * @type {Number}
   * @default nameGap = 15
   */
  nameGap: 15,

  /**
   * @description Name location
   * @type {String}
   * @default nameLocation = 'end'
   * @example nameLocation = 'end' | 'center' | 'start'
   */
  nameLocation: 'end',

  /**
   * @description name default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  nameTextStyle: {
    fill: '#333',
    fontSize: 10
  },

  /**
   * @description Axis min value
   * @type {String|Number}
   * @default min = '20%'
   * @example min = '20%' | 0
   */
  min: '20%',

  /**
   * @description Axis max value
   * @type {String|Number}
   * @default max = '20%'
   * @example max = '20%' | 0
   */
  max: '20%',

  /**
   * @description Axis value interval
   * @type {Number}
   * @default interval = null
   * @example interval = 100
   */
  interval: null,

  /**
   * @description Min interval
   * @type {Number}
   * @default minInterval = null
   * @example minInterval = 1
   */
  minInterval: null,

  /**
   * @description Max interval
   * @type {Number}
   * @default maxInterval = null
   * @example maxInterval = 100
   */
  maxInterval: null,

  /**
   * @description Boundary gap
   * @type {Boolean}
   * @default boundaryGap = null
   * @example boundaryGap = true
   */
  boundaryGap: null,

  /**
   * @description Axis split number
   * @type {Number}
   * @default splitNumber = 5
   */
  splitNumber: 5,

  /**
   * @description Axis line configuration
   * @type {Object}
   */
  axisLine: {
    /**
     * @description Whether to display axis line
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },

  /**
   * @description Axis tick configuration
   * @type {Object}
   */
  axisTick: {
    /**
     * @description Whether to display axis tick
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis tick default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },

  /**
   * @description Axis label configuration
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description Whether to display axis label
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,

    /**
     * @description Axis label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#333',
      fontSize: 10,
      rotate: 0
    }
  },

  /**
   * @description Axis split line configuration
   * @type {Object}
   */
  splitLine: {
    /**
     * @description Whether to display axis split line
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis split line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#d4d4d4',
      lineWidth: 1
    }
  },

  /**
   * @description Y axis render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = -20
   */
  rLevel: -20,

  /**
   * @description Y axis animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Y axis animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.yAxisConfig = yAxisConfig;
});

unwrapExports(axis);
axis.yAxisConfig;
axis.xAxisConfig;

var title = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.titleConfig = void 0;
var titleConfig = {
  /**
   * @description Whether to display title
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Title text
   * @type {String}
   * @default text = ''
   */
  text: '',

  /**
   * @description Title offset
   * @type {Array}
   * @default offset = [0, -20]
   */
  offset: [0, -20],

  /**
   * @description Title default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  style: {
    fill: '#333',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    textBaseline: 'bottom'
  },

  /**
   * @description Title render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 20
   */
  rLevel: 20,

  /**
   * @description Title animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Title animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.titleConfig = titleConfig;
});

unwrapExports(title);
title.titleConfig;

var line = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineConfig = void 0;
var lineConfig = {
  /**
   * @description Whether to display this line chart
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Data stacking
   * The data value of the series element of the same stack
   * will be superimposed (the latter value will be superimposed on the previous value)
   * @type {String}
   * @default stack = ''
   */
  stack: '',

  /**
   * @description Smooth line
   * @type {Boolean}
   * @default smooth = false
   */
  smooth: false,

  /**
   * @description Line x axis index
   * @type {Number}
   * @default xAxisIndex = 0
   * @example xAxisIndex = 0 | 1
   */
  xAxisIndex: 0,

  /**
   * @description Line y axis index
   * @type {Number}
   * @default yAxisIndex = 0
   * @example yAxisIndex = 0 | 1
   */
  yAxisIndex: 0,

  /**
   * @description Line chart data
   * @type {Array}
   * @default data = []
   * @example data = [100, 200, 300]
   */
  data: [],

  /**
   * @description Line default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  lineStyle: {
    lineWidth: 1
  },

  /**
   * @description Line point configuration
   * @type {Object}
   */
  linePoint: {
    /**
     * @description Whether to display line point
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Line point radius
     * @type {Number}
     * @default radius = 2
     */
    radius: 2,

    /**
     * @description Line point default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#fff',
      lineWidth: 1
    }
  },

  /**
   * @description Line area configuration
   * @type {Object}
   */
  lineArea: {
    /**
     * @description Whether to display line area
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Line area gradient color (Hex|rgb|rgba)
     * @type {Array}
     * @default gradient = []
     */
    gradient: [],

    /**
     * @description Line area style default configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      opacity: 0.5
    }
  },

  /**
   * @description Line label configuration
   * @type {Object}
   */
  label: {
    /**
     * @description Whether to display line label
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Line label position
     * @type {String}
     * @default position = 'top'
     * @example position = 'top' | 'center' | 'bottom'
     */
    position: 'top',

    /**
     * @description Line label offset
     * @type {Array}
     * @default offset = [0, -10]
     */
    offset: [0, -10],

    /**
     * @description Line label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,

    /**
     * @description Line label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 10
    }
  },

  /**
   * @description Line chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,

  /**
   * @description Line animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Line animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.lineConfig = lineConfig;
});

unwrapExports(line);
line.lineConfig;

var bar = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.barConfig = void 0;
var barConfig = {
  /**
   * @description Whether to display this bar chart
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Data stacking
   * The data value of the series element of the same stack
   * will be superimposed (the latter value will be superimposed on the previous value)
   * @type {String}
   * @default stack = ''
   */
  stack: '',

  /**
   * @description Bar shape type
   * @type {String}
   * @default shapeType = 'normal'
   * @example shapeType = 'normal' | 'leftEchelon' | 'rightEchelon'
   */
  shapeType: 'normal',

  /**
   * @description Echelon bar sharpness offset
   * @type {Number}
   * @default echelonOffset = 10
   */
  echelonOffset: 10,

  /**
   * @description Bar width
   * This property should be set on the last 'bar' series
   * in this coordinate system to take effect and will be in effect
   * for all 'bar' series in this coordinate system
   * @type {String|Number}
   * @default barWidth = 'auto'
   * @example barWidth = 'auto' | '10%' | 20
   */
  barWidth: 'auto',

  /**
   * @description Bar gap
   * This property should be set on the last 'bar' series
   * in this coordinate system to take effect and will be in effect
   * for all 'bar' series in this coordinate system
   * @type {String|Number}
   * @default barGap = '30%'
   * @example barGap = '30%' | 30
   */
  barGap: '30%',

  /**
   * @description Bar category gap
   * This property should be set on the last 'bar' series
   * in this coordinate system to take effect and will be in effect
   * for all 'bar' series in this coordinate system
   * @type {String|Number}
   * @default barCategoryGap = '20%'
   * @example barCategoryGap = '20%' | 20
   */
  barCategoryGap: '20%',

  /**
   * @description Bar x axis index
   * @type {Number}
   * @default xAxisIndex = 0
   * @example xAxisIndex = 0 | 1
   */
  xAxisIndex: 0,

  /**
   * @description Bar y axis index
   * @type {Number}
   * @default yAxisIndex = 0
   * @example yAxisIndex = 0 | 1
   */
  yAxisIndex: 0,

  /**
   * @description Bar chart data
   * @type {Array}
   * @default data = []
   * @example data = [100, 200, 300]
   */
  data: [],

  /**
   * @description Background bar configuration
   * @type {Object}
   */
  backgroundBar: {
    /**
     * @description Whether to display background bar
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Background bar width
     * @type {String|Number}
     * @default width = 'auto'
     * @example width = 'auto' | '30%' | 30
     */
    width: 'auto',

    /**
     * @description Background bar default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: 'rgba(200, 200, 200, .4)'
    }
  },

  /**
   * @description Bar label configuration
   * @type {Object}
   */
  label: {
    /**
     * @description Whether to display bar label
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Bar label position
     * @type {String}
     * @default position = 'top'
     * @example position = 'top' | 'center' | 'bottom'
     */
    position: 'top',

    /**
     * @description Bar label offset
     * @type {Array}
     * @default offset = [0, -10]
     */
    offset: [0, -10],

    /**
     * @description Bar label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,

    /**
     * @description Bar label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 10
    }
  },

  /**
   * @description Bar gradient configuration
   * @type {Object}
   */
  gradient: {
    /**
     * @description Gradient color (Hex|rgb|rgba)
     * @type {Array}
     * @default color = []
     */
    color: [],

    /**
     * @description Local gradient
     * @type {Boolean}
     * @default local = true
     */
    local: true
  },

  /**
   * @description Bar style default configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  barStyle: {},

  /**
   * @description Independent color mode
   * When set to true, independent color mode is enabled
   * @type {Boolean}
   * @default independentColor = false
   */
  independentColor: false,

  /**
   * @description Independent colors
   * Only effective when independent color mode is enabled
   * Default value is the same as the color in the root configuration
   * Two-dimensional color array can produce gradient colors
   * @type {Array}
   * @example independentColor = ['#fff', '#000']
   * @example independentColor = [['#fff', '#000'], '#000']
   */
  independentColors: [],

  /**
   * @description Bar chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 0
   */
  rLevel: 0,

  /**
   * @description Bar animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Bar animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.barConfig = barConfig;
});

unwrapExports(bar);
bar.barConfig;

var pie = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieConfig = void 0;
var pieConfig = {
  /**
   * @description Whether to display this pie chart
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Radius of pie
   * @type {String|Number}
   * @default radius = '50%'
   * @example radius = '50%' | 100
   */
  radius: '50%',

  /**
   * @description Center point of pie
   * @type {Array}
   * @default center = ['50%','50%']
   * @example center = ['50%','50%'] | [100, 100]
   */
  center: ['50%', '50%'],

  /**
   * @description Pie chart start angle
   * @type {Number}
   * @default startAngle = -Math.PI / 2
   * @example startAngle = -Math.PI
   */
  startAngle: -Math.PI / 2,

  /**
   * @description Whether to enable rose type
   * @type {Boolean}
   * @default roseType = false
   */
  roseType: false,

  /**
   * @description Automatic sorting in rose type
   * @type {Boolean}
   * @default roseSort = true
   */
  roseSort: true,

  /**
   * @description Rose radius increasing
   * @type {String|Number}
   * @default roseIncrement = 'auto'
   * @example roseIncrement = 'auto' | '10%' | 10
   */
  roseIncrement: 'auto',

  /**
   * @description Pie chart data
   * @type {Array}
   * @default data = []
   */
  data: [],

  /**
   * @description Pie inside label configuration
   * @type {Object}
   */
  insideLabel: {
    /**
     * @description Whether to display inside label
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Label formatter
     * @type {String|Function}
     * @default formatter = '{percent}%'
     * @example formatter = '${name}-{value}-{percent}%'
     * @example formatter = (dataItem) => (dataItem.name)
     */
    formatter: '{percent}%',

    /**
     * @description Label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 10,
      fill: '#fff',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  },

  /**
   * @description Pie Outside label configuration
   * @type {Object}
   */
  outsideLabel: {
    /**
     * @description Whether to display outside label
     * @type {Boolean}
     * @default show = false
     */
    show: true,

    /**
     * @description Label formatter
     * @type {String|Function}
     * @default formatter = '{name}'
     * @example formatter = '${name}-{value}-{percent}%'
     * @example formatter = (dataItem) => (dataItem.name)
     */
    formatter: '{name}',

    /**
     * @description Label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 11
    },

    /**
     * @description Gap beteen label line bended place and pie
     * @type {String|Number}
     * @default labelLineBendGap = '20%'
     * @example labelLineBendGap = '20%' | 20
     */
    labelLineBendGap: '20%',

    /**
     * @description Label line end length
     * @type {Number}
     * @default labelLineEndLength = 50
     */
    labelLineEndLength: 50,

    /**
     * @description Label line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    labelLineStyle: {
      lineWidth: 1
    }
  },

  /**
   * @description Pie default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  pieStyle: {},

  /**
   * @description Percentage fractional precision
   * @type {Number}
   * @default percentToFixed = 0
   */
  percentToFixed: 0,

  /**
   * @description Pie chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,

  /**
   * @description Animation delay gap
   * @type {Number}
   * @default animationDelayGap = 60
   */
  animationDelayGap: 60,

  /**
   * @description Pie animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Pie start animation curve
   * @type {String}
   * @default startAnimationCurve = 'easeOutBack'
   */
  startAnimationCurve: 'easeOutBack',

  /**
   * @description Pie animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.pieConfig = pieConfig;
});

unwrapExports(pie);
pie.pieConfig;

var radarAxis = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radarAxisConfig = void 0;
var radarAxisConfig = {
  /**
   * @description Whether to display this radar axis
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Center point of radar axis
   * @type {Array}
   * @default center = ['50%','50%']
   * @example center = ['50%','50%'] | [100, 100]
   */
  center: ['50%', '50%'],

  /**
   * @description Radius of radar axis
   * @type {String|Number}
   * @default radius = '65%'
   * @example radius = '65%' | 100
   */
  radius: '65%',

  /**
   * @description Radar axis start angle
   * @type {Number}
   * @default startAngle = -Math.PI / 2
   * @example startAngle = -Math.PI
   */
  startAngle: -Math.PI / 2,

  /**
   * @description Radar axis split number
   * @type {Number}
   * @default splitNum = 5
   */
  splitNum: 5,

  /**
   * @description Whether to enable polygon radar axis
   * @type {Boolean}
   * @default polygon = false
   */
  polygon: false,

  /**
   * @description Axis label configuration
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description Whether to display axis label
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Label gap between label and radar axis
     * @type {Number}
     * @default labelGap = 15
     */
    labelGap: 15,

    /**
     * @description Label color (Hex|rgb|rgba), will cover style.fill
     * @type {Array}
     * @default color = []
     */
    color: [],

    /**
     * @description Axis label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#333'
    }
  },

  /**
   * @description Axis line configuration
   * @type {Object}
   */
  axisLine: {
    /**
     * @description Whether to display axis line
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Line color (Hex|rgb|rgba), will cover style.stroke
     * @type {Array}
     * @default color = []
     */
    color: [],

    /**
     * @description Axis label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#999',
      lineWidth: 1
    }
  },

  /**
   * @description Split line configuration
   * @type {Object}
   */
  splitLine: {
    /**
     * @description Whether to display split line
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Line color (Hex|rgb|rgba), will cover style.stroke
     * @type {Array}
     * @default color = []
     */
    color: [],

    /**
     * @description Split line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#d4d4d4',
      lineWidth: 1
    }
  },

  /**
   * @description Split area configuration
   * @type {Object}
   */
  splitArea: {
    /**
     * @description Whether to display split area
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Area color (Hex|rgb|rgba), will cover style.stroke
     * @type {Array}
     * @default color = []
     */
    color: ['#f5f5f5', '#e6e6e6'],

    /**
     * @description Split area default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {}
  },

  /**
   * @description Bar chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = -10
   */
  rLevel: -10,

  /**
   * @description Radar axis animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Radar axis animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrane: 50
};
exports.radarAxisConfig = radarAxisConfig;
});

unwrapExports(radarAxis);
radarAxis.radarAxisConfig;

var radar = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radarConfig = void 0;
var radarConfig = {
  /**
   * @description Whether to display this radar
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Radar chart data
   * @type {Array}
   * @default data = []
   * @example data = [100, 200, 300]
   */
  data: [],

  /**
   * @description Radar default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  radarStyle: {
    lineWidth: 1
  },

  /**
   * @description Radar point configuration
   * @type {Object}
   */
  point: {
    /**
     * @description Whether to display radar point
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Point radius
     * @type {Number}
     * @default radius = 2
     */
    radius: 2,

    /**
     * @description Radar point default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#fff'
    }
  },

  /**
   * @description Radar label configuration
   * @type {Object}
   */
  label: {
    /**
     * @description Whether to display radar label
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Label position offset
     * @type {Array}
     * @default offset = [0, 0]
     */
    offset: [0, 0],

    /**
     * @description Label gap between label and radar
     * @type {Number}
     * @default labelGap = 5
     */
    labelGap: 5,

    /**
     * @description Label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = 'Score-{value}'
     * @example formatter = (label) => (label)
     */
    formatter: null,

    /**
     * @description Radar label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 10
    }
  },

  /**
   * @description Radar chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,

  /**
   * @description Radar animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Radar animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrane: 50
};
exports.radarConfig = radarConfig;
});

unwrapExports(radar);
radar.radarConfig;

var gauge = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gaugeConfig = void 0;
var gaugeConfig = {
  /**
   * @description Whether to display this gauge
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend name
   * @type {String}
   * @default name = ''
   */
  name: '',

  /**
   * @description Radius of gauge
   * @type {String|Number}
   * @default radius = '60%'
   * @example radius = '60%' | 100
   */
  radius: '60%',

  /**
   * @description Center point of gauge
   * @type {Array}
   * @default center = ['50%','50%']
   * @example center = ['50%','50%'] | [100, 100]
   */
  center: ['50%', '50%'],

  /**
   * @description Gauge start angle
   * @type {Number}
   * @default startAngle = -(Math.PI / 4) * 5
   * @example startAngle = -Math.PI
   */
  startAngle: -(Math.PI / 4) * 5,

  /**
   * @description Gauge end angle
   * @type {Number}
   * @default endAngle = Math.PI / 4
   * @example endAngle = 0
   */
  endAngle: Math.PI / 4,

  /**
   * @description Gauge min value
   * @type {Number}
   * @default min = 0
   */
  min: 0,

  /**
   * @description Gauge max value
   * @type {Number}
   * @default max = 100
   */
  max: 100,

  /**
   * @description Gauge split number
   * @type {Number}
   * @default splitNum = 5
   */
  splitNum: 5,

  /**
   * @description Gauge arc line width
   * @type {Number}
   * @default arcLineWidth = 15
   */
  arcLineWidth: 15,

  /**
   * @description Gauge chart data
   * @type {Array}
   * @default data = []
   */
  data: [],

  /**
   * @description Data item arc default style configuration
   * @type {Object}
   * @default dataItemStyle = {Configuration Of Class Style}
   */
  dataItemStyle: {},

  /**
   * @description Axis tick configuration
   * @type {Object}
   */
  axisTick: {
    /**
     * @description Whether to display axis tick
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis tick length
     * @type {Number}
     * @default tickLength = 6
     */
    tickLength: 6,

    /**
     * @description Axis tick default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#999',
      lineWidth: 1
    }
  },

  /**
   * @description Axis label configuration
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description Whether to display axis label
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis label data (Can be calculated automatically)
     * @type {Array}
     * @default data = [Number...]
     */
    data: [],

    /**
     * @description Axis label formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}%'
     * @example formatter = (labelItem) => (labelItem.value)
     */
    formatter: null,

    /**
     * @description Axis label gap between label and axis tick
     * @type {String|Function}
     * @default labelGap = 5
     */
    labelGap: 5,

    /**
     * @description Axis label default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {}
  },

  /**
   * @description Gauge pointer configuration
   * @type {Object}
   */
  pointer: {
    /**
     * @description Whether to display pointer
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Pointer value index of data
     * @type {Number}
     * @default valueIndex = 0 (pointer.value = data[0].value)
     */
    valueIndex: 0,

    /**
     * @description Pointer default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      scale: [1, 1],
      fill: '#fb7293'
    }
  },

  /**
   * @description Data item arc detail configuration
   * @type {Object}
   */
  details: {
    /**
     * @description Whether to display details
     * @type {Boolean}
     * @default show = false
     */
    show: false,

    /**
     * @description Details formatter
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}%'
     * @example formatter = '{name}%'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,

    /**
     * @description Details position offset
     * @type {Array}
     * @default offset = [0, 0]
     * @example offset = [10, 10]
     */
    offset: [0, 0],

    /**
     * @description Value fractional precision
     * @type {Number}
     * @default valueToFixed = 0
     */
    valueToFixed: 0,

    /**
     * @description Details position
     * @type {String}
     * @default position = 'center'
     * @example position = 'start' | 'center' | 'end'
     */
    position: 'center',

    /**
     * @description Details default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  },

  /**
   * @description Gauge background arc configuration
   * @type {Object}
   */
  backgroundArc: {
    /**
     * @description Whether to display background arc
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Background arc default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      stroke: '#e0e0e0'
    }
  },

  /**
   * @description Gauge chart render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,

  /**
   * @description Gauge animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Gauge animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.gaugeConfig = gaugeConfig;
});

unwrapExports(gauge);
gauge.gaugeConfig;

var legend = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legendConfig = void 0;
var legendConfig = {
  /**
   * @description Whether to display legend
   * @type {Boolean}
   * @default show = true
   */
  show: true,

  /**
   * @description Legend orient
   * @type {String}
   * @default orient = 'horizontal'
   * @example orient = 'horizontal' | 'vertical'
   */
  orient: 'horizontal',

  /**
   * @description Legend left
   * @type {String|Number}
   * @default left = 'auto'
   * @example left = 'auto' | '10%' | 10
   */
  left: 'auto',

  /**
   * @description Legend right
   * @type {String|Number}
   * @default right = 'auto'
   * @example right = 'auto' | '10%' | 10
   */
  right: 'auto',

  /**
   * @description Legend top
   * @type {String|Number}
   * @default top = 'auto'
   * @example top = 'auto' | '10%' | 10
   */
  top: 'auto',

  /**
   * @description Legend bottom
   * @type {String|Number}
   * @default bottom = 'auto'
   * @example bottom = 'auto' | '10%' | 10
   */
  bottom: 'auto',

  /**
   * @description Legend item gap
   * @type {Number}
   * @default itemGap = 10
   */
  itemGap: 10,

  /**
   * @description Icon width
   * @type {Number}
   * @default iconWidth = 25
   */
  iconWidth: 25,

  /**
   * @description Icon height
   * @type {Number}
   * @default iconHeight = 10
   */
  iconHeight: 10,

  /**
   * @description Whether legend is optional
   * @type {Boolean}
   * @default selectAble = true
   */
  selectAble: true,

  /**
   * @description Legend data
   * @type {Array}
   * @default data = []
   */
  data: [],

  /**
   * @description Legend text default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 13,
    fill: '#000'
  },

  /**
   * @description Legend icon default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  iconStyle: {},

  /**
   * @description Legend text unselected default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  textUnselectedStyle: {
    fontFamily: 'Arial',
    fontSize: 13,
    fill: '#999'
  },

  /**
   * @description Legend icon unselected default style configuration
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  iconUnselectedStyle: {
    fill: '#999'
  },

  /**
   * @description Legend render level
   * Priority rendering high level
   * @type {Number}
   * @default rLevel = 20
   */
  rLevel: 20,

  /**
   * @description Legend animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',

  /**
   * @description Legend animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
};
exports.legendConfig = legendConfig;
});

unwrapExports(legend);
legend.legendConfig;

var config = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeDefaultConfig = changeDefaultConfig;
Object.defineProperty(exports, "colorConfig", {
  enumerable: true,
  get: function get() {
    return color.colorConfig;
  }
});
Object.defineProperty(exports, "gridConfig", {
  enumerable: true,
  get: function get() {
    return grid.gridConfig;
  }
});
Object.defineProperty(exports, "xAxisConfig", {
  enumerable: true,
  get: function get() {
    return axis.xAxisConfig;
  }
});
Object.defineProperty(exports, "yAxisConfig", {
  enumerable: true,
  get: function get() {
    return axis.yAxisConfig;
  }
});
Object.defineProperty(exports, "titleConfig", {
  enumerable: true,
  get: function get() {
    return title.titleConfig;
  }
});
Object.defineProperty(exports, "lineConfig", {
  enumerable: true,
  get: function get() {
    return line.lineConfig;
  }
});
Object.defineProperty(exports, "barConfig", {
  enumerable: true,
  get: function get() {
    return bar.barConfig;
  }
});
Object.defineProperty(exports, "pieConfig", {
  enumerable: true,
  get: function get() {
    return pie.pieConfig;
  }
});
Object.defineProperty(exports, "radarAxisConfig", {
  enumerable: true,
  get: function get() {
    return radarAxis.radarAxisConfig;
  }
});
Object.defineProperty(exports, "radarConfig", {
  enumerable: true,
  get: function get() {
    return radar.radarConfig;
  }
});
Object.defineProperty(exports, "gaugeConfig", {
  enumerable: true,
  get: function get() {
    return gauge.gaugeConfig;
  }
});
Object.defineProperty(exports, "legendConfig", {
  enumerable: true,
  get: function get() {
    return legend.legendConfig;
  }
});
exports.keys = void 0;

























var allConfig = {
  colorConfig: color.colorConfig,
  gridConfig: grid.gridConfig,
  xAxisConfig: axis.xAxisConfig,
  yAxisConfig: axis.yAxisConfig,
  titleConfig: title.titleConfig,
  lineConfig: line.lineConfig,
  barConfig: bar.barConfig,
  pieConfig: pie.pieConfig,
  radarAxisConfig: radarAxis.radarAxisConfig,
  radarConfig: radar.radarConfig,
  gaugeConfig: gauge.gaugeConfig,
  legendConfig: legend.legendConfig
};
/**
 * @description Change default configuration
 * @param {String} key          Configuration key
 * @param {Object|Array} config Your config
 * @return {Undefined} No return
 */

function changeDefaultConfig(key, config) {
  if (!allConfig["".concat(key, "Config")]) {
    console.warn('Change default config Error - Invalid key!');
    return;
  }

  (0, util.deepMerge)(allConfig["".concat(key, "Config")], config);
}

var keys = ['color', 'title', 'legend', 'xAxis', 'yAxis', 'grid', 'radarAxis', 'line', 'bar', 'pie', 'radar', 'gauge'];
exports.keys = keys;
});

unwrapExports(config);
config.changeDefaultConfig;
config.keys;

var mergeColor_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeColor = mergeColor;







function mergeColor(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaultColor = (0, util$1.deepClone)(config.colorConfig, true);
  var color = option.color,
      series = option.series;
  if (!series) series = [];
  if (!color) color = [];
  option.color = color = (0, util.deepMerge)(defaultColor, color);
  if (!series.length) return;
  var colorNum = color.length;
  series.forEach(function (item, i) {
    if (item.color) return;
    item.color = color[i % colorNum];
  });
  var pies = series.filter(function (_ref) {
    var type = _ref.type;
    return type === 'pie';
  });
  pies.forEach(function (pie) {
    return pie.data.forEach(function (di, i) {
      return di.color = color[i % colorNum];
    });
  });
  var gauges = series.filter(function (_ref2) {
    var type = _ref2.type;
    return type === 'gauge';
  });
  gauges.forEach(function (gauge) {
    return gauge.data.forEach(function (di, i) {
      return di.color = color[i % colorNum];
    });
  });
  var barWithIndependentColor = series.filter(function (_ref3) {
    var type = _ref3.type,
        independentColor = _ref3.independentColor;
    return type === 'bar' && independentColor;
  });
  barWithIndependentColor.forEach(function (bar) {
    if (bar.independentColors) return;
    bar.independentColors = color;
  });
}
});

unwrapExports(mergeColor_1);
mergeColor_1.mergeColor;

var updater_class = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doUpdate = doUpdate;
exports.Updater = void 0;

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _typeof2 = interopRequireDefault(_typeof_1);

var _classCallCheck2 = interopRequireDefault(classCallCheck);

var Updater = function Updater(config, series) {
  (0, _classCallCheck2["default"])(this, Updater);
  var chart = config.chart,
      key = config.key,
      getGraphConfig = config.getGraphConfig;

  if (typeof getGraphConfig !== 'function') {
    console.warn('Updater need function getGraphConfig!');
    return;
  }

  if (!chart[key]) this.graphs = chart[key] = [];
  Object.assign(this, config);
  this.update(series);
};

exports.Updater = Updater;

Updater.prototype.update = function (series) {
  var _this = this;

  var graphs = this.graphs,
      beforeUpdate = this.beforeUpdate;
  delRedundanceGraph(this, series);
  if (!series.length) return;
  var beforeUpdateType = (0, _typeof2["default"])(beforeUpdate);
  series.forEach(function (seriesItem, i) {
    if (beforeUpdateType === 'function') beforeUpdate(graphs, seriesItem, i, _this);
    var cache = graphs[i];

    if (cache) {
      changeGraphs(cache, seriesItem, i, _this);
    } else {
      addGraphs(graphs, seriesItem, i, _this);
    }
  });
};

function delRedundanceGraph(updater, series) {
  var graphs = updater.graphs,
      render = updater.chart.render;
  var cacheGraphNum = graphs.length;
  var needGraphNum = series.length;

  if (cacheGraphNum > needGraphNum) {
    var needDelGraphs = graphs.splice(needGraphNum);
    needDelGraphs.forEach(function (item) {
      return item.forEach(function (g) {
        return render.delGraph(g);
      });
    });
  }
}

function changeGraphs(cache, seriesItem, i, updater) {
  var getGraphConfig = updater.getGraphConfig,
      render = updater.chart.render,
      beforeChange = updater.beforeChange;
  var configs = getGraphConfig(seriesItem, updater);
  balanceGraphsNum(cache, configs, render);
  cache.forEach(function (graph, j) {
    var config = configs[j];
    if (typeof beforeChange === 'function') beforeChange(graph, config);
    updateGraphConfigByKey(graph, config);
  });
}

function balanceGraphsNum(graphs, graphConfig, render) {
  var cacheGraphNum = graphs.length;
  var needGraphNum = graphConfig.length;

  if (needGraphNum > cacheGraphNum) {
    var lastCacheGraph = graphs.slice(-1)[0];
    var needAddGraphNum = needGraphNum - cacheGraphNum;
    var needAddGraphs = new Array(needAddGraphNum).fill(0).map(function (foo) {
      return render.clone(lastCacheGraph);
    });
    graphs.push.apply(graphs, (0, _toConsumableArray2["default"])(needAddGraphs));
  } else if (needGraphNum < cacheGraphNum) {
    var needDelCache = graphs.splice(needGraphNum);
    needDelCache.forEach(function (g) {
      return render.delGraph(g);
    });
  }
}

function addGraphs(graphs, seriesItem, i, updater) {
  var getGraphConfig = updater.getGraphConfig,
      getStartGraphConfig = updater.getStartGraphConfig,
      chart = updater.chart;
  var render = chart.render;
  var startConfigs = null;
  if (typeof getStartGraphConfig === 'function') startConfigs = getStartGraphConfig(seriesItem, updater);
  var configs = getGraphConfig(seriesItem, updater);
  if (!configs.length) return;

  if (startConfigs) {
    graphs[i] = startConfigs.map(function (config) {
      return render.add(config);
    });
    graphs[i].forEach(function (graph, i) {
      var config = configs[i];
      updateGraphConfigByKey(graph, config);
    });
  } else {
    graphs[i] = configs.map(function (config) {
      return render.add(config);
    });
  }

  var afterAddGraph = updater.afterAddGraph;
  if (typeof afterAddGraph === 'function') afterAddGraph(graphs[i]);
}

function updateGraphConfigByKey(graph, config) {
  var keys = Object.keys(config);
  keys.forEach(function (key) {
    if (key === 'shape' || key === 'style') {
      graph.animation(key, config[key], true);
    } else {
      graph[key] = config[key];
    }
  });
}

function doUpdate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      chart = _ref.chart,
      series = _ref.series,
      key = _ref.key,
      getGraphConfig = _ref.getGraphConfig,
      getStartGraphConfig = _ref.getStartGraphConfig,
      beforeChange = _ref.beforeChange,
      beforeUpdate = _ref.beforeUpdate,
      afterAddGraph = _ref.afterAddGraph;

  if (chart[key]) {
    chart[key].update(series);
  } else {
    chart[key] = new Updater({
      chart: chart,
      key: key,
      getGraphConfig: getGraphConfig,
      getStartGraphConfig: getStartGraphConfig,
      beforeChange: beforeChange,
      beforeUpdate: beforeUpdate,
      afterAddGraph: afterAddGraph
    }, series);
  }
}
});

unwrapExports(updater_class);
updater_class.doUpdate;
updater_class.Updater;

var title_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.title = title;

var _slicedToArray2 = interopRequireDefault(slicedToArray);









function title(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var title = [];

  if (option.title) {
    title[0] = (0, util.deepMerge)((0, util$1.deepClone)(config.titleConfig, true), option.title);
  }

  (0, updater_class.doUpdate)({
    chart: chart,
    series: title,
    key: 'title',
    getGraphConfig: getTitleConfig
  });
}

function getTitleConfig(titleItem, updater) {
  var animationCurve = config.titleConfig.animationCurve,
      animationFrame = config.titleConfig.animationFrame,
      rLevel = config.titleConfig.rLevel;
  var shape = getTitleShape(titleItem, updater);
  var style = getTitleStyle(titleItem);
  return [{
    name: 'text',
    index: rLevel,
    visible: titleItem.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: shape,
    style: style
  }];
}

function getTitleShape(titleItem, updater) {
  var offset = titleItem.offset,
      text = titleItem.text;
  var _updater$chart$gridAr = updater.chart.gridArea,
      x = _updater$chart$gridAr.x,
      y = _updater$chart$gridAr.y,
      w = _updater$chart$gridAr.w;

  var _offset = (0, _slicedToArray2["default"])(offset, 2),
      ox = _offset[0],
      oy = _offset[1];

  return {
    content: text,
    position: [x + w / 2 + ox, y + oy]
  };
}

function getTitleStyle(titleItem) {
  var style = titleItem.style;
  return style;
}
});

unwrapExports(title_1);
title_1.title;

var grid_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = grid;

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _defineProperty2 = interopRequireDefault(defineProperty);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function grid(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var grid = option.grid;
  grid = (0, util.deepMerge)((0, util$1.deepClone)(config.gridConfig, true), grid || {});
  (0, updater_class.doUpdate)({
    chart: chart,
    series: [grid],
    key: 'grid',
    getGraphConfig: getGridConfig
  });
}

function getGridConfig(gridItem, updater) {
  var animationCurve = gridItem.animationCurve,
      animationFrame = gridItem.animationFrame,
      rLevel = gridItem.rLevel;
  var shape = getGridShape(gridItem, updater);
  var style = getGridStyle(gridItem);
  updater.chart.gridArea = _objectSpread({}, shape);
  return [{
    name: 'rect',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: shape,
    style: style
  }];
}

function getGridShape(gridItem, updater) {
  var _updater$chart$render = (0, _slicedToArray2["default"])(updater.chart.render.area, 2),
      w = _updater$chart$render[0],
      h = _updater$chart$render[1];

  var left = getNumberValue(gridItem.left, w);
  var right = getNumberValue(gridItem.right, w);
  var top = getNumberValue(gridItem.top, h);
  var bottom = getNumberValue(gridItem.bottom, h);
  var width = w - left - right;
  var height = h - top - bottom;
  return {
    x: left,
    y: top,
    w: width,
    h: height
  };
}

function getNumberValue(val, all) {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string') return 0;
  return all * parseInt(val) / 100;
}

function getGridStyle(gridItem) {
  var style = gridItem.style;
  return style;
}
});

unwrapExports(grid_1);
grid_1.grid;

var axis_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axis = axis;

var _typeof2 = interopRequireDefault(_typeof_1);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var axisConfig = {
  xAxisConfig: config.xAxisConfig,
  yAxisConfig: config.yAxisConfig
};
var abs = Math.abs,
    pow = Math.pow;

function axis(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var xAxis = option.xAxis,
      yAxis = option.yAxis,
      series = option.series;
  var allAxis = [];

  if (xAxis && yAxis && series) {
    allAxis = getAllAxis(xAxis, yAxis);
    allAxis = mergeDefaultAxisConfig(allAxis);
    allAxis = allAxis.filter(function (_ref) {
      var show = _ref.show;
      return show;
    });
    allAxis = mergeDefaultBoundaryGap(allAxis);
    allAxis = calcAxisLabelData(allAxis, series);
    allAxis = setAxisPosition(allAxis);
    allAxis = calcAxisLinePosition(allAxis, chart);
    allAxis = calcAxisTickPosition(allAxis);
    allAxis = calcAxisNamePosition(allAxis);
    allAxis = calcSplitLinePosition(allAxis, chart);
  }

  (0, updater_class.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisLine',
    getGraphConfig: getLineConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisTick',
    getGraphConfig: getTickConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisLabel',
    getGraphConfig: getLabelConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisName',
    getGraphConfig: getNameConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'splitLine',
    getGraphConfig: getSplitLineConfig
  });
  chart.axisData = allAxis;
}

function getAllAxis(xAxis, yAxis) {
  var allXAxis = [],
      allYAxis = [];

  if (xAxis instanceof Array) {
    var _allXAxis;

    (_allXAxis = allXAxis).push.apply(_allXAxis, (0, _toConsumableArray2["default"])(xAxis));
  } else {
    allXAxis.push(xAxis);
  }

  if (yAxis instanceof Array) {
    var _allYAxis;

    (_allYAxis = allYAxis).push.apply(_allYAxis, (0, _toConsumableArray2["default"])(yAxis));
  } else {
    allYAxis.push(yAxis);
  }

  allXAxis.splice(2);
  allYAxis.splice(2);
  allXAxis = allXAxis.map(function (axis, i) {
    return _objectSpread(_objectSpread({}, axis), {}, {
      index: i,
      axis: 'x'
    });
  });
  allYAxis = allYAxis.map(function (axis, i) {
    return _objectSpread(_objectSpread({}, axis), {}, {
      index: i,
      axis: 'y'
    });
  });
  return [].concat((0, _toConsumableArray2["default"])(allXAxis), (0, _toConsumableArray2["default"])(allYAxis));
}

function mergeDefaultAxisConfig(allAxis) {
  var xAxis = allAxis.filter(function (_ref2) {
    var axis = _ref2.axis;
    return axis === 'x';
  });
  var yAxis = allAxis.filter(function (_ref3) {
    var axis = _ref3.axis;
    return axis === 'y';
  });
  xAxis = xAxis.map(function (axis) {
    return (0, util.deepMerge)((0, util$1.deepClone)(config.xAxisConfig), axis);
  });
  yAxis = yAxis.map(function (axis) {
    return (0, util.deepMerge)((0, util$1.deepClone)(config.yAxisConfig), axis);
  });
  return [].concat((0, _toConsumableArray2["default"])(xAxis), (0, _toConsumableArray2["default"])(yAxis));
}

function mergeDefaultBoundaryGap(allAxis) {
  var valueAxis = allAxis.filter(function (_ref4) {
    var data = _ref4.data;
    return data === 'value';
  });
  var labelAxis = allAxis.filter(function (_ref5) {
    var data = _ref5.data;
    return data !== 'value';
  });
  valueAxis.forEach(function (axis) {
    if (typeof axis.boundaryGap === 'boolean') return;
    axis.boundaryGap = false;
  });
  labelAxis.forEach(function (axis) {
    if (typeof axis.boundaryGap === 'boolean') return;
    axis.boundaryGap = true;
  });
  return [].concat((0, _toConsumableArray2["default"])(valueAxis), (0, _toConsumableArray2["default"])(labelAxis));
}

function calcAxisLabelData(allAxis, series) {
  var valueAxis = allAxis.filter(function (_ref6) {
    var data = _ref6.data;
    return data === 'value';
  });
  var labelAxis = allAxis.filter(function (_ref7) {
    var data = _ref7.data;
    return data instanceof Array;
  });
  valueAxis = calcValueAxisLabelData(valueAxis, series);
  labelAxis = calcLabelAxisLabelData(labelAxis);
  return [].concat((0, _toConsumableArray2["default"])(valueAxis), (0, _toConsumableArray2["default"])(labelAxis));
}

function calcValueAxisLabelData(valueAxis, series) {
  return valueAxis.map(function (axis) {
    var minMaxValue = getValueAxisMaxMinValue(axis, series);

    var _getTrueMinMax = getTrueMinMax(axis, minMaxValue),
        _getTrueMinMax2 = (0, _slicedToArray2["default"])(_getTrueMinMax, 2),
        min = _getTrueMinMax2[0],
        max = _getTrueMinMax2[1];

    var interval = getValueInterval(min, max, axis);
    var formatter = axis.axisLabel.formatter;
    var label = [];

    if (min < 0 && max > 0) {
      label = getValueAxisLabelFromZero(min, max, interval);
    } else {
      label = getValueAxisLabelFromMin(min, max, interval);
    }

    label = label.map(function (l) {
      return parseFloat(l.toFixed(2));
    });
    return _objectSpread(_objectSpread({}, axis), {}, {
      maxValue: label.slice(-1)[0],
      minValue: label[0],
      label: getAfterFormatterLabel(label, formatter)
    });
  });
}

function getValueAxisMaxMinValue(axis, series) {
  series = series.filter(function (_ref8) {
    var show = _ref8.show,
        type = _ref8.type;
    if (show === false) return false;
    if (type === 'pie') return false;
    return true;
  });
  if (series.length === 0) return [0, 0];
  var index = axis.index,
      axisType = axis.axis;
  series = mergeStackData(series);
  var axisName = axisType + 'Axis';
  var valueSeries = series.filter(function (s) {
    return s[axisName] === index;
  });
  if (!valueSeries.length) valueSeries = series;
  return getSeriesMinMaxValue(valueSeries);
}

function getSeriesMinMaxValue(series) {
  if (!series) return;
  var minValue = Math.min.apply(Math, (0, _toConsumableArray2["default"])(series.map(function (_ref9) {
    var data = _ref9.data;
    return Math.min.apply(Math, (0, _toConsumableArray2["default"])((0, util.filterNonNumber)(data)));
  })));
  var maxValue = Math.max.apply(Math, (0, _toConsumableArray2["default"])(series.map(function (_ref10) {
    var data = _ref10.data;
    return Math.max.apply(Math, (0, _toConsumableArray2["default"])((0, util.filterNonNumber)(data)));
  })));
  return [minValue, maxValue];
}

function mergeStackData(series) {
  var seriesCloned = (0, util$1.deepClone)(series, true);
  series.forEach(function (item, i) {
    var data = (0, util.mergeSameStackData)(item, series);
    seriesCloned[i].data = data;
  });
  return seriesCloned;
}

function getTrueMinMax(_ref11, _ref12) {
  var min = _ref11.min,
      max = _ref11.max,
      axis = _ref11.axis;

  var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
      minValue = _ref13[0],
      maxValue = _ref13[1];

  var minType = (0, _typeof2["default"])(min),
      maxType = (0, _typeof2["default"])(max);

  if (!testMinMaxType(min)) {
    min = axisConfig[axis + 'AxisConfig'].min;
    minType = 'string';
  }

  if (!testMinMaxType(max)) {
    max = axisConfig[axis + 'AxisConfig'].max;
    maxType = 'string';
  }

  if (minType === 'string') {
    min = parseInt(minValue - abs(minValue * parseFloat(min) / 100));
    var lever = getValueLever(min);
    min = parseFloat((min / lever - 0.1).toFixed(1)) * lever;
  }

  if (maxType === 'string') {
    max = parseInt(maxValue + abs(maxValue * parseFloat(max) / 100));

    var _lever = getValueLever(max);

    max = parseFloat((max / _lever + 0.1).toFixed(1)) * _lever;
  }

  return [min, max];
}

function getValueLever(value) {
  var valueString = abs(value).toString();
  var valueLength = valueString.length;
  var firstZeroIndex = valueString.replace(/0*$/g, '').indexOf('0');
  var pow10Num = valueLength - 1;
  if (firstZeroIndex !== -1) pow10Num -= firstZeroIndex;
  return pow(10, pow10Num);
}

function testMinMaxType(val) {
  var valType = (0, _typeof2["default"])(val);
  var isValidString = valType === 'string' && /^\d+%$/.test(val);
  var isValidNumber = valType === 'number';
  return isValidString || isValidNumber;
}

function getValueAxisLabelFromZero(min, max, interval) {
  var negative = [],
      positive = [];
  var currentNegative = 0,
      currentPositive = 0;

  do {
    negative.push(currentNegative -= interval);
  } while (currentNegative > min);

  do {
    positive.push(currentPositive += interval);
  } while (currentPositive < max);

  return [].concat((0, _toConsumableArray2["default"])(negative.reverse()), [0], (0, _toConsumableArray2["default"])(positive));
}

function getValueAxisLabelFromMin(min, max, interval) {
  var label = [min],
      currentValue = min;

  do {
    label.push(currentValue += interval);
  } while (currentValue < max);

  return label;
}

function getAfterFormatterLabel(label, formatter) {
  if (!formatter) return label;
  if (typeof formatter === 'string') label = label.map(function (l) {
    return formatter.replace('{value}', l);
  });
  if (typeof formatter === 'function') label = label.map(function (value, index) {
    return formatter({
      value: value,
      index: index
    });
  });
  return label;
}

function calcLabelAxisLabelData(labelAxis) {
  return labelAxis.map(function (axis) {
    var data = axis.data,
        formatter = axis.axisLabel.formatter;
    return _objectSpread(_objectSpread({}, axis), {}, {
      label: getAfterFormatterLabel(data, formatter)
    });
  });
}

function getValueInterval(min, max, axis) {
  var interval = axis.interval,
      minInterval = axis.minInterval,
      maxInterval = axis.maxInterval,
      splitNumber = axis.splitNumber,
      axisType = axis.axis;
  var config = axisConfig[axisType + 'AxisConfig'];
  if (typeof interval !== 'number') interval = config.interval;
  if (typeof minInterval !== 'number') minInterval = config.minInterval;
  if (typeof maxInterval !== 'number') maxInterval = config.maxInterval;
  if (typeof splitNumber !== 'number') splitNumber = config.splitNumber;
  if (typeof interval === 'number') return interval;
  var valueInterval = parseInt((max - min) / (splitNumber - 1));
  if (valueInterval.toString().length > 1) valueInterval = parseInt(valueInterval.toString().replace(/\d$/, '0'));
  if (valueInterval === 0) valueInterval = 1;
  if (typeof minInterval === 'number' && valueInterval < minInterval) return minInterval;
  if (typeof maxInterval === 'number' && valueInterval > maxInterval) return maxInterval;
  return valueInterval;
}

function setAxisPosition(allAxis) {
  var xAxis = allAxis.filter(function (_ref14) {
    var axis = _ref14.axis;
    return axis === 'x';
  });
  var yAxis = allAxis.filter(function (_ref15) {
    var axis = _ref15.axis;
    return axis === 'y';
  });
  if (xAxis[0] && !xAxis[0].position) xAxis[0].position = config.xAxisConfig.position;

  if (xAxis[1] && !xAxis[1].position) {
    xAxis[1].position = xAxis[0].position === 'bottom' ? 'top' : 'bottom';
  }

  if (yAxis[0] && !yAxis[0].position) yAxis[0].position = config.yAxisConfig.position;

  if (yAxis[1] && !yAxis[1].position) {
    yAxis[1].position = yAxis[0].position === 'left' ? 'right' : 'left';
  }

  return [].concat((0, _toConsumableArray2["default"])(xAxis), (0, _toConsumableArray2["default"])(yAxis));
}

function calcAxisLinePosition(allAxis, chart) {
  var _chart$gridArea = chart.gridArea,
      x = _chart$gridArea.x,
      y = _chart$gridArea.y,
      w = _chart$gridArea.w,
      h = _chart$gridArea.h;
  allAxis = allAxis.map(function (axis) {
    var position = axis.position;
    var linePosition = [];

    if (position === 'left') {
      linePosition = [[x, y], [x, y + h]].reverse();
    } else if (position === 'right') {
      linePosition = [[x + w, y], [x + w, y + h]].reverse();
    } else if (position === 'top') {
      linePosition = [[x, y], [x + w, y]];
    } else if (position === 'bottom') {
      linePosition = [[x, y + h], [x + w, y + h]];
    }

    return _objectSpread(_objectSpread({}, axis), {}, {
      linePosition: linePosition
    });
  });
  return allAxis;
}

function calcAxisTickPosition(allAxis, chart) {
  return allAxis.map(function (axisItem) {
    var axis = axisItem.axis,
        linePosition = axisItem.linePosition,
        position = axisItem.position,
        label = axisItem.label,
        boundaryGap = axisItem.boundaryGap;
    if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axis + 'AxisConfig'].boundaryGap;
    var labelNum = label.length;

    var _linePosition = (0, _slicedToArray2["default"])(linePosition, 2),
        _linePosition$ = (0, _slicedToArray2["default"])(_linePosition[0], 2),
        startX = _linePosition$[0],
        startY = _linePosition$[1],
        _linePosition$2 = (0, _slicedToArray2["default"])(_linePosition[1], 2),
        endX = _linePosition$2[0],
        endY = _linePosition$2[1];

    var gapLength = axis === 'x' ? endX - startX : endY - startY;
    var gap = gapLength / (boundaryGap ? labelNum : labelNum - 1);
    var tickPosition = new Array(labelNum).fill(0).map(function (foo, i) {
      if (axis === 'x') {
        return [startX + gap * (boundaryGap ? i + 0.5 : i), startY];
      }

      return [startX, startY + gap * (boundaryGap ? i + 0.5 : i)];
    });
    var tickLinePosition = getTickLinePosition(axis, boundaryGap, position, tickPosition, gap);
    return _objectSpread(_objectSpread({}, axisItem), {}, {
      tickPosition: tickPosition,
      tickLinePosition: tickLinePosition,
      tickGap: gap
    });
  });
}

function getTickLinePosition(axisType, boundaryGap, position, tickPosition, gap) {
  var index = axisType === 'x' ? 1 : 0;
  var plus = 5;
  if (axisType === 'x' && position === 'top') plus = -5;
  if (axisType === 'y' && position === 'left') plus = -5;
  var tickLinePosition = tickPosition.map(function (lineStart) {
    var lineEnd = (0, util$1.deepClone)(lineStart);
    lineEnd[index] += plus;
    return [(0, util$1.deepClone)(lineStart), lineEnd];
  });
  if (!boundaryGap) return tickLinePosition;
  index = axisType === 'x' ? 0 : 1;
  plus = gap / 2;
  tickLinePosition.forEach(function (_ref16) {
    var _ref17 = (0, _slicedToArray2["default"])(_ref16, 2),
        lineStart = _ref17[0],
        lineEnd = _ref17[1];

    lineStart[index] += plus;
    lineEnd[index] += plus;
  });
  return tickLinePosition;
}

function calcAxisNamePosition(allAxis, chart) {
  return allAxis.map(function (axisItem) {
    var nameGap = axisItem.nameGap,
        nameLocation = axisItem.nameLocation,
        position = axisItem.position,
        linePosition = axisItem.linePosition;

    var _linePosition2 = (0, _slicedToArray2["default"])(linePosition, 2),
        lineStart = _linePosition2[0],
        lineEnd = _linePosition2[1];

    var namePosition = (0, _toConsumableArray2["default"])(lineStart);
    if (nameLocation === 'end') namePosition = (0, _toConsumableArray2["default"])(lineEnd);

    if (nameLocation === 'center') {
      namePosition[0] = (lineStart[0] + lineEnd[0]) / 2;
      namePosition[1] = (lineStart[1] + lineEnd[1]) / 2;
    }

    var index = 0;
    if (position === 'top' && nameLocation === 'center') index = 1;
    if (position === 'bottom' && nameLocation === 'center') index = 1;
    if (position === 'left' && nameLocation !== 'center') index = 1;
    if (position === 'right' && nameLocation !== 'center') index = 1;
    var plus = nameGap;
    if (position === 'top' && nameLocation !== 'end') plus *= -1;
    if (position === 'left' && nameLocation !== 'start') plus *= -1;
    if (position === 'bottom' && nameLocation === 'start') plus *= -1;
    if (position === 'right' && nameLocation === 'end') plus *= -1;
    namePosition[index] += plus;
    return _objectSpread(_objectSpread({}, axisItem), {}, {
      namePosition: namePosition
    });
  });
}

function calcSplitLinePosition(allAxis, chart) {
  var _chart$gridArea2 = chart.gridArea,
      w = _chart$gridArea2.w,
      h = _chart$gridArea2.h;
  return allAxis.map(function (axisItem) {
    var tickLinePosition = axisItem.tickLinePosition,
        position = axisItem.position,
        boundaryGap = axisItem.boundaryGap;
    var index = 0,
        plus = w;
    if (position === 'top' || position === 'bottom') index = 1;
    if (position === 'top' || position === 'bottom') plus = h;
    if (position === 'right' || position === 'bottom') plus *= -1;
    var splitLinePosition = tickLinePosition.map(function (_ref18) {
      var _ref19 = (0, _slicedToArray2["default"])(_ref18, 1),
          startPoint = _ref19[0];

      var endPoint = (0, _toConsumableArray2["default"])(startPoint);
      endPoint[index] += plus;
      return [(0, _toConsumableArray2["default"])(startPoint), endPoint];
    });
    if (!boundaryGap) splitLinePosition.shift();
    return _objectSpread(_objectSpread({}, axisItem), {}, {
      splitLinePosition: splitLinePosition
    });
  });
}

function getLineConfig(axisItem) {
  var animationCurve = axisItem.animationCurve,
      animationFrame = axisItem.animationFrame,
      rLevel = axisItem.rLevel;
  return [{
    name: 'polyline',
    index: rLevel,
    visible: axisItem.axisLine.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getLineShape(axisItem),
    style: getLineStyle(axisItem)
  }];
}

function getLineShape(axisItem) {
  var linePosition = axisItem.linePosition;
  return {
    points: linePosition
  };
}

function getLineStyle(axisItem) {
  return axisItem.axisLine.style;
}

function getTickConfig(axisItem) {
  var animationCurve = axisItem.animationCurve,
      animationFrame = axisItem.animationFrame,
      rLevel = axisItem.rLevel;
  var shapes = getTickShapes(axisItem);
  var style = getTickStyle(axisItem);
  return shapes.map(function (shape) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: axisItem.axisTick.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getTickShapes(axisItem) {
  var tickLinePosition = axisItem.tickLinePosition;
  return tickLinePosition.map(function (points) {
    return {
      points: points
    };
  });
}

function getTickStyle(axisItem) {
  return axisItem.axisTick.style;
}

function getLabelConfig(axisItem) {
  var animationCurve = axisItem.animationCurve,
      animationFrame = axisItem.animationFrame,
      rLevel = axisItem.rLevel;
  var shapes = getLabelShapes(axisItem);
  var styles = getLabelStyle(axisItem, shapes);
  return shapes.map(function (shape, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: axisItem.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: styles[i],
      setGraphCenter: function setGraphCenter() {
        return void 0;
      }
    };
  });
}

function getLabelShapes(axisItem) {
  var label = axisItem.label,
      tickPosition = axisItem.tickPosition,
      position = axisItem.position;
  return tickPosition.map(function (point, i) {
    return {
      position: getLabelRealPosition(point, position),
      content: label[i].toString()
    };
  });
}

function getLabelRealPosition(points, position) {
  var index = 0,
      plus = 10;
  if (position === 'top' || position === 'bottom') index = 1;
  if (position === 'top' || position === 'left') plus = -10;
  points = (0, util$1.deepClone)(points);
  points[index] += plus;
  return points;
}

function getLabelStyle(axisItem, shapes) {
  var position = axisItem.position;
  var style = axisItem.axisLabel.style;
  var align = getAxisLabelRealAlign(position);
  style = (0, util.deepMerge)(align, style);
  var styles = shapes.map(function (_ref20) {
    var position = _ref20.position;
    return _objectSpread(_objectSpread({}, style), {}, {
      graphCenter: position
    });
  });
  return styles;
}

function getAxisLabelRealAlign(position) {
  if (position === 'left') return {
    textAlign: 'right',
    textBaseline: 'middle'
  };
  if (position === 'right') return {
    textAlign: 'left',
    textBaseline: 'middle'
  };
  if (position === 'top') return {
    textAlign: 'center',
    textBaseline: 'bottom'
  };
  if (position === 'bottom') return {
    textAlign: 'center',
    textBaseline: 'top'
  };
}

function getNameConfig(axisItem) {
  var animationCurve = axisItem.animationCurve,
      animationFrame = axisItem.animationFrame,
      rLevel = axisItem.rLevel;
  return [{
    name: 'text',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getNameShape(axisItem),
    style: getNameStyle(axisItem)
  }];
}

function getNameShape(axisItem) {
  var name = axisItem.name,
      namePosition = axisItem.namePosition;
  return {
    content: name,
    position: namePosition
  };
}

function getNameStyle(axisItem) {
  var nameLocation = axisItem.nameLocation,
      position = axisItem.position,
      style = axisItem.nameTextStyle;
  var align = getNameRealAlign(position, nameLocation);
  return (0, util.deepMerge)(align, style);
}

function getNameRealAlign(position, location) {
  if (position === 'top' && location === 'start' || position === 'bottom' && location === 'start' || position === 'left' && location === 'center') return {
    textAlign: 'right',
    textBaseline: 'middle'
  };
  if (position === 'top' && location === 'end' || position === 'bottom' && location === 'end' || position === 'right' && location === 'center') return {
    textAlign: 'left',
    textBaseline: 'middle'
  };
  if (position === 'top' && location === 'center' || position === 'left' && location === 'end' || position === 'right' && location === 'end') return {
    textAlign: 'center',
    textBaseline: 'bottom'
  };
  if (position === 'bottom' && location === 'center' || position === 'left' && location === 'start' || position === 'right' && location === 'start') return {
    textAlign: 'center',
    textBaseline: 'top'
  };
}

function getSplitLineConfig(axisItem) {
  var animationCurve = axisItem.animationCurve,
      animationFrame = axisItem.animationFrame,
      rLevel = axisItem.rLevel;
  var shapes = getSplitLineShapes(axisItem);
  var style = getSplitLineStyle(axisItem);
  return shapes.map(function (shape) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: axisItem.splitLine.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getSplitLineShapes(axisItem) {
  var splitLinePosition = axisItem.splitLinePosition;
  return splitLinePosition.map(function (points) {
    return {
      points: points
    };
  });
}

function getSplitLineStyle(axisItem) {
  return axisItem.splitLine.style;
}
});

unwrapExports(axis_1);
axis_1.axis;

var line_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.line = line;

var _typeof2 = interopRequireDefault(_typeof_1);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

var _defineProperty2 = interopRequireDefault(defineProperty);





var _bezierCurve = interopRequireDefault(lib$3);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var polylineToBezierCurve = _bezierCurve["default"].polylineToBezierCurve,
    getBezierCurveLength = _bezierCurve["default"].getBezierCurveLength;

function line(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var xAxis = option.xAxis,
      yAxis = option.yAxis,
      series = option.series;
  var lines = [];

  if (xAxis && yAxis && series) {
    lines = (0, util.initNeedSeries)(series, config.lineConfig, 'line');
    lines = calcLinesPosition(lines, chart);
  }

  (0, updater_class.doUpdate)({
    chart: chart,
    series: lines,
    key: 'lineArea',
    getGraphConfig: getLineAreaConfig,
    getStartGraphConfig: getStartLineAreaConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: lines,
    key: 'line',
    getGraphConfig: getLineConfig,
    getStartGraphConfig: getStartLineConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: lines,
    key: 'linePoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: lines,
    key: 'lineLabel',
    getGraphConfig: getLabelConfig
  });
}

function calcLinesPosition(lines, chart) {
  var axisData = chart.axisData;
  return lines.map(function (lineItem) {
    var lineData = (0, util.mergeSameStackData)(lineItem, lines);
    lineData = mergeNonNumber(lineItem, lineData);
    var lineAxis = getLineAxis(lineItem, axisData);
    var linePosition = getLinePosition(lineData, lineAxis);
    var lineFillBottomPos = getLineFillBottomPos(lineAxis);
    return _objectSpread(_objectSpread({}, lineItem), {}, {
      linePosition: linePosition.filter(function (p) {
        return p;
      }),
      lineFillBottomPos: lineFillBottomPos
    });
  });
}

function mergeNonNumber(lineItem, lineData) {
  var data = lineItem.data;
  return lineData.map(function (v, i) {
    return typeof data[i] === 'number' ? v : null;
  });
}

function getLineAxis(line, axisData) {
  var xAxisIndex = line.xAxisIndex,
      yAxisIndex = line.yAxisIndex;
  var xAxis = axisData.find(function (_ref) {
    var axis = _ref.axis,
        index = _ref.index;
    return axis === 'x' && index === xAxisIndex;
  });
  var yAxis = axisData.find(function (_ref2) {
    var axis = _ref2.axis,
        index = _ref2.index;
    return axis === 'y' && index === yAxisIndex;
  });
  return [xAxis, yAxis];
}

function getLinePosition(lineData, lineAxis) {
  var valueAxisIndex = lineAxis.findIndex(function (_ref3) {
    var data = _ref3.data;
    return data === 'value';
  });
  var valueAxis = lineAxis[valueAxisIndex];
  var labelAxis = lineAxis[1 - valueAxisIndex];
  var linePosition = valueAxis.linePosition,
      axis = valueAxis.axis;
  var tickPosition = labelAxis.tickPosition;
  var tickNum = tickPosition.length;
  var valueAxisPosIndex = axis === 'x' ? 0 : 1;
  var valueAxisStartPos = linePosition[0][valueAxisPosIndex];
  var valueAxisEndPos = linePosition[1][valueAxisPosIndex];
  var valueAxisPosMinus = valueAxisEndPos - valueAxisStartPos;
  var maxValue = valueAxis.maxValue,
      minValue = valueAxis.minValue;
  var valueMinus = maxValue - minValue;
  var position = new Array(tickNum).fill(0).map(function (foo, i) {
    var v = lineData[i];
    if (typeof v !== 'number') return null;
    var valuePercent = (v - minValue) / valueMinus;
    if (valueMinus === 0) valuePercent = 0;
    return valuePercent * valueAxisPosMinus + valueAxisStartPos;
  });
  return position.map(function (vPos, i) {
    if (i >= tickNum || typeof vPos !== 'number') return null;
    var pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]];
    if (valueAxisPosIndex === 0) return pos;
    pos.reverse();
    return pos;
  });
}

function getLineFillBottomPos(lineAxis) {
  var valueAxis = lineAxis.find(function (_ref4) {
    var data = _ref4.data;
    return data === 'value';
  });
  var axis = valueAxis.axis,
      linePosition = valueAxis.linePosition,
      minValue = valueAxis.minValue,
      maxValue = valueAxis.maxValue;
  var changeIndex = axis === 'x' ? 0 : 1;
  var changeValue = linePosition[0][changeIndex];

  if (minValue < 0 && maxValue > 0) {
    var valueMinus = maxValue - minValue;
    var posMinus = Math.abs(linePosition[0][changeIndex] - linePosition[1][changeIndex]);
    var offset = Math.abs(minValue) / valueMinus * posMinus;
    if (axis === 'y') offset *= -1;
    changeValue += offset;
  }

  return {
    changeIndex: changeIndex,
    changeValue: changeValue
  };
}

function getLineAreaConfig(lineItem) {
  var animationCurve = lineItem.animationCurve,
      animationFrame = lineItem.animationFrame,
      lineFillBottomPos = lineItem.lineFillBottomPos,
      rLevel = lineItem.rLevel;
  return [{
    name: getLineGraphName(lineItem),
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    visible: lineItem.lineArea.show,
    lineFillBottomPos: lineFillBottomPos,
    shape: getLineAndAreaShape(lineItem),
    style: getLineAreaStyle(lineItem),
    drawed: lineAreaDrawed
  }];
}

function getLineAndAreaShape(lineItem) {
  var linePosition = lineItem.linePosition;
  return {
    points: linePosition
  };
}

function getLineAreaStyle(lineItem) {
  var lineArea = lineItem.lineArea,
      color = lineItem.color;
  var gradient = lineArea.gradient,
      style = lineArea.style;
  var fillColor = [style.fill || color];
  var gradientColor = (0, util.deepMerge)(fillColor, gradient);
  if (gradientColor.length === 1) gradientColor.push(gradientColor[0]);
  var gradientParams = getGradientParams(lineItem);
  style = _objectSpread(_objectSpread({}, style), {}, {
    stroke: 'rgba(0, 0, 0, 0)'
  });
  return (0, util.deepMerge)({
    gradientColor: gradientColor,
    gradientParams: gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill'
  }, style);
}

function getGradientParams(lineItem) {
  var lineFillBottomPos = lineItem.lineFillBottomPos,
      linePosition = lineItem.linePosition;
  var changeIndex = lineFillBottomPos.changeIndex,
      changeValue = lineFillBottomPos.changeValue;
  var mainPos = linePosition.map(function (p) {
    return p[changeIndex];
  });
  var maxPos = Math.max.apply(Math, (0, _toConsumableArray2["default"])(mainPos));
  var minPos = Math.min.apply(Math, (0, _toConsumableArray2["default"])(mainPos));
  var beginPos = maxPos;
  if (changeIndex === 1) beginPos = minPos;

  if (changeIndex === 1) {
    return [0, beginPos, 0, changeValue];
  } else {
    return [beginPos, 0, changeValue, 0];
  }
}

function lineAreaDrawed(_ref5, _ref6) {
  var lineFillBottomPos = _ref5.lineFillBottomPos,
      shape = _ref5.shape;
  var ctx = _ref6.ctx;
  var points = shape.points;
  var changeIndex = lineFillBottomPos.changeIndex,
      changeValue = lineFillBottomPos.changeValue;
  var linePoint1 = (0, _toConsumableArray2["default"])(points[points.length - 1]);
  var linePoint2 = (0, _toConsumableArray2["default"])(points[0]);
  linePoint1[changeIndex] = changeValue;
  linePoint2[changeIndex] = changeValue;
  ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(linePoint1));
  ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(linePoint2));
  ctx.closePath();
  ctx.fill();
}

function getStartLineAreaConfig(lineItem) {
  var config = getLineAreaConfig(lineItem)[0];

  var style = _objectSpread({}, config.style);

  style.opacity = 0;
  config.style = style;
  return [config];
}

function beforeUpdateLineAndArea(graphs, lineItem, i, updater) {
  var cache = graphs[i];
  if (!cache) return;
  var currentName = getLineGraphName(lineItem);
  var render = updater.chart.render;
  var name = cache[0].name;
  var delAll = currentName !== name;
  if (!delAll) return;
  cache.forEach(function (g) {
    return render.delGraph(g);
  });
  graphs[i] = null;
}

function beforeChangeLineAndArea(graph, config) {
  var points = config.shape.points;
  var graphPoints = graph.shape.points;
  var graphPointsNum = graphPoints.length;
  var pointsNum = points.length;

  if (pointsNum > graphPointsNum) {
    var lastPoint = graphPoints.slice(-1)[0];
    var newAddPoints = new Array(pointsNum - graphPointsNum).fill(0).map(function (foo) {
      return (0, _toConsumableArray2["default"])(lastPoint);
    });
    graphPoints.push.apply(graphPoints, (0, _toConsumableArray2["default"])(newAddPoints));
  } else if (pointsNum < graphPointsNum) {
    graphPoints.splice(pointsNum);
  }
}

function getLineConfig(lineItem) {
  var animationCurve = lineItem.animationCurve,
      animationFrame = lineItem.animationFrame,
      rLevel = lineItem.rLevel;
  return [{
    name: getLineGraphName(lineItem),
    index: rLevel + 1,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getLineAndAreaShape(lineItem),
    style: getLineStyle(lineItem)
  }];
}

function getLineGraphName(lineItem) {
  var smooth = lineItem.smooth;
  return smooth ? 'smoothline' : 'polyline';
}

function getLineStyle(lineItem) {
  var lineStyle = lineItem.lineStyle,
      color = lineItem.color,
      smooth = lineItem.smooth,
      linePosition = lineItem.linePosition;
  var lineLength = getLineLength(linePosition, smooth);
  return (0, util.deepMerge)({
    stroke: color,
    lineDash: [lineLength, 0]
  }, lineStyle);
}

function getLineLength(points) {
  var smooth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!smooth) return (0, util.getPolylineLength)(points);
  var curve = polylineToBezierCurve(points);
  return getBezierCurveLength(curve);
}

function getStartLineConfig(lineItem) {
  var lineDash = lineItem.lineStyle.lineDash;
  var config = getLineConfig(lineItem)[0];
  var realLineDash = config.style.lineDash;

  if (lineDash) {
    realLineDash = [0, 0];
  } else {
    realLineDash = (0, _toConsumableArray2["default"])(realLineDash).reverse();
  }

  config.style.lineDash = realLineDash;
  return [config];
}

function getPointConfig(lineItem) {
  var animationCurve = lineItem.animationCurve,
      animationFrame = lineItem.animationFrame,
      rLevel = lineItem.rLevel;
  var shapes = getPointShapes(lineItem);
  var style = getPointStyle(lineItem);
  return shapes.map(function (shape) {
    return {
      name: 'circle',
      index: rLevel + 2,
      visible: lineItem.linePoint.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getPointShapes(lineItem) {
  var linePosition = lineItem.linePosition,
      radius = lineItem.linePoint.radius;
  return linePosition.map(function (_ref7) {
    var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
        rx = _ref8[0],
        ry = _ref8[1];

    return {
      r: radius,
      rx: rx,
      ry: ry
    };
  });
}

function getPointStyle(lineItem) {
  var color = lineItem.color,
      style = lineItem.linePoint.style;
  return (0, util.deepMerge)({
    stroke: color
  }, style);
}

function getStartPointConfig(lineItem) {
  var configs = getPointConfig(lineItem);
  configs.forEach(function (config) {
    config.shape.r = 0.1;
  });
  return configs;
}

function getLabelConfig(lineItem) {
  var animationCurve = lineItem.animationCurve,
      animationFrame = lineItem.animationFrame,
      rLevel = lineItem.rLevel;
  var shapes = getLabelShapes(lineItem);
  var style = getLabelStyle(lineItem);
  return shapes.map(function (shape, i) {
    return {
      name: 'text',
      index: rLevel + 3,
      visible: lineItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getLabelShapes(lineItem) {
  var contents = formatterLabel(lineItem);
  var position = getLabelPosition(lineItem);
  return contents.map(function (content, i) {
    return {
      content: content,
      position: position[i]
    };
  });
}

function getLabelPosition(lineItem) {
  var linePosition = lineItem.linePosition,
      lineFillBottomPos = lineItem.lineFillBottomPos,
      label = lineItem.label;
  var position = label.position,
      offset = label.offset;
  var changeIndex = lineFillBottomPos.changeIndex,
      changeValue = lineFillBottomPos.changeValue;
  return linePosition.map(function (pos) {
    if (position === 'bottom') {
      pos = (0, _toConsumableArray2["default"])(pos);
      pos[changeIndex] = changeValue;
    }

    if (position === 'center') {
      var bottom = (0, _toConsumableArray2["default"])(pos);
      bottom[changeIndex] = changeValue;
      pos = getCenterLabelPoint(pos, bottom);
    }

    return getOffsetedPoint(pos, offset);
  });
}

function getOffsetedPoint(_ref9, _ref10) {
  var _ref11 = (0, _slicedToArray2["default"])(_ref9, 2),
      x = _ref11[0],
      y = _ref11[1];

  var _ref12 = (0, _slicedToArray2["default"])(_ref10, 2),
      ox = _ref12[0],
      oy = _ref12[1];

  return [x + ox, y + oy];
}

function getCenterLabelPoint(_ref13, _ref14) {
  var _ref15 = (0, _slicedToArray2["default"])(_ref13, 2),
      ax = _ref15[0],
      ay = _ref15[1];

  var _ref16 = (0, _slicedToArray2["default"])(_ref14, 2),
      bx = _ref16[0],
      by = _ref16[1];

  return [(ax + bx) / 2, (ay + by) / 2];
}

function formatterLabel(lineItem) {
  var data = lineItem.data,
      formatter = lineItem.label.formatter;
  data = data.filter(function (d) {
    return typeof d === 'number';
  }).map(function (d) {
    return d.toString();
  });
  if (!formatter) return data;
  var type = (0, _typeof2["default"])(formatter);
  if (type === 'string') return data.map(function (d) {
    return formatter.replace('{value}', d);
  });
  if (type === 'function') return data.map(function (value, index) {
    return formatter({
      value: value,
      index: index
    });
  });
  return data;
}

function getLabelStyle(lineItem) {
  var color = lineItem.color,
      style = lineItem.label.style;
  return (0, util.deepMerge)({
    fill: color
  }, style);
}
});

unwrapExports(line_1);
line_1.line;

var bar_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

var _typeof2 = interopRequireDefault(_typeof_1);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function bar(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var xAxis = option.xAxis,
      yAxis = option.yAxis,
      series = option.series;
  var bars = [];

  if (xAxis && yAxis && series) {
    bars = (0, util.initNeedSeries)(series, config.barConfig, 'bar');
    bars = setBarAxis(bars, chart);
    bars = setBarPositionData(bars);
    bars = calcBarsPosition(bars);
  }

  (0, updater_class.doUpdate)({
    chart: chart,
    series: bars.slice(-1),
    key: 'backgroundBar',
    getGraphConfig: getBackgroundBarConfig
  });
  bars.reverse();
  (0, updater_class.doUpdate)({
    chart: chart,
    series: bars,
    key: 'bar',
    getGraphConfig: getBarConfig,
    getStartGraphConfig: getStartBarConfig,
    beforeUpdate: beforeUpdateBar
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: bars,
    key: 'barLabel',
    getGraphConfig: getLabelConfig
  });
}

function setBarAxis(bars, chart) {
  var axisData = chart.axisData;
  bars.forEach(function (bar) {
    var xAxisIndex = bar.xAxisIndex,
        yAxisIndex = bar.yAxisIndex;
    if (typeof xAxisIndex !== 'number') xAxisIndex = 0;
    if (typeof yAxisIndex !== 'number') yAxisIndex = 0;
    var xAxis = axisData.find(function (_ref) {
      var axis = _ref.axis,
          index = _ref.index;
      return "".concat(axis).concat(index) === "x".concat(xAxisIndex);
    });
    var yAxis = axisData.find(function (_ref2) {
      var axis = _ref2.axis,
          index = _ref2.index;
      return "".concat(axis).concat(index) === "y".concat(yAxisIndex);
    });
    var axis = [xAxis, yAxis];
    var valueAxisIndex = axis.findIndex(function (_ref3) {
      var data = _ref3.data;
      return data === 'value';
    });
    bar.valueAxis = axis[valueAxisIndex];
    bar.labelAxis = axis[1 - valueAxisIndex];
  });
  return bars;
}

function setBarPositionData(bars, chart) {
  var labelBarGroup = groupBarByLabelAxis(bars);
  labelBarGroup.forEach(function (group) {
    setBarIndex(group);
    setBarNum(group);
    setBarCategoryWidth(group);
    setBarWidthAndGap(group);
    setBarAllWidthAndGap(group);
  });
  return bars;
}

function setBarIndex(bars) {
  var stacks = getBarStack(bars);
  stacks = stacks.map(function (stack) {
    return {
      stack: stack,
      index: -1
    };
  });
  var currentIndex = 0;
  bars.forEach(function (bar) {
    var stack = bar.stack;

    if (!stack) {
      bar.barIndex = currentIndex;
      currentIndex++;
    } else {
      var stackData = stacks.find(function (_ref4) {
        var s = _ref4.stack;
        return s === stack;
      });

      if (stackData.index === -1) {
        stackData.index = currentIndex;
        currentIndex++;
      }

      bar.barIndex = stackData.index;
    }
  });
}

function groupBarByLabelAxis(bars) {
  var labelAxis = bars.map(function (_ref5) {
    var _ref5$labelAxis = _ref5.labelAxis,
        axis = _ref5$labelAxis.axis,
        index = _ref5$labelAxis.index;
    return axis + index;
  });
  labelAxis = (0, _toConsumableArray2["default"])(new Set(labelAxis));
  return labelAxis.map(function (axisIndex) {
    return bars.filter(function (_ref6) {
      var _ref6$labelAxis = _ref6.labelAxis,
          axis = _ref6$labelAxis.axis,
          index = _ref6$labelAxis.index;
      return axis + index === axisIndex;
    });
  });
}

function getBarStack(bars) {
  var stacks = [];
  bars.forEach(function (_ref7) {
    var stack = _ref7.stack;
    if (stack) stacks.push(stack);
  });
  return (0, _toConsumableArray2["default"])(new Set(stacks));
}

function setBarNum(bars) {
  var barNum = (0, _toConsumableArray2["default"])(new Set(bars.map(function (_ref8) {
    var barIndex = _ref8.barIndex;
    return barIndex;
  }))).length;
  bars.forEach(function (bar) {
    return bar.barNum = barNum;
  });
}

function setBarCategoryWidth(bars) {
  var lastBar = bars.slice(-1)[0];
  var barCategoryGap = lastBar.barCategoryGap,
      tickGap = lastBar.labelAxis.tickGap;
  var barCategoryWidth = 0;

  if (typeof barCategoryGap === 'number') {
    barCategoryWidth = barCategoryGap;
  } else {
    barCategoryWidth = (1 - parseInt(barCategoryGap) / 100) * tickGap;
  }

  bars.forEach(function (bar) {
    return bar.barCategoryWidth = barCategoryWidth;
  });
}

function setBarWidthAndGap(bars) {
  var _bars$slice$ = bars.slice(-1)[0],
      barCategoryWidth = _bars$slice$.barCategoryWidth,
      barWidth = _bars$slice$.barWidth,
      barGap = _bars$slice$.barGap,
      barNum = _bars$slice$.barNum;
  var widthAndGap = [];

  if (typeof barWidth === 'number' || barWidth !== 'auto') {
    widthAndGap = getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap);
  } else if (barWidth === 'auto') {
    widthAndGap = getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum);
  }

  var _widthAndGap = widthAndGap,
      _widthAndGap2 = (0, _slicedToArray2["default"])(_widthAndGap, 2),
      width = _widthAndGap2[0],
      gap = _widthAndGap2[1];

  bars.forEach(function (bar) {
    bar.barWidth = width;
    bar.barGap = gap;
  });
}

function getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap) {
  var width = 0,
      gap = 0;

  if (typeof barWidth === 'number') {
    width = barWidth;
  } else {
    width = parseInt(barWidth) / 100 * barCategoryWidth;
  }

  if (typeof barGap === 'number') {
    gap = barGap;
  } else {
    gap = parseInt(barGap) / 100 * width;
  }

  return [width, gap];
}

function getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum) {
  var width = 0,
      gap = 0;
  var barItemWidth = barCategoryWidth / barNum;

  if (typeof barGap === 'number') {
    gap = barGap;
    width = barItemWidth - gap;
  } else {
    var percent = 10 + parseInt(barGap) / 10;

    if (percent === 0) {
      width = barItemWidth * 2;
      gap = -width;
    } else {
      width = barItemWidth / percent * 10;
      gap = barItemWidth - width;
    }
  }

  return [width, gap];
}

function setBarAllWidthAndGap(bars) {
  var _bars$slice$2 = bars.slice(-1)[0],
      barGap = _bars$slice$2.barGap,
      barWidth = _bars$slice$2.barWidth,
      barNum = _bars$slice$2.barNum;
  var barAllWidthAndGap = (barGap + barWidth) * barNum - barGap;
  bars.forEach(function (bar) {
    return bar.barAllWidthAndGap = barAllWidthAndGap;
  });
}

function calcBarsPosition(bars, chart) {
  bars = calcBarValueAxisCoordinate(bars);
  bars = calcBarLabelAxisCoordinate(bars);
  bars = eliminateNullBarLabelAxis(bars);
  bars = keepSameNumBetweenBarAndData(bars);
  return bars;
}

function calcBarLabelAxisCoordinate(bars) {
  return bars.map(function (bar) {
    var labelAxis = bar.labelAxis,
        barAllWidthAndGap = bar.barAllWidthAndGap,
        barGap = bar.barGap,
        barWidth = bar.barWidth,
        barIndex = bar.barIndex;
    var tickGap = labelAxis.tickGap,
        tickPosition = labelAxis.tickPosition,
        axis = labelAxis.axis;
    var coordinateIndex = axis === 'x' ? 0 : 1;
    var barLabelAxisPos = tickPosition.map(function (tick, i) {
      var barCategoryStartPos = tickPosition[i][coordinateIndex] - tickGap / 2;
      var barItemsStartPos = barCategoryStartPos + (tickGap - barAllWidthAndGap) / 2;
      return barItemsStartPos + (barIndex + 0.5) * barWidth + barIndex * barGap;
    });
    return _objectSpread(_objectSpread({}, bar), {}, {
      barLabelAxisPos: barLabelAxisPos
    });
  });
}

function calcBarValueAxisCoordinate(bars) {
  return bars.map(function (bar) {
    var data = (0, util.mergeSameStackData)(bar, bars);
    data = eliminateNonNumberData(bar, data);
    var _bar$valueAxis = bar.valueAxis,
        axis = _bar$valueAxis.axis,
        minValue = _bar$valueAxis.minValue,
        maxValue = _bar$valueAxis.maxValue,
        linePosition = _bar$valueAxis.linePosition;
    var startPos = getValuePos(minValue, maxValue, minValue < 0 ? 0 : minValue, linePosition, axis);
    var endPos = data.map(function (v) {
      return getValuePos(minValue, maxValue, v, linePosition, axis);
    });
    var barValueAxisPos = endPos.map(function (p) {
      return [startPos, p];
    });
    return _objectSpread(_objectSpread({}, bar), {}, {
      barValueAxisPos: barValueAxisPos
    });
  });
}

function eliminateNonNumberData(barItem, barData) {
  var data = barItem.data;
  return barData.map(function (v, i) {
    return typeof data[i] === 'number' ? v : null;
  }).filter(function (d) {
    return d !== null;
  });
}

function eliminateNullBarLabelAxis(bars) {
  return bars.map(function (bar) {
    var barLabelAxisPos = bar.barLabelAxisPos,
        data = bar.data;
    data.forEach(function (d, i) {
      if (typeof d === 'number') return;
      barLabelAxisPos[i] = null;
    });
    return _objectSpread(_objectSpread({}, bar), {}, {
      barLabelAxisPos: barLabelAxisPos.filter(function (p) {
        return p !== null;
      })
    });
  });
}

function keepSameNumBetweenBarAndData(bars) {
  bars.forEach(function (bar) {
    var data = bar.data,
        barLabelAxisPos = bar.barLabelAxisPos,
        barValueAxisPos = bar.barValueAxisPos;
    var dataNum = data.filter(function (d) {
      return typeof d === 'number';
    }).length;
    var axisPosNum = barLabelAxisPos.length;

    if (axisPosNum > dataNum) {
      barLabelAxisPos.splice(dataNum);
      barValueAxisPos.splice(dataNum);
    }
  });
  return bars;
}

function getValuePos(min, max, value, linePosition, axis) {
  if (typeof value !== 'number') return null;
  var valueMinus = max - min;
  var coordinateIndex = axis === 'x' ? 0 : 1;
  var posMinus = linePosition[1][coordinateIndex] - linePosition[0][coordinateIndex];
  var percent = (value - min) / valueMinus;
  if (valueMinus === 0) percent = 0;
  var pos = percent * posMinus;
  return pos + linePosition[0][coordinateIndex];
}

function getBackgroundBarConfig(barItem) {
  var animationCurve = barItem.animationCurve,
      animationFrame = barItem.animationFrame,
      rLevel = barItem.rLevel;
  var shapes = getBackgroundBarShapes(barItem);
  var style = getBackgroundBarStyle(barItem);
  return shapes.map(function (shape) {
    return {
      name: 'rect',
      index: rLevel,
      visible: barItem.backgroundBar.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getBackgroundBarShapes(barItem) {
  var labelAxis = barItem.labelAxis,
      valueAxis = barItem.valueAxis;
  var tickPosition = labelAxis.tickPosition;
  var axis = valueAxis.axis,
      linePosition = valueAxis.linePosition;
  var width = getBackgroundBarWidth(barItem);
  var haltWidth = width / 2;
  var posIndex = axis === 'x' ? 0 : 1;
  var centerPos = tickPosition.map(function (p) {
    return p[1 - posIndex];
  });
  var _ref9 = [linePosition[0][posIndex], linePosition[1][posIndex]],
      start = _ref9[0],
      end = _ref9[1];
  return centerPos.map(function (center) {
    if (axis === 'x') {
      return {
        x: start,
        y: center - haltWidth,
        w: end - start,
        h: width
      };
    } else {
      return {
        x: center - haltWidth,
        y: end,
        w: width,
        h: start - end
      };
    }
  });
}

function getBackgroundBarWidth(barItem) {
  var barAllWidthAndGap = barItem.barAllWidthAndGap,
      barCategoryWidth = barItem.barCategoryWidth,
      backgroundBar = barItem.backgroundBar;
  var width = backgroundBar.width;
  if (typeof width === 'number') return width;
  if (width === 'auto') return barAllWidthAndGap;
  return parseInt(width) / 100 * barCategoryWidth;
}

function getBackgroundBarStyle(barItem) {
  return barItem.backgroundBar.style;
}

function getBarConfig(barItem) {
  var barLabelAxisPos = barItem.barLabelAxisPos,
      animationCurve = barItem.animationCurve,
      animationFrame = barItem.animationFrame,
      rLevel = barItem.rLevel;
  var name = getBarName(barItem);
  return barLabelAxisPos.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getBarShape(barItem, i),
      style: getBarStyle(barItem, i)
    };
  });
}

function getBarName(barItem) {
  var shapeType = barItem.shapeType;
  if (shapeType === 'leftEchelon' || shapeType === 'rightEchelon') return 'polyline';
  return 'rect';
}

function getBarShape(barItem, i) {
  var shapeType = barItem.shapeType;

  if (shapeType === 'leftEchelon') {
    return getLeftEchelonShape(barItem, i);
  } else if (shapeType === 'rightEchelon') {
    return getRightEchelonShape(barItem, i);
  } else {
    return getNormalBarShape(barItem, i);
  }
}

function getLeftEchelonShape(barItem, i) {
  var barValueAxisPos = barItem.barValueAxisPos,
      barLabelAxisPos = barItem.barLabelAxisPos,
      barWidth = barItem.barWidth,
      echelonOffset = barItem.echelonOffset;

  var _barValueAxisPos$i = (0, _slicedToArray2["default"])(barValueAxisPos[i], 2),
      start = _barValueAxisPos$i[0],
      end = _barValueAxisPos$i[1];

  var labelAxisPos = barLabelAxisPos[i];
  var halfWidth = barWidth / 2;
  var valueAxis = barItem.valueAxis.axis;
  var points = [];

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos - halfWidth];
    points[1] = [end, labelAxisPos + halfWidth];
    points[2] = [start, labelAxisPos + halfWidth];
    points[3] = [start + echelonOffset, labelAxisPos - halfWidth];
    if (end - start < echelonOffset) points.splice(3, 1);
  } else {
    points[0] = [labelAxisPos - halfWidth, end];
    points[1] = [labelAxisPos + halfWidth, end];
    points[2] = [labelAxisPos + halfWidth, start];
    points[3] = [labelAxisPos - halfWidth, start - echelonOffset];
    if (start - end < echelonOffset) points.splice(3, 1);
  }

  return {
    points: points,
    close: true
  };
}

function getRightEchelonShape(barItem, i) {
  var barValueAxisPos = barItem.barValueAxisPos,
      barLabelAxisPos = barItem.barLabelAxisPos,
      barWidth = barItem.barWidth,
      echelonOffset = barItem.echelonOffset;

  var _barValueAxisPos$i2 = (0, _slicedToArray2["default"])(barValueAxisPos[i], 2),
      start = _barValueAxisPos$i2[0],
      end = _barValueAxisPos$i2[1];

  var labelAxisPos = barLabelAxisPos[i];
  var halfWidth = barWidth / 2;
  var valueAxis = barItem.valueAxis.axis;
  var points = [];

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos + halfWidth];
    points[1] = [end, labelAxisPos - halfWidth];
    points[2] = [start, labelAxisPos - halfWidth];
    points[3] = [start + echelonOffset, labelAxisPos + halfWidth];
    if (end - start < echelonOffset) points.splice(2, 1);
  } else {
    points[0] = [labelAxisPos + halfWidth, end];
    points[1] = [labelAxisPos - halfWidth, end];
    points[2] = [labelAxisPos - halfWidth, start];
    points[3] = [labelAxisPos + halfWidth, start - echelonOffset];
    if (start - end < echelonOffset) points.splice(2, 1);
  }

  return {
    points: points,
    close: true
  };
}

function getNormalBarShape(barItem, i) {
  var barValueAxisPos = barItem.barValueAxisPos,
      barLabelAxisPos = barItem.barLabelAxisPos,
      barWidth = barItem.barWidth;

  var _barValueAxisPos$i3 = (0, _slicedToArray2["default"])(barValueAxisPos[i], 2),
      start = _barValueAxisPos$i3[0],
      end = _barValueAxisPos$i3[1];

  var labelAxisPos = barLabelAxisPos[i];
  var valueAxis = barItem.valueAxis.axis;
  var shape = {};

  if (valueAxis === 'x') {
    shape.x = start;
    shape.y = labelAxisPos - barWidth / 2;
    shape.w = end - start;
    shape.h = barWidth;
  } else {
    shape.x = labelAxisPos - barWidth / 2;
    shape.y = end;
    shape.w = barWidth;
    shape.h = start - end;
  }

  return shape;
}

function getBarStyle(barItem, i) {
  var barStyle = barItem.barStyle,
      gradient = barItem.gradient,
      color = barItem.color,
      independentColor = barItem.independentColor,
      independentColors = barItem.independentColors;
  var fillColor = [barStyle.fill || color];
  var gradientColor = (0, util.deepMerge)(fillColor, gradient.color);

  if (independentColor) {
    var idtColor = independentColors[i % independentColors.length];
    gradientColor = idtColor instanceof Array ? idtColor : [idtColor];
  }

  if (gradientColor.length === 1) gradientColor.push(gradientColor[0]);
  var gradientParams = getGradientParams(barItem, i);
  return (0, util.deepMerge)({
    gradientColor: gradientColor,
    gradientParams: gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill'
  }, barStyle);
}

function getGradientParams(barItem, i) {
  var barValueAxisPos = barItem.barValueAxisPos,
      barLabelAxisPos = barItem.barLabelAxisPos,
      data = barItem.data;
  var _barItem$valueAxis = barItem.valueAxis,
      linePosition = _barItem$valueAxis.linePosition,
      axis = _barItem$valueAxis.axis;

  var _barValueAxisPos$i4 = (0, _slicedToArray2["default"])(barValueAxisPos[i], 2),
      start = _barValueAxisPos$i4[0],
      end = _barValueAxisPos$i4[1];

  var labelAxisPos = barLabelAxisPos[i];
  var value = data[i];

  var _linePosition = (0, _slicedToArray2["default"])(linePosition, 2),
      lineStart = _linePosition[0],
      lineEnd = _linePosition[1];

  var valueAxisIndex = axis === 'x' ? 0 : 1;
  var endPos = end;

  if (!barItem.gradient.local) {
    endPos = value < 0 ? lineStart[valueAxisIndex] : lineEnd[valueAxisIndex];
  }

  if (axis === 'y') {
    return [labelAxisPos, endPos, labelAxisPos, start];
  } else {
    return [endPos, labelAxisPos, start, labelAxisPos];
  }
}

function getStartBarConfig(barItem) {
  var configs = getBarConfig(barItem);
  var shapeType = barItem.shapeType;
  configs.forEach(function (config) {
    var shape = config.shape;

    if (shapeType === 'leftEchelon') {
      shape = getStartLeftEchelonShape(shape, barItem);
    } else if (shapeType === 'rightEchelon') {
      shape = getStartRightEchelonShape(shape, barItem);
    } else {
      shape = getStartNormalBarShape(shape, barItem);
    }

    config.shape = shape;
  });
  return configs;
}

function getStartLeftEchelonShape(shape, barItem) {
  var axis = barItem.valueAxis.axis;
  shape = (0, util$1.deepClone)(shape);
  var _shape = shape,
      points = _shape.points;
  var index = axis === 'x' ? 0 : 1;
  var start = points[2][index];
  points.forEach(function (point) {
    return point[index] = start;
  });
  return shape;
}

function getStartRightEchelonShape(shape, barItem) {
  var axis = barItem.valueAxis.axis;
  shape = (0, util$1.deepClone)(shape);
  var _shape2 = shape,
      points = _shape2.points;
  var index = axis === 'x' ? 0 : 1;
  var start = points[2][index];
  points.forEach(function (point) {
    return point[index] = start;
  });
  return shape;
}

function getStartNormalBarShape(shape, barItem) {
  var axis = barItem.valueAxis.axis;
  var x = shape.x,
      y = shape.y,
      w = shape.w,
      h = shape.h;

  if (axis === 'x') {
    w = 0;
  } else {
    y = y + h;
    h = 0;
  }

  return {
    x: x,
    y: y,
    w: w,
    h: h
  };
}

function beforeUpdateBar(graphs, barItem, i, updater) {
  var render = updater.chart.render;
  var name = getBarName(barItem);

  if (graphs[i] && graphs[i][0].name !== name) {
    graphs[i].forEach(function (g) {
      return render.delGraph(g);
    });
    graphs[i] = null;
  }
}

function getLabelConfig(barItem) {
  var animationCurve = barItem.animationCurve,
      animationFrame = barItem.animationFrame,
      rLevel = barItem.rLevel;
  var shapes = getLabelShapes(barItem);
  var style = getLabelStyle(barItem);
  return shapes.map(function (shape) {
    return {
      name: 'text',
      index: rLevel,
      visible: barItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    };
  });
}

function getLabelShapes(barItem) {
  var contents = getFormatterLabels(barItem);
  var position = getLabelsPosition(barItem);
  return position.map(function (pos, i) {
    return {
      position: pos,
      content: contents[i]
    };
  });
}

function getFormatterLabels(barItem) {
  var data = barItem.data,
      label = barItem.label;
  var formatter = label.formatter;
  data = data.filter(function (d) {
    return typeof d === 'number';
  }).map(function (d) {
    return d.toString();
  });
  if (!formatter) return data;
  var type = (0, _typeof2["default"])(formatter);
  if (type === 'string') return data.map(function (d) {
    return formatter.replace('{value}', d);
  });
  if (type === 'function') return data.map(function (d, i) {
    return formatter({
      value: d,
      index: i
    });
  });
  return data;
}

function getLabelsPosition(barItem) {
  var label = barItem.label,
      barValueAxisPos = barItem.barValueAxisPos,
      barLabelAxisPos = barItem.barLabelAxisPos;
  var position = label.position,
      offset = label.offset;
  var axis = barItem.valueAxis.axis;
  return barValueAxisPos.map(function (_ref10, i) {
    var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
        start = _ref11[0],
        end = _ref11[1];

    var labelAxisPos = barLabelAxisPos[i];
    var pos = [end, labelAxisPos];

    if (position === 'bottom') {
      pos = [start, labelAxisPos];
    }

    if (position === 'center') {
      pos = [(start + end) / 2, labelAxisPos];
    }

    if (axis === 'y') pos.reverse();
    return getOffsetedPoint(pos, offset);
  });
}

function getOffsetedPoint(_ref12, _ref13) {
  var _ref14 = (0, _slicedToArray2["default"])(_ref12, 2),
      x = _ref14[0],
      y = _ref14[1];

  var _ref15 = (0, _slicedToArray2["default"])(_ref13, 2),
      ox = _ref15[0],
      oy = _ref15[1];

  return [x + ox, y + oy];
}

function getLabelStyle(barItem) {
  var color = barItem.color,
      style = barItem.label.style,
      gc = barItem.gradient.color;
  if (gc.length) color = gc[0];
  style = (0, util.deepMerge)({
    fill: color
  }, style);
  return style;
}
});

unwrapExports(bar_1);
bar_1.bar;

var pie_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pie = pie$1;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _typeof2 = interopRequireDefault(_typeof_1);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function pie$1(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var series = option.series;
  if (!series) series = [];
  var pies = (0, util.initNeedSeries)(series, pie.pieConfig, 'pie');
  pies = calcPiesCenter(pies, chart);
  pies = calcPiesRadius(pies, chart);
  pies = calcRosePiesRadius(pies);
  pies = calcPiesPercent(pies);
  pies = calcPiesAngle(pies);
  pies = calcPiesInsideLabelPos(pies);
  pies = calcPiesEdgeCenterPos(pies);
  pies = calcPiesOutSideLabelPos(pies);
  (0, updater_class.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pie',
    getGraphConfig: getPieConfig,
    getStartGraphConfig: getStartPieConfig,
    beforeChange: beforeChangePie
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieInsideLabel',
    getGraphConfig: getInsideLabelConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieOutsideLabelLine',
    getGraphConfig: getOutsideLabelLineConfig,
    getStartGraphConfig: getStartOutsideLabelLineConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieOutsideLabel',
    getGraphConfig: getOutsideLabelConfig,
    getStartGraphConfig: getStartOutsideLabelConfig
  });
}

function calcPiesCenter(pies, chart) {
  var area = chart.render.area;
  pies.forEach(function (pie) {
    var center = pie.center;
    center = center.map(function (pos, i) {
      if (typeof pos === 'number') return pos;
      return parseInt(pos) / 100 * area[i];
    });
    pie.center = center;
  });
  return pies;
}

function calcPiesRadius(pies, chart) {
  var maxRadius = Math.min.apply(Math, (0, _toConsumableArray2["default"])(chart.render.area)) / 2;
  pies.forEach(function (pie) {
    var radius = pie.radius,
        data = pie.data;
    radius = getNumberRadius(radius, maxRadius);
    data.forEach(function (item) {
      var itemRadius = item.radius;
      if (!itemRadius) itemRadius = radius;
      itemRadius = getNumberRadius(itemRadius, maxRadius);
      item.radius = itemRadius;
    });
    pie.radius = radius;
  });
  return pies;
}

function getNumberRadius(radius, maxRadius) {
  if (!(radius instanceof Array)) radius = [0, radius];
  radius = radius.map(function (r) {
    if (typeof r === 'number') return r;
    return parseInt(r) / 100 * maxRadius;
  });
  return radius;
}

function calcRosePiesRadius(pies, chart) {
  var rosePie = pies.filter(function (_ref) {
    var roseType = _ref.roseType;
    return roseType;
  });
  rosePie.forEach(function (pie) {
    var radius = pie.radius,
        data = pie.data,
        roseSort = pie.roseSort;
    var roseIncrement = getRoseIncrement(pie);
    var dataCopy = (0, _toConsumableArray2["default"])(data);
    data = sortData(data);
    data.forEach(function (item, i) {
      item.radius[1] = radius[1] - roseIncrement * i;
    });

    if (roseSort) {
      data.reverse();
    } else {
      pie.data = dataCopy;
    }

    pie.roseIncrement = roseIncrement;
  });
  return pies;
}

function sortData(data) {
  return data.sort(function (_ref2, _ref3) {
    var a = _ref2.value;
    var b = _ref3.value;
    if (a === b) return 0;
    if (a > b) return -1;
    if (a < b) return 1;
  });
}

function getRoseIncrement(pie) {
  var radius = pie.radius,
      roseIncrement = pie.roseIncrement;
  if (typeof roseIncrement === 'number') return roseIncrement;

  if (roseIncrement === 'auto') {
    var data = pie.data;
    var allRadius = data.reduce(function (all, _ref4) {
      var radius = _ref4.radius;
      return [].concat((0, _toConsumableArray2["default"])(all), (0, _toConsumableArray2["default"])(radius));
    }, []);
    var minRadius = Math.min.apply(Math, (0, _toConsumableArray2["default"])(allRadius));
    var maxRadius = Math.max.apply(Math, (0, _toConsumableArray2["default"])(allRadius));
    return (maxRadius - minRadius) * 0.6 / (data.length - 1 || 1);
  }

  return parseInt(roseIncrement) / 100 * radius[1];
}

function calcPiesPercent(pies) {
  pies.forEach(function (pie) {
    var data = pie.data,
        percentToFixed = pie.percentToFixed;
    var sum = getDataSum(data);
    data.forEach(function (item) {
      var value = item.value;
      item.percent = value / sum * 100;
      item.percentForLabel = toFixedNoCeil(value / sum * 100, percentToFixed);
    });
    var percentSumNoLast = (0, util.mulAdd)(data.slice(0, -1).map(function (_ref5) {
      var percent = _ref5.percent;
      return percent;
    }));
    data.slice(-1)[0].percent = 100 - percentSumNoLast;
    data.slice(-1)[0].percentForLabel = toFixedNoCeil(100 - percentSumNoLast, percentToFixed);
  });
  return pies;
}

function toFixedNoCeil(number) {
  var toFixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var stringNumber = number.toString();
  var splitedNumber = stringNumber.split('.');
  var decimal = splitedNumber[1] || '0';
  var fixedDecimal = decimal.slice(0, toFixed);
  splitedNumber[1] = fixedDecimal;
  return parseFloat(splitedNumber.join('.'));
}

function getDataSum(data) {
  return (0, util.mulAdd)(data.map(function (_ref6) {
    var value = _ref6.value;
    return value;
  }));
}

function calcPiesAngle(pies) {
  pies.forEach(function (pie) {
    var start = pie.startAngle,
        data = pie.data;
    data.forEach(function (item, i) {
      var _getDataAngle = getDataAngle(data, i),
          _getDataAngle2 = (0, _slicedToArray2["default"])(_getDataAngle, 2),
          startAngle = _getDataAngle2[0],
          endAngle = _getDataAngle2[1];

      item.startAngle = start + startAngle;
      item.endAngle = start + endAngle;
    });
  });
  return pies;
}

function getDataAngle(data, i) {
  var fullAngle = Math.PI * 2;
  var needAddData = data.slice(0, i + 1);
  var percentSum = (0, util.mulAdd)(needAddData.map(function (_ref7) {
    var percent = _ref7.percent;
    return percent;
  }));
  var percent = data[i].percent;
  var startPercent = percentSum - percent;
  return [fullAngle * startPercent / 100, fullAngle * percentSum / 100];
}

function calcPiesInsideLabelPos(pies) {
  pies.forEach(function (pieItem) {
    var data = pieItem.data;
    data.forEach(function (item) {
      item.insideLabelPos = getPieInsideLabelPos(pieItem, item);
    });
  });
  return pies;
}

function getPieInsideLabelPos(pieItem, dataItem) {
  var center = pieItem.center;

  var startAngle = dataItem.startAngle,
      endAngle = dataItem.endAngle,
      _dataItem$radius = (0, _slicedToArray2["default"])(dataItem.radius, 2),
      ir = _dataItem$radius[0],
      or = _dataItem$radius[1];

  var radius = (ir + or) / 2;
  var angle = (startAngle + endAngle) / 2;
  return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([radius, angle]));
}

function calcPiesEdgeCenterPos(pies) {
  pies.forEach(function (pie) {
    var data = pie.data,
        center = pie.center;
    data.forEach(function (item) {
      var startAngle = item.startAngle,
          endAngle = item.endAngle,
          radius = item.radius;
      var centerAngle = (startAngle + endAngle) / 2;

      var pos = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([radius[1], centerAngle]));

      item.edgeCenterPos = pos;
    });
  });
  return pies;
}

function calcPiesOutSideLabelPos(pies) {
  pies.forEach(function (pieItem) {
    var leftPieDataItems = getLeftOrRightPieDataItems(pieItem);
    var rightPieDataItems = getLeftOrRightPieDataItems(pieItem, false);
    leftPieDataItems = sortPiesFromTopToBottom(leftPieDataItems);
    rightPieDataItems = sortPiesFromTopToBottom(rightPieDataItems);
    addLabelLineAndAlign(leftPieDataItems, pieItem);
    addLabelLineAndAlign(rightPieDataItems, pieItem, false);
  });
  return pies;
}

function getLabelLineBendRadius(pieItem) {
  var labelLineBendGap = pieItem.outsideLabel.labelLineBendGap;
  var maxRadius = getPieMaxRadius(pieItem);

  if (typeof labelLineBendGap !== 'number') {
    labelLineBendGap = parseInt(labelLineBendGap) / 100 * maxRadius;
  }

  return labelLineBendGap + maxRadius;
}

function getPieMaxRadius(pieItem) {
  var data = pieItem.data;
  var radius = data.map(function (_ref8) {
    var _ref8$radius = (0, _slicedToArray2["default"])(_ref8.radius, 2);
        _ref8$radius[0];
        var r = _ref8$radius[1];

    return r;
  });
  return Math.max.apply(Math, (0, _toConsumableArray2["default"])(radius));
}

function getLeftOrRightPieDataItems(pieItem) {
  var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var data = pieItem.data,
      center = pieItem.center;
  var centerXPos = center[0];
  return data.filter(function (_ref9) {
    var edgeCenterPos = _ref9.edgeCenterPos;
    var xPos = edgeCenterPos[0];
    if (left) return xPos <= centerXPos;
    return xPos > centerXPos;
  });
}

function sortPiesFromTopToBottom(dataItem) {
  dataItem.sort(function (_ref10, _ref11) {
    var _ref10$edgeCenterPos = (0, _slicedToArray2["default"])(_ref10.edgeCenterPos, 2);
        _ref10$edgeCenterPos[0];
        var ay = _ref10$edgeCenterPos[1];

    var _ref11$edgeCenterPos = (0, _slicedToArray2["default"])(_ref11.edgeCenterPos, 2);
        _ref11$edgeCenterPos[0];
        var by = _ref11$edgeCenterPos[1];

    if (ay > by) return 1;
    if (ay < by) return -1;
    if (ay === by) return 0;
  });
  return dataItem;
}

function addLabelLineAndAlign(dataItem, pieItem) {
  var left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var center = pieItem.center,
      outsideLabel = pieItem.outsideLabel;
  var radius = getLabelLineBendRadius(pieItem);
  dataItem.forEach(function (item) {
    var edgeCenterPos = item.edgeCenterPos,
        startAngle = item.startAngle,
        endAngle = item.endAngle;
    var labelLineEndLength = outsideLabel.labelLineEndLength;
    var angle = (startAngle + endAngle) / 2;

    var bendPoint = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([radius, angle]));

    var endPoint = (0, _toConsumableArray2["default"])(bendPoint);
    endPoint[0] += labelLineEndLength * (left ? -1 : 1);
    item.labelLine = [edgeCenterPos, bendPoint, endPoint];
    item.labelLineLength = (0, util.getPolylineLength)(item.labelLine);
    item.align = {
      textAlign: 'left',
      textBaseline: 'middle'
    };
    if (left) item.align.textAlign = 'right';
  });
}

function getPieConfig(pieItem) {
  var data = pieItem.data,
      animationCurve = pieItem.animationCurve,
      animationFrame = pieItem.animationFrame,
      rLevel = pieItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'pie',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getPieShape(pieItem, i),
      style: getPieStyle(pieItem, i)
    };
  });
}

function getStartPieConfig(pieItem) {
  var animationDelayGap = pieItem.animationDelayGap,
      startAnimationCurve = pieItem.startAnimationCurve;
  var configs = getPieConfig(pieItem);
  configs.forEach(function (config, i) {
    config.animationCurve = startAnimationCurve;
    config.animationDelay = i * animationDelayGap;
    config.shape.or = config.shape.ir;
  });
  return configs;
}

function beforeChangePie(graph) {
  graph.animationDelay = 0;
}

function getPieShape(pieItem, i) {
  var center = pieItem.center,
      data = pieItem.data;
  var dataItem = data[i];
  var radius = dataItem.radius,
      startAngle = dataItem.startAngle,
      endAngle = dataItem.endAngle;
  return {
    startAngle: startAngle,
    endAngle: endAngle,
    ir: radius[0],
    or: radius[1],
    rx: center[0],
    ry: center[1]
  };
}

function getPieStyle(pieItem, i) {
  var pieStyle = pieItem.pieStyle,
      data = pieItem.data;
  var dataItem = data[i];
  var color = dataItem.color;
  return (0, util.deepMerge)({
    fill: color
  }, pieStyle);
}

function getInsideLabelConfig(pieItem) {
  var animationCurve = pieItem.animationCurve,
      animationFrame = pieItem.animationFrame,
      data = pieItem.data,
      rLevel = pieItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: pieItem.insideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getInsideLabelShape(pieItem, i),
      style: getInsideLabelStyle(pieItem)
    };
  });
}

function getInsideLabelShape(pieItem, i) {
  var insideLabel = pieItem.insideLabel,
      data = pieItem.data;
  var formatter = insideLabel.formatter;
  var dataItem = data[i];
  var formatterType = (0, _typeof2["default"])(formatter);
  var label = '';

  if (formatterType === 'string') {
    label = formatter.replace('{name}', dataItem.name);
    label = label.replace('{percent}', dataItem.percentForLabel);
    label = label.replace('{value}', dataItem.value);
  }

  if (formatterType === 'function') {
    label = formatter(dataItem);
  }

  return {
    content: label,
    position: dataItem.insideLabelPos
  };
}

function getInsideLabelStyle(pieItem, i) {
  var style = pieItem.insideLabel.style;
  return style;
}

function getOutsideLabelLineConfig(pieItem) {
  var animationCurve = pieItem.animationCurve,
      animationFrame = pieItem.animationFrame,
      data = pieItem.data,
      rLevel = pieItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: pieItem.outsideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getOutsideLabelLineShape(pieItem, i),
      style: getOutsideLabelLineStyle(pieItem, i)
    };
  });
}

function getStartOutsideLabelLineConfig(pieItem) {
  var data = pieItem.data;
  var configs = getOutsideLabelLineConfig(pieItem);
  configs.forEach(function (config, i) {
    config.style.lineDash = [0, data[i].labelLineLength];
  });
  return configs;
}

function getOutsideLabelLineShape(pieItem, i) {
  var data = pieItem.data;
  var dataItem = data[i];
  return {
    points: dataItem.labelLine
  };
}

function getOutsideLabelLineStyle(pieItem, i) {
  var outsideLabel = pieItem.outsideLabel,
      data = pieItem.data;
  var labelLineStyle = outsideLabel.labelLineStyle;
  var color = data[i].color;
  return (0, util.deepMerge)({
    stroke: color,
    lineDash: [data[i].labelLineLength, 0]
  }, labelLineStyle);
}

function getOutsideLabelConfig(pieItem) {
  var animationCurve = pieItem.animationCurve,
      animationFrame = pieItem.animationFrame,
      data = pieItem.data,
      rLevel = pieItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: pieItem.outsideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getOutsideLabelShape(pieItem, i),
      style: getOutsideLabelStyle(pieItem, i)
    };
  });
}

function getStartOutsideLabelConfig(pieItem) {
  var data = pieItem.data;
  var configs = getOutsideLabelConfig(pieItem);
  configs.forEach(function (config, i) {
    config.shape.position = data[i].labelLine[1];
  });
  return configs;
}

function getOutsideLabelShape(pieItem, i) {
  var outsideLabel = pieItem.outsideLabel,
      data = pieItem.data;
  var formatter = outsideLabel.formatter;
  var _data$i = data[i],
      labelLine = _data$i.labelLine,
      name = _data$i.name,
      percentForLabel = _data$i.percentForLabel,
      value = _data$i.value;
  var formatterType = (0, _typeof2["default"])(formatter);
  var label = '';

  if (formatterType === 'string') {
    label = formatter.replace('{name}', name);
    label = label.replace('{percent}', percentForLabel);
    label = label.replace('{value}', value);
  }

  if (formatterType === 'function') {
    label = formatter(data[i]);
  }

  return {
    content: label,
    position: labelLine[2]
  };
}

function getOutsideLabelStyle(pieItem, i) {
  var outsideLabel = pieItem.outsideLabel,
      data = pieItem.data;
  var _data$i2 = data[i],
      color = _data$i2.color,
      align = _data$i2.align;
  var style = outsideLabel.style;
  return (0, util.deepMerge)(_objectSpread({
    fill: color
  }, align), style);
}
});

unwrapExports(pie_1);
pie_1.pie;

var radarAxis_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radarAxis = radarAxis;

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _defineProperty2 = interopRequireDefault(defineProperty);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function radarAxis(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var radar = option.radar;
  var radarAxis = [];

  if (radar) {
    radarAxis = mergeRadarAxisDefaultConfig(radar);
    radarAxis = calcRadarAxisCenter(radarAxis, chart);
    radarAxis = calcRadarAxisRingRadius(radarAxis, chart);
    radarAxis = calcRadarAxisLinePosition(radarAxis);
    radarAxis = calcRadarAxisAreaRadius(radarAxis);
    radarAxis = calcRadarAxisLabelPosition(radarAxis);
    radarAxis = [radarAxis];
  }

  var radarAxisForUpdate = radarAxis;
  if (radarAxis.length && !radarAxis[0].show) radarAxisForUpdate = [];
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitArea',
    getGraphConfig: getSplitAreaConfig,
    beforeUpdate: beforeUpdateSplitArea,
    beforeChange: beforeChangeSplitArea
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitLine',
    getGraphConfig: getSplitLineConfig,
    beforeUpdate: beforeUpdateSplitLine,
    beforeChange: beforeChangeSplitLine
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLine',
    getGraphConfig: getAxisLineConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLable',
    getGraphConfig: getAxisLabelConfig
  });
  chart.radarAxis = radarAxis[0];
}

function mergeRadarAxisDefaultConfig(radar) {
  return (0, util.deepMerge)((0, util$1.deepClone)(config.radarAxisConfig), radar);
}

function calcRadarAxisCenter(radarAxis, chart) {
  var area = chart.render.area;
  var center = radarAxis.center;
  radarAxis.centerPos = center.map(function (v, i) {
    if (typeof v === 'number') return v;
    return parseInt(v) / 100 * area[i];
  });
  return radarAxis;
}

function calcRadarAxisRingRadius(radarAxis, chart) {
  var area = chart.render.area;
  var splitNum = radarAxis.splitNum,
      radius = radarAxis.radius;
  var maxRadius = Math.min.apply(Math, (0, _toConsumableArray2["default"])(area)) / 2;
  if (typeof radius !== 'number') radius = parseInt(radius) / 100 * maxRadius;
  var splitGap = radius / splitNum;
  radarAxis.ringRadius = new Array(splitNum).fill(0).map(function (foo, i) {
    return splitGap * (i + 1);
  });
  radarAxis.radius = radius;
  return radarAxis;
}

function calcRadarAxisLinePosition(radarAxis) {
  var indicator = radarAxis.indicator,
      centerPos = radarAxis.centerPos,
      radius = radarAxis.radius,
      startAngle = radarAxis.startAngle;
  var fullAngle = Math.PI * 2;
  var indicatorNum = indicator.length;
  var indicatorGap = fullAngle / indicatorNum;
  var angles = new Array(indicatorNum).fill(0).map(function (foo, i) {
    return indicatorGap * i + startAngle;
  });
  radarAxis.axisLineAngles = angles;
  radarAxis.axisLinePosition = angles.map(function (g) {
    return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([radius, g]));
  });
  return radarAxis;
}

function calcRadarAxisAreaRadius(radarAxis) {
  var ringRadius = radarAxis.ringRadius;
  var subRadius = ringRadius[0] / 2;
  radarAxis.areaRadius = ringRadius.map(function (r) {
    return r - subRadius;
  });
  return radarAxis;
}

function calcRadarAxisLabelPosition(radarAxis) {
  var axisLineAngles = radarAxis.axisLineAngles,
      centerPos = radarAxis.centerPos,
      radius = radarAxis.radius,
      axisLabel = radarAxis.axisLabel;
  radius += axisLabel.labelGap;
  radarAxis.axisLabelPosition = axisLineAngles.map(function (angle) {
    return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([radius, angle]));
  });
  return radarAxis;
}

function getSplitAreaConfig(radarAxis) {
  var areaRadius = radarAxis.areaRadius,
      polygon = radarAxis.polygon,
      animationCurve = radarAxis.animationCurve,
      animationFrame = radarAxis.animationFrame,
      rLevel = radarAxis.rLevel;
  var name = polygon ? 'regPolygon' : 'ring';
  return areaRadius.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      visible: radarAxis.splitArea.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getSplitAreaShape(radarAxis, i),
      style: getSplitAreaStyle(radarAxis, i)
    };
  });
}

function getSplitAreaShape(radarAxis, i) {
  var polygon = radarAxis.polygon,
      areaRadius = radarAxis.areaRadius,
      indicator = radarAxis.indicator,
      centerPos = radarAxis.centerPos;
  var indicatorNum = indicator.length;
  var shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: areaRadius[i]
  };
  if (polygon) shape.side = indicatorNum;
  return shape;
}

function getSplitAreaStyle(radarAxis, i) {
  var splitArea = radarAxis.splitArea,
      ringRadius = radarAxis.ringRadius,
      axisLineAngles = radarAxis.axisLineAngles,
      polygon = radarAxis.polygon,
      centerPos = radarAxis.centerPos;
  var color = splitArea.color,
      style = splitArea.style;
  style = _objectSpread({
    fill: 'rgba(0, 0, 0, 0)'
  }, style);
  var lineWidth = ringRadius[0] - 0;

  if (polygon) {
    var point1 = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([ringRadius[0], axisLineAngles[0]]));

    var point2 = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([ringRadius[0], axisLineAngles[1]]));

    lineWidth = (0, util.getPointToLineDistance)(centerPos, point1, point2);
  }

  style = (0, util.deepMerge)((0, util$1.deepClone)(style, true), {
    lineWidth: lineWidth
  });
  if (!color.length) return style;
  var colorNum = color.length;
  return (0, util.deepMerge)(style, {
    stroke: color[i % colorNum]
  });
}

function beforeUpdateSplitArea(graphs, radarAxis, i, updater) {
  var cache = graphs[i];
  if (!cache) return;
  var render = updater.chart.render;
  var polygon = radarAxis.polygon;
  var name = cache[0].name;
  var currentName = polygon ? 'regPolygon' : 'ring';
  var delAll = currentName !== name;
  if (!delAll) return;
  cache.forEach(function (g) {
    return render.delGraph(g);
  });
  graphs[i] = null;
}

function beforeChangeSplitArea(graph, config) {
  var side = config.shape.side;
  if (typeof side !== 'number') return;
  graph.shape.side = side;
}

function getSplitLineConfig(radarAxis) {
  var ringRadius = radarAxis.ringRadius,
      polygon = radarAxis.polygon,
      animationCurve = radarAxis.animationCurve,
      animationFrame = radarAxis.animationFrame,
      rLevel = radarAxis.rLevel;
  var name = polygon ? 'regPolygon' : 'ring';
  return ringRadius.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      visible: radarAxis.splitLine.show,
      shape: getSplitLineShape(radarAxis, i),
      style: getSplitLineStyle(radarAxis, i)
    };
  });
}

function getSplitLineShape(radarAxis, i) {
  var ringRadius = radarAxis.ringRadius,
      centerPos = radarAxis.centerPos,
      indicator = radarAxis.indicator,
      polygon = radarAxis.polygon;
  var shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: ringRadius[i]
  };
  var indicatorNum = indicator.length;
  if (polygon) shape.side = indicatorNum;
  return shape;
}

function getSplitLineStyle(radarAxis, i) {
  var splitLine = radarAxis.splitLine;
  var color = splitLine.color,
      style = splitLine.style;
  style = _objectSpread({
    fill: 'rgba(0, 0, 0, 0)'
  }, style);
  if (!color.length) return style;
  var colorNum = color.length;
  return (0, util.deepMerge)(style, {
    stroke: color[i % colorNum]
  });
}

function beforeUpdateSplitLine(graphs, radarAxis, i, updater) {
  var cache = graphs[i];
  if (!cache) return;
  var render = updater.chart.render;
  var polygon = radarAxis.polygon;
  var name = cache[0].name;
  var currenName = polygon ? 'regPolygon' : 'ring';
  var delAll = currenName !== name;
  if (!delAll) return;
  cache.forEach(function (g) {
    return render.delGraph(g);
  });
  graphs[i] = null;
}

function beforeChangeSplitLine(graph, config) {
  var side = config.shape.side;
  if (typeof side !== 'number') return;
  graph.shape.side = side;
}

function getAxisLineConfig(radarAxis) {
  var axisLinePosition = radarAxis.axisLinePosition,
      animationCurve = radarAxis.animationCurve,
      animationFrame = radarAxis.animationFrame,
      rLevel = radarAxis.rLevel;
  return axisLinePosition.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: radarAxis.axisLine.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLineShape(radarAxis, i),
      style: getAxisLineStyle(radarAxis, i)
    };
  });
}

function getAxisLineShape(radarAxis, i) {
  var centerPos = radarAxis.centerPos,
      axisLinePosition = radarAxis.axisLinePosition;
  var points = [centerPos, axisLinePosition[i]];
  return {
    points: points
  };
}

function getAxisLineStyle(radarAxis, i) {
  var axisLine = radarAxis.axisLine;
  var color = axisLine.color,
      style = axisLine.style;
  if (!color.length) return style;
  var colorNum = color.length;
  return (0, util.deepMerge)(style, {
    stroke: color[i % colorNum]
  });
}

function getAxisLabelConfig(radarAxis) {
  var axisLabelPosition = radarAxis.axisLabelPosition,
      animationCurve = radarAxis.animationCurve,
      animationFrame = radarAxis.animationFrame,
      rLevel = radarAxis.rLevel;
  return axisLabelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: radarAxis.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLableShape(radarAxis, i),
      style: getAxisLableStyle(radarAxis, i)
    };
  });
}

function getAxisLableShape(radarAxis, i) {
  var axisLabelPosition = radarAxis.axisLabelPosition,
      indicator = radarAxis.indicator;
  return {
    content: indicator[i].name,
    position: axisLabelPosition[i]
  };
}

function getAxisLableStyle(radarAxis, i) {
  var axisLabel = radarAxis.axisLabel,
      _radarAxis$centerPos = (0, _slicedToArray2["default"])(radarAxis.centerPos, 2),
      x = _radarAxis$centerPos[0],
      y = _radarAxis$centerPos[1],
      axisLabelPosition = radarAxis.axisLabelPosition;

  var color = axisLabel.color,
      style = axisLabel.style;

  var _axisLabelPosition$i = (0, _slicedToArray2["default"])(axisLabelPosition[i], 2),
      labelXpos = _axisLabelPosition$i[0],
      labelYPos = _axisLabelPosition$i[1];

  var textAlign = labelXpos > x ? 'left' : 'right';
  var textBaseline = labelYPos > y ? 'top' : 'bottom';
  style = (0, util.deepMerge)({
    textAlign: textAlign,
    textBaseline: textBaseline
  }, style);
  if (!color.length) return style;
  var colorNum = color.length;
  return (0, util.deepMerge)(style, {
    fill: color[i % colorNum]
  });
}
});

unwrapExports(radarAxis_1);
radarAxis_1.radarAxis;

var radar_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radar = radar;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _typeof2 = interopRequireDefault(_typeof_1);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);











function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function radar(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var series = option.series;
  if (!series) series = [];
  var radars = (0, util.initNeedSeries)(series, config.radarConfig, 'radar');
  radars = calcRadarPosition(radars, chart);
  radars = calcRadarLabelPosition(radars, chart);
  radars = calcRadarLabelAlign(radars, chart);
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radar',
    getGraphConfig: getRadarConfig,
    getStartGraphConfig: getStartRadarConfig,
    beforeChange: beforeChangeRadar
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radarPoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radarLabel',
    getGraphConfig: getLabelConfig
  });
}

function calcRadarPosition(radars, chart) {
  var radarAxis = chart.radarAxis;
  if (!radarAxis) return [];
  var indicator = radarAxis.indicator,
      axisLineAngles = radarAxis.axisLineAngles,
      radius = radarAxis.radius,
      centerPos = radarAxis.centerPos;
  radars.forEach(function (radarItem) {
    var data = radarItem.data;
    radarItem.dataRadius = [];
    radarItem.radarPosition = indicator.map(function (_ref, i) {
      var max = _ref.max,
          min = _ref.min;
      var v = data[i];
      if (typeof max !== 'number') max = v;
      if (typeof min !== 'number') min = 0;
      if (typeof v !== 'number') v = min;
      var dataRadius = (v - min) / (max - min) * radius;
      radarItem.dataRadius[i] = dataRadius;
      return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([dataRadius, axisLineAngles[i]]));
    });
  });
  return radars;
}

function calcRadarLabelPosition(radars, chart) {
  var radarAxis = chart.radarAxis;
  if (!radarAxis) return [];
  var centerPos = radarAxis.centerPos,
      axisLineAngles = radarAxis.axisLineAngles;
  radars.forEach(function (radarItem) {
    var dataRadius = radarItem.dataRadius,
        label = radarItem.label;
    var labelGap = label.labelGap;
    radarItem.labelPosition = dataRadius.map(function (r, i) {
      return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(centerPos).concat([r + labelGap, axisLineAngles[i]]));
    });
  });
  return radars;
}

function calcRadarLabelAlign(radars, chart) {
  var radarAxis = chart.radarAxis;
  if (!radarAxis) return [];

  var _radarAxis$centerPos = (0, _slicedToArray2["default"])(radarAxis.centerPos, 2),
      x = _radarAxis$centerPos[0],
      y = _radarAxis$centerPos[1];

  radars.forEach(function (radarItem) {
    var labelPosition = radarItem.labelPosition;
    var labelAlign = labelPosition.map(function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
          lx = _ref3[0],
          ly = _ref3[1];

      var textAlign = lx > x ? 'left' : 'right';
      var textBaseline = ly > y ? 'top' : 'bottom';
      return {
        textAlign: textAlign,
        textBaseline: textBaseline
      };
    });
    radarItem.labelAlign = labelAlign;
  });
  return radars;
}

function getRadarConfig(radarItem) {
  var animationCurve = radarItem.animationCurve,
      animationFrame = radarItem.animationFrame,
      rLevel = radarItem.rLevel;
  return [{
    name: 'polyline',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getRadarShape(radarItem),
    style: getRadarStyle(radarItem)
  }];
}

function getStartRadarConfig(radarItem, updater) {
  var centerPos = updater.chart.radarAxis.centerPos;
  var config = getRadarConfig(radarItem)[0];
  var pointNum = config.shape.points.length;
  var points = new Array(pointNum).fill(0).map(function (foo) {
    return (0, _toConsumableArray2["default"])(centerPos);
  });
  config.shape.points = points;
  return [config];
}

function getRadarShape(radarItem) {
  var radarPosition = radarItem.radarPosition;
  return {
    points: radarPosition,
    close: true
  };
}

function getRadarStyle(radarItem) {
  var radarStyle = radarItem.radarStyle,
      color = radarItem.color;
  var colorRgbaValue = (0, _color.getRgbaValue)(color);
  colorRgbaValue[3] = 0.5;
  var radarDefaultColor = {
    stroke: color,
    fill: (0, _color.getColorFromRgbValue)(colorRgbaValue)
  };
  return (0, util.deepMerge)(radarDefaultColor, radarStyle);
}

function beforeChangeRadar(graph, _ref4) {
  var shape = _ref4.shape;
  var graphPoints = graph.shape.points;
  var graphPointsNum = graphPoints.length;
  var pointsNum = shape.points.length;

  if (pointsNum > graphPointsNum) {
    var lastPoint = graphPoints.slice(-1)[0];
    var newAddPoints = new Array(pointsNum - graphPointsNum).fill(0).map(function (foo) {
      return (0, _toConsumableArray2["default"])(lastPoint);
    });
    graphPoints.push.apply(graphPoints, (0, _toConsumableArray2["default"])(newAddPoints));
  } else if (pointsNum < graphPointsNum) {
    graphPoints.splice(pointsNum);
  }
}

function getPointConfig(radarItem) {
  var radarPosition = radarItem.radarPosition,
      animationCurve = radarItem.animationCurve,
      animationFrame = radarItem.animationFrame,
      rLevel = radarItem.rLevel;
  return radarPosition.map(function (foo, i) {
    return {
      name: 'circle',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      visible: radarItem.point.show,
      shape: getPointShape(radarItem, i),
      style: getPointStyle(radarItem)
    };
  });
}

function getStartPointConfig(radarItem) {
  var configs = getPointConfig(radarItem);
  configs.forEach(function (config) {
    return config.shape.r = 0.01;
  });
  return configs;
}

function getPointShape(radarItem, i) {
  var radarPosition = radarItem.radarPosition,
      point = radarItem.point;
  var radius = point.radius;
  var position = radarPosition[i];
  return {
    rx: position[0],
    ry: position[1],
    r: radius
  };
}

function getPointStyle(radarItem, i) {
  var point = radarItem.point,
      color = radarItem.color;
  var style = point.style;
  return (0, util.deepMerge)({
    stroke: color
  }, style);
}

function getLabelConfig(radarItem) {
  var labelPosition = radarItem.labelPosition,
      animationCurve = radarItem.animationCurve,
      animationFrame = radarItem.animationFrame,
      rLevel = radarItem.rLevel;
  return labelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: radarItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getLabelShape(radarItem, i),
      style: getLabelStyle(radarItem, i)
    };
  });
}

function getLabelShape(radarItem, i) {
  var labelPosition = radarItem.labelPosition,
      label = radarItem.label,
      data = radarItem.data;
  var offset = label.offset,
      formatter = label.formatter;
  var position = mergePointOffset(labelPosition[i], offset);
  var labelText = data[i] ? data[i].toString() : '0';
  var formatterType = (0, _typeof2["default"])(formatter);
  if (formatterType === 'string') labelText = formatter.replace('{value}', labelText);
  if (formatterType === 'function') labelText = formatter(labelText);
  return {
    content: labelText,
    position: position
  };
}

function mergePointOffset(_ref5, _ref6) {
  var _ref7 = (0, _slicedToArray2["default"])(_ref5, 2),
      x = _ref7[0],
      y = _ref7[1];

  var _ref8 = (0, _slicedToArray2["default"])(_ref6, 2),
      ox = _ref8[0],
      oy = _ref8[1];

  return [x + ox, y + oy];
}

function getLabelStyle(radarItem, i) {
  var label = radarItem.label,
      color = radarItem.color,
      labelAlign = radarItem.labelAlign;
  var style = label.style;

  var defaultColorAndAlign = _objectSpread({
    fill: color
  }, labelAlign[i]);

  return (0, util.deepMerge)(defaultColorAndAlign, style);
}
});

unwrapExports(radar_1);
radar_1.radar;

var gauge_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gauge = gauge$1;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _typeof2 = interopRequireDefault(_typeof_1);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _toConsumableArray2 = interopRequireDefault(toConsumableArray);











function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function gauge$1(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var series = option.series;
  if (!series) series = [];
  var gauges = (0, util.initNeedSeries)(series, gauge.gaugeConfig, 'gauge');
  gauges = calcGaugesCenter(gauges, chart);
  gauges = calcGaugesRadius(gauges, chart);
  gauges = calcGaugesDataRadiusAndLineWidth(gauges, chart);
  gauges = calcGaugesDataAngles(gauges);
  gauges = calcGaugesDataGradient(gauges);
  gauges = calcGaugesAxisTickPosition(gauges);
  gauges = calcGaugesLabelPositionAndAlign(gauges);
  gauges = calcGaugesLabelData(gauges);
  gauges = calcGaugesDetailsPosition(gauges);
  gauges = calcGaugesDetailsContent(gauges);
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeAxisTick',
    getGraphConfig: getAxisTickConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeAxisLabel',
    getGraphConfig: getAxisLabelConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeBackgroundArc',
    getGraphConfig: getBackgroundArcConfig,
    getStartGraphConfig: getStartBackgroundArcConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeArc',
    getGraphConfig: getArcConfig,
    getStartGraphConfig: getStartArcConfig,
    beforeChange: beforeChangeArc
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugePointer',
    getGraphConfig: getPointerConfig,
    getStartGraphConfig: getStartPointerConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeDetails',
    getGraphConfig: getDetailsConfig
  });
}

function calcGaugesCenter(gauges, chart) {
  var area = chart.render.area;
  gauges.forEach(function (gaugeItem) {
    var center = gaugeItem.center;
    center = center.map(function (pos, i) {
      if (typeof pos === 'number') return pos;
      return parseInt(pos) / 100 * area[i];
    });
    gaugeItem.center = center;
  });
  return gauges;
}

function calcGaugesRadius(gauges, chart) {
  var area = chart.render.area;
  var maxRadius = Math.min.apply(Math, (0, _toConsumableArray2["default"])(area)) / 2;
  gauges.forEach(function (gaugeItem) {
    var radius = gaugeItem.radius;

    if (typeof radius !== 'number') {
      radius = parseInt(radius) / 100 * maxRadius;
    }

    gaugeItem.radius = radius;
  });
  return gauges;
}

function calcGaugesDataRadiusAndLineWidth(gauges, chart) {
  var area = chart.render.area;
  var maxRadius = Math.min.apply(Math, (0, _toConsumableArray2["default"])(area)) / 2;
  gauges.forEach(function (gaugeItem) {
    var radius = gaugeItem.radius,
        data = gaugeItem.data,
        arcLineWidth = gaugeItem.arcLineWidth;
    data.forEach(function (item) {
      var arcRadius = item.radius,
          lineWidth = item.lineWidth;
      if (!arcRadius) arcRadius = radius;
      if (typeof arcRadius !== 'number') arcRadius = parseInt(arcRadius) / 100 * maxRadius;
      item.radius = arcRadius;
      if (!lineWidth) lineWidth = arcLineWidth;
      item.lineWidth = lineWidth;
    });
  });
  return gauges;
}

function calcGaugesDataAngles(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var startAngle = gaugeItem.startAngle,
        endAngle = gaugeItem.endAngle,
        data = gaugeItem.data,
        min = gaugeItem.min,
        max = gaugeItem.max;
    var angleMinus = endAngle - startAngle;
    var valueMinus = max - min;
    data.forEach(function (item) {
      var value = item.value;
      var itemAngle = Math.abs((value - min) / valueMinus * angleMinus);
      item.startAngle = startAngle;
      item.endAngle = startAngle + itemAngle;
    });
  });
  return gauges;
}

function calcGaugesDataGradient(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var data = gaugeItem.data;
    data.forEach(function (item) {
      var color = item.color,
          gradient = item.gradient;
      if (!gradient || !gradient.length) gradient = color;
      if (!(gradient instanceof Array)) gradient = [gradient];
      item.gradient = gradient;
    });
  });
  return gauges;
}

function calcGaugesAxisTickPosition(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var startAngle = gaugeItem.startAngle,
        endAngle = gaugeItem.endAngle,
        splitNum = gaugeItem.splitNum,
        center = gaugeItem.center,
        radius = gaugeItem.radius,
        arcLineWidth = gaugeItem.arcLineWidth,
        axisTick = gaugeItem.axisTick;
    var tickLength = axisTick.tickLength,
        lineWidth = axisTick.style.lineWidth;
    var angles = endAngle - startAngle;
    var outerRadius = radius - arcLineWidth / 2;
    var innerRadius = outerRadius - tickLength;
    var angleGap = angles / (splitNum - 1);
    var arcLength = 2 * Math.PI * radius * angles / (Math.PI * 2);
    var offset = Math.ceil(lineWidth / 2) / arcLength * angles;
    gaugeItem.tickAngles = [];
    gaugeItem.tickInnerRadius = [];
    gaugeItem.tickPosition = new Array(splitNum).fill(0).map(function (foo, i) {
      var angle = startAngle + angleGap * i;
      if (i === 0) angle += offset;
      if (i === splitNum - 1) angle -= offset;
      gaugeItem.tickAngles[i] = angle;
      gaugeItem.tickInnerRadius[i] = innerRadius;
      return [util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([outerRadius, angle])), util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([innerRadius, angle]))];
    });
  });
  return gauges;
}

function calcGaugesLabelPositionAndAlign(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var center = gaugeItem.center,
        tickInnerRadius = gaugeItem.tickInnerRadius,
        tickAngles = gaugeItem.tickAngles,
        labelGap = gaugeItem.axisLabel.labelGap;
    var position = tickAngles.map(function (angle, i) {
      return util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([tickInnerRadius[i] - labelGap, tickAngles[i]]));
    });
    var align = position.map(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return {
        textAlign: x > center[0] ? 'right' : 'left',
        textBaseline: y > center[1] ? 'bottom' : 'top'
      };
    });
    gaugeItem.labelPosition = position;
    gaugeItem.labelAlign = align;
  });
  return gauges;
}

function calcGaugesLabelData(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var axisLabel = gaugeItem.axisLabel,
        min = gaugeItem.min,
        max = gaugeItem.max,
        splitNum = gaugeItem.splitNum;
    var data = axisLabel.data,
        formatter = axisLabel.formatter;
    var valueGap = (max - min) / (splitNum - 1);
    var value = new Array(splitNum).fill(0).map(function (foo, i) {
      return parseInt(min + valueGap * i);
    });
    var formatterType = (0, _typeof2["default"])(formatter);
    data = (0, util.deepMerge)(value, data).map(function (v, i) {
      var label = v;

      if (formatterType === 'string') {
        label = formatter.replace('{value}', v);
      }

      if (formatterType === 'function') {
        label = formatter({
          value: v,
          index: i
        });
      }

      return label;
    });
    axisLabel.data = data;
  });
  return gauges;
}

function calcGaugesDetailsPosition(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var data = gaugeItem.data,
        details = gaugeItem.details,
        center = gaugeItem.center;
    var position = details.position,
        offset = details.offset;
    var detailsPosition = data.map(function (_ref3) {
      var startAngle = _ref3.startAngle,
          endAngle = _ref3.endAngle,
          radius = _ref3.radius;
      var point = null;

      if (position === 'center') {
        point = center;
      } else if (position === 'start') {
        point = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([radius, startAngle]));
      } else if (position === 'end') {
        point = util$1.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2["default"])(center).concat([radius, endAngle]));
      }

      return getOffsetedPoint(point, offset);
    });
    gaugeItem.detailsPosition = detailsPosition;
  });
  return gauges;
}

function calcGaugesDetailsContent(gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    var data = gaugeItem.data,
        details = gaugeItem.details;
    var formatter = details.formatter;
    var formatterType = (0, _typeof2["default"])(formatter);
    var contents = data.map(function (dataItem) {
      var content = dataItem.value;

      if (formatterType === 'string') {
        content = formatter.replace('{value}', '{nt}');
        content = content.replace('{name}', dataItem.name);
      }

      if (formatterType === 'function') content = formatter(dataItem);
      return content.toString();
    });
    gaugeItem.detailsContent = contents;
  });
  return gauges;
}

function getOffsetedPoint(_ref4, _ref5) {
  var _ref6 = (0, _slicedToArray2["default"])(_ref4, 2),
      x = _ref6[0],
      y = _ref6[1];

  var _ref7 = (0, _slicedToArray2["default"])(_ref5, 2),
      ox = _ref7[0],
      oy = _ref7[1];

  return [x + ox, y + oy];
}

function getAxisTickConfig(gaugeItem) {
  var tickPosition = gaugeItem.tickPosition,
      animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      rLevel = gaugeItem.rLevel;
  return tickPosition.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: gaugeItem.axisTick.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisTickShape(gaugeItem, i),
      style: getAxisTickStyle(gaugeItem)
    };
  });
}

function getAxisTickShape(gaugeItem, i) {
  var tickPosition = gaugeItem.tickPosition;
  return {
    points: tickPosition[i]
  };
}

function getAxisTickStyle(gaugeItem, i) {
  var style = gaugeItem.axisTick.style;
  return style;
}

function getAxisLabelConfig(gaugeItem) {
  var labelPosition = gaugeItem.labelPosition,
      animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      rLevel = gaugeItem.rLevel;
  return labelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: gaugeItem.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLabelShape(gaugeItem, i),
      style: getAxisLabelStyle(gaugeItem, i)
    };
  });
}

function getAxisLabelShape(gaugeItem, i) {
  var labelPosition = gaugeItem.labelPosition,
      data = gaugeItem.axisLabel.data;
  return {
    content: data[i].toString(),
    position: labelPosition[i]
  };
}

function getAxisLabelStyle(gaugeItem, i) {
  var labelAlign = gaugeItem.labelAlign,
      axisLabel = gaugeItem.axisLabel;
  var style = axisLabel.style;
  return (0, util.deepMerge)(_objectSpread({}, labelAlign[i]), style);
}

function getBackgroundArcConfig(gaugeItem) {
  var animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      rLevel = gaugeItem.rLevel;
  return [{
    name: 'arc',
    index: rLevel,
    visible: gaugeItem.backgroundArc.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getGaugeBackgroundArcShape(gaugeItem),
    style: getGaugeBackgroundArcStyle(gaugeItem)
  }];
}

function getGaugeBackgroundArcShape(gaugeItem) {
  var startAngle = gaugeItem.startAngle,
      endAngle = gaugeItem.endAngle,
      center = gaugeItem.center,
      radius = gaugeItem.radius;
  return {
    rx: center[0],
    ry: center[1],
    r: radius,
    startAngle: startAngle,
    endAngle: endAngle
  };
}

function getGaugeBackgroundArcStyle(gaugeItem) {
  var backgroundArc = gaugeItem.backgroundArc,
      arcLineWidth = gaugeItem.arcLineWidth;
  var style = backgroundArc.style;
  return (0, util.deepMerge)({
    lineWidth: arcLineWidth
  }, style);
}

function getStartBackgroundArcConfig(gaugeItem) {
  var config = getBackgroundArcConfig(gaugeItem)[0];

  var shape = _objectSpread({}, config.shape);

  shape.endAngle = config.shape.startAngle;
  config.shape = shape;
  return [config];
}

function getArcConfig(gaugeItem) {
  var data = gaugeItem.data,
      animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      rLevel = gaugeItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'agArc',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getGaugeArcShape(gaugeItem, i),
      style: getGaugeArcStyle(gaugeItem, i)
    };
  });
}

function getGaugeArcShape(gaugeItem, i) {
  var data = gaugeItem.data,
      center = gaugeItem.center,
      gradientEndAngle = gaugeItem.endAngle;
  var _data$i = data[i],
      radius = _data$i.radius,
      startAngle = _data$i.startAngle,
      endAngle = _data$i.endAngle,
      localGradient = _data$i.localGradient;
  if (localGradient) gradientEndAngle = endAngle;
  return {
    rx: center[0],
    ry: center[1],
    r: radius,
    startAngle: startAngle,
    endAngle: endAngle,
    gradientEndAngle: gradientEndAngle
  };
}

function getGaugeArcStyle(gaugeItem, i) {
  var data = gaugeItem.data,
      dataItemStyle = gaugeItem.dataItemStyle;
  var _data$i2 = data[i],
      lineWidth = _data$i2.lineWidth,
      gradient = _data$i2.gradient;
  gradient = gradient.map(function (c) {
    return (0, _color.getRgbaValue)(c);
  });
  return (0, util.deepMerge)({
    lineWidth: lineWidth,
    gradient: gradient
  }, dataItemStyle);
}

function getStartArcConfig(gaugeItem) {
  var configs = getArcConfig(gaugeItem);
  configs.map(function (config) {
    var shape = _objectSpread({}, config.shape);

    shape.endAngle = config.shape.startAngle;
    config.shape = shape;
  });
  return configs;
}

function beforeChangeArc(graph, config) {
  var graphGradient = graph.style.gradient;
  var cacheNum = graphGradient.length;
  var needNum = config.style.gradient.length;

  if (cacheNum > needNum) {
    graphGradient.splice(needNum);
  } else {
    var last = graphGradient.slice(-1)[0];
    graphGradient.push.apply(graphGradient, (0, _toConsumableArray2["default"])(new Array(needNum - cacheNum).fill(0).map(function (foo) {
      return (0, _toConsumableArray2["default"])(last);
    })));
  }
}

function getPointerConfig(gaugeItem) {
  var animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      center = gaugeItem.center,
      rLevel = gaugeItem.rLevel;
  return [{
    name: 'polyline',
    index: rLevel,
    visible: gaugeItem.pointer.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getPointerShape(gaugeItem),
    style: getPointerStyle(gaugeItem),
    setGraphCenter: function setGraphCenter(foo, graph) {
      graph.style.graphCenter = center;
    }
  }];
}

function getPointerShape(gaugeItem) {
  var center = gaugeItem.center;
  return {
    points: getPointerPoints(center),
    close: true
  };
}

function getPointerStyle(gaugeItem) {
  var startAngle = gaugeItem.startAngle,
      endAngle = gaugeItem.endAngle,
      min = gaugeItem.min,
      max = gaugeItem.max,
      data = gaugeItem.data,
      pointer = gaugeItem.pointer,
      center = gaugeItem.center;
  var valueIndex = pointer.valueIndex,
      style = pointer.style;
  var value = data[valueIndex] ? data[valueIndex].value : 0;
  var angle = (value - min) / (max - min) * (endAngle - startAngle) + startAngle + Math.PI / 2;
  return (0, util.deepMerge)({
    rotate: (0, util.radianToAngle)(angle),
    scale: [1, 1],
    graphCenter: center
  }, style);
}

function getPointerPoints(_ref8) {
  var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
      x = _ref9[0],
      y = _ref9[1];

  var point1 = [x, y - 40];
  var point2 = [x + 5, y];
  var point3 = [x, y + 10];
  var point4 = [x - 5, y];
  return [point1, point2, point3, point4];
}

function getStartPointerConfig(gaugeItem) {
  var startAngle = gaugeItem.startAngle;
  var config = getPointerConfig(gaugeItem)[0];
  config.style.rotate = (0, util.radianToAngle)(startAngle + Math.PI / 2);
  return [config];
}

function getDetailsConfig(gaugeItem) {
  var detailsPosition = gaugeItem.detailsPosition,
      animationCurve = gaugeItem.animationCurve,
      animationFrame = gaugeItem.animationFrame,
      rLevel = gaugeItem.rLevel;
  var visible = gaugeItem.details.show;
  return detailsPosition.map(function (foo, i) {
    return {
      name: 'numberText',
      index: rLevel,
      visible: visible,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getDetailsShape(gaugeItem, i),
      style: getDetailsStyle(gaugeItem, i)
    };
  });
}

function getDetailsShape(gaugeItem, i) {
  var detailsPosition = gaugeItem.detailsPosition,
      detailsContent = gaugeItem.detailsContent,
      data = gaugeItem.data,
      details = gaugeItem.details;
  var position = detailsPosition[i];
  var content = detailsContent[i];
  var dataValue = data[i].value;
  var toFixed = details.valueToFixed;
  return {
    number: [dataValue],
    content: content,
    position: position,
    toFixed: toFixed
  };
}

function getDetailsStyle(gaugeItem, i) {
  var details = gaugeItem.details,
      data = gaugeItem.data;
  var style = details.style;
  var color = data[i].color;
  return (0, util.deepMerge)({
    fill: color
  }, style);
}
});

unwrapExports(gauge_1);
gauge_1.gauge;

var legend_1 = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legend = legend;

var _defineProperty2 = interopRequireDefault(defineProperty);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _typeof2 = interopRequireDefault(_typeof_1);









function legend(chart) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var legend = option.legend;

  if (legend) {
    legend = (0, util.deepMerge)((0, util$1.deepClone)(config.legendConfig, true), legend);
    legend = initLegendData(legend);
    legend = filterInvalidData(legend, option, chart);
    legend = calcLegendTextWidth(legend, chart);
    legend = calcLegendPosition(legend, chart);
    legend = [legend];
  } else {
    legend = [];
  }

  (0, updater_class.doUpdate)({
    chart: chart,
    series: legend,
    key: 'legendIcon',
    getGraphConfig: getIconConfig
  });
  (0, updater_class.doUpdate)({
    chart: chart,
    series: legend,
    key: 'legendText',
    getGraphConfig: getTextConfig
  });
}

function initLegendData(legend) {
  var data = legend.data;
  legend.data = data.map(function (item) {
    var itemType = (0, _typeof2["default"])(item);

    if (itemType === 'string') {
      return {
        name: item
      };
    } else if (itemType === 'object') {
      return item;
    }

    return {
      name: ''
    };
  });
  return legend;
}

function filterInvalidData(legend, option, chart) {
  var series = option.series;
  var legendStatus = chart.legendStatus;
  var data = legend.data.filter(function (item) {
    var name = item.name;
    var result = series.find(function (_ref) {
      var sn = _ref.name;
      return name === sn;
    });
    if (!result) return false;
    if (!item.color) item.color = result.color;
    if (!item.icon) item.icon = result.type;
    return item;
  });
  if (!legendStatus || legendStatus.length !== legend.data.length) legendStatus = new Array(legend.data.length).fill(true);
  data.forEach(function (item, i) {
    return item.status = legendStatus[i];
  });
  legend.data = data;
  chart.legendStatus = legendStatus;
  return legend;
}

function calcLegendTextWidth(legend, chart) {
  var ctx = chart.render.ctx;
  var data = legend.data,
      textStyle = legend.textStyle,
      textUnselectedStyle = legend.textUnselectedStyle;
  data.forEach(function (item) {
    var status = item.status,
        name = item.name;
    item.textWidth = getTextWidth(ctx, name, status ? textStyle : textUnselectedStyle);
  });
  return legend;
}

function getTextWidth(ctx, text, style) {
  ctx.font = getFontConfig(style);
  return ctx.measureText(text).width;
}

function getFontConfig(style) {
  var fontFamily = style.fontFamily,
      fontSize = style.fontSize;
  return "".concat(fontSize, "px ").concat(fontFamily);
}

function calcLegendPosition(legend, chart) {
  var orient = legend.orient;

  if (orient === 'vertical') {
    calcVerticalPosition(legend, chart);
  } else {
    calcHorizontalPosition(legend, chart);
  }

  return legend;
}

function calcHorizontalPosition(legend, chart) {
  var iconHeight = legend.iconHeight,
      itemGap = legend.itemGap;
  var lines = calcDefaultHorizontalPosition(legend, chart);
  var xOffsets = lines.map(function (line) {
    return getHorizontalXOffset(line, legend, chart);
  });
  var yOffset = getHorizontalYOffset(legend, chart);
  var align = {
    textAlign: 'left',
    textBaseline: 'middle'
  };
  lines.forEach(function (line, i) {
    return line.forEach(function (item) {
      var iconPosition = item.iconPosition,
          textPosition = item.textPosition;
      var xOffset = xOffsets[i];
      var realYOffset = yOffset + i * (itemGap + iconHeight);
      item.iconPosition = mergeOffset(iconPosition, [xOffset, realYOffset]);
      item.textPosition = mergeOffset(textPosition, [xOffset, realYOffset]);
      item.align = align;
    });
  });
}

function calcDefaultHorizontalPosition(legend, chart) {
  var data = legend.data,
      iconWidth = legend.iconWidth;
  var w = chart.render.area[0];
  var startIndex = 0;
  var lines = [[]];
  data.forEach(function (item, i) {
    var beforeWidth = getBeforeWidth(startIndex, i, legend);
    var endXPos = beforeWidth + iconWidth + 5 + item.textWidth;

    if (endXPos >= w) {
      startIndex = i;
      beforeWidth = getBeforeWidth(startIndex, i, legend);
      lines.push([]);
    }

    item.iconPosition = [beforeWidth, 0];
    item.textPosition = [beforeWidth + iconWidth + 5, 0];
    lines.slice(-1)[0].push(item);
  });
  return lines;
}

function getBeforeWidth(startIndex, currentIndex, legend) {
  var data = legend.data,
      iconWidth = legend.iconWidth,
      itemGap = legend.itemGap;
  var beforeItem = data.slice(startIndex, currentIndex);
  return (0, util.mulAdd)(beforeItem.map(function (_ref2) {
    var textWidth = _ref2.textWidth;
    return textWidth;
  })) + (currentIndex - startIndex) * (itemGap + 5 + iconWidth);
}

function getHorizontalXOffset(data, legend, chart) {
  var left = legend.left,
      right = legend.right,
      iconWidth = legend.iconWidth,
      itemGap = legend.itemGap;
  var w = chart.render.area[0];
  var dataNum = data.length;
  var allWidth = (0, util.mulAdd)(data.map(function (_ref3) {
    var textWidth = _ref3.textWidth;
    return textWidth;
  })) + dataNum * (5 + iconWidth) + (dataNum - 1) * itemGap;
  var horizontal = [left, right].findIndex(function (pos) {
    return pos !== 'auto';
  });

  if (horizontal === -1) {
    return (w - allWidth) / 2;
  } else if (horizontal === 0) {
    if (typeof left === 'number') return left;
    return parseInt(left) / 100 * w;
  } else {
    if (typeof right !== 'number') right = parseInt(right) / 100 * w;
    return w - (allWidth + right);
  }
}

function getHorizontalYOffset(legend, chart) {
  var top = legend.top,
      bottom = legend.bottom,
      iconHeight = legend.iconHeight;
  var h = chart.render.area[1];
  var vertical = [top, bottom].findIndex(function (pos) {
    return pos !== 'auto';
  });
  var halfIconHeight = iconHeight / 2;

  if (vertical === -1) {
    var _chart$gridArea = chart.gridArea,
        y = _chart$gridArea.y,
        height = _chart$gridArea.h;
    return y + height + 45 - halfIconHeight;
  } else if (vertical === 0) {
    if (typeof top === 'number') return top - halfIconHeight;
    return parseInt(top) / 100 * h - halfIconHeight;
  } else {
    if (typeof bottom !== 'number') bottom = parseInt(bottom) / 100 * h;
    return h - bottom - halfIconHeight;
  }
}

function mergeOffset(_ref4, _ref5) {
  var _ref6 = (0, _slicedToArray2["default"])(_ref4, 2),
      x = _ref6[0],
      y = _ref6[1];

  var _ref7 = (0, _slicedToArray2["default"])(_ref5, 2),
      ox = _ref7[0],
      oy = _ref7[1];

  return [x + ox, y + oy];
}

function calcVerticalPosition(legend, chart) {
  var _getVerticalXOffset = getVerticalXOffset(legend, chart),
      _getVerticalXOffset2 = (0, _slicedToArray2["default"])(_getVerticalXOffset, 2),
      isRight = _getVerticalXOffset2[0],
      xOffset = _getVerticalXOffset2[1];

  var yOffset = getVerticalYOffset(legend, chart);
  calcDefaultVerticalPosition(legend, isRight);
  var align = {
    textAlign: 'left',
    textBaseline: 'middle'
  };
  legend.data.forEach(function (item) {
    var textPosition = item.textPosition,
        iconPosition = item.iconPosition;
    item.textPosition = mergeOffset(textPosition, [xOffset, yOffset]);
    item.iconPosition = mergeOffset(iconPosition, [xOffset, yOffset]);
    item.align = align;
  });
}

function getVerticalXOffset(legend, chart) {
  var left = legend.left,
      right = legend.right;
  var w = chart.render.area[0];
  var horizontal = [left, right].findIndex(function (pos) {
    return pos !== 'auto';
  });

  if (horizontal === -1) {
    return [true, w - 10];
  } else {
    var offset = [left, right][horizontal];
    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * w;
    return [Boolean(horizontal), offset];
  }
}

function getVerticalYOffset(legend, chart) {
  var iconHeight = legend.iconHeight,
      itemGap = legend.itemGap,
      data = legend.data,
      top = legend.top,
      bottom = legend.bottom;
  var h = chart.render.area[1];
  var dataNum = data.length;
  var allHeight = dataNum * iconHeight + (dataNum - 1) * itemGap;
  var vertical = [top, bottom].findIndex(function (pos) {
    return pos !== 'auto';
  });

  if (vertical === -1) {
    return (h - allHeight) / 2;
  } else {
    var offset = [top, bottom][vertical];
    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * h;
    if (vertical === 1) offset = h - offset - allHeight;
    return offset;
  }
}

function calcDefaultVerticalPosition(legend, isRight) {
  var data = legend.data,
      iconWidth = legend.iconWidth,
      iconHeight = legend.iconHeight,
      itemGap = legend.itemGap;
  var halfIconHeight = iconHeight / 2;
  data.forEach(function (item, i) {
    var textWidth = item.textWidth;
    var yPos = (iconHeight + itemGap) * i + halfIconHeight;
    var iconXPos = isRight ? 0 - iconWidth : 0;
    var textXpos = isRight ? iconXPos - 5 - textWidth : iconWidth + 5;
    item.iconPosition = [iconXPos, yPos];
    item.textPosition = [textXpos, yPos];
  });
}

function getIconConfig(legendItem, updater) {
  var data = legendItem.data,
      selectAble = legendItem.selectAble,
      animationCurve = legendItem.animationCurve,
      animationFrame = legendItem.animationFrame,
      rLevel = legendItem.rLevel;
  return data.map(function (item, i) {
    return (0, _defineProperty2["default"])({
      name: item.icon === 'line' ? 'lineIcon' : 'rect',
      index: rLevel,
      visible: legendItem.show,
      hover: selectAble,
      click: selectAble,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getIconShape(legendItem, i),
      style: getIconStyle(legendItem, i)
    }, "click", createClickCallBack(legendItem, i, updater));
  });
}

function getIconShape(legendItem, i) {
  var data = legendItem.data,
      iconWidth = legendItem.iconWidth,
      iconHeight = legendItem.iconHeight;

  var _data$i$iconPosition = (0, _slicedToArray2["default"])(data[i].iconPosition, 2),
      x = _data$i$iconPosition[0],
      y = _data$i$iconPosition[1];

  var halfIconHeight = iconHeight / 2;
  return {
    x: x,
    y: y - halfIconHeight,
    w: iconWidth,
    h: iconHeight
  };
}

function getIconStyle(legendItem, i) {
  var data = legendItem.data,
      iconStyle = legendItem.iconStyle,
      iconUnselectedStyle = legendItem.iconUnselectedStyle;
  var _data$i = data[i],
      status = _data$i.status,
      color = _data$i.color;
  var style = status ? iconStyle : iconUnselectedStyle;
  return (0, util.deepMerge)({
    fill: color
  }, style);
}

function getTextConfig(legendItem, updater) {
  var data = legendItem.data,
      selectAble = legendItem.selectAble,
      animationCurve = legendItem.animationCurve,
      animationFrame = legendItem.animationFrame,
      rLevel = legendItem.rLevel;
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: legendItem.show,
      hover: selectAble,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      hoverRect: getTextHoverRect(legendItem, i),
      shape: getTextShape(legendItem, i),
      style: getTextStyle(legendItem, i),
      click: createClickCallBack(legendItem, i, updater)
    };
  });
}

function getTextShape(legendItem, i) {
  var _legendItem$data$i = legendItem.data[i],
      textPosition = _legendItem$data$i.textPosition,
      name = _legendItem$data$i.name;
  return {
    content: name,
    position: textPosition
  };
}

function getTextStyle(legendItem, i) {
  var textStyle = legendItem.textStyle,
      textUnselectedStyle = legendItem.textUnselectedStyle;
  var _legendItem$data$i2 = legendItem.data[i],
      status = _legendItem$data$i2.status,
      align = _legendItem$data$i2.align;
  var style = status ? textStyle : textUnselectedStyle;
  return (0, util.deepMerge)((0, util$1.deepClone)(style, true), align);
}

function getTextHoverRect(legendItem, i) {
  var textStyle = legendItem.textStyle,
      textUnselectedStyle = legendItem.textUnselectedStyle;

  var _legendItem$data$i3 = legendItem.data[i],
      status = _legendItem$data$i3.status,
      _legendItem$data$i3$t = (0, _slicedToArray2["default"])(_legendItem$data$i3.textPosition, 2),
      x = _legendItem$data$i3$t[0],
      y = _legendItem$data$i3$t[1],
      textWidth = _legendItem$data$i3.textWidth;

  var style = status ? textStyle : textUnselectedStyle;
  var fontSize = style.fontSize;
  return [x, y - fontSize / 2, textWidth, fontSize];
}

function createClickCallBack(legendItem, index, updater) {
  var name = legendItem.data[index].name;
  return function () {
    var _updater$chart = updater.chart,
        legendStatus = _updater$chart.legendStatus,
        option = _updater$chart.option;
    var status = !legendStatus[index];
    var change = option.series.find(function (_ref9) {
      var sn = _ref9.name;
      return sn === name;
    });
    change.show = status;
    legendStatus[index] = status;
    updater.chart.setOption(option);
  };
}
});

unwrapExports(legend_1);
legend_1.legend;

var core = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mergeColor", {
  enumerable: true,
  get: function get() {
    return mergeColor_1.mergeColor;
  }
});
Object.defineProperty(exports, "title", {
  enumerable: true,
  get: function get() {
    return title_1.title;
  }
});
Object.defineProperty(exports, "grid", {
  enumerable: true,
  get: function get() {
    return grid_1.grid;
  }
});
Object.defineProperty(exports, "axis", {
  enumerable: true,
  get: function get() {
    return axis_1.axis;
  }
});
Object.defineProperty(exports, "line", {
  enumerable: true,
  get: function get() {
    return line_1.line;
  }
});
Object.defineProperty(exports, "bar", {
  enumerable: true,
  get: function get() {
    return bar_1.bar;
  }
});
Object.defineProperty(exports, "pie", {
  enumerable: true,
  get: function get() {
    return pie_1.pie;
  }
});
Object.defineProperty(exports, "radarAxis", {
  enumerable: true,
  get: function get() {
    return radarAxis_1.radarAxis;
  }
});
Object.defineProperty(exports, "radar", {
  enumerable: true,
  get: function get() {
    return radar_1.radar;
  }
});
Object.defineProperty(exports, "gauge", {
  enumerable: true,
  get: function get() {
    return gauge_1.gauge;
  }
});
Object.defineProperty(exports, "legend", {
  enumerable: true,
  get: function get() {
    return legend_1.legend;
  }
});
});

unwrapExports(core);

var charts_class = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = interopRequireDefault(_typeof_1);

var _classCallCheck2 = interopRequireDefault(classCallCheck);



var _cRender = interopRequireDefault(lib$1);





var Charts = function Charts(dom) {
  (0, _classCallCheck2["default"])(this, Charts);

  if (!dom) {
    console.error('Charts Missing parameters!');
    return false;
  }

  var clientWidth = dom.clientWidth,
      clientHeight = dom.clientHeight;
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', clientWidth);
  canvas.setAttribute('height', clientHeight);
  dom.appendChild(canvas);
  var attribute = {
    container: dom,
    canvas: canvas,
    render: new _cRender["default"](canvas),
    option: null
  };
  Object.assign(this, attribute);
};
/**
 * @description Set chart option
 * @param {Object} option Chart option
 * @param {Boolean} animationEnd Execute animationEnd
 * @return {Undefined} No return
 */


exports["default"] = Charts;

Charts.prototype.setOption = function (option) {
  var animationEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!option || (0, _typeof2["default"])(option) !== 'object') {
    console.error('setOption Missing parameters!');
    return false;
  }

  if (animationEnd) this.render.graphs.forEach(function (graph) {
    return graph.animationEnd();
  });
  var optionCloned = (0, util$1.deepClone)(option, true);
  (0, core.mergeColor)(this, optionCloned);
  (0, core.grid)(this, optionCloned);
  (0, core.axis)(this, optionCloned);
  (0, core.radarAxis)(this, optionCloned);
  (0, core.title)(this, optionCloned);
  (0, core.bar)(this, optionCloned);
  (0, core.line)(this, optionCloned);
  (0, core.pie)(this, optionCloned);
  (0, core.radar)(this, optionCloned);
  (0, core.gauge)(this, optionCloned);
  (0, core.legend)(this, optionCloned);
  this.option = option;
  this.render.launchAnimation(); // console.warn(this)
};
/**
 * @description Resize chart
 * @return {Undefined} No return
 */


Charts.prototype.resize = function () {
  var container = this.container,
      canvas = this.canvas,
      render = this.render,
      option = this.option;
  var clientWidth = container.clientWidth,
      clientHeight = container.clientHeight;
  canvas.setAttribute('width', clientWidth);
  canvas.setAttribute('height', clientHeight);
  render.area = [clientWidth, clientHeight];
  this.setOption(option);
};
});

unwrapExports(charts_class);

var lib = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "changeDefaultConfig", {
  enumerable: true,
  get: function get() {
    return config.changeDefaultConfig;
  }
});
exports["default"] = void 0;

var _charts = interopRequireDefault(charts_class);



var _default = _charts["default"];
exports["default"] = _default;
});

var Charts = unwrapExports(lib);

var script$a = {
  name: 'DvCharts',
  mixins: [autoResize],
  props: {
    option: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const id = uuid();
    return {
      ref: `charts-container-${id}`,
      chartRef: `chart-${id}`,
      chart: null
    };
  },
  watch: {
    option() {
      let {
        chart,
        option
      } = this;
      if (!chart) return;
      if (!option) option = {};
      chart.setOption(option, true);
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        initChart
      } = this;
      initChart();
    },
    initChart() {
      const {
        $refs,
        chartRef,
        option
      } = this;
      const chart = this.chart = new Charts($refs[chartRef]);
      if (!option) return;
      chart.setOption(option);
    },
    onResize() {
      const {
        chart
      } = this;
      if (!chart) return;
      chart.resize();
    }
  }
};

function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-charts-container",
    ref: $data.ref
  }, [createElementVNode("div", {
    class: "charts-canvas-container",
    ref: $data.chartRef
  }, null, 512 /* NEED_PATCH */)], 512 /* NEED_PATCH */);
}

var css_248z$a = ".dv-charts-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-charts-container .charts-canvas-container {\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$a);

script$a.render = render$a;
script$a.__file = "src/components/charts/src/main.vue";

function charts (Vue) {
  Vue.component(script$a.name, script$a);
}

var script$9 = {
  name: 'DvDigitalFlop',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      renderer: null,
      defaultConfig: {
        /**
         * @description Number for digital flop
         * @type {Array<Number>}
         * @default number = []
         * @example number = [10]
         */
        number: [],
        /**
         * @description Content formatter
         * @type {String}
         * @default content = ''
         * @example content = '{nt}个'
         */
        content: '',
        /**
         * @description Number toFixed
         * @type {Number}
         * @default toFixed = 0
         */
        toFixed: 0,
        /**
         * @description Text align
         * @type {String}
         * @default textAlign = 'center'
         * @example textAlign = 'center' | 'left' | 'right'
         */
        textAlign: 'center',
        /**
         * @description rowGap
         * @type {Number}
         @default rowGap = 0
         */
        rowGap: 0,
        /**
         * @description Text style configuration
         * @type {Object} {CRender Class Style}
         */
        style: {
          fontSize: 30,
          fill: '#3de7c9'
        },
        /**
         * @description Number formatter
         * @type {Null|Function}
         */
        formatter: undefined,
        /**
         * @description CRender animationCurve
         * @type {String}
         * @default animationCurve = 'easeOutCubic'
         */
        animationCurve: 'easeOutCubic',
        /**
         * @description CRender animationFrame
         * @type {String}
         * @default animationFrame = 50
         */
        animationFrame: 50
      },
      mergedConfig: null,
      graph: null
    };
  },
  watch: {
    config() {
      const {
        update
      } = this;
      update();
    }
  },
  methods: {
    init() {
      const {
        initRender,
        mergeConfig,
        initGraph
      } = this;
      initRender();
      mergeConfig();
      initGraph();
    },
    initRender() {
      const {
        $refs
      } = this;
      this.renderer = new CRender($refs['digital-flop']);
    },
    mergeConfig() {
      const {
        defaultConfig,
        config
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    initGraph() {
      const {
        getShape,
        getStyle,
        renderer,
        mergedConfig
      } = this;
      const {
        animationCurve,
        animationFrame
      } = mergedConfig;
      const shape = getShape();
      const style = getStyle();
      this.graph = renderer.add({
        name: 'numberText',
        animationCurve,
        animationFrame,
        shape,
        style
      });
    },
    getShape() {
      const {
        number,
        content,
        toFixed,
        textAlign,
        rowGap,
        formatter
      } = this.mergedConfig;
      const [w, h] = this.renderer.area;
      const position = [w / 2, h / 2];
      if (textAlign === 'left') position[0] = 0;
      if (textAlign === 'right') position[0] = w;
      return {
        number,
        content,
        toFixed,
        position,
        rowGap,
        formatter
      };
    },
    getStyle() {
      const {
        style,
        textAlign
      } = this.mergedConfig;
      return util_2(style, {
        textAlign,
        textBaseline: 'middle'
      });
    },
    update() {
      const {
        mergeConfig,
        mergeShape,
        getShape,
        getStyle,
        graph,
        mergedConfig
      } = this;
      graph.animationEnd();
      mergeConfig();
      if (!graph) return;
      const {
        animationCurve,
        animationFrame
      } = mergedConfig;
      const shape = getShape();
      const style = getStyle();
      mergeShape(graph, shape);
      graph.animationCurve = animationCurve;
      graph.animationFrame = animationFrame;
      graph.animation('style', style, true);
      graph.animation('shape', shape);
    },
    mergeShape(graph, shape) {
      const cacheNum = graph.shape.number.length;
      const shapeNum = shape.number.length;
      if (cacheNum !== shapeNum) graph.shape.number = shape.number;
    }
  },
  mounted() {
    const {
      init
    } = this;
    init();
  }
};

const _hoisted_1$9 = {
  class: "dv-digital-flop"
};
const _hoisted_2$9 = {
  ref: "digital-flop"
};
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$9, [createElementVNode("canvas", _hoisted_2$9, null, 512 /* NEED_PATCH */)]);
}

var css_248z$9 = ".dv-digital-flop canvas {\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css_248z$9);

script$9.render = render$9;
script$9.__file = "src/components/digitalFlop/src/main.vue";

var script$8 = {
  name: 'DvActiveRingChart',
  components: {
    dvDigitalFlop: script$9
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultConfig: {
        /**
         * @description Ring radius
         * @type {String|Number}
         * @default radius = '50%'
         * @example radius = '50%' | 100
         */
        radius: '50%',
        /**
         * @description Active ring radius
         * @type {String|Number}
         * @default activeRadius = '55%'
         * @example activeRadius = '55%' | 110
         */
        activeRadius: '55%',
        /**
         * @description Ring data
         * @type {Array<Object>}
         * @default data = [{ name: '', value: 0 }]
         */
        data: [{
          name: '',
          value: 0
        }],
        /**
         * @description Ring line width
         * @type {Number}
         * @default lineWidth = 20
         */
        lineWidth: 20,
        /**
         * @description Active time gap (ms)
         * @type {Number}
         * @default activeTimeGap = 3000
         */
        activeTimeGap: 3000,
        /**
         * @description Ring color (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default color = [Charts Default Color]
         * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        color: [],
        /**
         * @description Digital flop style
         * @type {Object}
         */
        digitalFlopStyle: {
          fontSize: 25,
          fill: '#fff'
        },
        /**
         * @description Digital flop toFixed
         * @type {Number}
         */
        digitalFlopToFixed: 0,
        /**
         * @description Digital flop unit
         * @type {String}
         */
        digitalFlopUnit: '',
        /**
         * @description CRender animationCurve
         * @type {String}
         * @default animationCurve = 'easeOutCubic'
         */
        animationCurve: 'easeOutCubic',
        /**
         * @description CRender animationFrame
         * @type {String}
         * @default animationFrame = 50
         */
        animationFrame: 50,
        /**
         * @description showOriginValue
         * @type {Boolean}
         * @default showOriginValue = false
         */
        showOriginValue: false
      },
      mergedConfig: null,
      chart: null,
      activeIndex: 0,
      animationHandler: ''
    };
  },
  computed: {
    digitalFlop() {
      const {
        mergedConfig,
        activeIndex
      } = this;
      if (!mergedConfig) return {};
      const {
        digitalFlopStyle,
        digitalFlopToFixed,
        data,
        showOriginValue,
        digitalFlopUnit
      } = mergedConfig;
      const value = data.map(({
        value
      }) => value);
      let displayValue;
      if (showOriginValue) {
        displayValue = value[activeIndex];
      } else {
        const sum = value.reduce((all, v) => all + v, 0);
        const percent = parseFloat(value[activeIndex] / sum * 100) || 0;
        displayValue = percent;
      }
      return {
        content: showOriginValue ? `{nt}${digitalFlopUnit}` : `{nt}${digitalFlopUnit || '%'}`,
        number: [displayValue],
        style: digitalFlopStyle,
        toFixed: digitalFlopToFixed
      };
    },
    ringName() {
      const {
        mergedConfig,
        activeIndex
      } = this;
      if (!mergedConfig) return '';
      return mergedConfig.data[activeIndex].name;
    },
    fontSize() {
      const {
        mergedConfig
      } = this;
      if (!mergedConfig) return '';
      return `font-size: ${mergedConfig.digitalFlopStyle.fontSize}px;`;
    }
  },
  watch: {
    config() {
      const {
        animationHandler,
        mergeConfig,
        setRingOption
      } = this;
      clearTimeout(animationHandler);
      this.activeIndex = 0;
      mergeConfig();
      setRingOption();
    }
  },
  methods: {
    init() {
      const {
        initChart,
        mergeConfig,
        setRingOption
      } = this;
      initChart();
      mergeConfig();
      setRingOption();
    },
    initChart() {
      const {
        $refs
      } = this;
      this.chart = new Charts($refs['active-ring-chart']);
    },
    mergeConfig() {
      const {
        defaultConfig,
        config
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    setRingOption() {
      const {
        getRingOption,
        chart,
        ringAnimation
      } = this;
      const option = getRingOption();
      chart.setOption(option, true);
      ringAnimation();
    },
    getRingOption() {
      const {
        mergedConfig,
        getRealRadius
      } = this;
      const radius = getRealRadius();
      mergedConfig.data.forEach(dataItem => {
        dataItem.radius = radius;
      });
      return {
        series: [{
          type: 'pie',
          ...mergedConfig,
          outsideLabel: {
            show: false
          }
        }],
        color: mergedConfig.color
      };
    },
    getRealRadius(active = false) {
      const {
        mergedConfig,
        chart
      } = this;
      const {
        radius,
        activeRadius,
        lineWidth
      } = mergedConfig;
      const maxRadius = Math.min(...chart.render.area) / 2;
      const halfLineWidth = lineWidth / 2;
      let realRadius = active ? activeRadius : radius;
      if (typeof realRadius !== 'number') realRadius = parseInt(realRadius) / 100 * maxRadius;
      const insideRadius = realRadius - halfLineWidth;
      const outSideRadius = realRadius + halfLineWidth;
      return [insideRadius, outSideRadius];
    },
    ringAnimation() {
      let {
        activeIndex,
        getRingOption,
        chart,
        getRealRadius
      } = this;
      const radius = getRealRadius();
      const active = getRealRadius(true);
      const option = getRingOption();
      const {
        data
      } = option.series[0];
      data.forEach((dataItem, i) => {
        if (i === activeIndex) {
          dataItem.radius = active;
        } else {
          dataItem.radius = radius;
        }
      });
      chart.setOption(option, true);
      const {
        activeTimeGap
      } = option.series[0];
      this.animationHandler = setTimeout(foo => {
        activeIndex += 1;
        if (activeIndex >= data.length) activeIndex = 0;
        this.activeIndex = activeIndex;
        this.ringAnimation();
      }, activeTimeGap);
    }
  },
  mounted() {
    const {
      init
    } = this;
    init();
  },
  beforeDestroy() {
    const {
      animationHandler
    } = this;
    clearTimeout(animationHandler);
  }
};

const _hoisted_1$8 = {
  class: "dv-active-ring-chart"
};
const _hoisted_2$8 = {
  class: "active-ring-chart-container",
  ref: "active-ring-chart"
};
const _hoisted_3$7 = {
  class: "active-ring-info"
};
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_dv_digital_flop = resolveComponent("dv-digital-flop");
  return openBlock(), createElementBlock("div", _hoisted_1$8, [createElementVNode("div", _hoisted_2$8, null, 512 /* NEED_PATCH */), createElementVNode("div", _hoisted_3$7, [createVNode(_component_dv_digital_flop, {
    config: $options.digitalFlop
  }, null, 8 /* PROPS */, ["config"]), createElementVNode("div", {
    class: "active-ring-name",
    style: normalizeStyle($options.fontSize)
  }, toDisplayString($options.ringName), 5 /* TEXT, STYLE */)])]);
}

var css_248z$8 = ".dv-active-ring-chart {\n  position: relative;\n}\n.dv-active-ring-chart .active-ring-chart-container {\n  width: 100%;\n  height: 100%;\n}\n.dv-active-ring-chart .active-ring-info {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-active-ring-chart .active-ring-info .dv-digital-flop {\n  width: 100px;\n  height: 30px;\n}\n.dv-active-ring-chart .active-ring-info .active-ring-name {\n  width: 100px;\n  height: 30px;\n  color: #fff;\n  text-align: center;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n";
styleInject(css_248z$8);

script$8.render = render$8;
script$8.__file = "src/components/activeRingChart/src/main.vue";

function activeRingChart (Vue) {
  Vue.component(script$8.name, script$8);
}

var script$7 = {
  name: 'DvCapsuleChart',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultConfig: {
        /**
         * @description Capsule chart data
         * @type {Array<Object>}
         * @default data = []
         * @example data = [{ name: 'foo1', value: 100 }, { name: 'foo2', value: 100 }]
         */
        data: [],
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default color = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']
         * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],
        /**
         * @description Chart unit
         * @type {String}
         * @default unit = ''
         */
        unit: '',
        /**
         * @description Show item value
         * @type {Boolean}
         * @default showValue = false
         */
        showValue: false
      },
      mergedConfig: null,
      capsuleLength: [],
      capsuleValue: [],
      labelData: [],
      labelDataLength: []
    };
  },
  watch: {
    config() {
      const {
        calcData
      } = this;
      calcData();
    }
  },
  methods: {
    calcData() {
      const {
        mergeConfig,
        calcCapsuleLengthAndLabelData
      } = this;
      mergeConfig();
      calcCapsuleLengthAndLabelData();
    },
    mergeConfig() {
      let {
        config,
        defaultConfig
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    calcCapsuleLengthAndLabelData() {
      const {
        data
      } = this.mergedConfig;
      if (!data.length) return;
      const capsuleValue = data.map(({
        value
      }) => value);
      const maxValue = Math.max(...capsuleValue);
      this.capsuleValue = capsuleValue;
      this.capsuleLength = capsuleValue.map(v => maxValue ? v / maxValue : 0);
      const oneFifth = maxValue / 5;
      const labelData = Array.from(new Set(new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth))));
      this.labelData = labelData;
      this.labelDataLength = Array.from(labelData).map(v => maxValue ? v / maxValue : 0);
    }
  },
  mounted() {
    const {
      calcData
    } = this;
    calcData();
  }
};

const _hoisted_1$7 = {
  class: "dv-capsule-chart"
};
const _hoisted_2$7 = {
  class: "label-column"
};
const _hoisted_3$6 = /*#__PURE__*/createElementVNode("div", null, " ", -1 /* HOISTED */);
const _hoisted_4$6 = {
  class: "capsule-container"
};
const _hoisted_5$6 = {
  key: 0,
  class: "capsule-item-value"
};
const _hoisted_6$5 = {
  class: "unit-label"
};
const _hoisted_7$5 = {
  key: 0,
  class: "unit-text"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$7, [$data.mergedConfig ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createElementVNode("div", _hoisted_2$7, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.mergedConfig.data, item => {
    return openBlock(), createElementBlock("div", {
      key: item.name
    }, toDisplayString(item.name), 1 /* TEXT */);
  }), 128 /* KEYED_FRAGMENT */)), _hoisted_3$6]), createElementVNode("div", _hoisted_4$6, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.capsuleLength, (capsule, index) => {
    return openBlock(), createElementBlock("div", {
      class: "capsule-item",
      key: index
    }, [createElementVNode("div", {
      class: "capsule-item-column",
      style: normalizeStyle(`width: ${capsule * 100}%; background-color: ${$data.mergedConfig.colors[index % $data.mergedConfig.colors.length]};`)
    }, [$data.mergedConfig.showValue ? (openBlock(), createElementBlock("div", _hoisted_5$6, toDisplayString($data.capsuleValue[index]), 1 /* TEXT */)) : createCommentVNode("v-if", true)], 4 /* STYLE */)]);
  }), 128 /* KEYED_FRAGMENT */)), createElementVNode("div", _hoisted_6$5, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.labelData, (label, index) => {
    return openBlock(), createElementBlock("div", {
      key: label + index
    }, toDisplayString(label), 1 /* TEXT */);
  }), 128 /* KEYED_FRAGMENT */))])]), $data.mergedConfig.unit ? (openBlock(), createElementBlock("div", _hoisted_7$5, toDisplayString($data.mergedConfig.unit), 1 /* TEXT */)) : createCommentVNode("v-if", true)], 64 /* STABLE_FRAGMENT */)) : createCommentVNode("v-if", true)]);
}

var css_248z$7 = ".dv-capsule-chart {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 10px;\n  color: #fff;\n}\n.dv-capsule-chart .label-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding-right: 10px;\n  text-align: right;\n  font-size: 12px;\n}\n.dv-capsule-chart .label-column div {\n  height: 20px;\n  line-height: 20px;\n}\n.dv-capsule-chart .capsule-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dv-capsule-chart .capsule-item {\n  box-shadow: 0 0 3px #999;\n  height: 10px;\n  margin: 5px 0px;\n  border-radius: 5px;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column {\n  position: relative;\n  height: 8px;\n  margin-top: 1px;\n  border-radius: 5px;\n  transition: all 0.3s;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column .capsule-item-value {\n  font-size: 12px;\n  transform: translateX(100%);\n}\n.dv-capsule-chart .unit-label {\n  height: 20px;\n  font-size: 12px;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.dv-capsule-chart .unit-text {\n  text-align: right;\n  display: flex;\n  align-items: flex-end;\n  font-size: 12px;\n  line-height: 20px;\n  margin-left: 10px;\n}\n";
styleInject(css_248z$7);

script$7.render = render$7;
script$7.__file = "src/components/capsuleChart/src/main.vue";

function capsuleChart (Vue) {
  Vue.component(script$7.name, script$7);
}

var script$6 = {
  name: 'DvWaterLevelPond',
  props: {
    config: Object,
    default: () => ({})
  },
  data() {
    const id = uuid();
    return {
      gradientId: `water-level-pond-${id}`,
      defaultConfig: {
        /**
         * @description Data
         * @type {Array<Number>}
         * @default data = []
         * @example data = [60, 40]
         */
        data: [],
        /**
         * @description Shape of wanter level pond
         * @type {String}
         * @default shape = 'rect'
         * @example shape = 'rect' | 'roundRect' | 'round'
         */
        shape: 'rect',
        /**
         * @description Water wave number
         * @type {Number}
         * @default waveNum = 3
         */
        waveNum: 3,
        /**
         * @description Water wave height (px)
         * @type {Number}
         * @default waveHeight = 40
         */
        waveHeight: 40,
        /**
         * @description Wave opacity
         * @type {Number}
         * @default waveOpacity = 0.4
         */
        waveOpacity: 0.4,
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default colors = ['#00BAFF', '#3DE7C9']
         * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: ['#3DE7C9', '#00BAFF'],
        /**
         * @description Formatter
         * @type {String}
         * @default formatter = '{value}%'
         */
        formatter: '{value}%'
      },
      mergedConfig: {},
      renderer: null,
      svgBorderGradient: [],
      details: '',
      waves: [],
      animation: false
    };
  },
  computed: {
    radius() {
      const {
        shape
      } = this.mergedConfig;
      if (shape === 'round') return '50%';
      if (shape === 'rect') return '0';
      if (shape === 'roundRect') return '10px';
      return '0';
    },
    shape() {
      const {
        shape
      } = this.mergedConfig;
      if (!shape) return 'rect';
      return shape;
    }
  },
  watch: {
    config() {
      const {
        calcData,
        renderer
      } = this;
      renderer.delAllGraph();
      this.waves = [];
      setTimeout(calcData, 0);
    }
  },
  methods: {
    init() {
      const {
        initRender,
        config,
        calcData
      } = this;
      initRender();
      if (!config) return;
      calcData();
    },
    initRender() {
      const {
        $refs
      } = this;
      this.renderer = new CRender($refs['water-pond-level']);
    },
    calcData() {
      const {
        mergeConfig,
        calcSvgBorderGradient,
        calcDetails
      } = this;
      mergeConfig();
      calcSvgBorderGradient();
      calcDetails();
      const {
        addWave,
        animationWave
      } = this;
      addWave();
      animationWave();
    },
    mergeConfig() {
      const {
        config,
        defaultConfig
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config);
    },
    calcSvgBorderGradient() {
      const {
        colors
      } = this.mergedConfig;
      const colorNum = colors.length;
      const colorOffsetGap = 100 / (colorNum - 1);
      this.svgBorderGradient = colors.map((c, i) => [colorOffsetGap * i, c]);
    },
    calcDetails() {
      const {
        data,
        formatter
      } = this.mergedConfig;
      if (!data.length) {
        this.details = '';
        return;
      }
      const maxValue = Math.max(...data);
      this.details = formatter.replace('{value}', maxValue);
    },
    addWave() {
      const {
        renderer,
        getWaveShapes,
        getWaveStyle,
        drawed
      } = this;
      const shapes = getWaveShapes();
      const style = getWaveStyle();
      this.waves = shapes.map(shape => renderer.add({
        name: 'smoothline',
        animationFrame: 300,
        shape,
        style,
        drawed
      }));
    },
    getWaveShapes() {
      const {
        mergedConfig,
        renderer,
        mergeOffset
      } = this;
      const {
        waveNum,
        waveHeight,
        data
      } = mergedConfig;
      const [w, h] = renderer.area;
      const pointsNum = waveNum * 4 + 4;
      const pointXGap = w / waveNum / 2;
      return data.map(v => {
        let points = new Array(pointsNum).fill(0).map((foo, j) => {
          const x = w - pointXGap * j;
          const startY = (1 - v / 100) * h;
          const y = j % 2 === 0 ? startY : startY - waveHeight;
          return [x, y];
        });
        points = points.map(p => mergeOffset(p, [pointXGap * 2, 0]));
        return {
          points
        };
      });
    },
    mergeOffset([x, y], [ox, oy]) {
      return [x + ox, y + oy];
    },
    getWaveStyle() {
      const {
        renderer,
        mergedConfig
      } = this;
      const h = renderer.area[1];
      return {
        gradientColor: mergedConfig.colors,
        gradientType: 'linear',
        gradientParams: [0, 0, 0, h],
        gradientWith: 'fill',
        opacity: mergedConfig.waveOpacity,
        translate: [0, 0]
      };
    },
    drawed({
      shape: {
        points
      }
    }, {
      ctx,
      area
    }) {
      const firstPoint = points[0];
      const lastPoint = points.slice(-1)[0];
      const h = area[1];
      ctx.lineTo(lastPoint[0], h);
      ctx.lineTo(firstPoint[0], h);
      ctx.closePath();
      ctx.fill();
    },
    async animationWave(repeat = 1) {
      const {
        waves,
        renderer,
        animation
      } = this;
      if (animation) return;
      this.animation = true;
      const w = renderer.area[0];
      waves.forEach(graph => {
        graph.attr('style', {
          translate: [0, 0]
        });
        graph.animation('style', {
          translate: [w, 0]
        }, true);
      });
      await renderer.launchAnimation();
      this.animation = false;
      if (!renderer.graphs.length) return;
      this.animationWave(repeat + 1);
    }
  },
  mounted() {
    const {
      init
    } = this;
    init();
  },
  beforeDestroy() {
    const {
      renderer
    } = this;
    renderer.delAllGraph();
    this.waves = [];
  }
};

const _hoisted_1$6 = {
  class: "dv-water-pond-level"
};
const _hoisted_2$6 = {
  key: 0
};
const _hoisted_3$5 = ["id"];
const _hoisted_4$5 = ["offset", "stop-color"];
const _hoisted_5$5 = ["stroke", "fill", "x", "y"];
const _hoisted_6$4 = ["cx", "cy", "rx", "ry", "stroke"];
const _hoisted_7$4 = ["rx", "ry", "width", "height", "stroke"];
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$6, [$data.renderer ? (openBlock(), createElementBlock("svg", _hoisted_2$6, [createElementVNode("defs", null, [createElementVNode("linearGradient", {
    id: $data.gradientId,
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.svgBorderGradient, lc => {
    return openBlock(), createElementBlock("stop", {
      key: lc[0],
      offset: lc[0],
      "stop-color": lc[1]
    }, null, 8 /* PROPS */, _hoisted_4$5);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_3$5)]), createElementVNode("text", {
    stroke: `url(#${$data.gradientId})`,
    fill: `url(#${$data.gradientId})`,
    x: $data.renderer.area[0] / 2 + 8,
    y: $data.renderer.area[1] / 2 + 8
  }, toDisplayString($data.details), 9 /* TEXT, PROPS */, _hoisted_5$5), !$options.shape || $options.shape === 'round' ? (openBlock(), createElementBlock("ellipse", {
    key: 0,
    cx: $data.renderer.area[0] / 2 + 8,
    cy: $data.renderer.area[1] / 2 + 8,
    rx: $data.renderer.area[0] / 2 + 5,
    ry: $data.renderer.area[1] / 2 + 5,
    stroke: `url(#${$data.gradientId})`
  }, null, 8 /* PROPS */, _hoisted_6$4)) : (openBlock(), createElementBlock("rect", {
    key: 1,
    x: "2",
    y: "2",
    rx: $options.shape === 'roundRect' ? 10 : 0,
    ry: $options.shape === 'roundRect' ? 10 : 0,
    width: $data.renderer.area[0] + 12,
    height: $data.renderer.area[1] + 12,
    stroke: `url(#${$data.gradientId})`
  }, null, 8 /* PROPS */, _hoisted_7$4))])) : createCommentVNode("v-if", true), createElementVNode("canvas", {
    ref: "water-pond-level",
    style: normalizeStyle(`border-radius: ${$options.radius};`)
  }, null, 4 /* STYLE */)]);
}

var css_248z$6 = ".dv-water-pond-level {\n  position: relative;\n}\n.dv-water-pond-level svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-water-pond-level text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n.dv-water-pond-level ellipse,\n.dv-water-pond-level rect {\n  fill: none;\n  stroke-width: 3;\n}\n.dv-water-pond-level canvas {\n  margin-top: 8px;\n  margin-left: 8px;\n  width: calc(100% - 16px);\n  height: calc(100% - 16px);\n  box-sizing: border-box;\n}\n";
styleInject(css_248z$6);

script$6.render = render$6;
script$6.__file = "src/components/waterLevelPond/src/main.vue";

function waterLevelPond (Vue) {
  Vue.component(script$6.name, script$6);
}

var script$5 = {
  name: 'DvPercentPond',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const id = uuid();
    return {
      gradientId1: `percent-pond-gradientId1-${id}`,
      gradientId2: `percent-pond-gradientId2-${id}`,
      width: 0,
      height: 0,
      defaultConfig: {
        /**
         * @description Value
         * @type {Number}
         * @default value = 0
         */
        value: 0,
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default colors = ['#00BAFF', '#3DE7C9']
         * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: ['#3DE7C9', '#00BAFF'],
        /**
         * @description Border width
         * @type {Number}
         * @default borderWidth = 3
         */
        borderWidth: 3,
        /**
         * @description Gap between border and pond
         * @type {Number}
         * @default borderGap = 3
         */
        borderGap: 3,
        /**
         * @description Line dash
         * @type {Array<Number>}
         * @default lineDash = [5, 1]
         */
        lineDash: [5, 1],
        /**
         * @description Text color
         * @type {String}
         * @default textColor = '#fff'
         */
        textColor: '#fff',
        /**
         * @description Border radius
         * @type {Number}
         * @default borderRadius = 5
         */
        borderRadius: 5,
        /**
         * @description Local Gradient
         * @type {Boolean}
         * @default localGradient = false
         * @example localGradient = false | true
         */
        localGradient: false,
        /**
         * @description Formatter
         * @type {String}
         * @default formatter = '{value}%'
         */
        formatter: '{value}%'
      },
      mergedConfig: null
    };
  },
  computed: {
    rectWidth() {
      const {
        mergedConfig,
        width
      } = this;
      if (!mergedConfig) return 0;
      const {
        borderWidth
      } = mergedConfig;
      return width - borderWidth;
    },
    rectHeight() {
      const {
        mergedConfig,
        height
      } = this;
      if (!mergedConfig) return 0;
      const {
        borderWidth
      } = mergedConfig;
      return height - borderWidth;
    },
    points() {
      const {
        mergedConfig,
        width,
        height
      } = this;
      const halfHeight = height / 2;
      if (!mergedConfig) return `0, ${halfHeight} 0, ${halfHeight}`;
      const {
        borderWidth,
        borderGap,
        value
      } = mergedConfig;
      const polylineLength = (width - (borderWidth + borderGap) * 2) / 100 * value;
      return `
        ${borderWidth + borderGap}, ${halfHeight}
        ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
      `;
    },
    polylineWidth() {
      const {
        mergedConfig,
        height
      } = this;
      if (!mergedConfig) return 0;
      const {
        borderWidth,
        borderGap
      } = mergedConfig;
      return height - (borderWidth + borderGap) * 2;
    },
    linearGradient() {
      const {
        mergedConfig
      } = this;
      if (!mergedConfig) return [];
      const {
        colors
      } = mergedConfig;
      const colorNum = colors.length;
      const colorOffsetGap = 100 / (colorNum - 1);
      return colors.map((c, i) => [colorOffsetGap * i, c]);
    },
    polylineGradient() {
      const {
        gradientId1,
        gradientId2,
        mergedConfig
      } = this;
      if (!mergedConfig) return gradientId2;
      if (mergedConfig.localGradient) return gradientId1;
      return gradientId2;
    },
    gradient2XPos() {
      const {
        mergedConfig
      } = this;
      if (!mergedConfig) return '100%';
      const {
        value
      } = mergedConfig;
      return `${200 - value}%`;
    },
    details() {
      const {
        mergedConfig
      } = this;
      if (!mergedConfig) return '';
      const {
        value,
        formatter
      } = mergedConfig;
      return formatter.replace('{value}', value);
    }
  },
  watch: {
    config() {
      const {
        mergeConfig
      } = this;
      mergeConfig();
    }
  },
  methods: {
    async init() {
      const {
        initWH,
        config,
        mergeConfig
      } = this;
      await initWH();
      if (!config) return;
      mergeConfig();
    },
    async initWH() {
      const {
        $nextTick,
        $refs
      } = this;
      await $nextTick();
      const {
        clientWidth,
        clientHeight
      } = $refs['percent-pond'];
      this.width = clientWidth;
      this.height = clientHeight;
    },
    mergeConfig() {
      const {
        config,
        defaultConfig
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    }
  },
  mounted() {
    const {
      init
    } = this;
    init();
  }
};

const _hoisted_1$5 = {
  class: "dv-percent-pond",
  ref: "percent-pond"
};
const _hoisted_2$5 = ["id"];
const _hoisted_3$4 = ["offset", "stop-color"];
const _hoisted_4$4 = ["id", "x2"];
const _hoisted_5$4 = ["offset", "stop-color"];
const _hoisted_6$3 = ["x", "y", "rx", "ry", "stroke-width", "stroke", "width", "height"];
const _hoisted_7$3 = ["stroke-width", "stroke-dasharray", "stroke", "points"];
const _hoisted_8$2 = ["stroke", "fill", "x", "y"];
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$5, [(openBlock(), createElementBlock("svg", null, [createElementVNode("defs", null, [createElementVNode("linearGradient", {
    id: $data.gradientId1,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.linearGradient, lc => {
    return openBlock(), createElementBlock("stop", {
      key: lc[0],
      offset: `${lc[0]}%`,
      "stop-color": lc[1]
    }, null, 8 /* PROPS */, _hoisted_3$4);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_2$5), createElementVNode("linearGradient", {
    id: $data.gradientId2,
    x1: "0%",
    y1: "0%",
    x2: $options.gradient2XPos,
    y2: "0%"
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.linearGradient, lc => {
    return openBlock(), createElementBlock("stop", {
      key: lc[0],
      offset: `${lc[0]}%`,
      "stop-color": lc[1]
    }, null, 8 /* PROPS */, _hoisted_5$4);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_4$4)]), createElementVNode("rect", {
    x: $data.mergedConfig ? $data.mergedConfig.borderWidth / 2 : '0',
    y: $data.mergedConfig ? $data.mergedConfig.borderWidth / 2 : '0',
    rx: $data.mergedConfig ? $data.mergedConfig.borderRadius : '0',
    ry: $data.mergedConfig ? $data.mergedConfig.borderRadius : '0',
    fill: "transparent",
    "stroke-width": $data.mergedConfig ? $data.mergedConfig.borderWidth : '0',
    stroke: `url(#${$data.gradientId1})`,
    width: $options.rectWidth > 0 ? $options.rectWidth : 0,
    height: $options.rectHeight > 0 ? $options.rectHeight : 0
  }, null, 8 /* PROPS */, _hoisted_6$3), createElementVNode("polyline", {
    "stroke-width": $options.polylineWidth,
    "stroke-dasharray": $data.mergedConfig ? $data.mergedConfig.lineDash.join(',') : '0',
    stroke: `url(#${$options.polylineGradient})`,
    points: $options.points
  }, null, 8 /* PROPS */, _hoisted_7$3), createElementVNode("text", {
    stroke: $data.mergedConfig ? $data.mergedConfig.textColor : '#fff',
    fill: $data.mergedConfig ? $data.mergedConfig.textColor : '#fff',
    x: $data.width / 2,
    y: $data.height / 2
  }, toDisplayString($options.details), 9 /* TEXT, PROPS */, _hoisted_8$2)]))], 512 /* NEED_PATCH */);
}

var css_248z$5 = ".dv-percent-pond {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.dv-percent-pond svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-percent-pond polyline {\n  transition: all 0.3s;\n}\n.dv-percent-pond text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n";
styleInject(css_248z$5);

script$5.render = render$5;
script$5.__file = "src/components/percentPond/src/main.vue";

function percentPond (Vue) {
  Vue.component(script$5.name, script$5);
}

var script$4 = {
  name: 'DvFlylineChart',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    dev: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'dv-flyline-chart',
      unique: Math.random(),
      maskId: `flyline-mask-id-${id}`,
      maskCircleId: `mask-circle-id-${id}`,
      gradientId: `gradient-id-${id}`,
      gradient2Id: `gradient2-id-${id}`,
      defaultConfig: {
        /**
         * @description Flyline chart center point
         * @type {Array<Number>}
         * @default centerPoint = [0, 0]
         */
        centerPoint: [0, 0],
        /**
         * @description Flyline start points
         * @type {Array<Array<Number>>}
         * @default points = []
         * @example points = [[10, 10], [100, 100]]
         */
        points: [],
        /**
         * @description Flyline width
         * @type {Number}
         * @default lineWidth = 1
         */
        lineWidth: 1,
        /**
         * @description Orbit color
         * @type {String}
         * @default orbitColor = 'rgba(103, 224, 227, .2)'
         */
        orbitColor: 'rgba(103, 224, 227, .2)',
        /**
         * @description Flyline color
         * @type {String}
         * @default orbitColor = '#ffde93'
         */
        flylineColor: '#ffde93',
        /**
         * @description K value
         * @type {Number}
         * @default k = -0.5
         * @example k = -1 ~ 1
         */
        k: -0.5,
        /**
         * @description Flyline curvature
         * @type {Number}
         * @default curvature = 5
         */
        curvature: 5,
        /**
         * @description Flyline radius
         * @type {Number}
         * @default flylineRadius = 100
         */
        flylineRadius: 100,
        /**
         * @description Flyline animation duration
         * @type {Array<Number>}
         * @default duration = [20, 30]
         */
        duration: [20, 30],
        /**
         * @description Relative points position
         * @type {Boolean}
         * @default relative = true
         */
        relative: true,
        /**
         * @description Back ground image url
         * @type {String}
         * @default bgImgUrl = ''
         * @example bgImgUrl = './img/bg.jpg'
         */
        bgImgUrl: '',
        /**
         * @description Text configuration
         * @type {Object}
         */
        text: {
          /**
           * @description Text offset
           * @type {Array<Number>}
           * @default offset = [0, 15]
           */
          offset: [0, 15],
          /**
           * @description Text color
           * @type {String}
           * @default color = '#ffdb5c'
           */
          color: '#ffdb5c',
          /**
           * @description Text font size
           * @type {Number}
           * @default fontSize = 12
           */
          fontSize: 12
        },
        /**
         * @description Halo configuration
         * @type {Object}
         */
        halo: {
          /**
           * @description Weather to show halo
           * @type {Boolean}
           * @default show = true
           * @example show = true | false
           */
          show: true,
          /**
           * @description Halo animation duration (10 = 1s)
           * @type {Number}
           * @default duration = 30
           */
          duration: 30,
          /**
           * @description Halo color
           * @type {String}
           * @default color = '#fb7293'
           */
          color: '#fb7293',
          /**
           * @description Halo max radius
           * @type {Number}
           * @default radius = 120
           */
          radius: 120
        },
        /**
         * @description Center point img configuration
         * @type {Object}
         */
        centerPointImg: {
          /**
           * @description Center point img width
           * @type {Number}
           * @default width = 40
           */
          width: 40,
          /**
           * @description Center point img height
           * @type {Number}
           * @default height = 40
           */
          height: 40,
          /**
           * @description Center point img url
           * @type {String}
           * @default url = ''
           */
          url: ''
        },
        /**
         * @description Points img configuration
         * @type {Object}
         * @default radius = 120
         */
        pointsImg: {
          /**
           * @description Points img width
           * @type {Number}
           * @default width = 15
           */
          width: 15,
          /**
           * @description Points img height
           * @type {Number}
           * @default height = 15
           */
          height: 15,
          /**
           * @description Points img url
           * @type {String}
           * @default url = ''
           */
          url: ''
        }
      },
      mergedConfig: null,
      paths: [],
      lengths: [],
      times: [],
      texts: []
    };
  },
  watch: {
    config() {
      const {
        calcData
      } = this;
      calcData();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcData
      } = this;
      calcData();
    },
    onResize() {
      const {
        calcData
      } = this;
      calcData();
    },
    async calcData() {
      const {
        mergeConfig,
        createFlylinePaths,
        calcLineLengths
      } = this;
      mergeConfig();
      createFlylinePaths();
      await calcLineLengths();
      const {
        calcTimes,
        calcTexts
      } = this;
      calcTimes();
      calcTexts();
    },
    mergeConfig() {
      let {
        config,
        defaultConfig
      } = this;
      const mergedConfig = util_2(util_1(defaultConfig, true), config || {});
      const {
        points
      } = mergedConfig;
      mergedConfig.points = points.map(item => {
        if (item instanceof Array) {
          return {
            position: item,
            text: ''
          };
        }
        return item;
      });
      this.mergedConfig = mergedConfig;
    },
    createFlylinePaths() {
      const {
        getPath,
        mergedConfig,
        width,
        height
      } = this;
      let {
        centerPoint,
        points,
        relative
      } = mergedConfig;
      points = points.map(({
        position
      }) => position);
      if (relative) {
        centerPoint = [width * centerPoint[0], height * centerPoint[1]];
        points = points.map(([x, y]) => [width * x, height * y]);
      }
      this.paths = points.map(point => getPath(centerPoint, point));
    },
    getPath(center, point) {
      const {
        getControlPoint
      } = this;
      const controlPoint = getControlPoint(center, point);
      return [point, controlPoint, center];
    },
    getControlPoint([sx, sy], [ex, ey]) {
      const {
        getKLinePointByx,
        mergedConfig
      } = this;
      const {
        curvature,
        k
      } = mergedConfig;
      const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2];
      const distance = getPointDistance([sx, sy], [ex, ey]);
      const targetLength = distance / curvature;
      const disDived = targetLength / 2;
      let [dx, dy] = [mx, my];
      do {
        dx += disDived;
        dy = getKLinePointByx(k, [mx, my], dx)[1];
      } while (getPointDistance([mx, my], [dx, dy]) < targetLength);
      return [dx, dy];
    },
    getKLinePointByx(k, [lx, ly], x) {
      const y = ly - k * lx + k * x;
      return [x, y];
    },
    async calcLineLengths() {
      const {
        $nextTick,
        paths,
        $refs
      } = this;
      await $nextTick();
      this.lengths = paths.map((foo, i) => $refs[`path${i}`][0].getTotalLength());
    },
    calcTimes() {
      const {
        duration,
        points
      } = this.mergedConfig;
      this.times = points.map(foo => randomExtend(...duration) / 10);
    },
    calcTexts() {
      const {
        points
      } = this.mergedConfig;
      this.texts = points.map(({
        text
      }) => text);
    },
    consoleClickPos({
      offsetX,
      offsetY
    }) {
      const {
        width,
        height,
        dev
      } = this;
      if (!dev) return;
      const relativeX = (offsetX / width).toFixed(2);
      const relativeY = (offsetY / height).toFixed(2);
      console.warn(`dv-flyline-chart DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`);
    }
  }
};

const _hoisted_1$4 = ["width", "height"];
const _hoisted_2$4 = ["id"];
const _hoisted_3$3 = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "#fff",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_4$3 = /*#__PURE__*/createElementVNode("stop", {
  offset: "100%",
  "stop-color": "#fff",
  "stop-opacity": "0"
}, null, -1 /* HOISTED */);
const _hoisted_5$3 = [_hoisted_3$3, _hoisted_4$3];
const _hoisted_6$2 = ["id"];
const _hoisted_7$2 = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "#fff",
  "stop-opacity": "0"
}, null, -1 /* HOISTED */);
const _hoisted_8$1 = /*#__PURE__*/createElementVNode("stop", {
  offset: "100%",
  "stop-color": "#fff",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_9$1 = [_hoisted_7$2, _hoisted_8$1];
const _hoisted_10$1 = ["id", "cx", "cy"];
const _hoisted_11$1 = ["values", "dur"];
const _hoisted_12$1 = ["dur"];
const _hoisted_13$1 = ["xlink:href", "width", "height", "x", "y"];
const _hoisted_14$1 = ["id"];
const _hoisted_15$1 = ["xlink:href", "fill"];
const _hoisted_16$1 = ["xlink:href", "fill", "mask"];
const _hoisted_17$1 = ["id", "d"];
const _hoisted_18$1 = ["xlink:href", "stroke-width", "stroke"];
const _hoisted_19$1 = ["xlink:href", "stroke-width", "stroke", "mask"];
const _hoisted_20$1 = ["from", "to", "dur"];
const _hoisted_21$1 = ["id"];
const _hoisted_22$1 = ["r", "fill"];
const _hoisted_23$1 = ["dur", "path"];
const _hoisted_24$1 = ["xlink:href", "width", "height", "x", "y"];
const _hoisted_25 = ["fill", "x", "y"];
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-flyline-chart",
    ref: "dv-flyline-chart",
    style: normalizeStyle(`background-image: url(${$data.mergedConfig ? $data.mergedConfig.bgImgUrl : ''})`),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.consoleClickPos && $options.consoleClickPos(...args))
  }, [$data.mergedConfig ? (openBlock(), createElementBlock("svg", {
    key: 0,
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("radialGradient", {
    id: $data.gradientId,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, _hoisted_5$3, 8 /* PROPS */, _hoisted_2$4), createElementVNode("radialGradient", {
    id: $data.gradient2Id,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, _hoisted_9$1, 8 /* PROPS */, _hoisted_6$2), $data.paths[0] ? (openBlock(), createElementBlock("circle", {
    key: 0,
    id: `circle${$data.paths[0].toString()}`,
    cx: $data.paths[0][2][0],
    cy: $data.paths[0][2][1]
  }, [createElementVNode("animate", {
    attributeName: "r",
    values: `1;${$data.mergedConfig.halo.radius}`,
    dur: $data.mergedConfig.halo.duration / 10 + 's',
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_11$1), createElementVNode("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: $data.mergedConfig.halo.duration / 10 + 's',
    repeatCount: "indefinite"
  }, null, 8 /* PROPS */, _hoisted_12$1)], 8 /* PROPS */, _hoisted_10$1)) : createCommentVNode("v-if", true)]), $data.paths[0] ? (openBlock(), createElementBlock("image", {
    key: 0,
    "xlink:href": $data.mergedConfig.centerPointImg.url,
    width: $data.mergedConfig.centerPointImg.width,
    height: $data.mergedConfig.centerPointImg.height,
    x: $data.paths[0][2][0] - $data.mergedConfig.centerPointImg.width / 2,
    y: $data.paths[0][2][1] - $data.mergedConfig.centerPointImg.height / 2
  }, null, 8 /* PROPS */, _hoisted_13$1)) : createCommentVNode("v-if", true), createElementVNode("mask", {
    id: `maskhalo${$data.paths[0].toString()}`
  }, [$data.paths[0] ? (openBlock(), createElementBlock("use", {
    key: 0,
    "xlink:href": `#circle${$data.paths[0].toString()}`,
    fill: `url(#${$data.gradient2Id})`
  }, null, 8 /* PROPS */, _hoisted_15$1)) : createCommentVNode("v-if", true)], 8 /* PROPS */, _hoisted_14$1), $data.paths[0] && $data.mergedConfig.halo.show ? (openBlock(), createElementBlock("use", {
    key: 1,
    "xlink:href": `#circle${$data.paths[0].toString()}`,
    fill: $data.mergedConfig.halo.color,
    mask: `url(#maskhalo${$data.paths[0].toString()})`
  }, null, 8 /* PROPS */, _hoisted_16$1)) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList($data.paths, (path, i) => {
    return openBlock(), createElementBlock("g", {
      key: i
    }, [createElementVNode("defs", null, [createElementVNode("path", {
      id: `path${path.toString()}`,
      ref_for: true,
      ref: `path${i}`,
      d: `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`,
      fill: "transparent"
    }, null, 8 /* PROPS */, _hoisted_17$1)]), createElementVNode("use", {
      "xlink:href": `#path${path.toString()}`,
      "stroke-width": $data.mergedConfig.lineWidth,
      stroke: $data.mergedConfig.orbitColor
    }, null, 8 /* PROPS */, _hoisted_18$1), $data.lengths[i] ? (openBlock(), createElementBlock("use", {
      key: 0,
      "xlink:href": `#path${path.toString()}`,
      "stroke-width": $data.mergedConfig.lineWidth,
      stroke: $data.mergedConfig.flylineColor,
      mask: `url(#mask${$data.unique}${path.toString()})`
    }, [createElementVNode("animate", {
      attributeName: "stroke-dasharray",
      from: `0, ${$data.lengths[i]}`,
      to: `${$data.lengths[i]}, 0`,
      dur: $data.times[i] || 0,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_20$1)], 8 /* PROPS */, _hoisted_19$1)) : createCommentVNode("v-if", true), createElementVNode("mask", {
      id: `mask${$data.unique}${path.toString()}`
    }, [createElementVNode("circle", {
      cx: "0",
      cy: "0",
      r: $data.mergedConfig.flylineRadius,
      fill: `url(#${$data.gradientId})`
    }, [createElementVNode("animateMotion", {
      dur: $data.times[i] || 0,
      path: `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`,
      rotate: "auto",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_23$1)], 8 /* PROPS */, _hoisted_22$1)], 8 /* PROPS */, _hoisted_21$1), createElementVNode("image", {
      "xlink:href": $data.mergedConfig.pointsImg.url,
      width: $data.mergedConfig.pointsImg.width,
      height: $data.mergedConfig.pointsImg.height,
      x: path[0][0] - $data.mergedConfig.pointsImg.width / 2,
      y: path[0][1] - $data.mergedConfig.pointsImg.height / 2
    }, null, 8 /* PROPS */, _hoisted_24$1), createElementVNode("text", {
      style: normalizeStyle(`fontSize:${$data.mergedConfig.text.fontSize}px;`),
      fill: $data.mergedConfig.text.color,
      x: path[0][0] + $data.mergedConfig.text.offset[0],
      y: path[0][1] + $data.mergedConfig.text.offset[1]
    }, toDisplayString($data.texts[i]), 13 /* TEXT, STYLE, PROPS */, _hoisted_25)]);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_1$4)) : createCommentVNode("v-if", true)], 4 /* STYLE */);
}

var css_248z$4 = ".dv-flyline-chart {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart polyline {\n  transition: all 0.3s;\n}\n.dv-flyline-chart text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n";
styleInject(css_248z$4);

script$4.render = render$4;
script$4.__file = "src/components/flylineChart/src/main.vue";

function flylineChart (Vue) {
  Vue.component(script$4.name, script$4);
}

var script$3 = {
  name: 'DvFlylineChartEnhanced',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    dev: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const id = uuid();
    return {
      ref: 'dv-flyline-chart-enhanced',
      unique: Math.random(),
      flylineGradientId: `flyline-gradient-id-${id}`,
      haloGradientId: `halo-gradient-id-${id}`,
      /**
       * @description Type Declaration
       * 
       * interface Halo {
       *    show?: boolean
       *    duration?: [number, number]
       *    color?: string
       *    radius?: number
       * }
       * 
       * interface Text {
       *    show?: boolean
       *    offset?: [number, number]
       *    color?: string
       *    fontSize?: number
       * }
       * 
       * interface Icon {
       *    show?: boolean
       *    src?: string
       *    width?: number
       *    height?: number
       * }
       * 
       * interface Point {
       *    name: string
       *    coordinate: [number, number]
       *    halo?: Halo
       *    text?: Text
       *    icon?: Icon
       * }
       * 
       * interface Line {
       *    width?: number
       *    color?: string
       *    orbitColor?: string
       *    duration?: [number, number]
       *    radius?: string
       * }
       * 
       * interface Flyline extends Line {
       *    source: string
       *    target: string
       * }
       * 
       * interface FlylineWithPath extends Flyline {
       *    d: string
       *    path: [[number, number], [number, number], [number, number]]
       *    key: string
       * }
       */
      defaultConfig: {
        /**
         * @description Flyline chart points
         * @type {Point[]}
         * @default points = []
         */
        points: [],
        /**
         * @description Lines
         * @type {Flyline[]}
         * @default lines = []
         */
        lines: [],
        /**
         * @description Global halo configuration
         * @type {Halo}
         */
        halo: {
          /**
           * @description Whether to show halo
           * @type {Boolean}
           * @default show = false
           */
          show: false,
          /**
           * @description Halo animation duration (1s = 10)
           * @type {[number, number]}
           */
          duration: [20, 30],
          /**
           * @description Halo color
           * @type {String}
           * @default color = '#fb7293'
           */
          color: '#fb7293',
          /**
           * @description Halo radius
           * @type {Number}
           * @default radius = 120
           */
          radius: 120
        },
        /**
         * @description Global text configuration
         * @type {Text}
         */
        text: {
          /**
           * @description Whether to show text
           * @type {Boolean}
           * @default show = false
           */
          show: false,
          /**
           * @description Text offset
           * @type {[number, number]}
           * @default offset = [0, 15]
           */
          offset: [0, 15],
          /**
           * @description Text color
           * @type {String}
           * @default color = '#ffdb5c'
           */
          color: '#ffdb5c',
          /**
           * @description Text font size
           * @type {Number}
           * @default fontSize = 12
           */
          fontSize: 12
        },
        /**
         * @description Global icon configuration
         * @type {Icon}
         */
        icon: {
          /**
           * @description Whether to show icon
           * @type {Boolean}
           * @default show = false
           */
          show: false,
          /**
           * @description Icon src
           * @type {String}
           * @default src = ''
           */
          src: '',
          /**
           * @description Icon width
           * @type {Number}
           * @default width = 15
           */
          width: 15,
          /**
           * @description Icon height
           * @type {Number}
           * @default width = 15
           */
          height: 15
        },
        /**
         * @description Global line configuration
         * @type {Line}
         */
        line: {
          /**
           * @description Line width
           * @type {Number}
           * @default width = 1
           */
          width: 1,
          /**
           * @description Flyline color
           * @type {String}
           * @default color = '#ffde93'
           */
          color: '#ffde93',
          /**
           * @description Orbit color
           * @type {String}
           * @default orbitColor = 'rgba(103, 224, 227, .2)'
           */
          orbitColor: 'rgba(103, 224, 227, .2)',
          /**
           * @description Flyline animation duration
           * @type {[number, number]}
           * @default duration = [20, 30]
           */
          duration: [20, 30],
          /**
           * @description Flyline radius
           * @type {Number}
           * @default radius = 100
           */
          radius: 100
        },
        /**
         * @description Back ground image url
         * @type {String}
         * @default bgImgSrc = ''
         */
        bgImgSrc: '',
        /**
         * @description K value
         * @type {Number}
         * @default k = -0.5
         * @example k = -1 ~ 1
         */
        k: -0.5,
        /**
         * @description Flyline curvature
         * @type {Number}
         * @default curvature = 5
         */
        curvature: 5,
        /**
         * @description Relative points position
         * @type {Boolean}
         * @default relative = true
         */
        relative: true
      },
      /**
       * @description Fly line data
       * @type {FlylineWithPath[]}
       * @default flylines = []
       */
      flylines: [],
      /**
       * @description Fly line lengths
       * @type {Number[]}
       * @default flylineLengths = []
       */
      flylineLengths: [],
      /**
       * @description Fly line points
       * @default flylinePoints = []
       */
      flylinePoints: [],
      mergedConfig: null
    };
  },
  watch: {
    config() {
      const {
        calcData
      } = this;
      calcData();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcData
      } = this;
      calcData();
    },
    onResize() {
      const {
        calcData
      } = this;
      calcData();
    },
    async calcData() {
      const {
        mergeConfig,
        calcflylinePoints,
        calcLinePaths
      } = this;
      mergeConfig();
      calcflylinePoints();
      calcLinePaths();
      const {
        calcLineLengths
      } = this;
      await calcLineLengths();
    },
    mergeConfig() {
      let {
        config,
        defaultConfig
      } = this;
      const mergedConfig = util_2(util_1(defaultConfig, true), config || {});
      const {
        points,
        lines,
        halo,
        text,
        icon,
        line
      } = mergedConfig;
      mergedConfig.points = points.map(item => {
        item.halo = util_2(util_1(halo, true), item.halo || {});
        item.text = util_2(util_1(text, true), item.text || {});
        item.icon = util_2(util_1(icon, true), item.icon || {});
        return item;
      });
      mergedConfig.lines = lines.map(item => {
        return util_2(util_1(line, true), item);
      });
      this.mergedConfig = mergedConfig;
    },
    calcflylinePoints() {
      const {
        mergedConfig,
        width,
        height
      } = this;
      const {
        relative,
        points
      } = mergedConfig;
      this.flylinePoints = points.map((item, i) => {
        const {
          coordinate: [x, y],
          halo,
          icon,
          text
        } = item;
        if (relative) item.coordinate = [x * width, y * height];
        item.halo.time = randomExtend(...halo.duration) / 10;
        const {
          width: iw,
          height: ih
        } = icon;
        item.icon.x = item.coordinate[0] - iw / 2;
        item.icon.y = item.coordinate[1] - ih / 2;
        const [ox, oy] = text.offset;
        item.text.x = item.coordinate[0] + ox;
        item.text.y = item.coordinate[1] + oy;
        item.key = `${item.coordinate.toString()}${i}`;
        return item;
      });
    },
    calcLinePaths() {
      const {
        getPath,
        mergedConfig
      } = this;
      const {
        points,
        lines
      } = mergedConfig;
      this.flylines = lines.map(item => {
        const {
          source,
          target,
          duration
        } = item;
        const sourcePoint = points.find(({
          name
        }) => name === source).coordinate;
        const targetPoint = points.find(({
          name
        }) => name === target).coordinate;
        const path = getPath(sourcePoint, targetPoint).map(item => item.map(v => parseFloat(v.toFixed(10))));
        const d = `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`;
        const key = `path${path.toString()}`;
        const time = randomExtend(...duration) / 10;
        return {
          ...item,
          path,
          key,
          d,
          time
        };
      });
    },
    getPath(start, end) {
      const {
        getControlPoint
      } = this;
      const controlPoint = getControlPoint(start, end);
      return [start, controlPoint, end];
    },
    getControlPoint([sx, sy], [ex, ey]) {
      const {
        getKLinePointByx,
        mergedConfig
      } = this;
      const {
        curvature,
        k
      } = mergedConfig;
      const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2];
      const distance = getPointDistance([sx, sy], [ex, ey]);
      const targetLength = distance / curvature;
      const disDived = targetLength / 2;
      let [dx, dy] = [mx, my];
      do {
        dx += disDived;
        dy = getKLinePointByx(k, [mx, my], dx)[1];
      } while (getPointDistance([mx, my], [dx, dy]) < targetLength);
      return [dx, dy];
    },
    getKLinePointByx(k, [lx, ly], x) {
      const y = ly - k * lx + k * x;
      return [x, y];
    },
    async calcLineLengths() {
      const {
        $nextTick,
        flylines,
        $refs
      } = this;
      await $nextTick();
      this.flylineLengths = flylines.map(({
        key
      }) => $refs[key][0].getTotalLength());
    },
    consoleClickPos({
      offsetX,
      offsetY
    }) {
      const {
        width,
        height,
        dev
      } = this;
      if (!dev) return;
      const relativeX = (offsetX / width).toFixed(2);
      const relativeY = (offsetY / height).toFixed(2);
      console.warn(`dv-flyline-chart-enhanced DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`);
    }
  }
};

const _hoisted_1$3 = ["width", "height"];
const _hoisted_2$3 = ["id"];
const _hoisted_3$2 = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "#fff",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_4$2 = /*#__PURE__*/createElementVNode("stop", {
  offset: "100%",
  "stop-color": "#fff",
  "stop-opacity": "0"
}, null, -1 /* HOISTED */);
const _hoisted_5$2 = [_hoisted_3$2, _hoisted_4$2];
const _hoisted_6$1 = ["id"];
const _hoisted_7$1 = /*#__PURE__*/createElementVNode("stop", {
  offset: "0%",
  "stop-color": "#fff",
  "stop-opacity": "0"
}, null, -1 /* HOISTED */);
const _hoisted_8 = /*#__PURE__*/createElementVNode("stop", {
  offset: "100%",
  "stop-color": "#fff",
  "stop-opacity": "1"
}, null, -1 /* HOISTED */);
const _hoisted_9 = [_hoisted_7$1, _hoisted_8];
const _hoisted_10 = ["id", "cx", "cy"];
const _hoisted_11 = ["values", "dur"];
const _hoisted_12 = ["dur"];
const _hoisted_13 = ["id"];
const _hoisted_14 = ["xlink:href", "fill"];
const _hoisted_15 = ["xlink:href", "fill", "mask"];
const _hoisted_16 = ["xlink:href", "width", "height", "x", "y"];
const _hoisted_17 = ["fill", "x", "y"];
const _hoisted_18 = ["id", "d"];
const _hoisted_19 = ["xlink:href", "stroke-width", "stroke"];
const _hoisted_20 = ["id"];
const _hoisted_21 = ["r", "fill"];
const _hoisted_22 = ["dur", "path"];
const _hoisted_23 = ["xlink:href", "stroke-width", "stroke", "mask"];
const _hoisted_24 = ["from", "to", "dur"];
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-flyline-chart-enhanced",
    style: normalizeStyle(`background-image: url(${$data.mergedConfig ? $data.mergedConfig.bgImgSrc : ''})`),
    ref: $data.ref,
    onClick: _cache[0] || (_cache[0] = (...args) => $options.consoleClickPos && $options.consoleClickPos(...args))
  }, [$data.flylines.length ? (openBlock(), createElementBlock("svg", {
    key: 0,
    width: _ctx.width,
    height: _ctx.height
  }, [createElementVNode("defs", null, [createElementVNode("radialGradient", {
    id: $data.flylineGradientId,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, _hoisted_5$2, 8 /* PROPS */, _hoisted_2$3), createElementVNode("radialGradient", {
    id: $data.haloGradientId,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, _hoisted_9, 8 /* PROPS */, _hoisted_6$1)]), createCommentVNode(" points "), (openBlock(true), createElementBlock(Fragment, null, renderList($data.flylinePoints, point => {
    return openBlock(), createElementBlock("g", {
      key: point.key + Math.random()
    }, [createElementVNode("defs", null, [point.halo.show ? (openBlock(), createElementBlock("circle", {
      key: 0,
      id: `halo${$data.unique}${point.key}`,
      cx: point.coordinate[0],
      cy: point.coordinate[1]
    }, [createElementVNode("animate", {
      attributeName: "r",
      values: `1;${point.halo.radius}`,
      dur: `${point.halo.time}s`,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_11), createElementVNode("animate", {
      attributeName: "opacity",
      values: "1;0",
      dur: `${point.halo.time}s`,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_12)], 8 /* PROPS */, _hoisted_10)) : createCommentVNode("v-if", true)]), createCommentVNode(" halo gradient mask "), createElementVNode("mask", {
      id: `mask${$data.unique}${point.key}`
    }, [point.halo.show ? (openBlock(), createElementBlock("use", {
      key: 0,
      "xlink:href": `#halo${$data.unique}${point.key}`,
      fill: `url(#${$data.haloGradientId})`
    }, null, 8 /* PROPS */, _hoisted_14)) : createCommentVNode("v-if", true)], 8 /* PROPS */, _hoisted_13), createCommentVNode(" point halo "), point.halo.show ? (openBlock(), createElementBlock("use", {
      key: 0,
      "xlink:href": `#halo${$data.unique}${point.key}`,
      fill: point.halo.color,
      mask: `url(#mask${$data.unique}${point.key})`
    }, null, 8 /* PROPS */, _hoisted_15)) : createCommentVNode("v-if", true), createCommentVNode(" point icon "), point.icon.show ? (openBlock(), createElementBlock("image", {
      key: 1,
      "xlink:href": point.icon.src,
      width: point.icon.width,
      height: point.icon.height,
      x: point.icon.x,
      y: point.icon.y
    }, null, 8 /* PROPS */, _hoisted_16)) : createCommentVNode("v-if", true), createCommentVNode(" point text "), point.text.show ? (openBlock(), createElementBlock("text", {
      key: 2,
      style: normalizeStyle(`fontSize:${point.text.fontSize}px;color:${point.text.color}`),
      fill: point.text.color,
      x: point.text.x,
      y: point.text.y
    }, toDisplayString(point.name), 13 /* TEXT, STYLE, PROPS */, _hoisted_17)) : createCommentVNode("v-if", true)]);
  }), 128 /* KEYED_FRAGMENT */)), createCommentVNode(" flylines "), (openBlock(true), createElementBlock(Fragment, null, renderList($data.flylines, (line, i) => {
    return openBlock(), createElementBlock("g", {
      key: line.key + Math.random()
    }, [createElementVNode("defs", null, [createElementVNode("path", {
      id: line.key,
      ref_for: true,
      ref: line.key,
      d: line.d,
      fill: "transparent"
    }, null, 8 /* PROPS */, _hoisted_18)]), createCommentVNode(" orbit line "), createElementVNode("use", {
      "xlink:href": `#${line.key}`,
      "stroke-width": line.width,
      stroke: line.orbitColor
    }, null, 8 /* PROPS */, _hoisted_19), createCommentVNode(" fly line gradient mask "), createElementVNode("mask", {
      id: `mask${$data.unique}${line.key}`
    }, [createElementVNode("circle", {
      cx: "0",
      cy: "0",
      r: line.radius,
      fill: `url(#${$data.flylineGradientId})`
    }, [createElementVNode("animateMotion", {
      dur: line.time,
      path: line.d,
      rotate: "auto",
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_22)], 8 /* PROPS */, _hoisted_21)], 8 /* PROPS */, _hoisted_20), createCommentVNode(" fly line "), $data.flylineLengths[i] ? (openBlock(), createElementBlock("use", {
      key: 0,
      "xlink:href": `#${line.key}`,
      "stroke-width": line.width,
      stroke: line.color,
      mask: `url(#mask${$data.unique}${line.key})`
    }, [createElementVNode("animate", {
      attributeName: "stroke-dasharray",
      from: `0, ${$data.flylineLengths[i]}`,
      to: `${$data.flylineLengths[i]}, 0`,
      dur: line.time,
      repeatCount: "indefinite"
    }, null, 8 /* PROPS */, _hoisted_24)], 8 /* PROPS */, _hoisted_23)) : createCommentVNode("v-if", true)]);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_1$3)) : createCommentVNode("v-if", true)], 4 /* STYLE */);
}

var css_248z$3 = ".dv-flyline-chart-enhanced {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart-enhanced text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n";
styleInject(css_248z$3);

script$3.render = render$3;
script$3.__file = "src/components/flylineChartEnhanced/src/main.vue";

function flylineChartEnhanced (Vue) {
  Vue.component(script$3.name, script$3);
}

var script$2 = {
  name: 'DvConicalColumnChart',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ref: 'conical-column-chart',
      defaultConfig: {
        /**
         * @description Chart data
         * @type {Array<Object>}
         * @default data = []
         */
        data: [],
        /**
         * @description Chart img
         * @type {Array<String>}
         * @default img = []
         */
        img: [],
        /**
         * @description Chart font size
         * @type {Number}
         * @default fontSize = 12
         */
        fontSize: 12,
        /**
         * @description Img side length
         * @type {Number}
         * @default imgSideLength = 30
         */
        imgSideLength: 30,
        /**
         * @description Column color
         * @type {String}
         * @default columnColor = 'rgba(0, 194, 255, 0.4)'
         */
        columnColor: 'rgba(0, 194, 255, 0.4)',
        /**
         * @description Text color
         * @type {String}
         * @default textColor = '#fff'
         */
        textColor: '#fff',
        /**
         * @description Show value
         * @type {Boolean}
         * @default showValue = false
         */
        showValue: false
      },
      mergedConfig: null,
      column: []
    };
  },
  watch: {
    config() {
      const {
        calcData
      } = this;
      calcData();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcData
      } = this;
      calcData();
    },
    onResize() {
      const {
        calcData
      } = this;
      calcData();
    },
    calcData() {
      const {
        mergeConfig,
        initData,
        calcSVGPath
      } = this;
      mergeConfig();
      initData();
      calcSVGPath();
    },
    mergeConfig() {
      const {
        defaultConfig,
        config
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    initData() {
      const {
        mergedConfig
      } = this;
      let {
        data
      } = mergedConfig;
      data = util_1(data, true);
      data.sort(({
        value: a
      }, {
        value: b
      }) => {
        if (a > b) return -1;
        if (a < b) return 1;
        if (a === b) return 0;
      });
      const max = data[0] ? data[0].value : 10;
      data = data.map(item => ({
        ...item,
        percent: item.value / max
      }));
      mergedConfig.data = data;
    },
    calcSVGPath() {
      const {
        mergedConfig,
        width,
        height
      } = this;
      const {
        imgSideLength,
        fontSize,
        data
      } = mergedConfig;
      const itemNum = data.length;
      const gap = width / (itemNum + 1);
      const useAbleHeight = height - imgSideLength - fontSize - 5;
      const svgBottom = height - fontSize - 5;
      this.column = data.map((item, i) => {
        const {
          percent
        } = item;
        const middleXPos = gap * (i + 1);
        const leftXPos = gap * i;
        const rightXpos = gap * (i + 2);
        const middleYPos = svgBottom - useAbleHeight * percent;
        const controlYPos = useAbleHeight * percent * 0.6 + middleYPos;
        const d = `
          M${leftXPos}, ${svgBottom}
          Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
          M${middleXPos},${middleYPos}
          Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
          L${leftXPos}, ${svgBottom}
          Z
        `;
        const textY = (svgBottom + middleYPos) / 2 + fontSize / 2;
        return {
          ...item,
          d,
          x: middleXPos,
          y: middleYPos,
          textY
        };
      });
    }
  }
};

const _hoisted_1$2 = ["width", "height"];
const _hoisted_2$2 = ["d", "fill"];
const _hoisted_3$1 = ["fill", "x", "y"];
const _hoisted_4$1 = ["xlink:href", "width", "height", "x", "y"];
const _hoisted_5$1 = ["fill", "x", "y"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-conical-column-chart",
    ref: $data.ref
  }, [(openBlock(), createElementBlock("svg", {
    width: _ctx.width,
    height: _ctx.height
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.column, (item, i) => {
    return openBlock(), createElementBlock("g", {
      key: i
    }, [createElementVNode("path", {
      d: item.d,
      fill: $data.mergedConfig.columnColor
    }, null, 8 /* PROPS */, _hoisted_2$2), createElementVNode("text", {
      style: normalizeStyle(`fontSize:${$data.mergedConfig.fontSize}px`),
      fill: $data.mergedConfig.textColor,
      x: item.x,
      y: _ctx.height - 4
    }, toDisplayString(item.name), 13 /* TEXT, STYLE, PROPS */, _hoisted_3$1), $data.mergedConfig.img.length ? (openBlock(), createElementBlock("image", {
      key: 0,
      "xlink:href": $data.mergedConfig.img[i % $data.mergedConfig.img.length],
      width: $data.mergedConfig.imgSideLength,
      height: $data.mergedConfig.imgSideLength,
      x: item.x - $data.mergedConfig.imgSideLength / 2,
      y: item.y - $data.mergedConfig.imgSideLength
    }, null, 8 /* PROPS */, _hoisted_4$1)) : createCommentVNode("v-if", true), $data.mergedConfig.showValue ? (openBlock(), createElementBlock("text", {
      key: 1,
      style: normalizeStyle(`fontSize:${$data.mergedConfig.fontSize}px`),
      fill: $data.mergedConfig.textColor,
      x: item.x,
      y: item.textY
    }, toDisplayString(item.value), 13 /* TEXT, STYLE, PROPS */, _hoisted_5$1)) : createCommentVNode("v-if", true)]);
  }), 128 /* KEYED_FRAGMENT */))], 8 /* PROPS */, _hoisted_1$2))], 512 /* NEED_PATCH */);
}

var css_248z$2 = ".dv-conical-column-chart {\n  width: 100%;\n  height: 100%;\n}\n.dv-conical-column-chart text {\n  text-anchor: middle;\n}\n";
styleInject(css_248z$2);

script$2.render = render$2;
script$2.__file = "src/components/conicalColumnChart/src/main.vue";

function conicalColumnChart (Vue) {
  Vue.component(script$2.name, script$2);
}

function digitalFlop (Vue) {
  Vue.component(script$9.name, script$9);
}

var script$1 = {
  name: 'DvScrollBoard',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ref: 'scroll-board',
      defaultConfig: {
        /**
         * @description Board header
         * @type {Array<String>}
         * @default header = []
         * @example header = ['column1', 'column2', 'column3']
         */
        header: [],
        /**
         * @description Board data
         * @type {Array<Array>}
         * @default data = []
         */
        data: [],
        /**
         * @description Row num
         * @type {Number}
         * @default rowNum = 5
         */
        rowNum: 5,
        /**
         * @description Header background color
         * @type {String}
         * @default headerBGC = '#00BAFF'
         */
        headerBGC: '#00BAFF',
        /**
         * @description Odd row background color
         * @type {String}
         * @default oddRowBGC = '#003B51'
         */
        oddRowBGC: '#003B51',
        /**
         * @description Even row background color
         * @type {String}
         * @default evenRowBGC = '#003B51'
         */
        evenRowBGC: '#0A2732',
        /**
         * @description Scroll wait time
         * @type {Number}
         * @default waitTime = 2000
         */
        waitTime: 2000,
        /**
         * @description Header height
         * @type {Number}
         * @default headerHeight = 35
         */
        headerHeight: 35,
        /**
         * @description Column width
         * @type {Array<Number>}
         * @default columnWidth = []
         */
        columnWidth: [],
        /**
         * @description Column align
         * @type {Array<String>}
         * @default align = []
         * @example align = ['left', 'center', 'right']
         */
        align: [],
        /**
         * @description Show index
         * @type {Boolean}
         * @default index = false
         */
        index: false,
        /**
         * @description index Header
         * @type {String}
         * @default indexHeader = '#'
         */
        indexHeader: '#',
        /**
         * @description Carousel type
         * @type {String}
         * @default carousel = 'single'
         * @example carousel = 'single' | 'page'
         */
        carousel: 'single',
        /**
         * @description Pause scroll when mouse hovered
         * @type {Boolean}
         * @default hoverPause = true
         * @example hoverPause = true | false
         */
        hoverPause: true
      },
      mergedConfig: null,
      header: [],
      rowsData: [],
      rows: [],
      widths: [],
      heights: [],
      avgHeight: 0,
      aligns: [],
      animationIndex: 0,
      animationHandler: '',
      updater: 0,
      needCalc: false
    };
  },
  watch: {
    config() {
      const {
        stopAnimation,
        calcData
      } = this;
      stopAnimation();
      this.animationIndex = 0;
      calcData();
    }
  },
  methods: {
    handleHover(enter, ri, ci, row, ceil) {
      const {
        mergedConfig,
        emitEvent,
        stopAnimation,
        animation
      } = this;
      if (enter) emitEvent('mouseover', ri, ci, row, ceil);
      if (!mergedConfig.hoverPause) return;
      if (enter) {
        stopAnimation();
      } else {
        animation(true);
      }
    },
    afterAutoResizeMixinInit() {
      const {
        calcData
      } = this;
      calcData();
    },
    onResize() {
      const {
        mergedConfig,
        calcWidths,
        calcHeights
      } = this;
      if (!mergedConfig) return;
      calcWidths();
      calcHeights();
    },
    calcData() {
      const {
        mergeConfig,
        calcHeaderData,
        calcRowsData
      } = this;
      mergeConfig();
      calcHeaderData();
      calcRowsData();
      const {
        calcWidths,
        calcHeights,
        calcAligns
      } = this;
      calcWidths();
      calcHeights();
      calcAligns();
      const {
        animation
      } = this;
      animation(true);
    },
    mergeConfig() {
      let {
        config,
        defaultConfig
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    calcHeaderData() {
      let {
        header,
        index,
        indexHeader
      } = this.mergedConfig;
      if (!header.length) {
        this.header = [];
        return;
      }
      header = [...header];
      if (index) header.unshift(indexHeader);
      this.header = header;
    },
    calcRowsData() {
      let {
        data,
        index,
        headerBGC,
        rowNum
      } = this.mergedConfig;
      if (index) {
        data = data.map((row, i) => {
          row = [...row];
          const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`;
          row.unshift(indexTag);
          return row;
        });
      }
      data = data.map((ceils, i) => ({
        ceils,
        rowIndex: i
      }));
      const rowLength = data.length;
      if (rowLength > rowNum && rowLength < 2 * rowNum) {
        data = [...data, ...data];
      }
      data = data.map((d, i) => ({
        ...d,
        scroll: i
      }));
      this.rowsData = data;
      this.rows = data;
    },
    calcWidths() {
      const {
        width,
        mergedConfig,
        rowsData
      } = this;
      const {
        columnWidth,
        header
      } = mergedConfig;
      const usedWidth = columnWidth.reduce((all, w) => all + w, 0);
      let columnNum = 0;
      if (rowsData[0]) {
        columnNum = rowsData[0].ceils.length;
      } else if (header.length) {
        columnNum = header.length;
      }
      const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);
      const widths = new Array(columnNum).fill(avgWidth);
      this.widths = util_2(widths, columnWidth);
    },
    calcHeights(onresize = false) {
      const {
        height,
        mergedConfig,
        header
      } = this;
      const {
        headerHeight,
        rowNum,
        data
      } = mergedConfig;
      let allHeight = height;
      if (header.length) allHeight -= headerHeight;
      const avgHeight = allHeight / rowNum;
      this.avgHeight = avgHeight;
      if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
    },
    calcAligns() {
      const {
        header,
        mergedConfig
      } = this;
      const columnNum = header.length;
      let aligns = new Array(columnNum).fill('left');
      const {
        align
      } = mergedConfig;
      this.aligns = util_2(aligns, align);
    },
    async animation(start = false) {
      const {
        needCalc,
        calcHeights,
        calcRowsData
      } = this;
      if (needCalc) {
        calcRowsData();
        calcHeights();
        this.needCalc = false;
      }
      let {
        avgHeight,
        animationIndex,
        mergedConfig,
        rowsData,
        animation,
        updater
      } = this;
      const {
        waitTime,
        carousel,
        rowNum
      } = mergedConfig;
      const rowLength = rowsData.length;
      if (rowNum >= rowLength) return;
      if (start) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        if (updater !== this.updater) return;
      }
      const animationNum = carousel === 'single' ? 1 : rowNum;
      let rows = rowsData.slice(animationIndex);
      rows.push(...rowsData.slice(0, animationIndex));
      this.rows = rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1);
      this.heights = new Array(rowLength).fill(avgHeight);
      await new Promise(resolve => setTimeout(resolve, 300));
      if (updater !== this.updater) return;
      this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
      animationIndex += animationNum;
      const back = animationIndex - rowLength;
      if (back >= 0) animationIndex = back;
      this.animationIndex = animationIndex;
      this.animationHandler = setTimeout(animation, waitTime - 300);
    },
    stopAnimation() {
      const {
        animationHandler,
        updater
      } = this;
      this.updater = (updater + 1) % 999999;
      if (!animationHandler) return;
      clearTimeout(animationHandler);
    },
    emitEvent(type, ri, ci, row, ceil) {
      const {
        ceils,
        rowIndex
      } = row;
      this.$emit(type, {
        row: ceils,
        ceil,
        rowIndex,
        columnIndex: ci
      });
    },
    updateRows(rows, animationIndex) {
      const {
        mergedConfig,
        animationHandler,
        animation
      } = this;
      this.mergedConfig = {
        ...mergedConfig,
        data: [...rows]
      };
      this.needCalc = true;
      if (typeof animationIndex === 'number') this.animationIndex = animationIndex;
      if (!animationHandler) animation(true);
    }
  },
  destroyed() {
    const {
      stopAnimation
    } = this;
    stopAnimation();
  }
};

const _hoisted_1$1 = ["align", "innerHTML"];
const _hoisted_2$1 = ["align", "innerHTML", "onClick", "onMouseenter"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-scroll-board",
    ref: $data.ref
  }, [$data.header.length && $data.mergedConfig ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "header",
    style: normalizeStyle(`background-color: ${$data.mergedConfig.headerBGC};`)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.header, (headerItem, i) => {
    return openBlock(), createElementBlock("div", {
      class: "header-item",
      key: `${headerItem}${i}`,
      style: normalizeStyle(`
          height: ${$data.mergedConfig.headerHeight}px;
          line-height: ${$data.mergedConfig.headerHeight}px;
          width: ${$data.widths[i]}px;
        `),
      align: $data.aligns[i],
      innerHTML: headerItem
    }, null, 12 /* STYLE, PROPS */, _hoisted_1$1);
  }), 128 /* KEYED_FRAGMENT */))], 4 /* STYLE */)) : createCommentVNode("v-if", true), $data.mergedConfig ? (openBlock(), createElementBlock("div", {
    key: 1,
    class: "rows",
    style: normalizeStyle(`height: ${_ctx.height - ($data.header.length ? $data.mergedConfig.headerHeight : 0)}px;`)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.rows, (row, ri) => {
    return openBlock(), createElementBlock("div", {
      class: "row-item",
      key: `${row.toString()}${row.scroll}`,
      style: normalizeStyle(`
          height: ${$data.heights[ri]}px;
          line-height: ${$data.heights[ri]}px;
          background-color: ${$data.mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
        `)
    }, [(openBlock(true), createElementBlock(Fragment, null, renderList(row.ceils, (ceil, ci) => {
      return openBlock(), createElementBlock("div", {
        class: "ceil",
        key: `${ceil}${ri}${ci}`,
        style: normalizeStyle(`width: ${$data.widths[ci]}px;`),
        align: $data.aligns[ci],
        innerHTML: ceil,
        onClick: $event => $options.emitEvent('click', ri, ci, row, ceil),
        onMouseenter: $event => $options.handleHover(true, ri, ci, row, ceil),
        onMouseleave: _cache[0] || (_cache[0] = $event => $options.handleHover(false))
      }, null, 44 /* STYLE, PROPS, HYDRATE_EVENTS */, _hoisted_2$1);
    }), 128 /* KEYED_FRAGMENT */))], 4 /* STYLE */);
  }), 128 /* KEYED_FRAGMENT */))], 4 /* STYLE */)) : createCommentVNode("v-if", true)], 512 /* NEED_PATCH */);
}

var css_248z$1 = ".dv-scroll-board {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n}\n.dv-scroll-board .text {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .header {\n  display: flex;\n  flex-direction: row;\n  font-size: 15px;\n}\n.dv-scroll-board .header .header-item {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows {\n  overflow: hidden;\n}\n.dv-scroll-board .rows .row-item {\n  display: flex;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows .ceil {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .rows .index {\n  border-radius: 3px;\n  padding: 0px 3px;\n}\n";
styleInject(css_248z$1);

script$1.render = render$1;
script$1.__file = "src/components/scrollBoard/src/main.vue";

function scrollBoard (Vue) {
  Vue.component(script$1.name, script$1);
}

var script = {
  name: 'DvScrollRankingBoard',
  mixins: [autoResize],
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ref: 'scroll-ranking-board',
      defaultConfig: {
        /**
         * @description Board data
         * @type {Array<Object>}
         * @default data = []
         */
        data: [],
        /**
         * @description Row num
         * @type {Number}
         * @default rowNum = 5
         */
        rowNum: 5,
        /**
         * @description Scroll wait time
         * @type {Number}
         * @default waitTime = 2000
         */
        waitTime: 2000,
        /**
         * @description Carousel type
         * @type {String}
         * @default carousel = 'single'
         * @example carousel = 'single' | 'page'
         */
        carousel: 'single',
        /**
         * @description Value unit
         * @type {String}
         * @default unit = ''
         * @example unit = 'ton'
         */
        unit: '',
        /**
         * @description Auto sort by value
         * @type {Boolean}
         * @default sort = true
         */
        sort: true,
        /**
         * @description Value formatter
         * @type {Function}
         * @default valueFormatter = null
         */
        valueFormatter: null
      },
      mergedConfig: null,
      rowsData: [],
      rows: [],
      heights: [],
      animationIndex: 0,
      animationHandler: '',
      updater: 0
    };
  },
  watch: {
    config() {
      const {
        stopAnimation,
        calcData
      } = this;
      stopAnimation();
      calcData();
    }
  },
  methods: {
    afterAutoResizeMixinInit() {
      const {
        calcData
      } = this;
      calcData();
    },
    onResize() {
      const {
        mergedConfig,
        calcHeights
      } = this;
      if (!mergedConfig) return;
      calcHeights(true);
    },
    calcData() {
      const {
        mergeConfig,
        calcRowsData
      } = this;
      mergeConfig();
      calcRowsData();
      const {
        calcHeights
      } = this;
      calcHeights();
      const {
        animation
      } = this;
      animation(true);
    },
    mergeConfig() {
      let {
        config,
        defaultConfig
      } = this;
      this.mergedConfig = util_2(util_1(defaultConfig, true), config || {});
    },
    calcRowsData() {
      let {
        data,
        rowNum,
        sort
      } = this.mergedConfig;
      sort && data.sort(({
        value: a
      }, {
        value: b
      }) => {
        if (a > b) return -1;
        if (a < b) return 1;
        if (a === b) return 0;
      });
      const value = data.map(({
        value
      }) => value);
      const min = Math.min(...value) || 0;

      // abs of min
      const minAbs = Math.abs(min);
      const max = Math.max(...value) || 0;
      const total = max + minAbs;
      data = data.map((row, i) => ({
        ...row,
        ranking: i + 1,
        percent: (row.value + minAbs) / total * 100
      }));
      const rowLength = data.length;
      if (rowLength > rowNum && rowLength < 2 * rowNum) {
        data = [...data, ...data];
      }
      data = data.map((d, i) => ({
        ...d,
        scroll: i
      }));
      this.rowsData = data;
      this.rows = data;
    },
    calcHeights(onresize = false) {
      const {
        height,
        mergedConfig
      } = this;
      const {
        rowNum,
        data
      } = mergedConfig;
      const avgHeight = height / rowNum;
      this.avgHeight = avgHeight;
      if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
    },
    async animation(start = false) {
      let {
        avgHeight,
        animationIndex,
        mergedConfig,
        rowsData,
        animation,
        updater
      } = this;
      const {
        waitTime,
        carousel,
        rowNum
      } = mergedConfig;
      const rowLength = rowsData.length;
      if (rowNum >= rowLength) return;
      if (start) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        if (updater !== this.updater) return;
      }
      const animationNum = carousel === 'single' ? 1 : rowNum;
      let rows = rowsData.slice(animationIndex);
      rows.push(...rowsData.slice(0, animationIndex));
      this.rows = rows.slice(0, rowNum + 1);
      this.heights = new Array(rowLength).fill(avgHeight);
      await new Promise(resolve => setTimeout(resolve, 300));
      if (updater !== this.updater) return;
      this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
      animationIndex += animationNum;
      const back = animationIndex - rowLength;
      if (back >= 0) animationIndex = back;
      this.animationIndex = animationIndex;
      this.animationHandler = setTimeout(animation, waitTime - 300);
    },
    stopAnimation() {
      const {
        animationHandler,
        updater
      } = this;
      this.updater = (updater + 1) % 999999;
      if (!animationHandler) return;
      clearTimeout(animationHandler);
    }
  },
  destroyed() {
    const {
      stopAnimation
    } = this;
    stopAnimation();
  }
};

const _hoisted_1 = {
  class: "ranking-info"
};
const _hoisted_2 = {
  class: "rank"
};
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = {
  class: "ranking-value"
};
const _hoisted_5 = {
  class: "ranking-column"
};
const _hoisted_6 = /*#__PURE__*/createElementVNode("div", {
  class: "shine"
}, null, -1 /* HOISTED */);
const _hoisted_7 = [_hoisted_6];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "dv-scroll-ranking-board",
    ref: $data.ref
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.rows, (item, i) => {
    return openBlock(), createElementBlock("div", {
      class: "row-item",
      key: item.toString() + item.scroll,
      style: normalizeStyle(`height: ${$data.heights[i]}px;`)
    }, [createElementVNode("div", _hoisted_1, [createElementVNode("div", _hoisted_2, "No." + toDisplayString(item.ranking), 1 /* TEXT */), createElementVNode("div", {
      class: "info-name",
      innerHTML: item.name
    }, null, 8 /* PROPS */, _hoisted_3), createElementVNode("div", _hoisted_4, toDisplayString($data.mergedConfig.valueFormatter ? $data.mergedConfig.valueFormatter(item) : item.value + $data.mergedConfig.unit), 1 /* TEXT */)]), createElementVNode("div", _hoisted_5, [createElementVNode("div", {
      class: "inside-column",
      style: normalizeStyle(`width: ${item.percent}%;`)
    }, _hoisted_7, 4 /* STYLE */)])], 4 /* STYLE */);
  }), 128 /* KEYED_FRAGMENT */))], 512 /* NEED_PATCH */);
}

var css_248z = ".dv-scroll-ranking-board {\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .row-item {\n  transition: all 0.3s;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-info {\n  display: flex;\n  width: 100%;\n  font-size: 13px;\n}\n.dv-scroll-ranking-board .ranking-info .rank {\n  width: 40px;\n  color: #1370fb;\n}\n.dv-scroll-ranking-board .ranking-info .info-name {\n  flex: 1;\n}\n.dv-scroll-ranking-board .ranking-column {\n  border-bottom: 2px solid rgba(19, 112, 251, 0.5);\n  margin-top: 5px;\n}\n.dv-scroll-ranking-board .ranking-column .inside-column {\n  position: relative;\n  height: 6px;\n  background-color: #1370fb;\n  margin-bottom: 2px;\n  border-radius: 1px;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-column .shine {\n  position: absolute;\n  left: 0%;\n  top: 2px;\n  height: 2px;\n  width: 50px;\n  transform: translateX(-100%);\n  background: radial-gradient(#28f8ff 5%, transparent 80%);\n  animation: shine 3s ease-in-out infinite alternate;\n}\n@keyframes shine {\n80% {\n    left: 0%;\n    transform: translateX(-100%);\n}\n100% {\n    left: 100%;\n    transform: translateX(0%);\n}\n}\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/scrollRankingBoard/src/main.vue";

function scrollRankingBoard (Vue) {
  Vue.component(script.name, script);
}

/**
 * export {default as COMPONENTS}
 */

/**
 * USE COMPONENTS
 */
function index (Vue) {
  Vue.use(fullScreenContainer);
  Vue.use(loading);

  // border box
  Vue.use(borderBox1);
  Vue.use(borderBox2);
  Vue.use(borderBox3);
  Vue.use(borderBox4);
  Vue.use(borderBox5);
  Vue.use(borderBox6);
  Vue.use(borderBox7);
  Vue.use(borderBox8);
  Vue.use(borderBox9);
  Vue.use(borderBox10);
  Vue.use(borderBox11);
  Vue.use(borderBox12);
  Vue.use(borderBox13);

  // decoration
  Vue.use(decoration1);
  Vue.use(decoration2);
  Vue.use(decoration3);
  Vue.use(decoration4);
  Vue.use(decoration5);
  Vue.use(decoration6);
  Vue.use(decoration7);
  Vue.use(decoration8);
  Vue.use(decoration9);
  Vue.use(decoration10);
  Vue.use(decoration11);
  Vue.use(decoration12);

  // charts
  Vue.use(charts);
  Vue.use(activeRingChart);
  Vue.use(capsuleChart);
  Vue.use(waterLevelPond);
  Vue.use(percentPond);
  Vue.use(flylineChart);
  Vue.use(flylineChartEnhanced);
  Vue.use(conicalColumnChart);
  Vue.use(digitalFlop);
  Vue.use(scrollBoard);
  Vue.use(scrollRankingBoard);
}

export { activeRingChart, borderBox1, borderBox10, borderBox11, borderBox12, borderBox13, borderBox2, borderBox3, borderBox4, borderBox5, borderBox6, borderBox7, borderBox8, borderBox9, capsuleChart, charts, conicalColumnChart, decoration1, decoration10, decoration11, decoration12, decoration2, decoration3, decoration4, decoration5, decoration6, decoration7, decoration8, decoration9, index as default, digitalFlop, flylineChart, flylineChartEnhanced, fullScreenContainer, loading, percentPond, scrollBoard, scrollRankingBoard, waterLevelPond };
