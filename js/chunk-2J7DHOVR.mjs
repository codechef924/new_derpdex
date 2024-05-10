import { a as Su, b as qe, c as _ } from "./chunk-ELYU6EKT.mjs";
var Te = {};
Su(Te, {
  Children: () => gn,
  Component: () => be,
  Fragment: () => Ii,
  Profiler: () => MC,
  PureComponent: () => OC,
  StrictMode: () => AC,
  Suspense: () => Mo,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => DC,
  cloneElement: () => rn,
  createContext: () => xe,
  createElement: () => le,
  createFactory: () => VC,
  createRef: () => Rm,
  default: () => b,
  forwardRef: () => Ue,
  isValidElement: () => yn,
  lazy: () => BC,
  memo: () => HC,
  startTransition: () => Fi,
  unstable_act: () => zC,
  useCallback: () => ce,
  useContext: () => M,
  useDebugValue: () => NC,
  useDeferredValue: () => $C,
  useEffect: () => W,
  useId: () => Xr,
  useImperativeHandle: () => jC,
  useInsertionEffect: () => ht,
  useLayoutEffect: () => or,
  useMemo: () => fe,
  useReducer: () => WC,
  useRef: () => D,
  useState: () => Mt,
  useSyncExternalStore: () => UC,
  useTransition: () => XC,
  version: () => YC,
});
var b = {},
  Lo = Symbol.for("react.element"),
  yC = Symbol.for("react.portal"),
  bC = Symbol.for("react.fragment"),
  xC = Symbol.for("react.strict_mode"),
  SC = Symbol.for("react.profiler"),
  wC = Symbol.for("react.provider"),
  CC = Symbol.for("react.context"),
  kC = Symbol.for("react.forward_ref"),
  TC = Symbol.for("react.suspense"),
  EC = Symbol.for("react.memo"),
  RC = Symbol.for("react.lazy"),
  gm = Symbol.iterator;
function PC(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (gm && e[gm]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var xm = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Sm = Object.assign,
  wm = {};
function Pi(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = wm),
    (this.updater = n || xm);
}
Pi.prototype.isReactComponent = {};
Pi.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Pi.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Cm() {}
Cm.prototype = Pi.prototype;
function Cu(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = wm),
    (this.updater = n || xm);
}
var ku = (Cu.prototype = new Cm());
ku.constructor = Cu;
Sm(ku, Pi.prototype);
ku.isPureReactComponent = !0;
var ym = Array.isArray,
  km = Object.prototype.hasOwnProperty,
  Tu = { current: null },
  Tm = { key: !0, ref: !0, __self: !0, __source: !0 };
function Em(e, t, n) {
  var r,
    i = {},
    o = null,
    s = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (s = t.ref),
    t.key !== void 0 && (o = "" + t.key),
    t))
      km.call(t, r) && !Tm.hasOwnProperty(r) && (i[r] = t[r]);
  var a = arguments.length - 2;
  if (a === 1) i.children = n;
  else if (1 < a) {
    for (var l = Array(a), c = 0; c < a; c++) l[c] = arguments[c + 2];
    i.children = l;
  }
  if (e && e.defaultProps)
    for (r in ((a = e.defaultProps), a)) i[r] === void 0 && (i[r] = a[r]);
  return {
    $$typeof: Lo,
    type: e,
    key: o,
    ref: s,
    props: i,
    _owner: Tu.current,
  };
}
function IC(e, t) {
  return {
    $$typeof: Lo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Eu(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Lo;
}
function FC(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var bm = /\/+/g;
function wu(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? FC("" + e.key)
    : t.toString(36);
}
function Ia(e, t, n, r, i) {
  var o = typeof e;
  (o !== "undefined" && o !== "boolean") || (e = null);
  var s = !1;
  if (e === null) s = !0;
  else
    switch (o) {
      case "string":
      case "number":
        s = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Lo:
          case yC:
            s = !0;
        }
    }
  if (s)
    return (
      (s = e),
      (i = i(s)),
      (e = r === "" ? "." + wu(s, 0) : r),
      ym(i)
        ? ((n = ""),
          e != null && (n = e.replace(bm, "$&/") + "/"),
          Ia(i, t, n, "", function (c) {
            return c;
          }))
        : i != null &&
          (Eu(i) &&
            (i = IC(
              i,
              n +
                (!i.key || (s && s.key === i.key)
                  ? ""
                  : ("" + i.key).replace(bm, "$&/") + "/") +
                e
            )),
          t.push(i)),
      1
    );
  if (((s = 0), (r = r === "" ? "." : r + ":"), ym(e)))
    for (var a = 0; a < e.length; a++) {
      o = e[a];
      var l = r + wu(o, a);
      s += Ia(o, t, n, l, i);
    }
  else if (((l = PC(e)), typeof l == "function"))
    for (e = l.call(e), a = 0; !(o = e.next()).done; )
      (o = o.value), (l = r + wu(o, a++)), (s += Ia(o, t, n, l, i));
  else if (o === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return s;
}
function Pa(e, t, n) {
  if (e == null) return e;
  var r = [],
    i = 0;
  return (
    Ia(e, r, "", "", function (o) {
      return t.call(n, o, i++);
    }),
    r
  );
}
function _C(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status !== 0 && e._status !== -1) ||
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status !== 0 && e._status !== -1) ||
            ((e._status = 2), (e._result = n));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var dt = { current: null },
  Fa = { transition: null },
  LC = {
    ReactCurrentDispatcher: dt,
    ReactCurrentBatchConfig: Fa,
    ReactCurrentOwner: Tu,
  };
b.Children = {
  map: Pa,
  forEach: function (e, t, n) {
    Pa(
      e,
      function () {
        t.apply(this, arguments);
      },
      n
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Pa(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Pa(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Eu(e))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return e;
  },
};
b.Component = Pi;
b.Fragment = bC;
b.Profiler = SC;
b.PureComponent = Cu;
b.StrictMode = xC;
b.Suspense = TC;
b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = LC;
b.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        "."
    );
  var r = Sm({}, e.props),
    i = e.key,
    o = e.ref,
    s = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((o = t.ref), (s = Tu.current)),
      t.key !== void 0 && (i = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps;
    for (l in t)
      km.call(t, l) &&
        !Tm.hasOwnProperty(l) &&
        (r[l] = t[l] === void 0 && a !== void 0 ? a[l] : t[l]);
  }
  var l = arguments.length - 2;
  if (l === 1) r.children = n;
  else if (1 < l) {
    a = Array(l);
    for (var c = 0; c < l; c++) a[c] = arguments[c + 2];
    r.children = a;
  }
  return { $$typeof: Lo, type: e.type, key: i, ref: o, props: r, _owner: s };
};
b.createContext = function (e) {
  return (
    (e = {
      $$typeof: CC,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: wC, _context: e }),
    (e.Consumer = e)
  );
};
b.createElement = Em;
b.createFactory = function (e) {
  var t = Em.bind(null, e);
  return (t.type = e), t;
};
b.createRef = function () {
  return { current: null };
};
b.forwardRef = function (e) {
  return { $$typeof: kC, render: e };
};
b.isValidElement = Eu;
b.lazy = function (e) {
  return { $$typeof: RC, _payload: { _status: -1, _result: e }, _init: _C };
};
b.memo = function (e, t) {
  return { $$typeof: EC, type: e, compare: t === void 0 ? null : t };
};
b.startTransition = function (e) {
  var t = Fa.transition;
  Fa.transition = {};
  try {
    e();
  } finally {
    Fa.transition = t;
  }
};
b.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
b.useCallback = function (e, t) {
  return dt.current.useCallback(e, t);
};
b.useContext = function (e) {
  return dt.current.useContext(e);
};
b.useDebugValue = function () {};
b.useDeferredValue = function (e) {
  return dt.current.useDeferredValue(e);
};
b.useEffect = function (e, t) {
  return dt.current.useEffect(e, t);
};
b.useId = function () {
  return dt.current.useId();
};
b.useImperativeHandle = function (e, t, n) {
  return dt.current.useImperativeHandle(e, t, n);
};
b.useInsertionEffect = function (e, t) {
  return dt.current.useInsertionEffect(e, t);
};
b.useLayoutEffect = function (e, t) {
  return dt.current.useLayoutEffect(e, t);
};
b.useMemo = function (e, t) {
  return dt.current.useMemo(e, t);
};
b.useReducer = function (e, t, n) {
  return dt.current.useReducer(e, t, n);
};
b.useRef = function (e) {
  return dt.current.useRef(e);
};
b.useState = function (e) {
  return dt.current.useState(e);
};
b.useSyncExternalStore = function (e, t, n) {
  return dt.current.useSyncExternalStore(e, t, n);
};
b.useTransition = function () {
  return dt.current.useTransition();
};
b.version = "18.2.0";
var gn = b.Children,
  be = b.Component,
  Ii = b.Fragment,
  MC = b.Profiler,
  OC = b.PureComponent,
  AC = b.StrictMode,
  Mo = b.Suspense,
  DC = b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  rn = b.cloneElement,
  xe = b.createContext,
  le = b.createElement,
  VC = b.createFactory,
  Rm = b.createRef,
  Ue = b.forwardRef,
  yn = b.isValidElement,
  BC = b.lazy,
  HC = b.memo,
  Fi = b.startTransition,
  zC = b.unstable_act,
  ce = b.useCallback,
  M = b.useContext,
  NC = b.useDebugValue,
  $C = b.useDeferredValue,
  W = b.useEffect,
  Xr = b.useId,
  jC = b.useImperativeHandle,
  ht = b.useInsertionEffect,
  or = b.useLayoutEffect,
  fe = b.useMemo,
  WC = b.useReducer,
  D = b.useRef,
  Mt = b.useState,
  UC = b.useSyncExternalStore,
  XC = b.useTransition,
  YC = b.version;
var GC = Object.create,
  rf = Object.defineProperty,
  KC = Object.getOwnPropertyDescriptor,
  $v = Object.getOwnPropertyNames,
  qC = Object.getPrototypeOf,
  QC = Object.prototype.hasOwnProperty,
  ZC = (e, t, n) =>
    t in e
      ? rf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  on = (e, t) =>
    function () {
      return t || (0, e[$v(e)[0]])((t = { exports: {} }).exports, t), t.exports;
    },
  JC = (e, t, n, r) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let i of $v(t))
        !QC.call(e, i) &&
          i !== n &&
          rf(e, i, {
            get: () => t[i],
            enumerable: !(r = KC(t, i)) || r.enumerable,
          });
    return e;
  },
  Yt = (e, t, n) => (
    (n = e != null ? GC(qC(e)) : {}),
    JC(
      t || !e || !e.__esModule
        ? rf(n, "default", { value: e, enumerable: !0 })
        : n,
      e
    )
  ),
  R = (e, t, n) => (ZC(e, typeof t != "symbol" ? t + "" : t, n), n),
  jv = (e, t, n) => {
    if (!t.has(e)) throw TypeError("Cannot " + n);
  },
  Tt = (e, t, n) => (
    jv(e, t, "read from private field"), n ? n.call(e) : t.get(e)
  ),
  Go = (e, t, n) => {
    if (t.has(e))
      throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(e) : t.set(e, n);
  },
  of = (e, t, n, r) => (
    jv(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n
  ),
  ek = on({
    "../../../node_modules/@emotion/memoize/dist/memoize.browser.cjs.js"(e) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      function t(n) {
        var r = {};
        return function (i) {
          return r[i] === void 0 && (r[i] = n(i)), r[i];
        };
      }
      e.default = t;
    },
  }),
  tk = on({
    "../../../node_modules/@emotion/is-prop-valid/dist/is-prop-valid.browser.cjs.js"(
      e
    ) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      function t(o) {
        return o && typeof o == "object" && "default" in o ? o.default : o;
      }
      var n = t(ek()),
        r =
          /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,
        i = n(function (o) {
          return (
            r.test(o) ||
            (o.charCodeAt(0) === 111 &&
              o.charCodeAt(1) === 110 &&
              o.charCodeAt(2) < 91)
          );
        });
      e.default = i;
    },
  }),
  Hn = xe({
    transformPagePoint: (e) => e,
    isStatic: !1,
    reducedMotion: "never",
  }),
  Ko = xe({}),
  Vi = xe(null),
  qo = typeof document < "u",
  ur = qo ? or : W,
  sf = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
  nk = "framerAppearId",
  qa = "data-" + sf(nk),
  Qa = { skipAnimations: !1, useManualTiming: !1 },
  Uo = xe({}),
  Za = xe({}),
  Wv = xe({ strict: !1 }),
  Pm = class {
    constructor() {
      (this.order = []), (this.scheduled = new Set());
    }
    add(e) {
      if (!this.scheduled.has(e))
        return this.scheduled.add(e), this.order.push(e), !0;
    }
    remove(e) {
      let t = this.order.indexOf(e);
      t !== -1 && (this.order.splice(t, 1), this.scheduled.delete(e));
    }
    clear() {
      (this.order.length = 0), this.scheduled.clear();
    }
  };
function rk(e) {
  let t = new Pm(),
    n = new Pm(),
    r = 0,
    i = !1,
    o = !1,
    s = new WeakSet(),
    a = {
      schedule: (l, c = !1, u = !1) => {
        let f = u && i,
          d = f ? t : n;
        return c && s.add(l), d.add(l) && f && i && (r = t.order.length), l;
      },
      cancel: (l) => {
        n.remove(l), s.delete(l);
      },
      process: (l) => {
        if (i) {
          o = !0;
          return;
        }
        if (((i = !0), ([t, n] = [n, t]), n.clear(), (r = t.order.length), r))
          for (let c = 0; c < r; c++) {
            let u = t.order[c];
            s.has(u) && (a.schedule(u), e()), u(l);
          }
        (i = !1), o && ((o = !1), a.process(l));
      },
    };
  return a;
}
var Vo = ["prepare", "read", "update", "preRender", "render", "postRender"],
  ik = 40;
function Uv(e, t) {
  let n = !1,
    r = !0,
    i = { delta: 0, timestamp: 0, isProcessing: !1 },
    o = Vo.reduce((f, d) => ((f[d] = rk(() => (n = !0))), f), {}),
    s = (f) => {
      o[f].process(i);
    },
    a = () => {
      let f = Qa.useManualTiming ? i.timestamp : performance.now();
      (n = !1),
        (i.delta = r ? 1e3 / 60 : Math.max(Math.min(f - i.timestamp, ik), 1)),
        (i.timestamp = f),
        (i.isProcessing = !0),
        Vo.forEach(s),
        (i.isProcessing = !1),
        n && t && ((r = !1), e(a));
    },
    l = () => {
      (n = !0), (r = !0), i.isProcessing || e(a);
    };
  return {
    schedule: Vo.reduce((f, d) => {
      let h = o[d];
      return (f[d] = (g, y = !1, S = !1) => (n || l(), h.schedule(g, y, S))), f;
    }, {}),
    cancel: (f) => Vo.forEach((d) => o[d].cancel(f)),
    state: i,
    steps: o,
  };
}
var { schedule: af, cancel: _5 } = Uv(queueMicrotask, !1);
function ok(e, t, n, r) {
  let { visualElement: i } = M(Ko),
    o = M(Wv),
    s = M(Vi),
    a = M(Hn).reducedMotion,
    l = D();
  (r = r || o.renderer),
    !l.current &&
      r &&
      (l.current = r(e, {
        visualState: t,
        parent: i,
        props: n,
        presenceContext: s,
        blockInitialAnimation: s ? s.initial === !1 : !1,
        reducedMotionConfig: a,
      }));
  let c = l.current;
  ht(() => {
    c && c.update(n, s);
  });
  let u = D(!!(n[qa] && !_.HandoffComplete));
  return (
    ur(() => {
      c &&
        (af.postRender(c.render),
        u.current && c.animationState && c.animationState.animateChanges());
    }),
    W(() => {
      c &&
        (c.updateFeatures(),
        !u.current && c.animationState && c.animationState.animateChanges(),
        u.current && ((u.current = !1), (_.HandoffComplete = !0)));
    }),
    c
  );
}
function _i(e) {
  return (
    e &&
    typeof e == "object" &&
    Object.prototype.hasOwnProperty.call(e, "current")
  );
}
function sk(e, t, n) {
  return ce(
    (r) => {
      r && e.mount && e.mount(r),
        t && (r ? t.mount(r) : t.unmount()),
        n && (typeof n == "function" ? n(r) : _i(n) && (n.current = r));
    },
    [t]
  );
}
function Xo(e) {
  return typeof e == "string" || Array.isArray(e);
}
function Ja(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
var lf = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit",
  ],
  cf = ["initial", ...lf];
function el(e) {
  return Ja(e.animate) || cf.some((t) => Xo(e[t]));
}
function Xv(e) {
  return !!(el(e) || e.variants);
}
function ak(e, t) {
  if (el(e)) {
    let { initial: n, animate: r } = e;
    return {
      initial: n === !1 || Xo(n) ? n : void 0,
      animate: Xo(r) ? r : void 0,
    };
  }
  return e.inherit !== !1 ? t : {};
}
function lk(e) {
  let { initial: t, animate: n } = ak(e, M(Ko));
  return fe(() => ({ initial: t, animate: n }), [Im(t), Im(n)]);
}
function Im(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
var Fm = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  },
  Yo = {};
for (let e in Fm) Yo[e] = { isEnabled: (t) => Fm[e].some((n) => !!t[n]) };
function ck(e) {
  for (let t in e) Yo[t] = { ...Yo[t], ...e[t] };
}
var uf = Symbol.for("motionComponentSymbol");
function Yv({
  preloadedFeatures: e,
  createVisualElement: t,
  useRender: n,
  useVisualState: r,
  Component: i,
}) {
  e && ck(e);
  function o(a, l) {
    let c,
      u = { ...M(Hn), ...a, layoutId: uk(a) },
      { isStatic: f } = u,
      d = lk(a),
      h = r(a, f);
    if (!f && qo) {
      d.visualElement = ok(i, h, u, t);
      let g = M(Za),
        y = M(Wv).strict;
      d.visualElement && (c = d.visualElement.loadFeatures(u, y, e, g));
    }
    return le(
      Ko.Provider,
      { value: d },
      c && d.visualElement
        ? le(c, { visualElement: d.visualElement, ...u })
        : null,
      n(i, a, sk(h, d.visualElement, l), h, f, d.visualElement)
    );
  }
  let s = Ue(o);
  return (s[uf] = i), s;
}
function uk({ layoutId: e }) {
  let t = M(Uo).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
var Na = {};
function ff(e) {
  Object.assign(Na, e);
}
var ge = (e) => !!(e && e.getVelocity),
  Qo = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  ti = new Set(Qo),
  fk = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  dk = Qo.length;
function Gv(
  e,
  { enableHardwareAcceleration: t = !0, allowTransformNone: n = !0 },
  r,
  i
) {
  let o = "";
  for (let s = 0; s < dk; s++) {
    let a = Qo[s];
    if (e[a] !== void 0) {
      let l = fk[a] || a;
      o += `${l}(${e[a]}) `;
    }
  }
  return (
    t && !e.z && (o += "translateZ(0)"),
    (o = o.trim()),
    i ? (o = i(e, r ? "" : o)) : n && r && (o = "none"),
    o
  );
}
var zn = (e, t, n) => (n > t ? t : n < e ? e : n),
  Ho = (e) => Math.round(e * 1e5) / 1e5,
  df = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu,
  hk =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu,
  pk =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
function Zo(e) {
  return typeof e == "string";
}
var Jo = (e) => ({
    test: (t) => Zo(t) && t.endsWith(e) && t.split(" ").length === 1,
    parse: parseFloat,
    transform: (t) => `${t}${e}`,
  }),
  sr = Jo("deg"),
  bn = Jo("%"),
  j = Jo("px"),
  mk = Jo("vh"),
  vk = Jo("vw"),
  _m = {
    ...bn,
    parse: (e) => bn.parse(e) / 100,
    transform: (e) => bn.transform(e * 100),
  },
  gk = new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "ignoreStrict",
    "viewport",
  ]);
function Ai(e) {
  return (
    e.startsWith("while") ||
    (e.startsWith("drag") && e !== "draggable") ||
    e.startsWith("layout") ||
    e.startsWith("onTap") ||
    e.startsWith("onPan") ||
    e.startsWith("onLayout") ||
    gk.has(e)
  );
}
var Kv = (e) => !Ai(e);
function qv(e) {
  e && (Kv = (t) => (t.startsWith("on") ? !Ai(t) : e(t)));
}
try {
  qv(tk().default);
} catch {}
function Qv(e, t, n) {
  let r = {};
  for (let i in e)
    (i === "values" && typeof e.values == "object") ||
      ((Kv(i) ||
        (n === !0 && Ai(i)) ||
        (!t && !Ai(i)) ||
        (e.draggable && i.startsWith("onDrag"))) &&
        (r[i] = e[i]));
  return r;
}
var $a = (e) => Array.isArray(e),
  yk = (e) => !!(e && typeof e == "object" && e.mix && e.toValue),
  bk = (e) => ($a(e) ? e[e.length - 1] || 0 : e);
function rt(e) {
  let t = ge(e) ? e.get() : e;
  return yk(t) ? t.toValue() : t;
}
function hf(e, t, n, r = {}, i = {}) {
  return (
    typeof t == "function" && (t = t(n !== void 0 ? n : e.custom, r, i)),
    typeof t == "string" && (t = e.variants && e.variants[t]),
    typeof t == "function" && (t = t(n !== void 0 ? n : e.custom, r, i)),
    t
  );
}
function jn(e) {
  let t = D(null);
  return t.current === null && (t.current = e()), t.current;
}
function xk(
  { scrapeMotionValuesFromProps: e, createRenderState: t, onMount: n },
  r,
  i,
  o
) {
  let s = { latestValues: Sk(r, i, o, e), renderState: t() };
  return n && (s.mount = (a) => n(r, a, s)), s;
}
var tl = (e) => (t, n) => {
  let r = M(Ko),
    i = M(Vi),
    o = () => xk(e, t, r, i);
  return n ? o() : jn(o);
};
function Sk(e, t, n, r) {
  let i = {},
    o = r(e, {});
  for (let d in o) i[d] = rt(o[d]);
  let { initial: s, animate: a } = e,
    l = el(e),
    c = Xv(e);
  t &&
    c &&
    !l &&
    e.inherit !== !1 &&
    (s === void 0 && (s = t.initial), a === void 0 && (a = t.animate));
  let u = n ? n.initial === !1 : !1;
  u = u || s === !1;
  let f = u ? a : s;
  return (
    f &&
      typeof f != "boolean" &&
      !Ja(f) &&
      (Array.isArray(f) ? f : [f]).forEach((h) => {
        let g = hf(e, h);
        if (!g) return;
        let { transitionEnd: y, transition: S, ...p } = g;
        for (let m in p) {
          let v = p[m];
          if (Array.isArray(v)) {
            let x = u ? v.length - 1 : 0;
            v = v[x];
          }
          v !== null && (i[m] = v);
        }
        for (let m in y) i[m] = y[m];
      }),
    i
  );
}
var Le = (e) => e,
  {
    schedule: Q,
    cancel: pt,
    state: Re,
    steps: Da,
  } = Uv(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Le, !0),
  Zv = (e) =>
    e.pointerType === "mouse"
      ? typeof e.button != "number" || e.button <= 0
      : e.isPrimary !== !1;
function nl(e, t = "page") {
  return { point: { x: e[t + "X"], y: e[t + "Y"] } };
}
var Jv = (e) => (t) => Zv(t) && e(t, nl(t));
function Vn(e, t, n, r = { passive: !0 }) {
  return e.addEventListener(t, n, r), () => e.removeEventListener(t, n);
}
function xn(e, t, n, r) {
  return Vn(e, t, Jv(n), r);
}
var wk = (e, t) => (n) => t(e(n)),
  Sn = (...e) => e.reduce(wk);
function eg(e) {
  let t = null;
  return () => {
    let n = () => {
      t = null;
    };
    return t === null ? ((t = e), n) : !1;
  };
}
var Lm = eg("dragHorizontal"),
  Mm = eg("dragVertical");
function tg(e) {
  let t = !1;
  if (e === "y") t = Mm();
  else if (e === "x") t = Lm();
  else {
    let n = Lm(),
      r = Mm();
    n && r
      ? (t = () => {
          n(), r();
        })
      : (n && n(), r && r());
  }
  return t;
}
function pf() {
  let e = tg(!0);
  return e ? (e(), !1) : !0;
}
var es = Le,
  it = Le,
  ng = (e, t, n) =>
    (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e,
  Ck = 1e-7,
  kk = 12;
function Tk(e, t, n, r, i) {
  let o,
    s,
    a = 0;
  do (s = t + (n - t) / 2), (o = ng(s, r, i) - e), o > 0 ? (n = s) : (t = s);
  while (Math.abs(o) > Ck && ++a < kk);
  return s;
}
function Bi(e, t, n, r) {
  if (e === t && n === r) return Le;
  let i = (o) => Tk(o, 0, 1, e, n);
  return (o) => (o === 0 || o === 1 ? o : ng(i(o), t, r));
}
var rg = Bi(0.42, 0, 1, 1),
  ig = Bi(0, 0, 0.58, 1),
  mf = Bi(0.42, 0, 0.58, 1),
  vf = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2,
  gf = (e) => (t) => 1 - e(1 - t),
  rl = (e) => 1 - Math.sin(Math.acos(e)),
  yf = gf(rl),
  og = vf(rl),
  bf = Bi(0.33, 1.53, 0.69, 0.99),
  il = gf(bf),
  sg = vf(il),
  ag = (e) =>
    (e *= 2) < 1 ? 0.5 * il(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))),
  cr = (e, t, n) => {
    let r = t - e;
    return r === 0 ? 1 : (n - e) / r;
  },
  Hi = {
    test: (e) => typeof e == "number",
    parse: parseFloat,
    transform: (e) => e,
  },
  zo = { ...Hi, transform: (e) => zn(0, 1, e) },
  La = { ...Hi, default: 1 },
  xf = (e, t) => (n) =>
    !!(
      (Zo(n) && pk.test(n) && n.startsWith(e)) ||
      (t && Object.prototype.hasOwnProperty.call(n, t))
    ),
  lg = (e, t, n) => (r) => {
    if (!Zo(r)) return r;
    let [i, o, s, a] = r.match(df);
    return {
      [e]: parseFloat(i),
      [t]: parseFloat(o),
      [n]: parseFloat(s),
      alpha: a !== void 0 ? parseFloat(a) : 1,
    };
  },
  Ek = (e) => zn(0, 255, e),
  Ru = { ...Hi, transform: (e) => Math.round(Ek(e)) },
  Qr = {
    test: xf("rgb", "red"),
    parse: lg("red", "green", "blue"),
    transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) =>
      "rgba(" +
      Ru.transform(e) +
      ", " +
      Ru.transform(t) +
      ", " +
      Ru.transform(n) +
      ", " +
      Ho(zo.transform(r)) +
      ")",
  };
function Rk(e) {
  let t = "",
    n = "",
    r = "",
    i = "";
  return (
    e.length > 5
      ? ((t = e.substring(1, 3)),
        (n = e.substring(3, 5)),
        (r = e.substring(5, 7)),
        (i = e.substring(7, 9)))
      : ((t = e.substring(1, 2)),
        (n = e.substring(2, 3)),
        (r = e.substring(3, 4)),
        (i = e.substring(4, 5)),
        (t += t),
        (n += n),
        (r += r),
        (i += i)),
    {
      red: parseInt(t, 16),
      green: parseInt(n, 16),
      blue: parseInt(r, 16),
      alpha: i ? parseInt(i, 16) / 255 : 1,
    }
  );
}
var zu = { test: xf("#"), parse: Rk, transform: Qr.transform },
  Li = {
    test: xf("hsl", "hue"),
    parse: lg("hue", "saturation", "lightness"),
    transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) =>
      "hsla(" +
      Math.round(e) +
      ", " +
      bn.transform(Ho(t)) +
      ", " +
      bn.transform(Ho(n)) +
      ", " +
      Ho(zo.transform(r)) +
      ")",
  },
  Qe = {
    test: (e) => Qr.test(e) || zu.test(e) || Li.test(e),
    parse: (e) =>
      Qr.test(e) ? Qr.parse(e) : Li.test(e) ? Li.parse(e) : zu.parse(e),
    transform: (e) =>
      Zo(e) ? e : e.hasOwnProperty("red") ? Qr.transform(e) : Li.transform(e),
  };
function Pk(e) {
  var t, n;
  return (
    isNaN(e) &&
    Zo(e) &&
    (((t = e.match(df)) === null || t === void 0 ? void 0 : t.length) || 0) +
      (((n = e.match(hk)) === null || n === void 0 ? void 0 : n.length) || 0) >
      0
  );
}
var cg = "number",
  ug = "color",
  Ik = "var",
  Fk = "var(",
  Om = "${}",
  _k =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function ja(e) {
  let t = e.toString(),
    n = [],
    r = { color: [], number: [], var: [] },
    i = [],
    o = 0,
    a = t
      .replace(
        _k,
        (l) => (
          Qe.test(l)
            ? (r.color.push(o), i.push(ug), n.push(Qe.parse(l)))
            : l.startsWith(Fk)
            ? (r.var.push(o), i.push(Ik), n.push(l))
            : (r.number.push(o), i.push(cg), n.push(parseFloat(l))),
          ++o,
          Om
        )
      )
      .split(Om);
  return { values: n, split: a, indexes: r, types: i };
}
function fg(e) {
  return ja(e).values;
}
function dg(e) {
  let { split: t, types: n } = ja(e),
    r = t.length;
  return (i) => {
    let o = "";
    for (let s = 0; s < r; s++)
      if (((o += t[s]), i[s] !== void 0)) {
        let a = n[s];
        a === cg
          ? (o += Ho(i[s]))
          : a === ug
          ? (o += Qe.transform(i[s]))
          : (o += i[s]);
      }
    return o;
  };
}
var Lk = (e) => (typeof e == "number" ? 0 : e);
function Mk(e) {
  let t = fg(e);
  return dg(e)(t.map(Lk));
}
var Nn = { test: Pk, parse: fg, createTransformer: dg, getAnimatableNone: Mk },
  de = (e, t, n) => e + (t - e) * n;
function Pu(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? e + (t - e) * 6 * n
      : n < 1 / 2
      ? t
      : n < 2 / 3
      ? e + (t - e) * (2 / 3 - n) * 6
      : e
  );
}
function Ok({ hue: e, saturation: t, lightness: n, alpha: r }) {
  (e /= 360), (t /= 100), (n /= 100);
  let i = 0,
    o = 0,
    s = 0;
  if (!t) i = o = s = n;
  else {
    let a = n < 0.5 ? n * (1 + t) : n + t - n * t,
      l = 2 * n - a;
    (i = Pu(l, a, e + 1 / 3)), (o = Pu(l, a, e)), (s = Pu(l, a, e - 1 / 3));
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(s * 255),
    alpha: r,
  };
}
var Iu = (e, t, n) => {
    let r = e * e,
      i = n * (t * t - r) + r;
    return i < 0 ? 0 : Math.sqrt(i);
  },
  Ak = [zu, Qr, Li],
  Dk = (e) => Ak.find((t) => t.test(e));
function Am(e) {
  let t = Dk(e);
  it(
    !!t,
    `'${e}' is not an animatable color. Use the equivalent color code instead.`
  );
  let n = t.parse(e);
  return t === Li && (n = Ok(n)), n;
}
var Dm = (e, t) => {
    let n = Am(e),
      r = Am(t),
      i = { ...n };
    return (o) => (
      (i.red = Iu(n.red, r.red, o)),
      (i.green = Iu(n.green, r.green, o)),
      (i.blue = Iu(n.blue, r.blue, o)),
      (i.alpha = de(n.alpha, r.alpha, o)),
      Qr.transform(i)
    );
  },
  hg = (e) => (t) => typeof t == "string" && t.startsWith(e),
  pg = hg("--"),
  Vk = hg("var(--"),
  Wa = (e) => (Vk(e) ? Bk.test(e.split("/*")[0].trim()) : !1),
  Bk =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Nu(e, t) {
  return (n) => (n > 0 ? t : e);
}
function Hk(e, t) {
  return (n) => de(e, t, n);
}
function Sf(e) {
  return typeof e == "number"
    ? Hk
    : typeof e == "string"
    ? Wa(e)
      ? Nu
      : Qe.test(e)
      ? Dm
      : $k
    : Array.isArray(e)
    ? mg
    : typeof e == "object"
    ? Qe.test(e)
      ? Dm
      : zk
    : Nu;
}
function mg(e, t) {
  let n = [...e],
    r = n.length,
    i = e.map((o, s) => Sf(o)(o, t[s]));
  return (o) => {
    for (let s = 0; s < r; s++) n[s] = i[s](o);
    return n;
  };
}
function zk(e, t) {
  let n = { ...e, ...t },
    r = {};
  for (let i in n)
    e[i] !== void 0 && t[i] !== void 0 && (r[i] = Sf(e[i])(e[i], t[i]));
  return (i) => {
    for (let o in r) n[o] = r[o](i);
    return n;
  };
}
function Nk(e, t) {
  var n;
  let r = [],
    i = { color: 0, var: 0, number: 0 };
  for (let o = 0; o < t.values.length; o++) {
    let s = t.types[o],
      a = e.indexes[s][i[s]],
      l = (n = e.values[a]) !== null && n !== void 0 ? n : 0;
    (r[o] = l), i[s]++;
  }
  return r;
}
var $k = (e, t) => {
  let n = Nn.createTransformer(t),
    r = ja(e),
    i = ja(t);
  return r.indexes.var.length === i.indexes.var.length &&
    r.indexes.color.length === i.indexes.color.length &&
    r.indexes.number.length >= i.indexes.number.length
    ? Sn(mg(Nk(r, i), i.values), n)
    : (es(
        !0,
        `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`
      ),
      Nu(e, t));
};
function wf(e, t, n) {
  return typeof e == "number" && typeof t == "number" && typeof n == "number"
    ? de(e, t, n)
    : Sf(e)(e, t);
}
function jk(e, t, n) {
  let r = [],
    i = n || wf,
    o = e.length - 1;
  for (let s = 0; s < o; s++) {
    let a = i(e[s], e[s + 1]);
    if (t) {
      let l = Array.isArray(t) ? t[s] || Le : t;
      a = Sn(l, a);
    }
    r.push(a);
  }
  return r;
}
function zi(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
  let o = e.length;
  if (
    (it(o === t.length, "Both input and output ranges must be the same length"),
    o === 1)
  )
    return () => t[0];
  e[0] > e[o - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
  let s = jk(t, r, i),
    a = s.length,
    l = (c) => {
      let u = 0;
      if (a > 1) for (; u < e.length - 2 && !(c < e[u + 1]); u++);
      let f = cr(e[u], e[u + 1], c);
      return s[u](f);
    };
  return n ? (c) => l(zn(e[0], e[o - 1], c)) : l;
}
var Bn = (e) => e * 1e3,
  wn = (e) => e / 1e3;
function Cf(e, t) {
  return t ? e * (1e3 / t) : 0;
}
var Wk = 5;
function vg(e, t, n) {
  let r = Math.max(t - Wk, 0);
  return Cf(n - e(r), t - r);
}
var Fu = 0.001,
  Uk = 0.01,
  Vm = 10,
  Xk = 0.05,
  Yk = 1;
function Gk({
  duration: e = 800,
  bounce: t = 0.25,
  velocity: n = 0,
  mass: r = 1,
}) {
  let i, o;
  es(e <= Bn(Vm), "Spring duration must be 10 seconds or less");
  let s = 1 - t;
  (s = zn(Xk, Yk, s)),
    (e = zn(Uk, Vm, wn(e))),
    s < 1
      ? ((i = (c) => {
          let u = c * s,
            f = u * e,
            d = u - n,
            h = $u(c, s),
            g = Math.exp(-f);
          return Fu - (d / h) * g;
        }),
        (o = (c) => {
          let f = c * s * e,
            d = f * n + n,
            h = Math.pow(s, 2) * Math.pow(c, 2) * e,
            g = Math.exp(-f),
            y = $u(Math.pow(c, 2), s);
          return ((-i(c) + Fu > 0 ? -1 : 1) * ((d - h) * g)) / y;
        }))
      : ((i = (c) => {
          let u = Math.exp(-c * e),
            f = (c - n) * e + 1;
          return -Fu + u * f;
        }),
        (o = (c) => {
          let u = Math.exp(-c * e),
            f = (n - c) * (e * e);
          return u * f;
        }));
  let a = 5 / e,
    l = qk(i, o, a);
  if (((e = Bn(e)), isNaN(l)))
    return { stiffness: 100, damping: 10, duration: e };
  {
    let c = Math.pow(l, 2) * r;
    return { stiffness: c, damping: s * 2 * Math.sqrt(r * c), duration: e };
  }
}
var Kk = 12;
function qk(e, t, n) {
  let r = n;
  for (let i = 1; i < Kk; i++) r = r - e(r) / t(r);
  return r;
}
function $u(e, t) {
  return e * Math.sqrt(1 - t * t);
}
var Qk = ["duration", "bounce"],
  Zk = ["stiffness", "damping", "mass"];
function Bm(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function Jk(e) {
  let t = {
    velocity: 0,
    stiffness: 100,
    damping: 10,
    mass: 1,
    isResolvedFromDuration: !1,
    ...e,
  };
  if (!Bm(e, Zk) && Bm(e, Qk)) {
    let n = Gk(e);
    (t = { ...t, ...n, mass: 1 }), (t.isResolvedFromDuration = !0);
  }
  return t;
}
function ts({ keyframes: e, restDelta: t, restSpeed: n, ...r }) {
  let i = e[0],
    o = e[e.length - 1],
    s = { done: !1, value: i },
    {
      stiffness: a,
      damping: l,
      mass: c,
      duration: u,
      velocity: f,
      isResolvedFromDuration: d,
    } = Jk({ ...r, velocity: -wn(r.velocity || 0) }),
    h = f || 0,
    g = l / (2 * Math.sqrt(a * c)),
    y = o - i,
    S = wn(Math.sqrt(a / c)),
    p = Math.abs(y) < 5;
  n || (n = p ? 0.01 : 2), t || (t = p ? 0.005 : 0.5);
  let m;
  if (g < 1) {
    let v = $u(S, g);
    m = (x) => {
      let C = Math.exp(-g * S * x);
      return (
        o - C * (((h + g * S * y) / v) * Math.sin(v * x) + y * Math.cos(v * x))
      );
    };
  } else if (g === 1) m = (v) => o - Math.exp(-S * v) * (y + (h + S * y) * v);
  else {
    let v = S * Math.sqrt(g * g - 1);
    m = (x) => {
      let C = Math.exp(-g * S * x),
        w = Math.min(v * x, 300);
      return (
        o - (C * ((h + g * S * y) * Math.sinh(w) + v * y * Math.cosh(w))) / v
      );
    };
  }
  return {
    calculatedDuration: (d && u) || null,
    next: (v) => {
      let x = m(v);
      if (d) s.done = v >= u;
      else {
        let C = h;
        v !== 0 && (g < 1 ? (C = vg(m, v, x)) : (C = 0));
        let w = Math.abs(C) <= n,
          k = Math.abs(o - x) <= t;
        s.done = w && k;
      }
      return (s.value = s.done ? o : x), s;
    },
  };
}
var gg = (e) => Array.isArray(e) && typeof e[0] != "number",
  Hm = {
    linear: Le,
    easeIn: rg,
    easeInOut: mf,
    easeOut: ig,
    circIn: rl,
    circInOut: og,
    circOut: yf,
    backIn: il,
    backInOut: sg,
    backOut: bf,
    anticipate: ag,
  },
  zm = (e) => {
    if (Array.isArray(e)) {
      it(
        e.length === 4,
        "Cubic bezier arrays must contain four numerical values."
      );
      let [t, n, r, i] = e;
      return Bi(t, n, r, i);
    } else if (typeof e == "string")
      return it(Hm[e] !== void 0, `Invalid easing type '${e}'`), Hm[e];
    return e;
  };
function yg(e, t) {
  let n = e[e.length - 1];
  for (let r = 1; r <= t; r++) {
    let i = cr(0, t, r);
    e.push(de(n, 1, i));
  }
}
function kf(e) {
  let t = [0];
  return yg(t, e.length - 1), t;
}
function eT(e, t) {
  return e.map((n) => n * t);
}
function tT(e, t) {
  return e.map(() => t || mf).splice(0, e.length - 1);
}
function Ua({
  duration: e = 300,
  keyframes: t,
  times: n,
  ease: r = "easeInOut",
}) {
  let i = gg(r) ? r.map(zm) : zm(r),
    o = { done: !1, value: t[0] },
    s = eT(n && n.length === t.length ? n : kf(t), e),
    a = zi(s, t, { ease: Array.isArray(i) ? i : tT(t, i) });
  return {
    calculatedDuration: e,
    next: (l) => ((o.value = a(l)), (o.done = l >= e), o),
  };
}
function Nm({
  keyframes: e,
  velocity: t = 0,
  power: n = 0.8,
  timeConstant: r = 325,
  bounceDamping: i = 10,
  bounceStiffness: o = 500,
  modifyTarget: s,
  min: a,
  max: l,
  restDelta: c = 0.5,
  restSpeed: u,
}) {
  let f = e[0],
    d = { done: !1, value: f },
    h = (E) => (a !== void 0 && E < a) || (l !== void 0 && E > l),
    g = (E) =>
      a === void 0
        ? l
        : l === void 0 || Math.abs(a - E) < Math.abs(l - E)
        ? a
        : l,
    y = n * t,
    S = f + y,
    p = s === void 0 ? S : s(S);
  p !== S && (y = p - f);
  let m = (E) => -y * Math.exp(-E / r),
    v = (E) => p + m(E),
    x = (E) => {
      let P = m(E),
        I = v(E);
      (d.done = Math.abs(P) <= c), (d.value = d.done ? p : I);
    },
    C,
    w,
    k = (E) => {
      h(d.value) &&
        ((C = E),
        (w = ts({
          keyframes: [d.value, g(d.value)],
          velocity: vg(v, E, d.value),
          damping: i,
          stiffness: o,
          restDelta: c,
          restSpeed: u,
        })));
    };
  return (
    k(0),
    {
      calculatedDuration: null,
      next: (E) => {
        let P = !1;
        return (
          !w && C === void 0 && ((P = !0), x(E), k(E)),
          C !== void 0 && E > C ? w.next(E - C) : (!P && x(E), d)
        );
      },
    }
  );
}
var Va;
function nT() {
  Va = void 0;
}
var Zr = {
    now: () => (
      Va === void 0 &&
        Zr.set(
          Re.isProcessing || Qa.useManualTiming
            ? Re.timestamp
            : performance.now()
        ),
      Va
    ),
    set: (e) => {
      (Va = e), queueMicrotask(nT);
    },
  },
  rT = (e) => {
    let t = ({ timestamp: n }) => e(n);
    return {
      start: () => Q.update(t, !0),
      stop: () => pt(t),
      now: () => (Re.isProcessing ? Re.timestamp : Zr.now()),
    };
  },
  ju = 2e4;
function Wu(e) {
  let t = 0,
    n = 50,
    r = e.next(t);
  for (; !r.done && t < ju; ) (t += n), (r = e.next(t));
  return t >= ju ? 1 / 0 : t;
}
var iT = { decay: Nm, inertia: Nm, tween: Ua, keyframes: Ua, spring: ts },
  oT = (e) => e / 100;
function ei({
  autoplay: e = !0,
  delay: t = 0,
  driver: n = rT,
  keyframes: r,
  type: i = "keyframes",
  repeat: o = 0,
  repeatDelay: s = 0,
  repeatType: a = "loop",
  onPlay: l,
  onStop: c,
  onComplete: u,
  onUpdate: f,
  ...d
}) {
  let h = 1,
    g = !1,
    y,
    S,
    p = () => {
      S = new Promise((N) => {
        y = N;
      });
    };
  p();
  let m,
    v = iT[i] || Ua,
    x;
  v !== Ua &&
    typeof r[0] != "number" &&
    ((x = Sn(oT, wf(r[0], r[1]))), (r = [0, 100]));
  let C = v({ ...d, keyframes: r }),
    w;
  a === "mirror" &&
    (w = v({
      ...d,
      keyframes: [...r].reverse(),
      velocity: -(d.velocity || 0),
    }));
  let k = "idle",
    E = null,
    P = null,
    I = null;
  C.calculatedDuration === null && o && (C.calculatedDuration = Wu(C));
  let { calculatedDuration: H } = C,
    L = 1 / 0,
    G = 1 / 0;
  H !== null && ((L = H + s), (G = L * (o + 1) - s));
  let B = 0,
    J = (N) => {
      if (P === null) return;
      h > 0 && (P = Math.min(P, N)),
        h < 0 && (P = Math.min(N - G / h, P)),
        E !== null ? (B = E) : (B = Math.round(N - P) * h);
      let te = B - t * (h >= 0 ? 1 : -1),
        q = h >= 0 ? te < 0 : te > G;
      (B = Math.max(te, 0)), k === "finished" && E === null && (B = G);
      let ee = B,
        Wt = C;
      if (o) {
        let Lt = Math.min(B, G) / L,
          wt = Math.floor(Lt),
          ft = Lt % 1;
        !ft && Lt >= 1 && (ft = 1),
          ft === 1 && wt--,
          (wt = Math.min(wt, o + 1)),
          !!(wt % 2) &&
            (a === "reverse"
              ? ((ft = 1 - ft), s && (ft -= s / L))
              : a === "mirror" && (Wt = w)),
          (ee = zn(0, 1, ft) * L);
      }
      let ne = q ? { done: !1, value: r[0] } : Wt.next(ee);
      x && (ne.value = x(ne.value));
      let { done: ut } = ne;
      !q && H !== null && (ut = h >= 0 ? B >= G : B <= 0);
      let Z = E === null && (k === "finished" || (k === "running" && ut));
      return f && f(ne.value), Z && z(), ne;
    },
    Y = () => {
      m && m.stop(), (m = void 0);
    },
    V = () => {
      (k = "idle"), Y(), y(), p(), (P = I = null);
    },
    z = () => {
      (k = "finished"), u && u(), Y(), y();
    },
    A = () => {
      if (g) return;
      m || (m = n(J));
      let N = m.now();
      l && l(),
        E !== null ? (P = N - E) : (!P || k === "finished") && (P = N),
        k === "finished" && p(),
        (I = P),
        (E = null),
        (k = "running"),
        m.start();
    };
  e && A();
  let K = {
    then(N, te) {
      return S.then(N, te);
    },
    get time() {
      return wn(B);
    },
    set time(N) {
      (N = Bn(N)),
        (B = N),
        E !== null || !m || h === 0 ? (E = N) : (P = m.now() - N / h);
    },
    get duration() {
      let N = C.calculatedDuration === null ? Wu(C) : C.calculatedDuration;
      return wn(N);
    },
    get speed() {
      return h;
    },
    set speed(N) {
      N === h || !m || ((h = N), (K.time = wn(B)));
    },
    get state() {
      return k;
    },
    play: A,
    pause: () => {
      (k = "paused"), (E = B);
    },
    stop: () => {
      (g = !0), k !== "idle" && ((k = "idle"), c && c(), V());
    },
    cancel: () => {
      I !== null && J(I), V();
    },
    complete: () => {
      k = "finished";
    },
    sample: (N) => ((P = 0), J(N)),
  };
  return K;
}
function Tf(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function ol(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function sT([...e], t, n) {
  let r = t < 0 ? e.length + t : t;
  if (r >= 0 && r < e.length) {
    let i = n < 0 ? e.length + n : n,
      [o] = e.splice(t, 1);
    e.splice(i, 0, o);
  }
  return e;
}
var Ef = class {
    constructor() {
      this.subscriptions = [];
    }
    add(e) {
      return Tf(this.subscriptions, e), () => ol(this.subscriptions, e);
    }
    notify(e, t, n) {
      let r = this.subscriptions.length;
      if (r)
        if (r === 1) this.subscriptions[0](e, t, n);
        else
          for (let i = 0; i < r; i++) {
            let o = this.subscriptions[i];
            o && o(e, t, n);
          }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  },
  $m = 30,
  aT = (e) => !isNaN(parseFloat(e)),
  No = { current: void 0 },
  sl = class {
    constructor(e, t = {}) {
      (this.version = "11.0.11-sync.2"),
        (this.canTrackVelocity = !1),
        (this.events = {}),
        (this.updateAndNotify = (n, r = !0) => {
          let i = Zr.now();
          this.updatedAt !== i && this.setPrevFrameValue(),
            (this.prev = this.current),
            this.setCurrent(n),
            this.current !== this.prev &&
              this.events.change &&
              this.events.change.notify(this.current),
            r &&
              this.events.renderRequest &&
              this.events.renderRequest.notify(this.current);
        }),
        (this.hasAnimated = !1),
        this.setCurrent(e),
        (this.canTrackVelocity = aT(this.current)),
        (this.owner = t.owner);
    }
    setCurrent(e) {
      (this.current = e), (this.updatedAt = Zr.now());
    }
    setPrevFrameValue(e = this.current) {
      (this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt);
    }
    onChange(e) {
      return this.on("change", e);
    }
    on(e, t) {
      this.events[e] || (this.events[e] = new Ef());
      let n = this.events[e].add(t);
      return e === "change"
        ? () => {
            n(),
              Q.read(() => {
                this.events.change.getSize() || this.stop();
              });
          }
        : n;
    }
    clearListeners() {
      for (let e in this.events) this.events[e].clear();
    }
    attach(e, t) {
      (this.passiveEffect = e), (this.stopPassiveEffect = t);
    }
    set(e, t = !0) {
      !t || !this.passiveEffect
        ? this.updateAndNotify(e, t)
        : this.passiveEffect(e, this.updateAndNotify);
    }
    setWithVelocity(e, t, n) {
      this.set(t),
        (this.prev = void 0),
        (this.prevFrameValue = e),
        (this.prevUpdatedAt = this.updatedAt - n);
    }
    jump(e) {
      this.updateAndNotify(e),
        (this.prev = e),
        (this.prevUpdatedAt = this.prevFrameValue = void 0),
        this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect();
    }
    get() {
      return No.current && No.current.push(this), this.current;
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      let e = Zr.now();
      if (
        !this.canTrackVelocity ||
        this.prevFrameValue === void 0 ||
        e - this.updatedAt > $m
      )
        return 0;
      let t = Math.min(this.updatedAt - this.prevUpdatedAt, $m);
      return Cf(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
    }
    start(e) {
      return (
        this.stop(),
        new Promise((t) => {
          (this.hasAnimated = !0),
            (this.animation = e(t)),
            this.events.animationStart && this.events.animationStart.notify();
        }).then(() => {
          this.events.animationComplete &&
            this.events.animationComplete.notify(),
            this.clearAnimation();
        })
      );
    }
    stop() {
      this.animation &&
        (this.animation.stop(),
        this.events.animationCancel && this.events.animationCancel.notify()),
        this.clearAnimation();
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      this.clearListeners(),
        this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect();
    }
  };
function he(e, t) {
  return new sl(e, t);
}
var bg = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),
  xg = (e) => /^0[^.\s]+$/u.test(e),
  lT = new Set(["brightness", "contrast", "saturate", "opacity"]);
function cT(e) {
  let [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow") return e;
  let [r] = n.match(df) || [];
  if (!r) return e;
  let i = n.replace(r, ""),
    o = lT.has(t) ? 1 : 0;
  return r !== n && (o *= 100), t + "(" + o + i + ")";
}
var uT = /\b([a-z-]*)\(.*?\)/gu,
  Uu = {
    ...Nn,
    getAnimatableNone: (e) => {
      let t = e.match(uT);
      return t ? t.map(cT).join(" ") : e;
    },
  },
  jm = { ...Hi, transform: Math.round },
  Sg = {
    borderWidth: j,
    borderTopWidth: j,
    borderRightWidth: j,
    borderBottomWidth: j,
    borderLeftWidth: j,
    borderRadius: j,
    radius: j,
    borderTopLeftRadius: j,
    borderTopRightRadius: j,
    borderBottomRightRadius: j,
    borderBottomLeftRadius: j,
    width: j,
    maxWidth: j,
    height: j,
    maxHeight: j,
    size: j,
    top: j,
    right: j,
    bottom: j,
    left: j,
    padding: j,
    paddingTop: j,
    paddingRight: j,
    paddingBottom: j,
    paddingLeft: j,
    margin: j,
    marginTop: j,
    marginRight: j,
    marginBottom: j,
    marginLeft: j,
    rotate: sr,
    rotateX: sr,
    rotateY: sr,
    rotateZ: sr,
    scale: La,
    scaleX: La,
    scaleY: La,
    scaleZ: La,
    skew: sr,
    skewX: sr,
    skewY: sr,
    distance: j,
    translateX: j,
    translateY: j,
    translateZ: j,
    x: j,
    y: j,
    z: j,
    perspective: j,
    transformPerspective: j,
    opacity: zo,
    originX: _m,
    originY: _m,
    originZ: j,
    zIndex: jm,
    fillOpacity: zo,
    strokeOpacity: zo,
    numOctaves: jm,
  },
  fT = {
    ...Sg,
    color: Qe,
    backgroundColor: Qe,
    outlineColor: Qe,
    fill: Qe,
    stroke: Qe,
    borderColor: Qe,
    borderTopColor: Qe,
    borderRightColor: Qe,
    borderBottomColor: Qe,
    borderLeftColor: Qe,
    filter: Uu,
    WebkitFilter: Uu,
  },
  Rf = (e) => fT[e];
function wg(e, t) {
  let n = Rf(e);
  return (
    n !== Uu && (n = Nn), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0
  );
}
var Cg = (e) => (t) => t.test(e),
  dT = { test: (e) => e === "auto", parse: (e) => e },
  kg = [Hi, j, bn, sr, vk, mk, dT],
  Oo = (e) => kg.find(Cg(e)),
  hT = [...kg, Qe, Nn],
  pT = (e) => hT.find(Cg(e));
function mT(e) {
  let t = {};
  return e.values.forEach((n, r) => (t[r] = n.get())), t;
}
function vT(e) {
  let t = {};
  return e.values.forEach((n, r) => (t[r] = n.getVelocity())), t;
}
function al(e, t, n) {
  let r = e.getProps();
  return hf(r, t, n !== void 0 ? n : r.custom, mT(e), vT(e));
}
function gT(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, he(n));
}
function Pf(e, t) {
  let n = al(e, t),
    {
      transitionEnd: r = {},
      transition: i = {},
      ...o
    } = n ? e.makeTargetAnimatable(n, !1) : {};
  o = { ...o, ...r };
  for (let s in o) {
    let a = bk(o[s]);
    gT(e, s, a);
  }
}
function Xu(e, t) {
  [...t].reverse().forEach((r) => {
    let i = e.getVariant(r);
    i && Pf(e, i),
      e.variantChildren &&
        e.variantChildren.forEach((o) => {
          Xu(o, t);
        });
  });
}
function yT(e, t) {
  if (Array.isArray(t)) return Xu(e, t);
  if (typeof t == "string") return Xu(e, [t]);
  Pf(e, t);
}
function Tg(e, t, n) {
  var r, i;
  let o = Object.keys(t).filter((a) => !e.hasValue(a)),
    s = o.length;
  if (s)
    for (let a = 0; a < s; a++) {
      let l = o[a],
        c = t[l],
        u = null;
      Array.isArray(c) && (u = c[0]),
        u === null &&
          (u =
            (i = (r = n[l]) !== null && r !== void 0 ? r : e.readValue(l)) !==
              null && i !== void 0
              ? i
              : t[l]),
        u != null &&
          (typeof u == "string" && (bg(u) || xg(u))
            ? (u = parseFloat(u))
            : !pT(u) && Nn.test(c) && (u = wg(l, c)),
          e.addValue(l, he(u, { owner: e })),
          n[l] === void 0 && (n[l] = u),
          u !== null && e.setBaseTarget(l, u));
    }
}
function bT(e, t) {
  return t ? (t[e] || t.default || t).from : void 0;
}
function xT(e, t, n) {
  let r = {};
  for (let i in e) {
    let o = bT(i, t);
    if (o !== void 0) r[i] = o;
    else {
      let s = n.getValue(i);
      s && (r[i] = s.get());
    }
  }
  return r;
}
var Xa = { current: !1 },
  Eg = (e) => Array.isArray(e) && typeof e[0] == "number";
function Rg(e) {
  return !!(
    !e ||
    (typeof e == "string" && Pg[e]) ||
    Eg(e) ||
    (Array.isArray(e) && e.every(Rg))
  );
}
var Bo = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`,
  Pg = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Bo([0, 0.65, 0.55, 1]),
    circOut: Bo([0.55, 0, 1, 0.45]),
    backIn: Bo([0.31, 0.01, 0.66, -0.59]),
    backOut: Bo([0.33, 1.53, 0.69, 0.99]),
  };
function Ig(e) {
  if (e) return Eg(e) ? Bo(e) : Array.isArray(e) ? e.map(Ig) : Pg[e];
}
function ST(
  e,
  t,
  n,
  {
    delay: r = 0,
    duration: i,
    repeat: o = 0,
    repeatType: s = "loop",
    ease: a,
    times: l,
  } = {}
) {
  let c = { [t]: n };
  l && (c.offset = l);
  let u = Ig(a);
  return (
    Array.isArray(u) && (c.easing = u),
    e.animate(c, {
      delay: r,
      duration: i,
      easing: Array.isArray(u) ? "linear" : u,
      fill: "both",
      iterations: o + 1,
      direction: s === "reverse" ? "alternate" : "normal",
    })
  );
}
function wT(e, { repeat: t, repeatType: n = "loop" }) {
  let r = t && n !== "loop" && t % 2 === 1 ? 0 : e.length - 1;
  return e[r];
}
function Fg(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
var CT = Fg(() => Object.hasOwnProperty.call(Element.prototype, "animate")),
  kT = new Set(["opacity", "clipPath", "filter", "transform"]),
  Ma = 10,
  TT = 2e4,
  ET = (e, t) => t.type === "spring" || e === "backgroundColor" || !Rg(t.ease);
function RT(e, t, { onUpdate: n, onComplete: r, ...i }) {
  if (
    !(
      CT() &&
      kT.has(t) &&
      !i.repeatDelay &&
      i.repeatType !== "mirror" &&
      i.damping !== 0 &&
      i.type !== "inertia"
    )
  )
    return !1;
  let s = !1,
    a,
    l,
    c = !1,
    u = () => {
      l = new Promise((v) => {
        a = v;
      });
    };
  u();
  let { keyframes: f, duration: d = 300, ease: h, times: g } = i;
  if (ET(t, i)) {
    let v = ei({ ...i, repeat: 0, delay: 0 }),
      x = { done: !1, value: f[0] },
      C = [],
      w = 0;
    for (; !x.done && w < TT; ) (x = v.sample(w)), C.push(x.value), (w += Ma);
    (g = void 0), (f = C), (d = w - Ma), (h = "linear");
  }
  let y = ST(e.owner.current, t, f, { ...i, duration: d, ease: h, times: g }),
    S = () => {
      (c = !1), y.cancel();
    },
    p = () => {
      (c = !0), Q.update(S), a(), u();
    };
  return (
    (y.onfinish = () => {
      c || (e.set(wT(f, i)), r && r(), p());
    }),
    {
      then(v, x) {
        return l.then(v, x);
      },
      attachTimeline(v) {
        return (y.timeline = v), (y.onfinish = null), Le;
      },
      get time() {
        return wn(y.currentTime || 0);
      },
      set time(v) {
        y.currentTime = Bn(v);
      },
      get speed() {
        return y.playbackRate;
      },
      set speed(v) {
        y.playbackRate = v;
      },
      get duration() {
        return wn(d);
      },
      play: () => {
        s || (y.play(), pt(S));
      },
      pause: () => y.pause(),
      stop: () => {
        if (((s = !0), y.playState === "idle")) return;
        let { currentTime: v } = y;
        if (v) {
          let x = ei({ ...i, autoplay: !1 });
          e.setWithVelocity(x.sample(v - Ma).value, x.sample(v).value, Ma);
        }
        p();
      },
      complete: () => {
        c || y.finish();
      },
      cancel: p,
    }
  );
}
function PT({ keyframes: e, delay: t, onUpdate: n, onComplete: r }) {
  let i = () => (
    n && n(e[e.length - 1]),
    r && r(),
    {
      time: 0,
      speed: 1,
      duration: 0,
      play: Le,
      pause: Le,
      stop: Le,
      then: (o) => (o(), Promise.resolve()),
      cancel: Le,
      complete: Le,
    }
  );
  return t
    ? ei({ keyframes: [0, 1], duration: 0, delay: t, onComplete: i })
    : i();
}
var IT = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  FT = (e) => ({
    type: "spring",
    stiffness: 550,
    damping: e === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  _T = { type: "keyframes", duration: 0.8 },
  LT = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  MT = (e, { keyframes: t }) =>
    t.length > 2
      ? _T
      : ti.has(e)
      ? e.startsWith("scale")
        ? FT(t[1])
        : IT
      : LT,
  Yu = (e, t) =>
    e === "zIndex"
      ? !1
      : !!(
          typeof t == "number" ||
          Array.isArray(t) ||
          (typeof t == "string" &&
            (Nn.test(t) || t === "0") &&
            !t.startsWith("url("))
        );
function OT(e) {
  if (typeof e == "number") return e === 0;
  if (e !== null) return e === "none" || e === "0" || xg(e);
}
function AT(e, t, n, r) {
  let i = Yu(t, n),
    o;
  Array.isArray(n) ? (o = [...n]) : (o = [null, n]);
  let s = r.from !== void 0 ? r.from : e.get(),
    a,
    l = [];
  for (let c = 0; c < o.length; c++)
    o[c] === null && (o[c] = c === 0 ? s : o[c - 1]),
      OT(o[c]) && l.push(c),
      typeof o[c] == "string" && o[c] !== "none" && o[c] !== "0" && (a = o[c]);
  if (i && l.length && a)
    for (let c = 0; c < l.length; c++) {
      let u = l[c];
      o[u] = wg(t, a);
    }
  return o;
}
function DT({
  when: e,
  delay: t,
  delayChildren: n,
  staggerChildren: r,
  staggerDirection: i,
  repeat: o,
  repeatType: s,
  repeatDelay: a,
  from: l,
  elapsed: c,
  ...u
}) {
  return !!Object.keys(u).length;
}
function If(e, t) {
  return e[t] || e.default || e;
}
var Ff =
  (e, t, n, r = {}) =>
  (i) => {
    let o = If(r, e) || {},
      s = o.delay || r.delay || 0,
      { elapsed: a = 0 } = r;
    a = a - Bn(s);
    let l = AT(t, e, n, o),
      c = l[0],
      u = l[l.length - 1],
      f = Yu(e, c),
      d = Yu(e, u);
    es(
      f === d,
      `You are trying to animate ${e} from "${c}" to "${u}". ${c} is not an animatable value - to enable this animation set ${c} to a value animatable to ${u} via the \`style\` property.`
    );
    let h = {
      keyframes: l,
      velocity: t.getVelocity(),
      ease: "easeOut",
      ...o,
      delay: -a,
      onUpdate: (g) => {
        t.set(g), o.onUpdate && o.onUpdate(g);
      },
      onComplete: () => {
        i(), o.onComplete && o.onComplete();
      },
    };
    if (
      (DT(o) || (h = { ...h, ...MT(e, h) }),
      h.duration && (h.duration = Bn(h.duration)),
      h.repeatDelay && (h.repeatDelay = Bn(h.repeatDelay)),
      !f || !d || Xa.current || o.type === !1 || Qa.skipAnimations)
    )
      return PT(Xa.current ? { ...h, delay: 0 } : h);
    if (
      !r.isHandoff &&
      t.owner &&
      t.owner.current instanceof HTMLElement &&
      !t.owner.getProps().onUpdate
    ) {
      let g = RT(t, e, h);
      if (g) return g;
    }
    return ei(h);
  };
function Ya(e) {
  return !!(ge(e) && e.add);
}
function VT({ protectedKeys: e, needsAnimating: t }, n) {
  let r = e.hasOwnProperty(n) && t[n] !== !0;
  return (t[n] = !1), r;
}
function BT(e, t) {
  let n = e.get();
  if (Array.isArray(t)) {
    for (let r = 0; r < t.length; r++) if (t[r] !== n) return !0;
  } else return n !== t;
}
function _f(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
  let {
      transition: o = e.getDefaultTransition(),
      transitionEnd: s,
      ...a
    } = e.makeTargetAnimatable(t),
    l = e.getValue("willChange");
  r && (o = r);
  let c = [],
    u = i && e.animationState && e.animationState.getState()[i];
  for (let f in a) {
    let d = e.getValue(f),
      h = a[f];
    if (!d || h === void 0 || (u && VT(u, f))) continue;
    let g = { delay: n, elapsed: 0, ...If(o || {}, f) };
    if (_.HandoffAppearAnimations) {
      let p = e.getProps()[qa];
      if (p) {
        let m = _.HandoffAppearAnimations(p, f, d, Q);
        m !== null && ((g.elapsed = m), (g.isHandoff = !0));
      }
    }
    let y = !g.isHandoff && !BT(d, h);
    if (
      (g.type === "spring" && (d.getVelocity() || g.velocity) && (y = !1),
      d.animation && (y = !1),
      y)
    )
      continue;
    d.start(Ff(f, d, h, e.shouldReduceMotion && ti.has(f) ? { type: !1 } : g));
    let S = d.animation;
    Ya(l) && (l.add(f), S.then(() => l.remove(f))), c.push(S);
  }
  return (
    s &&
      Promise.all(c).then(() => {
        s && Pf(e, s);
      }),
    c
  );
}
function Gu(e, t, n = {}) {
  let r = al(e, t, n.custom),
    { transition: i = e.getDefaultTransition() || {} } = r || {};
  n.transitionOverride && (i = n.transitionOverride);
  let o = r ? () => Promise.all(_f(e, r, n)) : () => Promise.resolve(),
    s =
      e.variantChildren && e.variantChildren.size
        ? (l = 0) => {
            let {
              delayChildren: c = 0,
              staggerChildren: u,
              staggerDirection: f,
            } = i;
            return HT(e, t, c + l, u, f, n);
          }
        : () => Promise.resolve(),
    { when: a } = i;
  if (a) {
    let [l, c] = a === "beforeChildren" ? [o, s] : [s, o];
    return l().then(() => c());
  } else return Promise.all([o(), s(n.delay)]);
}
function HT(e, t, n = 0, r = 0, i = 1, o) {
  let s = [],
    a = (e.variantChildren.size - 1) * r,
    l = i === 1 ? (c = 0) => c * r : (c = 0) => a - c * r;
  return (
    Array.from(e.variantChildren)
      .sort(zT)
      .forEach((c, u) => {
        c.notify("AnimationStart", t),
          s.push(
            Gu(c, t, { ...o, delay: n + l(u) }).then(() =>
              c.notify("AnimationComplete", t)
            )
          );
      }),
    Promise.all(s)
  );
}
function zT(e, t) {
  return e.sortNodePosition(t);
}
function Lf(e, t, n = {}) {
  e.notify("AnimationStart", t);
  let r;
  if (Array.isArray(t)) {
    let i = t.map((o) => Gu(e, o, n));
    r = Promise.all(i);
  } else if (typeof t == "string") r = Gu(e, t, n);
  else {
    let i = typeof t == "function" ? al(e, t, n.custom) : t;
    r = Promise.all(_f(e, i, n));
  }
  return r.then(() => e.notify("AnimationComplete", t));
}
function _g(e, t) {
  if (!Array.isArray(t)) return !1;
  let n = t.length;
  if (n !== e.length) return !1;
  for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
  return !0;
}
var NT = [...lf].reverse(),
  $T = lf.length;
function jT(e) {
  return (t) =>
    Promise.all(t.map(({ animation: n, options: r }) => Lf(e, n, r)));
}
function WT(e) {
  let t = jT(e),
    n = XT(),
    r = !0,
    i = (l, c) => {
      let u = al(e, c);
      if (u) {
        let { transition: f, transitionEnd: d, ...h } = u;
        l = { ...l, ...h, ...d };
      }
      return l;
    };
  function o(l) {
    t = l(e);
  }
  function s(l, c) {
    let u = e.getProps(),
      f = e.getVariantContext(!0) || {},
      d = [],
      h = new Set(),
      g = {},
      y = 1 / 0;
    for (let p = 0; p < $T; p++) {
      let m = NT[p],
        v = n[m],
        x = u[m] !== void 0 ? u[m] : f[m],
        C = Xo(x),
        w = m === c ? v.isActive : null;
      w === !1 && (y = p);
      let k = x === f[m] && x !== u[m] && C;
      if (
        (k && r && e.manuallyAnimateOnMount && (k = !1),
        (v.protectedKeys = { ...g }),
        (!v.isActive && w === null) ||
          (!x && !v.prevProp) ||
          Ja(x) ||
          typeof x == "boolean")
      )
        continue;
      let P =
          UT(v.prevProp, x) ||
          (m === c && v.isActive && !k && C) ||
          (p > y && C),
        I = !1,
        H = Array.isArray(x) ? x : [x],
        L = H.reduce(i, {});
      w === !1 && (L = {});
      let { prevResolvedValues: G = {} } = v,
        B = { ...G, ...L },
        J = (Y) => {
          (P = !0),
            h.has(Y) && ((I = !0), h.delete(Y)),
            (v.needsAnimating[Y] = !0);
          let V = e.getValue(Y);
          V && (V.liveStyle = !1);
        };
      for (let Y in B) {
        let V = L[Y],
          z = G[Y];
        if (g.hasOwnProperty(Y)) continue;
        let A = !1;
        $a(V) && $a(z) ? (A = !_g(V, z)) : (A = V !== z),
          A
            ? V !== void 0
              ? J(Y)
              : h.add(Y)
            : V !== void 0 && h.has(Y)
            ? J(Y)
            : (v.protectedKeys[Y] = !0);
      }
      (v.prevProp = x),
        (v.prevResolvedValues = L),
        v.isActive && (g = { ...g, ...L }),
        r && e.blockInitialAnimation && (P = !1),
        P &&
          (!k || I) &&
          d.push(
            ...H.map((Y) => ({ animation: Y, options: { type: m, ...l } }))
          );
    }
    if (h.size) {
      let p = {};
      h.forEach((m) => {
        let v = e.getBaseTarget(m);
        v !== void 0 && (p[m] = v);
        let x = e.getValue(m);
        x && (x.liveStyle = !0);
      }),
        d.push({ animation: p });
    }
    let S = !!d.length;
    return (
      r &&
        (u.initial === !1 || u.initial === u.animate) &&
        !e.manuallyAnimateOnMount &&
        (S = !1),
      (r = !1),
      S ? t(d) : Promise.resolve()
    );
  }
  function a(l, c, u) {
    var f;
    if (n[l].isActive === c) return Promise.resolve();
    (f = e.variantChildren) === null ||
      f === void 0 ||
      f.forEach((h) => {
        var g;
        return (g = h.animationState) === null || g === void 0
          ? void 0
          : g.setActive(l, c);
      }),
      (n[l].isActive = c);
    let d = s(u, l);
    for (let h in n) n[h].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: s,
    setActive: a,
    setAnimateFunction: o,
    getState: () => n,
  };
}
function UT(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !_g(t, e) : !1;
}
function Yr(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function XT() {
  return {
    animate: Yr(!0),
    whileInView: Yr(),
    whileHover: Yr(),
    whileTap: Yr(),
    whileDrag: Yr(),
    whileFocus: Yr(),
    exit: Yr(),
  };
}
var fr = class {
    constructor(e) {
      (this.isMounted = !1), (this.node = e);
    }
    update() {}
  },
  YT = class extends fr {
    constructor(e) {
      super(e), e.animationState || (e.animationState = WT(e));
    }
    updateAnimationControlsSubscription() {
      let { animate: e } = this.node.getProps();
      this.unmount(), Ja(e) && (this.unmount = e.subscribe(this.node));
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      let { animate: e } = this.node.getProps(),
        { animate: t } = this.node.prevProps || {};
      e !== t && this.updateAnimationControlsSubscription();
    }
    unmount() {}
  },
  GT = 0,
  KT = class extends fr {
    constructor() {
      super(...arguments), (this.id = GT++);
    }
    update() {
      if (!this.node.presenceContext) return;
      let {
          isPresent: e,
          onExitComplete: t,
          custom: n,
        } = this.node.presenceContext,
        { isPresent: r } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || e === r) return;
      let i = this.node.animationState.setActive("exit", !e, {
        custom: n ?? this.node.getProps().custom,
      });
      t && !e && i.then(() => t(this.id));
    }
    mount() {
      let { register: e } = this.node.presenceContext || {};
      e && (this.unmount = e(this.id));
    }
    unmount() {}
  },
  Mf = { animation: { Feature: YT }, exit: { Feature: KT } },
  Ku = (e, t) => Math.abs(e - t);
function Lg(e, t) {
  let n = Ku(e.x, t.x),
    r = Ku(e.y, t.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
function kt(e) {
  return e.max - e.min;
}
function qu(e, t = 0, n = 0.01) {
  return Math.abs(e - t) <= n;
}
function Wm(e, t, n, r = 0.5) {
  (e.origin = r),
    (e.originPoint = de(t.min, t.max, e.origin)),
    (e.scale = kt(n) / kt(t)),
    (qu(e.scale, 1, 1e-4) || isNaN(e.scale)) && (e.scale = 1),
    (e.translate = de(n.min, n.max, e.origin) - e.originPoint),
    (qu(e.translate) || isNaN(e.translate)) && (e.translate = 0);
}
function $o(e, t, n, r) {
  Wm(e.x, t.x, n.x, r ? r.originX : void 0),
    Wm(e.y, t.y, n.y, r ? r.originY : void 0);
}
function Um(e, t, n) {
  (e.min = n.min + t.min), (e.max = e.min + kt(t));
}
function qT(e, t, n) {
  Um(e.x, t.x, n.x), Um(e.y, t.y, n.y);
}
function Xm(e, t, n) {
  (e.min = t.min - n.min), (e.max = e.min + kt(t));
}
function jo(e, t, n) {
  Xm(e.x, t.x, n.x), Xm(e.y, t.y, n.y);
}
var Ym = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Mi = () => ({ x: Ym(), y: Ym() }),
  Gm = () => ({ min: 0, max: 0 }),
  Ee = () => ({ x: Gm(), y: Gm() });
function ll() {
  let e = M(Vi);
  if (e === null) return [!0, null];
  let { isPresent: t, onExitComplete: n, register: r } = e,
    i = Xr();
  return W(() => r(i), []), !t && n ? [!1, () => n && n(i)] : [!0];
}
var QT = (e, t) => e.depth - t.depth,
  Mg = class {
    constructor() {
      (this.children = []), (this.isDirty = !1);
    }
    add(e) {
      Tf(this.children, e), (this.isDirty = !0);
    }
    remove(e) {
      ol(this.children, e), (this.isDirty = !0);
    }
    forEach(e) {
      this.isDirty && this.children.sort(QT),
        (this.isDirty = !1),
        this.children.forEach(e);
    }
  };
function Og(e, t) {
  let n = Zr.now(),
    r = ({ timestamp: i }) => {
      let o = i - n;
      o >= t && (pt(r), e(o - t));
    };
  return Q.read(r, !0), () => pt(r);
}
var $n = new WeakMap(),
  Ga = { current: null },
  Of = { current: !1 };
function Ag() {
  if (((Of.current = !0), !!qo))
    if (_.matchMedia) {
      let e = _.matchMedia("(prefers-reduced-motion)"),
        t = () => (Ga.current = e.matches);
      e.addListener(t), t();
    } else Ga.current = !1;
}
function ZT(e, t, n) {
  let { willChange: r } = t;
  for (let i in t) {
    let o = t[i],
      s = n[i];
    if (ge(o)) e.addValue(i, o), Ya(r) && r.add(i);
    else if (ge(s)) e.addValue(i, he(o, { owner: e })), Ya(r) && r.remove(i);
    else if (s !== o)
      if (e.hasValue(i)) {
        let a = e.getValue(i);
        a.liveStyle === !0 ? a.jump(o) : a.hasAnimated || a.set(o);
      } else {
        let a = e.getStaticValue(i);
        e.addValue(i, he(a !== void 0 ? a : o, { owner: e }));
      }
  }
  for (let i in n) t[i] === void 0 && e.removeValue(i);
  return t;
}
var Dg = Object.keys(Yo),
  JT = Dg.length,
  Km = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete",
  ],
  eE = cf.length,
  Vg = class {
    constructor(
      {
        parent: e,
        props: t,
        presenceContext: n,
        reducedMotionConfig: r,
        visualState: i,
      },
      o = {}
    ) {
      (this.current = null),
        (this.children = new Set()),
        (this.isVariantNode = !1),
        (this.isControllingVariants = !1),
        (this.shouldReduceMotion = null),
        (this.values = new Map()),
        (this.features = {}),
        (this.valueSubscriptions = new Map()),
        (this.prevMotionValues = {}),
        (this.events = {}),
        (this.propEventSubscriptions = {}),
        (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
        (this.render = () => {
          this.current &&
            (this.triggerBuild(),
            this.renderInstance(
              this.current,
              this.renderState,
              this.props.style,
              this.projection
            ));
        }),
        (this.scheduleRender = () => Q.render(this.render, !1, !0));
      let { latestValues: s, renderState: a } = i;
      (this.latestValues = s),
        (this.baseTarget = { ...s }),
        (this.initialValues = t.initial ? { ...s } : {}),
        (this.renderState = a),
        (this.parent = e),
        (this.props = t),
        (this.presenceContext = n),
        (this.depth = e ? e.depth + 1 : 0),
        (this.reducedMotionConfig = r),
        (this.options = o),
        (this.isControllingVariants = el(t)),
        (this.isVariantNode = Xv(t)),
        this.isVariantNode && (this.variantChildren = new Set()),
        (this.manuallyAnimateOnMount = !!(e && e.current));
      let { willChange: l, ...c } = this.scrapeMotionValuesFromProps(
        t,
        {},
        this
      );
      for (let u in c) {
        let f = c[u];
        s[u] !== void 0 && ge(f) && (f.set(s[u], !1), Ya(l) && l.add(u));
      }
    }
    scrapeMotionValuesFromProps(e, t, n) {
      return {};
    }
    mount(e) {
      (this.current = e),
        $n.set(e, this),
        this.projection &&
          !this.projection.instance &&
          this.projection.mount(e),
        this.parent &&
          this.isVariantNode &&
          !this.isControllingVariants &&
          (this.removeFromVariantTree = this.parent.addVariantChild(this)),
        this.values.forEach((t, n) => this.bindToMotionValue(n, t)),
        Of.current || Ag(),
        (this.shouldReduceMotion =
          this.reducedMotionConfig === "never"
            ? !1
            : this.reducedMotionConfig === "always"
            ? !0
            : Ga.current),
        this.parent && this.parent.children.add(this),
        this.update(this.props, this.presenceContext);
    }
    unmount() {
      $n.delete(this.current),
        this.projection && this.projection.unmount(),
        pt(this.notifyUpdate),
        pt(this.render),
        this.valueSubscriptions.forEach((e) => e()),
        this.removeFromVariantTree && this.removeFromVariantTree(),
        this.parent && this.parent.children.delete(this);
      for (let e in this.events) this.events[e].clear();
      for (let e in this.features) this.features[e].unmount();
      this.current = null;
    }
    bindToMotionValue(e, t) {
      let n = ti.has(e),
        r = t.on("change", (o) => {
          (this.latestValues[e] = o),
            this.props.onUpdate && Q.update(this.notifyUpdate, !1, !0),
            n && this.projection && (this.projection.isTransformDirty = !0);
        }),
        i = t.on("renderRequest", this.scheduleRender);
      this.valueSubscriptions.set(e, () => {
        r(), i();
      });
    }
    sortNodePosition(e) {
      return !this.current ||
        !this.sortInstanceNodePosition ||
        this.type !== e.type
        ? 0
        : this.sortInstanceNodePosition(this.current, e.current);
    }
    loadFeatures({ children: e, ...t }, n, r, i) {
      let o, s;
      for (let a = 0; a < JT; a++) {
        let l = Dg[a],
          {
            isEnabled: c,
            Feature: u,
            ProjectionNode: f,
            MeasureLayout: d,
          } = Yo[l];
        f && (o = f),
          c(t) &&
            (!this.features[l] && u && (this.features[l] = new u(this)),
            d && (s = d));
      }
      if (
        (this.type === "html" || this.type === "svg") &&
        !this.projection &&
        o
      ) {
        this.projection = new o(
          this.latestValues,
          this.parent && this.parent.projection
        );
        let {
          layoutId: a,
          layout: l,
          drag: c,
          dragConstraints: u,
          layoutScroll: f,
          layoutRoot: d,
        } = t;
        this.projection.setOptions({
          layoutId: a,
          layout: l,
          alwaysMeasureLayout: !!c || (u && _i(u)),
          visualElement: this,
          scheduleRender: () => this.scheduleRender(),
          animationType: typeof l == "string" ? l : "both",
          initialPromotionConfig: i,
          layoutScroll: f,
          layoutRoot: d,
        });
      }
      return s;
    }
    updateFeatures() {
      for (let e in this.features) {
        let t = this.features[e];
        t.isMounted ? t.update() : (t.mount(), (t.isMounted = !0));
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.options, this.props);
    }
    measureViewportBox() {
      return this.current
        ? this.measureInstanceViewportBox(this.current, this.props)
        : Ee();
    }
    getStaticValue(e) {
      return this.latestValues[e];
    }
    setStaticValue(e, t) {
      this.latestValues[e] = t;
    }
    makeTargetAnimatable(e, t = !0) {
      return this.makeTargetAnimatableFromInstance(e, t);
    }
    update(e, t) {
      (e.transformTemplate || this.props.transformTemplate) &&
        this.scheduleRender(),
        (this.prevProps = this.props),
        (this.props = e),
        (this.prevPresenceContext = this.presenceContext),
        (this.presenceContext = t);
      for (let n = 0; n < Km.length; n++) {
        let r = Km[n];
        this.propEventSubscriptions[r] &&
          (this.propEventSubscriptions[r](),
          delete this.propEventSubscriptions[r]);
        let i = e["on" + r];
        i && (this.propEventSubscriptions[r] = this.on(r, i));
      }
      (this.prevMotionValues = ZT(
        this,
        this.scrapeMotionValuesFromProps(e, this.prevProps, this),
        this.prevMotionValues
      )),
        this.handleChildMotionValue && this.handleChildMotionValue();
    }
    getProps() {
      return this.props;
    }
    getVariant(e) {
      return this.props.variants ? this.props.variants[e] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode
        ? this
        : this.parent
        ? this.parent.getClosestVariantNode()
        : void 0;
    }
    getVariantContext(e = !1) {
      if (e) return this.parent ? this.parent.getVariantContext() : void 0;
      if (!this.isControllingVariants) {
        let n = this.parent ? this.parent.getVariantContext() || {} : {};
        return (
          this.props.initial !== void 0 && (n.initial = this.props.initial), n
        );
      }
      let t = {};
      for (let n = 0; n < eE; n++) {
        let r = cf[n],
          i = this.props[r];
        (Xo(i) || i === !1) && (t[r] = i);
      }
      return t;
    }
    addVariantChild(e) {
      let t = this.getClosestVariantNode();
      if (t)
        return (
          t.variantChildren && t.variantChildren.add(e),
          () => t.variantChildren.delete(e)
        );
    }
    addValue(e, t) {
      t !== this.values.get(e) &&
        (this.removeValue(e), this.bindToMotionValue(e, t)),
        this.values.set(e, t),
        (this.latestValues[e] = t.get());
    }
    removeValue(e) {
      this.values.delete(e);
      let t = this.valueSubscriptions.get(e);
      t && (t(), this.valueSubscriptions.delete(e)),
        delete this.latestValues[e],
        this.removeValueFromRenderState(e, this.renderState);
    }
    hasValue(e) {
      return this.values.has(e);
    }
    getValue(e, t) {
      if (this.props.values && this.props.values[e])
        return this.props.values[e];
      let n = this.values.get(e);
      return (
        n === void 0 &&
          t !== void 0 &&
          ((n = he(t, { owner: this })), this.addValue(e, n)),
        n
      );
    }
    readValue(e) {
      var t;
      return this.latestValues[e] !== void 0 || !this.current
        ? this.latestValues[e]
        : (t = this.getBaseTargetFromProps(this.props, e)) !== null &&
          t !== void 0
        ? t
        : this.readValueFromInstance(this.current, e, this.options);
    }
    setBaseTarget(e, t) {
      this.baseTarget[e] = t;
    }
    getBaseTarget(e) {
      var t;
      let { initial: n } = this.props,
        r =
          typeof n == "string" || typeof n == "object"
            ? (t = hf(this.props, n)) === null || t === void 0
              ? void 0
              : t[e]
            : void 0;
      if (n && r !== void 0) return r;
      let i = this.getBaseTargetFromProps(this.props, e);
      return i !== void 0 && !ge(i)
        ? i
        : this.initialValues[e] !== void 0 && r === void 0
        ? void 0
        : this.baseTarget[e];
    }
    on(e, t) {
      return (
        this.events[e] || (this.events[e] = new Ef()), this.events[e].add(t)
      );
    }
    notify(e, ...t) {
      this.events[e] && this.events[e].notify(...t);
    }
  };
function Bg(e) {
  function t(r, i = {}) {
    return Yv(e(r, i));
  }
  if (typeof Proxy > "u") return t;
  let n = new Map();
  return new Proxy(t, {
    get: (r, i) => (n.has(i) || n.set(i, t(i)), n.get(i)),
  });
}
var tE = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function Af(e) {
  return typeof e != "string" || e.includes("-")
    ? !1
    : !!(tE.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
function Hg(e, { layout: t, layoutId: n }) {
  return (
    ti.has(e) ||
    e.startsWith("origin") ||
    ((t || n !== void 0) && (!!Na[e] || e === "opacity"))
  );
}
var nE = (e, t) => (t && typeof e == "number" ? t.transform(e) : e);
function Df(e, t, n, r) {
  let { style: i, vars: o, transform: s, transformOrigin: a } = e,
    l = !1,
    c = !1,
    u = !0;
  for (let f in t) {
    let d = t[f];
    if (pg(f)) {
      o[f] = d;
      continue;
    }
    let h = Sg[f],
      g = nE(d, h);
    if (ti.has(f)) {
      if (((l = !0), (s[f] = g), !u)) continue;
      d !== (h.default || 0) && (u = !1);
    } else f.startsWith("origin") ? ((c = !0), (a[f] = g)) : (i[f] = g);
  }
  if (
    (t.transform ||
      (l || r
        ? (i.transform = Gv(e.transform, n, u, r))
        : i.transform && (i.transform = "none")),
    c)
  ) {
    let { originX: f = "50%", originY: d = "50%", originZ: h = 0 } = a;
    i.transformOrigin = `${f} ${d} ${h}`;
  }
}
var Vf = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function zg(e, t, n) {
  for (let r in t) !ge(t[r]) && !Hg(r, n) && (e[r] = t[r]);
}
function rE({ transformTemplate: e }, t, n) {
  return fe(() => {
    let r = Vf();
    return (
      Df(r, t, { enableHardwareAcceleration: !n }, e),
      Object.assign({}, r.vars, r.style)
    );
  }, [t]);
}
function iE(e, t, n) {
  let r = e.style || {},
    i = {};
  return zg(i, r, e), Object.assign(i, rE(e, t, n)), i;
}
function oE(e, t, n) {
  let r = {},
    i = iE(e, t, n);
  return (
    e.drag &&
      e.dragListener !== !1 &&
      ((r.draggable = !1),
      (i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none"),
      (i.touchAction =
        e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`)),
    e.tabIndex === void 0 &&
      (e.onTap || e.onTapStart || e.whileTap) &&
      (r.tabIndex = 0),
    (r.style = i),
    r
  );
}
function qm(e, t, n) {
  return typeof e == "string" ? e : j.transform(t + n * e);
}
function sE(e, t, n) {
  let r = qm(t, e.x, e.width),
    i = qm(n, e.y, e.height);
  return `${r} ${i}`;
}
var aE = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  lE = { offset: "strokeDashoffset", array: "strokeDasharray" };
function cE(e, t, n = 1, r = 0, i = !0) {
  e.pathLength = 1;
  let o = i ? aE : lE;
  e[o.offset] = j.transform(-r);
  let s = j.transform(t),
    a = j.transform(n);
  e[o.array] = `${s} ${a}`;
}
function Bf(
  e,
  {
    attrX: t,
    attrY: n,
    attrScale: r,
    originX: i,
    originY: o,
    pathLength: s,
    pathSpacing: a = 1,
    pathOffset: l = 0,
    ...c
  },
  u,
  f,
  d
) {
  if ((Df(e, c, u, d), f)) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  (e.attrs = e.style), (e.style = {});
  let { attrs: h, style: g, dimensions: y } = e;
  h.transform && (y && (g.transform = h.transform), delete h.transform),
    y &&
      (i !== void 0 || o !== void 0 || g.transform) &&
      (g.transformOrigin = sE(
        y,
        i !== void 0 ? i : 0.5,
        o !== void 0 ? o : 0.5
      )),
    t !== void 0 && (h.x = t),
    n !== void 0 && (h.y = n),
    r !== void 0 && (h.scale = r),
    s !== void 0 && cE(h, s, a, l, !1);
}
var Ng = () => ({ ...Vf(), attrs: {} }),
  Hf = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function uE(e, t, n, r) {
  let i = fe(() => {
    let o = Ng();
    return (
      Bf(o, t, { enableHardwareAcceleration: !1 }, Hf(r), e.transformTemplate),
      { ...o.attrs, style: { ...o.style } }
    );
  }, [t]);
  if (e.style) {
    let o = {};
    zg(o, e.style, e), (i.style = { ...o, ...i.style });
  }
  return i;
}
function fE(e = !1) {
  return (n, r, i, { latestValues: o }, s) => {
    let l = (Af(n) ? uE : oE)(r, o, s, n),
      c = Qv(r, typeof n == "string", e),
      u = n !== Ii ? { ...c, ...l, ref: i } : {},
      { children: f } = r,
      d = fe(() => (ge(f) ? f.get() : f), [f]);
    return le(n, { ...u, children: d });
  };
}
function $g(e, { style: t, vars: n }, r, i) {
  Object.assign(e.style, t, i && i.getProjectionStyles(r));
  for (let o in n) e.style.setProperty(o, n[o]);
}
var jg = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust",
]);
function Wg(e, t, n, r) {
  $g(e, t, void 0, r);
  for (let i in t.attrs) e.setAttribute(jg.has(i) ? i : sf(i), t.attrs[i]);
}
function zf(e, t, n) {
  var r;
  let { style: i } = e,
    o = {};
  for (let s in i)
    (ge(i[s]) ||
      (t.style && ge(t.style[s])) ||
      Hg(s, e) ||
      ((r = n?.getValue(s)) === null || r === void 0 ? void 0 : r.liveStyle) !==
        void 0) &&
      (o[s] = i[s]);
  return o;
}
function Ug(e, t, n) {
  let r = zf(e, t, n);
  for (let i in e)
    if (ge(e[i]) || ge(t[i])) {
      let o =
        Qo.indexOf(i) !== -1
          ? "attr" + i.charAt(0).toUpperCase() + i.substring(1)
          : i;
      r[o] = e[i];
    }
  return r;
}
var dE = {
    useVisualState: tl({
      scrapeMotionValuesFromProps: Ug,
      createRenderState: Ng,
      onMount: (e, t, { renderState: n, latestValues: r }) => {
        Q.read(() => {
          try {
            n.dimensions =
              typeof t.getBBox == "function"
                ? t.getBBox()
                : t.getBoundingClientRect();
          } catch {
            n.dimensions = { x: 0, y: 0, width: 0, height: 0 };
          }
        }),
          Q.render(() => {
            Bf(
              n,
              r,
              { enableHardwareAcceleration: !1 },
              Hf(t.tagName),
              e.transformTemplate
            ),
              Wg(t, n);
          });
      },
    }),
  },
  hE = {
    useVisualState: tl({
      scrapeMotionValuesFromProps: zf,
      createRenderState: Vf,
    }),
  };
function Xg(e, { forwardMotionProps: t = !1 }, n, r) {
  return {
    ...(Af(e) ? dE : hE),
    preloadedFeatures: n,
    useRender: fE(t),
    createVisualElement: r,
    Component: e,
  };
}
function Qm(e, t) {
  let n = "pointer" + (t ? "enter" : "leave"),
    r = "onHover" + (t ? "Start" : "End"),
    i = (o, s) => {
      if (o.pointerType === "touch" || pf()) return;
      let a = e.getProps();
      e.animationState &&
        a.whileHover &&
        e.animationState.setActive("whileHover", t),
        a[r] && Q.update(() => a[r](o, s));
    };
  return xn(e.current, n, i, { passive: !e.getProps()[r] });
}
var pE = class extends fr {
    mount() {
      this.unmount = Sn(Qm(this.node, !0), Qm(this.node, !1));
    }
    unmount() {}
  },
  mE = class extends fr {
    constructor() {
      super(...arguments), (this.isActive = !1);
    }
    onFocus() {
      let e = !1;
      try {
        e = this.node.current.matches(":focus-visible");
      } catch {
        e = !0;
      }
      !e ||
        !this.node.animationState ||
        (this.node.animationState.setActive("whileFocus", !0),
        (this.isActive = !0));
    }
    onBlur() {
      !this.isActive ||
        !this.node.animationState ||
        (this.node.animationState.setActive("whileFocus", !1),
        (this.isActive = !1));
    }
    mount() {
      this.unmount = Sn(
        Vn(this.node.current, "focus", () => this.onFocus()),
        Vn(this.node.current, "blur", () => this.onBlur())
      );
    }
    unmount() {}
  },
  Yg = (e, t) => (t ? (e === t ? !0 : Yg(e, t.parentElement)) : !1);
function _u(e, t) {
  if (!t) return;
  let n = new PointerEvent("pointer" + e);
  t(n, nl(n));
}
var vE = class extends fr {
    constructor() {
      super(...arguments),
        (this.removeStartListeners = Le),
        (this.removeEndListeners = Le),
        (this.removeAccessibleListeners = Le),
        (this.startPointerPress = (e, t) => {
          if (this.isPressing) return;
          this.removeEndListeners();
          let n = this.node.getProps(),
            i = xn(
              _,
              "pointerup",
              (s, a) => {
                if (!this.checkPressEnd()) return;
                let {
                  onTap: l,
                  onTapCancel: c,
                  globalTapTarget: u,
                } = this.node.getProps();
                Q.update(() => {
                  !u && !Yg(this.node.current, s.target)
                    ? c && c(s, a)
                    : l && l(s, a);
                });
              },
              { passive: !(n.onTap || n.onPointerUp) }
            ),
            o = xn(_, "pointercancel", (s, a) => this.cancelPress(s, a), {
              passive: !(n.onTapCancel || n.onPointerCancel),
            });
          (this.removeEndListeners = Sn(i, o)), this.startPress(e, t);
        }),
        (this.startAccessiblePress = () => {
          let e = (i) => {
              if (i.key !== "Enter" || this.isPressing) return;
              let o = (s) => {
                s.key !== "Enter" ||
                  !this.checkPressEnd() ||
                  _u("up", (a, l) => {
                    let { onTap: c } = this.node.getProps();
                    c && Q.update(() => c(a, l));
                  });
              };
              this.removeEndListeners(),
                (this.removeEndListeners = Vn(this.node.current, "keyup", o)),
                _u("down", (s, a) => {
                  this.startPress(s, a);
                });
            },
            t = Vn(this.node.current, "keydown", e),
            n = () => {
              this.isPressing && _u("cancel", (i, o) => this.cancelPress(i, o));
            },
            r = Vn(this.node.current, "blur", n);
          this.removeAccessibleListeners = Sn(t, r);
        });
    }
    startPress(e, t) {
      this.isPressing = !0;
      let { onTapStart: n, whileTap: r } = this.node.getProps();
      r &&
        this.node.animationState &&
        this.node.animationState.setActive("whileTap", !0),
        n && Q.update(() => n(e, t));
    }
    checkPressEnd() {
      return (
        this.removeEndListeners(),
        (this.isPressing = !1),
        this.node.getProps().whileTap &&
          this.node.animationState &&
          this.node.animationState.setActive("whileTap", !1),
        !pf()
      );
    }
    cancelPress(e, t) {
      if (!this.checkPressEnd()) return;
      let { onTapCancel: n } = this.node.getProps();
      n && Q.update(() => n(e, t));
    }
    mount() {
      let e = this.node.getProps(),
        t = xn(
          e.globalTapTarget ? _ : this.node.current,
          "pointerdown",
          this.startPointerPress,
          { passive: !(e.onTapStart || e.onPointerStart) }
        ),
        n = Vn(this.node.current, "focus", this.startAccessiblePress);
      this.removeStartListeners = Sn(t, n);
    }
    unmount() {
      this.removeStartListeners(),
        this.removeEndListeners(),
        this.removeAccessibleListeners();
    }
  },
  Qu = new WeakMap(),
  Lu = new WeakMap(),
  gE = (e) => {
    let t = Qu.get(e.target);
    t && t(e);
  },
  yE = (e) => {
    e.forEach(gE);
  };
function bE({ root: e, ...t }) {
  let n = e || document;
  Lu.has(n) || Lu.set(n, {});
  let r = Lu.get(n),
    i = JSON.stringify(t);
  return r[i] || (r[i] = new IntersectionObserver(yE, { root: e, ...t })), r[i];
}
function xE(e, t, n) {
  let r = bE(t);
  return (
    Qu.set(e, n),
    r.observe(e),
    () => {
      Qu.delete(e), r.unobserve(e);
    }
  );
}
var SE = { some: 0, all: 1 },
  wE = class extends fr {
    constructor() {
      super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1);
    }
    startObserver() {
      this.unmount();
      let { viewport: e = {} } = this.node.getProps(),
        { root: t, margin: n, amount: r = "some", once: i } = e,
        o = {
          root: t ? t.current : void 0,
          rootMargin: n,
          threshold: typeof r == "number" ? r : SE[r],
        },
        s = (a) => {
          let { isIntersecting: l } = a;
          if (
            this.isInView === l ||
            ((this.isInView = l), i && !l && this.hasEnteredView)
          )
            return;
          l && (this.hasEnteredView = !0),
            this.node.animationState &&
              this.node.animationState.setActive("whileInView", l);
          let { onViewportEnter: c, onViewportLeave: u } = this.node.getProps(),
            f = l ? c : u;
          f && f(a);
        };
      return xE(this.node.current, o, s);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > "u") return;
      let { props: e, prevProps: t } = this.node;
      ["amount", "margin", "root"].some(CE(e, t)) && this.startObserver();
    }
    unmount() {}
  };
function CE({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
var Gg = {
    inView: { Feature: wE },
    tap: { Feature: vE },
    focus: { Feature: mE },
    hover: { Feature: pE },
  },
  Kg = class {
    constructor(
      e,
      t,
      { transformPagePoint: n, contextWindow: r, dragSnapToOrigin: i = !1 } = {}
    ) {
      if (
        ((this.startEvent = null),
        (this.lastMoveEvent = null),
        (this.lastMoveEventInfo = null),
        (this.handlers = {}),
        (this.contextWindow = _),
        (this.updatePoint = () => {
          if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
          let u = Ou(this.lastMoveEventInfo, this.history),
            f = this.startEvent !== null,
            d = Lg(u.offset, { x: 0, y: 0 }) >= 3;
          if (!f && !d) return;
          let { point: h } = u,
            { timestamp: g } = Re;
          this.history.push({ ...h, timestamp: g });
          let { onStart: y, onMove: S } = this.handlers;
          f ||
            (y && y(this.lastMoveEvent, u),
            (this.startEvent = this.lastMoveEvent)),
            S && S(this.lastMoveEvent, u);
        }),
        (this.handlePointerMove = (u, f) => {
          (this.lastMoveEvent = u),
            (this.lastMoveEventInfo = Mu(f, this.transformPagePoint)),
            Q.update(this.updatePoint, !0);
        }),
        (this.handlePointerUp = (u, f) => {
          this.end();
          let { onEnd: d, onSessionEnd: h, resumeAnimation: g } = this.handlers;
          if (
            (this.dragSnapToOrigin && g && g(),
            !(this.lastMoveEvent && this.lastMoveEventInfo))
          )
            return;
          let y = Ou(
            u.type === "pointercancel"
              ? this.lastMoveEventInfo
              : Mu(f, this.transformPagePoint),
            this.history
          );
          this.startEvent && d && d(u, y), h && h(u, y);
        }),
        !Zv(e))
      )
        return;
      (this.dragSnapToOrigin = i),
        (this.handlers = t),
        (this.transformPagePoint = n),
        (this.contextWindow = r || _);
      let o = nl(e),
        s = Mu(o, this.transformPagePoint),
        { point: a } = s,
        { timestamp: l } = Re;
      this.history = [{ ...a, timestamp: l }];
      let { onSessionStart: c } = t;
      c && c(e, Ou(s, this.history)),
        (this.removeListeners = Sn(
          xn(this.contextWindow, "pointermove", this.handlePointerMove),
          xn(this.contextWindow, "pointerup", this.handlePointerUp),
          xn(this.contextWindow, "pointercancel", this.handlePointerUp)
        ));
    }
    updateHandlers(e) {
      this.handlers = e;
    }
    end() {
      this.removeListeners && this.removeListeners(), pt(this.updatePoint);
    }
  };
function Mu(e, t) {
  return t ? { point: t(e.point) } : e;
}
function Zm(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Ou({ point: e }, t) {
  return {
    point: e,
    delta: Zm(e, qg(t)),
    offset: Zm(e, kE(t)),
    velocity: TE(t, 0.1),
  };
}
function kE(e) {
  return e[0];
}
function qg(e) {
  return e[e.length - 1];
}
function TE(e, t) {
  if (e.length < 2) return { x: 0, y: 0 };
  let n = e.length - 1,
    r = null,
    i = qg(e);
  for (; n >= 0 && ((r = e[n]), !(i.timestamp - r.timestamp > Bn(t))); ) n--;
  if (!r) return { x: 0, y: 0 };
  let o = wn(i.timestamp - r.timestamp);
  if (o === 0) return { x: 0, y: 0 };
  let s = { x: (i.x - r.x) / o, y: (i.y - r.y) / o };
  return s.x === 1 / 0 && (s.x = 0), s.y === 1 / 0 && (s.y = 0), s;
}
function EE(e, { min: t, max: n }, r) {
  return (
    t !== void 0 && e < t
      ? (e = r ? de(t, e, r.min) : Math.max(e, t))
      : n !== void 0 && e > n && (e = r ? de(n, e, r.max) : Math.min(e, n)),
    e
  );
}
function Jm(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0,
  };
}
function RE(e, { top: t, left: n, bottom: r, right: i }) {
  return { x: Jm(e.x, n, i), y: Jm(e.y, t, r) };
}
function ev(e, t) {
  let n = t.min - e.min,
    r = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r };
}
function PE(e, t) {
  return { x: ev(e.x, t.x), y: ev(e.y, t.y) };
}
function IE(e, t) {
  let n = 0.5,
    r = kt(e),
    i = kt(t);
  return (
    i > r
      ? (n = cr(t.min, t.max - r, e.min))
      : r > i && (n = cr(e.min, e.max - i, t.min)),
    zn(0, 1, n)
  );
}
function FE(e, t) {
  let n = {};
  return (
    t.min !== void 0 && (n.min = t.min - e.min),
    t.max !== void 0 && (n.max = t.max - e.min),
    n
  );
}
var Zu = 0.35;
function _E(e = Zu) {
  return (
    e === !1 ? (e = 0) : e === !0 && (e = Zu),
    { x: tv(e, "left", "right"), y: tv(e, "top", "bottom") }
  );
}
function tv(e, t, n) {
  return { min: nv(e, t), max: nv(e, n) };
}
function nv(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
function Xt(e) {
  return [e("x"), e("y")];
}
function Qg({ top: e, left: t, right: n, bottom: r }) {
  return { x: { min: t, max: n }, y: { min: e, max: r } };
}
function LE({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function ME(e, t) {
  if (!t) return e;
  let n = t({ x: e.left, y: e.top }),
    r = t({ x: e.right, y: e.bottom });
  return { top: n.y, left: n.x, bottom: r.y, right: r.x };
}
function Au(e) {
  return e === void 0 || e === 1;
}
function Ju({ scale: e, scaleX: t, scaleY: n }) {
  return !Au(e) || !Au(t) || !Au(n);
}
function Gr(e) {
  return (
    Ju(e) ||
    Zg(e) ||
    e.z ||
    e.rotate ||
    e.rotateX ||
    e.rotateY ||
    e.skewX ||
    e.skewY
  );
}
function Zg(e) {
  return rv(e.x) || rv(e.y);
}
function rv(e) {
  return e && e !== "0%";
}
function Ka(e, t, n) {
  let r = e - n,
    i = t * r;
  return n + i;
}
function iv(e, t, n, r, i) {
  return i !== void 0 && (e = Ka(e, i, r)), Ka(e, n, r) + t;
}
function ef(e, t = 0, n = 1, r, i) {
  (e.min = iv(e.min, t, n, r, i)), (e.max = iv(e.max, t, n, r, i));
}
function Jg(e, { x: t, y: n }) {
  ef(e.x, t.translate, t.scale, t.originPoint),
    ef(e.y, n.translate, n.scale, n.originPoint);
}
function OE(e, t, n, r = !1) {
  let i = n.length;
  if (!i) return;
  t.x = t.y = 1;
  let o, s;
  for (let a = 0; a < i; a++) {
    (o = n[a]), (s = o.projectionDelta);
    let l = o.instance;
    (l && l.style && l.style.display === "contents") ||
      (r &&
        o.options.layoutScroll &&
        o.scroll &&
        o !== o.root &&
        Oi(e, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
      s && ((t.x *= s.x.scale), (t.y *= s.y.scale), Jg(e, s)),
      r && Gr(o.latestValues) && Oi(e, o.latestValues));
  }
  (t.x = ov(t.x)), (t.y = ov(t.y));
}
function ov(e) {
  return Number.isInteger(e) || e > 1.0000000000001 || e < 0.999999999999
    ? e
    : 1;
}
function lr(e, t) {
  (e.min = e.min + t), (e.max = e.max + t);
}
function sv(e, t, [n, r, i]) {
  let o = t[i] !== void 0 ? t[i] : 0.5,
    s = de(e.min, e.max, o);
  ef(e, t[n], t[r], s, t.scale);
}
var AE = ["x", "scaleX", "originX"],
  DE = ["y", "scaleY", "originY"];
function Oi(e, t) {
  sv(e.x, t, AE), sv(e.y, t, DE);
}
function ey(e, t) {
  return Qg(ME(e.getBoundingClientRect(), t));
}
function VE(e, t, n) {
  let r = ey(e, n),
    { scroll: i } = t;
  return i && (lr(r.x, i.offset.x), lr(r.y, i.offset.y)), r;
}
var ty = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
  BE = new WeakMap(),
  HE = class {
    constructor(e) {
      (this.openGlobalLock = null),
        (this.isDragging = !1),
        (this.currentDirection = null),
        (this.originPoint = { x: 0, y: 0 }),
        (this.constraints = !1),
        (this.hasMutatedConstraints = !1),
        (this.elastic = Ee()),
        (this.visualElement = e);
    }
    start(e, { snapToCursor: t = !1 } = {}) {
      let { presenceContext: n } = this.visualElement;
      if (n && n.isPresent === !1) return;
      let r = (c) => {
          let { dragSnapToOrigin: u } = this.getProps();
          u ? this.pauseAnimation() : this.stopAnimation(),
            t && this.snapToCursor(nl(c, "page").point);
        },
        i = (c, u) => {
          let { drag: f, dragPropagation: d, onDragStart: h } = this.getProps();
          if (
            f &&
            !d &&
            (this.openGlobalLock && this.openGlobalLock(),
            (this.openGlobalLock = tg(f)),
            !this.openGlobalLock)
          )
            return;
          (this.isDragging = !0),
            (this.currentDirection = null),
            this.resolveConstraints(),
            this.visualElement.projection &&
              ((this.visualElement.projection.isAnimationBlocked = !0),
              (this.visualElement.projection.target = void 0)),
            Xt((y) => {
              let S = this.getAxisMotionValue(y).get() || 0;
              if (bn.test(S)) {
                let { projection: p } = this.visualElement;
                if (p && p.layout) {
                  let m = p.layout.layoutBox[y];
                  m && (S = kt(m) * (parseFloat(S) / 100));
                }
              }
              this.originPoint[y] = S;
            }),
            h && Q.update(() => h(c, u), !1, !0);
          let { animationState: g } = this.visualElement;
          g && g.setActive("whileDrag", !0);
        },
        o = (c, u) => {
          let {
            dragPropagation: f,
            dragDirectionLock: d,
            onDirectionLock: h,
            onDrag: g,
          } = this.getProps();
          if (!f && !this.openGlobalLock) return;
          let { offset: y } = u;
          if (d && this.currentDirection === null) {
            (this.currentDirection = zE(y)),
              this.currentDirection !== null && h && h(this.currentDirection);
            return;
          }
          this.updateAxis("x", u.point, y),
            this.updateAxis("y", u.point, y),
            this.visualElement.render(),
            g && g(c, u);
        },
        s = (c, u) => this.stop(c, u),
        a = () =>
          Xt((c) => {
            var u;
            return (
              this.getAnimationState(c) === "paused" &&
              ((u = this.getAxisMotionValue(c).animation) === null ||
              u === void 0
                ? void 0
                : u.play())
            );
          }),
        { dragSnapToOrigin: l } = this.getProps();
      this.panSession = new Kg(
        e,
        {
          onSessionStart: r,
          onStart: i,
          onMove: o,
          onSessionEnd: s,
          resumeAnimation: a,
        },
        {
          transformPagePoint: this.visualElement.getTransformPagePoint(),
          dragSnapToOrigin: l,
          contextWindow: ty(this.visualElement),
        }
      );
    }
    stop(e, t) {
      let n = this.isDragging;
      if ((this.cancel(), !n)) return;
      let { velocity: r } = t;
      this.startAnimation(r);
      let { onDragEnd: i } = this.getProps();
      i && Q.update(() => i(e, t));
    }
    cancel() {
      this.isDragging = !1;
      let { projection: e, animationState: t } = this.visualElement;
      e && (e.isAnimationBlocked = !1),
        this.panSession && this.panSession.end(),
        (this.panSession = void 0);
      let { dragPropagation: n } = this.getProps();
      !n &&
        this.openGlobalLock &&
        (this.openGlobalLock(), (this.openGlobalLock = null)),
        t && t.setActive("whileDrag", !1);
    }
    updateAxis(e, t, n) {
      let { drag: r } = this.getProps();
      if (!n || !Oa(e, r, this.currentDirection)) return;
      let i = this.getAxisMotionValue(e),
        o = this.originPoint[e] + n[e];
      this.constraints &&
        this.constraints[e] &&
        (o = EE(o, this.constraints[e], this.elastic[e])),
        i.set(o);
    }
    resolveConstraints() {
      var e;
      let { dragConstraints: t, dragElastic: n } = this.getProps(),
        r =
          this.visualElement.projection && !this.visualElement.projection.layout
            ? this.visualElement.projection.measure(!1)
            : (e = this.visualElement.projection) === null || e === void 0
            ? void 0
            : e.layout,
        i = this.constraints;
      t && _i(t)
        ? this.constraints || (this.constraints = this.resolveRefConstraints())
        : t && r
        ? (this.constraints = RE(r.layoutBox, t))
        : (this.constraints = !1),
        (this.elastic = _E(n)),
        i !== this.constraints &&
          r &&
          this.constraints &&
          !this.hasMutatedConstraints &&
          Xt((o) => {
            this.getAxisMotionValue(o) &&
              (this.constraints[o] = FE(r.layoutBox[o], this.constraints[o]));
          });
    }
    resolveRefConstraints() {
      let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
      if (!e || !_i(e)) return !1;
      let n = e.current;
      it(
        n !== null,
        "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop."
      );
      let { projection: r } = this.visualElement;
      if (!r || !r.layout) return !1;
      let i = VE(n, r.root, this.visualElement.getTransformPagePoint()),
        o = PE(r.layout.layoutBox, i);
      if (t) {
        let s = t(LE(o));
        (this.hasMutatedConstraints = !!s), s && (o = Qg(s));
      }
      return o;
    }
    startAnimation(e) {
      let {
          drag: t,
          dragMomentum: n,
          dragElastic: r,
          dragTransition: i,
          dragSnapToOrigin: o,
          onDragTransitionEnd: s,
        } = this.getProps(),
        a = this.constraints || {},
        l = Xt((c) => {
          if (!Oa(c, t, this.currentDirection)) return;
          let u = (a && a[c]) || {};
          o && (u = { min: 0, max: 0 });
          let f = r ? 200 : 1e6,
            d = r ? 40 : 1e7,
            h = {
              type: "inertia",
              velocity: n ? e[c] : 0,
              bounceStiffness: f,
              bounceDamping: d,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10,
              ...i,
              ...u,
            };
          return this.startAxisValueAnimation(c, h);
        });
      return Promise.all(l).then(s);
    }
    startAxisValueAnimation(e, t) {
      let n = this.getAxisMotionValue(e);
      return n.start(Ff(e, n, 0, t));
    }
    stopAnimation() {
      Xt((e) => this.getAxisMotionValue(e).stop());
    }
    pauseAnimation() {
      Xt((e) => {
        var t;
        return (t = this.getAxisMotionValue(e).animation) === null ||
          t === void 0
          ? void 0
          : t.pause();
      });
    }
    getAnimationState(e) {
      var t;
      return (t = this.getAxisMotionValue(e).animation) === null || t === void 0
        ? void 0
        : t.state;
    }
    getAxisMotionValue(e) {
      let t = "_drag" + e.toUpperCase(),
        n = this.visualElement.getProps(),
        r = n[t];
      return (
        r ||
        this.visualElement.getValue(e, (n.initial ? n.initial[e] : void 0) || 0)
      );
    }
    snapToCursor(e) {
      Xt((t) => {
        let { drag: n } = this.getProps();
        if (!Oa(t, n, this.currentDirection)) return;
        let { projection: r } = this.visualElement,
          i = this.getAxisMotionValue(t);
        if (r && r.layout) {
          let { min: o, max: s } = r.layout.layoutBox[t];
          i.set(e[t] - de(o, s, 0.5));
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      let { drag: e, dragConstraints: t } = this.getProps(),
        { projection: n } = this.visualElement;
      if (!_i(t) || !n || !this.constraints) return;
      this.stopAnimation();
      let r = { x: 0, y: 0 };
      Xt((o) => {
        let s = this.getAxisMotionValue(o);
        if (s) {
          let a = s.get();
          r[o] = IE({ min: a, max: a }, this.constraints[o]);
        }
      });
      let { transformTemplate: i } = this.visualElement.getProps();
      (this.visualElement.current.style.transform = i ? i({}, "") : "none"),
        n.root && n.root.updateScroll(),
        n.updateLayout(),
        this.resolveConstraints(),
        Xt((o) => {
          if (!Oa(o, e, null)) return;
          let s = this.getAxisMotionValue(o),
            { min: a, max: l } = this.constraints[o];
          s.set(de(a, l, r[o]));
        });
    }
    addListeners() {
      if (!this.visualElement.current) return;
      BE.set(this.visualElement, this);
      let e = this.visualElement.current,
        t = xn(e, "pointerdown", (a) => {
          let { drag: l, dragListener: c = !0 } = this.getProps();
          l && c && this.start(a);
        }),
        n = () => {
          let { dragConstraints: a } = this.getProps();
          _i(a) && (this.constraints = this.resolveRefConstraints());
        },
        { projection: r } = this.visualElement,
        i = r.addEventListener("measure", n);
      r && !r.layout && (r.root && r.root.updateScroll(), r.updateLayout()),
        n();
      let o = Vn(_, "resize", () => this.scalePositionWithinConstraints()),
        s = r.addEventListener(
          "didUpdate",
          ({ delta: a, hasLayoutChanged: l }) => {
            this.isDragging &&
              l &&
              (Xt((c) => {
                let u = this.getAxisMotionValue(c);
                u &&
                  ((this.originPoint[c] += a[c].translate),
                  u.set(u.get() + a[c].translate));
              }),
              this.visualElement.render());
          }
        );
      return () => {
        o(), t(), i(), s && s();
      };
    }
    getProps() {
      let e = this.visualElement.getProps(),
        {
          drag: t = !1,
          dragDirectionLock: n = !1,
          dragPropagation: r = !1,
          dragConstraints: i = !1,
          dragElastic: o = Zu,
          dragMomentum: s = !0,
        } = e;
      return {
        ...e,
        drag: t,
        dragDirectionLock: n,
        dragPropagation: r,
        dragConstraints: i,
        dragElastic: o,
        dragMomentum: s,
      };
    }
  };
function Oa(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function zE(e, t = 10) {
  let n = null;
  return Math.abs(e.y) > t ? (n = "y") : Math.abs(e.x) > t && (n = "x"), n;
}
var NE = class extends fr {
    constructor(e) {
      super(e),
        (this.removeGroupControls = Le),
        (this.removeListeners = Le),
        (this.controls = new HE(e));
    }
    mount() {
      let { dragControls: e } = this.node.getProps();
      e && (this.removeGroupControls = e.subscribe(this.controls)),
        (this.removeListeners = this.controls.addListeners() || Le);
    }
    unmount() {
      this.removeGroupControls(), this.removeListeners();
    }
  },
  av = (e) => (t, n) => {
    e && Q.update(() => e(t, n));
  },
  $E = class extends fr {
    constructor() {
      super(...arguments), (this.removePointerDownListener = Le);
    }
    onPointerDown(e) {
      this.session = new Kg(e, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: ty(this.node),
      });
    }
    createPanHandlers() {
      let {
        onPanSessionStart: e,
        onPanStart: t,
        onPan: n,
        onPanEnd: r,
      } = this.node.getProps();
      return {
        onSessionStart: av(e),
        onStart: av(t),
        onMove: n,
        onEnd: (i, o) => {
          delete this.session, r && Q.update(() => r(i, o));
        },
      };
    }
    mount() {
      this.removePointerDownListener = xn(
        this.node.current,
        "pointerdown",
        (e) => this.onPointerDown(e)
      );
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener(), this.session && this.session.end();
    }
  },
  Ba = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
function lv(e, t) {
  return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
}
var Ao = {
    correct: (e, t) => {
      if (!t.target) return e;
      if (typeof e == "string")
        if (j.test(e)) e = parseFloat(e);
        else return e;
      let n = lv(e, t.target.x),
        r = lv(e, t.target.y);
      return `${n}% ${r}%`;
    },
  },
  jE = {
    correct: (e, { treeScale: t, projectionDelta: n }) => {
      let r = e,
        i = Nn.parse(e);
      if (i.length > 5) return r;
      let o = Nn.createTransformer(e),
        s = typeof i[0] != "number" ? 1 : 0,
        a = n.x.scale * t.x,
        l = n.y.scale * t.y;
      (i[0 + s] /= a), (i[1 + s] /= l);
      let c = de(a, l, 0.5);
      return (
        typeof i[2 + s] == "number" && (i[2 + s] /= c),
        typeof i[3 + s] == "number" && (i[3 + s] /= c),
        o(i)
      );
    },
  },
  WE = class extends b.Component {
    componentDidMount() {
      let {
          visualElement: e,
          layoutGroup: t,
          switchLayoutGroup: n,
          layoutId: r,
        } = this.props,
        { projection: i } = e;
      ff(UE),
        i &&
          (t.group && t.group.add(i),
          n && n.register && r && n.register(i),
          i.root.didUpdate(),
          i.addEventListener("animationComplete", () => {
            this.safeToRemove();
          }),
          i.setOptions({
            ...i.options,
            onExitComplete: () => this.safeToRemove(),
          })),
        (Ba.hasEverUpdated = !0);
    }
    getSnapshotBeforeUpdate(e) {
      let {
          layoutDependency: t,
          visualElement: n,
          drag: r,
          isPresent: i,
        } = this.props,
        o = n.projection;
      return (
        o &&
          ((o.isPresent = i),
          r || e.layoutDependency !== t || t === void 0
            ? o.willUpdate()
            : this.safeToRemove(),
          e.isPresent !== i &&
            (i
              ? o.promote()
              : o.relegate() ||
                Q.postRender(() => {
                  let s = o.getStack();
                  (!s || !s.members.length) && this.safeToRemove();
                }))),
        null
      );
    }
    componentDidUpdate() {
      let { projection: e } = this.props.visualElement;
      e &&
        (e.root.didUpdate(),
        af.postRender(() => {
          !e.currentAnimation && e.isLead() && this.safeToRemove();
        }));
    }
    componentWillUnmount() {
      let {
          visualElement: e,
          layoutGroup: t,
          switchLayoutGroup: n,
        } = this.props,
        { projection: r } = e;
      r &&
        (r.scheduleCheckAfterUnmount(),
        t && t.group && t.group.remove(r),
        n && n.deregister && n.deregister(r));
    }
    safeToRemove() {
      let { safeToRemove: e } = this.props;
      e && e();
    }
    render() {
      return null;
    }
  };
function ny(e) {
  let [t, n] = ll(),
    r = M(Uo);
  return b.createElement(WE, {
    ...e,
    layoutGroup: r,
    switchLayoutGroup: M(Za),
    isPresent: t,
    safeToRemove: n,
  });
}
var UE = {
    borderRadius: {
      ...Ao,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: Ao,
    borderTopRightRadius: Ao,
    borderBottomLeftRadius: Ao,
    borderBottomRightRadius: Ao,
    boxShadow: jE,
  },
  ry = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  XE = ry.length,
  cv = (e) => (typeof e == "string" ? parseFloat(e) : e),
  uv = (e) => typeof e == "number" || j.test(e);
function YE(e, t, n, r, i, o) {
  i
    ? ((e.opacity = de(0, n.opacity !== void 0 ? n.opacity : 1, GE(r))),
      (e.opacityExit = de(t.opacity !== void 0 ? t.opacity : 1, 0, KE(r))))
    : o &&
      (e.opacity = de(
        t.opacity !== void 0 ? t.opacity : 1,
        n.opacity !== void 0 ? n.opacity : 1,
        r
      ));
  for (let s = 0; s < XE; s++) {
    let a = `border${ry[s]}Radius`,
      l = fv(t, a),
      c = fv(n, a);
    if (l === void 0 && c === void 0) continue;
    l || (l = 0),
      c || (c = 0),
      l === 0 || c === 0 || uv(l) === uv(c)
        ? ((e[a] = Math.max(de(cv(l), cv(c), r), 0)),
          (bn.test(c) || bn.test(l)) && (e[a] += "%"))
        : (e[a] = c);
  }
  (t.rotate || n.rotate) && (e.rotate = de(t.rotate || 0, n.rotate || 0, r));
}
function fv(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
var GE = iy(0, 0.5, yf),
  KE = iy(0.5, 0.95, Le);
function iy(e, t, n) {
  return (r) => (r < e ? 0 : r > t ? 1 : n(cr(e, t, r)));
}
function dv(e, t) {
  (e.min = t.min), (e.max = t.max);
}
function Ut(e, t) {
  dv(e.x, t.x), dv(e.y, t.y);
}
function hv(e, t, n, r, i) {
  return (
    (e -= t), (e = Ka(e, 1 / n, r)), i !== void 0 && (e = Ka(e, 1 / i, r)), e
  );
}
function qE(e, t = 0, n = 1, r = 0.5, i, o = e, s = e) {
  if (
    (bn.test(t) &&
      ((t = parseFloat(t)), (t = de(s.min, s.max, t / 100) - s.min)),
    typeof t != "number")
  )
    return;
  let a = de(o.min, o.max, r);
  e === o && (a -= t),
    (e.min = hv(e.min, t, n, a, i)),
    (e.max = hv(e.max, t, n, a, i));
}
function pv(e, t, [n, r, i], o, s) {
  qE(e, t[n], t[r], t[i], t.scale, o, s);
}
var QE = ["x", "scaleX", "originX"],
  ZE = ["y", "scaleY", "originY"];
function mv(e, t, n, r) {
  pv(e.x, t, QE, n ? n.x : void 0, r ? r.x : void 0),
    pv(e.y, t, ZE, n ? n.y : void 0, r ? r.y : void 0);
}
function vv(e) {
  return e.translate === 0 && e.scale === 1;
}
function oy(e) {
  return vv(e.x) && vv(e.y);
}
function JE(e, t) {
  return (
    e.x.min === t.x.min &&
    e.x.max === t.x.max &&
    e.y.min === t.y.min &&
    e.y.max === t.y.max
  );
}
function sy(e, t) {
  return (
    Math.round(e.x.min) === Math.round(t.x.min) &&
    Math.round(e.x.max) === Math.round(t.x.max) &&
    Math.round(e.y.min) === Math.round(t.y.min) &&
    Math.round(e.y.max) === Math.round(t.y.max)
  );
}
function gv(e) {
  return kt(e.x) / kt(e.y);
}
var eR = class {
  constructor() {
    this.members = [];
  }
  add(e) {
    Tf(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (
      (ol(this.members, e),
      e === this.prevLead && (this.prevLead = void 0),
      e === this.lead)
    ) {
      let t = this.members[this.members.length - 1];
      t && this.promote(t);
    }
  }
  relegate(e) {
    let t = this.members.findIndex((r) => e === r);
    if (t === 0) return !1;
    let n;
    for (let r = t; r >= 0; r--) {
      let i = this.members[r];
      if (i.isPresent !== !1) {
        n = i;
        break;
      }
    }
    return n ? (this.promote(n), !0) : !1;
  }
  promote(e, t) {
    let n = this.lead;
    if (e !== n && ((this.prevLead = n), (this.lead = e), e.show(), n)) {
      n.instance && n.scheduleRender(),
        e.scheduleRender(),
        (e.resumeFrom = n),
        t && (e.resumeFrom.preserveOpacity = !0),
        n.snapshot &&
          ((e.snapshot = n.snapshot),
          (e.snapshot.latestValues = n.animationValues || n.latestValues)),
        e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
      let { crossfade: r } = e.options;
      r === !1 && n.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      let { options: t, resumingFrom: n } = e;
      t.onExitComplete && t.onExitComplete(),
        n && n.options.onExitComplete && n.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
};
function yv(e, t, n) {
  let r = "",
    i = e.x.translate / t.x,
    o = e.y.translate / t.y,
    s = n?.z || 0;
  if (
    ((i || o || s) && (r = `translate3d(${i}px, ${o}px, ${s}px) `),
    (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
    n)
  ) {
    let { rotate: c, rotateX: u, rotateY: f, skewX: d, skewY: h } = n;
    c && (r += `rotate(${c}deg) `),
      u && (r += `rotateX(${u}deg) `),
      f && (r += `rotateY(${f}deg) `),
      d && (r += `skewX(${d}deg) `),
      h && (r += `skewY(${h}deg) `);
  }
  let a = e.x.scale * t.x,
    l = e.y.scale * t.y;
  return (a !== 1 || l !== 1) && (r += `scale(${a}, ${l})`), r || "none";
}
function tR(e) {
  _.MotionDebug && _.MotionDebug.record(e);
}
function ay(e) {
  return e instanceof SVGElement && e.tagName !== "svg";
}
function Nf(e, t, n) {
  let r = ge(e) ? e : he(e);
  return r.start(Ff("", r, t, n)), r.animation;
}
var Du = ["", "X", "Y", "Z"],
  nR = { visibility: "hidden" };
function Vu(e, t, n) {
  let { latestValues: r } = t;
  r[e] && ((n[e] = r[e]), t.setStaticValue(e, 0));
}
var bv = 1e3,
  rR = 0,
  Kr = {
    type: "projectionFrame",
    totalNodes: 0,
    resolvedTargetDeltas: 0,
    recalculatedProjection: 0,
  };
function ly({
  attachResizeListener: e,
  defaultParent: t,
  measureScroll: n,
  checkIsScrollRoot: r,
  resetTransform: i,
}) {
  return class {
    constructor(s = {}, a = t?.()) {
      (this.id = rR++),
        (this.animationId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.updateScheduled = !1),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          (this.projectionUpdateScheduled = !1),
            (Kr.totalNodes =
              Kr.resolvedTargetDeltas =
              Kr.recalculatedProjection =
                0),
            this.nodes.forEach(sR),
            this.nodes.forEach(fR),
            this.nodes.forEach(dR),
            this.nodes.forEach(aR),
            tR(Kr);
        }),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = s),
        (this.root = a ? a.root || a : this),
        (this.path = a ? [...a.path, a] : []),
        (this.parent = a),
        (this.depth = a ? a.depth + 1 : 0);
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Mg());
    }
    addEventListener(s, a) {
      return (
        this.eventHandlers.has(s) || this.eventHandlers.set(s, new Ef()),
        this.eventHandlers.get(s).add(a)
      );
    }
    notifyListeners(s, ...a) {
      let l = this.eventHandlers.get(s);
      l && l.notify(...a);
    }
    hasListeners(s) {
      return this.eventHandlers.has(s);
    }
    mount(s, a = this.root.hasTreeAnimated) {
      if (this.instance) return;
      (this.isSVG = ay(s)), (this.instance = s);
      let { layoutId: l, layout: c, visualElement: u } = this.options;
      if (
        (u && !u.current && u.mount(s),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        a && (c || l) && (this.isLayoutDirty = !0),
        e)
      ) {
        let f,
          d = () => (this.root.updateBlockedByResize = !1);
        e(s, () => {
          (this.root.updateBlockedByResize = !0),
            f && f(),
            (f = Og(d, 250)),
            Ba.hasAnimatedSinceResize &&
              ((Ba.hasAnimatedSinceResize = !1), this.nodes.forEach(Sv));
        });
      }
      l && this.root.registerSharedNode(l, this),
        this.options.animate !== !1 &&
          u &&
          (l || c) &&
          this.addEventListener(
            "didUpdate",
            ({
              delta: f,
              hasLayoutChanged: d,
              hasRelativeTargetChanged: h,
              layout: g,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                (this.target = void 0), (this.relativeTarget = void 0);
                return;
              }
              let y = this.options.transition || u.getDefaultTransition() || gR,
                { onLayoutAnimationStart: S, onLayoutAnimationComplete: p } =
                  u.getProps(),
                m = !this.targetLayout || !sy(this.targetLayout, g) || h,
                v = !d && h;
              if (
                this.options.layoutRoot ||
                (this.resumeFrom && this.resumeFrom.instance) ||
                v ||
                (d && (m || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0)),
                  this.setAnimationOrigin(f, v);
                let x = { ...If(y, "layout"), onPlay: S, onComplete: p };
                (u.shouldReduceMotion || this.options.layoutRoot) &&
                  ((x.delay = 0), (x.type = !1)),
                  this.startAnimation(x);
              } else
                d || Sv(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete();
              this.targetLayout = g;
            }
          );
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      let s = this.getStack();
      s && s.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        pt(this.updateProjection);
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return (
        this.isAnimationBlocked ||
        (this.parent && this.parent.isTreeAnimationBlocked()) ||
        !1
      );
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0),
        this.nodes && this.nodes.forEach(hR),
        this.animationId++);
    }
    getTransformTemplate() {
      let { visualElement: s } = this.options;
      return s && s.getProps().transformTemplate;
    }
    willUpdate(s = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (!this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let u = 0; u < this.path.length; u++) {
        let f = this.path[u];
        (f.shouldResetTransform = !0),
          f.updateScroll("snapshot"),
          f.options.layoutRoot && f.willUpdate(!1);
      }
      let { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l) return;
      let c = this.getTransformTemplate();
      (this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0),
        this.updateSnapshot(),
        s && this.notifyListeners("willUpdate");
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(xv);
        return;
      }
      this.isUpdating || this.nodes.forEach(cR),
        (this.isUpdating = !1),
        _.HandoffCancelAllAnimations && _.HandoffCancelAllAnimations(),
        this.nodes.forEach(uR),
        this.nodes.forEach(iR),
        this.nodes.forEach(oR),
        this.clearAllSnapshots();
      let a = Zr.now();
      (Re.delta = zn(0, 1e3 / 60, a - Re.timestamp)),
        (Re.timestamp = a),
        (Re.isProcessing = !0),
        Da.update.process(Re),
        Da.preRender.process(Re),
        Da.render.process(Re),
        (Re.isProcessing = !1);
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), af.read(() => this.update()));
    }
    clearAllSnapshots() {
      this.nodes.forEach(lR), this.sharedNodes.forEach(pR);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        Q.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Q.postRender(() => {
        this.isLayoutDirty
          ? this.root.didUpdate()
          : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) &&
          !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
      let s = this.layout;
      (this.layout = this.measure(!1)),
        (this.layoutCorrected = Ee()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox);
      let { visualElement: a } = this.options;
      a &&
        a.notify(
          "LayoutMeasure",
          this.layout.layoutBox,
          s ? s.layoutBox : void 0
        );
    }
    updateScroll(s = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      this.scroll &&
        this.scroll.animationId === this.root.animationId &&
        this.scroll.phase === s &&
        (a = !1),
        a &&
          (this.scroll = {
            animationId: this.root.animationId,
            phase: s,
            isRoot: r(this.instance),
            offset: n(this.instance),
          });
    }
    resetTransform() {
      if (!i) return;
      let s = this.isLayoutDirty || this.shouldResetTransform,
        a = this.projectionDelta && !oy(this.projectionDelta),
        l = this.getTransformTemplate(),
        c = l ? l(this.latestValues, "") : void 0,
        u = c !== this.prevTransformTemplateValue;
      s &&
        (a || Gr(this.latestValues) || u) &&
        (i(this.instance, c),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(s = !0) {
      let a = this.measurePageBox(),
        l = this.removeElementScroll(a);
      return (
        s && (l = this.removeTransform(l)),
        yR(l),
        {
          animationId: this.root.animationId,
          measuredBox: a,
          layoutBox: l,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      let { visualElement: s } = this.options;
      if (!s) return Ee();
      let a = s.measureViewportBox(),
        { scroll: l } = this.root;
      return l && (lr(a.x, l.offset.x), lr(a.y, l.offset.y)), a;
    }
    removeElementScroll(s) {
      let a = Ee();
      Ut(a, s);
      for (let l = 0; l < this.path.length; l++) {
        let c = this.path[l],
          { scroll: u, options: f } = c;
        if (c !== this.root && u && f.layoutScroll) {
          if (u.isRoot) {
            Ut(a, s);
            let { scroll: d } = this.root;
            d && (lr(a.x, -d.offset.x), lr(a.y, -d.offset.y));
          }
          lr(a.x, u.offset.x), lr(a.y, u.offset.y);
        }
      }
      return a;
    }
    applyTransform(s, a = !1) {
      let l = Ee();
      Ut(l, s);
      for (let c = 0; c < this.path.length; c++) {
        let u = this.path[c];
        !a &&
          u.options.layoutScroll &&
          u.scroll &&
          u !== u.root &&
          Oi(l, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }),
          Gr(u.latestValues) && Oi(l, u.latestValues);
      }
      return Gr(this.latestValues) && Oi(l, this.latestValues), l;
    }
    removeTransform(s) {
      let a = Ee();
      Ut(a, s);
      for (let l = 0; l < this.path.length; l++) {
        let c = this.path[l];
        if (!c.instance || !Gr(c.latestValues)) continue;
        Ju(c.latestValues) && c.updateSnapshot();
        let u = Ee(),
          f = c.measurePageBox();
        Ut(u, f),
          mv(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u);
      }
      return Gr(this.latestValues) && mv(a, this.latestValues), a;
    }
    setTargetDelta(s) {
      (this.targetDelta = s),
        this.root.scheduleUpdateProjection(),
        (this.isProjectionDirty = !0);
    }
    setOptions(s) {
      this.options = {
        ...this.options,
        ...s,
        crossfade: s.crossfade !== void 0 ? s.crossfade : !0,
      };
    }
    clearMeasurements() {
      (this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1);
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== Re.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(s = !1) {
      var a;
      let l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty),
        this.isSharedProjectionDirty ||
          (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      let c = !!this.resumingFrom || this !== l;
      if (
        !(
          s ||
          (c && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          (!((a = this.parent) === null || a === void 0) &&
            a.isProjectionDirty) ||
          this.attemptToResolveRelativeTarget
        )
      )
        return;
      let { layout: f, layoutId: d } = this.options;
      if (!(!this.layout || !(f || d))) {
        if (
          ((this.resolvedRelativeTargetAt = Re.timestamp),
          !this.targetDelta && !this.relativeTarget)
        ) {
          let h = this.getClosestProjectingParent();
          h && h.layout && this.animationProgress !== 1
            ? ((this.relativeParent = h),
              this.forceRelativeParentToResolveTarget(),
              (this.relativeTarget = Ee()),
              (this.relativeTargetOrigin = Ee()),
              jo(
                this.relativeTargetOrigin,
                this.layout.layoutBox,
                h.layout.layoutBox
              ),
              Ut(this.relativeTarget, this.relativeTargetOrigin))
            : (this.relativeParent = this.relativeTarget = void 0);
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (
            (this.target ||
              ((this.target = Ee()), (this.targetWithTransforms = Ee())),
            this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.relativeParent &&
            this.relativeParent.target
              ? (this.forceRelativeParentToResolveTarget(),
                qT(
                  this.target,
                  this.relativeTarget,
                  this.relativeParent.target
                ))
              : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : Ut(this.target, this.layout.layoutBox),
                Jg(this.target, this.targetDelta))
              : Ut(this.target, this.layout.layoutBox),
            this.attemptToResolveRelativeTarget)
          ) {
            this.attemptToResolveRelativeTarget = !1;
            let h = this.getClosestProjectingParent();
            h &&
            !!h.resumingFrom == !!this.resumingFrom &&
            !h.options.layoutScroll &&
            h.target &&
            this.animationProgress !== 1
              ? ((this.relativeParent = h),
                this.forceRelativeParentToResolveTarget(),
                (this.relativeTarget = Ee()),
                (this.relativeTargetOrigin = Ee()),
                jo(this.relativeTargetOrigin, this.target, h.target),
                Ut(this.relativeTarget, this.relativeTargetOrigin))
              : (this.relativeParent = this.relativeTarget = void 0);
          }
          Kr.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (
        !(
          !this.parent ||
          Ju(this.parent.latestValues) ||
          Zg(this.parent.latestValues)
        )
      )
        return this.parent.isProjecting()
          ? this.parent
          : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    calcProjection() {
      var s;
      let a = this.getLead(),
        l = !!this.resumingFrom || this !== a,
        c = !0;
      if (
        ((this.isProjectionDirty ||
          (!((s = this.parent) === null || s === void 0) &&
            s.isProjectionDirty)) &&
          (c = !1),
        l &&
          (this.isSharedProjectionDirty || this.isTransformDirty) &&
          (c = !1),
        this.resolvedRelativeTargetAt === Re.timestamp && (c = !1),
        c)
      )
        return;
      let { layout: u, layoutId: f } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating ||
          (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(u || f))
      )
        return;
      Ut(this.layoutCorrected, this.layout.layoutBox);
      let d = this.treeScale.x,
        h = this.treeScale.y;
      OE(this.layoutCorrected, this.treeScale, this.path, l),
        a.layout &&
          !a.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((a.target = a.layout.layoutBox), (a.targetWithTransforms = Ee()));
      let { target: g } = a;
      if (!g) {
        this.projectionTransform &&
          ((this.projectionDelta = Mi()),
          (this.projectionTransform = "none"),
          this.scheduleRender());
        return;
      }
      this.projectionDelta ||
        ((this.projectionDelta = Mi()),
        (this.projectionDeltaWithTransform = Mi()));
      let y = this.projectionTransform;
      $o(this.projectionDelta, this.layoutCorrected, g, this.latestValues),
        (this.projectionTransform = yv(this.projectionDelta, this.treeScale)),
        (this.projectionTransform !== y ||
          this.treeScale.x !== d ||
          this.treeScale.y !== h) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", g)),
        Kr.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(s = !0) {
      if ((this.options.scheduleRender && this.options.scheduleRender(), s)) {
        let a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom &&
        !this.resumingFrom.instance &&
        (this.resumingFrom = void 0);
    }
    setAnimationOrigin(s, a = !1) {
      let l = this.snapshot,
        c = l ? l.latestValues : {},
        u = { ...this.latestValues },
        f = Mi();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a);
      let d = Ee(),
        h = l ? l.source : void 0,
        g = this.layout ? this.layout.source : void 0,
        y = h !== g,
        S = this.getStack(),
        p = !S || S.members.length <= 1,
        m = !!(y && !p && this.options.crossfade === !0 && !this.path.some(vR));
      this.animationProgress = 0;
      let v;
      (this.mixTargetDelta = (x) => {
        let C = x / 1e3;
        wv(f.x, s.x, C),
          wv(f.y, s.y, C),
          this.setTargetDelta(f),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (jo(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            mR(this.relativeTarget, this.relativeTargetOrigin, d, C),
            v && JE(this.relativeTarget, v) && (this.isProjectionDirty = !1),
            v || (v = Ee()),
            Ut(v, this.relativeTarget)),
          y &&
            ((this.animationValues = u), YE(u, c, this.latestValues, C, m, p)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = C);
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(s) {
      this.notifyListeners("animationStart"),
        this.currentAnimation && this.currentAnimation.stop(),
        this.resumingFrom &&
          this.resumingFrom.currentAnimation &&
          this.resumingFrom.currentAnimation.stop(),
        this.pendingAnimation &&
          (pt(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = Q.update(() => {
          (Ba.hasAnimatedSinceResize = !0),
            (this.currentAnimation = Nf(0, bv, {
              ...s,
              onUpdate: (a) => {
                this.mixTargetDelta(a), s.onUpdate && s.onUpdate(a);
              },
              onComplete: () => {
                s.onComplete && s.onComplete(), this.completeAnimation();
              },
            })),
            this.resumingFrom &&
              (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0);
        }));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      let s = this.getStack();
      s && s.exitAnimationComplete(),
        (this.resumingFrom =
          this.currentAnimation =
          this.animationValues =
            void 0),
        this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(bv),
        this.currentAnimation.stop()),
        this.completeAnimation();
    }
    applyTransformsToTarget() {
      let s = this.getLead(),
        { targetWithTransforms: a, target: l, layout: c, latestValues: u } = s;
      if (!(!a || !l || !c)) {
        if (
          this !== s &&
          this.layout &&
          c &&
          cy(this.options.animationType, this.layout.layoutBox, c.layoutBox)
        ) {
          l = this.target || Ee();
          let f = kt(this.layout.layoutBox.x);
          (l.x.min = s.target.x.min), (l.x.max = l.x.min + f);
          let d = kt(this.layout.layoutBox.y);
          (l.y.min = s.target.y.min), (l.y.max = l.y.min + d);
        }
        Ut(a, l),
          Oi(a, u),
          $o(this.projectionDeltaWithTransform, this.layoutCorrected, a, u);
      }
    }
    registerSharedNode(s, a) {
      this.sharedNodes.has(s) || this.sharedNodes.set(s, new eR()),
        this.sharedNodes.get(s).add(a);
      let c = a.options.initialPromotionConfig;
      a.promote({
        transition: c ? c.transition : void 0,
        preserveFollowOpacity:
          c && c.shouldPreserveFollowOpacity
            ? c.shouldPreserveFollowOpacity(a)
            : void 0,
      });
    }
    isLead() {
      let s = this.getStack();
      return s ? s.lead === this : !0;
    }
    getLead() {
      var s;
      let { layoutId: a } = this.options;
      return a
        ? ((s = this.getStack()) === null || s === void 0 ? void 0 : s.lead) ||
            this
        : this;
    }
    getPrevLead() {
      var s;
      let { layoutId: a } = this.options;
      return a
        ? (s = this.getStack()) === null || s === void 0
          ? void 0
          : s.prevLead
        : void 0;
    }
    getStack() {
      let { layoutId: s } = this.options;
      if (s) return this.root.sharedNodes.get(s);
    }
    promote({ needsReset: s, transition: a, preserveFollowOpacity: l } = {}) {
      let c = this.getStack();
      c && c.promote(this, l),
        s && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        a && this.setOptions({ transition: a });
    }
    relegate() {
      let s = this.getStack();
      return s ? s.relegate(this) : !1;
    }
    resetRotation() {
      let { visualElement: s } = this.options;
      if (!s) return;
      let a = !1,
        { latestValues: l } = s;
      if (
        ((l.z ||
          l.rotate ||
          l.rotateX ||
          l.rotateY ||
          l.rotateZ ||
          l.skewX ||
          l.skewY) &&
          (a = !0),
        !a)
      )
        return;
      let c = {};
      l.z && Vu("z", s, c);
      for (let u = 0; u < Du.length; u++)
        Vu(`rotate${Du[u]}`, s, c), Vu(`skew${Du[u]}`, s, c);
      s.render();
      for (let u in c) s.setStaticValue(u, c[u]);
      s.scheduleRender();
    }
    getProjectionStyles(s) {
      var a, l;
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) return nR;
      let c = { visibility: "" },
        u = this.getTransformTemplate();
      if (this.needsReset)
        return (
          (this.needsReset = !1),
          (c.opacity = ""),
          (c.pointerEvents = rt(s?.pointerEvents) || ""),
          (c.transform = u ? u(this.latestValues, "") : "none"),
          c
        );
      let f = this.getLead();
      if (!this.projectionDelta || !this.layout || !f.target) {
        let y = {};
        return (
          this.options.layoutId &&
            ((y.opacity =
              this.latestValues.opacity !== void 0
                ? this.latestValues.opacity
                : 1),
            (y.pointerEvents = rt(s?.pointerEvents) || "")),
          this.hasProjected &&
            !Gr(this.latestValues) &&
            ((y.transform = u ? u({}, "") : "none"), (this.hasProjected = !1)),
          y
        );
      }
      let d = f.animationValues || f.latestValues;
      this.applyTransformsToTarget(),
        (c.transform = yv(
          this.projectionDeltaWithTransform,
          this.treeScale,
          d
        )),
        u && (c.transform = u(d, c.transform));
      let { x: h, y: g } = this.projectionDelta;
      (c.transformOrigin = `${h.origin * 100}% ${g.origin * 100}% 0`),
        f.animationValues
          ? (c.opacity =
              f === this
                ? (l =
                    (a = d.opacity) !== null && a !== void 0
                      ? a
                      : this.latestValues.opacity) !== null && l !== void 0
                  ? l
                  : 1
                : this.preserveOpacity
                ? this.latestValues.opacity
                : d.opacityExit)
          : (c.opacity =
              f === this
                ? d.opacity !== void 0
                  ? d.opacity
                  : ""
                : d.opacityExit !== void 0
                ? d.opacityExit
                : 0);
      for (let y in Na) {
        if (d[y] === void 0) continue;
        let { correct: S, applyTo: p } = Na[y],
          m = c.transform === "none" ? d[y] : S(d[y], f);
        if (p) {
          let v = p.length;
          for (let x = 0; x < v; x++) c[p[x]] = m;
        } else c[y] = m;
      }
      return (
        this.options.layoutId &&
          (c.pointerEvents = f === this ? rt(s?.pointerEvents) || "" : "none"),
        c
      );
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      this.root.nodes.forEach((s) => {
        var a;
        return (a = s.currentAnimation) === null || a === void 0
          ? void 0
          : a.stop();
      }),
        this.root.nodes.forEach(xv),
        this.root.sharedNodes.clear();
    }
  };
}
function iR(e) {
  e.updateLayout();
}
function oR(e) {
  var t;
  let n =
    ((t = e.resumeFrom) === null || t === void 0 ? void 0 : t.snapshot) ||
    e.snapshot;
  if (e.isLead() && e.layout && n && e.hasListeners("didUpdate")) {
    let { layoutBox: r, measuredBox: i } = e.layout,
      { animationType: o } = e.options,
      s = n.source !== e.layout.source;
    o === "size"
      ? Xt((f) => {
          let d = s ? n.measuredBox[f] : n.layoutBox[f],
            h = kt(d);
          (d.min = r[f].min), (d.max = d.min + h);
        })
      : cy(o, n.layoutBox, r) &&
        Xt((f) => {
          let d = s ? n.measuredBox[f] : n.layoutBox[f],
            h = kt(r[f]);
          (d.max = d.min + h),
            e.relativeTarget &&
              !e.currentAnimation &&
              ((e.isProjectionDirty = !0),
              (e.relativeTarget[f].max = e.relativeTarget[f].min + h));
        });
    let a = Mi();
    $o(a, r, n.layoutBox);
    let l = Mi();
    s ? $o(l, e.applyTransform(i, !0), n.measuredBox) : $o(l, r, n.layoutBox);
    let c = !oy(a),
      u = !1;
    if (!e.resumeFrom) {
      let f = e.getClosestProjectingParent();
      if (f && !f.resumeFrom) {
        let { snapshot: d, layout: h } = f;
        if (d && h) {
          let g = Ee();
          jo(g, n.layoutBox, d.layoutBox);
          let y = Ee();
          jo(y, r, h.layoutBox),
            sy(g, y) || (u = !0),
            f.options.layoutRoot &&
              ((e.relativeTarget = y),
              (e.relativeTargetOrigin = g),
              (e.relativeParent = f));
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: r,
      snapshot: n,
      delta: l,
      layoutDelta: a,
      hasLayoutChanged: c,
      hasRelativeTargetChanged: u,
    });
  } else if (e.isLead()) {
    let { onExitComplete: r } = e.options;
    r && r();
  }
  e.options.transition = void 0;
}
function sR(e) {
  Kr.totalNodes++,
    e.parent &&
      (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
      e.isSharedProjectionDirty ||
        (e.isSharedProjectionDirty = !!(
          e.isProjectionDirty ||
          e.parent.isProjectionDirty ||
          e.parent.isSharedProjectionDirty
        )),
      e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function aR(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function lR(e) {
  e.clearSnapshot();
}
function xv(e) {
  e.clearMeasurements();
}
function cR(e) {
  e.isLayoutDirty = !1;
}
function uR(e) {
  let { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"),
    e.resetTransform();
}
function Sv(e) {
  e.finishAnimation(),
    (e.targetDelta = e.relativeTarget = e.target = void 0),
    (e.isProjectionDirty = !0);
}
function fR(e) {
  e.resolveTargetDelta();
}
function dR(e) {
  e.calcProjection();
}
function hR(e) {
  e.resetRotation();
}
function pR(e) {
  e.removeLeadSnapshot();
}
function wv(e, t, n) {
  (e.translate = de(t.translate, 0, n)),
    (e.scale = de(t.scale, 1, n)),
    (e.origin = t.origin),
    (e.originPoint = t.originPoint);
}
function Cv(e, t, n, r) {
  (e.min = de(t.min, n.min, r)), (e.max = de(t.max, n.max, r));
}
function mR(e, t, n, r) {
  Cv(e.x, t.x, n.x, r), Cv(e.y, t.y, n.y, r);
}
function vR(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var gR = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  kv = (e) =>
    typeof qe < "u" && qe.userAgent && qe.userAgent.toLowerCase().includes(e),
  Tv = kv("applewebkit/") && !kv("chrome/") ? Math.round : Le;
function Ev(e) {
  (e.min = Tv(e.min)), (e.max = Tv(e.max));
}
function yR(e) {
  Ev(e.x), Ev(e.y);
}
function cy(e, t, n) {
  return (
    e === "position" || (e === "preserve-aspect" && !qu(gv(t), gv(n), 0.2))
  );
}
var bR = ly({
    attachResizeListener: (e, t) => Vn(e, "resize", t),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  Jr = { current: void 0 },
  uy = ly({
    measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
    defaultParent: () => {
      if (!Jr.current) {
        let e = new bR({});
        e.mount(_), e.setOptions({ layoutScroll: !0 }), (Jr.current = e);
      }
      return Jr.current;
    },
    resetTransform: (e, t) => {
      e.style.transform = t !== void 0 ? t : "none";
    },
    checkIsScrollRoot: (e) => _.getComputedStyle(e).position === "fixed",
  }),
  fy = {
    pan: { Feature: $E },
    drag: { Feature: NE, ProjectionNode: uy, MeasureLayout: ny },
  },
  xR = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function SR(e) {
  let t = xR.exec(e);
  if (!t) return [,];
  let [, n, r, i] = t;
  return [`--${n ?? r}`, i];
}
var wR = 4;
function tf(e, t, n = 1) {
  it(
    n <= wR,
    `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`
  );
  let [r, i] = SR(e);
  if (!r) return;
  let o = _.getComputedStyle(t).getPropertyValue(r);
  if (o) {
    let s = o.trim();
    return bg(s) ? parseFloat(s) : s;
  }
  return Wa(i) ? tf(i, t, n + 1) : i;
}
function CR(e, { ...t }, n) {
  let r = e.current;
  if (!(r instanceof Element)) return { target: t, transitionEnd: n };
  n && (n = { ...n }),
    e.values.forEach((i) => {
      let o = i.get();
      if (!Wa(o)) return;
      let s = tf(o, r);
      s && i.set(s);
    });
  for (let i in t) {
    let o = t[i];
    if (!Wa(o)) continue;
    let s = tf(o, r);
    s && ((t[i] = s), n || (n = {}), n[i] === void 0 && (n[i] = o));
  }
  return { target: t, transitionEnd: n };
}
var kR = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "x",
    "y",
    "translateX",
    "translateY",
  ]),
  dy = (e) => kR.has(e),
  TR = (e) => Object.keys(e).some(dy),
  Aa = (e) => e === Hi || e === j,
  Rv = (e, t) => parseFloat(e.split(", ")[t]),
  Pv =
    (e, t) =>
    (n, { transform: r }) => {
      if (r === "none" || !r) return 0;
      let i = r.match(/^matrix3d\((.+)\)$/u);
      if (i) return Rv(i[1], t);
      {
        let o = r.match(/^matrix\((.+)\)$/u);
        return o ? Rv(o[1], e) : 0;
      }
    },
  ER = new Set(["x", "y", "z"]),
  RR = Qo.filter((e) => !ER.has(e));
function PR(e) {
  let t = [];
  return (
    RR.forEach((n) => {
      let r = e.getValue(n);
      r !== void 0 &&
        (t.push([n, r.get()]), r.set(n.startsWith("scale") ? 1 : 0));
    }),
    t.length && e.render(),
    t
  );
}
var Di = {
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: n = "0" }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: n = "0" }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  x: Pv(4, 13),
  y: Pv(5, 14),
};
Di.translateX = Di.x;
Di.translateY = Di.y;
var IR = (e, t, n) => {
    let r = t.measureViewportBox(),
      i = t.current,
      o = getComputedStyle(i),
      { display: s } = o,
      a = {};
    s === "none" && t.setStaticValue("display", e.display || "block"),
      n.forEach((c) => {
        a[c] = Di[c](r, o);
      }),
      t.render();
    let l = t.measureViewportBox();
    return (
      n.forEach((c) => {
        let u = t.getValue(c);
        u && u.jump(a[c]), (e[c] = Di[c](l, o));
      }),
      e
    );
  },
  FR = (e, t, n = {}, r = {}) => {
    (t = { ...t }), (r = { ...r });
    let i = Object.keys(t).filter(dy),
      o = [],
      s = !1,
      a = [];
    if (
      (i.forEach((l) => {
        let c = e.getValue(l);
        if (!e.hasValue(l)) return;
        let u = n[l],
          f = Oo(u),
          d = t[l],
          h;
        if ($a(d)) {
          let g = d.length,
            y = d[0] === null ? 1 : 0;
          (u = d[y]), (f = Oo(u));
          for (let S = y; S < g && d[S] !== null; S++)
            h
              ? it(Oo(d[S]) === h, "All keyframes must be of the same type")
              : ((h = Oo(d[S])),
                it(
                  h === f || (Aa(f) && Aa(h)),
                  "Keyframes must be of the same dimension as the current value"
                ));
        } else h = Oo(d);
        if (f !== h)
          if (Aa(f) && Aa(h)) {
            let g = c.get();
            typeof g == "string" && c.set(parseFloat(g)),
              typeof d == "string"
                ? (t[l] = parseFloat(d))
                : Array.isArray(d) && h === j && (t[l] = d.map(parseFloat));
          } else
            f?.transform && h?.transform && (u === 0 || d === 0)
              ? u === 0
                ? c.set(h.transform(u))
                : (t[l] = f.transform(d))
              : (s || ((o = PR(e)), (s = !0)),
                a.push(l),
                (r[l] = r[l] !== void 0 ? r[l] : t[l]),
                c.jump(d));
      }),
      a.length)
    ) {
      let l = a.indexOf("height") >= 0 ? _.pageYOffset : null,
        c = IR(t, e, a);
      return (
        o.length &&
          o.forEach(([u, f]) => {
            e.getValue(u).set(f);
          }),
        e.render(),
        qo && l !== null && _.scrollTo({ top: l }),
        { target: c, transitionEnd: r }
      );
    } else return { target: t, transitionEnd: r };
  };
function _R(e, t, n, r) {
  return TR(t) ? FR(e, t, n, r) : { target: t, transitionEnd: r };
}
var LR = (e, t, n, r) => {
    let i = CR(e, t, r);
    return (t = i.target), (r = i.transitionEnd), _R(e, t, n, r);
  },
  hy = class extends Vg {
    sortInstanceNodePosition(e, t) {
      return e.compareDocumentPosition(t) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(e, t) {
      return e.style ? e.style[t] : void 0;
    }
    removeValueFromRenderState(e, { vars: t, style: n }) {
      delete t[e], delete n[e];
    }
    makeTargetAnimatableFromInstance(
      { transition: e, transitionEnd: t, ...n },
      r
    ) {
      let i = xT(n, e || {}, this);
      if (r) {
        Tg(this, n, i);
        let o = LR(this, n, i, t);
        (t = o.transitionEnd), (n = o.target);
      }
      return { transition: e, transitionEnd: t, ...n };
    }
  };
function MR(e) {
  return _.getComputedStyle(e);
}
var py = class extends hy {
    constructor() {
      super(...arguments), (this.type = "html");
    }
    readValueFromInstance(e, t) {
      if (ti.has(t)) {
        let n = Rf(t);
        return (n && n.default) || 0;
      } else {
        let n = MR(e),
          r = (pg(t) ? n.getPropertyValue(t) : n[t]) || 0;
        return typeof r == "string" ? r.trim() : r;
      }
    }
    measureInstanceViewportBox(e, { transformPagePoint: t }) {
      return ey(e, t);
    }
    build(e, t, n, r) {
      Df(e, t, n, r.transformTemplate);
    }
    scrapeMotionValuesFromProps(e, t, n) {
      return zf(e, t, n);
    }
    handleChildMotionValue() {
      this.childSubscription &&
        (this.childSubscription(), delete this.childSubscription);
      let { children: e } = this.props;
      ge(e) &&
        (this.childSubscription = e.on("change", (t) => {
          this.current && (this.current.textContent = `${t}`);
        }));
    }
    renderInstance(e, t, n, r) {
      $g(e, t, n, r);
    }
  },
  my = class extends hy {
    constructor() {
      super(...arguments), (this.type = "svg"), (this.isSVGTag = !1);
    }
    getBaseTargetFromProps(e, t) {
      return e[t];
    }
    readValueFromInstance(e, t) {
      if (ti.has(t)) {
        let n = Rf(t);
        return (n && n.default) || 0;
      }
      return (t = jg.has(t) ? t : sf(t)), e.getAttribute(t);
    }
    measureInstanceViewportBox() {
      return Ee();
    }
    scrapeMotionValuesFromProps(e, t) {
      return Ug(e, t, this);
    }
    build(e, t, n, r) {
      Bf(e, t, n, this.isSVGTag, r.transformTemplate);
    }
    renderInstance(e, t, n, r) {
      Wg(e, t, n, r);
    }
    mount(e) {
      (this.isSVGTag = Hf(e.tagName)), super.mount(e);
    }
  },
  vy = (e, t) =>
    Af(e)
      ? new my(t, { enableHardwareAcceleration: !1 })
      : new py(t, { enableHardwareAcceleration: !0 }),
  gy = { layout: { ProjectionNode: uy, MeasureLayout: ny } },
  OR = { ...Mf, ...Gg, ...fy, ...gy },
  Ot = Bg((e, t) => Xg(e, t, OR, vy));
var AR = Bg(Xg);
function yy() {
  let e = D(!1);
  return (
    ur(
      () => (
        (e.current = !0),
        () => {
          e.current = !1;
        }
      ),
      []
    ),
    e
  );
}
function cl() {
  let e = yy(),
    [t, n] = Mt(0),
    r = ce(() => {
      e.current && n(t + 1);
    }, [t]);
  return [ce(() => Q.postRender(r), [r]), t];
}
function by(e) {
  return W(() => () => e(), []);
}
var DR = class extends be {
  getSnapshotBeforeUpdate(e) {
    let t = this.props.childRef.current;
    if (t && e.isPresent && !this.props.isPresent) {
      let n = this.props.sizeRef.current;
      (n.height = t.offsetHeight || 0),
        (n.width = t.offsetWidth || 0),
        (n.top = t.offsetTop),
        (n.left = t.offsetLeft);
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
};
function VR({ children: e, isPresent: t }) {
  let n = Xr(),
    r = D(null),
    i = D({ width: 0, height: 0, top: 0, left: 0 }),
    { nonce: o } = M(Hn);
  return (
    ht(() => {
      let { width: s, height: a, top: l, left: c } = i.current;
      if (t || !r.current || !s || !a) return;
      r.current.dataset.motionPopId = n;
      let u = document.createElement("style");
      return (
        o && (u.nonce = o),
        document.head.appendChild(u),
        u.sheet &&
          u.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${s}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${c}px !important;
          }
        `),
        () => {
          document.head.removeChild(u);
        }
      );
    }, [t]),
    le(DR, { isPresent: t, childRef: r, sizeRef: i }, rn(e, { ref: r }))
  );
}
var Bu = ({
  children: e,
  initial: t,
  isPresent: n,
  onExitComplete: r,
  custom: i,
  presenceAffectsLayout: o,
  mode: s,
}) => {
  let a = jn(BR),
    l = Xr(),
    c = fe(
      () => ({
        id: l,
        initial: t,
        isPresent: n,
        custom: i,
        onExitComplete: (u) => {
          a.set(u, !0);
          for (let f of a.values()) if (!f) return;
          r && r();
        },
        register: (u) => (a.set(u, !1), () => a.delete(u)),
      }),
      o ? void 0 : [n]
    );
  return (
    fe(() => {
      a.forEach((u, f) => a.set(f, !1));
    }, [n]),
    W(() => {
      !n && !a.size && r && r();
    }, [n]),
    s === "popLayout" && (e = le(VR, { isPresent: n }, e)),
    le(Vi.Provider, { value: c }, e)
  );
};
function BR() {
  return new Map();
}
var qr = (e) => e.key || "";
function HR(e, t) {
  e.forEach((n) => {
    let r = qr(n);
    t.set(r, n);
  });
}
function zR(e) {
  let t = [];
  return (
    gn.forEach(e, (n) => {
      yn(n) && t.push(n);
    }),
    t
  );
}
var $f = ({
  children: e,
  custom: t,
  initial: n = !0,
  onExitComplete: r,
  exitBeforeEnter: i,
  presenceAffectsLayout: o = !0,
  mode: s = "sync",
}) => {
  it(!i, "Replace exitBeforeEnter with mode='wait'");
  let a = M(Uo).forceRender || cl()[0],
    l = yy(),
    c = zR(e),
    u = c,
    f = D(new Map()).current,
    d = D(u),
    h = D(new Map()).current,
    g = D(!0);
  if (
    (ur(() => {
      (g.current = !1), HR(c, h), (d.current = u);
    }),
    by(() => {
      (g.current = !0), h.clear(), f.clear();
    }),
    g.current)
  )
    return le(
      Ii,
      null,
      u.map((m) =>
        le(
          Bu,
          {
            key: qr(m),
            isPresent: !0,
            initial: n ? void 0 : !1,
            presenceAffectsLayout: o,
            mode: s,
          },
          m
        )
      )
    );
  u = [...u];
  let y = d.current.map(qr),
    S = c.map(qr),
    p = y.length;
  for (let m = 0; m < p; m++) {
    let v = y[m];
    S.indexOf(v) === -1 && !f.has(v) && f.set(v, void 0);
  }
  return (
    s === "wait" && f.size && (u = []),
    f.forEach((m, v) => {
      if (S.indexOf(v) !== -1) return;
      let x = h.get(v);
      if (!x) return;
      let C = y.indexOf(v),
        w = m;
      if (!w) {
        let k = () => {
          f.delete(v);
          let E = Array.from(h.keys()).filter((P) => !S.includes(P));
          if (
            (E.forEach((P) => h.delete(P)),
            (d.current = c.filter((P) => {
              let I = qr(P);
              return I === v || E.includes(I);
            })),
            !f.size)
          ) {
            if (l.current === !1) return;
            a(), r && r();
          }
        };
        (w = le(
          Bu,
          {
            key: qr(x),
            isPresent: !1,
            onExitComplete: k,
            custom: t,
            presenceAffectsLayout: o,
            mode: s,
          },
          x
        )),
          f.set(v, w);
      }
      u.splice(C, 0, w);
    }),
    (u = u.map((m) => {
      let v = m.key;
      return f.has(v)
        ? m
        : le(
            Bu,
            { key: qr(m), isPresent: !0, presenceAffectsLayout: o, mode: s },
            m
          );
    })),
    le(Ii, null, f.size ? u : u.map((m) => rn(m)))
  );
};
function xy({ children: e, isValidProp: t, ...n }) {
  t && qv(t), (n = { ...M(Hn), ...n }), (n.isStatic = jn(() => n.isStatic));
  let r = fe(
    () => n,
    [JSON.stringify(n.transition), n.transformPagePoint, n.reducedMotion]
  );
  return le(Hn.Provider, { value: r }, e);
}
var Sy = xe(null),
  NR = (e) => !e.isLayoutDirty && e.willUpdate(!1);
function Iv() {
  let e = new Set(),
    t = new WeakMap(),
    n = () => e.forEach(NR);
  return {
    add: (r) => {
      e.add(r), t.set(r, r.addEventListener("willUpdate", n));
    },
    remove: (r) => {
      e.delete(r);
      let i = t.get(r);
      i && (i(), t.delete(r)), n();
    },
    dirty: n,
  };
}
var wy = (e) => e === !0,
  $R = (e) => wy(e === !0) || e === "id",
  Cy = ({ children: e, id: t, inherit: n = !0 }) => {
    let r = M(Uo),
      i = M(Sy),
      [o, s] = cl(),
      a = D(null),
      l = r.id || i;
    a.current === null &&
      ($R(n) && l && (t = t ? l + "-" + t : l),
      (a.current = { id: t, group: (wy(n) && r.group) || Iv() }));
    let c = fe(() => ({ ...a.current, forceRender: o }), [s]);
    return le(Uo.Provider, { value: c }, e);
  };
function Cn(e) {
  let t = jn(() => he(e)),
    { isStatic: n } = M(Hn);
  if (n) {
    let [, r] = Mt(e);
    W(() => t.on("change", r), []);
  }
  return t;
}
var jR = (e) => e && typeof e == "object" && e.mix,
  WR = (e) => (jR(e) ? e.mix : void 0);
function ns(...e) {
  let t = !Array.isArray(e[0]),
    n = t ? 0 : -1,
    r = e[0 + n],
    i = e[1 + n],
    o = e[2 + n],
    s = e[3 + n],
    a = zi(i, o, { mixer: WR(o[0]), ...s });
  return t ? a(r) : a;
}
function jf(e, t) {
  let n = Cn(t()),
    r = () => n.set(t());
  return (
    r(),
    ur(() => {
      let i = () => Q.update(r, !1, !0),
        o = e.map((s) => s.on("change", i));
      return () => {
        o.forEach((s) => s()), pt(r);
      };
    }),
    n
  );
}
function UR(e) {
  (No.current = []), e();
  let t = jf(No.current, e);
  return (No.current = void 0), t;
}
function mt(e, t, n, r) {
  if (typeof e == "function") return UR(e);
  let i = typeof t == "function" ? t : ns(t, n, r);
  return Array.isArray(e) ? Fv(e, i) : Fv([e], ([o]) => i(o));
}
function Fv(e, t) {
  let n = jn(() => []);
  return jf(e, () => {
    n.length = 0;
    let r = e.length;
    for (let i = 0; i < r; i++) n[i] = e[i].get();
    return t(n);
  });
}
var ky = xe(null);
function XR(e, t, n, r) {
  if (!r) return e;
  let i = e.findIndex((u) => u.value === t);
  if (i === -1) return e;
  let o = r > 0 ? 1 : -1,
    s = e[i + o];
  if (!s) return e;
  let a = e[i],
    l = s.layout,
    c = de(l.min, l.max, 0.5);
  return (o === 1 && a.layout.max + n > c) || (o === -1 && a.layout.min + n < c)
    ? sT(e, i, i + o)
    : e;
}
function YR(
  { children: e, as: t = "ul", axis: n = "y", onReorder: r, values: i, ...o },
  s
) {
  let a = jn(() => Ot(t)),
    l = [],
    c = D(!1);
  it(!!i, "Reorder.Group must be provided a values prop");
  let u = {
    axis: n,
    registerItem: (f, d) => {
      let h = l.findIndex((g) => f === g.value);
      h !== -1 ? (l[h].layout = d[n]) : l.push({ value: f, layout: d[n] }),
        l.sort(KR);
    },
    updateOrder: (f, d, h) => {
      if (c.current) return;
      let g = XR(l, f, d, h);
      l !== g &&
        ((c.current = !0), r(g.map(GR).filter((y) => i.indexOf(y) !== -1)));
    },
  };
  return (
    W(() => {
      c.current = !1;
    }),
    le(a, { ...o, ref: s, ignoreStrict: !0 }, le(ky.Provider, { value: u }, e))
  );
}
var tB = Ue(YR);
function GR(e) {
  return e.value;
}
function KR(e, t) {
  return e.layout.min - t.layout.min;
}
function _v(e, t = 0) {
  return ge(e) ? e : Cn(t);
}
function qR(
  {
    children: e,
    style: t = {},
    value: n,
    as: r = "li",
    onDrag: i,
    layout: o = !0,
    ...s
  },
  a
) {
  let l = jn(() => Ot(r)),
    c = M(ky),
    u = { x: _v(t.x), y: _v(t.y) },
    f = mt([u.x, u.y], ([y, S]) => (y || S ? 1 : "unset"));
  it(!!c, "Reorder.Item must be a child of Reorder.Group");
  let { axis: d, registerItem: h, updateOrder: g } = c;
  return le(
    l,
    {
      drag: d,
      ...s,
      dragSnapToOrigin: !0,
      style: { ...t, x: u.x, y: u.y, zIndex: f },
      layout: o,
      onDrag: (y, S) => {
        let { velocity: p } = S;
        p[d] && g(n, u[d].get(), p[d]), i && i(y, S);
      },
      onLayoutMeasure: (y) => h(n, y),
      ref: a,
      ignoreStrict: !0,
    },
    e
  );
}
var rB = Ue(qR);
var Ty = { renderer: vy, ...Mf, ...Gg },
  QR = { ...Ty, ...fy, ...gy };
function ZR(e, ...t) {
  let n = e.length;
  function r() {
    let i = "";
    for (let o = 0; o < n; o++) {
      i += e[o];
      let s = t[o];
      s && (i += ge(s) ? s.get() : s);
    }
    return i;
  }
  return jf(t.filter(ge), r);
}
function Wf(e, t = {}) {
  let { isStatic: n } = M(Hn),
    r = D(null),
    i = Cn(ge(e) ? e.get() : e),
    o = () => {
      r.current && r.current.stop();
    };
  return (
    ht(
      () =>
        i.attach((s, a) => {
          if (n) return a(s);
          let l = r.current;
          return (
            l && l.time === 0 && l.sample(Re.delta),
            o(),
            (r.current = ei({
              keyframes: [i.get(), s],
              velocity: i.getVelocity(),
              type: "spring",
              restDelta: 0.001,
              restSpeed: 0.01,
              ...t,
              onUpdate: a,
            })),
            i.get()
          );
        }, o),
      [JSON.stringify(t)]
    ),
    ur(() => {
      if (ge(e)) return e.on("change", (s) => i.set(parseFloat(s)));
    }, [i]),
    i
  );
}
function JR(e, t, n) {
  ht(() => e.on(t, n), [e, t, n]);
}
function Uf(e, t, n) {
  var r;
  if (typeof e == "string") {
    let i = document;
    t &&
      (it(!!t.current, "Scope provided, but no element detected."),
      (i = t.current)),
      n
        ? (((r = n[e]) !== null && r !== void 0) ||
            (n[e] = i.querySelectorAll(e)),
          (e = n[e]))
        : (e = i.querySelectorAll(e));
  } else e instanceof Element && (e = [e]);
  return Array.from(e || []);
}
var Ha = new WeakMap(),
  ar;
function eP(e, t) {
  if (t) {
    let { inlineSize: n, blockSize: r } = t[0];
    return { width: n, height: r };
  } else
    return e instanceof SVGElement && "getBBox" in e
      ? e.getBBox()
      : { width: e.offsetWidth, height: e.offsetHeight };
}
function tP({ target: e, contentRect: t, borderBoxSize: n }) {
  var r;
  (r = Ha.get(e)) === null ||
    r === void 0 ||
    r.forEach((i) => {
      i({
        target: e,
        contentSize: t,
        get size() {
          return eP(e, n);
        },
      });
    });
}
function nP(e) {
  e.forEach(tP);
}
function rP() {
  typeof ResizeObserver > "u" || (ar = new ResizeObserver(nP));
}
function iP(e, t) {
  ar || rP();
  let n = Uf(e);
  return (
    n.forEach((r) => {
      let i = Ha.get(r);
      i || ((i = new Set()), Ha.set(r, i)), i.add(t), ar?.observe(r);
    }),
    () => {
      n.forEach((r) => {
        let i = Ha.get(r);
        i?.delete(t), i?.size || ar?.unobserve(r);
      });
    }
  );
}
var za = new Set(),
  Wo;
function oP() {
  (Wo = () => {
    let e = { width: _.innerWidth, height: _.innerHeight },
      t = { target: _, size: e, contentSize: e };
    za.forEach((n) => n(t));
  }),
    _.addEventListener("resize", Wo);
}
function sP(e) {
  return (
    za.add(e),
    Wo || oP(),
    () => {
      za.delete(e), !za.size && Wo && (Wo = void 0);
    }
  );
}
function aP(e, t) {
  return typeof e == "function" ? sP(e) : iP(e, t);
}
var lP = 50,
  Lv = () => ({
    current: 0,
    offset: [],
    progress: 0,
    scrollLength: 0,
    targetOffset: 0,
    targetLength: 0,
    containerLength: 0,
    velocity: 0,
  }),
  cP = () => ({ time: 0, x: Lv(), y: Lv() }),
  uP = {
    x: { length: "Width", position: "Left" },
    y: { length: "Height", position: "Top" },
  };
function Mv(e, t, n, r) {
  let i = n[t],
    { length: o, position: s } = uP[t],
    a = i.current,
    l = n.time;
  (i.current = e["scroll" + s]),
    (i.scrollLength = e["scroll" + o] - e["client" + o]),
    (i.offset.length = 0),
    (i.offset[0] = 0),
    (i.offset[1] = i.scrollLength),
    (i.progress = cr(0, i.scrollLength, i.current));
  let c = r - l;
  i.velocity = c > lP ? 0 : Cf(i.current - a, c);
}
function fP(e, t, n) {
  Mv(e, "x", t, n), Mv(e, "y", t, n), (t.time = n);
}
function dP(e, t) {
  let n = { x: 0, y: 0 },
    r = e;
  for (; r && r !== t; )
    if (r instanceof HTMLElement)
      (n.x += r.offsetLeft), (n.y += r.offsetTop), (r = r.offsetParent);
    else if (r.tagName === "svg") {
      let i = r.getBoundingClientRect();
      r = r.parentElement;
      let o = r.getBoundingClientRect();
      (n.x += i.left - o.left), (n.y += i.top - o.top);
    } else if (r instanceof SVGGraphicsElement) {
      let { x: i, y: o } = r.getBBox();
      (n.x += i), (n.y += o);
      let s = null,
        a = r.parentNode;
      for (; !s; ) a.tagName === "svg" && (s = a), (a = r.parentNode);
      r = s;
    } else break;
  return n;
}
var hP = {
    Enter: [
      [0, 1],
      [1, 1],
    ],
    Exit: [
      [0, 0],
      [1, 0],
    ],
    Any: [
      [1, 0],
      [0, 1],
    ],
    All: [
      [0, 0],
      [1, 1],
    ],
  },
  nf = { start: 0, center: 0.5, end: 1 };
function Ov(e, t, n = 0) {
  let r = 0;
  if ((nf[e] !== void 0 && (e = nf[e]), typeof e == "string")) {
    let i = parseFloat(e);
    e.endsWith("px")
      ? (r = i)
      : e.endsWith("%")
      ? (e = i / 100)
      : e.endsWith("vw")
      ? (r = (i / 100) * document.documentElement.clientWidth)
      : e.endsWith("vh")
      ? (r = (i / 100) * document.documentElement.clientHeight)
      : (e = i);
  }
  return typeof e == "number" && (r = t * e), n + r;
}
var pP = [0, 0];
function mP(e, t, n, r) {
  let i = Array.isArray(e) ? e : pP,
    o = 0,
    s = 0;
  return (
    typeof e == "number"
      ? (i = [e, e])
      : typeof e == "string" &&
        ((e = e.trim()),
        e.includes(" ") ? (i = e.split(" ")) : (i = [e, nf[e] ? e : "0"])),
    (o = Ov(i[0], n, r)),
    (s = Ov(i[1], t)),
    o - s
  );
}
var vP = { x: 0, y: 0 };
function gP(e) {
  return "getBBox" in e && e.tagName !== "svg"
    ? e.getBBox()
    : { width: e.clientWidth, height: e.clientHeight };
}
function yP(e, t, n) {
  let { offset: r = hP.All } = n,
    { target: i = e, axis: o = "y" } = n,
    s = o === "y" ? "height" : "width",
    a = i !== e ? dP(i, e) : vP,
    l = i === e ? { width: e.scrollWidth, height: e.scrollHeight } : gP(i),
    c = { width: e.clientWidth, height: e.clientHeight };
  t[o].offset.length = 0;
  let u = !t[o].interpolate,
    f = r.length;
  for (let d = 0; d < f; d++) {
    let h = mP(r[d], c[s], l[s], a[o]);
    !u && h !== t[o].interpolatorOffsets[d] && (u = !0), (t[o].offset[d] = h);
  }
  u &&
    ((t[o].interpolate = zi(t[o].offset, kf(r))),
    (t[o].interpolatorOffsets = [...t[o].offset])),
    (t[o].progress = t[o].interpolate(t[o].current));
}
function bP(e, t = e, n) {
  if (((n.x.targetOffset = 0), (n.y.targetOffset = 0), t !== e)) {
    let r = t;
    for (; r && r !== e; )
      (n.x.targetOffset += r.offsetLeft),
        (n.y.targetOffset += r.offsetTop),
        (r = r.offsetParent);
  }
  (n.x.targetLength = t === e ? t.scrollWidth : t.clientWidth),
    (n.y.targetLength = t === e ? t.scrollHeight : t.clientHeight),
    (n.x.containerLength = e.clientWidth),
    (n.y.containerLength = e.clientHeight);
}
function xP(e, t, n, r = {}) {
  return {
    measure: () => bP(e, r.target, n),
    update: (i) => {
      fP(e, n, i), (r.offset || r.target) && yP(e, n, r);
    },
    notify: () => t(n),
  };
}
var Do = new WeakMap(),
  Av = new WeakMap(),
  Hu = new WeakMap(),
  Dv = (e) => (e === document.documentElement ? _ : e);
function Ni(e, { container: t = document.documentElement, ...n } = {}) {
  let r = Hu.get(t);
  r || ((r = new Set()), Hu.set(t, r));
  let i = cP(),
    o = xP(t, e, i, n);
  if ((r.add(o), !Do.has(t))) {
    let a = () => {
        for (let d of r) d.measure();
      },
      l = () => {
        for (let d of r) d.update(Re.timestamp);
      },
      c = () => {
        for (let d of r) d.notify();
      },
      u = () => {
        Q.read(a, !1, !0), Q.read(l, !1, !0), Q.update(c, !1, !0);
      };
    Do.set(t, u);
    let f = Dv(t);
    _.addEventListener("resize", u, { passive: !0 }),
      t !== document.documentElement && Av.set(t, aP(t, u)),
      f.addEventListener("scroll", u, { passive: !0 });
  }
  let s = Do.get(t);
  return (
    Q.read(s, !1, !0),
    () => {
      var a;
      pt(s);
      let l = Hu.get(t);
      if (!l || (l.delete(o), l.size)) return;
      let c = Do.get(t);
      Do.delete(t),
        c &&
          (Dv(t).removeEventListener("scroll", c),
          (a = Av.get(t)) === null || a === void 0 || a(),
          _.removeEventListener("resize", c));
    }
  );
}
function Vv(e, t) {
  es(
    !!(!t || t.current),
    `You have defined a ${e} options but the provided ref is not yet hydrated, probably because it's defined higher up the tree. Try calling useScroll() in the same component as the ref, or setting its \`layoutEffect: false\` option.`
  );
}
var SP = () => ({
  scrollX: he(0),
  scrollY: he(0),
  scrollXProgress: he(0),
  scrollYProgress: he(0),
});
function Ey({ container: e, target: t, layoutEffect: n = !0, ...r } = {}) {
  let i = jn(SP);
  return (
    (n ? ur : W)(
      () => (
        Vv("target", t),
        Vv("container", e),
        Ni(
          ({ x: s, y: a }) => {
            i.scrollX.set(s.current),
              i.scrollXProgress.set(s.progress),
              i.scrollY.set(a.current),
              i.scrollYProgress.set(a.progress);
          },
          {
            ...r,
            container: e?.current || void 0,
            target: t?.current || void 0,
          }
        )
      ),
      [e, t, JSON.stringify(r.offset)]
    ),
    i
  );
}
function Ry() {
  !Of.current && Ag();
  let [e] = Mt(Ga.current);
  return e;
}
function ni() {
  let e = Ry(),
    { reducedMotion: t } = M(Hn);
  return t === "never" ? !1 : t === "always" ? !0 : e;
}
function wP(e) {
  e.values.forEach((t) => t.stop());
}
function Py() {
  let e = !1,
    t = new Set(),
    n = {
      subscribe(r) {
        return t.add(r), () => void t.delete(r);
      },
      start(r, i) {
        it(
          e,
          "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook."
        );
        let o = [];
        return (
          t.forEach((s) => {
            o.push(Lf(s, r, { transitionOverride: i }));
          }),
          Promise.all(o)
        );
      },
      set(r) {
        return (
          it(
            e,
            "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook."
          ),
          t.forEach((i) => {
            yT(i, r);
          })
        );
      },
      stop() {
        t.forEach((r) => {
          wP(r);
        });
      },
      mount() {
        return (
          (e = !0),
          () => {
            (e = !1), n.stop();
          }
        );
      },
    };
  return n;
}
var Iy = (e, t, n) => {
  let r = t - e;
  return ((((n - e) % r) + r) % r) + e;
};
function CP(e, t) {
  let n,
    r = () => {
      let { currentTime: i } = t,
        s = (i === null ? 0 : i.value) / 100;
      n !== s && e(s), (n = s);
    };
  return Q.update(r, !0), () => pt(r);
}
var kP = Fg(() => _.ScrollTimeline !== void 0),
  Fy = class {
    constructor(e) {
      this.animations = e.filter(Boolean);
    }
    then(e, t) {
      return Promise.all(this.animations).then(e).catch(t);
    }
    getAll(e) {
      return this.animations[0][e];
    }
    setAll(e, t) {
      for (let n = 0; n < this.animations.length; n++)
        this.animations[n][e] = t;
    }
    attachTimeline(e) {
      let t = this.animations.map((n) => {
        if (kP() && n.attachTimeline) n.attachTimeline(e);
        else
          return (
            n.pause(),
            CP((r) => {
              n.time = n.duration * r;
            }, e)
          );
      });
      return () => {
        t.forEach((n, r) => {
          n && n(), this.animations[r].stop();
        });
      };
    }
    get time() {
      return this.getAll("time");
    }
    set time(e) {
      this.setAll("time", e);
    }
    get speed() {
      return this.getAll("speed");
    }
    set speed(e) {
      this.setAll("speed", e);
    }
    get duration() {
      let e = 0;
      for (let t = 0; t < this.animations.length; t++)
        e = Math.max(e, this.animations[t].duration);
      return e;
    }
    runAll(e) {
      this.animations.forEach((t) => t[e]());
    }
    play() {
      this.runAll("play");
    }
    pause() {
      this.runAll("pause");
    }
    stop() {
      this.runAll("stop");
    }
    cancel() {
      this.runAll("cancel");
    }
    complete() {
      this.runAll("complete");
    }
  };
function TP(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function EP(e) {
  let t = {
      presenceContext: null,
      props: {},
      visualState: {
        renderState: {
          transform: {},
          transformOrigin: {},
          style: {},
          vars: {},
          attrs: {},
        },
        latestValues: {},
      },
    },
    n = ay(e)
      ? new my(t, { enableHardwareAcceleration: !1 })
      : new py(t, { enableHardwareAcceleration: !0 });
  n.mount(e), $n.set(e, n);
}
function RP(e, t = 100) {
  let n = ts({ keyframes: [0, t], ...e }),
    r = Math.min(Wu(n), ju);
  return {
    type: "keyframes",
    ease: (i) => n.next(r * i).value / t,
    duration: wn(r),
  };
}
function Bv(e, t, n, r) {
  var i;
  return typeof t == "number"
    ? t
    : t.startsWith("-") || t.startsWith("+")
    ? Math.max(0, e + parseFloat(t))
    : t === "<"
    ? n
    : (i = r.get(t)) !== null && i !== void 0
    ? i
    : e;
}
function PP(e, t) {
  return gg(e) ? e[Iy(0, e.length, t)] : e;
}
function IP(e, t, n) {
  for (let r = 0; r < e.length; r++) {
    let i = e[r];
    i.at > t && i.at < n && (ol(e, i), r--);
  }
}
function FP(e, t, n, r, i, o) {
  IP(e, i, o);
  for (let s = 0; s < t.length; s++)
    e.push({ value: t[s], at: de(i, o, r[s]), easing: PP(n, s) });
}
function _P(e, t) {
  return e.at === t.at
    ? e.value === null
      ? 1
      : t.value === null
      ? -1
      : 0
    : e.at - t.at;
}
var LP = "easeInOut";
function MP(e, { defaultTransition: t = {}, ...n } = {}, r) {
  let i = t.duration || 0.3,
    o = new Map(),
    s = new Map(),
    a = {},
    l = new Map(),
    c = 0,
    u = 0,
    f = 0;
  for (let d = 0; d < e.length; d++) {
    let h = e[d];
    if (typeof h == "string") {
      l.set(h, u);
      continue;
    } else if (!Array.isArray(h)) {
      l.set(h.name, Bv(u, h.at, c, l));
      continue;
    }
    let [g, y, S = {}] = h;
    S.at !== void 0 && (u = Bv(u, S.at, c, l));
    let p = 0,
      m = (v, x, C, w = 0, k = 0) => {
        let E = OP(v),
          { delay: P = 0, times: I = kf(E), type: H = "keyframes", ...L } = x,
          { ease: G = t.ease || "easeOut", duration: B } = x,
          J = typeof P == "function" ? P(w, k) : P,
          Y = E.length;
        if (Y <= 2 && H === "spring") {
          let K = 100;
          if (Y === 2 && VP(E)) {
            let q = E[1] - E[0];
            K = Math.abs(q);
          }
          let N = { ...L };
          B !== void 0 && (N.duration = Bn(B));
          let te = RP(N, K);
          (G = te.ease), (B = te.duration);
        }
        B ?? (B = i);
        let V = u + J,
          z = V + B;
        I.length === 1 && I[0] === 0 && (I[1] = 1);
        let A = I.length - E.length;
        A > 0 && yg(I, A),
          E.length === 1 && E.unshift(null),
          FP(C, E, G, I, V, z),
          (p = Math.max(J + B, p)),
          (f = Math.max(z, f));
      };
    if (ge(g)) {
      let v = Hv(g, s);
      m(y, S, zv("default", v));
    } else {
      let v = Uf(g, r, a),
        x = v.length;
      for (let C = 0; C < x; C++) {
        (y = y), (S = S);
        let w = v[C],
          k = Hv(w, s);
        for (let E in y) m(y[E], AP(S, E), zv(E, k), C, x);
      }
    }
    (c = u), (u += p);
  }
  return (
    s.forEach((d, h) => {
      for (let g in d) {
        let y = d[g];
        y.sort(_P);
        let S = [],
          p = [],
          m = [];
        for (let x = 0; x < y.length; x++) {
          let { at: C, value: w, easing: k } = y[x];
          S.push(w), p.push(cr(0, f, C)), m.push(k || "easeOut");
        }
        p[0] !== 0 && (p.unshift(0), S.unshift(S[0]), m.unshift(LP)),
          p[p.length - 1] !== 1 && (p.push(1), S.push(null)),
          o.has(h) || o.set(h, { keyframes: {}, transition: {} });
        let v = o.get(h);
        (v.keyframes[g] = S),
          (v.transition[g] = { ...t, duration: f, ease: m, times: p, ...n });
      }
    }),
    o
  );
}
function Hv(e, t) {
  return !t.has(e) && t.set(e, {}), t.get(e);
}
function zv(e, t) {
  return t[e] || (t[e] = []), t[e];
}
function OP(e) {
  return Array.isArray(e) ? e : [e];
}
function AP(e, t) {
  return e[t] ? { ...e, ...e[t] } : { ...e };
}
var DP = (e) => typeof e == "number",
  VP = (e) => e.every(DP);
function _y(e, t, n, r) {
  let i = Uf(e, r),
    o = i.length;
  it(!!o, "No valid element provided.");
  let s = [];
  for (let a = 0; a < o; a++) {
    let l = i[a];
    $n.has(l) || EP(l);
    let c = $n.get(l),
      u = { ...n };
    typeof u.delay == "function" && (u.delay = u.delay(a, o)),
      s.push(..._f(c, { ...t, transition: u }, {}));
  }
  return new Fy(s);
}
var BP = (e) => Array.isArray(e) && Array.isArray(e[0]);
function HP(e, t, n) {
  let r = [];
  return (
    MP(e, t, n).forEach(({ keyframes: o, transition: s }, a) => {
      let l;
      ge(a) ? (l = Nf(a, o.default, s.default)) : (l = _y(a, o, s)), r.push(l);
    }),
    new Fy(r)
  );
}
var Ly = (e) => {
    function t(n, r, i) {
      let o;
      return (
        BP(n)
          ? (o = HP(n, r, e))
          : TP(r)
          ? (o = _y(n, r, i, e))
          : (o = Nf(n, r, i)),
        e && e.animations.push(o),
        o
      );
    }
    return t;
  },
  $i = Ly();
function My() {
  let e = jn(Py);
  return ur(e.mount, []), e;
}
var Oy = My;
function Xf(e) {
  return e !== null && typeof e == "object" && uf in e;
}
function Ay(e) {
  if (Xf(e)) return e[uf];
}
function Yf() {
  return zP;
}
function zP(e) {
  Jr.current &&
    ((Jr.current.isUpdating = !1), Jr.current.blockUpdate(), e && e());
}
function Dy() {
  let [e, t] = cl(),
    n = Yf(),
    r = D();
  return (
    W(() => {
      Q.postRender(() =>
        Q.postRender(() => {
          t === r.current && (Xa.current = !1);
        })
      );
    }, [t]),
    (i) => {
      n(() => {
        (Xa.current = !0), e(), i(), (r.current = t + 1);
      });
    }
  );
}
function Vy() {
  return ce(() => {
    let t = Jr.current;
    t && t.resetTree();
  }, []);
}
var Nv = () => ({});
var mB = tl({ scrapeMotionValuesFromProps: Nv, createRenderState: Nv });
var NP = Q,
  $P = Vo.reduce((e, t) => ((e[t] = (n) => pt(n)), e), {});
var jP = "default" in Te ? b : Te,
  ji = {},
  WP = jP,
  UP = Symbol.for("react.element"),
  XP = Symbol.for("react.fragment"),
  YP = Object.prototype.hasOwnProperty,
  GP = WP.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  KP = { key: !0, ref: !0, __self: !0, __source: !0 };
function By(e, t, n) {
  var r,
    i = {},
    o = null,
    s = null;
  n !== void 0 && (o = "" + n),
    t.key !== void 0 && (o = "" + t.key),
    t.ref !== void 0 && (s = t.ref);
  for (r in t) YP.call(t, r) && !KP.hasOwnProperty(r) && (i[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) i[r] === void 0 && (i[r] = t[r]);
  return {
    $$typeof: UP,
    type: e,
    key: o,
    ref: s,
    props: i,
    _owner: GP.current,
  };
}
ji.Fragment = XP;
ji.jsx = By;
ji.jsxs = By;
var Ne = ji.Fragment,
  T = ji.jsx,
  oe = ji.jsxs;
var F_ = {};
Su(F_, {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => y_,
  createPortal: () => b_,
  createRoot: () => x_,
  default: () => sp,
  findDOMNode: () => S_,
  flushSync: () => w_,
  hydrate: () => C_,
  hydrateRoot: () => k_,
  render: () => T_,
  unmountComponentAtNode: () => E_,
  unstable_batchedUpdates: () => R_,
  unstable_renderSubtreeIntoContainer: () => P_,
  version: () => I_,
});
var ml = {};
Su(ml, {
  default: () => U,
  unstable_IdlePriority: () => ZP,
  unstable_ImmediatePriority: () => JP,
  unstable_LowPriority: () => eI,
  unstable_NormalPriority: () => tI,
  unstable_Profiling: () => nI,
  unstable_UserBlockingPriority: () => rI,
  unstable_cancelCallback: () => iI,
  unstable_continueExecution: () => oI,
  unstable_forceFrameRate: () => sI,
  unstable_getCurrentPriorityLevel: () => aI,
  unstable_getFirstCallbackNode: () => lI,
  unstable_next: () => cI,
  unstable_now: () => QP,
  unstable_pauseExecution: () => uI,
  unstable_requestPaint: () => fI,
  unstable_runWithPriority: () => dI,
  unstable_scheduleCallback: () => hI,
  unstable_shouldYield: () => pI,
  unstable_wrapCallback: () => mI,
});
var U = {};
function Qf(e, t) {
  var n = e.length;
  e.push(t);
  e: for (; 0 < n; ) {
    var r = (n - 1) >>> 1,
      i = e[r];
    if (!(0 < ul(i, t))) break e;
    (e[r] = t), (e[n] = i), (n = r);
  }
}
function sn(e) {
  return e.length === 0 ? null : e[0];
}
function dl(e) {
  if (e.length === 0) return null;
  var t = e[0],
    n = e.pop();
  if (n !== t) {
    e[0] = n;
    e: for (var r = 0, i = e.length, o = i >>> 1; r < o; ) {
      var s = 2 * (r + 1) - 1,
        a = e[s],
        l = s + 1,
        c = e[l];
      if (0 > ul(a, n))
        l < i && 0 > ul(c, a)
          ? ((e[r] = c), (e[l] = n), (r = l))
          : ((e[r] = a), (e[s] = n), (r = s));
      else {
        if (!(l < i && 0 > ul(c, n))) break e;
        (e[r] = c), (e[l] = n), (r = l);
      }
    }
  }
  return t;
}
function ul(e, t) {
  var n = e.sortIndex - t.sortIndex;
  return n !== 0 ? n : e.id - t.id;
}
typeof performance == "object" && typeof performance.now == "function"
  ? ((Hy = performance),
    (U.unstable_now = function () {
      return Hy.now();
    }))
  : ((Gf = Date),
    (zy = Gf.now()),
    (U.unstable_now = function () {
      return Gf.now() - zy;
    }));
var Hy,
  Gf,
  zy,
  kn = [],
  dr = [],
  qP = 1,
  Gt = null,
  ot = 3,
  hl = !1,
  ri = !1,
  is = !1,
  jy = typeof setTimeout == "function" ? setTimeout : null,
  Wy = typeof clearTimeout == "function" ? clearTimeout : null,
  Ny = typeof setImmediate < "u" ? setImmediate : null;
typeof qe < "u" &&
  qe.scheduling !== void 0 &&
  qe.scheduling.isInputPending !== void 0 &&
  qe.scheduling.isInputPending.bind(qe.scheduling);
function Zf(e) {
  for (var t = sn(dr); t !== null; ) {
    if (t.callback === null) dl(dr);
    else {
      if (!(t.startTime <= e)) break;
      dl(dr), (t.sortIndex = t.expirationTime), Qf(kn, t);
    }
    t = sn(dr);
  }
}
function Jf(e) {
  if (((is = !1), Zf(e), !ri))
    if (sn(kn) !== null) (ri = !0), td(ed);
    else {
      var t = sn(dr);
      t !== null && nd(Jf, t.startTime - e);
    }
}
function ed(e, t) {
  (ri = !1), is && ((is = !1), Wy(os), (os = -1)), (hl = !0);
  var n = ot;
  try {
    for (
      Zf(t), Gt = sn(kn);
      Gt !== null && (!(Gt.expirationTime > t) || (e && !Yy()));

    ) {
      var r = Gt.callback;
      if (typeof r == "function") {
        (Gt.callback = null), (ot = Gt.priorityLevel);
        var i = r(Gt.expirationTime <= t);
        (t = U.unstable_now()),
          typeof i == "function" ? (Gt.callback = i) : Gt === sn(kn) && dl(kn),
          Zf(t);
      } else dl(kn);
      Gt = sn(kn);
    }
    if (Gt !== null) var o = !0;
    else {
      var s = sn(dr);
      s !== null && nd(Jf, s.startTime - t), (o = !1);
    }
    return o;
  } finally {
    (Gt = null), (ot = n), (hl = !1);
  }
}
var pl = !1,
  fl = null,
  os = -1,
  Uy = 5,
  Xy = -1;
function Yy() {
  return !(U.unstable_now() - Xy < Uy);
}
function Kf() {
  if (fl !== null) {
    var e = U.unstable_now();
    Xy = e;
    var t = !0;
    try {
      t = fl(!0, e);
    } finally {
      t ? rs() : ((pl = !1), (fl = null));
    }
  } else pl = !1;
}
var rs;
typeof Ny == "function"
  ? (rs = function () {
      Ny(Kf);
    })
  : typeof MessageChannel < "u"
  ? ((qf = new MessageChannel()),
    ($y = qf.port2),
    (qf.port1.onmessage = Kf),
    (rs = function () {
      $y.postMessage(null);
    }))
  : (rs = function () {
      jy(Kf, 0);
    });
var qf, $y;
function td(e) {
  (fl = e), pl || ((pl = !0), rs());
}
function nd(e, t) {
  os = jy(function () {
    e(U.unstable_now());
  }, t);
}
U.unstable_IdlePriority = 5;
U.unstable_ImmediatePriority = 1;
U.unstable_LowPriority = 4;
U.unstable_NormalPriority = 3;
U.unstable_Profiling = null;
U.unstable_UserBlockingPriority = 2;
U.unstable_cancelCallback = function (e) {
  e.callback = null;
};
U.unstable_continueExecution = function () {
  ri || hl || ((ri = !0), td(ed));
};
U.unstable_forceFrameRate = function (e) {
  0 > e || 125 < e
    ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      )
    : (Uy = 0 < e ? Math.floor(1e3 / e) : 5);
};
U.unstable_getCurrentPriorityLevel = function () {
  return ot;
};
U.unstable_getFirstCallbackNode = function () {
  return sn(kn);
};
U.unstable_next = function (e) {
  switch (ot) {
    case 1:
    case 2:
    case 3:
      var t = 3;
      break;
    default:
      t = ot;
  }
  var n = ot;
  ot = t;
  try {
    return e();
  } finally {
    ot = n;
  }
};
U.unstable_pauseExecution = function () {};
U.unstable_requestPaint = function () {};
U.unstable_runWithPriority = function (e, t) {
  switch (e) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      break;
    default:
      e = 3;
  }
  var n = ot;
  ot = e;
  try {
    return t();
  } finally {
    ot = n;
  }
};
U.unstable_scheduleCallback = function (e, t, n) {
  var r = U.unstable_now();
  switch (
    (typeof n == "object" && n !== null
      ? ((n = n.delay), (n = typeof n == "number" && 0 < n ? r + n : r))
      : (n = r),
    e)
  ) {
    case 1:
      var i = -1;
      break;
    case 2:
      i = 250;
      break;
    case 5:
      i = 1073741823;
      break;
    case 4:
      i = 1e4;
      break;
    default:
      i = 5e3;
  }
  return (
    (i = n + i),
    (e = {
      id: qP++,
      callback: t,
      priorityLevel: e,
      startTime: n,
      expirationTime: i,
      sortIndex: -1,
    }),
    n > r
      ? ((e.sortIndex = n),
        Qf(dr, e),
        sn(kn) === null &&
          e === sn(dr) &&
          (is ? (Wy(os), (os = -1)) : (is = !0), nd(Jf, n - r)))
      : ((e.sortIndex = i), Qf(kn, e), ri || hl || ((ri = !0), td(ed))),
    e
  );
};
U.unstable_shouldYield = Yy;
U.unstable_wrapCallback = function (e) {
  var t = ot;
  return function () {
    var n = ot;
    ot = t;
    try {
      return e.apply(this, arguments);
    } finally {
      ot = n;
    }
  };
};
var QP = U.unstable_now,
  ZP = U.unstable_IdlePriority,
  JP = U.unstable_ImmediatePriority,
  eI = U.unstable_LowPriority,
  tI = U.unstable_NormalPriority,
  nI = U.unstable_Profiling,
  rI = U.unstable_UserBlockingPriority,
  iI = U.unstable_cancelCallback,
  oI = U.unstable_continueExecution,
  sI = U.unstable_forceFrameRate,
  aI = U.unstable_getCurrentPriorityLevel,
  lI = U.unstable_getFirstCallbackNode,
  cI = U.unstable_next,
  uI = U.unstable_pauseExecution,
  fI = U.unstable_requestPaint,
  dI = U.unstable_runWithPriority,
  hI = U.unstable_scheduleCallback,
  pI = U.unstable_shouldYield,
  mI = U.unstable_wrapCallback;
var vI = "default" in Te ? b : Te,
  gI = "default" in ml ? U : ml,
  Ht = {},
  eb = vI,
  Bt = gI;
function F(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var tb = new Set(),
  Rs = {};
function vi(e, t) {
  uo(e, t), uo(e + "Capture", t);
}
function uo(e, t) {
  for (Rs[e] = t, e = 0; e < t.length; e++) tb.add(t[e]);
}
var Kn = !(
    typeof _ > "u" ||
    typeof _.document > "u" ||
    typeof _.document.createElement > "u"
  ),
  Td = Object.prototype.hasOwnProperty,
  yI =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Gy = {},
  Ky = {};
function bI(e) {
  return Td.call(Ky, e)
    ? !0
    : Td.call(Gy, e)
    ? !1
    : yI.test(e)
    ? (Ky[e] = !0)
    : ((Gy[e] = !0), !1);
}
function xI(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function SI(e, t, n, r) {
  if (t === null || typeof t > "u" || xI(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function yt(e, t, n, r, i, o, s) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = o),
    (this.removeEmptyString = s);
}
var et = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    et[e] = new yt(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  et[t] = new yt(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  et[e] = new yt(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  et[e] = new yt(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    et[e] = new yt(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  et[e] = new yt(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  et[e] = new yt(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  et[e] = new yt(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  et[e] = new yt(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var vh = /[\-:]([a-z])/g;
function gh(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(vh, gh);
    et[t] = new yt(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(vh, gh);
    et[t] = new yt(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(vh, gh);
  et[t] = new yt(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  et[e] = new yt(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
et.xlinkHref = new yt(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
  et[e] = new yt(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function yh(e, t, n, r) {
  var i = et.hasOwnProperty(t) ? et[t] : null;
  (i !== null
    ? i.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (SI(t, n, i, r) && (n = null),
    r || i === null
      ? bI(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : i.mustUseProperty
      ? (e[i.propertyName] = n === null ? i.type !== 3 && "" : n)
      : ((t = i.attributeName),
        (r = i.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((i = i.type),
            (n = i === 3 || (i === 4 && n === !0) ? "" : "" + n),
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Jn = eb.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  vl = Symbol.for("react.element"),
  Xi = Symbol.for("react.portal"),
  Yi = Symbol.for("react.fragment"),
  bh = Symbol.for("react.strict_mode"),
  Ed = Symbol.for("react.profiler"),
  nb = Symbol.for("react.provider"),
  rb = Symbol.for("react.context"),
  xh = Symbol.for("react.forward_ref"),
  Rd = Symbol.for("react.suspense"),
  Pd = Symbol.for("react.suspense_list"),
  Sh = Symbol.for("react.memo"),
  pr = Symbol.for("react.lazy");
Symbol.for("react.scope");
Symbol.for("react.debug_trace_mode");
var ib = Symbol.for("react.offscreen");
Symbol.for("react.legacy_hidden");
Symbol.for("react.cache");
Symbol.for("react.tracing_marker");
var qy = Symbol.iterator;
function ss(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (qy && e[qy]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var rd,
  Ce = Object.assign;
function ps(e) {
  if (rd === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      rd = (t && t[1]) || "";
    }
  return (
    `
` +
    rd +
    e
  );
}
var id = !1;
function od(e, t) {
  if (!e || id) return "";
  id = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var i = c.stack.split(`
`),
          o = r.stack.split(`
`),
          s = i.length - 1,
          a = o.length - 1;
        1 <= s && 0 <= a && i[s] !== o[a];

      )
        a--;
      for (; 1 <= s && 0 <= a; s--, a--)
        if (i[s] !== o[a]) {
          if (s !== 1 || a !== 1)
            do
              if ((s--, a--, 0 > a || i[s] !== o[a])) {
                var l =
                  `
` + i[s].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    l.includes("<anonymous>") &&
                    (l = l.replace("<anonymous>", e.displayName)),
                  l
                );
              }
            while (1 <= s && 0 <= a);
          break;
        }
    }
  } finally {
    (id = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? ps(e) : "";
}
function wI(e) {
  switch (e.tag) {
    case 5:
      return ps(e.type);
    case 16:
      return ps("Lazy");
    case 13:
      return ps("Suspense");
    case 19:
      return ps("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = od(e.type, !1)), e;
    case 11:
      return (e = od(e.type.render, !1)), e;
    case 1:
      return (e = od(e.type, !0)), e;
    default:
      return "";
  }
}
function Id(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Yi:
      return "Fragment";
    case Xi:
      return "Portal";
    case Ed:
      return "Profiler";
    case bh:
      return "StrictMode";
    case Rd:
      return "Suspense";
    case Pd:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case rb:
        return (e.displayName || "Context") + ".Consumer";
      case nb:
        return (e._context.displayName || "Context") + ".Provider";
      case xh:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Sh:
        return (
          (t = e.displayName || null), t !== null ? t : Id(e.type) || "Memo"
        );
      case pr:
        (t = e._payload), (e = e._init);
        try {
          return Id(e(t));
        } catch {}
    }
  return null;
}
function CI(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Id(t);
    case 8:
      return t === bh ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Pr(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function ob(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function kI(e) {
  var t = ob(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var i = n.get,
      o = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return i.call(this);
        },
        set: function (s) {
          (r = "" + s), o.call(this, s);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (s) {
          r = "" + s;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function gl(e) {
  e._valueTracker || (e._valueTracker = kI(e));
}
function sb(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = ob(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n && (t.setValue(e), !0)
  );
}
function Ul(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Fd(e, t) {
  var n = t.checked;
  return Ce({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function Qy(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = Pr(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function ab(e, t) {
  (t = t.checked), t != null && yh(e, "checked", t, !1);
}
function _d(e, t) {
  ab(e, t);
  var n = Pr(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? Ld(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Ld(e, t.type, Pr(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Zy(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function Ld(e, t, n) {
  (t === "number" && Ul(e.ownerDocument) === e) ||
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var ms = Array.isArray;
function io(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
    for (n = 0; n < e.length; n++)
      (i = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== i && (e[n].selected = i),
        i && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Pr(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        (e[i].selected = !0), r && (e[i].defaultSelected = !0);
        return;
      }
      t !== null || e[i].disabled || (t = e[i]);
    }
    t !== null && (t.selected = !0);
  }
}
function Md(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(F(91));
  return Ce({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Jy(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(F(92));
      if (ms(n)) {
        if (1 < n.length) throw Error(F(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: Pr(n) };
}
function lb(e, t) {
  var n = Pr(t.value),
    r = Pr(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function e0(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function cb(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Od(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? cb(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var yl,
  ub = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, i);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        yl = yl || document.createElement("div"),
          yl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = yl.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Ps(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var ys = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  TI = ["Webkit", "ms", "Moz", "O"];
Object.keys(ys).forEach(function (e) {
  TI.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (ys[t] = ys[e]);
  });
});
function fb(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (ys.hasOwnProperty(e) && ys[e])
    ? ("" + t).trim()
    : t + "px";
}
function db(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        i = fb(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, i) : (e[n] = i);
    }
}
var EI = Ce(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function Ad(e, t) {
  if (t) {
    if (EI[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(F(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(F(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(F(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(F(62));
  }
}
function Dd(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Vd = null;
function wh(e) {
  return (
    (e = e.target || e.srcElement || _),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Bd = null,
  oo = null,
  so = null;
function t0(e) {
  if ((e = Xs(e))) {
    if (typeof Bd != "function") throw Error(F(280));
    var t = e.stateNode;
    t && ((t = bc(t)), Bd(e.stateNode, e.type, t));
  }
}
function hb(e) {
  oo ? (so ? so.push(e) : (so = [e])) : (oo = e);
}
function pb() {
  if (oo) {
    var e = oo,
      t = so;
    if (((so = oo = null), t0(e), t)) for (e = 0; e < t.length; e++) t0(t[e]);
  }
}
function mb(e, t) {
  return e(t);
}
function vb() {}
var sd = !1;
function gb(e, t, n) {
  if (sd) return e(t, n);
  sd = !0;
  try {
    return mb(e, t, n);
  } finally {
    (sd = !1), (oo !== null || so !== null) && (vb(), pb());
  }
}
function Is(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = bc(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(F(231, t, typeof n));
  return n;
}
var Hd = !1;
if (Kn)
  try {
    (Wi = {}),
      Object.defineProperty(Wi, "passive", {
        get: function () {
          Hd = !0;
        },
      }),
      _.addEventListener("test", Wi, Wi),
      _.removeEventListener("test", Wi, Wi);
  } catch {
    Hd = !1;
  }
var Wi;
function RI(e, t, n, r, i, o, s, a, l) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (u) {
    this.onError(u);
  }
}
var bs = !1,
  Xl = null,
  Yl = !1,
  zd = null,
  PI = {
    onError: function (e) {
      (bs = !0), (Xl = e);
    },
  };
function II(e, t, n, r, i, o, s, a, l) {
  (bs = !1), (Xl = null), RI.apply(PI, arguments);
}
function FI(e, t, n, r, i, o, s, a, l) {
  if ((II.apply(this, arguments), bs)) {
    if (!bs) throw Error(F(198));
    var c = Xl;
    (bs = !1), (Xl = null), Yl || ((Yl = !0), (zd = c));
  }
}
function gi(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), 4098 & t.flags && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function yb(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function n0(e) {
  if (gi(e) !== e) throw Error(F(188));
}
function _I(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = gi(e)), t === null)) throw Error(F(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var i = n.return;
    if (i === null) break;
    var o = i.alternate;
    if (o === null) {
      if (((r = i.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === o.child) {
      for (o = i.child; o; ) {
        if (o === n) return n0(i), e;
        if (o === r) return n0(i), t;
        o = o.sibling;
      }
      throw Error(F(188));
    }
    if (n.return !== r.return) (n = i), (r = o);
    else {
      for (var s = !1, a = i.child; a; ) {
        if (a === n) {
          (s = !0), (n = i), (r = o);
          break;
        }
        if (a === r) {
          (s = !0), (r = i), (n = o);
          break;
        }
        a = a.sibling;
      }
      if (!s) {
        for (a = o.child; a; ) {
          if (a === n) {
            (s = !0), (n = o), (r = i);
            break;
          }
          if (a === r) {
            (s = !0), (r = o), (n = i);
            break;
          }
          a = a.sibling;
        }
        if (!s) throw Error(F(189));
      }
    }
    if (n.alternate !== r) throw Error(F(190));
  }
  if (n.tag !== 3) throw Error(F(188));
  return n.stateNode.current === n ? e : t;
}
function bb(e) {
  return (e = _I(e)), e !== null ? xb(e) : null;
}
function xb(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = xb(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Sb = Bt.unstable_scheduleCallback,
  r0 = Bt.unstable_cancelCallback,
  LI = Bt.unstable_shouldYield,
  MI = Bt.unstable_requestPaint,
  Me = Bt.unstable_now,
  OI = Bt.unstable_getCurrentPriorityLevel,
  Ch = Bt.unstable_ImmediatePriority,
  wb = Bt.unstable_UserBlockingPriority,
  Gl = Bt.unstable_NormalPriority,
  AI = Bt.unstable_LowPriority,
  Cb = Bt.unstable_IdlePriority,
  mc = null,
  Pn = null;
function DI(e) {
  if (Pn && typeof Pn.onCommitFiberRoot == "function")
    try {
      Pn.onCommitFiberRoot(mc, e, void 0, (128 & e.current.flags) === 128);
    } catch {}
}
var fn = Math.clz32 ? Math.clz32 : HI,
  VI = Math.log,
  BI = Math.LN2;
function HI(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((VI(e) / BI) | 0)) | 0;
}
var bl = 64,
  xl = 4194304;
function vs(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return 4194240 & e;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return 130023424 & e;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Kl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    i = e.suspendedLanes,
    o = e.pingedLanes,
    s = 268435455 & n;
  if (s !== 0) {
    var a = s & ~i;
    a !== 0 ? (r = vs(a)) : ((o &= s), o !== 0 && (r = vs(o)));
  } else (s = n & ~i), s !== 0 ? (r = vs(s)) : o !== 0 && (r = vs(o));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & i) &&
    ((i = r & -r), (o = t & -t), i >= o || (i === 16 && (4194240 & o) !== 0))
  )
    return t;
  if ((4 & r && (r |= 16 & n), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - fn(t)), (i = 1 << n), (r |= e[n]), (t &= ~i);
  return r;
}
function zI(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function NI(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      i = e.expirationTimes,
      o = e.pendingLanes;
    0 < o;

  ) {
    var s = 31 - fn(o),
      a = 1 << s,
      l = i[s];
    l === -1
      ? (a & n && !(a & r)) || (i[s] = zI(a, t))
      : l <= t && (e.expiredLanes |= a),
      (o &= ~a);
  }
}
function Nd(e) {
  return (
    (e = -1073741825 & e.pendingLanes),
    e !== 0 ? e : 1073741824 & e ? 1073741824 : 0
  );
}
function kb() {
  var e = bl;
  return (bl <<= 1), !(4194240 & bl) && (bl = 64), e;
}
function ad(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ws(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - fn(t)),
    (e[t] = n);
}
function $I(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var i = 31 - fn(n),
      o = 1 << i;
    (t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~o);
  }
}
function kh(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - fn(n),
      i = 1 << r;
    (i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i);
  }
}
var se = 0;
function Tb(e) {
  return (e &= -e), 1 < e ? (4 < e ? (268435455 & e ? 16 : 536870912) : 4) : 1;
}
var Eb,
  Th,
  Rb,
  Pb,
  Ib,
  $d = !1,
  Sl = [],
  xr = null,
  Sr = null,
  wr = null,
  Fs = new Map(),
  _s = new Map(),
  vr = [],
  jI =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function i0(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      xr = null;
      break;
    case "dragenter":
    case "dragleave":
      Sr = null;
      break;
    case "mouseover":
    case "mouseout":
      wr = null;
      break;
    case "pointerover":
    case "pointerout":
      Fs.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      _s.delete(t.pointerId);
  }
}
function as(e, t, n, r, i, o) {
  return e === null || e.nativeEvent !== o
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: o,
        targetContainers: [i],
      }),
      t !== null && ((t = Xs(t)), t !== null && Th(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      i !== null && t.indexOf(i) === -1 && t.push(i),
      e);
}
function WI(e, t, n, r, i) {
  switch (t) {
    case "focusin":
      return (xr = as(xr, e, t, n, r, i)), !0;
    case "dragenter":
      return (Sr = as(Sr, e, t, n, r, i)), !0;
    case "mouseover":
      return (wr = as(wr, e, t, n, r, i)), !0;
    case "pointerover":
      var o = i.pointerId;
      return Fs.set(o, as(Fs.get(o) || null, e, t, n, r, i)), !0;
    case "gotpointercapture":
      return (
        (o = i.pointerId), _s.set(o, as(_s.get(o) || null, e, t, n, r, i)), !0
      );
  }
  return !1;
}
function Fb(e) {
  var t = si(e.target);
  if (t !== null) {
    var n = gi(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = yb(n)), t !== null)) {
          (e.blockedOn = t),
            Ib(e.priority, function () {
              Rb(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Al(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = jd(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n !== null)
      return (t = Xs(n)), t !== null && Th(t), (e.blockedOn = n), !1;
    n = e.nativeEvent;
    var r = new n.constructor(n.type, n);
    (Vd = r), n.target.dispatchEvent(r), (Vd = null), t.shift();
  }
  return !0;
}
function o0(e, t, n) {
  Al(e) && n.delete(t);
}
function UI() {
  ($d = !1),
    xr !== null && Al(xr) && (xr = null),
    Sr !== null && Al(Sr) && (Sr = null),
    wr !== null && Al(wr) && (wr = null),
    Fs.forEach(o0),
    _s.forEach(o0);
}
function ls(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    $d ||
      (($d = !0),
      Bt.unstable_scheduleCallback(Bt.unstable_NormalPriority, UI)));
}
function Ls(e) {
  function t(i) {
    return ls(i, e);
  }
  if (0 < Sl.length) {
    ls(Sl[0], e);
    for (var n = 1; n < Sl.length; n++) {
      var r = Sl[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    xr !== null && ls(xr, e),
      Sr !== null && ls(Sr, e),
      wr !== null && ls(wr, e),
      Fs.forEach(t),
      _s.forEach(t),
      n = 0;
    n < vr.length;
    n++
  )
    (r = vr[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < vr.length && ((n = vr[0]), n.blockedOn === null); )
    Fb(n), n.blockedOn === null && vr.shift();
}
var ao = Jn.ReactCurrentBatchConfig,
  ql = !0;
function XI(e, t, n, r) {
  var i = se,
    o = ao.transition;
  ao.transition = null;
  try {
    (se = 1), Eh(e, t, n, r);
  } finally {
    (se = i), (ao.transition = o);
  }
}
function YI(e, t, n, r) {
  var i = se,
    o = ao.transition;
  ao.transition = null;
  try {
    (se = 4), Eh(e, t, n, r);
  } finally {
    (se = i), (ao.transition = o);
  }
}
function Eh(e, t, n, r) {
  if (ql) {
    var i = jd(e, t, n, r);
    if (i === null) pd(e, t, r, Ql, n), i0(e, r);
    else if (WI(i, e, t, n, r)) r.stopPropagation();
    else if ((i0(e, r), 4 & t && -1 < jI.indexOf(e))) {
      for (; i !== null; ) {
        var o = Xs(i);
        if (
          (o !== null && Eb(o),
          (o = jd(e, t, n, r)),
          o === null && pd(e, t, r, Ql, n),
          o === i)
        )
          break;
        i = o;
      }
      i !== null && r.stopPropagation();
    } else pd(e, t, r, null, n);
  }
}
var Ql = null;
function jd(e, t, n, r) {
  if (((Ql = null), (e = wh(r)), (e = si(e)), e !== null))
    if (((t = gi(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = yb(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (Ql = e), null;
}
function _b(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (OI()) {
        case Ch:
          return 1;
        case wb:
          return 4;
        case Gl:
        case AI:
          return 16;
        case Cb:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var yr = null,
  Rh = null,
  Dl = null;
function Lb() {
  if (Dl) return Dl;
  var e,
    t,
    n = Rh,
    r = n.length,
    i = "value" in yr ? yr.value : yr.textContent,
    o = i.length;
  for (e = 0; e < r && n[e] === i[e]; e++);
  var s = r - e;
  for (t = 1; t <= s && n[r - t] === i[o - t]; t++);
  return (Dl = i.slice(e, 1 < t ? 1 - t : void 0));
}
function Vl(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function wl() {
  return !0;
}
function s0() {
  return !1;
}
function zt(e) {
  function t(n, r, i, o, s) {
    (this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = o),
      (this.target = s),
      (this.currentTarget = null);
    for (var a in e)
      e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(o) : o[a]));
    return (
      (this.isDefaultPrevented = (
        o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
      )
        ? wl
        : s0),
      (this.isPropagationStopped = s0),
      this
    );
  }
  return (
    Ce(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = wl));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = wl));
      },
      persist: function () {},
      isPersistent: wl,
    }),
    t
  );
}
var ld,
  cd,
  cs,
  yo = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Ph = zt(yo),
  Us = Ce({}, yo, { view: 0, detail: 0 }),
  GI = zt(Us),
  vc = Ce({}, Us, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ih,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== cs &&
            (cs && e.type === "mousemove"
              ? ((ld = e.screenX - cs.screenX), (cd = e.screenY - cs.screenY))
              : (cd = ld = 0),
            (cs = e)),
          ld);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : cd;
    },
  }),
  a0 = zt(vc),
  KI = Ce({}, vc, { dataTransfer: 0 }),
  qI = zt(KI),
  QI = Ce({}, Us, { relatedTarget: 0 }),
  ud = zt(QI),
  ZI = Ce({}, yo, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  JI = zt(ZI),
  eF = Ce({}, yo, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : _.clipboardData;
    },
  }),
  tF = zt(eF),
  nF = Ce({}, yo, { data: 0 }),
  l0 = zt(nF),
  rF = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  iF = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  oF = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function sF(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : !!(e = oF[e]) && !!t[e];
}
function Ih() {
  return sF;
}
var aF = Ce({}, Us, {
    key: function (e) {
      if (e.key) {
        var t = rF[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Vl(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? iF[e.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ih,
    charCode: function (e) {
      return e.type === "keypress" ? Vl(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Vl(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  lF = zt(aF),
  cF = Ce({}, vc, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  c0 = zt(cF),
  uF = Ce({}, Us, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ih,
  }),
  fF = zt(uF),
  dF = Ce({}, yo, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  hF = zt(dF),
  pF = Ce({}, vc, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
        ? -e.wheelDeltaY
        : "wheelDelta" in e
        ? -e.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  mF = zt(pF),
  vF = [9, 13, 27, 32],
  Fh = Kn && "CompositionEvent" in _,
  xs = null;
Kn && "documentMode" in document && (xs = document.documentMode);
var gF = Kn && "TextEvent" in _ && !xs,
  Mb = Kn && (!Fh || (xs && 8 < xs && 11 >= xs)),
  u0 = String.fromCharCode(32),
  f0 = !1;
function Ob(e, t) {
  switch (e) {
    case "keyup":
      return vF.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Ab(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var Gi = !1;
function yF(e, t) {
  switch (e) {
    case "compositionend":
      return Ab(t);
    case "keypress":
      return t.which !== 32 ? null : ((f0 = !0), u0);
    case "textInput":
      return (e = t.data), e === u0 && f0 ? null : e;
    default:
      return null;
  }
}
function bF(e, t) {
  if (Gi)
    return e === "compositionend" || (!Fh && Ob(e, t))
      ? ((e = Lb()), (Dl = Rh = yr = null), (Gi = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Mb && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var xF = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function d0(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!xF[e.type] : t === "textarea";
}
function Db(e, t, n, r) {
  hb(r),
    (t = Zl(t, "onChange")),
    0 < t.length &&
      ((n = new Ph("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Ss = null,
  Ms = null;
function SF(e) {
  Yb(e, 0);
}
function gc(e) {
  var t = Qi(e);
  if (sb(t)) return e;
}
function wF(e, t) {
  if (e === "change") return t;
}
var Vb = !1;
Kn &&
  (Kn
    ? ((kl = "oninput" in document),
      kl ||
        ((fd = document.createElement("div")),
        fd.setAttribute("oninput", "return;"),
        (kl = typeof fd.oninput == "function")),
      (Cl = kl))
    : (Cl = !1),
  (Vb = Cl && (!document.documentMode || 9 < document.documentMode)));
var Cl, kl, fd;
function h0() {
  Ss && (Ss.detachEvent("onpropertychange", Bb), (Ms = Ss = null));
}
function Bb(e) {
  if (e.propertyName === "value" && gc(Ms)) {
    var t = [];
    Db(t, Ms, e, wh(e)), gb(SF, t);
  }
}
function CF(e, t, n) {
  e === "focusin"
    ? (h0(), (Ss = t), (Ms = n), Ss.attachEvent("onpropertychange", Bb))
    : e === "focusout" && h0();
}
function kF(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return gc(Ms);
}
function TF(e, t) {
  if (e === "click") return gc(t);
}
function EF(e, t) {
  if (e === "input" || e === "change") return gc(t);
}
function RF(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var hn = typeof Object.is == "function" ? Object.is : RF;
function Os(e, t) {
  if (hn(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Td.call(t, i) || !hn(e[i], t[i])) return !1;
  }
  return !0;
}
function p0(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function m0(e, t) {
  var n = p0(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = p0(n);
  }
}
function Hb(e, t) {
  return (
    !(!e || !t) &&
    (e === t ||
      ((!e || e.nodeType !== 3) &&
        (t && t.nodeType === 3
          ? Hb(e, t.parentNode)
          : "contains" in e
          ? e.contains(t)
          : !!e.compareDocumentPosition &&
            !!(16 & e.compareDocumentPosition(t)))))
  );
}
function zb() {
  for (var e = _, t = Ul(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (!n) break;
    (e = t.contentWindow), (t = Ul(e.document));
  }
  return t;
}
function _h(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function PF(e) {
  var t = zb(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Hb(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && _h(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || _),
        e.getSelection)
      ) {
        e = e.getSelection();
        var i = n.textContent.length,
          o = Math.min(r.start, i);
        (r = r.end === void 0 ? o : Math.min(r.end, i)),
          !e.extend && o > r && ((i = r), (r = o), (o = i)),
          (i = m0(n, o));
        var s = m0(n, r);
        i &&
          s &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== s.node ||
            e.focusOffset !== s.offset) &&
          ((t = t.createRange()),
          t.setStart(i.node, i.offset),
          e.removeAllRanges(),
          o > r
            ? (e.addRange(t), e.extend(s.node, s.offset))
            : (t.setEnd(s.node, s.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var IF = Kn && "documentMode" in document && 11 >= document.documentMode,
  Ki = null,
  Wd = null,
  ws = null,
  Ud = !1;
function v0(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Ud ||
    Ki == null ||
    Ki !== Ul(r) ||
    ((r = Ki),
    "selectionStart" in r && _h(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          _
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (ws && Os(ws, r)) ||
      ((ws = r),
      (r = Zl(Wd, "onSelect")),
      0 < r.length &&
        ((t = new Ph("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Ki))));
}
function Tl(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var qi = {
    animationend: Tl("Animation", "AnimationEnd"),
    animationiteration: Tl("Animation", "AnimationIteration"),
    animationstart: Tl("Animation", "AnimationStart"),
    transitionend: Tl("Transition", "TransitionEnd"),
  },
  dd = {},
  Nb = {};
Kn &&
  ((Nb = document.createElement("div").style),
  "AnimationEvent" in _ ||
    (delete qi.animationend.animation,
    delete qi.animationiteration.animation,
    delete qi.animationstart.animation),
  "TransitionEvent" in _ || delete qi.transitionend.transition);
function yc(e) {
  if (dd[e]) return dd[e];
  if (!qi[e]) return e;
  var t,
    n = qi[e];
  for (t in n) if (n.hasOwnProperty(t) && t in Nb) return (dd[e] = n[t]);
  return e;
}
var $b = yc("animationend"),
  jb = yc("animationiteration"),
  Wb = yc("animationstart"),
  Ub = yc("transitionend"),
  Xb = new Map(),
  g0 =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function Fr(e, t) {
  Xb.set(e, t), vi(t, [e]);
}
for (El = 0; El < g0.length; El++)
  (Rl = g0[El]),
    (y0 = Rl.toLowerCase()),
    (b0 = Rl[0].toUpperCase() + Rl.slice(1)),
    Fr(y0, "on" + b0);
var Rl, y0, b0, El;
Fr($b, "onAnimationEnd");
Fr(jb, "onAnimationIteration");
Fr(Wb, "onAnimationStart");
Fr("dblclick", "onDoubleClick");
Fr("focusin", "onFocus");
Fr("focusout", "onBlur");
Fr(Ub, "onTransitionEnd");
uo("onMouseEnter", ["mouseout", "mouseover"]);
uo("onMouseLeave", ["mouseout", "mouseover"]);
uo("onPointerEnter", ["pointerout", "pointerover"]);
uo("onPointerLeave", ["pointerout", "pointerover"]);
vi(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
vi(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
vi("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
vi(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
vi(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
vi(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var gs =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  FF = new Set("cancel close invalid load scroll toggle".split(" ").concat(gs));
function x0(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), FI(r, t, void 0, e), (e.currentTarget = null);
}
function Yb(e, t) {
  t = (4 & t) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      i = r.event;
    r = r.listeners;
    e: {
      var o = void 0;
      if (t)
        for (var s = r.length - 1; 0 <= s; s--) {
          var a = r[s],
            l = a.instance,
            c = a.currentTarget;
          if (((a = a.listener), l !== o && i.isPropagationStopped())) break e;
          x0(i, a, c), (o = l);
        }
      else
        for (s = 0; s < r.length; s++) {
          if (
            ((a = r[s]),
            (l = a.instance),
            (c = a.currentTarget),
            (a = a.listener),
            l !== o && i.isPropagationStopped())
          )
            break e;
          x0(i, a, c), (o = l);
        }
    }
  }
  if (Yl) throw ((e = zd), (Yl = !1), (zd = null), e);
}
function pe(e, t) {
  var n = t[qd];
  n === void 0 && (n = t[qd] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Gb(t, e, 2, !1), n.add(r));
}
function hd(e, t, n) {
  var r = 0;
  t && (r |= 4), Gb(n, e, r, t);
}
var Pl = "_reactListening" + Math.random().toString(36).slice(2);
function As(e) {
  if (!e[Pl]) {
    (e[Pl] = !0),
      tb.forEach(function (n) {
        n !== "selectionchange" && (FF.has(n) || hd(n, !1, e), hd(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Pl] || ((t[Pl] = !0), hd("selectionchange", !1, t));
  }
}
function Gb(e, t, n, r) {
  switch (_b(t)) {
    case 1:
      var i = XI;
      break;
    case 4:
      i = YI;
      break;
    default:
      i = Eh;
  }
  (n = i.bind(null, t, n, e)),
    (i = void 0),
    !Hd ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (i = !0),
    r
      ? i !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: i })
        : e.addEventListener(t, n, !0)
      : i !== void 0
      ? e.addEventListener(t, n, { passive: i })
      : e.addEventListener(t, n, !1);
}
function pd(e, t, n, r, i) {
  var o = r;
  if (!(1 & t) && !(2 & t) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var s = r.tag;
      if (s === 3 || s === 4) {
        var a = r.stateNode.containerInfo;
        if (a === i || (a.nodeType === 8 && a.parentNode === i)) break;
        if (s === 4)
          for (s = r.return; s !== null; ) {
            var l = s.tag;
            if (
              (l === 3 || l === 4) &&
              ((l = s.stateNode.containerInfo),
              l === i || (l.nodeType === 8 && l.parentNode === i))
            )
              return;
            s = s.return;
          }
        for (; a !== null; ) {
          if (((s = si(a)), s === null)) return;
          if (((l = s.tag), l === 5 || l === 6)) {
            r = o = s;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
  gb(function () {
    var c = o,
      u = wh(n),
      f = [];
    e: {
      var d = Xb.get(e);
      if (d !== void 0) {
        var h = Ph,
          g = e;
        switch (e) {
          case "keypress":
            if (Vl(n) === 0) break e;
          case "keydown":
          case "keyup":
            h = lF;
            break;
          case "focusin":
            (g = "focus"), (h = ud);
            break;
          case "focusout":
            (g = "blur"), (h = ud);
            break;
          case "beforeblur":
          case "afterblur":
            h = ud;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            h = a0;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            h = qI;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            h = fF;
            break;
          case $b:
          case jb:
          case Wb:
            h = JI;
            break;
          case Ub:
            h = hF;
            break;
          case "scroll":
            h = GI;
            break;
          case "wheel":
            h = mF;
            break;
          case "copy":
          case "cut":
          case "paste":
            h = tF;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            h = c0;
        }
        var y = (4 & t) !== 0,
          S = !y && e === "scroll",
          p = y ? (d !== null ? d + "Capture" : null) : d;
        y = [];
        for (var m, v = c; v !== null; ) {
          m = v;
          var x = m.stateNode;
          if (
            (m.tag === 5 &&
              x !== null &&
              ((m = x),
              p !== null && ((x = Is(v, p)), x != null && y.push(Ds(v, x, m)))),
            S)
          )
            break;
          v = v.return;
        }
        0 < y.length &&
          ((d = new h(d, g, null, n, u)), f.push({ event: d, listeners: y }));
      }
    }
    if (!(7 & t)) {
      if (
        ((d = e === "mouseover" || e === "pointerover"),
        (h = e === "mouseout" || e === "pointerout"),
        (!d ||
          n === Vd ||
          !(g = n.relatedTarget || n.fromElement) ||
          (!si(g) && !g[qn])) &&
          (h || d) &&
          ((d =
            u.window === u
              ? u
              : (d = u.ownerDocument)
              ? d.defaultView || d.parentWindow
              : _),
          h
            ? ((g = n.relatedTarget || n.toElement),
              (h = c),
              (g = g ? si(g) : null),
              g !== null &&
                ((S = gi(g)), g !== S || (g.tag !== 5 && g.tag !== 6)) &&
                (g = null))
            : ((h = null), (g = c)),
          h !== g))
      ) {
        if (
          ((y = a0),
          (x = "onMouseLeave"),
          (p = "onMouseEnter"),
          (v = "mouse"),
          (e !== "pointerout" && e !== "pointerover") ||
            ((y = c0),
            (x = "onPointerLeave"),
            (p = "onPointerEnter"),
            (v = "pointer")),
          (S = h == null ? d : Qi(h)),
          (m = g == null ? d : Qi(g)),
          (d = new y(x, v + "leave", h, n, u)),
          (d.target = S),
          (d.relatedTarget = m),
          (x = null),
          si(u) === c &&
            ((y = new y(p, v + "enter", g, n, u)),
            (y.target = m),
            (y.relatedTarget = S),
            (x = y)),
          (S = x),
          h && g)
        )
          e: {
            for (y = h, p = g, v = 0, m = y; m; m = Ui(m)) v++;
            for (m = 0, x = p; x; x = Ui(x)) m++;
            for (; 0 < v - m; ) (y = Ui(y)), v--;
            for (; 0 < m - v; ) (p = Ui(p)), m--;
            for (; v--; ) {
              if (y === p || (p !== null && y === p.alternate)) break e;
              (y = Ui(y)), (p = Ui(p));
            }
            y = null;
          }
        else y = null;
        h !== null && S0(f, d, h, y, !1),
          g !== null && S !== null && S0(f, S, g, y, !0);
      }
      if (
        ((d = c ? Qi(c) : _),
        (h = d.nodeName && d.nodeName.toLowerCase()),
        h === "select" || (h === "input" && d.type === "file"))
      )
        var C = wF;
      else if (d0(d))
        if (Vb) C = EF;
        else {
          C = kF;
          var w = CF;
        }
      else
        (h = d.nodeName) &&
          h.toLowerCase() === "input" &&
          (d.type === "checkbox" || d.type === "radio") &&
          (C = TF);
      switch (
        (C && (C = C(e, c))
          ? Db(f, C, n, u)
          : (w && w(e, d, c),
            e === "focusout" &&
              (w = d._wrapperState) &&
              w.controlled &&
              d.type === "number" &&
              Ld(d, "number", d.value)),
        (w = c ? Qi(c) : _),
        e)
      ) {
        case "focusin":
          (d0(w) || w.contentEditable === "true") &&
            ((Ki = w), (Wd = c), (ws = null));
          break;
        case "focusout":
          ws = Wd = Ki = null;
          break;
        case "mousedown":
          Ud = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Ud = !1), v0(f, n, u);
          break;
        case "selectionchange":
          if (IF) break;
        case "keydown":
        case "keyup":
          v0(f, n, u);
      }
      var k;
      if (Fh)
        e: {
          switch (e) {
            case "compositionstart":
              var E = "onCompositionStart";
              break e;
            case "compositionend":
              E = "onCompositionEnd";
              break e;
            case "compositionupdate":
              E = "onCompositionUpdate";
              break e;
          }
          E = void 0;
        }
      else
        Gi
          ? Ob(e, n) && (E = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (E = "onCompositionStart");
      E &&
        (Mb &&
          n.locale !== "ko" &&
          (Gi || E !== "onCompositionStart"
            ? E === "onCompositionEnd" && Gi && (k = Lb())
            : ((yr = u),
              (Rh = "value" in yr ? yr.value : yr.textContent),
              (Gi = !0))),
        (w = Zl(c, E)),
        0 < w.length &&
          ((E = new l0(E, e, null, n, u)),
          f.push({ event: E, listeners: w }),
          k ? (E.data = k) : ((k = Ab(n)), k !== null && (E.data = k)))),
        (k = gF ? yF(e, n) : bF(e, n)) &&
          ((c = Zl(c, "onBeforeInput")),
          0 < c.length &&
            ((u = new l0("onBeforeInput", "beforeinput", null, n, u)),
            f.push({ event: u, listeners: c }),
            (u.data = k)));
    }
    Yb(f, t);
  });
}
function Ds(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Zl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var i = e,
      o = i.stateNode;
    i.tag === 5 &&
      o !== null &&
      ((i = o),
      (o = Is(e, n)),
      o != null && r.unshift(Ds(e, o, i)),
      (o = Is(e, t)),
      o != null && r.push(Ds(e, o, i))),
      (e = e.return);
  }
  return r;
}
function Ui(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function S0(e, t, n, r, i) {
  for (var o = t._reactName, s = []; n !== null && n !== r; ) {
    var a = n,
      l = a.alternate,
      c = a.stateNode;
    if (l !== null && l === r) break;
    a.tag === 5 &&
      c !== null &&
      ((a = c),
      i
        ? ((l = Is(n, o)), l != null && s.unshift(Ds(n, l, a)))
        : i || ((l = Is(n, o)), l != null && s.push(Ds(n, l, a)))),
      (n = n.return);
  }
  s.length !== 0 && e.push({ event: t, listeners: s });
}
var _F = /\r\n?/g,
  LF = /\u0000|\uFFFD/g;
function w0(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      _F,
      `
`
    )
    .replace(LF, "");
}
function Il(e, t, n) {
  if (((t = w0(t)), w0(e) !== t && n)) throw Error(F(425));
}
function Jl() {}
var Xd = null,
  Yd = null;
function Gd(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Kd = typeof setTimeout == "function" ? setTimeout : void 0,
  MF = typeof clearTimeout == "function" ? clearTimeout : void 0,
  C0 = typeof Promise == "function" ? Promise : void 0,
  OF =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof C0 < "u"
      ? function (e) {
          return C0.resolve(null).then(e).catch(AF);
        }
      : Kd;
function AF(e) {
  setTimeout(function () {
    throw e;
  });
}
function md(e, t) {
  var n = t,
    r = 0;
  do {
    var i = n.nextSibling;
    if ((e.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(i), Ls(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = i;
  } while (n);
  Ls(t);
}
function Cr(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function k0(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var bo = Math.random().toString(36).slice(2),
  Rn = "__reactFiber$" + bo,
  Vs = "__reactProps$" + bo,
  qn = "__reactContainer$" + bo,
  qd = "__reactEvents$" + bo,
  DF = "__reactListeners$" + bo,
  VF = "__reactHandles$" + bo;
function si(e) {
  var t = e[Rn];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[qn] || n[Rn])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = k0(e); e !== null; ) {
          if ((n = e[Rn])) return n;
          e = k0(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Xs(e) {
  return (
    (e = e[Rn] || e[qn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Qi(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(F(33));
}
function bc(e) {
  return e[Vs] || null;
}
var Qd = [],
  Zi = -1;
function _r(e) {
  return { current: e };
}
function me(e) {
  0 > Zi || ((e.current = Qd[Zi]), (Qd[Zi] = null), Zi--);
}
function ue(e, t) {
  Zi++, (Qd[Zi] = e.current), (e.current = t);
}
var Ir = {},
  ct = _r(Ir),
  Pt = _r(!1),
  fi = Ir;
function fo(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Ir;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var i,
    o = {};
  for (i in n) o[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    o
  );
}
function It(e) {
  return (e = e.childContextTypes), e != null;
}
function ec() {
  me(Pt), me(ct);
}
function T0(e, t, n) {
  if (ct.current !== Ir) throw Error(F(168));
  ue(ct, t), ue(Pt, n);
}
function Kb(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in t)) throw Error(F(108, CI(e) || "Unknown", i));
  return Ce({}, n, r);
}
function tc(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Ir),
    (fi = ct.current),
    ue(ct, e),
    ue(Pt, Pt.current),
    !0
  );
}
function E0(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(F(169));
  n
    ? ((e = Kb(e, t, fi)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      me(Pt),
      me(ct),
      ue(ct, e))
    : me(Pt),
    ue(Pt, n);
}
var Un = null,
  xc = !1,
  vd = !1;
function qb(e) {
  Un === null ? (Un = [e]) : Un.push(e);
}
function BF(e) {
  (xc = !0), qb(e);
}
function Lr() {
  if (!vd && Un !== null) {
    vd = !0;
    var e = 0,
      t = se;
    try {
      var n = Un;
      for (se = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Un = null), (xc = !1);
    } catch (i) {
      throw (Un !== null && (Un = Un.slice(e + 1)), Sb(Ch, Lr), i);
    } finally {
      (se = t), (vd = !1);
    }
  }
  return null;
}
var Ji = [],
  eo = 0,
  nc = null,
  rc = 0,
  Kt = [],
  qt = 0,
  di = null,
  Xn = 1,
  Yn = "";
function ii(e, t) {
  (Ji[eo++] = rc), (Ji[eo++] = nc), (nc = e), (rc = t);
}
function Qb(e, t, n) {
  (Kt[qt++] = Xn), (Kt[qt++] = Yn), (Kt[qt++] = di), (di = e);
  var r = Xn;
  e = Yn;
  var i = 32 - fn(r) - 1;
  (r &= ~(1 << i)), (n += 1);
  var o = 32 - fn(t) + i;
  if (30 < o) {
    var s = i - (i % 5);
    (o = (r & ((1 << s) - 1)).toString(32)),
      (r >>= s),
      (i -= s),
      (Xn = (1 << (32 - fn(t) + i)) | (n << i) | r),
      (Yn = o + e);
  } else (Xn = (1 << o) | (n << i) | r), (Yn = e);
}
function Lh(e) {
  e.return !== null && (ii(e, 1), Qb(e, 1, 0));
}
function Mh(e) {
  for (; e === nc; )
    (nc = Ji[--eo]), (Ji[eo] = null), (rc = Ji[--eo]), (Ji[eo] = null);
  for (; e === di; )
    (di = Kt[--qt]),
      (Kt[qt] = null),
      (Yn = Kt[--qt]),
      (Kt[qt] = null),
      (Xn = Kt[--qt]),
      (Kt[qt] = null);
}
var Vt = null,
  Dt = null,
  ye = !1,
  un = null;
function Zb(e, t) {
  var n = Qt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function R0(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null && ((e.stateNode = t), (Vt = e), (Dt = Cr(t.firstChild)), !0)
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null && ((e.stateNode = t), (Vt = e), (Dt = null), !0)
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null &&
          ((n = di !== null ? { id: Xn, overflow: Yn } : null),
          (e.memoizedState = {
            dehydrated: t,
            treeContext: n,
            retryLane: 1073741824,
          }),
          (n = Qt(18, null, null, 0)),
          (n.stateNode = t),
          (n.return = e),
          (e.child = n),
          (Vt = e),
          (Dt = null),
          !0)
      );
    default:
      return !1;
  }
}
function Zd(e) {
  return (1 & e.mode) !== 0 && (128 & e.flags) === 0;
}
function Jd(e) {
  if (ye) {
    var t = Dt;
    if (t) {
      var n = t;
      if (!R0(e, t)) {
        if (Zd(e)) throw Error(F(418));
        t = Cr(n.nextSibling);
        var r = Vt;
        t && R0(e, t)
          ? Zb(r, n)
          : ((e.flags = (-4097 & e.flags) | 2), (ye = !1), (Vt = e));
      }
    } else {
      if (Zd(e)) throw Error(F(418));
      (e.flags = (-4097 & e.flags) | 2), (ye = !1), (Vt = e);
    }
  }
}
function P0(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Vt = e;
}
function Fl(e) {
  if (e !== Vt) return !1;
  if (!ye) return P0(e), (ye = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Gd(e.type, e.memoizedProps))),
    t && (t = Dt))
  ) {
    if (Zd(e)) throw (Jb(), Error(F(418)));
    for (; t; ) Zb(e, t), (t = Cr(t.nextSibling));
  }
  if ((P0(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(F(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Dt = Cr(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Dt = null;
    }
  } else Dt = Vt ? Cr(e.stateNode.nextSibling) : null;
  return !0;
}
function Jb() {
  for (var e = Dt; e; ) e = Cr(e.nextSibling);
}
function ho() {
  (Dt = Vt = null), (ye = !1);
}
function Oh(e) {
  un === null ? (un = [e]) : un.push(e);
}
var HF = Jn.ReactCurrentBatchConfig;
function ln(e, t) {
  if (e && e.defaultProps) {
    (t = Ce({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var ic = _r(null),
  oc = null,
  to = null,
  Ah = null;
function Dh() {
  Ah = to = oc = null;
}
function Vh(e) {
  var t = ic.current;
  me(ic), (e._currentValue = t);
}
function eh(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function lo(e, t) {
  (oc = e),
    (Ah = to = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (Rt = !0), (e.firstContext = null));
}
function Jt(e) {
  var t = e._currentValue;
  if (Ah !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), to === null)) {
      if (oc === null) throw Error(F(308));
      (to = e), (oc.dependencies = { lanes: 0, firstContext: e });
    } else to = to.next = e;
  return t;
}
var ai = null;
function Bh(e) {
  ai === null ? (ai = [e]) : ai.push(e);
}
function ex(e, t, n, r) {
  var i = t.interleaved;
  return (
    i === null ? ((n.next = n), Bh(t)) : ((n.next = i.next), (i.next = n)),
    (t.interleaved = n),
    Qn(e, r)
  );
}
function Qn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var mr = !1;
function Hh(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function tx(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function Gn(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function kr(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), 2 & re)) {
    var i = r.pending;
    return (
      i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
      (r.pending = t),
      Qn(e, n)
    );
  }
  return (
    (i = r.interleaved),
    i === null ? ((t.next = t), Bh(r)) : ((t.next = i.next), (i.next = t)),
    (r.interleaved = t),
    Qn(e, n)
  );
}
function Bl(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (4194240 & n) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), kh(e, n);
  }
}
function I0(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r === null || ((r = r.updateQueue), n !== r))
    (e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t);
  else {
    var i = null,
      o = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var s = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        o === null ? (i = o = s) : (o = o.next = s), (n = n.next);
      } while (n !== null);
      o === null ? (i = o = t) : (o = o.next = t);
    } else i = o = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: o,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
  }
}
function sc(e, t, n, r) {
  var i = e.updateQueue;
  mr = !1;
  var o = i.firstBaseUpdate,
    s = i.lastBaseUpdate,
    a = i.shared.pending;
  if (a !== null) {
    i.shared.pending = null;
    var l = a,
      c = l.next;
    (l.next = null), s === null ? (o = c) : (s.next = c), (s = l);
    var u = e.alternate;
    u !== null &&
      ((u = u.updateQueue),
      (a = u.lastBaseUpdate),
      a !== s &&
        (a === null ? (u.firstBaseUpdate = c) : (a.next = c),
        (u.lastBaseUpdate = l)));
  }
  if (o !== null) {
    var f = i.baseState;
    (s = 0), (u = c = l = null), (a = o);
    do {
      var d = a.lane,
        h = a.eventTime;
      if ((r & d) === d) {
        u !== null &&
          (u = u.next =
            {
              eventTime: h,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var g = e,
            y = a;
          switch (((d = t), (h = n), y.tag)) {
            case 1:
              if (((g = y.payload), typeof g == "function")) {
                f = g.call(h, f, d);
                break e;
              }
              f = g;
              break e;
            case 3:
              g.flags = (-65537 & g.flags) | 128;
            case 0:
              if (
                ((g = y.payload),
                (d = typeof g == "function" ? g.call(h, f, d) : g),
                d == null)
              )
                break e;
              f = Ce({}, f, d);
              break e;
            case 2:
              mr = !0;
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64),
          (d = i.effects),
          d === null ? (i.effects = [a]) : d.push(a));
      } else
        (h = {
          eventTime: h,
          lane: d,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          u === null ? ((c = u = h), (l = f)) : (u = u.next = h),
          (s |= d);
      if (((a = a.next), a === null)) {
        if (((a = i.shared.pending), a === null)) break;
        (d = a),
          (a = d.next),
          (d.next = null),
          (i.lastBaseUpdate = d),
          (i.shared.pending = null);
      }
    } while (1);
    if (
      (u === null && (l = f),
      (i.baseState = l),
      (i.firstBaseUpdate = c),
      (i.lastBaseUpdate = u),
      (t = i.shared.interleaved),
      t !== null)
    ) {
      i = t;
      do (s |= i.lane), (i = i.next);
      while (i !== t);
    } else o === null && (i.shared.lanes = 0);
    (pi |= s), (e.lanes = s), (e.memoizedState = f);
  }
}
function F0(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        i = r.callback;
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != "function"))
          throw Error(F(191, i));
        i.call(r);
      }
    }
}
var nx = new eb.Component().refs;
function th(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Ce({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Sc = {
  isMounted: function (e) {
    return !!(e = e._reactInternals) && gi(e) === e;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = gt(),
      i = Er(e),
      o = Gn(r, i);
    (o.payload = t),
      n != null && (o.callback = n),
      (t = kr(e, o, i)),
      t !== null && (dn(t, e, i, r), Bl(t, e, i));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = gt(),
      i = Er(e),
      o = Gn(r, i);
    (o.tag = 1),
      (o.payload = t),
      n != null && (o.callback = n),
      (t = kr(e, o, i)),
      t !== null && (dn(t, e, i, r), Bl(t, e, i));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = gt(),
      r = Er(e),
      i = Gn(n, r);
    (i.tag = 2),
      t != null && (i.callback = t),
      (t = kr(e, i, r)),
      t !== null && (dn(t, e, r, n), Bl(t, e, r));
  },
};
function _0(e, t, n, r, i, o, s) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, o, s)
      : !t.prototype ||
        !t.prototype.isPureReactComponent ||
        !Os(n, r) ||
        !Os(i, o)
  );
}
function rx(e, t, n) {
  var r = !1,
    i = Ir,
    o = t.contextType;
  return (
    typeof o == "object" && o !== null
      ? (o = Jt(o))
      : ((i = It(t) ? fi : ct.current),
        (r = t.contextTypes),
        (o = (r = r != null) ? fo(e, i) : Ir)),
    (t = new t(n, o)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Sc),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    t
  );
}
function L0(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Sc.enqueueReplaceState(t, t.state, null);
}
function nh(e, t, n, r) {
  var i = e.stateNode;
  (i.props = n), (i.state = e.memoizedState), (i.refs = nx), Hh(e);
  var o = t.contextType;
  typeof o == "object" && o !== null
    ? (i.context = Jt(o))
    : ((o = It(t) ? fi : ct.current), (i.context = fo(e, o))),
    (i.state = e.memoizedState),
    (o = t.getDerivedStateFromProps),
    typeof o == "function" && (th(e, t, o, n), (i.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function" ||
      (typeof i.UNSAFE_componentWillMount != "function" &&
        typeof i.componentWillMount != "function") ||
      ((t = i.state),
      typeof i.componentWillMount == "function" && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == "function" &&
        i.UNSAFE_componentWillMount(),
      t !== i.state && Sc.enqueueReplaceState(i, i.state, null),
      sc(e, n, i, r),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == "function" && (e.flags |= 4194308);
}
function us(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(F(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(F(147, e));
      var i = r,
        o = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === o
        ? t.ref
        : ((t = function (s) {
            var a = i.refs;
            a === nx && (a = i.refs = {}),
              s === null ? delete a[o] : (a[o] = s);
          }),
          (t._stringRef = o),
          t);
    }
    if (typeof e != "string") throw Error(F(284));
    if (!n._owner) throw Error(F(290, e));
  }
  return e;
}
function _l(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      F(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e
      )
    ))
  );
}
function M0(e) {
  var t = e._init;
  return t(e._payload);
}
function ix(e) {
  function t(p, m) {
    if (e) {
      var v = p.deletions;
      v === null ? ((p.deletions = [m]), (p.flags |= 16)) : v.push(m);
    }
  }
  function n(p, m) {
    if (!e) return null;
    for (; m !== null; ) t(p, m), (m = m.sibling);
    return null;
  }
  function r(p, m) {
    for (p = new Map(); m !== null; )
      m.key !== null ? p.set(m.key, m) : p.set(m.index, m), (m = m.sibling);
    return p;
  }
  function i(p, m) {
    return (p = Rr(p, m)), (p.index = 0), (p.sibling = null), p;
  }
  function o(p, m, v) {
    return (
      (p.index = v),
      e
        ? ((v = p.alternate),
          v !== null
            ? ((v = v.index), v < m ? ((p.flags |= 2), m) : v)
            : ((p.flags |= 2), m))
        : ((p.flags |= 1048576), m)
    );
  }
  function s(p) {
    return e && p.alternate === null && (p.flags |= 2), p;
  }
  function a(p, m, v, x) {
    return m === null || m.tag !== 6
      ? ((m = Cd(v, p.mode, x)), (m.return = p), m)
      : ((m = i(m, v)), (m.return = p), m);
  }
  function l(p, m, v, x) {
    var C = v.type;
    return C === Yi
      ? u(p, m, v.props.children, x, v.key)
      : m !== null &&
        (m.elementType === C ||
          (typeof C == "object" &&
            C !== null &&
            C.$$typeof === pr &&
            M0(C) === m.type))
      ? ((x = i(m, v.props)), (x.ref = us(p, m, v)), (x.return = p), x)
      : ((x = Wl(v.type, v.key, v.props, null, p.mode, x)),
        (x.ref = us(p, m, v)),
        (x.return = p),
        x);
  }
  function c(p, m, v, x) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== v.containerInfo ||
      m.stateNode.implementation !== v.implementation
      ? ((m = kd(v, p.mode, x)), (m.return = p), m)
      : ((m = i(m, v.children || [])), (m.return = p), m);
  }
  function u(p, m, v, x, C) {
    return m === null || m.tag !== 7
      ? ((m = ui(v, p.mode, x, C)), (m.return = p), m)
      : ((m = i(m, v)), (m.return = p), m);
  }
  function f(p, m, v) {
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return (m = Cd("" + m, p.mode, v)), (m.return = p), m;
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case vl:
          return (
            (v = Wl(m.type, m.key, m.props, null, p.mode, v)),
            (v.ref = us(p, null, m)),
            (v.return = p),
            v
          );
        case Xi:
          return (m = kd(m, p.mode, v)), (m.return = p), m;
        case pr:
          var x = m._init;
          return f(p, x(m._payload), v);
      }
      if (ms(m) || ss(m))
        return (m = ui(m, p.mode, v, null)), (m.return = p), m;
      _l(p, m);
    }
    return null;
  }
  function d(p, m, v, x) {
    var C = m !== null ? m.key : null;
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return C !== null ? null : a(p, m, "" + v, x);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case vl:
          return v.key === C ? l(p, m, v, x) : null;
        case Xi:
          return v.key === C ? c(p, m, v, x) : null;
        case pr:
          return (C = v._init), d(p, m, C(v._payload), x);
      }
      if (ms(v) || ss(v)) return C !== null ? null : u(p, m, v, x, null);
      _l(p, v);
    }
    return null;
  }
  function h(p, m, v, x, C) {
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return (p = p.get(v) || null), a(m, p, "" + x, C);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case vl:
          return (p = p.get(x.key === null ? v : x.key) || null), l(m, p, x, C);
        case Xi:
          return (p = p.get(x.key === null ? v : x.key) || null), c(m, p, x, C);
        case pr:
          var w = x._init;
          return h(p, m, v, w(x._payload), C);
      }
      if (ms(x) || ss(x)) return (p = p.get(v) || null), u(m, p, x, C, null);
      _l(m, x);
    }
    return null;
  }
  function g(p, m, v, x) {
    for (
      var C = null, w = null, k = m, E = (m = 0), P = null;
      k !== null && E < v.length;
      E++
    ) {
      k.index > E ? ((P = k), (k = null)) : (P = k.sibling);
      var I = d(p, k, v[E], x);
      if (I === null) {
        k === null && (k = P);
        break;
      }
      e && k && I.alternate === null && t(p, k),
        (m = o(I, m, E)),
        w === null ? (C = I) : (w.sibling = I),
        (w = I),
        (k = P);
    }
    if (E === v.length) return n(p, k), ye && ii(p, E), C;
    if (k === null) {
      for (; E < v.length; E++)
        (k = f(p, v[E], x)),
          k !== null &&
            ((m = o(k, m, E)), w === null ? (C = k) : (w.sibling = k), (w = k));
      return ye && ii(p, E), C;
    }
    for (k = r(p, k); E < v.length; E++)
      (P = h(k, p, E, v[E], x)),
        P !== null &&
          (e && P.alternate !== null && k.delete(P.key === null ? E : P.key),
          (m = o(P, m, E)),
          w === null ? (C = P) : (w.sibling = P),
          (w = P));
    return (
      e &&
        k.forEach(function (H) {
          return t(p, H);
        }),
      ye && ii(p, E),
      C
    );
  }
  function y(p, m, v, x) {
    var C = ss(v);
    if (typeof C != "function") throw Error(F(150));
    if (((v = C.call(v)), v == null)) throw Error(F(151));
    for (
      var w = (C = null), k = m, E = (m = 0), P = null, I = v.next();
      k !== null && !I.done;
      E++, I = v.next()
    ) {
      k.index > E ? ((P = k), (k = null)) : (P = k.sibling);
      var H = d(p, k, I.value, x);
      if (H === null) {
        k === null && (k = P);
        break;
      }
      e && k && H.alternate === null && t(p, k),
        (m = o(H, m, E)),
        w === null ? (C = H) : (w.sibling = H),
        (w = H),
        (k = P);
    }
    if (I.done) return n(p, k), ye && ii(p, E), C;
    if (k === null) {
      for (; !I.done; E++, I = v.next())
        (I = f(p, I.value, x)),
          I !== null &&
            ((m = o(I, m, E)), w === null ? (C = I) : (w.sibling = I), (w = I));
      return ye && ii(p, E), C;
    }
    for (k = r(p, k); !I.done; E++, I = v.next())
      (I = h(k, p, E, I.value, x)),
        I !== null &&
          (e && I.alternate !== null && k.delete(I.key === null ? E : I.key),
          (m = o(I, m, E)),
          w === null ? (C = I) : (w.sibling = I),
          (w = I));
    return (
      e &&
        k.forEach(function (L) {
          return t(p, L);
        }),
      ye && ii(p, E),
      C
    );
  }
  function S(p, m, v, x) {
    if (
      (typeof v == "object" &&
        v !== null &&
        v.type === Yi &&
        v.key === null &&
        (v = v.props.children),
      typeof v == "object" && v !== null)
    ) {
      switch (v.$$typeof) {
        case vl:
          e: {
            for (var C = v.key, w = m; w !== null; ) {
              if (w.key === C) {
                if (((C = v.type), C === Yi)) {
                  if (w.tag === 7) {
                    n(p, w.sibling),
                      (m = i(w, v.props.children)),
                      (m.return = p),
                      (p = m);
                    break e;
                  }
                } else if (
                  w.elementType === C ||
                  (typeof C == "object" &&
                    C !== null &&
                    C.$$typeof === pr &&
                    M0(C) === w.type)
                ) {
                  n(p, w.sibling),
                    (m = i(w, v.props)),
                    (m.ref = us(p, w, v)),
                    (m.return = p),
                    (p = m);
                  break e;
                }
                n(p, w);
                break;
              }
              t(p, w), (w = w.sibling);
            }
            v.type === Yi
              ? ((m = ui(v.props.children, p.mode, x, v.key)),
                (m.return = p),
                (p = m))
              : ((x = Wl(v.type, v.key, v.props, null, p.mode, x)),
                (x.ref = us(p, m, v)),
                (x.return = p),
                (p = x));
          }
          return s(p);
        case Xi:
          e: {
            for (w = v.key; m !== null; ) {
              if (m.key === w) {
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === v.containerInfo &&
                  m.stateNode.implementation === v.implementation
                ) {
                  n(p, m.sibling),
                    (m = i(m, v.children || [])),
                    (m.return = p),
                    (p = m);
                  break e;
                }
                n(p, m);
                break;
              }
              t(p, m), (m = m.sibling);
            }
            (m = kd(v, p.mode, x)), (m.return = p), (p = m);
          }
          return s(p);
        case pr:
          return (w = v._init), S(p, m, w(v._payload), x);
      }
      if (ms(v)) return g(p, m, v, x);
      if (ss(v)) return y(p, m, v, x);
      _l(p, v);
    }
    return (typeof v == "string" && v !== "") || typeof v == "number"
      ? ((v = "" + v),
        m !== null && m.tag === 6
          ? (n(p, m.sibling), (m = i(m, v)), (m.return = p), (p = m))
          : (n(p, m), (m = Cd(v, p.mode, x)), (m.return = p), (p = m)),
        s(p))
      : n(p, m);
  }
  return S;
}
var po = ix(!0),
  ox = ix(!1),
  Ys = {},
  In = _r(Ys),
  Bs = _r(Ys),
  Hs = _r(Ys);
function li(e) {
  if (e === Ys) throw Error(F(174));
  return e;
}
function zh(e, t) {
  switch ((ue(Hs, t), ue(Bs, e), ue(In, Ys), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Od(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Od(t, e));
  }
  me(In), ue(In, t);
}
function mo() {
  me(In), me(Bs), me(Hs);
}
function sx(e) {
  li(Hs.current);
  var t = li(In.current),
    n = Od(t, e.type);
  t !== n && (ue(Bs, e), ue(In, n));
}
function Nh(e) {
  Bs.current === e && (me(In), me(Bs));
}
var Se = _r(0);
function ac(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (128 & t.flags) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var gd = [];
function $h() {
  for (var e = 0; e < gd.length; e++)
    gd[e]._workInProgressVersionPrimary = null;
  gd.length = 0;
}
var Hl = Jn.ReactCurrentDispatcher,
  yd = Jn.ReactCurrentBatchConfig,
  hi = 0,
  we = null,
  $e = null,
  Xe = null,
  lc = !1,
  Cs = !1,
  zs = 0,
  zF = 0;
function st() {
  throw Error(F(321));
}
function jh(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!hn(e[n], t[n])) return !1;
  return !0;
}
function Wh(e, t, n, r, i, o) {
  if (
    ((hi = o),
    (we = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Hl.current = e === null || e.memoizedState === null ? WF : UF),
    (e = n(r, i)),
    Cs)
  ) {
    o = 0;
    do {
      if (((Cs = !1), (zs = 0), 25 <= o)) throw Error(F(301));
      (o += 1),
        (Xe = $e = null),
        (t.updateQueue = null),
        (Hl.current = XF),
        (e = n(r, i));
    } while (Cs);
  }
  if (
    ((Hl.current = cc),
    (t = $e !== null && $e.next !== null),
    (hi = 0),
    (Xe = $e = we = null),
    (lc = !1),
    t)
  )
    throw Error(F(300));
  return e;
}
function Uh() {
  var e = zs !== 0;
  return (zs = 0), e;
}
function En() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Xe === null ? (we.memoizedState = Xe = e) : (Xe = Xe.next = e), Xe;
}
function en() {
  if ($e === null) {
    var e = we.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = $e.next;
  var t = Xe === null ? we.memoizedState : Xe.next;
  if (t !== null) (Xe = t), ($e = e);
  else {
    if (e === null) throw Error(F(310));
    ($e = e),
      (e = {
        memoizedState: $e.memoizedState,
        baseState: $e.baseState,
        baseQueue: $e.baseQueue,
        queue: $e.queue,
        next: null,
      }),
      Xe === null ? (we.memoizedState = Xe = e) : (Xe = Xe.next = e);
  }
  return Xe;
}
function Ns(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function bd(e) {
  var t = en(),
    n = t.queue;
  if (n === null) throw Error(F(311));
  n.lastRenderedReducer = e;
  var r = $e,
    i = r.baseQueue,
    o = n.pending;
  if (o !== null) {
    if (i !== null) {
      var s = i.next;
      (i.next = o.next), (o.next = s);
    }
    (r.baseQueue = i = o), (n.pending = null);
  }
  if (i !== null) {
    (o = i.next), (r = r.baseState);
    var a = (s = null),
      l = null,
      c = o;
    do {
      var u = c.lane;
      if ((hi & u) === u)
        l !== null &&
          (l = l.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action));
      else {
        var f = {
          lane: u,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        l === null ? ((a = l = f), (s = r)) : (l = l.next = f),
          (we.lanes |= u),
          (pi |= u);
      }
      c = c.next;
    } while (c !== null && c !== o);
    l === null ? (s = r) : (l.next = a),
      hn(r, t.memoizedState) || (Rt = !0),
      (t.memoizedState = r),
      (t.baseState = s),
      (t.baseQueue = l),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    i = e;
    do (o = i.lane), (we.lanes |= o), (pi |= o), (i = i.next);
    while (i !== e);
  } else i === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function xd(e) {
  var t = en(),
    n = t.queue;
  if (n === null) throw Error(F(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    i = n.pending,
    o = t.memoizedState;
  if (i !== null) {
    n.pending = null;
    var s = (i = i.next);
    do (o = e(o, s.action)), (s = s.next);
    while (s !== i);
    hn(o, t.memoizedState) || (Rt = !0),
      (t.memoizedState = o),
      t.baseQueue === null && (t.baseState = o),
      (n.lastRenderedState = o);
  }
  return [o, r];
}
function ax() {}
function lx(e, t) {
  var n = we,
    r = en(),
    i = t(),
    o = !hn(r.memoizedState, i);
  if (
    (o && ((r.memoizedState = i), (Rt = !0)),
    (r = r.queue),
    Xh(fx.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || o || (Xe !== null && 1 & Xe.memoizedState.tag))
  ) {
    if (
      ((n.flags |= 2048),
      $s(9, ux.bind(null, n, r, i, t), void 0, null),
      Ye === null)
    )
      throw Error(F(349));
    30 & hi || cx(n, t, i);
  }
  return i;
}
function cx(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = we.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (we.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function ux(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), dx(t) && hx(e);
}
function fx(e, t, n) {
  return n(function () {
    dx(t) && hx(e);
  });
}
function dx(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !hn(e, n);
  } catch {
    return !0;
  }
}
function hx(e) {
  var t = Qn(e, 1);
  t !== null && dn(t, e, 1, -1);
}
function O0(e) {
  var t = En();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ns,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = jF.bind(null, we, e)),
    [t.memoizedState, e]
  );
}
function $s(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = we.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (we.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function px() {
  return en().memoizedState;
}
function zl(e, t, n, r) {
  var i = En();
  (we.flags |= e),
    (i.memoizedState = $s(1 | t, n, void 0, r === void 0 ? null : r));
}
function wc(e, t, n, r) {
  var i = en();
  r = r === void 0 ? null : r;
  var o = void 0;
  if ($e !== null) {
    var s = $e.memoizedState;
    if (((o = s.destroy), r !== null && jh(r, s.deps))) {
      i.memoizedState = $s(t, n, o, r);
      return;
    }
  }
  (we.flags |= e), (i.memoizedState = $s(1 | t, n, o, r));
}
function A0(e, t) {
  return zl(8390656, 8, e, t);
}
function Xh(e, t) {
  return wc(2048, 8, e, t);
}
function mx(e, t) {
  return wc(4, 2, e, t);
}
function vx(e, t) {
  return wc(4, 4, e, t);
}
function gx(e, t) {
  return typeof t == "function"
    ? ((e = e()),
      t(e),
      function () {
        t(null);
      })
    : t != null
    ? ((e = e()),
      (t.current = e),
      function () {
        t.current = null;
      })
    : void 0;
}
function yx(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), wc(4, 4, gx.bind(null, t, e), n)
  );
}
function Yh() {}
function bx(e, t) {
  var n = en();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && jh(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function xx(e, t) {
  var n = en();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && jh(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Sx(e, t, n) {
  return 21 & hi
    ? (hn(n, t) || ((n = kb()), (we.lanes |= n), (pi |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (Rt = !0)), (e.memoizedState = n));
}
function NF(e, t) {
  var n = se;
  (se = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = yd.transition;
  yd.transition = {};
  try {
    e(!1), t();
  } finally {
    (se = n), (yd.transition = r);
  }
}
function wx() {
  return en().memoizedState;
}
function $F(e, t, n) {
  var r = Er(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Cx(e))
  )
    kx(t, n);
  else if (((n = ex(e, t, n, r)), n !== null)) {
    var i = gt();
    dn(n, e, r, i), Tx(n, t, r);
  }
}
function jF(e, t, n) {
  var r = Er(e),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Cx(e)) kx(t, i);
  else {
    var o = e.alternate;
    if (
      e.lanes === 0 &&
      (o === null || o.lanes === 0) &&
      ((o = t.lastRenderedReducer), o !== null)
    )
      try {
        var s = t.lastRenderedState,
          a = o(s, n);
        if (((i.hasEagerState = !0), (i.eagerState = a), hn(a, s))) {
          var l = t.interleaved;
          l === null
            ? ((i.next = i), Bh(t))
            : ((i.next = l.next), (l.next = i)),
            (t.interleaved = i);
          return;
        }
      } catch {}
    (n = ex(e, t, i, r)),
      n !== null && ((i = gt()), dn(n, e, r, i), Tx(n, t, r));
  }
}
function Cx(e) {
  var t = e.alternate;
  return e === we || (t !== null && t === we);
}
function kx(e, t) {
  Cs = lc = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Tx(e, t, n) {
  if (4194240 & n) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), kh(e, n);
  }
}
var cc = {
    readContext: Jt,
    useCallback: st,
    useContext: st,
    useEffect: st,
    useImperativeHandle: st,
    useInsertionEffect: st,
    useLayoutEffect: st,
    useMemo: st,
    useReducer: st,
    useRef: st,
    useState: st,
    useDebugValue: st,
    useDeferredValue: st,
    useTransition: st,
    useMutableSource: st,
    useSyncExternalStore: st,
    useId: st,
    unstable_isNewReconciler: !1,
  },
  WF = {
    readContext: Jt,
    useCallback: function (e, t) {
      return (En().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: Jt,
    useEffect: A0,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        zl(4194308, 4, gx.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return zl(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return zl(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = En();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = En();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = $F.bind(null, we, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = En();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: O0,
    useDebugValue: Yh,
    useDeferredValue: function (e) {
      return (En().memoizedState = e);
    },
    useTransition: function () {
      var e = O0(!1),
        t = e[0];
      return (e = NF.bind(null, e[1])), (En().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = we,
        i = En();
      if (ye) {
        if (n === void 0) throw Error(F(407));
        n = n();
      } else {
        if (((n = t()), Ye === null)) throw Error(F(349));
        30 & hi || cx(r, t, n);
      }
      i.memoizedState = n;
      var o = { value: n, getSnapshot: t };
      return (
        (i.queue = o),
        A0(fx.bind(null, r, o, e), [e]),
        (r.flags |= 2048),
        $s(9, ux.bind(null, r, o, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = En(),
        t = Ye.identifierPrefix;
      if (ye) {
        var n = Yn,
          r = Xn;
        (n = (r & ~(1 << (32 - fn(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = zs++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = zF++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  UF = {
    readContext: Jt,
    useCallback: bx,
    useContext: Jt,
    useEffect: Xh,
    useImperativeHandle: yx,
    useInsertionEffect: mx,
    useLayoutEffect: vx,
    useMemo: xx,
    useReducer: bd,
    useRef: px,
    useState: function () {
      return bd(Ns);
    },
    useDebugValue: Yh,
    useDeferredValue: function (e) {
      var t = en();
      return Sx(t, $e.memoizedState, e);
    },
    useTransition: function () {
      var e = bd(Ns)[0],
        t = en().memoizedState;
      return [e, t];
    },
    useMutableSource: ax,
    useSyncExternalStore: lx,
    useId: wx,
    unstable_isNewReconciler: !1,
  },
  XF = {
    readContext: Jt,
    useCallback: bx,
    useContext: Jt,
    useEffect: Xh,
    useImperativeHandle: yx,
    useInsertionEffect: mx,
    useLayoutEffect: vx,
    useMemo: xx,
    useReducer: xd,
    useRef: px,
    useState: function () {
      return xd(Ns);
    },
    useDebugValue: Yh,
    useDeferredValue: function (e) {
      var t = en();
      return $e === null ? (t.memoizedState = e) : Sx(t, $e.memoizedState, e);
    },
    useTransition: function () {
      var e = xd(Ns)[0],
        t = en().memoizedState;
      return [e, t];
    },
    useMutableSource: ax,
    useSyncExternalStore: lx,
    useId: wx,
    unstable_isNewReconciler: !1,
  };
function vo(e, t) {
  try {
    var n = "",
      r = t;
    do (n += wI(r)), (r = r.return);
    while (r);
    var i = n;
  } catch (o) {
    i =
      `
Error generating stack: ` +
      o.message +
      `
` +
      o.stack;
  }
  return { value: e, source: t, stack: i, digest: null };
}
function Sd(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function rh(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var YF = typeof WeakMap == "function" ? WeakMap : Map;
function Ex(e, t, n) {
  (n = Gn(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      fc || ((fc = !0), (dh = r)), rh(e, t);
    }),
    n
  );
}
function Rx(e, t, n) {
  (n = Gn(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = t.value;
    (n.payload = function () {
      return r(i);
    }),
      (n.callback = function () {
        rh(e, t);
      });
  }
  var o = e.stateNode;
  return (
    o !== null &&
      typeof o.componentDidCatch == "function" &&
      (n.callback = function () {
        rh(e, t),
          typeof r != "function" &&
            (Tr === null ? (Tr = new Set([this])) : Tr.add(this));
        var s = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: s !== null ? s : "",
        });
      }),
    n
  );
}
function D0(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new YF();
    var i = new Set();
    r.set(t, i);
  } else (i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i));
  i.has(n) || (i.add(n), (e = a_.bind(null, e, t, n)), t.then(e, e));
}
function V0(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t === null || t.dehydrated !== null)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function B0(e, t, n, r, i) {
  return 1 & e.mode
    ? ((e.flags |= 65536), (e.lanes = i), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Gn(-1, 1)), (t.tag = 2), kr(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var GF = Jn.ReactCurrentOwner,
  Rt = !1;
function vt(e, t, n, r) {
  t.child = e === null ? ox(t, null, n, r) : po(t, e.child, n, r);
}
function H0(e, t, n, r, i) {
  n = n.render;
  var o = t.ref;
  return (
    lo(t, i),
    (r = Wh(e, t, n, r, o, i)),
    (n = Uh()),
    e !== null && !Rt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~i),
        Zn(e, t, i))
      : (ye && n && Lh(t), (t.flags |= 1), vt(e, t, r, i), t.child)
  );
}
function z0(e, t, n, r, i) {
  if (e === null) {
    var o = n.type;
    return typeof o == "function" &&
      !tp(o) &&
      o.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = o), Px(e, t, o, r, i))
      : ((e = Wl(n.type, null, r, t, t.mode, i)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((o = e.child), !(e.lanes & i))) {
    var s = o.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : Os), n(s, r) && e.ref === t.ref)
    )
      return Zn(e, t, i);
  }
  return (
    (t.flags |= 1),
    (e = Rr(o, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Px(e, t, n, r, i) {
  if (e !== null) {
    var o = e.memoizedProps;
    if (Os(o, r) && e.ref === t.ref) {
      if (((Rt = !1), (t.pendingProps = r = o), (e.lanes & i) === 0))
        return (t.lanes = e.lanes), Zn(e, t, i);
      131072 & e.flags && (Rt = !0);
    }
  }
  return ih(e, t, n, r, i);
}
function Ix(e, t, n) {
  var r = t.pendingProps,
    i = r.children,
    o = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(1 & t.mode))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ue(ro, At),
        (At |= n);
    else {
      if (!(1073741824 & n))
        return (
          (e = o !== null ? o.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          ue(ro, At),
          (At |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = o !== null ? o.baseLanes : n),
        ue(ro, At),
        (At |= r);
    }
  else
    o !== null ? ((r = o.baseLanes | n), (t.memoizedState = null)) : (r = n),
      ue(ro, At),
      (At |= r);
  return vt(e, t, i, n), t.child;
}
function Fx(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ih(e, t, n, r, i) {
  var o = It(n) ? fi : ct.current;
  return (
    (o = fo(t, o)),
    lo(t, i),
    (n = Wh(e, t, n, r, o, i)),
    (r = Uh()),
    e !== null && !Rt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~i),
        Zn(e, t, i))
      : (ye && r && Lh(t), (t.flags |= 1), vt(e, t, n, i), t.child)
  );
}
function N0(e, t, n, r, i) {
  if (It(n)) {
    var o = !0;
    tc(t);
  } else o = !1;
  if ((lo(t, i), t.stateNode === null))
    Nl(e, t), rx(t, n, r), nh(t, n, r, i), (r = !0);
  else if (e === null) {
    var s = t.stateNode,
      a = t.memoizedProps;
    s.props = a;
    var l = s.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Jt(c))
      : ((c = It(n) ? fi : ct.current), (c = fo(t, c)));
    var u = n.getDerivedStateFromProps,
      f =
        typeof u == "function" ||
        typeof s.getSnapshotBeforeUpdate == "function";
    f ||
      (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
        typeof s.componentWillReceiveProps != "function") ||
      ((a !== r || l !== c) && L0(t, s, r, c)),
      (mr = !1);
    var d = t.memoizedState;
    (s.state = d),
      sc(t, r, s, i),
      (l = t.memoizedState),
      a !== r || d !== l || Pt.current || mr
        ? (typeof u == "function" && (th(t, n, u, r), (l = t.memoizedState)),
          (a = mr || _0(t, n, a, r, d, l, c))
            ? (f ||
                (typeof s.UNSAFE_componentWillMount != "function" &&
                  typeof s.componentWillMount != "function") ||
                (typeof s.componentWillMount == "function" &&
                  s.componentWillMount(),
                typeof s.UNSAFE_componentWillMount == "function" &&
                  s.UNSAFE_componentWillMount()),
              typeof s.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = l)),
          (s.props = r),
          (s.state = l),
          (s.context = c),
          (r = a))
        : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (s = t.stateNode),
      tx(e, t),
      (a = t.memoizedProps),
      (c = t.type === t.elementType ? a : ln(t.type, a)),
      (s.props = c),
      (f = t.pendingProps),
      (d = s.context),
      (l = n.contextType),
      typeof l == "object" && l !== null
        ? (l = Jt(l))
        : ((l = It(n) ? fi : ct.current), (l = fo(t, l)));
    var h = n.getDerivedStateFromProps;
    (u =
      typeof h == "function" ||
      typeof s.getSnapshotBeforeUpdate == "function") ||
      (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
        typeof s.componentWillReceiveProps != "function") ||
      ((a !== f || d !== l) && L0(t, s, r, l)),
      (mr = !1),
      (d = t.memoizedState),
      (s.state = d),
      sc(t, r, s, i);
    var g = t.memoizedState;
    a !== f || d !== g || Pt.current || mr
      ? (typeof h == "function" && (th(t, n, h, r), (g = t.memoizedState)),
        (c = mr || _0(t, n, c, r, d, g, l) || !1)
          ? (u ||
              (typeof s.UNSAFE_componentWillUpdate != "function" &&
                typeof s.componentWillUpdate != "function") ||
              (typeof s.componentWillUpdate == "function" &&
                s.componentWillUpdate(r, g, l),
              typeof s.UNSAFE_componentWillUpdate == "function" &&
                s.UNSAFE_componentWillUpdate(r, g, l)),
            typeof s.componentDidUpdate == "function" && (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof s.componentDidUpdate != "function" ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate != "function" ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = g)),
        (s.props = r),
        (s.state = g),
        (s.context = l),
        (r = c))
      : (typeof s.componentDidUpdate != "function" ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 4),
        typeof s.getSnapshotBeforeUpdate != "function" ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return oh(e, t, n, r, o, i);
}
function oh(e, t, n, r, i, o) {
  Fx(e, t);
  var s = (128 & t.flags) !== 0;
  if (!r && !s) return i && E0(t, n, !1), Zn(e, t, o);
  (r = t.stateNode), (GF.current = t);
  var a =
    s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && s
      ? ((t.child = po(t, e.child, null, o)), (t.child = po(t, null, a, o)))
      : vt(e, t, a, o),
    (t.memoizedState = r.state),
    i && E0(t, n, !0),
    t.child
  );
}
function _x(e) {
  var t = e.stateNode;
  t.pendingContext
    ? T0(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && T0(e, t.context, !1),
    zh(e, t.containerInfo);
}
function $0(e, t, n, r, i) {
  return ho(), Oh(i), (t.flags |= 256), vt(e, t, n, r), t.child;
}
var sh = { dehydrated: null, treeContext: null, retryLane: 0 };
function ah(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Lx(e, t, n) {
  var r,
    i = t.pendingProps,
    o = Se.current,
    s = !1,
    a = (128 & t.flags) !== 0;
  if (
    ((r = a) || (r = (e === null || e.memoizedState !== null) && (2 & o) !== 0),
    r
      ? ((s = !0), (t.flags &= -129))
      : (e !== null && e.memoizedState === null) || (o |= 1),
    ue(Se, 1 & o),
    e === null)
  )
    return (
      Jd(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (1 & t.mode
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((a = i.children),
          (e = i.fallback),
          s
            ? ((i = t.mode),
              (s = t.child),
              (a = { mode: "hidden", children: a }),
              !(1 & i) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = a))
                : (s = Tc(a, i, 0, null)),
              (e = ui(e, i, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = ah(n)),
              (t.memoizedState = sh),
              e)
            : Gh(t, a))
    );
  if (((o = e.memoizedState), o !== null && ((r = o.dehydrated), r !== null)))
    return KF(e, t, a, i, r, o, n);
  if (s) {
    (s = i.fallback), (a = t.mode), (o = e.child), (r = o.sibling);
    var l = { mode: "hidden", children: i.children };
    return (
      !(1 & a) && t.child !== o
        ? ((i = t.child),
          (i.childLanes = 0),
          (i.pendingProps = l),
          (t.deletions = null))
        : ((i = Rr(o, l)), (i.subtreeFlags = 14680064 & o.subtreeFlags)),
      r !== null ? (s = Rr(r, s)) : ((s = ui(s, a, n, null)), (s.flags |= 2)),
      (s.return = t),
      (i.return = t),
      (i.sibling = s),
      (t.child = i),
      (i = s),
      (s = t.child),
      (a = e.child.memoizedState),
      (a =
        a === null
          ? ah(n)
          : {
              baseLanes: a.baseLanes | n,
              cachePool: null,
              transitions: a.transitions,
            }),
      (s.memoizedState = a),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = sh),
      i
    );
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (i = Rr(s, { mode: "visible", children: i.children })),
    !(1 & t.mode) && (i.lanes = n),
    (i.return = t),
    (i.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = i),
    (t.memoizedState = null),
    i
  );
}
function Gh(e, t) {
  return (
    (t = Tc({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Ll(e, t, n, r) {
  return (
    r !== null && Oh(r),
    po(t, e.child, null, n),
    (e = Gh(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function KF(e, t, n, r, i, o, s) {
  if (n)
    return 256 & t.flags
      ? ((t.flags &= -257), (r = Sd(Error(F(422)))), Ll(e, t, s, r))
      : t.memoizedState !== null
      ? ((t.child = e.child), (t.flags |= 128), null)
      : ((o = r.fallback),
        (i = t.mode),
        (r = Tc({ mode: "visible", children: r.children }, i, 0, null)),
        (o = ui(o, i, s, null)),
        (o.flags |= 2),
        (r.return = t),
        (o.return = t),
        (r.sibling = o),
        (t.child = r),
        1 & t.mode && po(t, e.child, null, s),
        (t.child.memoizedState = ah(s)),
        (t.memoizedState = sh),
        o);
  if (!(1 & t.mode)) return Ll(e, t, s, null);
  if (i.data === "$!") {
    if (((r = i.nextSibling && i.nextSibling.dataset), r)) var a = r.dgst;
    return (r = a), (o = Error(F(419))), (r = Sd(o, r, void 0)), Ll(e, t, s, r);
  }
  if (((a = (s & e.childLanes) !== 0), Rt || a)) {
    if (((r = Ye), r !== null)) {
      switch (s & -s) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      (i = i & (r.suspendedLanes | s) ? 0 : i),
        i !== 0 &&
          i !== o.retryLane &&
          ((o.retryLane = i), Qn(e, i), dn(r, e, i, -1));
    }
    return ep(), (r = Sd(Error(F(421)))), Ll(e, t, s, r);
  }
  return i.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = l_.bind(null, e)),
      (i._reactRetry = t),
      null)
    : ((e = o.treeContext),
      (Dt = Cr(i.nextSibling)),
      (Vt = t),
      (ye = !0),
      (un = null),
      e !== null &&
        ((Kt[qt++] = Xn),
        (Kt[qt++] = Yn),
        (Kt[qt++] = di),
        (Xn = e.id),
        (Yn = e.overflow),
        (di = t)),
      (t = Gh(t, r.children)),
      (t.flags |= 4096),
      t);
}
function j0(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), eh(e.return, t, n);
}
function wd(e, t, n, r, i) {
  var o = e.memoizedState;
  o === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: i,
      })
    : ((o.isBackwards = t),
      (o.rendering = null),
      (o.renderingStartTime = 0),
      (o.last = r),
      (o.tail = n),
      (o.tailMode = i));
}
function Mx(e, t, n) {
  var r = t.pendingProps,
    i = r.revealOrder,
    o = r.tail;
  if ((vt(e, t, r.children, n), (r = Se.current), 2 & r))
    (r = (1 & r) | 2), (t.flags |= 128);
  else {
    if (e !== null && 128 & e.flags)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && j0(e, n, t);
        else if (e.tag === 19) j0(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((ue(Se, r), !(1 & t.mode))) t.memoizedState = null;
  else
    switch (i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          (e = n.alternate),
            e !== null && ac(e) === null && (i = n),
            (n = n.sibling);
        (n = i),
          n === null
            ? ((i = t.child), (t.child = null))
            : ((i = n.sibling), (n.sibling = null)),
          wd(t, !1, i, n, o);
        break;
      case "backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (((e = i.alternate), e !== null && ac(e) === null)) {
            t.child = i;
            break;
          }
          (e = i.sibling), (i.sibling = n), (n = i), (i = e);
        }
        wd(t, !0, n, null, o);
        break;
      case "together":
        wd(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Nl(e, t) {
  !(1 & t.mode) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Zn(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (pi |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(F(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Rr(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = Rr(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function qF(e, t, n) {
  switch (t.tag) {
    case 3:
      _x(t), ho();
      break;
    case 5:
      sx(t);
      break;
    case 1:
      It(t.type) && tc(t);
      break;
    case 4:
      zh(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        i = t.memoizedProps.value;
      ue(ic, r._currentValue), (r._currentValue = i);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (ue(Se, 1 & Se.current), (t.flags |= 128), null)
          : n & t.child.childLanes
          ? Lx(e, t, n)
          : (ue(Se, 1 & Se.current),
            (e = Zn(e, t, n)),
            e !== null ? e.sibling : null);
      ue(Se, 1 & Se.current);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), 128 & e.flags)) {
        if (r) return Mx(e, t, n);
        t.flags |= 128;
      }
      if (
        ((i = t.memoizedState),
        i !== null &&
          ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        ue(Se, Se.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Ix(e, t, n);
  }
  return Zn(e, t, n);
}
var Ox, lh, Ax, Dx;
Ox = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
lh = function () {};
Ax = function (e, t, n, r) {
  var i = e.memoizedProps;
  if (i !== r) {
    (e = t.stateNode), li(In.current);
    var o = null;
    switch (n) {
      case "input":
        (i = Fd(e, i)), (r = Fd(e, r)), (o = []);
        break;
      case "select":
        (i = Ce({}, i, { value: void 0 })),
          (r = Ce({}, r, { value: void 0 })),
          (o = []);
        break;
      case "textarea":
        (i = Md(e, i)), (r = Md(e, r)), (o = []);
        break;
      default:
        typeof i.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Jl);
    }
    Ad(n, r);
    var s;
    n = null;
    for (c in i)
      if (!r.hasOwnProperty(c) && i.hasOwnProperty(c) && i[c] != null)
        if (c === "style") {
          var a = i[c];
          for (s in a) a.hasOwnProperty(s) && (n || (n = {}), (n[s] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (Rs.hasOwnProperty(c)
              ? o || (o = [])
              : (o = o || []).push(c, null));
    for (c in r) {
      var l = r[c];
      if (
        ((a = i?.[c]),
        r.hasOwnProperty(c) && l !== a && (l != null || a != null))
      )
        if (c === "style")
          if (a) {
            for (s in a)
              !a.hasOwnProperty(s) ||
                (l && l.hasOwnProperty(s)) ||
                (n || (n = {}), (n[s] = ""));
            for (s in l)
              l.hasOwnProperty(s) &&
                a[s] !== l[s] &&
                (n || (n = {}), (n[s] = l[s]));
          } else n || (o || (o = []), o.push(c, n)), (n = l);
        else
          c === "dangerouslySetInnerHTML"
            ? ((l = l ? l.__html : void 0),
              (a = a ? a.__html : void 0),
              l != null && a !== l && (o = o || []).push(c, l))
            : c === "children"
            ? (typeof l != "string" && typeof l != "number") ||
              (o = o || []).push(c, "" + l)
            : c !== "suppressContentEditableWarning" &&
              c !== "suppressHydrationWarning" &&
              (Rs.hasOwnProperty(c)
                ? (l != null && c === "onScroll" && pe("scroll", e),
                  o || a === l || (o = []))
                : (o = o || []).push(c, l));
    }
    n && (o = o || []).push("style", n);
    var c = o;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
Dx = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function fs(e, t) {
  if (!ye)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function at(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= 14680064 & i.subtreeFlags),
        (r |= 14680064 & i.flags),
        (i.return = e),
        (i = i.sibling);
  else
    for (i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags),
        (r |= i.flags),
        (i.return = e),
        (i = i.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function QF(e, t, n) {
  var r = t.pendingProps;
  switch ((Mh(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return at(t), null;
    case 1:
      return It(t.type) && ec(), at(t), null;
    case 3:
      return (
        (r = t.stateNode),
        mo(),
        me(Pt),
        me(ct),
        $h(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e !== null && e.child !== null) ||
          (Fl(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(256 & t.flags)) ||
              ((t.flags |= 1024), un !== null && (mh(un), (un = null)))),
        lh(e, t),
        at(t),
        null
      );
    case 5:
      Nh(t);
      var i = li(Hs.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        Ax(e, t, n, r, i),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(F(166));
          return at(t), null;
        }
        if (((e = li(In.current)), Fl(t))) {
          (r = t.stateNode), (n = t.type);
          var o = t.memoizedProps;
          switch (((r[Rn] = t), (r[Vs] = o), (e = (1 & t.mode) !== 0), n)) {
            case "dialog":
              pe("cancel", r), pe("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              pe("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < gs.length; i++) pe(gs[i], r);
              break;
            case "source":
              pe("error", r);
              break;
            case "img":
            case "image":
            case "link":
              pe("error", r), pe("load", r);
              break;
            case "details":
              pe("toggle", r);
              break;
            case "input":
              Qy(r, o), pe("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!o.multiple }),
                pe("invalid", r);
              break;
            case "textarea":
              Jy(r, o), pe("invalid", r);
          }
          Ad(n, o), (i = null);
          for (var s in o)
            if (o.hasOwnProperty(s)) {
              var a = o[s];
              s === "children"
                ? typeof a == "string"
                  ? r.textContent !== a &&
                    (o.suppressHydrationWarning !== !0 &&
                      Il(r.textContent, a, e),
                    (i = ["children", a]))
                  : typeof a == "number" &&
                    r.textContent !== "" + a &&
                    (o.suppressHydrationWarning !== !0 &&
                      Il(r.textContent, a, e),
                    (i = ["children", "" + a]))
                : Rs.hasOwnProperty(s) &&
                  a != null &&
                  s === "onScroll" &&
                  pe("scroll", r);
            }
          switch (n) {
            case "input":
              gl(r), Zy(r, o, !0);
              break;
            case "textarea":
              gl(r), e0(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof o.onClick == "function" && (r.onclick = Jl);
          }
          (r = i), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (s = i.nodeType === 9 ? i : i.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = cb(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = s.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                ? (e = s.createElement(n, { is: r.is }))
                : ((e = s.createElement(n)),
                  n === "select" &&
                    ((s = e),
                    r.multiple
                      ? (s.multiple = !0)
                      : r.size && (s.size = r.size)))
              : (e = s.createElementNS(e, n)),
            (e[Rn] = t),
            (e[Vs] = r),
            Ox(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((s = Dd(n, r)), n)) {
              case "dialog":
                pe("cancel", e), pe("close", e), (i = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                pe("load", e), (i = r);
                break;
              case "video":
              case "audio":
                for (i = 0; i < gs.length; i++) pe(gs[i], e);
                i = r;
                break;
              case "source":
                pe("error", e), (i = r);
                break;
              case "img":
              case "image":
              case "link":
                pe("error", e), pe("load", e), (i = r);
                break;
              case "details":
                pe("toggle", e), (i = r);
                break;
              case "input":
                Qy(e, r), (i = Fd(e, r)), pe("invalid", e);
                break;
              case "option":
                i = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (i = Ce({}, r, { value: void 0 })),
                  pe("invalid", e);
                break;
              case "textarea":
                Jy(e, r), (i = Md(e, r)), pe("invalid", e);
                break;
              default:
                i = r;
            }
            Ad(n, i), (a = i);
            for (o in a)
              if (a.hasOwnProperty(o)) {
                var l = a[o];
                o === "style"
                  ? db(e, l)
                  : o === "dangerouslySetInnerHTML"
                  ? ((l = l ? l.__html : void 0), l != null && ub(e, l))
                  : o === "children"
                  ? typeof l == "string"
                    ? (n !== "textarea" || l !== "") && Ps(e, l)
                    : typeof l == "number" && Ps(e, "" + l)
                  : o !== "suppressContentEditableWarning" &&
                    o !== "suppressHydrationWarning" &&
                    o !== "autoFocus" &&
                    (Rs.hasOwnProperty(o)
                      ? l != null && o === "onScroll" && pe("scroll", e)
                      : l != null && yh(e, o, l, s));
              }
            switch (n) {
              case "input":
                gl(e), Zy(e, r, !1);
                break;
              case "textarea":
                gl(e), e0(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Pr(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (o = r.value),
                  o != null
                    ? io(e, !!r.multiple, o, !1)
                    : r.defaultValue != null &&
                      io(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof i.onClick == "function" && (e.onclick = Jl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return at(t), null;
    case 6:
      if (e && t.stateNode != null) Dx(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(F(166));
        if (((n = li(Hs.current)), li(In.current), Fl(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Rn] = t),
            (o = r.nodeValue !== n) && ((e = Vt), e !== null))
          )
            switch (e.tag) {
              case 3:
                Il(r.nodeValue, n, (1 & e.mode) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Il(r.nodeValue, n, (1 & e.mode) !== 0);
            }
          o && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Rn] = t),
            (t.stateNode = r);
      }
      return at(t), null;
    case 13:
      if (
        (me(Se),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (ye && Dt !== null && 1 & t.mode && !(128 & t.flags))
          Jb(), ho(), (t.flags |= 98560), (o = !1);
        else if (((o = Fl(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!o) throw Error(F(318));
            if (
              ((o = t.memoizedState),
              (o = o !== null ? o.dehydrated : null),
              !o)
            )
              throw Error(F(317));
            o[Rn] = t;
          } else
            ho(), !(128 & t.flags) && (t.memoizedState = null), (t.flags |= 4);
          at(t), (o = !1);
        } else un !== null && (mh(un), (un = null)), (o = !0);
        if (!o) return 65536 & t.flags ? t : null;
      }
      return 128 & t.flags
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            1 & t.mode &&
              (e === null || 1 & Se.current ? je === 0 && (je = 3) : ep())),
          t.updateQueue !== null && (t.flags |= 4),
          at(t),
          null);
    case 4:
      return (
        mo(), lh(e, t), e === null && As(t.stateNode.containerInfo), at(t), null
      );
    case 10:
      return Vh(t.type._context), at(t), null;
    case 17:
      return It(t.type) && ec(), at(t), null;
    case 19:
      if ((me(Se), (o = t.memoizedState), o === null)) return at(t), null;
      if (((r = (128 & t.flags) !== 0), (s = o.rendering), s === null))
        if (r) fs(o, !1);
        else {
          if (je !== 0 || (e !== null && 128 & e.flags))
            for (e = t.child; e !== null; ) {
              if (((s = ac(e)), s !== null)) {
                for (
                  t.flags |= 128,
                    fs(o, !1),
                    r = s.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (o = n),
                    (e = r),
                    (o.flags &= 14680066),
                    (s = o.alternate),
                    s === null
                      ? ((o.childLanes = 0),
                        (o.lanes = e),
                        (o.child = null),
                        (o.subtreeFlags = 0),
                        (o.memoizedProps = null),
                        (o.memoizedState = null),
                        (o.updateQueue = null),
                        (o.dependencies = null),
                        (o.stateNode = null))
                      : ((o.childLanes = s.childLanes),
                        (o.lanes = s.lanes),
                        (o.child = s.child),
                        (o.subtreeFlags = 0),
                        (o.deletions = null),
                        (o.memoizedProps = s.memoizedProps),
                        (o.memoizedState = s.memoizedState),
                        (o.updateQueue = s.updateQueue),
                        (o.type = s.type),
                        (e = s.dependencies),
                        (o.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return ue(Se, (1 & Se.current) | 2), t.child;
              }
              e = e.sibling;
            }
          o.tail !== null &&
            Me() > go &&
            ((t.flags |= 128), (r = !0), fs(o, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = ac(s)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              fs(o, !0),
              o.tail === null && o.tailMode === "hidden" && !s.alternate && !ye)
            )
              return at(t), null;
          } else
            2 * Me() - o.renderingStartTime > go &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), fs(o, !1), (t.lanes = 4194304));
        o.isBackwards
          ? ((s.sibling = t.child), (t.child = s))
          : ((n = o.last),
            n !== null ? (n.sibling = s) : (t.child = s),
            (o.last = s));
      }
      return o.tail !== null
        ? ((t = o.tail),
          (o.rendering = t),
          (o.tail = t.sibling),
          (o.renderingStartTime = Me()),
          (t.sibling = null),
          (n = Se.current),
          ue(Se, r ? (1 & n) | 2 : 1 & n),
          t)
        : (at(t), null);
    case 22:
    case 23:
      return (
        Jh(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && 1 & t.mode
          ? 1073741824 & At && (at(t), 6 & t.subtreeFlags && (t.flags |= 8192))
          : at(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(F(156, t.tag));
}
function ZF(e, t) {
  switch ((Mh(t), t.tag)) {
    case 1:
      return (
        It(t.type) && ec(),
        (e = t.flags),
        65536 & e ? ((t.flags = (-65537 & e) | 128), t) : null
      );
    case 3:
      return (
        mo(),
        me(Pt),
        me(ct),
        $h(),
        (e = t.flags),
        65536 & e && !(128 & e) ? ((t.flags = (-65537 & e) | 128), t) : null
      );
    case 5:
      return Nh(t), null;
    case 13:
      if (
        (me(Se), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(F(340));
        ho();
      }
      return (
        (e = t.flags), 65536 & e ? ((t.flags = (-65537 & e) | 128), t) : null
      );
    case 19:
      return me(Se), null;
    case 4:
      return mo(), null;
    case 10:
      return Vh(t.type._context), null;
    case 22:
    case 23:
      return Jh(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Ml = !1,
  lt = !1,
  JF = typeof WeakSet == "function" ? WeakSet : Set,
  O = null;
function no(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Pe(e, t, r);
      }
    else n.current = null;
}
function Vx(e, t, n) {
  try {
    n();
  } catch (r) {
    Pe(e, t, r);
  }
}
var W0 = !1;
function e_(e, t) {
  if (((Xd = ql), (e = zb()), _h(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || _;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var i = r.anchorOffset,
            o = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, o.nodeType;
          } catch {
            n = null;
            break e;
          }
          var s = 0,
            a = -1,
            l = -1,
            c = 0,
            u = 0,
            f = e,
            d = null;
          t: for (;;) {
            for (
              var h;
              f !== n || (i !== 0 && f.nodeType !== 3) || (a = s + i),
                f !== o || (r !== 0 && f.nodeType !== 3) || (l = s + r),
                f.nodeType === 3 && (s += f.nodeValue.length),
                (h = f.firstChild) !== null;

            )
              (d = f), (f = h);
            for (;;) {
              if (f === e) break t;
              if (
                (d === n && ++c === i && (a = s),
                d === o && ++u === r && (l = s),
                (h = f.nextSibling) !== null)
              )
                break;
              (f = d), (d = f.parentNode);
            }
            f = h;
          }
          n = a === -1 || l === -1 ? null : { start: a, end: l };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Yd = { focusedElem: e, selectionRange: n }, ql = !1, O = t; O !== null; )
    if (((t = O), (e = t.child), (1028 & t.subtreeFlags) !== 0 && e !== null))
      (e.return = t), (O = e);
    else
      for (; O !== null; ) {
        t = O;
        try {
          var g = t.alternate;
          if (1024 & t.flags)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (g !== null) {
                  var y = g.memoizedProps,
                    S = g.memoizedState,
                    p = t.stateNode,
                    m = p.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? y : ln(t.type, y),
                      S
                    );
                  p.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var v = t.stateNode.containerInfo;
                v.nodeType === 1
                  ? (v.textContent = "")
                  : v.nodeType === 9 &&
                    v.documentElement &&
                    v.removeChild(v.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(F(163));
            }
        } catch (x) {
          Pe(t, t.return, x);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (O = e);
          break;
        }
        O = t.return;
      }
  return (g = W0), (W0 = !1), g;
}
function ks(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next);
    do {
      if ((i.tag & e) === e) {
        var o = i.destroy;
        (i.destroy = void 0), o !== void 0 && Vx(t, n, o);
      }
      i = i.next;
    } while (i !== r);
  }
}
function Cc(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function ch(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Bx(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), Bx(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Rn], delete t[Vs], delete t[qd], delete t[DF], delete t[VF])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function Hx(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function U0(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Hx(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (2 & e.flags || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(2 & e.flags)) return e.stateNode;
  }
}
function uh(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = Jl));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (uh(e, t, n), e = e.sibling; e !== null; ) uh(e, t, n), (e = e.sibling);
}
function fh(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (fh(e, t, n), e = e.sibling; e !== null; ) fh(e, t, n), (e = e.sibling);
}
var Ze = null,
  cn = !1;
function hr(e, t, n) {
  for (n = n.child; n !== null; ) zx(e, t, n), (n = n.sibling);
}
function zx(e, t, n) {
  if (Pn && typeof Pn.onCommitFiberUnmount == "function")
    try {
      Pn.onCommitFiberUnmount(mc, n);
    } catch {}
  switch (n.tag) {
    case 5:
      lt || no(n, t);
    case 6:
      var r = Ze,
        i = cn;
      (Ze = null),
        hr(e, t, n),
        (Ze = r),
        (cn = i),
        Ze !== null &&
          (cn
            ? ((e = Ze),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Ze.removeChild(n.stateNode));
      break;
    case 18:
      Ze !== null &&
        (cn
          ? ((e = Ze),
            (n = n.stateNode),
            e.nodeType === 8
              ? md(e.parentNode, n)
              : e.nodeType === 1 && md(e, n),
            Ls(e))
          : md(Ze, n.stateNode));
      break;
    case 4:
      (r = Ze),
        (i = cn),
        (Ze = n.stateNode.containerInfo),
        (cn = !0),
        hr(e, t, n),
        (Ze = r),
        (cn = i);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !lt &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        i = r = r.next;
        do {
          var o = i,
            s = o.destroy;
          (o = o.tag),
            s !== void 0 && (2 & o || 4 & o) && Vx(n, t, s),
            (i = i.next);
        } while (i !== r);
      }
      hr(e, t, n);
      break;
    case 1:
      if (
        !lt &&
        (no(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (a) {
          Pe(n, t, a);
        }
      hr(e, t, n);
      break;
    case 21:
      hr(e, t, n);
      break;
    case 22:
      1 & n.mode
        ? ((lt = (r = lt) || n.memoizedState !== null), hr(e, t, n), (lt = r))
        : hr(e, t, n);
      break;
    default:
      hr(e, t, n);
  }
}
function X0(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new JF()),
      t.forEach(function (r) {
        var i = c_.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(i, i));
      });
  }
}
function an(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r];
      try {
        var o = e,
          s = t,
          a = s;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              (Ze = a.stateNode), (cn = !1);
              break e;
            case 3:
              (Ze = a.stateNode.containerInfo), (cn = !0);
              break e;
            case 4:
              (Ze = a.stateNode.containerInfo), (cn = !0);
              break e;
          }
          a = a.return;
        }
        if (Ze === null) throw Error(F(160));
        zx(o, s, i), (Ze = null), (cn = !1);
        var l = i.alternate;
        l !== null && (l.return = null), (i.return = null);
      } catch (c) {
        Pe(i, t, c);
      }
    }
  if (12854 & t.subtreeFlags)
    for (t = t.child; t !== null; ) Nx(t, e), (t = t.sibling);
}
function Nx(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((an(t, e), Tn(e), 4 & r)) {
        try {
          ks(3, e, e.return), Cc(3, e);
        } catch (y) {
          Pe(e, e.return, y);
        }
        try {
          ks(5, e, e.return);
        } catch (y) {
          Pe(e, e.return, y);
        }
      }
      break;
    case 1:
      an(t, e), Tn(e), 512 & r && n !== null && no(n, n.return);
      break;
    case 5:
      if (
        (an(t, e),
        Tn(e),
        512 & r && n !== null && no(n, n.return),
        32 & e.flags)
      ) {
        var i = e.stateNode;
        try {
          Ps(i, "");
        } catch (y) {
          Pe(e, e.return, y);
        }
      }
      if (4 & r && ((i = e.stateNode), i != null)) {
        var o = e.memoizedProps,
          s = n !== null ? n.memoizedProps : o,
          a = e.type,
          l = e.updateQueue;
        if (((e.updateQueue = null), l !== null))
          try {
            a === "input" && o.type === "radio" && o.name != null && ab(i, o),
              Dd(a, s);
            var c = Dd(a, o);
            for (s = 0; s < l.length; s += 2) {
              var u = l[s],
                f = l[s + 1];
              u === "style"
                ? db(i, f)
                : u === "dangerouslySetInnerHTML"
                ? ub(i, f)
                : u === "children"
                ? Ps(i, f)
                : yh(i, u, f, c);
            }
            switch (a) {
              case "input":
                _d(i, o);
                break;
              case "textarea":
                lb(i, o);
                break;
              case "select":
                var d = i._wrapperState.wasMultiple;
                i._wrapperState.wasMultiple = !!o.multiple;
                var h = o.value;
                h != null
                  ? io(i, !!o.multiple, h, !1)
                  : d !== !!o.multiple &&
                    (o.defaultValue != null
                      ? io(i, !!o.multiple, o.defaultValue, !0)
                      : io(i, !!o.multiple, o.multiple ? [] : "", !1));
            }
            i[Vs] = o;
          } catch (y) {
            Pe(e, e.return, y);
          }
      }
      break;
    case 6:
      if ((an(t, e), Tn(e), 4 & r)) {
        if (e.stateNode === null) throw Error(F(162));
        (i = e.stateNode), (o = e.memoizedProps);
        try {
          i.nodeValue = o;
        } catch (y) {
          Pe(e, e.return, y);
        }
      }
      break;
    case 3:
      if (
        (an(t, e), Tn(e), 4 & r && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Ls(t.containerInfo);
        } catch (y) {
          Pe(e, e.return, y);
        }
      break;
    case 4:
      an(t, e), Tn(e);
      break;
    case 13:
      an(t, e),
        Tn(e),
        (i = e.child),
        8192 & i.flags &&
          ((o = i.memoizedState !== null),
          (i.stateNode.isHidden = o),
          !o ||
            (i.alternate !== null && i.alternate.memoizedState !== null) ||
            (Qh = Me())),
        4 & r && X0(e);
      break;
    case 22:
      if (
        ((u = n !== null && n.memoizedState !== null),
        1 & e.mode ? ((lt = (c = lt) || u), an(t, e), (lt = c)) : an(t, e),
        Tn(e),
        8192 & r)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !u && 1 & e.mode)
        )
          for (O = e, u = e.child; u !== null; ) {
            for (f = O = u; O !== null; ) {
              switch (((d = O), (h = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ks(4, d, d.return);
                  break;
                case 1:
                  no(d, d.return);
                  var g = d.stateNode;
                  if (typeof g.componentWillUnmount == "function") {
                    (r = d), (n = d.return);
                    try {
                      (t = r),
                        (g.props = t.memoizedProps),
                        (g.state = t.memoizedState),
                        g.componentWillUnmount();
                    } catch (y) {
                      Pe(r, n, y);
                    }
                  }
                  break;
                case 5:
                  no(d, d.return);
                  break;
                case 22:
                  if (d.memoizedState !== null) {
                    G0(f);
                    continue;
                  }
              }
              h !== null ? ((h.return = d), (O = h)) : G0(f);
            }
            u = u.sibling;
          }
        e: for (u = null, f = e; ; ) {
          if (f.tag === 5) {
            if (u === null) {
              u = f;
              try {
                (i = f.stateNode),
                  c
                    ? ((o = i.style),
                      typeof o.setProperty == "function"
                        ? o.setProperty("display", "none", "important")
                        : (o.display = "none"))
                    : ((a = f.stateNode),
                      (l = f.memoizedProps.style),
                      (s =
                        l != null && l.hasOwnProperty("display")
                          ? l.display
                          : null),
                      (a.style.display = fb("display", s)));
              } catch (y) {
                Pe(e, e.return, y);
              }
            }
          } else if (f.tag === 6) {
            if (u === null)
              try {
                f.stateNode.nodeValue = c ? "" : f.memoizedProps;
              } catch (y) {
                Pe(e, e.return, y);
              }
          } else if (
            ((f.tag !== 22 && f.tag !== 23) ||
              f.memoizedState === null ||
              f === e) &&
            f.child !== null
          ) {
            (f.child.return = f), (f = f.child);
            continue;
          }
          if (f === e) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === e) break e;
            u === f && (u = null), (f = f.return);
          }
          u === f && (u = null), (f.sibling.return = f.return), (f = f.sibling);
        }
      }
      break;
    case 19:
      an(t, e), Tn(e), 4 & r && X0(e);
      break;
    case 21:
      break;
    default:
      an(t, e), Tn(e);
  }
}
function Tn(e) {
  var t = e.flags;
  if (2 & t) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Hx(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(F(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          32 & r.flags && (Ps(i, ""), (r.flags &= -33));
          var o = U0(e);
          fh(e, o, i);
          break;
        case 3:
        case 4:
          var s = r.stateNode.containerInfo,
            a = U0(e);
          uh(e, a, s);
          break;
        default:
          throw Error(F(161));
      }
    } catch (l) {
      Pe(e, e.return, l);
    }
    e.flags &= -3;
  }
  4096 & t && (e.flags &= -4097);
}
function t_(e, t, n) {
  (O = e), $x(e, t, n);
}
function $x(e, t, n) {
  for (var r = (1 & e.mode) !== 0; O !== null; ) {
    var i = O,
      o = i.child;
    if (i.tag === 22 && r) {
      var s = i.memoizedState !== null || Ml;
      if (!s) {
        var a = i.alternate,
          l = (a !== null && a.memoizedState !== null) || lt;
        a = Ml;
        var c = lt;
        if (((Ml = s), (lt = l) && !c))
          for (O = i; O !== null; )
            (s = O),
              (l = s.child),
              s.tag === 22 && s.memoizedState !== null
                ? K0(i)
                : l !== null
                ? ((l.return = s), (O = l))
                : K0(i);
        for (; o !== null; ) (O = o), $x(o, t, n), (o = o.sibling);
        (O = i), (Ml = a), (lt = c);
      }
      Y0(e, t, n);
    } else
      8772 & i.subtreeFlags && o !== null
        ? ((o.return = i), (O = o))
        : Y0(e, t, n);
  }
}
function Y0(e) {
  for (; O !== null; ) {
    var t = O;
    if (8772 & t.flags) {
      var n = t.alternate;
      try {
        if (8772 & t.flags)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              lt || Cc(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (4 & t.flags && !lt)
                if (n === null) r.componentDidMount();
                else {
                  var i =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : ln(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    i,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var o = t.updateQueue;
              o !== null && F0(t, o, r);
              break;
            case 3:
              var s = t.updateQueue;
              if (s !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                F0(t, s, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && 4 & t.flags) {
                n = a;
                var l = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    l.autoFocus && n.focus();
                    break;
                  case "img":
                    l.src && (n.src = l.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var u = c.memoizedState;
                  if (u !== null) {
                    var f = u.dehydrated;
                    f !== null && Ls(f);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(F(163));
          }
        lt || (512 & t.flags && ch(t));
      } catch (d) {
        Pe(t, t.return, d);
      }
    }
    if (t === e) {
      O = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (O = n);
      break;
    }
    O = t.return;
  }
}
function G0(e) {
  for (; O !== null; ) {
    var t = O;
    if (t === e) {
      O = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (O = n);
      break;
    }
    O = t.return;
  }
}
function K0(e) {
  for (; O !== null; ) {
    var t = O;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Cc(4, t);
          } catch (l) {
            Pe(t, n, l);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = t.return;
            try {
              r.componentDidMount();
            } catch (l) {
              Pe(t, i, l);
            }
          }
          var o = t.return;
          try {
            ch(t);
          } catch (l) {
            Pe(t, o, l);
          }
          break;
        case 5:
          var s = t.return;
          try {
            ch(t);
          } catch (l) {
            Pe(t, s, l);
          }
      }
    } catch (l) {
      Pe(t, t.return, l);
    }
    if (t === e) {
      O = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      (a.return = t.return), (O = a);
      break;
    }
    O = t.return;
  }
}
var n_ = Math.ceil,
  uc = Jn.ReactCurrentDispatcher,
  Kh = Jn.ReactCurrentOwner,
  Zt = Jn.ReactCurrentBatchConfig,
  re = 0,
  Ye = null,
  Be = null,
  Je = 0,
  At = 0,
  ro = _r(0),
  je = 0,
  js = null,
  pi = 0,
  kc = 0,
  qh = 0,
  Ts = null,
  Et = null,
  Qh = 0,
  go = 1 / 0,
  Wn = null,
  fc = !1,
  dh = null,
  Tr = null,
  Ol = !1,
  br = null,
  dc = 0,
  Es = 0,
  hh = null,
  $l = -1,
  jl = 0;
function gt() {
  return 6 & re ? Me() : $l !== -1 ? $l : ($l = Me());
}
function Er(e) {
  return 1 & e.mode
    ? 2 & re && Je !== 0
      ? Je & -Je
      : HF.transition !== null
      ? (jl === 0 && (jl = kb()), jl)
      : ((e = se),
        e !== 0 || ((e = _.event), (e = e === void 0 ? 16 : _b(e.type))),
        e)
    : 1;
}
function dn(e, t, n, r) {
  if (50 < Es) throw ((Es = 0), (hh = null), Error(F(185)));
  Ws(e, n, r),
    (2 & re && e === Ye) ||
      (e === Ye && (!(2 & re) && (kc |= n), je === 4 && gr(e, Je)),
      Ft(e, r),
      n === 1 && re === 0 && !(1 & t.mode) && ((go = Me() + 500), xc && Lr()));
}
function Ft(e, t) {
  var n = e.callbackNode;
  NI(e, t);
  var r = Kl(e, e === Ye ? Je : 0);
  if (r === 0)
    n !== null && r0(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && r0(n), t === 1))
      e.tag === 0 ? BF(q0.bind(null, e)) : qb(q0.bind(null, e)),
        OF(function () {
          !(6 & re) && Lr();
        }),
        (n = null);
    else {
      switch (Tb(r)) {
        case 1:
          n = Ch;
          break;
        case 4:
          n = wb;
          break;
        case 16:
          n = Gl;
          break;
        case 536870912:
          n = Cb;
          break;
        default:
          n = Gl;
      }
      n = qx(n, jx.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function jx(e, t) {
  if ((($l = -1), (jl = 0), 6 & re)) throw Error(F(327));
  var n = e.callbackNode;
  if (co() && e.callbackNode !== n) return null;
  var r = Kl(e, e === Ye ? Je : 0);
  if (r === 0) return null;
  if (30 & r || r & e.expiredLanes || t) t = hc(e, r);
  else {
    t = r;
    var i = re;
    re |= 2;
    var o = Ux();
    (Ye === e && Je === t) || ((Wn = null), (go = Me() + 500), ci(e, t));
    do
      try {
        o_();
        break;
      } catch (a) {
        Wx(e, a);
      }
    while (1);
    Dh(),
      (uc.current = o),
      (re = i),
      Be !== null ? (t = 0) : ((Ye = null), (Je = 0), (t = je));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((i = Nd(e)), i !== 0 && ((r = i), (t = ph(e, i)))), t === 1)
    )
      throw ((n = js), ci(e, 0), gr(e, r), Ft(e, Me()), n);
    if (t === 6) gr(e, r);
    else {
      if (
        ((i = e.current.alternate),
        !(30 & r) &&
          !r_(i) &&
          ((t = hc(e, r)),
          t === 2 && ((o = Nd(e)), o !== 0 && ((r = o), (t = ph(e, o)))),
          t === 1))
      )
        throw ((n = js), ci(e, 0), gr(e, r), Ft(e, Me()), n);
      switch (((e.finishedWork = i), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(F(345));
        case 2:
          oi(e, Et, Wn);
          break;
        case 3:
          if (
            (gr(e, r), (130023424 & r) === r && ((t = Qh + 500 - Me()), 10 < t))
          ) {
            if (Kl(e, 0) !== 0) break;
            if (((i = e.suspendedLanes), (i & r) !== r)) {
              gt(), (e.pingedLanes |= e.suspendedLanes & i);
              break;
            }
            e.timeoutHandle = Kd(oi.bind(null, e, Et, Wn), t);
            break;
          }
          oi(e, Et, Wn);
          break;
        case 4:
          if ((gr(e, r), (4194240 & r) === r)) break;
          for (t = e.eventTimes, i = -1; 0 < r; ) {
            var s = 31 - fn(r);
            (o = 1 << s), (s = t[s]), s > i && (i = s), (r &= ~o);
          }
          if (
            ((r = i),
            (r = Me() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * n_(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Kd(oi.bind(null, e, Et, Wn), r);
            break;
          }
          oi(e, Et, Wn);
          break;
        case 5:
          oi(e, Et, Wn);
          break;
        default:
          throw Error(F(329));
      }
    }
  }
  return Ft(e, Me()), e.callbackNode === n ? jx.bind(null, e) : null;
}
function ph(e, t) {
  var n = Ts;
  return (
    e.current.memoizedState.isDehydrated && (ci(e, t).flags |= 256),
    (e = hc(e, t)),
    e !== 2 && ((t = Et), (Et = n), t !== null && mh(t)),
    e
  );
}
function mh(e) {
  Et === null ? (Et = e) : Et.push.apply(Et, e);
}
function r_(e) {
  for (var t = e; ; ) {
    if (16384 & t.flags) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            o = i.getSnapshot;
          i = i.value;
          try {
            if (!hn(o(), i)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), 16384 & t.subtreeFlags && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function gr(e, t) {
  for (
    t &= ~qh,
      t &= ~kc,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - fn(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function q0(e) {
  if (6 & re) throw Error(F(327));
  co();
  var t = Kl(e, 0);
  if (!(1 & t)) return Ft(e, Me()), null;
  var n = hc(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Nd(e);
    r !== 0 && ((t = r), (n = ph(e, r)));
  }
  if (n === 1) throw ((n = js), ci(e, 0), gr(e, t), Ft(e, Me()), n);
  if (n === 6) throw Error(F(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    oi(e, Et, Wn),
    Ft(e, Me()),
    null
  );
}
function Zh(e, t) {
  var n = re;
  re |= 1;
  try {
    return e(t);
  } finally {
    (re = n), re === 0 && ((go = Me() + 500), xc && Lr());
  }
}
function mi(e) {
  br !== null && br.tag === 0 && !(6 & re) && co();
  var t = re;
  re |= 1;
  var n = Zt.transition,
    r = se;
  try {
    if (((Zt.transition = null), (se = 1), e)) return e();
  } finally {
    (se = r), (Zt.transition = n), (re = t), !(6 & re) && Lr();
  }
}
function Jh() {
  (At = ro.current), me(ro);
}
function ci(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), MF(n)), Be !== null))
    for (n = Be.return; n !== null; ) {
      var r = n;
      switch ((Mh(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && ec();
          break;
        case 3:
          mo(), me(Pt), me(ct), $h();
          break;
        case 5:
          Nh(r);
          break;
        case 4:
          mo();
          break;
        case 13:
          me(Se);
          break;
        case 19:
          me(Se);
          break;
        case 10:
          Vh(r.type._context);
          break;
        case 22:
        case 23:
          Jh();
      }
      n = n.return;
    }
  if (
    ((Ye = e),
    (Be = e = Rr(e.current, null)),
    (Je = At = t),
    (je = 0),
    (js = null),
    (qh = kc = pi = 0),
    (Et = Ts = null),
    ai !== null)
  ) {
    for (t = 0; t < ai.length; t++)
      if (((n = ai[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var i = r.next,
          o = n.pending;
        if (o !== null) {
          var s = o.next;
          (o.next = i), (r.next = s);
        }
        n.pending = r;
      }
    ai = null;
  }
  return e;
}
function Wx(e, t) {
  do {
    var n = Be;
    try {
      if ((Dh(), (Hl.current = cc), lc)) {
        for (var r = we.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), (r = r.next);
        }
        lc = !1;
      }
      if (
        ((hi = 0),
        (Xe = $e = we = null),
        (Cs = !1),
        (zs = 0),
        (Kh.current = null),
        n === null || n.return === null)
      ) {
        (je = 1), (js = t), (Be = null);
        break;
      }
      e: {
        var o = e,
          s = n.return,
          a = n,
          l = t;
        if (
          ((t = Je),
          (a.flags |= 32768),
          l !== null && typeof l == "object" && typeof l.then == "function")
        ) {
          var c = l,
            u = a,
            f = u.tag;
          if (!(1 & u.mode) && (f === 0 || f === 11 || f === 15)) {
            var d = u.alternate;
            d
              ? ((u.updateQueue = d.updateQueue),
                (u.memoizedState = d.memoizedState),
                (u.lanes = d.lanes))
              : ((u.updateQueue = null), (u.memoizedState = null));
          }
          var h = V0(s);
          if (h !== null) {
            (h.flags &= -257),
              B0(h, s, a, o, t),
              1 & h.mode && D0(o, c, t),
              (t = h),
              (l = c);
            var g = t.updateQueue;
            if (g === null) {
              var y = new Set();
              y.add(l), (t.updateQueue = y);
            } else g.add(l);
            break e;
          }
          if (!(1 & t)) {
            D0(o, c, t), ep();
            break e;
          }
          l = Error(F(426));
        } else if (ye && 1 & a.mode) {
          var S = V0(s);
          if (S !== null) {
            !(65536 & S.flags) && (S.flags |= 256),
              B0(S, s, a, o, t),
              Oh(vo(l, a));
            break e;
          }
        }
        (o = l = vo(l, a)),
          je !== 4 && (je = 2),
          Ts === null ? (Ts = [o]) : Ts.push(o),
          (o = s);
        do {
          switch (o.tag) {
            case 3:
              (o.flags |= 65536), (t &= -t), (o.lanes |= t);
              var p = Ex(o, l, t);
              I0(o, p);
              break e;
            case 1:
              a = l;
              var m = o.type,
                v = o.stateNode;
              if (
                !(128 & o.flags) &&
                (typeof m.getDerivedStateFromError == "function" ||
                  (v !== null &&
                    typeof v.componentDidCatch == "function" &&
                    (Tr === null || !Tr.has(v))))
              ) {
                (o.flags |= 65536), (t &= -t), (o.lanes |= t);
                var x = Rx(o, a, t);
                I0(o, x);
                break e;
              }
          }
          o = o.return;
        } while (o !== null);
      }
      Yx(n);
    } catch (C) {
      (t = C), Be === n && n !== null && (Be = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Ux() {
  var e = uc.current;
  return (uc.current = cc), e === null ? cc : e;
}
function ep() {
  (je !== 0 && je !== 3 && je !== 2) || (je = 4),
    Ye === null || (!(268435455 & pi) && !(268435455 & kc)) || gr(Ye, Je);
}
function hc(e, t) {
  var n = re;
  re |= 2;
  var r = Ux();
  (Ye === e && Je === t) || ((Wn = null), ci(e, t));
  do
    try {
      i_();
      break;
    } catch (i) {
      Wx(e, i);
    }
  while (1);
  if ((Dh(), (re = n), (uc.current = r), Be !== null)) throw Error(F(261));
  return (Ye = null), (Je = 0), je;
}
function i_() {
  for (; Be !== null; ) Xx(Be);
}
function o_() {
  for (; Be !== null && !LI(); ) Xx(Be);
}
function Xx(e) {
  var t = Kx(e.alternate, e, At);
  (e.memoizedProps = e.pendingProps),
    t === null ? Yx(e) : (Be = t),
    (Kh.current = null);
}
function Yx(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), 32768 & t.flags)) {
      if (((n = ZF(n, t)), n !== null)) {
        (n.flags &= 32767), (Be = n);
        return;
      }
      if (e === null) {
        (je = 6), (Be = null);
        return;
      }
      (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
    } else if (((n = QF(n, t, At)), n !== null)) {
      Be = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      Be = t;
      return;
    }
    Be = t = e;
  } while (t !== null);
  je === 0 && (je = 5);
}
function oi(e, t, n) {
  var r = se,
    i = Zt.transition;
  try {
    (Zt.transition = null), (se = 1), s_(e, t, n, r);
  } finally {
    (Zt.transition = i), (se = r);
  }
  return null;
}
function s_(e, t, n, r) {
  do co();
  while (br !== null);
  if (6 & re) throw Error(F(327));
  n = e.finishedWork;
  var i = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(F(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var o = n.lanes | n.childLanes;
  if (
    ($I(e, o),
    e === Ye && ((Be = Ye = null), (Je = 0)),
    (!(2064 & n.subtreeFlags) && !(2064 & n.flags)) ||
      Ol ||
      ((Ol = !0),
      qx(Gl, function () {
        return co(), null;
      })),
    (o = (15990 & n.flags) !== 0),
    15990 & n.subtreeFlags || o)
  ) {
    (o = Zt.transition), (Zt.transition = null);
    var s = se;
    se = 1;
    var a = re;
    (re |= 4),
      (Kh.current = null),
      e_(e, n),
      Nx(n, e),
      PF(Yd),
      (ql = !!Xd),
      (Yd = Xd = null),
      (e.current = n),
      t_(n, e, i),
      MI(),
      (re = a),
      (se = s),
      (Zt.transition = o);
  } else e.current = n;
  if (
    (Ol && ((Ol = !1), (br = e), (dc = i)),
    (o = e.pendingLanes),
    o === 0 && (Tr = null),
    DI(n.stateNode, r),
    Ft(e, Me()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (i = t[n]), r(i.value, { componentStack: i.stack, digest: i.digest });
  if (fc) throw ((fc = !1), (e = dh), (dh = null), e);
  return (
    1 & dc && e.tag !== 0 && co(),
    (o = e.pendingLanes),
    1 & o ? (e === hh ? Es++ : ((Es = 0), (hh = e))) : (Es = 0),
    Lr(),
    null
  );
}
function co() {
  if (br !== null) {
    var e = Tb(dc),
      t = Zt.transition,
      n = se;
    try {
      if (((Zt.transition = null), (se = 16 > e ? 16 : e), br === null))
        var r = !1;
      else {
        if (((e = br), (br = null), (dc = 0), 6 & re)) throw Error(F(331));
        var i = re;
        for (re |= 4, O = e.current; O !== null; ) {
          var o = O,
            s = o.child;
          if (16 & O.flags) {
            var a = o.deletions;
            if (a !== null) {
              for (var l = 0; l < a.length; l++) {
                var c = a[l];
                for (O = c; O !== null; ) {
                  var u = O;
                  switch (u.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ks(8, u, o);
                  }
                  var f = u.child;
                  if (f !== null) (f.return = u), (O = f);
                  else
                    for (; O !== null; ) {
                      u = O;
                      var d = u.sibling,
                        h = u.return;
                      if ((Bx(u), u === c)) {
                        O = null;
                        break;
                      }
                      if (d !== null) {
                        (d.return = h), (O = d);
                        break;
                      }
                      O = h;
                    }
                }
              }
              var g = o.alternate;
              if (g !== null) {
                var y = g.child;
                if (y !== null) {
                  g.child = null;
                  do {
                    var S = y.sibling;
                    (y.sibling = null), (y = S);
                  } while (y !== null);
                }
              }
              O = o;
            }
          }
          if (2064 & o.subtreeFlags && s !== null) (s.return = o), (O = s);
          else
            e: for (; O !== null; ) {
              if (((o = O), 2048 & o.flags))
                switch (o.tag) {
                  case 0:
                  case 11:
                  case 15:
                    ks(9, o, o.return);
                }
              var p = o.sibling;
              if (p !== null) {
                (p.return = o.return), (O = p);
                break e;
              }
              O = o.return;
            }
        }
        var m = e.current;
        for (O = m; O !== null; ) {
          s = O;
          var v = s.child;
          if (2064 & s.subtreeFlags && v !== null) (v.return = s), (O = v);
          else
            e: for (s = m; O !== null; ) {
              if (((a = O), 2048 & a.flags))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Cc(9, a);
                  }
                } catch (C) {
                  Pe(a, a.return, C);
                }
              if (a === s) {
                O = null;
                break e;
              }
              var x = a.sibling;
              if (x !== null) {
                (x.return = a.return), (O = x);
                break e;
              }
              O = a.return;
            }
        }
        if (
          ((re = i), Lr(), Pn && typeof Pn.onPostCommitFiberRoot == "function")
        )
          try {
            Pn.onPostCommitFiberRoot(mc, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (se = n), (Zt.transition = t);
    }
  }
  return !1;
}
function Q0(e, t, n) {
  (t = vo(n, t)),
    (t = Ex(e, t, 1)),
    (e = kr(e, t, 1)),
    (t = gt()),
    e !== null && (Ws(e, 1, t), Ft(e, t));
}
function Pe(e, t, n) {
  if (e.tag === 3) Q0(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Q0(t, e, n);
        break;
      }
      if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Tr === null || !Tr.has(r)))
        ) {
          (e = vo(n, e)),
            (e = Rx(t, e, 1)),
            (t = kr(t, e, 1)),
            (e = gt()),
            t !== null && (Ws(t, 1, e), Ft(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function a_(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = gt()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Ye === e &&
      (Je & n) === n &&
      (je === 4 || (je === 3 && (130023424 & Je) === Je && 500 > Me() - Qh)
        ? ci(e, 0)
        : (qh |= n)),
    Ft(e, t);
}
function Gx(e, t) {
  t === 0 &&
    (1 & e.mode
      ? ((t = xl), (xl <<= 1), !(130023424 & xl) && (xl = 4194304))
      : (t = 1));
  var n = gt();
  (e = Qn(e, t)), e !== null && (Ws(e, t, n), Ft(e, n));
}
function l_(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), Gx(e, n);
}
function c_(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        i = e.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(F(314));
  }
  r !== null && r.delete(t), Gx(e, n);
}
var Kx;
Kx = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Pt.current) Rt = !0;
    else {
      if (!(e.lanes & n) && !(128 & t.flags)) return (Rt = !1), qF(e, t, n);
      Rt = (131072 & e.flags) !== 0;
    }
  else (Rt = !1), ye && 1048576 & t.flags && Qb(t, rc, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      Nl(e, t), (e = t.pendingProps);
      var i = fo(t, ct.current);
      lo(t, n), (i = Wh(null, t, r, e, i, n));
      var o = Uh();
      return (
        (t.flags |= 1),
        typeof i == "object" &&
        i !== null &&
        typeof i.render == "function" &&
        i.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            It(r) ? ((o = !0), tc(t)) : (o = !1),
            (t.memoizedState =
              i.state !== null && i.state !== void 0 ? i.state : null),
            Hh(t),
            (i.updater = Sc),
            (t.stateNode = i),
            (i._reactInternals = t),
            nh(t, r, e, n),
            (t = oh(null, t, r, !0, o, n)))
          : ((t.tag = 0), ye && o && Lh(t), vt(null, t, i, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Nl(e, t),
          (e = t.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (t.type = r),
          (i = t.tag = f_(r)),
          (e = ln(r, e)),
          i)
        ) {
          case 0:
            t = ih(null, t, r, e, n);
            break e;
          case 1:
            t = N0(null, t, r, e, n);
            break e;
          case 11:
            t = H0(null, t, r, e, n);
            break e;
          case 14:
            t = z0(null, t, r, ln(r.type, e), n);
            break e;
        }
        throw Error(F(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ln(r, i)),
        ih(e, t, r, i, n)
      );
    case 1:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ln(r, i)),
        N0(e, t, r, i, n)
      );
    case 3:
      e: {
        if ((_x(t), e === null)) throw Error(F(387));
        (r = t.pendingProps),
          (o = t.memoizedState),
          (i = o.element),
          tx(e, t),
          sc(t, r, null, n);
        var s = t.memoizedState;
        if (((r = s.element), o.isDehydrated)) {
          if (
            ((o = {
              element: r,
              isDehydrated: !1,
              cache: s.cache,
              pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
              transitions: s.transitions,
            }),
            (t.updateQueue.baseState = o),
            (t.memoizedState = o),
            256 & t.flags)
          ) {
            (i = vo(Error(F(423)), t)), (t = $0(e, t, r, n, i));
            break e;
          }
          if (r !== i) {
            (i = vo(Error(F(424)), t)), (t = $0(e, t, r, n, i));
            break e;
          }
          for (
            Dt = Cr(t.stateNode.containerInfo.firstChild),
              Vt = t,
              ye = !0,
              un = null,
              n = ox(t, null, r, n),
              t.child = n;
            n;

          )
            (n.flags = (-3 & n.flags) | 4096), (n = n.sibling);
        } else {
          if ((ho(), r === i)) {
            t = Zn(e, t, n);
            break e;
          }
          vt(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        sx(t),
        e === null && Jd(t),
        (r = t.type),
        (i = t.pendingProps),
        (o = e !== null ? e.memoizedProps : null),
        (s = i.children),
        Gd(r, i) ? (s = null) : o !== null && Gd(r, o) && (t.flags |= 32),
        Fx(e, t),
        vt(e, t, s, n),
        t.child
      );
    case 6:
      return e === null && Jd(t), null;
    case 13:
      return Lx(e, t, n);
    case 4:
      return (
        zh(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = po(t, null, r, n)) : vt(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ln(r, i)),
        H0(e, t, r, i, n)
      );
    case 7:
      return vt(e, t, t.pendingProps, n), t.child;
    case 8:
      return vt(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return vt(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (i = t.pendingProps),
          (o = t.memoizedProps),
          (s = i.value),
          ue(ic, r._currentValue),
          (r._currentValue = s),
          o !== null)
        )
          if (hn(o.value, s)) {
            if (o.children === i.children && !Pt.current) {
              t = Zn(e, t, n);
              break e;
            }
          } else
            for (o = t.child, o !== null && (o.return = t); o !== null; ) {
              var a = o.dependencies;
              if (a !== null) {
                s = o.child;
                for (var l = a.firstContext; l !== null; ) {
                  if (l.context === r) {
                    if (o.tag === 1) {
                      (l = Gn(-1, n & -n)), (l.tag = 2);
                      var c = o.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var u = c.pending;
                        u === null
                          ? (l.next = l)
                          : ((l.next = u.next), (u.next = l)),
                          (c.pending = l);
                      }
                    }
                    (o.lanes |= n),
                      (l = o.alternate),
                      l !== null && (l.lanes |= n),
                      eh(o.return, n, t),
                      (a.lanes |= n);
                    break;
                  }
                  l = l.next;
                }
              } else if (o.tag === 10) s = o.type === t.type ? null : o.child;
              else if (o.tag === 18) {
                if (((s = o.return), s === null)) throw Error(F(341));
                (s.lanes |= n),
                  (a = s.alternate),
                  a !== null && (a.lanes |= n),
                  eh(s, n, t),
                  (s = o.sibling);
              } else s = o.child;
              if (s !== null) s.return = o;
              else
                for (s = o; s !== null; ) {
                  if (s === t) {
                    s = null;
                    break;
                  }
                  if (((o = s.sibling), o !== null)) {
                    (o.return = s.return), (s = o);
                    break;
                  }
                  s = s.return;
                }
              o = s;
            }
        vt(e, t, i.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (i = t.type),
        (r = t.pendingProps.children),
        lo(t, n),
        (i = Jt(i)),
        (r = r(i)),
        (t.flags |= 1),
        vt(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (i = ln(r, t.pendingProps)),
        (i = ln(r.type, i)),
        z0(e, t, r, i, n)
      );
    case 15:
      return Px(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ln(r, i)),
        Nl(e, t),
        (t.tag = 1),
        It(r) ? ((e = !0), tc(t)) : (e = !1),
        lo(t, n),
        rx(t, r, i),
        nh(t, r, i, n),
        oh(null, t, r, !0, e, n)
      );
    case 19:
      return Mx(e, t, n);
    case 22:
      return Ix(e, t, n);
  }
  throw Error(F(156, t.tag));
};
function qx(e, t) {
  return Sb(e, t);
}
function u_(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function Qt(e, t, n, r) {
  return new u_(e, t, n, r);
}
function tp(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function f_(e) {
  if (typeof e == "function") return tp(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === xh)) return 11;
    if (e === Sh) return 14;
  }
  return 2;
}
function Rr(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Qt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = 14680064 & e.flags),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Wl(e, t, n, r, i, o) {
  var s = 2;
  if (((r = e), typeof e == "function")) tp(e) && (s = 1);
  else if (typeof e == "string") s = 5;
  else
    e: switch (e) {
      case Yi:
        return ui(n.children, i, o, t);
      case bh:
        (s = 8), (i |= 8);
        break;
      case Ed:
        return (
          (e = Qt(12, n, t, 2 | i)), (e.elementType = Ed), (e.lanes = o), e
        );
      case Rd:
        return (e = Qt(13, n, t, i)), (e.elementType = Rd), (e.lanes = o), e;
      case Pd:
        return (e = Qt(19, n, t, i)), (e.elementType = Pd), (e.lanes = o), e;
      case ib:
        return Tc(n, i, o, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case nb:
              s = 10;
              break e;
            case rb:
              s = 9;
              break e;
            case xh:
              s = 11;
              break e;
            case Sh:
              s = 14;
              break e;
            case pr:
              (s = 16), (r = null);
              break e;
          }
        throw Error(F(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Qt(s, n, t, i)), (t.elementType = e), (t.type = r), (t.lanes = o), t
  );
}
function ui(e, t, n, r) {
  return (e = Qt(7, e, r, t)), (e.lanes = n), e;
}
function Tc(e, t, n, r) {
  return (
    (e = Qt(22, e, r, t)),
    (e.elementType = ib),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Cd(e, t, n) {
  return (e = Qt(6, e, null, t)), (e.lanes = n), e;
}
function kd(e, t, n) {
  return (
    (t = Qt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function d_(e, t, n, r, i) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ad(0)),
    (this.expirationTimes = ad(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ad(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null);
}
function np(e, t, n, r, i, o, s, a, l) {
  return (
    (e = new d_(e, t, n, a, l)),
    t === 1 ? ((t = 1), o === !0 && (t |= 8)) : (t = 0),
    (o = Qt(3, null, null, t)),
    (e.current = o),
    (o.stateNode = e),
    (o.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Hh(o),
    e
  );
}
function h_(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Xi,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Qx(e) {
  if (!e) return Ir;
  e = e._reactInternals;
  e: {
    if (gi(e) !== e || e.tag !== 1) throw Error(F(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (It(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(F(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (It(n)) return Kb(e, n, t);
  }
  return t;
}
function Zx(e, t, n, r, i, o, s, a, l) {
  return (
    (e = np(n, r, !0, e, i, o, s, a, l)),
    (e.context = Qx(null)),
    (n = e.current),
    (r = gt()),
    (i = Er(n)),
    (o = Gn(r, i)),
    (o.callback = t ?? null),
    kr(n, o, i),
    (e.current.lanes = i),
    Ws(e, i, r),
    Ft(e, r),
    e
  );
}
function Ec(e, t, n, r) {
  var i = t.current,
    o = gt(),
    s = Er(i);
  return (
    (n = Qx(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Gn(o, s)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = kr(i, t, s)),
    e !== null && (dn(e, i, s, o), Bl(e, i, s)),
    s
  );
}
function pc(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Z0(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function rp(e, t) {
  Z0(e, t), (e = e.alternate) && Z0(e, t);
}
function p_() {
  return null;
}
var Jx =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function ip(e) {
  this._internalRoot = e;
}
Rc.prototype.render = ip.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(F(409));
  Ec(e, t, null, null);
};
Rc.prototype.unmount = ip.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    mi(function () {
      Ec(null, e, null, null);
    }),
      (t[qn] = null);
  }
};
function Rc(e) {
  this._internalRoot = e;
}
Rc.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Pb();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < vr.length && t !== 0 && t < vr[n].priority; n++);
    vr.splice(n, 0, e), n === 0 && Fb(e);
  }
};
function op(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Pc(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function J0() {}
function m_(e, t, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var o = r;
      r = function () {
        var c = pc(s);
        o.call(c);
      };
    }
    var s = Zx(t, r, e, 0, null, !1, !1, "", J0);
    return (
      (e._reactRootContainer = s),
      (e[qn] = s.current),
      As(e.nodeType === 8 ? e.parentNode : e),
      mi(),
      s
    );
  }
  for (; (i = e.lastChild); ) e.removeChild(i);
  if (typeof r == "function") {
    var a = r;
    r = function () {
      var c = pc(l);
      a.call(c);
    };
  }
  var l = np(e, 0, !1, null, null, !1, !1, "", J0);
  return (
    (e._reactRootContainer = l),
    (e[qn] = l.current),
    As(e.nodeType === 8 ? e.parentNode : e),
    mi(function () {
      Ec(t, l, n, r);
    }),
    l
  );
}
function Ic(e, t, n, r, i) {
  var o = n._reactRootContainer;
  if (o) {
    var s = o;
    if (typeof i == "function") {
      var a = i;
      i = function () {
        var l = pc(s);
        a.call(l);
      };
    }
    Ec(t, s, e, i);
  } else s = m_(n, t, e, i, r);
  return pc(s);
}
Eb = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = vs(t.pendingLanes);
        n !== 0 &&
          (kh(t, 1 | n), Ft(t, Me()), !(6 & re) && ((go = Me() + 500), Lr()));
      }
      break;
    case 13:
      mi(function () {
        var r = Qn(e, 1);
        if (r !== null) {
          var i = gt();
          dn(r, e, 1, i);
        }
      }),
        rp(e, 1);
  }
};
Th = function (e) {
  if (e.tag === 13) {
    var t = Qn(e, 134217728);
    if (t !== null) {
      var n = gt();
      dn(t, e, 134217728, n);
    }
    rp(e, 134217728);
  }
};
Rb = function (e) {
  if (e.tag === 13) {
    var t = Er(e),
      n = Qn(e, t);
    if (n !== null) {
      var r = gt();
      dn(n, e, t, r);
    }
    rp(e, t);
  }
};
Pb = function () {
  return se;
};
Ib = function (e, t) {
  var n = se;
  try {
    return (se = e), t();
  } finally {
    se = n;
  }
};
Bd = function (e, t, n) {
  switch (t) {
    case "input":
      if ((_d(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]'
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var i = bc(r);
            if (!i) throw Error(F(90));
            sb(r), _d(r, i);
          }
        }
      }
      break;
    case "textarea":
      lb(e, n);
      break;
    case "select":
      (t = n.value), t != null && io(e, !!n.multiple, t, !1);
  }
};
mb = Zh;
vb = mi;
var v_ = { usingClientEntryPoint: !1, Events: [Xs, Qi, bc, hb, pb, Zh] },
  ds = {
    findFiberByHostInstance: si,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  g_ = {
    bundleType: ds.bundleType,
    version: ds.version,
    rendererPackageName: ds.rendererPackageName,
    rendererConfig: ds.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Jn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = bb(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: ds.findFiberByHostInstance || p_,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" &&
  ((hs = __REACT_DEVTOOLS_GLOBAL_HOOK__), !hs.isDisabled && hs.supportsFiber)
)
  try {
    (mc = hs.inject(g_)), (Pn = hs);
  } catch {}
var hs;
Ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = v_;
Ht.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!op(t)) throw Error(F(200));
  return h_(e, t, null, n);
};
Ht.createRoot = function (e, t) {
  if (!op(e)) throw Error(F(299));
  var n = !1,
    r = "",
    i = Jx;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
    (t = np(e, 1, !1, null, null, n, !1, r, i)),
    (e[qn] = t.current),
    As(e.nodeType === 8 ? e.parentNode : e),
    new ip(t)
  );
};
Ht.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(F(188))
      : ((e = Object.keys(e).join(",")), Error(F(268, e)));
  return (e = bb(t)), (e = e === null ? null : e.stateNode), e;
};
Ht.flushSync = function (e) {
  return mi(e);
};
Ht.hydrate = function (e, t, n) {
  if (!Pc(t)) throw Error(F(200));
  return Ic(null, e, t, !0, n);
};
Ht.hydrateRoot = function (e, t, n) {
  if (!op(e)) throw Error(F(405));
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    o = "",
    s = Jx;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (s = n.onRecoverableError)),
    (t = Zx(t, null, e, 1, n ?? null, i, !1, o, s)),
    (e[qn] = t.current),
    As(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (i = n._getVersion),
        (i = i(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, i])
          : t.mutableSourceEagerHydrationData.push(n, i);
  return new Rc(t);
};
Ht.render = function (e, t, n) {
  if (!Pc(t)) throw Error(F(200));
  return Ic(null, e, t, !1, n);
};
Ht.unmountComponentAtNode = function (e) {
  if (!Pc(e)) throw Error(F(40));
  return (
    !!e._reactRootContainer &&
    (mi(function () {
      Ic(null, null, e, !1, function () {
        (e._reactRootContainer = null), (e[qn] = null);
      });
    }),
    !0)
  );
};
Ht.unstable_batchedUpdates = Zh;
Ht.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Pc(n)) throw Error(F(200));
  if (e == null || e._reactInternals === void 0) throw Error(F(38));
  return Ic(e, t, n, !1, r);
};
Ht.version = "18.2.0-next-9e3b772b8-20220608";
function e1() {
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" &&
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function"
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e1);
    } catch (e) {
      console.error(e);
    }
}
e1();
var Nt = Ht,
  sp = Nt,
  y_ = Nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  b_ = Nt.createPortal,
  x_ = Nt.createRoot,
  S_ = Nt.findDOMNode,
  w_ = Nt.flushSync,
  C_ = Nt.hydrate,
  k_ = Nt.hydrateRoot,
  T_ = Nt.render,
  E_ = Nt.unmountComponentAtNode,
  R_ = Nt.unstable_batchedUpdates,
  P_ = Nt.unstable_renderSubtreeIntoContainer,
  I_ = Nt.version;
var __ = on({
    "../../../node_modules/hsluv/hsluv.js"(e, t) {
      var n = n || {};
      (n.Geometry = function () {}),
        (n.Geometry.intersectLineLine = function (i, o) {
          var s = (i.intercept - o.intercept) / (o.slope - i.slope),
            a = i.slope * s + i.intercept;
          return { x: s, y: a };
        }),
        (n.Geometry.distanceFromOrigin = function (i) {
          return Math.sqrt(Math.pow(i.x, 2) + Math.pow(i.y, 2));
        }),
        (n.Geometry.distanceLineFromOrigin = function (i) {
          return Math.abs(i.intercept) / Math.sqrt(Math.pow(i.slope, 2) + 1);
        }),
        (n.Geometry.perpendicularThroughPoint = function (i, o) {
          var s = -1 / i.slope,
            a = o.y - s * o.x;
          return { slope: s, intercept: a };
        }),
        (n.Geometry.angleFromOrigin = function (i) {
          return Math.atan2(i.y, i.x);
        }),
        (n.Geometry.normalizeAngle = function (i) {
          var o = 2 * Math.PI;
          return ((i % o) + o) % o;
        }),
        (n.Geometry.lengthOfRayUntilIntersect = function (i, o) {
          return o.intercept / (Math.sin(i) - o.slope * Math.cos(i));
        }),
        (n.Hsluv = function () {}),
        (n.Hsluv.getBounds = function (i) {
          for (
            var o = [],
              s = Math.pow(i + 16, 3) / 1560896,
              a = s > n.Hsluv.epsilon ? s : i / n.Hsluv.kappa,
              l = 0;
            l < 3;

          )
            for (
              var c = l++,
                u = n.Hsluv.m[c][0],
                f = n.Hsluv.m[c][1],
                d = n.Hsluv.m[c][2],
                h = 0;
              h < 2;

            ) {
              var g = h++,
                y = (284517 * u - 94839 * d) * a,
                S =
                  (838422 * d + 769860 * f + 731718 * u) * i * a -
                  769860 * g * i,
                p = (632260 * d - 126452 * f) * a + 126452 * g;
              o.push({ slope: y / p, intercept: S / p });
            }
          return o;
        }),
        (n.Hsluv.maxSafeChromaForL = function (i) {
          for (var o = n.Hsluv.getBounds(i), s = 1 / 0, a = 0; a < o.length; ) {
            var l = o[a];
            ++a;
            var c = n.Geometry.distanceLineFromOrigin(l);
            s = Math.min(s, c);
          }
          return s;
        }),
        (n.Hsluv.maxChromaForLH = function (i, o) {
          for (
            var s = (o / 360) * Math.PI * 2,
              a = n.Hsluv.getBounds(i),
              l = 1 / 0,
              c = 0;
            c < a.length;

          ) {
            var u = a[c];
            ++c;
            var f = n.Geometry.lengthOfRayUntilIntersect(s, u);
            f >= 0 && (l = Math.min(l, f));
          }
          return l;
        }),
        (n.Hsluv.dotProduct = function (i, o) {
          for (var s = 0, a = 0, l = i.length; a < l; ) {
            var c = a++;
            s += i[c] * o[c];
          }
          return s;
        }),
        (n.Hsluv.fromLinear = function (i) {
          return i <= 0.0031308
            ? 12.92 * i
            : 1.055 * Math.pow(i, 0.4166666666666667) - 0.055;
        }),
        (n.Hsluv.toLinear = function (i) {
          return i > 0.04045 ? Math.pow((i + 0.055) / 1.055, 2.4) : i / 12.92;
        }),
        (n.Hsluv.xyzToRgb = function (i) {
          return [
            n.Hsluv.fromLinear(n.Hsluv.dotProduct(n.Hsluv.m[0], i)),
            n.Hsluv.fromLinear(n.Hsluv.dotProduct(n.Hsluv.m[1], i)),
            n.Hsluv.fromLinear(n.Hsluv.dotProduct(n.Hsluv.m[2], i)),
          ];
        }),
        (n.Hsluv.rgbToXyz = function (i) {
          var o = [
            n.Hsluv.toLinear(i[0]),
            n.Hsluv.toLinear(i[1]),
            n.Hsluv.toLinear(i[2]),
          ];
          return [
            n.Hsluv.dotProduct(n.Hsluv.minv[0], o),
            n.Hsluv.dotProduct(n.Hsluv.minv[1], o),
            n.Hsluv.dotProduct(n.Hsluv.minv[2], o),
          ];
        }),
        (n.Hsluv.yToL = function (i) {
          return i <= n.Hsluv.epsilon
            ? (i / n.Hsluv.refY) * n.Hsluv.kappa
            : 116 * Math.pow(i / n.Hsluv.refY, 0.3333333333333333) - 16;
        }),
        (n.Hsluv.lToY = function (i) {
          return i <= 8
            ? (n.Hsluv.refY * i) / n.Hsluv.kappa
            : n.Hsluv.refY * Math.pow((i + 16) / 116, 3);
        }),
        (n.Hsluv.xyzToLuv = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2],
            l = o + 15 * s + 3 * a,
            c = 4 * o,
            u = 9 * s;
          l != 0 ? ((c /= l), (u /= l)) : ((c = NaN), (u = NaN));
          var f = n.Hsluv.yToL(s);
          if (f == 0) return [0, 0, 0];
          var d = 13 * f * (c - n.Hsluv.refU),
            h = 13 * f * (u - n.Hsluv.refV);
          return [f, d, h];
        }),
        (n.Hsluv.luvToXyz = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2];
          if (o == 0) return [0, 0, 0];
          var l = s / (13 * o) + n.Hsluv.refU,
            c = a / (13 * o) + n.Hsluv.refV,
            u = n.Hsluv.lToY(o),
            f = 0 - (9 * u * l) / ((l - 4) * c - l * c),
            d = (9 * u - 15 * c * u - c * f) / (3 * c);
          return [f, u, d];
        }),
        (n.Hsluv.luvToLch = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2],
            l = Math.sqrt(s * s + a * a),
            c;
          if (l < 1e-8) c = 0;
          else {
            var u = Math.atan2(a, s);
            (c = (u * 180) / Math.PI), c < 0 && (c = 360 + c);
          }
          return [o, l, c];
        }),
        (n.Hsluv.lchToLuv = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2],
            l = (a / 360) * 2 * Math.PI,
            c = Math.cos(l) * s,
            u = Math.sin(l) * s;
          return [o, c, u];
        }),
        (n.Hsluv.hsluvToLch = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2];
          if (a > 99.9999999) return [100, 0, o];
          if (a < 1e-8) return [0, 0, o];
          var l = n.Hsluv.maxChromaForLH(a, o),
            c = (l / 100) * s;
          return [a, c, o];
        }),
        (n.Hsluv.lchToHsluv = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2];
          if (o > 99.9999999) return [a, 0, 100];
          if (o < 1e-8) return [a, 0, 0];
          var l = n.Hsluv.maxChromaForLH(o, a),
            c = (s / l) * 100;
          return [a, c, o];
        }),
        (n.Hsluv.hpluvToLch = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2];
          if (a > 99.9999999) return [100, 0, o];
          if (a < 1e-8) return [0, 0, o];
          var l = n.Hsluv.maxSafeChromaForL(a),
            c = (l / 100) * s;
          return [a, c, o];
        }),
        (n.Hsluv.lchToHpluv = function (i) {
          var o = i[0],
            s = i[1],
            a = i[2];
          if (o > 99.9999999) return [a, 0, 100];
          if (o < 1e-8) return [a, 0, 0];
          var l = n.Hsluv.maxSafeChromaForL(o),
            c = (s / l) * 100;
          return [a, c, o];
        }),
        (n.Hsluv.rgbToHex = function (i) {
          for (var o = "#", s = 0; s < 3; ) {
            var a = s++,
              l = i[a],
              c = Math.round(l * 255),
              u = c % 16,
              f = ((c - u) / 16) | 0;
            o += n.Hsluv.hexChars.charAt(f) + n.Hsluv.hexChars.charAt(u);
          }
          return o;
        }),
        (n.Hsluv.hexToRgb = function (i) {
          i = i.toLowerCase();
          for (var o = [], s = 0; s < 3; ) {
            var a = s++,
              l = n.Hsluv.hexChars.indexOf(i.charAt(a * 2 + 1)),
              c = n.Hsluv.hexChars.indexOf(i.charAt(a * 2 + 2)),
              u = l * 16 + c;
            o.push(u / 255);
          }
          return o;
        }),
        (n.Hsluv.lchToRgb = function (i) {
          return n.Hsluv.xyzToRgb(n.Hsluv.luvToXyz(n.Hsluv.lchToLuv(i)));
        }),
        (n.Hsluv.rgbToLch = function (i) {
          return n.Hsluv.luvToLch(n.Hsluv.xyzToLuv(n.Hsluv.rgbToXyz(i)));
        }),
        (n.Hsluv.hsluvToRgb = function (i) {
          return n.Hsluv.lchToRgb(n.Hsluv.hsluvToLch(i));
        }),
        (n.Hsluv.rgbToHsluv = function (i) {
          return n.Hsluv.lchToHsluv(n.Hsluv.rgbToLch(i));
        }),
        (n.Hsluv.hpluvToRgb = function (i) {
          return n.Hsluv.lchToRgb(n.Hsluv.hpluvToLch(i));
        }),
        (n.Hsluv.rgbToHpluv = function (i) {
          return n.Hsluv.lchToHpluv(n.Hsluv.rgbToLch(i));
        }),
        (n.Hsluv.hsluvToHex = function (i) {
          return n.Hsluv.rgbToHex(n.Hsluv.hsluvToRgb(i));
        }),
        (n.Hsluv.hpluvToHex = function (i) {
          return n.Hsluv.rgbToHex(n.Hsluv.hpluvToRgb(i));
        }),
        (n.Hsluv.hexToHsluv = function (i) {
          return n.Hsluv.rgbToHsluv(n.Hsluv.hexToRgb(i));
        }),
        (n.Hsluv.hexToHpluv = function (i) {
          return n.Hsluv.rgbToHpluv(n.Hsluv.hexToRgb(i));
        }),
        (n.Hsluv.m = [
          [3.240969941904521, -1.537383177570093, -0.498610760293],
          [-0.96924363628087, 1.87596750150772, 0.041555057407175],
          [0.055630079696993, -0.20397695888897, 1.056971514242878],
        ]),
        (n.Hsluv.minv = [
          [0.41239079926595, 0.35758433938387, 0.18048078840183],
          [0.21263900587151, 0.71516867876775, 0.072192315360733],
          [0.019330818715591, 0.11919477979462, 0.95053215224966],
        ]),
        (n.Hsluv.refY = 1),
        (n.Hsluv.refU = 0.19783000664283),
        (n.Hsluv.refV = 0.46831999493879),
        (n.Hsluv.kappa = 903.2962962),
        (n.Hsluv.epsilon = 0.0088564516),
        (n.Hsluv.hexChars = "0123456789abcdef");
      var r = {
        hsluvToRgb: n.Hsluv.hsluvToRgb,
        rgbToHsluv: n.Hsluv.rgbToHsluv,
        hpluvToRgb: n.Hsluv.hpluvToRgb,
        rgbToHpluv: n.Hsluv.rgbToHpluv,
        hsluvToHex: n.Hsluv.hsluvToHex,
        hexToHsluv: n.Hsluv.hexToHsluv,
        hpluvToHex: n.Hsluv.hpluvToHex,
        hexToHpluv: n.Hsluv.hexToHpluv,
        lchToHpluv: n.Hsluv.lchToHpluv,
        hpluvToLch: n.Hsluv.hpluvToLch,
        lchToHsluv: n.Hsluv.lchToHsluv,
        hsluvToLch: n.Hsluv.hsluvToLch,
        lchToLuv: n.Hsluv.lchToLuv,
        luvToLch: n.Hsluv.luvToLch,
        xyzToLuv: n.Hsluv.xyzToLuv,
        luvToXyz: n.Hsluv.luvToXyz,
        xyzToRgb: n.Hsluv.xyzToRgb,
        rgbToXyz: n.Hsluv.rgbToXyz,
        lchToRgb: n.Hsluv.lchToRgb,
        rgbToLch: n.Hsluv.rgbToLch,
      };
      t.exports = r;
    },
  }),
  L_ = on({
    "../../../node_modules/eventemitter3/index.js"(e, t) {
      "use strict";
      var n = Object.prototype.hasOwnProperty,
        r = "~";
      function i() {}
      Object.create &&
        ((i.prototype = Object.create(null)), new i().__proto__ || (r = !1));
      function o(c, u, f) {
        (this.fn = c), (this.context = u), (this.once = f || !1);
      }
      function s(c, u, f, d, h) {
        if (typeof f != "function")
          throw new TypeError("The listener must be a function");
        var g = new o(f, d || c, h),
          y = r ? r + u : u;
        return (
          c._events[y]
            ? c._events[y].fn
              ? (c._events[y] = [c._events[y], g])
              : c._events[y].push(g)
            : ((c._events[y] = g), c._eventsCount++),
          c
        );
      }
      function a(c, u) {
        --c._eventsCount === 0 ? (c._events = new i()) : delete c._events[u];
      }
      function l() {
        (this._events = new i()), (this._eventsCount = 0);
      }
      (l.prototype.eventNames = function () {
        var u = [],
          f,
          d;
        if (this._eventsCount === 0) return u;
        for (d in (f = this._events))
          n.call(f, d) && u.push(r ? d.slice(1) : d);
        return Object.getOwnPropertySymbols
          ? u.concat(Object.getOwnPropertySymbols(f))
          : u;
      }),
        (l.prototype.listeners = function (u) {
          var f = r ? r + u : u,
            d = this._events[f];
          if (!d) return [];
          if (d.fn) return [d.fn];
          for (var h = 0, g = d.length, y = new Array(g); h < g; h++)
            y[h] = d[h].fn;
          return y;
        }),
        (l.prototype.listenerCount = function (u) {
          var f = r ? r + u : u,
            d = this._events[f];
          return d ? (d.fn ? 1 : d.length) : 0;
        }),
        (l.prototype.emit = function (u, f, d, h, g, y) {
          var S = r ? r + u : u;
          if (!this._events[S]) return !1;
          var p = this._events[S],
            m = arguments.length,
            v,
            x;
          if (p.fn) {
            switch ((p.once && this.removeListener(u, p.fn, void 0, !0), m)) {
              case 1:
                return p.fn.call(p.context), !0;
              case 2:
                return p.fn.call(p.context, f), !0;
              case 3:
                return p.fn.call(p.context, f, d), !0;
              case 4:
                return p.fn.call(p.context, f, d, h), !0;
              case 5:
                return p.fn.call(p.context, f, d, h, g), !0;
              case 6:
                return p.fn.call(p.context, f, d, h, g, y), !0;
            }
            for (x = 1, v = new Array(m - 1); x < m; x++)
              v[x - 1] = arguments[x];
            p.fn.apply(p.context, v);
          } else {
            var C = p.length,
              w;
            for (x = 0; x < C; x++)
              switch (
                (p[x].once && this.removeListener(u, p[x].fn, void 0, !0), m)
              ) {
                case 1:
                  p[x].fn.call(p[x].context);
                  break;
                case 2:
                  p[x].fn.call(p[x].context, f);
                  break;
                case 3:
                  p[x].fn.call(p[x].context, f, d);
                  break;
                case 4:
                  p[x].fn.call(p[x].context, f, d, h);
                  break;
                default:
                  if (!v)
                    for (w = 1, v = new Array(m - 1); w < m; w++)
                      v[w - 1] = arguments[w];
                  p[x].fn.apply(p[x].context, v);
              }
          }
          return !0;
        }),
        (l.prototype.on = function (u, f, d) {
          return s(this, u, f, d, !1);
        }),
        (l.prototype.once = function (u, f, d) {
          return s(this, u, f, d, !0);
        }),
        (l.prototype.removeListener = function (u, f, d, h) {
          var g = r ? r + u : u;
          if (!this._events[g]) return this;
          if (!f) return a(this, g), this;
          var y = this._events[g];
          if (y.fn)
            y.fn === f &&
              (!h || y.once) &&
              (!d || y.context === d) &&
              a(this, g);
          else {
            for (var S = 0, p = [], m = y.length; S < m; S++)
              (y[S].fn !== f ||
                (h && !y[S].once) ||
                (d && y[S].context !== d)) &&
                p.push(y[S]);
            p.length
              ? (this._events[g] = p.length === 1 ? p[0] : p)
              : a(this, g);
          }
          return this;
        }),
        (l.prototype.removeAllListeners = function (u) {
          var f;
          return (
            u
              ? ((f = r ? r + u : u), this._events[f] && a(this, f))
              : ((this._events = new i()), (this._eventsCount = 0)),
            this
          );
        }),
        (l.prototype.off = l.prototype.removeListener),
        (l.prototype.addListener = l.prototype.on),
        (l.prefixed = r),
        (l.EventEmitter = l),
        typeof t < "u" && (t.exports = l);
    },
  }),
  zp = on({
    "../../../node_modules/process/browser.js"(e, t) {
      var n = (t.exports = {}),
        r,
        i;
      function o() {
        throw new Error("setTimeout has not been defined");
      }
      function s() {
        throw new Error("clearTimeout has not been defined");
      }
      (function () {
        try {
          typeof setTimeout == "function" ? (r = setTimeout) : (r = o);
        } catch {
          r = o;
        }
        try {
          typeof clearTimeout == "function" ? (i = clearTimeout) : (i = s);
        } catch {
          i = s;
        }
      })();
      function a(p) {
        if (r === setTimeout) return setTimeout(p, 0);
        if ((r === o || !r) && setTimeout)
          return (r = setTimeout), setTimeout(p, 0);
        try {
          return r(p, 0);
        } catch {
          try {
            return r.call(null, p, 0);
          } catch {
            return r.call(this, p, 0);
          }
        }
      }
      function l(p) {
        if (i === clearTimeout) return clearTimeout(p);
        if ((i === s || !i) && clearTimeout)
          return (i = clearTimeout), clearTimeout(p);
        try {
          return i(p);
        } catch {
          try {
            return i.call(null, p);
          } catch {
            return i.call(this, p);
          }
        }
      }
      var c = [],
        u = !1,
        f,
        d = -1;
      function h() {
        !u ||
          !f ||
          ((u = !1), f.length ? (c = f.concat(c)) : (d = -1), c.length && g());
      }
      function g() {
        if (!u) {
          var p = a(h);
          u = !0;
          for (var m = c.length; m; ) {
            for (f = c, c = []; ++d < m; ) f && f[d].run();
            (d = -1), (m = c.length);
          }
          (f = null), (u = !1), l(p);
        }
      }
      n.nextTick = function (p) {
        var m = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var v = 1; v < arguments.length; v++) m[v - 1] = arguments[v];
        c.push(new y(p, m)), c.length === 1 && !u && a(g);
      };
      function y(p, m) {
        (this.fun = p), (this.array = m);
      }
      (y.prototype.run = function () {
        this.fun.apply(null, this.array);
      }),
        (n.title = "browser"),
        (n.browser = !0),
        (n.env = {}),
        (n.argv = []),
        (n.version = ""),
        (n.versions = {});
      function S() {}
      (n.on = S),
        (n.addListener = S),
        (n.once = S),
        (n.off = S),
        (n.removeListener = S),
        (n.removeAllListeners = S),
        (n.emit = S),
        (n.prependListener = S),
        (n.prependOnceListener = S),
        (n.listeners = function (p) {
          return [];
        }),
        (n.binding = function (p) {
          throw new Error("process.binding is not supported");
        }),
        (n.cwd = function () {
          return "/";
        }),
        (n.chdir = function (p) {
          throw new Error("process.chdir is not supported");
        }),
        (n.umask = function () {
          return 0;
        });
    },
  }),
  M_ = on({
    "../../../node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.production.min.js"(
      e
    ) {
      "use strict";
      var t = typeof Symbol == "function" && Symbol.for,
        n = t ? Symbol.for("react.element") : 60103,
        r = t ? Symbol.for("react.portal") : 60106,
        i = t ? Symbol.for("react.fragment") : 60107,
        o = t ? Symbol.for("react.strict_mode") : 60108,
        s = t ? Symbol.for("react.profiler") : 60114,
        a = t ? Symbol.for("react.provider") : 60109,
        l = t ? Symbol.for("react.context") : 60110,
        c = t ? Symbol.for("react.async_mode") : 60111,
        u = t ? Symbol.for("react.concurrent_mode") : 60111,
        f = t ? Symbol.for("react.forward_ref") : 60112,
        d = t ? Symbol.for("react.suspense") : 60113,
        h = t ? Symbol.for("react.suspense_list") : 60120,
        g = t ? Symbol.for("react.memo") : 60115,
        y = t ? Symbol.for("react.lazy") : 60116,
        S = t ? Symbol.for("react.block") : 60121,
        p = t ? Symbol.for("react.fundamental") : 60117,
        m = t ? Symbol.for("react.responder") : 60118,
        v = t ? Symbol.for("react.scope") : 60119;
      function x(w) {
        if (typeof w == "object" && w !== null) {
          var k = w.$$typeof;
          switch (k) {
            case n:
              switch (((w = w.type), w)) {
                case c:
                case u:
                case i:
                case s:
                case o:
                case d:
                  return w;
                default:
                  switch (((w = w && w.$$typeof), w)) {
                    case l:
                    case f:
                    case y:
                    case g:
                    case a:
                      return w;
                    default:
                      return k;
                  }
              }
            case r:
              return k;
          }
        }
      }
      function C(w) {
        return x(w) === u;
      }
      (e.AsyncMode = c),
        (e.ConcurrentMode = u),
        (e.ContextConsumer = l),
        (e.ContextProvider = a),
        (e.Element = n),
        (e.ForwardRef = f),
        (e.Fragment = i),
        (e.Lazy = y),
        (e.Memo = g),
        (e.Portal = r),
        (e.Profiler = s),
        (e.StrictMode = o),
        (e.Suspense = d),
        (e.isAsyncMode = function (w) {
          return C(w) || x(w) === c;
        }),
        (e.isConcurrentMode = C),
        (e.isContextConsumer = function (w) {
          return x(w) === l;
        }),
        (e.isContextProvider = function (w) {
          return x(w) === a;
        }),
        (e.isElement = function (w) {
          return typeof w == "object" && w !== null && w.$$typeof === n;
        }),
        (e.isForwardRef = function (w) {
          return x(w) === f;
        }),
        (e.isFragment = function (w) {
          return x(w) === i;
        }),
        (e.isLazy = function (w) {
          return x(w) === y;
        }),
        (e.isMemo = function (w) {
          return x(w) === g;
        }),
        (e.isPortal = function (w) {
          return x(w) === r;
        }),
        (e.isProfiler = function (w) {
          return x(w) === s;
        }),
        (e.isStrictMode = function (w) {
          return x(w) === o;
        }),
        (e.isSuspense = function (w) {
          return x(w) === d;
        }),
        (e.isValidElementType = function (w) {
          return (
            typeof w == "string" ||
            typeof w == "function" ||
            w === i ||
            w === u ||
            w === s ||
            w === o ||
            w === d ||
            w === h ||
            (typeof w == "object" &&
              w !== null &&
              (w.$$typeof === y ||
                w.$$typeof === g ||
                w.$$typeof === a ||
                w.$$typeof === l ||
                w.$$typeof === f ||
                w.$$typeof === p ||
                w.$$typeof === m ||
                w.$$typeof === v ||
                w.$$typeof === S))
          );
        }),
        (e.typeOf = x);
    },
  }),
  O_ = on({
    "../../../node_modules/hoist-non-react-statics/node_modules/react-is/index.js"(
      e,
      t
    ) {
      "use strict";
      t.exports = M_();
    },
  }),
  au = on({
    "../../../node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"(
      e,
      t
    ) {
      "use strict";
      var n = O_(),
        r = {
          childContextTypes: !0,
          contextType: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          getDerivedStateFromError: !0,
          getDerivedStateFromProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0,
        },
        i = {
          name: !0,
          length: !0,
          prototype: !0,
          caller: !0,
          callee: !0,
          arguments: !0,
          arity: !0,
        },
        o = {
          $$typeof: !0,
          render: !0,
          defaultProps: !0,
          displayName: !0,
          propTypes: !0,
        },
        s = {
          $$typeof: !0,
          compare: !0,
          defaultProps: !0,
          displayName: !0,
          propTypes: !0,
          type: !0,
        },
        a = {};
      (a[n.ForwardRef] = o), (a[n.Memo] = s);
      function l(S) {
        return n.isMemo(S) ? s : a[S.$$typeof] || r;
      }
      var c = Object.defineProperty,
        u = Object.getOwnPropertyNames,
        f = Object.getOwnPropertySymbols,
        d = Object.getOwnPropertyDescriptor,
        h = Object.getPrototypeOf,
        g = Object.prototype;
      function y(S, p, m) {
        if (typeof p != "string") {
          if (g) {
            var v = h(p);
            v && v !== g && y(S, v, m);
          }
          var x = u(p);
          f && (x = x.concat(f(p)));
          for (var C = l(S), w = l(p), k = 0; k < x.length; ++k) {
            var E = x[k];
            if (!i[E] && !(m && m[E]) && !(w && w[E]) && !(C && C[E])) {
              var P = d(p, E);
              try {
                c(S, E, P);
              } catch {}
            }
          }
        }
        return S;
      }
      t.exports = y;
    },
  }),
  A_ = on({
    "../../../node_modules/archy/index.js"(e, t) {
      t.exports = function n(r, i, o) {
        i === void 0 && (i = ""), o || (o = {});
        var s = function (u) {
          var f = {
            "\u2502": "|",
            "\u2514": "`",
            "\u251C": "+",
            "\u2500": "-",
            "\u252C": "-",
          };
          return o.unicode === !1 ? f[u] : u;
        };
        typeof r == "string" && (r = { label: r });
        var a = r.nodes || [],
          l = (r.label || "").split(`
`),
          c =
            `
` +
            i +
            (a.length ? s("\u2502") : " ") +
            " ";
        return (
          i +
          l.join(c) +
          `
` +
          a
            .map(function (u, f) {
              var d = f === a.length - 1,
                h = u.nodes && u.nodes.length,
                g = i + (d ? " " : s("\u2502")) + " ";
              return (
                i +
                s(d ? "\u2514" : "\u251C") +
                s("\u2500") +
                s(h ? "\u252C" : "\u2500") +
                " " +
                n(u, g, o).slice(i.length + 2)
              );
            })
            .join("")
        );
      };
    },
  }),
  D_ = on({
    "../../../node_modules/fontfaceobserver/fontfaceobserver.standalone.js"(
      e,
      t
    ) {
      (function () {
        function n(p, m) {
          document.addEventListener
            ? p.addEventListener("scroll", m, !1)
            : p.attachEvent("scroll", m);
        }
        function r(p) {
          document.body
            ? p()
            : document.addEventListener
            ? document.addEventListener("DOMContentLoaded", function m() {
                document.removeEventListener("DOMContentLoaded", m), p();
              })
            : document.attachEvent("onreadystatechange", function m() {
                (document.readyState == "interactive" ||
                  document.readyState == "complete") &&
                  (document.detachEvent("onreadystatechange", m), p());
              });
        }
        function i(p) {
          (this.a = document.createElement("div")),
            this.a.setAttribute("aria-hidden", "true"),
            this.a.appendChild(document.createTextNode(p)),
            (this.b = document.createElement("span")),
            (this.c = document.createElement("span")),
            (this.h = document.createElement("span")),
            (this.f = document.createElement("span")),
            (this.g = -1),
            (this.b.style.cssText =
              "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;"),
            (this.c.style.cssText =
              "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;"),
            (this.f.style.cssText =
              "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;"),
            (this.h.style.cssText =
              "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;"),
            this.b.appendChild(this.h),
            this.c.appendChild(this.f),
            this.a.appendChild(this.b),
            this.a.appendChild(this.c);
        }
        function o(p, m) {
          p.a.style.cssText =
            "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" +
            m +
            ";";
        }
        function s(p) {
          var m = p.a.offsetWidth,
            v = m + 100;
          return (
            (p.f.style.width = v + "px"),
            (p.c.scrollLeft = v),
            (p.b.scrollLeft = p.b.scrollWidth + 100),
            p.g !== m ? ((p.g = m), !0) : !1
          );
        }
        function a(p, m) {
          function v() {
            var C = x;
            s(C) && C.a.parentNode && m(C.g);
          }
          var x = p;
          n(p.b, v), n(p.c, v), s(p);
        }
        function l(p, m) {
          var v = m || {};
          (this.family = p),
            (this.style = v.style || "normal"),
            (this.weight = v.weight || "normal"),
            (this.stretch = v.stretch || "normal");
        }
        var c = null,
          u = null,
          f = null,
          d = null;
        function h() {
          if (u === null)
            if (g() && /Apple/.test(_.navigator.vendor)) {
              var p = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(
                _.navigator.userAgent
              );
              u = !!p && 603 > parseInt(p[1], 10);
            } else u = !1;
          return u;
        }
        function g() {
          return d === null && (d = !!document.fonts), d;
        }
        function y() {
          if (f === null) {
            var p = document.createElement("div");
            try {
              p.style.font = "condensed 100px sans-serif";
            } catch {}
            f = p.style.font !== "";
          }
          return f;
        }
        function S(p, m) {
          return [p.style, p.weight, y() ? p.stretch : "", "100px", m].join(
            " "
          );
        }
        (l.prototype.load = function (p, m) {
          var v = this,
            x = p || "BESbswy",
            C = 0,
            w = m || 3e3,
            k = new Date().getTime();
          return new Promise(function (E, P) {
            if (g() && !h()) {
              var I = new Promise(function (L, G) {
                  function B() {
                    new Date().getTime() - k >= w
                      ? G(Error("" + w + "ms timeout exceeded"))
                      : document.fonts
                          .load(S(v, '"' + v.family + '"'), x)
                          .then(function (J) {
                            1 <= J.length ? L() : setTimeout(B, 25);
                          }, G);
                  }
                  B();
                }),
                H = new Promise(function (L, G) {
                  C = setTimeout(function () {
                    G(Error("" + w + "ms timeout exceeded"));
                  }, w);
                });
              Promise.race([H, I]).then(function () {
                clearTimeout(C), E(v);
              }, P);
            } else
              r(function () {
                function L() {
                  var ee;
                  (ee =
                    (V != -1 && z != -1) ||
                    (V != -1 && A != -1) ||
                    (z != -1 && A != -1)) &&
                    ((ee = V != z && V != A && z != A) ||
                      (c === null &&
                        ((ee = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(
                          _.navigator.userAgent
                        )),
                        (c =
                          !!ee &&
                          (536 > parseInt(ee[1], 10) ||
                            (parseInt(ee[1], 10) === 536 &&
                              11 >= parseInt(ee[2], 10))))),
                      (ee =
                        c &&
                        ((V == K && z == K && A == K) ||
                          (V == N && z == N && A == N) ||
                          (V == te && z == te && A == te)))),
                    (ee = !ee)),
                    ee &&
                      (q.parentNode && q.parentNode.removeChild(q),
                      clearTimeout(C),
                      E(v));
                }
                function G() {
                  if (new Date().getTime() - k >= w)
                    q.parentNode && q.parentNode.removeChild(q),
                      P(Error("" + w + "ms timeout exceeded"));
                  else {
                    var ee = document.hidden;
                    (ee === !0 || ee === void 0) &&
                      ((V = B.a.offsetWidth),
                      (z = J.a.offsetWidth),
                      (A = Y.a.offsetWidth),
                      L()),
                      (C = setTimeout(G, 50));
                  }
                }
                var B = new i(x),
                  J = new i(x),
                  Y = new i(x),
                  V = -1,
                  z = -1,
                  A = -1,
                  K = -1,
                  N = -1,
                  te = -1,
                  q = document.createElement("div");
                (q.dir = "ltr"),
                  o(B, S(v, "sans-serif")),
                  o(J, S(v, "serif")),
                  o(Y, S(v, "monospace")),
                  q.appendChild(B.a),
                  q.appendChild(J.a),
                  q.appendChild(Y.a),
                  document.body.appendChild(q),
                  (K = B.a.offsetWidth),
                  (N = J.a.offsetWidth),
                  (te = Y.a.offsetWidth),
                  G(),
                  a(B, function (ee) {
                    (V = ee), L();
                  }),
                  o(B, S(v, '"' + v.family + '",sans-serif')),
                  a(J, function (ee) {
                    (z = ee), L();
                  }),
                  o(J, S(v, '"' + v.family + '",serif')),
                  a(Y, function (ee) {
                    (A = ee), L();
                  }),
                  o(Y, S(v, '"' + v.family + '",monospace'));
              });
          });
        }),
          typeof t == "object"
            ? (t.exports = l)
            : ((_.FontFaceObserver = l),
              (_.FontFaceObserver.prototype.load = l.prototype.load));
      })();
    },
  });
function Pp(e, t) {
  return b.isValidElement(e)
    ? b.cloneElement(e, { style: t })
    : b.createElement(e, { style: t });
}
var V_ = class extends Error {},
  B_ = class extends be {
    constructor(e) {
      super(e),
        (this.state = { error: void 0, forceUpdateKey: e.forceUpdateKey });
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      if (e.forceUpdateKey !== t.forceUpdateKey) {
        let n = { forceUpdateKey: e.forceUpdateKey };
        return t.error && (n.error = void 0), n;
      }
      return null;
    }
    render() {
      if (this.state.error === void 0) return this.props.children;
      if (!(this.state.error instanceof V_)) throw this.state.error;
      let { notFoundPage: e, defaultPageStyle: t } = this.props;
      if (!e) throw this.state.error;
      return Pp(e, t);
    }
  },
  H_ = ":([a-z]\\w*)",
  wi = new RegExp(H_, "gi");
function IS(e, t) {
  return e.replace(wi, (n, r) => {
    let i = t[r];
    return typeof i != "string" || i.length === 0 ? n : encodeURIComponent(i);
  });
}
function FS(e, t) {
  if (!e.startsWith("/") || !t.startsWith("/"))
    throw new Error("from/to paths are expected to be absolute");
  let [n] = t1(e),
    [r, i] = t1(t),
    o = z_(n, r);
  return (
    o === "" && (o = "."),
    !o.startsWith(".") && !o.startsWith("/") && (o = "./" + o),
    o + "/" + i
  );
}
function t1(e) {
  let t = e.lastIndexOf("/");
  return [e.substring(0, t + 1), e.substring(t + 1)];
}
var ap = 46,
  wo = 47,
  Nr = (e, t) => e.charCodeAt(t),
  n1 = (e, t) => e.lastIndexOf(t),
  ko = (e, t, n) => e.slice(t, n);
function z_(e, t) {
  if (e === t || ((e = "/" + i1(e)), (t = "/" + i1(t)), e === t)) return "";
  let n = 1,
    r = e.length,
    i = r - n,
    o = 1,
    s = t.length - o,
    a = i < s ? i : s,
    l = -1,
    c = 0;
  for (; c < a; c++) {
    let f = Nr(e, n + c);
    if (f !== Nr(t, o + c)) break;
    f === wo && (l = c);
  }
  if (c === a)
    if (s > a) {
      if (Nr(t, o + c) === wo) return ko(t, o + c + 1);
      if (c === 0) return ko(t, o + c);
    } else i > a && (Nr(e, n + c) === wo ? (l = c) : c === 0 && (l = 0));
  let u = "";
  for (c = n + l + 1; c <= r; ++c)
    (c === r || Nr(e, c) === wo) && (u += u.length === 0 ? ".." : "/..");
  return `${u}${ko(t, o + l)}`;
}
var N_ = !1,
  Fc = "/",
  r1 = (e) => e === wo;
function i1(e) {
  let t = "",
    n = 0,
    r = -1,
    i = 0,
    o = 0;
  for (let s = 0; s <= e.length; ++s) {
    if (s < e.length) o = Nr(e, s);
    else {
      if (r1(o)) break;
      o = wo;
    }
    if (r1(o)) {
      if (!(r === s - 1 || i === 1))
        if (i === 2) {
          if (
            t.length < 2 ||
            n !== 2 ||
            Nr(t, t.length - 1) !== ap ||
            Nr(t, t.length - 2) !== ap
          ) {
            if (t.length > 2) {
              let a = n1(t, Fc);
              a === -1
                ? ((t = ""), (n = 0))
                : ((t = ko(t, 0, a)), (n = t.length - 1 - n1(t, Fc))),
                (r = s),
                (i = 0);
              continue;
            } else if (t.length !== 0) {
              (t = ""), (n = 0), (r = s), (i = 0);
              continue;
            }
          }
          N_ && ((t += t.length > 0 ? `${Fc}..` : ".."), (n = 2));
        } else
          t.length > 0
            ? (t += `${Fc}${ko(e, r + 1, s)}`)
            : (t = ko(e, r + 1, s)),
            (n = s - r - 1);
      (r = s), (i = 0);
    } else o === ap && i !== -1 ? ++i : (i = -1);
  }
  return t;
}
function _S(e) {
  let t = typeof _ < "u" ? _.location.search : "";
  return t ? $_(t, e) : e;
}
function $_(e, t) {
  let n = t.indexOf("#"),
    r = n === -1 ? t : t.substring(0, n),
    i = n === -1 ? "" : t.substring(n),
    o = r.indexOf("?");
  if (o === -1) return r + e + i;
  let s = new URLSearchParams(e),
    a = r.substring(o + 1),
    l = new URLSearchParams(a);
  for (let [c, u] of s) l.has(c) || l.append(c, u);
  return r.substring(0, o + 1) + l.toString() + i;
}
function Qc(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ea(e) {
  return typeof e == "string";
}
var j_ = "preload";
function LS(e) {
  return typeof e == "object" && e !== null && !b.isValidElement(e) && j_ in e;
}
function wH(e) {
  let t = b.lazy(e),
    n,
    r,
    i = b.forwardRef(function (s, a) {
      return b.createElement(r ?? t, Object.assign(a ? { ref: a } : {}, s));
    });
  return (
    (i.preload = () => (n || (n = e().then((o) => ((r = o.default), r))), n)), i
  );
}
function lu(e, t) {
  if (t && e) return e.elements && t in e.elements ? e.elements[t] : t;
}
function W_(e) {
  return /bot|Mediapartners-Google|Google-PageRenderer|yandex|ia_archiver/i.test(
    e
  );
}
async function U_(e, t, n, r, i, o, s) {
  var a, l, c;
  let u = e,
    f = !1,
    d = { ...o },
    h = Array.from(u.matchAll(wi)),
    g = await Promise.all(
      h.map(async (m) => {
        var v;
        let x = m?.[0],
          C = m?.[1];
        if (!x || !C)
          throw new Error(
            "Failed to replace path variables: unexpected regex match group"
          );
        let w = o[C];
        if (!w || !ea(w))
          throw new Error(`No slug found for path variable ${C}`);
        let k = await ((v = s?.[i]) === null || v === void 0
          ? void 0
          : v.call(s));
        if (!k || !t) return w;
        let E = await k.getRecordIdBySlug(w, t);
        if (!E) return w;
        let P = await k.getSlugByRecordId(E, n);
        if (!P) {
          f = !0;
          let I = await k.getSlugByRecordId(E, r);
          return I && (d[C] = I), I ?? w;
        }
        return (d[C] = P), P;
      })
    ),
    y = 0,
    S = "",
    p = !1;
  for (let m = 0; m < h.length; m++) {
    let v = h[m],
      x = g[m];
    !v ||
      !x ||
      ((S += u.substring(y, v.index)),
      (y =
        ((a = v.index) !== null && a !== void 0 ? a : 0) +
        ((c = (l = v[0]) === null || l === void 0 ? void 0 : l.length) !==
          null && c !== void 0
          ? c
          : 0)),
      (S += g[m]),
      (p = !0));
  }
  return p && (u = S), { path: u, pathVariables: d, isMissingInLocale: f };
}
async function X_({
  currentLocale: e,
  nextLocale: t,
  defaultLocale: n,
  route: r,
  pathVariables: i,
  collectionUtils: o,
  preserveQueryParams: s,
}) {
  let { path: a } = r,
    l = { path: a, pathVariables: i, isMissingInLocale: !1 };
  if (!a) return l;
  if (i && r.collectionId)
    try {
      l = await U_(a, e, t, n, r.collectionId, i, o);
    } catch {}
  return (
    t.slug && (l.path = "/" + t.slug + l.path),
    s && l.path && (l.path = _S(l.path)),
    l
  );
}
function Y_(e, t, { global: n, routes: r }) {
  var i;
  return ((i = r[e]) === null || i === void 0 ? void 0 : i[t]) || n;
}
var G_ = { global: void 0, routes: {} },
  MS = b.createContext(G_);
function EH({ children: e, value: t }) {
  return T(MS.Provider, { value: t, children: e });
}
function K_() {
  return b.useContext(MS);
}
var lp = 10,
  q_ = 1e4;
function Q_(e) {
  let t = lp,
    n = e.next(0),
    r = [n.value];
  for (; !n.done && t < q_; ) (n = e.next(t)), r.push(n.value), (t += lp);
  return (
    r.length === 1 && r.push(n.value),
    { easing: `linear(${r.join(",")})`, duration: t - lp }
  );
}
var rr = (e) => `--view-transition-${e}`;
function Ip(e) {
  return [parseFloat(e), e.endsWith("px") ? "px" : "%"];
}
function OS(e) {
  let { innerWidth: t, innerHeight: n } = _,
    [r, i] = Ip(e.x),
    [o, s] = Ip(e.y);
  return {
    x: i === "px" ? r : t * (r / 100),
    y: s === "px" ? o : n * (o / 100),
  };
}
var Z_ = {
    makeKeyframe: (e, t, n) => {
      let r = 0;
      return (
        ((n === "exit" &&
          e.angularDirection === "clockwise" &&
          t === "start") ||
          (n === "exit" &&
            e.angularDirection === "counter-clockwise" &&
            t === "end") ||
          (n === "enter" &&
            e.angularDirection === "counter-clockwise" &&
            t === "start") ||
          (n === "enter" &&
            e.angularDirection === "clockwise" &&
            t === "end")) &&
          (r = (e.sweepAngle / 360) * 100),
        `${rr("conic-offset")}: ${r}%;`
      );
    },
    makeStyles: (e, t) => {
      let n = `var(${rr("conic-offset")})`,
        r =
          (t === "exit" && e.angularDirection === "clockwise") ||
          (t === "enter" && e.angularDirection === "counter-clockwise"),
        i = r ? "transparent" : "black",
        o = r ? "black" : "transparent",
        s = "conic-gradient(from ";
      return (
        (s += `${e.angle}deg at ${e.x} ${e.y}, `),
        (s += `${i} 0%, ${i} ${n}, `),
        (s += `${o} ${n}, ${o} 100%)`),
        `mask-image: ${s}; -webkit-mask-image: ${s};`
      );
    },
    makePropertyRules: () => `
        @property ${rr("conic-offset")} {
            syntax: '<percentage>';
            initial-value: 0%;
            inherits: false;
        }
    `,
  },
  J_ = {
    makeKeyframe: (e, t) => {
      let { x: n, y: r } = OS(e);
      return t === "start"
        ? `clip-path: circle(0 at ${n}px ${r}px);`
        : `clip-path: circle(${Math.hypot(
            Math.max(n, _.innerWidth - n),
            Math.max(r, _.innerHeight - r)
          )}px at ${n}px ${r}px);`;
    },
  },
  e2 = {
    makeKeyframe: (e, t) => {
      let { x: n, y: r } = OS(e),
        i = _.innerHeight - r,
        o = _.innerWidth - n;
      return t === "start"
        ? `clip-path: inset(${r}px ${o}px ${i}px ${n}px round ${e.round}px);`
        : "clip-path: inset(0 round 0);";
    },
  },
  t2 = {
    makeKeyframe: (e, t, n) => {
      let [, r] = Ip(e.width),
        i = `0${r}`;
      return (
        ((t === "start" && n === "exit") || (t === "end" && n === "enter")) &&
          (i = e.width),
        `${rr("blinds-width")}: ${i};`
      );
    },
    makeStyles: (e, t) => {
      let n = `var(${rr("blinds-width")})`,
        r = t === "exit" ? "transparent" : "black",
        i = t === "exit" ? "black" : "transparent",
        o = "repeating-linear-gradient(";
      return (
        (o += e.angle + 90 + "deg, "),
        (o += `${r} 0px, ${r} ${n}, `),
        (o += `${i} ${n}, ${i} ${e.width})`),
        `mask-image: ${o}; -webkit-mask-image: ${o};`
      );
    },
    makePropertyRules: () => `
            @property ${rr("blinds-width")} {
                syntax: '<length-percentage>';
                initial-value: 0px;
                inherits: false;
            }
        `,
  },
  n2 = {
    makeKeyframe: (e, t, n) => {
      let r =
        (t === "start" && n === "exit") || (t === "end" && n === "enter")
          ? 1
          : 0;
      return `${rr("wipe-offset")}: ${r};`;
    },
    makeStyles: (e, t) => {
      let n = `var(${rr("wipe-offset")})`,
        r = t === "exit" ? "transparent" : "black",
        i = t === "exit" ? "black" : "transparent",
        o = "linear-gradient(";
      return (
        (o += e.angle + 90 + "deg, "),
        (o += `${r} calc(calc(0% - ${e.width}) + calc(calc(100% + ${e.width}) * ${n})), `),
        (o += `${i} calc(calc(100% + ${e.width}) * ${n}))`),
        `mask-image: ${o}; -webkit-mask-image: ${o};`
      );
    },
    makePropertyRules: () => `
            @property ${rr("wipe-offset")} {
                syntax: '<number>';
                initial-value: 0;
                inherits: false;
            }
        `,
  },
  r2 = { circle: J_, conic: Z_, inset: e2, blinds: t2, wipe: n2 },
  i2 = {
    opacity: 1,
    x: "0px",
    y: "0px",
    scale: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    mask: void 0,
  };
function o1(e, t, n, r) {
  var i;
  let o = `
      opacity: ${e.opacity};
      transform: translate(${e.x}, ${e.y}) scale(${e.scale}) rotateX(${e.rotateX}deg) rotateY(${e.rotateY}deg) rotateZ(${e.rotate}deg);
    `;
  return (
    e.mask &&
      (o +=
        ((i = r?.makeKeyframe) === null || i === void 0
          ? void 0
          : i.call(r, e.mask, t, n)) || ""),
    o
  );
}
function o2(e) {
  return e ? r2[e] : void 0;
}
function s1(e, { transition: t, ...n }) {
  var r;
  let i = "view-transition-" + e,
    o = { duration: "0s", easing: "linear" };
  if (t.type === "tween")
    (o.duration = t.duration + "s"),
      (o.easing = `cubic-bezier(${t.ease.join(",")})`);
  else if (t.type === "spring") {
    let { easing: c, duration: u } = Q_(
      ts({
        keyframes: [0, 1],
        stiffness: t.stiffness,
        damping: t.damping,
        mass: t.mass,
        restDelta: 0.001,
        restSpeed: 1e-4,
      })
    );
    (o.duration = u + "ms"), (o.easing = c);
  }
  let s = o2((r = n?.mask) === null || r === void 0 ? void 0 : r.type),
    a = o1(n, "start", e, s),
    l = o1({ ...i2, mask: n.mask }, "end", e, s);
  return (
    e === "exit" && ([a, l] = [l, a]),
    `
        ${n.mask && s?.makePropertyRules ? s.makePropertyRules(n.mask) : ""}

        @keyframes ${i} {
            0% {
                ${a}
            }

            100% {
                ${l}
            }
        }

        ::view-transition-${e === "enter" ? "new" : "old"}(root) {
            animation-name: ${i};
            animation-duration: ${o.duration};
            animation-delay: ${t.delay}s;
            animation-timing-function: ${o.easing};
            animation-fill-mode: both;
            ${n.mask && s?.makeStyles ? s.makeStyles(n.mask, e) : ""}
        }
    `
  );
}
var AS = "view-transition-styles",
  s2 = {
    x: "0px",
    y: "0px",
    scale: 1,
    opacity: 1,
    rotate3d: !1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    mask: void 0,
    transition: {
      type: "tween",
      delay: 0,
      duration: 0.2,
      ease: [0.27, 0, 0.51, 1],
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
  };
function a2({ exit: e = s2, enter: t }) {
  let n = document.createElement("style");
  n.id = AS;
  let r = `
        @media (prefers-reduced-motion) {
            ::view-transition-group(*),
            ::view-transition-old(*),
            ::view-transition-new(*) {
                animation: none !important;
            }
        }
    `;
  (e.mask ||
    t.mask ||
    e.opacity ||
    t.opacity ||
    e.transition.delay ||
    t.transition.delay) &&
    (r += `
            ::view-transition-old(*),
            ::view-transition-new(*) {
                mix-blend-mode: normal;
            }
        `),
    (r += `
        ::view-transition-old(*),
        ::view-transition-new(*) {
            backface-visibility: hidden;
        }
    `),
    (r += s1("exit", e)),
    (r += s1("enter", t)),
    (n.textContent = r),
    document.head.appendChild(n);
}
function l2() {
  Q.render(() => {
    let e = document.getElementById(AS);
    e && document.head.removeChild(e);
  });
}
function c2() {
  return !!document.startViewTransition;
}
function u2(e, t) {
  if (!c2()) return void e();
  a2(t);
  let n = document.startViewTransition(e);
  return (
    Promise.all([n.ready, n.finished])
      .then(l2)
      .catch(() => {}),
    n
  );
}
function DS() {
  let e = K_(),
    t = D(void 0);
  return (
    W(() => {
      t.current && (t.current(), (t.current = void 0));
    }),
    ce(
      (n, r, i) => {
        let o = Y_(n, r, e);
        if (o) {
          let s = new Promise((l) => {
            t.current = l;
          });
          return u2(async () => {
            i(), await s;
          }, o);
        } else return i();
      },
      [e]
    )
  );
}
function a1(
  e,
  t,
  {
    currentRoutePath: n,
    currentPathVariables: r,
    hash: i,
    pathVariables: o,
    localeId: s,
    preserveQueryParams: a,
  }
) {
  let { path: l } = t;
  if (l)
    try {
      let c = Np(t, {
        currentRoutePath: n,
        currentPathVariables: r,
        hash: i,
        pathVariables: o,
        preserveQueryParams: a,
      });
      VS({ routeId: e, hash: i, pathVariables: o, localeId: s }, c);
    } catch {}
}
function f2(e, t) {
  _.history.replaceState(e, "", t);
}
function VS(e, t) {
  _.history.pushState(e, "", t);
}
function d2({
  disabled: e,
  routeId: t,
  initialPathVariables: n,
  initialLocaleId: r,
}) {
  b.useLayoutEffect(() => {
    e || f2({ routeId: t, pathVariables: n, localeId: r });
  }, []);
}
function h2(e, t) {
  let n = DS(),
    r = b.useRef(void 0),
    i = b.useCallback(
      ({ state: s }) => {
        var a, l, c;
        if (!Qc(s)) return;
        let { routeId: u, hash: f, pathVariables: d, localeId: h } = s;
        if (!ea(u)) return;
        let g = () => {
            t(
              u,
              ea(h) ? h : void 0,
              ea(f) ? f : void 0,
              Qc(d) ? d : void 0,
              !1,
              !0
            );
          },
          y = n(e.current, u, g);
        y
          ? y.updateCallbackDone
              .then(
                (a = r.current) === null || a === void 0 ? void 0 : a.resolve
              )
              .catch(
                (l = r.current) === null || l === void 0 ? void 0 : l.reject
              )
          : (c = r.current) === null || c === void 0 || c.resolve();
      },
      [e, t, n]
    ),
    o = ce((s) => {
      s.navigationType === "traverse" &&
        s.intercept({
          async handler() {
            await new Promise((a, l) => {
              r.current = { resolve: a, reject: l };
            });
          },
          scroll: "after-transition",
        });
    }, []);
  b.useEffect(() => {
    var s;
    return (
      _.addEventListener("popstate", i),
      (s = _.navigation) === null ||
        s === void 0 ||
        s.addEventListener("navigate", o),
      () => {
        var a;
        _.removeEventListener("popstate", i),
          (a = _.navigation) === null ||
            a === void 0 ||
            a.removeEventListener("navigate", o);
      }
    );
  }, [i, o]);
}
function p2(e, t, n) {
  let r = lu(t, e);
  if (!r) return;
  let i = Object.assign({}, t?.elements, n);
  return r.replace(wi, (o, s) => {
    var a;
    return String((a = i[s]) !== null && a !== void 0 ? a : o);
  });
}
function Np(
  e,
  {
    currentRoutePath: t,
    currentPathVariables: n,
    hash: r,
    pathVariables: i,
    hashVariables: o,
    relative: s = !0,
    preserveQueryParams: a,
  }
) {
  var l;
  let c = t ?? "/";
  n &&
    (c = c.replace(wi, (g, y) => {
      var S;
      return String((S = n[y]) !== null && S !== void 0 ? S : g);
    }));
  let f = (l = e?.path) !== null && l !== void 0 ? l : "/";
  i &&
    (f = f.replace(wi, (g, y) => {
      var S;
      return String((S = i[y]) !== null && S !== void 0 ? S : g);
    }));
  let d = p2(r, e, o),
    h = c === f && d;
  return (
    s && (f = FS(c, f)), (a || h) && (f = _S(f)), d && (f = `${f}#${d}`), f
  );
}
async function m2(e, t, n) {
  if (!e.path || !t) return !1;
  let i = `${n.slug ? `/${n.slug}` : ""}${IS(e.path, t)}`;
  return (await fetch(i, { method: "HEAD", redirect: "manual" })).type ===
    "opaqueredirect"
    ? ((_.location.href = _.location.origin + i), !0)
    : !1;
}
async function v2(e) {
  let t = await X_(e);
  if (t) {
    try {
      localStorage.setItem("preferredLocale", e.nextLocale.code);
    } catch {}
    try {
      if (typeof t.path != "string")
        throw new Error("Expected result.path to be a string");
      if (
        t.isMissingInLocale &&
        (await m2(e.route, t.pathVariables, e.nextLocale))
      )
        return;
      VS(
        {
          routeId: e.routeId,
          pathVariables: t.pathVariables,
          localeId: e.nextLocale.id,
        },
        t.path
      );
    } catch {}
    return t;
  }
}
function g2(e, t) {
  if (e.routeId !== t.routeId) return !1;
  if (e.pathVariables === t.pathVariables) return !0;
  let n = e.pathVariables || {},
    r = t.pathVariables || {};
  return n.length === r.length && Object.keys(n).every((i) => n[i] === r[i]);
}
function BS(e) {
  return b.useCallback((t) => e[t], [e]);
}
var $p = b.createContext({});
function y2({ api: e, children: t }) {
  return T($p.Provider, { value: e, children: t });
}
function xa() {
  return b.useContext($p);
}
function b2({ routes: e, children: t }) {
  let n = BS(e);
  return T($p.Provider, { value: { getRoute: n }, children: t });
}
var x2 = class extends be {
    constructor(e) {
      super(e), (this.state = { error: void 0 });
    }
    static getDerivedStateFromError(e) {
      return (
        console.error(
          "Error in SuspenseErrorBoundary (getDerivedStateFromError).",
          e
        ),
        { error: e }
      );
    }
    componentDidCatch(e, t) {
      var n;
      console.error("Caught error in in SuspenseErrorBoundary.", e, t),
        (n = _.__framer_events) === null ||
          n === void 0 ||
          n.push([
            "published_site_load_recoverable_error",
            { message: String(e), componentStack: t?.componentStack },
          ]);
    }
    render() {
      return this.state.error === void 0
        ? this.props.children
        : T(Mo, { children: this.props.fallbackChildren });
    }
  },
  S2 = typeof _ < "u" ? new Promise(() => {}) : null;
function w2() {
  if (typeof _ > "u") return null;
  throw S2;
}
function C2({ children: e }) {
  return T(x2, {
    fallbackChildren: e,
    children: T(Mo, { fallback: T(w2, {}), children: e }),
  });
}
var l1 = "default";
function k2() {
  let [e, t] = b.useState(0);
  return [e, b.useCallback(() => t((n) => n + 1), [])];
}
var T2 = async () => {},
  E2 = { activeLocale: null, locales: [], setLocale: T2 },
  HS = b.createContext(E2);
function R2() {
  return b.useContext(HS);
}
function P2(e) {
  let t = `start-${e}`,
    n = `end-${e}`,
    r = D(void 0);
  return (
    W(() => {
      r.current && (r.current(), (r.current = void 0));
    }),
    ce(() => {
      let i = new Promise((o) => {
        r.current = o;
      });
      performance.mark(t),
        i
          .then(() => {
            performance.mark(n), performance.measure(e, t, n);
          })
          .catch(() => {});
    }, [e, t, n])
  );
}
function c1(e, t, n) {
  let r = e && document.getElementById(e);
  if (r) {
    _2(r, t);
    return;
  }
  n || _.scrollTo(0, 0);
}
function I2(e) {
  let t = b.useRef([]);
  return (
    b.useLayoutEffect(() => {
      var n;
      !((n = t.current) === null || n === void 0) &&
        n.length &&
        (t.current.forEach((r) => r()), (t.current = []));
    }, [e]),
    b.useCallback((n) => {
      t.current.push(n);
    }, [])
  );
}
function F2({
  defaultPageStyle: e,
  disableHistory: t,
  initialPathVariables: n,
  initialRoute: r,
  notFoundPage: i,
  collectionUtils: o,
  routes: s,
  initialLocaleId: a,
  locales: l = [],
  preserveQueryParams: c = !1,
  enableSuspenseThatPreservesDom: u,
}) {
  d2({ disabled: t, routeId: r, initialPathVariables: n, initialLocaleId: a });
  let f = DS(),
    d = P2("route-change"),
    h = b.useRef(r),
    g = b.useRef(n),
    y = b.useRef(a),
    S = y.current,
    p = b.useMemo(() => {
      var V;
      return (V = l.find(({ id: z }) => (S ? z === S : z === l1))) !== null &&
        V !== void 0
        ? V
        : null;
    }, [S, l]),
    [m, v] = k2(),
    x = b.useMemo(
      () => ({
        activeLocale: p,
        locales: l,
        setLocale: async (V) => {
          let z;
          ea(V) ? (z = V) : Qc(V) && (z = V.id);
          let A = l.find(({ id: q }) => q === l1),
            K = l.find(({ id: q }) => q === z);
          if (!K) return;
          let N = h.current,
            te = s[N];
          if (te)
            try {
              let q = await v2({
                currentLocale: p,
                nextLocale: K,
                route: te,
                routeId: N,
                defaultLocale: A,
                pathVariables: g.current,
                collectionUtils: o,
                preserveQueryParams: c,
              });
              if (!q) return;
              (g.current = q.pathVariables),
                (y.current = K.id),
                f(h.current, N, () => Fi(v)),
                d();
            } catch {}
        },
      }),
      [p, o, v, l, d, s, f, c]
    ),
    C = I2(m),
    w = b.useCallback(
      (V, z, A, K, N = !1, te = !1) => {
        (h.current = V),
          (g.current = K),
          (y.current = z),
          C(() => {
            c1(A, N, te);
          }),
          Fi(v),
          d();
      },
      [v, d, C]
    );
  h2(h, w);
  let k = b.useCallback(
      (V, z, A, K) => {
        var N, te;
        let q = s[V];
        if (A) {
          let ne = new Set(),
            ut = (N = q?.path) !== null && N !== void 0 ? N : "/";
          for (let Z of ut.matchAll(wi)) {
            let Lt = Z[1];
            if (Lt === void 0)
              throw new Error(
                "A matching path variable should not be undefined"
              );
            ne.add(Lt);
          }
          A = Object.fromEntries(Object.entries(A).filter(([Z]) => ne.has(Z)));
        }
        let ee = lu(q, z);
        if (
          g2(
            { routeId: h.current, pathVariables: g.current },
            { routeId: V, pathVariables: A }
          )
        ) {
          if (
            ((te = _.history.state) === null || te === void 0
              ? void 0
              : te.hash) !== z &&
            !t
          ) {
            let ne = s[V];
            ne &&
              a1(V, ne, {
                currentRoutePath: ne.path,
                currentPathVariables: g.current,
                pathVariables: A,
                hash: z,
                localeId: y.current,
                preserveQueryParams: c,
              });
          }
          c1(ee, K, !1);
          return;
        }
        if (!q) return;
        if (!t) {
          let ne = s[h.current];
          a1(V, q, {
            currentRoutePath: ne?.path,
            currentPathVariables: g.current,
            hash: z,
            pathVariables: A,
            localeId: y.current,
            preserveQueryParams: c,
          });
        }
        let Wt = () => w(V, y.current, ee, A, K, !1);
        f(h.current, V, Wt);
      },
      [s, t, w, f, c]
    ),
    E = BS(s),
    P = h.current,
    I = g.current,
    H = b.useMemo(
      () => ({
        navigate: k,
        getRoute: E,
        currentRouteId: P,
        currentPathVariables: I,
        routes: s,
        collectionUtils: o,
        preserveQueryParams: c,
      }),
      [k, E, P, I, s, o, c]
    ),
    L = s[h.current];
  if (!L) throw new Error(`Router cannot find route for ${h.current}`);
  let G = !p || !L.includedLocales || L.includedLocales.includes(p.id),
    B = L.path && I ? IS(L.path, I) : L.path,
    J = String(S) + B,
    Y = T(B_, {
      notFoundPage: i,
      defaultPageStyle: e,
      forceUpdateKey: m,
      children: T(
        b.Fragment,
        { children: G ? Pp(L.page, e) : i && Pp(i, e) },
        J
      ),
    });
  return T(y2, {
    api: H,
    children: T(HS.Provider, {
      value: x,
      children: u
        ? T(C2, { children: Y })
        : T(b.Suspense, { fallback: null, children: Y }),
    }),
  });
}
function _2(e, t) {
  let n = t
    ? { behavior: "smooth", block: "start", inline: "nearest" }
    : void 0;
  e.scrollIntoView(n);
}
var _c, cp, u1;
function L2(e) {
  if (u1 !== e) {
    _c = {};
    for (let [t, { path: n }] of Object.entries(e))
      n && (_c[n] = { path: n, depth: O2(n), routeId: t });
    (cp = Object.values(_c)),
      cp.sort(({ depth: t }, { depth: n }) => n - t),
      (u1 = e);
  }
  return [_c, cp];
}
function M2(e, t, n = !0, r = []) {
  let [i, o] = L2(e),
    s,
    a,
    l = t;
  if (r.length > 0) {
    let d = l.split("/").find(Boolean);
    if (
      (d &&
        ((s = r.find(({ slug: h }) => h === d)),
        s && ((a = s.id), (l = l.substring(s.slug.length + 1)))),
      !a)
    ) {
      let h = r.find(({ slug: g }) => g === "");
      h && (a = h.id);
    }
  }
  let c = i[l];
  if (c) {
    let d = f1(l, c.path);
    if (d.isMatch)
      return {
        routeId: c.routeId,
        localeId: a,
        pathVariables: d.pathVariables,
      };
  }
  for (let { path: d, routeId: h } of o) {
    let g = f1(l, d);
    if (g.isMatch)
      return { routeId: h, localeId: a, pathVariables: g.pathVariables };
  }
  if (!n) throw new Error("No exact match found for path");
  let u = i["/"];
  if (u) return { routeId: u.routeId, localeId: a };
  let f = Object.keys(e)[0];
  if (!f) throw new Error("Router should not have undefined routes");
  return { routeId: f, localeId: a };
}
function O2(e) {
  let t = e.replace(/^\/|\/$/gu, "");
  return t === "" ? 0 : t.split("/").length;
}
function f1(e, t) {
  let n = [],
    i = A2(t).replace(wi, (c, u) => (n.push(u), "([^/]+)")),
    o = new RegExp(i + "$"),
    s = e.match(o);
  if (!s) return { isMatch: !1 };
  if (s.length === 1) return { isMatch: !0 };
  let a = {},
    l = s.slice(1);
  for (let c = 0; c < n.length; ++c) {
    let u = n[c];
    if (u === void 0) continue;
    let f = l[c],
      d = a[u];
    if (d) {
      if (d !== f) return { isMatch: !1 };
      continue;
    }
    if (f === void 0)
      throw new Error("Path variable values cannot be undefined");
    a[u] = f;
  }
  return { isMatch: !0, pathVariables: a };
}
function A2(e) {
  return e.replace(/[|\\{}()[\]^$+*?.]/gu, "\\$&").replace(/-/gu, "\\x2d");
}
var D2 = "page";
function d1(e) {
  return Qc(e) && D2 in e && e.page !== void 0;
}
var V2 = b.createContext(void 0);
function cu() {
  var e;
  let t = xa(),
    n = M(V2),
    r = n ?? t.currentRouteId;
  if (!r) return;
  let i = (e = t.getRoute) === null || e === void 0 ? void 0 : e.call(t, r);
  if (i)
    return { ...i, id: r, pathVariables: n ? void 0 : t.currentPathVariables };
}
function B2(e) {
  var t;
  let n = xa();
  if (e)
    return (t = n.getRoute) === null || t === void 0 ? void 0 : t.call(n, e);
}
var zS = typeof _ < "u" && !W_(qe.userAgent);
function H2(e, t = !0) {
  let { getRoute: n } = xa();
  b.useEffect(() => {
    if (!(!n || !t || !zS))
      for (let r of e) {
        let i = n(r);
        i?.page && jp(i.page);
      }
  }, [e, n, t]);
}
function jp(e) {
  zS && LS(e) && e.preload();
}
function jH(e, t) {
  var n;
  let r = cu(),
    i = (n = B2(t)) !== null && n !== void 0 ? n : r;
  return b.useMemo(() => (i ? lu(i, e) : e), [e, i]);
}
var h1 = new Set();
function sa(e, ...t) {
  h1.has(e) || (h1.add(e), console.warn(e, ...t));
}
function z2(e, t, n) {
  let r = n ? `, use ${n} instead` : "",
    i = `Deprecation warning: ${e} will be removed in version ${t}${r}.`;
  sa(i);
}
var NS = class {
    constructor() {
      R(this, "observers", new Set()), R(this, "transactions", {});
    }
    add(e) {
      this.observers.add(e);
      let t = !1;
      return () => {
        t || ((t = !0), this.remove(e));
      };
    }
    remove(e) {
      this.observers.delete(e);
    }
    notify(e, t) {
      if (t) {
        let n = this.transactions[t] || e;
        (n.value = e.value), (this.transactions[t] = n);
      } else this.callObservers(e);
    }
    finishTransaction(e) {
      let t = this.transactions[e];
      return delete this.transactions[e], this.callObservers(t, e);
    }
    callObservers(e, t) {
      let n = [];
      return (
        new Set(this.observers).forEach((r) => {
          typeof r == "function" ? r(e, t) : (r.update(e, t), n.push(r.finish));
        }),
        n
      );
    }
  },
  He = (() => {
    function e(t) {
      return (
        z2(
          "Animatable()",
          "2.0.0",
          "the new animation API (https://www.framer.com/api/animation/)"
        ),
        pn(t) ? t : new $2(t)
      );
    }
    return (
      (e.transaction = (t) => {
        let n = Math.random(),
          r = new Set();
        t((s, a) => {
          s.set(a, n), r.add(s);
        }, n);
        let o = [];
        r.forEach((s) => {
          o.push(...s.finishTransaction(n));
        }),
          o.forEach((s) => {
            s(n);
          });
      }),
      (e.getNumber = (t, n = 0) => e.get(t, n)),
      (e.get = (t, n) => (t == null ? n : pn(t) ? t.get() : t)),
      (e.objectToValues = (t) => {
        if (!t) return t;
        let n = {};
        for (let r in t) {
          let i = t[r];
          pn(i) ? (n[r] = i.get()) : (n[r] = i);
        }
        return n;
      }),
      e
    );
  })(),
  p1 = "onUpdate",
  m1 = "finishTransaction";
function pn(e) {
  return (
    e !== null &&
    typeof e == "object" &&
    p1 in e &&
    e[p1] instanceof Function &&
    m1 in e &&
    e[m1] instanceof Function
  );
}
function N2(e, t) {
  return {
    interpolate(n, r) {
      let i = n.get(),
        o = r.get(),
        s = He(i);
      return (a) => {
        let l = t.interpolate(i, o)(a);
        return s.set(l), s;
      };
    },
    difference(n, r) {
      let i = n.get();
      return t.difference(i, r.get());
    },
  };
}
var $2 = class {
  constructor(e) {
    (this.value = e), R(this, "observers", new NS());
  }
  static interpolationFor(e, t) {
    if (pn(e)) return N2(e, t);
  }
  get() {
    return this.value;
  }
  set(e, t) {
    let n = this.value;
    pn(e) && (e = e.get()), (this.value = e);
    let r = { value: e, oldValue: n };
    this.observers.notify(r, t);
  }
  finishTransaction(e) {
    return this.observers.finishTransaction(e);
  }
  onUpdate(e) {
    return this.observers.add(e);
  }
};
function Lc(e, t) {
  let r = 10 ** Math.round(Math.abs(t));
  return Math.round(e * r) / r;
}
function v1(e, t) {
  return t === 0
    ? Math.round(e)
    : ((t -= t | 0), t < 0 && (t = 1 - t), Math.round(e - t) + t);
}
function tt(e, t) {
  return { x: e, y: t };
}
((e) => {
  (e.add = (...r) =>
    r.reduce((i, o) => ({ x: i.x + o.x, y: i.y + o.y }), { x: 0, y: 0 })),
    (e.subtract = (r, i) => ({ x: r.x - i.x, y: r.y - i.y })),
    (e.multiply = (r, i) => ({ x: r.x * i, y: r.y * i })),
    (e.divide = (r, i) => ({ x: r.x / i, y: r.y / i })),
    (e.absolute = (r) => ({ x: Math.abs(r.x), y: Math.abs(r.y) })),
    (e.reverse = (r) => ({ x: r.x * -1, y: r.y * -1 })),
    (e.pixelAligned = (r, i = { x: 0, y: 0 }) => ({
      x: v1(r.x, i.x),
      y: v1(r.y, i.y),
    })),
    (e.distance = (r, i) => {
      let o = Math.abs(r.x - i.x),
        s = Math.abs(r.y - i.y);
      return Math.sqrt(o * o + s * s);
    }),
    (e.angle = (r, i) =>
      (Math.atan2(i.y - r.y, i.x - r.x) * 180) / Math.PI - 90),
    (e.isEqual = (r, i) => r.x === i.x && r.y === i.y),
    (e.rotationNormalizer = () => {
      let r;
      return (i) => {
        typeof r != "number" && (r = i);
        let o = r - i,
          s = Math.abs(o) + 180,
          a = Math.floor(s / 360);
        return o < 180 && (i -= a * 360), o > 180 && (i += a * 360), (r = i), i;
      };
    });
  function t(r, i) {
    return { x: (r.x + i.x) / 2, y: (r.y + i.y) / 2 };
  }
  e.center = t;
  function n(r, i) {
    var o, s, a, l;
    let c = r.x,
      u = r.y,
      f = !1;
    for (let d = 0, h = i.length - 1; d < i.length; h = d++) {
      let g = ((o = i[d]) == null ? void 0 : o.x) ?? 0,
        y = ((s = i[d]) == null ? void 0 : s.y) ?? 0,
        S = ((a = i[h]) == null ? void 0 : a.x) ?? 0,
        p = ((l = i[h]) == null ? void 0 : l.y) ?? 0;
      y > u != p > u && c < ((S - g) * (u - y)) / (p - y) + g && (f = !f);
    }
    return f;
  }
  e.insidePoints = n;
})(tt || (tt = {}));
var UH = Number.MIN_VALUE;
var XH = { tension: 500, friction: 10, tolerance: 1 / 1e4, velocity: 0 };
var j2 = Yt(__(), 1),
  Fp = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32",
  };
function Mr(e, t, n, r = !1) {
  let [i, o] = t,
    [s, a] = n,
    l = o - i;
  if (l === 0) return (a + s) / 2;
  let c = a - s;
  if (c === 0) return s;
  let u = s + ((e - i) / l) * c;
  if (r === !0)
    if (s < a) {
      if (u < s) return s;
      if (u > a) return a;
    } else {
      if (u > s) return s;
      if (u < a) return a;
    }
  return u;
}
function To(e) {
  return !isNaN(e) && isFinite(e);
}
function Or(e) {
  let t = _p(e);
  return t !== void 0 ? (e.includes("%") ? t / 100 : t) : 0;
}
function _p(e) {
  let t = /\d?\.?\d+/u.exec(e);
  return t ? Number(t[0]) : void 0;
}
var { hsluvToRgb: W2, rgbToHsluv: U2 } = j2.default;
function X2(e, t, n) {
  let [r, i, o] = U2([e / 255, t / 255, n / 255]);
  return { h: r, s: i, l: o };
}
function Y2(e, t, n, r = 1) {
  let i = W2([e, t, n]);
  return { r: i[0] * 255, g: i[1] * 255, b: i[2] * 255, a: r };
}
function Mc(e, t, n, r) {
  let i = Math.round(e),
    o = Math.round(t * 100),
    s = Math.round(n * 100);
  return r === void 0 || r === 1
    ? "hsv(" + i + ", " + o + "%, " + s + "%)"
    : "hsva(" + i + ", " + o + "%, " + s + "%, " + r + ")";
}
function G2(e, t, n) {
  return {
    r: To(e) ? xt(e, 255) * 255 : 0,
    g: To(t) ? xt(t, 255) * 255 : 0,
    b: To(n) ? xt(n, 255) * 255 : 0,
  };
}
function g1(e, t, n, r) {
  let i = [
    fp(Math.round(e).toString(16)),
    fp(Math.round(t).toString(16)),
    fp(Math.round(n).toString(16)),
  ];
  return r &&
    i[0].charAt(0) === i[0].charAt(1) &&
    i[1].charAt(0) === i[1].charAt(1) &&
    i[2].charAt(0) === i[2].charAt(1)
    ? i[0].charAt(0) + i[1].charAt(0) + i[2].charAt(0)
    : i.join("");
}
function Wp(e, t, n) {
  let r,
    i,
    o = xt(e, 255),
    s = xt(t, 255),
    a = xt(n, 255),
    l = Math.max(o, s, a),
    c = Math.min(o, s, a),
    u = (i = r = (l + c) / 2);
  if (l === c) u = i = 0;
  else {
    let f = l - c;
    switch (((i = r > 0.5 ? f / (2 - l - c) : f / (l + c)), l)) {
      case o:
        u = (s - a) / f + (s < a ? 6 : 0);
        break;
      case s:
        u = (a - o) / f + 2;
        break;
      case a:
        u = (o - s) / f + 4;
        break;
    }
    u /= 6;
  }
  return { h: u * 360, s: i, l: r };
}
function up(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? e + (t - e) * 6 * n
      : n < 1 / 2
      ? t
      : n < 2 / 3
      ? e + (t - e) * (2 / 3 - n) * 6
      : e
  );
}
function K2(e, t, n) {
  let r, i, o;
  if (
    ((e = xt(e, 360)), (t = xt(t * 100, 100)), (n = xt(n * 100, 100)), t === 0)
  )
    r = i = o = n;
  else {
    let s = n < 0.5 ? n * (1 + t) : n + t - n * t,
      a = 2 * n - s;
    (r = up(a, s, e + 1 / 3)), (i = up(a, s, e)), (o = up(a, s, e - 1 / 3));
  }
  return { r: r * 255, g: i * 255, b: o * 255 };
}
function y1(e, t, n) {
  (e = xt(e, 255)), (t = xt(t, 255)), (n = xt(n, 255));
  let r = Math.max(e, t, n),
    i = Math.min(e, t, n),
    o = r - i,
    s,
    a = r === 0 ? 0 : o / r,
    l = r;
  if (r === i) s = 0;
  else {
    switch (r) {
      case e:
        s = (t - n) / o + (t < n ? 6 : 0);
        break;
      case t:
        s = (n - e) / o + 2;
        break;
      case n:
        s = (e - t) / o + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: a, v: l };
}
function q2(e, t, n) {
  (e = xt(e, 360) * 6), (t = xt(t * 100, 100)), (n = xt(n * 100, 100));
  let r = Math.floor(e),
    i = e - r,
    o = n * (1 - t),
    s = n * (1 - i * t),
    a = n * (1 - (1 - i) * t),
    l = r % 6,
    c = [n, s, o, o, a, n][l],
    u = [a, n, n, s, o, o][l],
    f = [o, o, a, n, n, s][l];
  return { r: c * 255, g: u * 255, b: f * 255 };
}
function xt(e, t) {
  let n, r;
  if (
    (typeof t == "string" ? (n = parseFloat(t)) : (n = t), typeof e == "string")
  ) {
    Q2(e) && (e = "100%");
    let i = Z2(e);
    (r = Math.min(n, Math.max(0, parseFloat(e)))),
      i && (r = Math.floor(r * n) / 100);
  } else r = e;
  return Math.abs(r - n) < 1e-6 ? 1 : (r % n) / n;
}
function Q2(e) {
  return typeof e == "string" && e.includes(".") && parseFloat(e) === 1;
}
function Z2(e) {
  return typeof e == "string" && e.includes("%");
}
function fp(e) {
  return e.length === 1 ? "0" + e : "" + e;
}
var Fn = (() => {
  let e = "[-\\+]?\\d+%?",
    n = "(?:" + "[-\\+]?\\d*\\.\\d+%?" + ")|(?:" + e + ")",
    r = "[\\s|\\(]+(" + n + ")[,|\\s]+(" + n + ")[,|\\s]+(" + n + ")\\s*\\)?",
    i =
      "[\\s|\\(]+(" +
      n +
      ")[,|\\s]+(" +
      n +
      ")[,|\\s]+(" +
      n +
      ")[,|\\s]+(" +
      n +
      ")\\s*\\)?";
  return {
    rgb: new RegExp("rgb" + r),
    rgba: new RegExp("rgba" + i),
    hsl: new RegExp("hsl" + r),
    hsla: new RegExp("hsla" + i),
    hsv: new RegExp("hsv" + r),
    hsva: new RegExp("hsva" + i),
    hex3: /^([\da-f])([\da-f])([\da-f])$/iu,
    hex6: /^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu,
    hex4: /^#?([\da-f])([\da-f])([\da-f])([\da-f])$/iu,
    hex8: /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu,
  };
})();
function Up(e) {
  if (e.includes("gradient(") || e.includes("var(")) return !1;
  let t = /^[\s,#]+/u,
    n = e.replace(t, "").trimEnd().toLowerCase(),
    r = Fp[n];
  if ((r && (n = r), n === "transparent"))
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  let i;
  return (i = Fn.rgb.exec(n))
    ? {
        r: parseInt(i[1] ?? ""),
        g: parseInt(i[2] ?? ""),
        b: parseInt(i[3] ?? ""),
        a: 1,
        format: "rgb",
      }
    : (i = Fn.rgba.exec(n))
    ? {
        r: parseInt(i[1] ?? ""),
        g: parseInt(i[2] ?? ""),
        b: parseInt(i[3] ?? ""),
        a: parseFloat(i[4] ?? ""),
        format: "rgb",
      }
    : (i = Fn.hsl.exec(n))
    ? {
        h: parseInt(i[1] ?? ""),
        s: Or(i[2] ?? ""),
        l: Or(i[3] ?? ""),
        a: 1,
        format: "hsl",
      }
    : (i = Fn.hsla.exec(n))
    ? {
        h: parseInt(i[1] ?? ""),
        s: Or(i[2] ?? ""),
        l: Or(i[3] ?? ""),
        a: parseFloat(i[4] ?? ""),
        format: "hsl",
      }
    : (i = Fn.hsv.exec(n))
    ? {
        h: parseInt(i[1] ?? ""),
        s: Or(i[2] ?? ""),
        v: Or(i[3] ?? ""),
        a: 1,
        format: "hsv",
      }
    : (i = Fn.hsva.exec(n))
    ? {
        h: parseInt(i[1] ?? ""),
        s: Or(i[2] ?? ""),
        v: Or(i[3] ?? ""),
        a: parseFloat(i[4] ?? ""),
        format: "hsv",
      }
    : (i = Fn.hex8.exec(n))
    ? {
        r: $t(i[1] ?? ""),
        g: $t(i[2] ?? ""),
        b: $t(i[3] ?? ""),
        a: b1(i[4] ?? ""),
        format: r ? "name" : "hex",
      }
    : (i = Fn.hex6.exec(n))
    ? {
        r: $t(i[1] ?? ""),
        g: $t(i[2] ?? ""),
        b: $t(i[3] ?? ""),
        a: 1,
        format: r ? "name" : "hex",
      }
    : (i = Fn.hex4.exec(n))
    ? {
        r: $t(`${i[1]}${i[1]}`),
        g: $t(`${i[2]}${i[2]}`),
        b: $t(`${i[3]}${i[3]}`),
        a: b1(i[4] + "" + i[4]),
        format: r ? "name" : "hex",
      }
    : (i = Fn.hex3.exec(n))
    ? {
        r: $t(`${i[1]}${i[1]}`),
        g: $t(`${i[2]}${i[2]}`),
        b: $t(`${i[3]}${i[3]}`),
        a: 1,
        format: r ? "name" : "hex",
      }
    : !1;
}
function $t(e) {
  return parseInt(e, 16);
}
function b1(e) {
  return $t(e) / 255;
}
var x1 = new Map(),
  $ = (() => {
    function e(o, s, a, l) {
      if (typeof o == "string") {
        let u = x1.get(o);
        return (
          u ||
          ((u = t(o)),
          u === void 0 ? { ...e("black"), isValid: !1 } : (x1.set(o, u), u))
        );
      }
      let c = t(o, s, a, l);
      return c !== void 0 ? c : { ...e("black"), isValid: !1 };
    }
    function t(o, s, a, l) {
      if (o === "") return;
      let c = J2(o, s, a, l);
      if (c) {
        let u = {
          r: c.r,
          g: c.g,
          b: c.b,
          a: c.a,
          h: c.h,
          s: c.s,
          l: c.l,
          initialValue: typeof o == "string" && c.format !== "hsv" ? o : void 0,
          roundA: Math.round(100 * c.a) / 100,
          format: c.format,
          mix: e.mix,
          toValue: () => e.toRgbString(u),
        };
        return u;
      } else return;
    }
    let n = {
      isRGB(o) {
        return o === "rgb" || o === "rgba";
      },
      isHSL(o) {
        return o === "hsl" || o === "hsla";
      },
    };
    (e.inspect = (o, s) =>
      o.format === "hsl"
        ? `<${o.constructor.name} h:${o.h} s:${o.s} l:${o.l} a:${o.a}>`
        : o.format === "hex" || o.format === "name"
        ? `<${o.constructor.name} "${s}">`
        : `<${o.constructor.name} r:${o.r} g:${o.g} b:${o.b} a:${o.a}>`),
      (e.isColor = (o) =>
        typeof o == "string" ? e.isColorString(o) : e.isColorObject(o)),
      (e.isColorString = (o) => (typeof o == "string" ? Up(o) !== !1 : !1)),
      (e.isColorObject = (o) =>
        o &&
        typeof o != "string" &&
        typeof o.r == "number" &&
        typeof o.g == "number" &&
        typeof o.b == "number" &&
        typeof o.h == "number" &&
        typeof o.s == "number" &&
        typeof o.l == "number" &&
        typeof o.a == "number" &&
        typeof o.roundA == "number" &&
        typeof o.format == "string"),
      (e.toString = (o) => e.toRgbString(o)),
      (e.toHex = (o, s = !1) => g1(o.r, o.g, o.b, s)),
      (e.toHexString = (o, s = !1) => `#${e.toHex(o, s)}`),
      (e.toRgbString = (o) =>
        o.a === 1
          ? "rgb(" +
            Math.round(o.r) +
            ", " +
            Math.round(o.g) +
            ", " +
            Math.round(o.b) +
            ")"
          : "rgba(" +
            Math.round(o.r) +
            ", " +
            Math.round(o.g) +
            ", " +
            Math.round(o.b) +
            ", " +
            o.roundA +
            ")"),
      (e.toHusl = (o) => ({ ...X2(o.r, o.g, o.b), a: o.roundA })),
      (e.toHslString = (o) => {
        let s = e.toHsl(o),
          a = Math.round(s.h),
          l = Math.round(s.s * 100),
          c = Math.round(s.l * 100);
        return o.a === 1
          ? "hsl(" + a + ", " + l + "%, " + c + "%)"
          : "hsla(" + a + ", " + l + "%, " + c + "%, " + o.roundA + ")";
      }),
      (e.toHsv = (o) => {
        let s = y1(o.r, o.g, o.b);
        return { h: s.h * 360, s: s.s, v: s.v, a: o.a };
      }),
      (e.toHsvString = (o) => {
        let s = y1(o.r, o.g, o.b),
          a = Math.round(s.h * 360),
          l = Math.round(s.s * 100),
          c = Math.round(s.v * 100);
        return o.a === 1
          ? "hsv(" + a + ", " + l + "%, " + c + "%)"
          : "hsva(" + a + ", " + l + "%, " + c + "%, " + o.roundA + ")";
      }),
      (e.toName = (o) => {
        if (o.a === 0) return "transparent";
        if (o.a < 1) return !1;
        let s = g1(o.r, o.g, o.b, !0);
        for (let a of Object.keys(Fp)) if (Fp[a] === s) return a;
        return !1;
      }),
      (e.toHsl = (o) => ({ h: Math.round(o.h), s: o.s, l: o.l, a: o.a })),
      (e.toRgb = (o) => ({
        r: Math.round(o.r),
        g: Math.round(o.g),
        b: Math.round(o.b),
        a: o.a,
      })),
      (e.brighten = (o, s = 10) => {
        let a = e.toRgb(o);
        return (
          (a.r = Math.max(
            0,
            Math.min(255, a.r - Math.round(255 * -(s / 100)))
          )),
          (a.g = Math.max(
            0,
            Math.min(255, a.g - Math.round(255 * -(s / 100)))
          )),
          (a.b = Math.max(
            0,
            Math.min(255, a.b - Math.round(255 * -(s / 100)))
          )),
          e(a)
        );
      }),
      (e.lighten = (o, s = 10) => {
        let a = e.toHsl(o);
        return (a.l += s / 100), (a.l = Math.min(1, Math.max(0, a.l))), e(a);
      }),
      (e.darken = (o, s = 10) => {
        let a = e.toHsl(o);
        return (a.l -= s / 100), (a.l = Math.min(1, Math.max(0, a.l))), e(a);
      }),
      (e.saturate = (o, s = 10) => {
        let a = e.toHsl(o);
        return (a.s += s / 100), (a.s = Math.min(1, Math.max(0, a.s))), e(a);
      }),
      (e.desaturate = (o, s = 10) => {
        let a = e.toHsl(o);
        return (a.s -= s / 100), (a.s = Math.min(1, Math.max(0, a.s))), e(a);
      }),
      (e.grayscale = (o) => e.desaturate(o, 100)),
      (e.hueRotate = (o, s) => {
        let a = e.toHsl(o);
        return (a.h += s), (a.h = a.h > 360 ? a.h - 360 : a.h), e(a);
      }),
      (e.alpha = (o, s = 1) => e({ r: o.r, g: o.g, b: o.b, a: s })),
      (e.transparent = (o) => e.alpha(o, 0)),
      (e.multiplyAlpha = (o, s = 1) =>
        e({ r: o.r, g: o.g, b: o.b, a: o.a * s })),
      (e.interpolate = (o, s, a = "rgb") => {
        if (!e.isColorObject(o) || !e.isColorObject(s))
          throw new TypeError(
            "Both arguments for Color.interpolate must be Color objects"
          );
        return (l) => e.mixAsColor(o, s, l, !1, a);
      }),
      (e.mix = (o, s, { model: a = "rgb" } = {}) => {
        let l = typeof o == "string" ? e(o) : o,
          c = e.interpolate(l, s, a);
        return (u) => e.toRgbString(c(u));
      }),
      (e.mixAsColor = (o, s, a = 0.5, l = !1, c = "rgb") => {
        let u = null;
        if (n.isRGB(c))
          u = e({
            r: Mr(a, [0, 1], [o.r, s.r], l),
            g: Mr(a, [0, 1], [o.g, s.g], l),
            b: Mr(a, [0, 1], [o.b, s.b], l),
            a: Mr(a, [0, 1], [o.a, s.a], l),
          });
        else {
          let f, d;
          n.isHSL(c)
            ? ((f = e.toHsl(o)), (d = e.toHsl(s)))
            : ((f = e.toHusl(o)), (d = e.toHusl(s))),
            f.s === 0 ? (f.h = d.h) : d.s === 0 && (d.h = f.h);
          let h = f.h,
            g = d.h,
            y = g - h;
          y > 180 ? (y = g - 360 - h) : y < -180 && (y = g + 360 - h);
          let S = {
            h: Mr(a, [0, 1], [h, h + y], l),
            s: Mr(a, [0, 1], [f.s, d.s], l),
            l: Mr(a, [0, 1], [f.l, d.l], l),
            a: Mr(a, [0, 1], [o.a, s.a], l),
          };
          n.isHSL(c) ? (u = e(S)) : (u = e(Y2(S.h, S.s, S.l, S.a)));
        }
        return u;
      }),
      (e.random = (o = 1) => {
        function s() {
          return Math.floor(Math.random() * 255);
        }
        return e("rgba(" + s() + ", " + s() + ", " + s() + ", " + o + ")");
      }),
      (e.grey = (o = 0.5, s = 1) => (
        (o = Math.floor(o * 255)),
        e("rgba(" + o + ", " + o + ", " + o + ", " + s + ")")
      )),
      (e.gray = e.grey),
      (e.rgbToHsl = (o, s, a) => Wp(o, s, a)),
      (e.isValidColorProperty = (o, s) =>
        !!(
          (o.toLowerCase().slice(-5) === "color" ||
            o === "fill" ||
            o === "stroke") &&
          typeof s == "string" &&
          e.isColorString(s)
        )),
      (e.difference = (o, s) => {
        let a = (o.r + s.r) / 2,
          l = o.r - s.r,
          c = o.g - s.g,
          u = o.b - s.b,
          f = Math.pow(l, 2),
          d = Math.pow(c, 2),
          h = Math.pow(u, 2);
        return Math.sqrt(2 * f + 4 * d + 3 * h + (a * (f - h)) / 256);
      }),
      (e.equal = (o, s, a = 0.1) =>
        !(
          Math.abs(o.r - s.r) >= a ||
          Math.abs(o.g - s.g) >= a ||
          Math.abs(o.b - s.b) >= a ||
          Math.abs(o.a - s.a) * 256 >= a
        ));
    let r = zi([0, 255], [0, 1]);
    function i(o) {
      o = r(o);
      let s = Math.abs(o);
      return s < 0.04045
        ? o / 12.92
        : (Math.sign(o) || 1) * Math.pow((s + 0.055) / 1.055, 2.4);
    }
    return (
      (e.luminance = (o) => {
        let { r: s, g: a, b: l } = e.toRgb(o);
        return 0.2126 * i(s) + 0.7152 * i(a) + 0.0722 * i(l);
      }),
      (e.contrast = (o, s) => {
        let a = e.luminance(o),
          l = e.luminance(s);
        return (Math.max(a, l) + 0.05) / (Math.min(a, l) + 0.05);
      }),
      e
    );
  })();
function J2(e, t, n, r = 1) {
  let i;
  return (
    typeof e == "number" &&
    !Number.isNaN(e) &&
    typeof t == "number" &&
    !Number.isNaN(t) &&
    typeof n == "number" &&
    !Number.isNaN(n)
      ? (i = Lp({ r: e, g: t, b: n, a: r }))
      : typeof e == "string"
      ? (i = eL(e))
      : typeof e == "object" &&
        (e.hasOwnProperty("r") && e.hasOwnProperty("g") && e.hasOwnProperty("b")
          ? (i = Lp(e))
          : (i = $S(e))),
    i
  );
}
function eL(e) {
  let t = Up(e);
  if (t) return t.format === "hsl" ? $S(t) : t.format === "hsv" ? tL(t) : Lp(t);
}
function tL(e) {
  let t = q2(e.h, e.s, e.v);
  return {
    ...Wp(t.r, t.g, t.b),
    ...t,
    format: "rgb",
    a: e.a !== void 0 ? jS(e.a) : 1,
  };
}
function Lp(e) {
  let t = G2(e.r, e.g, e.b);
  return {
    ...Wp(t.r, t.g, t.b),
    ...t,
    format: "rgb",
    a: e.a !== void 0 ? jS(e.a) : 1,
  };
}
function $S(e) {
  let t,
    n,
    r,
    i = { r: 0, g: 0, b: 0 },
    o = { h: 0, s: 0, l: 0 };
  return (
    (t = To(e.h) ? e.h : 0),
    (t = (t + 360) % 360),
    (n = To(e.s) ? e.s : 1),
    typeof e.s == "string" && (n = _p(e.s)),
    (r = To(e.l) ? e.l : 0.5),
    typeof e.l == "string" && (r = _p(e.l)),
    (i = K2(t, n, r)),
    (o = { h: t, s: n, l: r }),
    { ...i, ...o, a: e.a === void 0 ? 1 : e.a, format: "hsl" }
  );
}
function jS(e) {
  return (
    (e = parseFloat(e)), e < 0 && (e = 0), (isNaN(e) || e > 1) && (e = 1), e
  );
}
var S1 = (e) => e instanceof sl,
  YH = { delta: 1 / 60, maxValues: 1e4 };
var nL = Yt(L_(), 1),
  { EventEmitter: rL } = nL.default,
  iL = class {
    constructor() {
      R(this, "_emitter", new rL());
    }
    eventNames() {
      return this._emitter.eventNames();
    }
    eventListeners() {
      let e = {};
      for (let t of this._emitter.eventNames())
        e[t] = this._emitter.listeners(t);
      return e;
    }
    on(e, t) {
      this.addEventListener(e, t, !1, !1, this);
    }
    off(e, t) {
      this.removeEventListeners(e, t);
    }
    once(e, t) {
      this.addEventListener(e, t, !0, !1, this);
    }
    unique(e, t) {
      this.addEventListener(e, t, !1, !0, this);
    }
    addEventListener(e, t, n, r, i) {
      if (r) {
        for (let o of this._emitter.eventNames())
          if (t === this._emitter.listeners(o)) return;
      }
      n === !0
        ? this._emitter.once(e, t, i)
        : this._emitter.addListener(e, t, i);
    }
    removeEventListeners(e, t) {
      e ? this._emitter.removeListener(e, t) : this.removeAllEventListeners();
    }
    removeAllEventListeners() {
      this._emitter.removeAllListeners();
    }
    countEventListeners(e, t) {
      if (e) return this._emitter.listeners(e).length;
      {
        let n = 0;
        for (let r of this._emitter.eventNames())
          n += this._emitter.listeners(r).length;
        return n;
      }
    }
    emit(e, ...t) {
      this._emitter.emit(e, ...t);
    }
  },
  oL = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => !1,
    ResizeObserver: void 0,
    onpointerdown: !1,
    onpointermove: !1,
    onpointerup: !1,
    ontouchstart: !1,
    ontouchmove: !1,
    ontouchend: !1,
    onmousedown: !1,
    onmousemove: !1,
    onmouseup: !1,
    devicePixelRatio: 1,
    scrollX: 0,
    scrollY: 0,
    location: { href: "" },
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    getSelection: () => null,
    matchMedia: (e) => ({
      matches: !1,
      media: e,
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => !1,
    }),
    innerHeight: 0,
    innerWidth: 0,
    SVGSVGElement: {},
  },
  De = typeof _ > "u" ? oL : _,
  sL = (e) => {
    setTimeout(e, 1 / 60);
  },
  aL = De.requestAnimationFrame || sL,
  w1 = (e) => aL(e),
  Gs = 1 / 60,
  lL = class extends iL {
    constructor(e = !1) {
      super(),
        R(this, "_started", !1),
        R(this, "_frame", 0),
        R(this, "_frameTasks", []),
        R(this, "tick", () => {
          this._started &&
            (w1(this.tick),
            this.emit("update", this._frame, Gs),
            this.emit("render", this._frame, Gs),
            this._processFrameTasks(),
            this._frame++);
        }),
        e && this.start();
    }
    addFrameTask(e) {
      this._frameTasks.push(e);
    }
    _processFrameTasks() {
      var e;
      let t = this._frameTasks,
        n = t.length;
      if (n !== 0) {
        for (let r = 0; r < n; r++) (e = t[r]) == null || e.call(t);
        t.length = 0;
      }
    }
    static set TimeStep(e) {
      Gs = e;
    }
    static get TimeStep() {
      return Gs;
    }
    start() {
      return this._started
        ? this
        : ((this._frame = 0), (this._started = !0), w1(this.tick), this);
    }
    stop() {
      return (this._started = !1), this;
    }
    get frame() {
      return this._frame;
    }
    get time() {
      return this._frame * Gs;
    }
  },
  WS = new lL(),
  _e = ((e) => (
    (e.canvas = "CANVAS"),
    (e.export = "EXPORT"),
    (e.thumbnail = "THUMBNAIL"),
    (e.preview = "PREVIEW"),
    e
  ))(_e || {}),
  Zc = { target: "PREVIEW", zoom: 1 };
((e) => {
  function t() {
    return Zc.target;
  }
  e.current = t;
  function n() {
    let r = Zc.target;
    return r === "CANVAS" || r === "EXPORT";
  }
  e.hasRestrictions = n;
})(_e || (_e = {}));
var Oc = (e) => ({
  correct: (t, { delta: n, treeScale: r }) => {
    if ((typeof t == "string" && (t = parseFloat(t)), t === 0)) return "0px";
    let i = t;
    return (
      n && r && ((i = Math.round(t / n[e].scale / r[e])), (i = Math.max(i, 1))),
      i + "px"
    );
  },
});
ff({
  borderTopWidth: Oc("y"),
  borderLeftWidth: Oc("x"),
  borderRightWidth: Oc("x"),
  borderBottomWidth: Oc("y"),
});
function ae(e, ...t) {
  var n, r;
  if (e) return;
  let i = Error("Assertion Error" + (t.length > 0 ? ": " + t.join(" ") : ""));
  if (i.stack)
    try {
      let o = i.stack.split(`
`);
      (n = o[1]) != null && n.includes("assert")
        ? (o.splice(1, 1),
          (i.stack = o.join(`
`)))
        : (r = o[0]) != null &&
          r.includes("assert") &&
          (o.splice(0, 1),
          (i.stack = o.join(`
`)));
    } catch {}
  throw i;
}
function We(e, t) {
  throw (
    t ||
    new Error(
      e ? `Unexpected value: ${e}` : "Application entered invalid state"
    )
  );
}
var Ro = b.createContext({
  getLayoutId: (e) => null,
  persistLayoutIdCache: () => {},
  top: !1,
  enabled: !0,
});
function cL({ children: e }) {
  if (M(Ro).top) return T(Ne, { children: e });
  let n = D({
      byId: {},
      byName: {},
      byLastId: {},
      byPossibleId: {},
      byLastName: {},
      byLayoutId: {},
      count: { byId: {}, byName: {} },
    }),
    r = D({
      byId: {},
      byName: {},
      byLastId: {},
      byPossibleId: {},
      byLastName: {},
      byLayoutId: {},
    }),
    i = D(new Set()).current,
    o = ce(({ id: l, name: c, duplicatedFrom: u }) => {
      if (!l) return null;
      let f = c ? "byName" : "byId",
        d = n.current[f][l];
      if (d) return d;
      let h = c || l;
      if (
        !u &&
        !i.has(h) &&
        (!n.current.byLayoutId[h] || n.current.byLayoutId[h] === h)
      )
        return (
          n.current.count[f][h] === void 0 &&
            ((n.current.count[f][h] = 0),
            (n.current.byLayoutId[h] = h),
            (r.current[f][l] = h)),
          i.add(h),
          h
        );
      let g;
      if (u?.length)
        for (let w = u.length - 1; w >= 0; w--) {
          let k = u[w];
          ae(!!k, "duplicatedId must be defined");
          let E = n.current[f][k],
            P = n.current.byLastId[k];
          if (P && !g) {
            let L = n.current.byLayoutId[P],
              G = !L || L === c;
            P && !i.has(P) && (!c || G) && (g = [P, k]);
          }
          let I = E ? n.current.byLayoutId[E] : void 0,
            H = !I || I === c;
          if (E && !i.has(E) && (!c || H))
            return (
              (r.current[f][l] = E), (r.current.byLastId[k] = E), i.add(E), E
            );
        }
      let y = n.current.byLastId[l];
      if (y && !i.has(y)) return i.add(y), (r.current.byId[l] = y), y;
      if (g) {
        let [w, k] = g;
        return (r.current[f][l] = w), (r.current.byLastId[k] = w), i.add(w), w;
      }
      let S = n.current.byPossibleId[l];
      if (S && !i.has(S)) return i.add(S), (r.current.byId[l] = S), S;
      let p = u?.[0],
        m = c || p || l,
        v = (n.current.count[f][m] ?? -1) + 1,
        { layoutId: x, value: C } = uL(m, v, i);
      if (
        ((n.current.count[f][m] = C), (r.current[f][l] = x), u?.length && !c)
      ) {
        let w = u[u.length - 1];
        if ((w && (r.current.byLastId[w] = x), u.length > 1))
          for (let k = 0; k < u.length - 1; k++) {
            let E = u[k];
            E !== void 0 &&
              (r.current.byPossibleId[E] || (r.current.byPossibleId[E] = x));
          }
      }
      return (r.current.byLayoutId[x] = h), i.add(x), x;
    }, []),
    s = ce(() => {
      (n.current = {
        byId: { ...n.current.byId, ...r.current.byId },
        byLastId: { ...n.current.byLastId, ...r.current.byLastId },
        byPossibleId: { ...n.current.byPossibleId, ...r.current.byPossibleId },
        byName: { ...n.current.byName, ...r.current.byName },
        byLastName: { ...n.current.byLastName, ...r.current.byLastName },
        byLayoutId: { ...n.current.byLayoutId, ...r.current.byLayoutId },
        count: { ...n.current.count, byName: {} },
      }),
        (r.current = {
          byId: {},
          byName: {},
          byLastId: {},
          byPossibleId: {},
          byLastName: {},
          byLayoutId: {},
        }),
        i.clear();
    }, []),
    a = D({
      getLayoutId: o,
      persistLayoutIdCache: s,
      top: !0,
      enabled: !0,
    }).current;
  return T(Ro.Provider, { value: a, children: e });
}
function uL(e, t, n) {
  let r = t,
    i = r ? `${e}-${r}` : e;
  for (; n.has(i); ) r++, (i = `${e}-${r}`);
  return { layoutId: i, value: r };
}
function fL({ enabled: e = !0, ...t }) {
  let n = M(Ro),
    r = fe(() => ({ ...n, enabled: e }), [e]);
  return T(Ro.Provider, { ...t, value: r });
}
function _t(e) {
  let t = D(null);
  return t.current === null && (t.current = e()), t.current;
}
var dL = {
    background: void 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "1.4em",
    textOverflow: "ellipsis",
    overflow: "hidden",
    minHeight: 0,
    width: "100%",
    height: "100%",
  },
  hL = {
    ...dL,
    border: "1px solid rgba(149, 149, 149, 0.15)",
    borderRadius: 6,
    fontSize: "12px",
    backgroundColor: "rgba(149, 149, 149, 0.1)",
    color: "#a5a5a5",
  },
  US = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    flexShrink: 0,
    padding: "0 10px",
  },
  pL = { ...US, fontWeight: 500 },
  mL = {
    ...US,
    whiteSpace: "pre",
    maxHeight:
      "calc(50% - calc(20px * var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1)))",
    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
  };
function ez(e) {
  let { error: t, file: n } = e,
    r = n ? `Error in ${vL(n)}` : "Error",
    i = t instanceof Error ? t.message : "" + t;
  return oe("div", {
    style: hL,
    children: [
      T("div", { className: "text", style: pL, children: r }),
      i && T("div", { className: "text", style: mL, children: i }),
    ],
  });
}
function vL(e) {
  return e.startsWith("./") ? e.replace("./", "") : e;
}
var nz = 992 - 5;
function X(e) {
  return typeof e == "number" && isFinite(e);
}
function gL(e) {
  return !e || (!Object.keys(e).length && e.constructor === Object);
}
function ta(e) {
  return typeof e != "string" && typeof e != "number";
}
function na(e) {
  return e !== null && typeof e < "u" && typeof e != "boolean" && !gL(e);
}
var ir;
((e) => {
  function t(i, o) {
    return i === o
      ? !0
      : !i || !o
      ? !1
      : i.x === o.x &&
        i.y === o.y &&
        i.width === o.width &&
        i.height === o.height;
  }
  (e.equals = t),
    (e.atOrigin = (i) => ({ ...i, x: 0, y: 0 })),
    (e.fromTwoPoints = (i, o) => ({
      x: Math.min(i.x, o.x),
      y: Math.min(i.y, o.y),
      width: Math.abs(i.x - o.x),
      height: Math.abs(i.y - o.y),
    })),
    (e.fromRect = (i) => ({
      x: i.left,
      y: i.top,
      width: i.right - i.left,
      height: i.bottom - i.top,
    })),
    (e.multiply = (i, o) => ({
      x: i.x * o,
      y: i.y * o,
      width: i.width * o,
      height: i.height * o,
    })),
    (e.divide = (i, o) => (0, e.multiply)(i, 1 / o)),
    (e.offset = (i, o) => {
      let s = typeof o.x == "number" ? o.x : 0,
        a = typeof o.y == "number" ? o.y : 0;
      return { ...i, x: i.x + s, y: i.y + a };
    });
  function n(i, o) {
    if (o === 0) return i;
    let s = 2 * o;
    return { x: i.x - o, y: i.y - o, width: i.width + s, height: i.height + s };
  }
  (e.inflate = n),
    (e.pixelAligned = (i) => {
      let o = Math.round(i.x),
        s = Math.round(i.y),
        a = Math.round(i.x + i.width),
        l = Math.round(i.y + i.height),
        c = Math.max(a - o, 0),
        u = Math.max(l - s, 0);
      return { x: o, y: s, width: c, height: u };
    }),
    (e.halfPixelAligned = (i) => {
      let o = Math.round(i.x * 2) / 2,
        s = Math.round(i.y * 2) / 2,
        a = Math.round((i.x + i.width) * 2) / 2,
        l = Math.round((i.y + i.height) * 2) / 2,
        c = Math.max(a - o, 1),
        u = Math.max(l - s, 1);
      return { x: o, y: s, width: c, height: u };
    }),
    (e.round = (i, o = 0) => {
      let s = Lc(i.x, o),
        a = Lc(i.y, o),
        l = Lc(i.width, o),
        c = Lc(i.height, o);
      return { x: s, y: a, width: l, height: c };
    }),
    (e.roundToOutside = (i) => {
      let o = Math.floor(i.x),
        s = Math.floor(i.y),
        a = Math.ceil(i.x + i.width),
        l = Math.ceil(i.y + i.height),
        c = Math.max(a - o, 0),
        u = Math.max(l - s, 0);
      return { x: o, y: s, width: c, height: u };
    }),
    (e.minX = (i) => i.x),
    (e.maxX = (i) => i.x + i.width),
    (e.minY = (i) => i.y),
    (e.maxY = (i) => i.y + i.height),
    (e.positions = (i) => ({
      minX: i.x,
      midX: i.x + i.width / 2,
      maxX: (0, e.maxX)(i),
      minY: i.y,
      midY: i.y + i.height / 2,
      maxY: (0, e.maxY)(i),
    })),
    (e.center = (i) => ({ x: i.x + i.width / 2, y: i.y + i.height / 2 })),
    (e.boundingRectFromPoints = (i) => {
      let o = i.map((f) => f.x),
        s = i.map((f) => f.y),
        a = Math.min(...o),
        l = Math.min(...s),
        c = Math.max(...o) - a,
        u = Math.max(...s) - l;
      return { x: a, y: l, width: c, height: u };
    }),
    (e.fromPoints = (i) => {
      let [o, s, a, l] = i,
        { x: c, y: u } = o,
        f = tt.distance(o, s),
        d = tt.distance(o, l);
      return { x: c, y: u, width: f, height: d };
    }),
    (e.merge = (...i) => {
      let o = { x: Math.min(...i.map(e.minX)), y: Math.min(...i.map(e.minY)) },
        s = { x: Math.max(...i.map(e.maxX)), y: Math.max(...i.map(e.maxY)) };
      return (0, e.fromTwoPoints)(o, s);
    }),
    (e.intersection = (i, o) => {
      let s = Math.max(i.x, o.x),
        a = Math.min(i.x + i.width, o.x + o.width),
        l = Math.max(i.y, o.y),
        c = Math.min(i.y + i.height, o.y + o.height);
      return { x: s, y: l, width: a - s, height: c - l };
    }),
    (e.points = (i) => [
      { x: (0, e.minX)(i), y: (0, e.minY)(i) },
      { x: (0, e.minX)(i), y: (0, e.maxY)(i) },
      { x: (0, e.maxX)(i), y: (0, e.minY)(i) },
      { x: (0, e.maxX)(i), y: (0, e.maxY)(i) },
    ]),
    (e.transform = (i, o) => {
      let { x: s, y: a } = o.transformPoint({ x: i.x, y: i.y }),
        { x: l, y: c } = o.transformPoint({ x: i.x + i.width, y: i.y }),
        { x: u, y: f } = o.transformPoint({
          x: i.x + i.width,
          y: i.y + i.height,
        }),
        { x: d, y: h } = o.transformPoint({ x: i.x, y: i.y + i.height }),
        g = Math.min(s, l, u, d),
        y = Math.max(s, l, u, d) - g,
        S = Math.min(a, c, f, h),
        p = Math.max(a, c, f, h) - S;
      return { x: g, y: S, width: y, height: p };
    }),
    (e.containsPoint = (i, o) =>
      !(
        o.x < (0, e.minX)(i) ||
        o.x > (0, e.maxX)(i) ||
        o.y < (0, e.minY)(i) ||
        o.y > (0, e.maxY)(i) ||
        isNaN(i.x) ||
        isNaN(i.y)
      )),
    (e.containsRect = (i, o) => {
      for (let s of (0, e.points)(o))
        if (!(0, e.containsPoint)(i, s)) return !1;
      return !0;
    }),
    (e.toCSS = (i) => ({
      display: "block",
      transform: `translate(${i.x}px, ${i.y}px)`,
      width: `${i.width}px`,
      height: `${i.height}px`,
    })),
    (e.inset = (i, o) => ({
      x: i.x + o,
      y: i.y + o,
      width: Math.max(0, i.width - 2 * o),
      height: Math.max(0, i.height - 2 * o),
    })),
    (e.intersects = (i, o) =>
      !(
        o.x >= (0, e.maxX)(i) ||
        (0, e.maxX)(o) <= i.x ||
        o.y >= (0, e.maxY)(i) ||
        (0, e.maxY)(o) <= i.y
      )),
    (e.overlapHorizontally = (i, o) => {
      let s = e.maxX(i),
        a = e.maxX(o);
      return s > o.x && a > i.x;
    }),
    (e.overlapVertically = (i, o) => {
      let s = e.maxY(i),
        a = e.maxY(o);
      return s > o.y && a > i.y;
    }),
    (e.doesNotIntersect = (i, o) =>
      o.find((s) => e.intersects(s, i)) === void 0),
    (e.isEqual = (i, o) => e.equals(i, o)),
    (e.cornerPoints = (i) => {
      let o = i.x,
        s = i.x + i.width,
        a = i.y,
        l = i.y + i.height;
      return [
        { x: o, y: a },
        { x: s, y: a },
        { x: s, y: l },
        { x: o, y: l },
      ];
    }),
    (e.midPoints = (i) => {
      let o = i.x,
        s = i.x + i.width / 2,
        a = i.x + i.width,
        l = i.y,
        c = i.y + i.height / 2,
        u = i.y + i.height;
      return [
        { x: s, y: l },
        { x: a, y: c },
        { x: s, y: u },
        { x: o, y: c },
      ];
    }),
    (e.pointDistance = (i, o) => {
      let s = 0,
        a = 0;
      return (
        o.x < i.x ? (s = i.x - o.x) : o.x > e.maxX(i) && (s = o.x - e.maxX(i)),
        o.y < i.y ? (a = i.y - o.y) : o.y > e.maxY(i) && (a = o.y - e.maxY(i)),
        tt.distance({ x: s, y: a }, { x: 0, y: 0 })
      );
    });
  let r = { x: 0, y: 0, width: 0, height: 0 };
  (e.fromAny = (i, o = r) => ({
    x: i.x || o.x,
    y: i.y || o.y,
    width: i.width || o.width,
    height: i.height || o.height,
  })),
    (e.delta = (i, o) => {
      let s = { x: (0, e.minX)(i), y: (0, e.minY)(i) },
        a = { x: (0, e.minX)(o), y: (0, e.minY)(o) };
      return { x: s.x - a.x, y: s.y - a.y };
    }),
    (e.withMinSize = (i, o) => {
      let { width: s, height: a } = o,
        l = i.width - s,
        c = i.height - a;
      return {
        width: Math.max(i.width, s),
        height: Math.max(i.height, a),
        x: i.width < s ? i.x + l / 2 : i.x,
        y: i.height < a ? i.y + c / 2 : i.y,
      };
    }),
    (e.anyPointsOutsideRect = (i, o) => {
      let s = (0, e.minX)(i),
        a = (0, e.minY)(i),
        l = (0, e.maxX)(i),
        c = (0, e.maxY)(i);
      for (let u of o) if (u.x < s || u.x > l || u.y < a || u.y > c) return !0;
      return !1;
    }),
    (e.rebaseRectOnto = (i, o, s, a) => {
      let l = { ...i };
      switch (s) {
        case "bottom":
        case "top":
          switch (a) {
            case "start":
              l.x = o.x;
              break;
            case "center":
              l.x = o.x + o.width / 2 - i.width / 2;
              break;
            case "end":
              l.x = o.x + o.width - i.width;
              break;
            default:
              We(a);
          }
          break;
        case "left":
          l.x = o.x - i.width;
          break;
        case "right":
          l.x = o.x + o.width;
          break;
        default:
          We(s);
      }
      switch (s) {
        case "left":
        case "right":
          switch (a) {
            case "start":
              l.y = o.y;
              break;
            case "center":
              l.y = o.y + o.height / 2 - i.height / 2;
              break;
            case "end":
              l.y = o.y + o.height - i.height;
              break;
            default:
              We(a);
          }
          break;
        case "top":
          l.y = o.y - i.height;
          break;
        case "bottom":
          l.y = o.y + o.height;
          break;
        default:
          We(s);
      }
      return l;
    });
})(ir || (ir = {}));
var Jc;
((e) => {
  e.quickfix = (t) => (
    (t.widthType === 2 || t.heightType === 2) && (t.aspectRatio = null),
    X(t.aspectRatio) &&
      (t.left && t.right && (t.widthType = 0),
      t.top && t.bottom && (t.heightType = 0),
      t.left && t.right && t.top && t.bottom && (t.bottom = !1),
      t.widthType !== 0 && t.heightType !== 0 && (t.heightType = 0)),
    t.left &&
      t.right &&
      ((t.fixedSize || t.widthType === 2 || X(t.maxWidth)) && (t.right = !1),
      (t.widthType = 0)),
    t.top &&
      t.bottom &&
      ((t.fixedSize || t.heightType === 2 || X(t.maxHeight)) && (t.bottom = !1),
      (t.heightType = 0)),
    t
  );
})(Jc || (Jc = {}));
function eu(e) {
  if (typeof e == "string") {
    let t = e.trim();
    if (t === "auto") return 2;
    if (t.endsWith("fr")) return 3;
    if (t.endsWith("%")) return 1;
    if (t.endsWith("vw") || t.endsWith("vh")) return 4;
  }
  return 0;
}
var Mp;
((e) => {
  (e.fromProperties = (t) => {
    let {
        left: n,
        right: r,
        top: i,
        bottom: o,
        width: s,
        height: a,
        centerX: l,
        centerY: c,
        aspectRatio: u,
        autoSize: f,
      } = t,
      d = Jc.quickfix({
        left: X(n) || pn(n),
        right: X(r) || pn(r),
        top: X(i) || pn(i),
        bottom: X(o) || pn(o),
        widthType: eu(s),
        heightType: eu(a),
        aspectRatio: u || null,
        fixedSize: f === !0,
      }),
      h = null,
      g = null,
      y = 0,
      S = 0;
    if (d.widthType !== 0 && typeof s == "string") {
      let v = parseFloat(s);
      s.endsWith("fr")
        ? ((y = 3), (h = v))
        : s === "auto"
        ? (y = 2)
        : ((y = 1), (h = v / 100));
    } else s !== void 0 && typeof s != "string" && (h = He.getNumber(s));
    if (d.heightType !== 0 && typeof a == "string") {
      let v = parseFloat(a);
      a.endsWith("fr")
        ? ((S = 3), (g = v))
        : a === "auto"
        ? (S = 2)
        : ((S = 1), (g = parseFloat(a) / 100));
    } else a !== void 0 && typeof a != "string" && (g = He.getNumber(a));
    let p = 0.5,
      m = 0.5;
    return (
      l && (p = parseFloat(l) / 100),
      c && (m = parseFloat(c) / 100),
      {
        left: d.left ? He.getNumber(n) : null,
        right: d.right ? He.getNumber(r) : null,
        top: d.top ? He.getNumber(i) : null,
        bottom: d.bottom ? He.getNumber(o) : null,
        widthType: y,
        heightType: S,
        width: h,
        height: g,
        aspectRatio: d.aspectRatio || null,
        centerAnchorX: p,
        centerAnchorY: m,
      }
    );
  }),
    (e.toSize = (t, n, r, i) => {
      let o = null,
        s = null,
        a = n?.sizing ? He.getNumber(n?.sizing.width) : null,
        l = n?.sizing ? He.getNumber(n?.sizing.height) : null,
        c = C1(t.left, t.right);
      if (a && X(c)) o = a - c;
      else if (r && t.widthType === 2) o = r.width;
      else if (X(t.width))
        switch (t.widthType) {
          case 0:
            o = t.width;
            break;
          case 3:
            o = i
              ? (i.freeSpaceInParent.width / i.freeSpaceUnitDivisor.width) *
                t.width
              : null;
            break;
          case 1:
          case 4:
            a && (o = a * t.width);
            break;
          case 2:
            break;
          default:
            We(t.widthType);
        }
      let u = C1(t.top, t.bottom);
      if (l && X(u)) s = l - u;
      else if (r && t.heightType === 2) s = r.height;
      else if (X(t.height))
        switch (t.heightType) {
          case 0:
            s = t.height;
            break;
          case 3:
            s = i
              ? (i.freeSpaceInParent.height / i.freeSpaceUnitDivisor.height) *
                t.height
              : null;
            break;
          case 1:
          case 4:
            l && (s = l * t.height);
            break;
          case 2:
            break;
          default:
            We(t.heightType);
        }
      return wL(o, s, t, { height: l ?? 0, width: a ?? 0 }, n?.viewport);
    }),
    (e.toRect = (t, n = null, r = null, i = !1, o = null) => {
      let s = t.left || 0,
        a = t.top || 0,
        { width: l, height: c } = e.toSize(t, n, r, o),
        u = n?.positioning ?? null,
        f = u ? He.getNumber(u.width) : null,
        d = u ? He.getNumber(u.height) : null;
      t.left !== null
        ? (s = t.left)
        : f && t.right !== null
        ? (s = f - t.right - l)
        : f && (s = t.centerAnchorX * f - l / 2),
        t.top !== null
          ? (a = t.top)
          : d && t.bottom !== null
          ? (a = d - t.bottom - c)
          : d && (a = t.centerAnchorY * d - c / 2);
      let h = { x: s, y: a, width: l, height: c };
      return i ? ir.pixelAligned(h) : h;
    });
})(Mp || (Mp = {}));
var yL = 200,
  bL = 200;
function tu(e, t, n, r) {
  if (typeof t == "string") {
    if (t.endsWith("%") && n)
      switch (e) {
        case "maxWidth":
        case "minWidth":
          return (parseFloat(t) / 100) * n.width;
        case "maxHeight":
        case "minHeight":
          return (parseFloat(t) / 100) * n.height;
        default:
          break;
      }
    if (t.endsWith("vh") && r)
      switch (e) {
        case "maxWidth":
        case "minWidth":
          return (parseFloat(t) / 100) * r.width;
        case "maxHeight":
        case "minHeight":
          return (parseFloat(t) / 100) * r.height;
        default:
          break;
      }
    return parseFloat(t);
  }
  return t;
}
function xL(e, t, n, r) {
  return (
    t.minHeight && (e = Math.max(tu("minHeight", t.minHeight, n, r), e)),
    t.maxHeight && (e = Math.min(tu("maxHeight", t.maxHeight, n, r), e)),
    e
  );
}
function SL(e, t, n, r) {
  return (
    t.minWidth && (e = Math.max(tu("minWidth", t.minWidth, n, r), e)),
    t.maxWidth && (e = Math.min(tu("maxWidth", t.maxWidth, n, r), e)),
    e
  );
}
function wL(e, t, n, r, i) {
  let o = SL(X(e) ? e : yL, n, r, i),
    s = xL(X(t) ? t : bL, n, r, i);
  return (
    X(n.aspectRatio) &&
      n.aspectRatio > 0 &&
      (X(n.left) && X(n.right)
        ? (s = o / n.aspectRatio)
        : X(n.top) && X(n.bottom)
        ? (o = s * n.aspectRatio)
        : n.widthType !== 0
        ? (s = o / n.aspectRatio)
        : (o = s * n.aspectRatio)),
    { width: o, height: s }
  );
}
function C1(e, t) {
  return !X(e) || !X(t) ? null : e + t;
}
function CL(e) {
  return (
    typeof e.right == "string" ||
    typeof e.bottom == "string" ||
    (typeof e.left == "string" && (!e.center || e.center === "y")) ||
    (typeof e.top == "string" && (!e.center || e.center === "x"))
  );
}
function Sa(e) {
  return !e._constraints || CL(e) ? !1 : e._constraints.enabled;
}
function kL(e) {
  let { size: t } = e,
    { width: n, height: r } = e;
  return (
    X(t) && (n === void 0 && (n = t), r === void 0 && (r = t)),
    X(n) && X(r) ? { width: n, height: r } : null
  );
}
function TL(e) {
  let t = kL(e);
  if (t === null) return null;
  let { left: n, top: r } = e;
  return X(n) && X(r) ? { x: n, y: r, ...t } : null;
}
function aa(e, t, n = !0) {
  if (e.positionFixed || e.positionAbsolute) return null;
  let r = t === 1 || t === 2;
  if (!Sa(e) || r) return TL(e);
  let i = EL(e),
    o = RL(t),
    s = o ? { sizing: o, positioning: o, viewport: null } : null;
  return Mp.toRect(i, s, null, n, null);
}
function EL(e) {
  let {
      left: t,
      right: n,
      top: r,
      bottom: i,
      center: o,
      _constraints: s,
      size: a,
    } = e,
    { width: l, height: c } = e;
  l === void 0 && (l = a), c === void 0 && (c = a);
  let { aspectRatio: u, autoSize: f } = s,
    d = Jc.quickfix({
      left: X(t),
      right: X(n),
      top: X(r),
      bottom: X(i),
      widthType: eu(l),
      heightType: eu(c),
      aspectRatio: u || null,
      fixedSize: f === !0,
    }),
    h = null,
    g = null,
    y = 0,
    S = 0;
  if (d.widthType !== 0 && typeof l == "string") {
    let v = parseFloat(l);
    l.endsWith("fr")
      ? ((y = 3), (h = v))
      : l === "auto"
      ? (y = 2)
      : ((y = 1), (h = v / 100));
  } else l !== void 0 && typeof l != "string" && (h = l);
  if (d.heightType !== 0 && typeof c == "string") {
    let v = parseFloat(c);
    c.endsWith("fr")
      ? ((S = 3), (g = v))
      : c === "auto"
      ? (S = 2)
      : ((S = 1), (g = parseFloat(c) / 100));
  } else c !== void 0 && typeof c != "string" && (g = c);
  let p = 0.5,
    m = 0.5;
  return (
    (o === !0 || o === "x") &&
      ((d.left = !1), typeof t == "string" && (p = parseFloat(t) / 100)),
    (o === !0 || o === "y") &&
      ((d.top = !1), typeof r == "string" && (m = parseFloat(r) / 100)),
    {
      left: d.left ? t : null,
      right: d.right ? n : null,
      top: d.top ? r : null,
      bottom: d.bottom ? i : null,
      widthType: y,
      heightType: S,
      width: h,
      height: g,
      aspectRatio: d.aspectRatio || null,
      centerAnchorX: p,
      centerAnchorY: m,
      minHeight: e.minHeight,
      maxHeight: e.maxHeight,
      minWidth: e.minWidth,
      maxWidth: e.maxWidth,
    }
  );
}
var Xp = b.createContext({ parentSize: 0 });
function RL(e) {
  return e === 0 || e === 1 || e === 2 ? null : e;
}
function wa() {
  return b.useContext(Xp).parentSize;
}
function XS(e) {
  return typeof e == "object";
}
var PL = (e) => {
  let t = wa(),
    { parentSize: n, children: r } = e,
    i = b.useMemo(() => ({ parentSize: n }), [IL(n), FL(n)]);
  return t === 1
    ? r
      ? T(Ne, { children: r })
      : null
    : T(Xp.Provider, { value: i, children: r });
};
function IL(e) {
  return XS(e) ? e.width : e;
}
function FL(e) {
  return XS(e) ? e.height : e;
}
var sz = Xp.Consumer;
function _L(e, t) {
  return T(PL, { parentSize: t, children: e });
}
function LL(e) {
  let t = wa();
  return aa(e, t, !0);
}
var ML = ((e) => (
    (e.Boolean = "boolean"),
    (e.Number = "number"),
    (e.String = "string"),
    (e.RichText = "richtext"),
    (e.FusedNumber = "fusednumber"),
    (e.Enum = "enum"),
    (e.SegmentedEnum = "segmentedenum"),
    (e.Color = "color"),
    (e.Image = "image"),
    (e.ResponsiveImage = "responsiveimage"),
    (e.File = "file"),
    (e.ComponentInstance = "componentinstance"),
    (e.Array = "array"),
    (e.EventHandler = "eventhandler"),
    (e.Transition = "transition"),
    (e.BoxShadow = "boxshadow"),
    (e.Link = "link"),
    (e.Date = "date"),
    (e.Object = "object"),
    (e.Font = "font"),
    (e.PageScope = "pagescope"),
    (e.ScrollSectionRef = "scrollsectionref"),
    (e.CustomCursor = "customcursor"),
    (e.Border = "border"),
    (e.Cursor = "cursor"),
    e
  ))(ML || {}),
  dp;
function OL() {
  if (dp !== void 0) return dp;
  let e = document.createElement("div");
  Object.assign(e.style, {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    rowGap: "1px",
  }),
    e.appendChild(document.createElement("div")),
    e.appendChild(document.createElement("div")),
    document.body.appendChild(e);
  let t = e.scrollHeight === 1;
  return e.parentNode && e.parentNode.removeChild(e), (dp = t), t;
}
var Ci = "flexbox-gap-not-supported",
  k1 = !1;
function az() {
  k1 || ((k1 = !0), !OL() && document.body.classList.add(Ci));
}
var AL = `
[data-framer-component-type="DeprecatedRichText"] p,
[data-framer-component-type="DeprecatedRichText"] div,
[data-framer-component-type="DeprecatedRichText"] h1,
[data-framer-component-type="DeprecatedRichText"] h2,
[data-framer-component-type="DeprecatedRichText"] h3,
[data-framer-component-type="DeprecatedRichText"] h4,
[data-framer-component-type="DeprecatedRichText"] h5,
[data-framer-component-type="DeprecatedRichText"] h6,
[data-framer-component-type="DeprecatedRichText"] li,
[data-framer-component-type="DeprecatedRichText"] ol,
[data-framer-component-type="DeprecatedRichText"] ul,
[data-framer-component-type="DeprecatedRichText"] span:not([data-text-fill]) {
    font-family: var(--framer-font-family, Inter, Inter Placeholder, sans-serif);
    font-style: var(--framer-font-style, normal);
    font-weight: var(--framer-font-weight, 400);
    color: var(--framer-text-color, #000);
    font-size: var(--framer-font-size, 16px);
    letter-spacing: var(--framer-letter-spacing, 0);
    text-transform: var(--framer-text-transform, none);
    text-decoration: var(--framer-text-decoration, none);
    line-height: var(--framer-line-height, 1.2em);
    text-align: var(--framer-text-alignment, start);
}
`,
  DL = `
[data-framer-component-type="DeprecatedRichText"] p:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] div:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h1:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h2:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h3:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h4:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h5:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h6:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] ol:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] ul:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] .framer-image:not(:first-child) {
    margin-top: var(--framer-paragraph-spacing, 0);
}
`,
  VL = `
[data-framer-component-type="DeprecatedRichText"] span[data-text-fill] {
    display: inline-block;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
`,
  BL = `
[data-framer-component-type="DeprecatedRichText"] a,
[data-framer-component-type="DeprecatedRichText"] a span:not([data-text-fill]) {
    font-family: var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
    font-style: var(--framer-link-font-style, var(--framer-font-style, normal));
    font-weight: var(--framer-link-font-weight, var(--framer-font-weight, 400));
    color: var(--framer-link-text-color, var(--framer-text-color, #000));
    font-size: var(--framer-link-font-size, var(--framer-font-size, 16px));
    text-transform: var(--framer-link-text-transform, var(--framer-text-transform, none));
    text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration, none));
}
`,
  HL = `
[data-framer-component-type="DeprecatedRichText"] a:hover,
[data-framer-component-type="DeprecatedRichText"] a:hover span:not([data-text-fill]) {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`,
  zL = `
a[data-framer-page-link-current],
a[data-framer-page-link-current] span:not([data-text-fill]) {
    font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`,
  NL = `
a[data-framer-page-link-current]:hover,
a[data-framer-page-link-current]:hover span:not([data-text-fill]) {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif))));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal))));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400))));
    color: var(--framer-link-hover-text-color, var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000))));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none))));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))));
}
`,
  $L = `
[data-framer-component-type="DeprecatedRichText"] strong {
    font-weight: bolder;
}
`,
  jL = `
[data-framer-component-type="DeprecatedRichText"] em {
    font-style: italic;
}
`,
  WL = `
[data-framer-component-type="DeprecatedRichText"] .framer-image {
    display: block;
    max-width: 100%;
    height: auto;
}
`,
  UL = `
[data-framer-component-type="DeprecatedRichText"] p,
[data-framer-component-type="DeprecatedRichText"] div,
[data-framer-component-type="DeprecatedRichText"] h1,
[data-framer-component-type="DeprecatedRichText"] h2,
[data-framer-component-type="DeprecatedRichText"] h3,
[data-framer-component-type="DeprecatedRichText"] h4,
[data-framer-component-type="DeprecatedRichText"] h5,
[data-framer-component-type="DeprecatedRichText"] h6 {
    margin: 0;
    padding: 0;
}
`,
  XL = `
[data-framer-component-type="DeprecatedRichText"] .text-styles-preset-reset {
    --framer-font-family: Inter, Inter Placeholder, sans-serif;
    --framer-font-style: normal;
    --framer-font-weight: 500;
    --framer-text-color: #000;
    --framer-font-size: 16px;
    --framer-letter-spacing: 0;
    --framer-text-transform: none;
    --framer-text-decoration: none;
    --framer-line-height: 1.2em;
    --framer-text-alignment: start;
}
`,
  YL = `
[data-framer-component-type="DeprecatedRichText"] ul,
[data-framer-component-type="DeprecatedRichText"] ol {
    display: table;
    width: 100%;
    padding-left: 0;
    margin: 0;
}
`,
  GL = `
[data-framer-component-type="DeprecatedRichText"] li {
    display: table-row;
    counter-increment: list-item;
    list-style: none;
}
`,
  KL = `
[data-framer-component-type="DeprecatedRichText"] ol > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: counter(list-item) ".";
    white-space: nowrap;
}
`,
  qL = `
[data-framer-component-type="DeprecatedRichText"] ul > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: "\u2022";
}
`,
  QL = [
    '[data-framer-component-type="DeprecatedRichText"] { cursor: inherit; }',
    XL,
    UL,
    AL,
    DL,
    VL,
    BL,
    HL,
    zL,
    NL,
    $L,
    jL,
    WL,
    YL,
    GL,
    KL,
    qL,
  ],
  ZL = [
    `
        p.framer-text,
        div.framer-text,
        h1.framer-text,
        h2.framer-text,
        h3.framer-text,
        h4.framer-text,
        h5.framer-text,
        h6.framer-text,
        ol.framer-text,
        ul.framer-text {
            margin: 0;
            padding: 0;
        }
    `,
    `
        p.framer-text,
        div.framer-text,
        h1.framer-text,
        h2.framer-text,
        h3.framer-text,
        h4.framer-text,
        h5.framer-text,
        h6.framer-text,
        li.framer-text,
        ol.framer-text,
        ul.framer-text,
        span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-font-family, Inter, Inter Placeholder, sans-serif);
            font-style: var(--framer-font-style, normal);
            font-weight: var(--framer-font-weight, 400);
            color: var(--framer-text-color, #000);
            font-size: calc(var(--framer-font-size, 16px) * var(--framer-font-size-scale, 1));
            letter-spacing: var(--framer-letter-spacing, 0);
            text-transform: var(--framer-text-transform, none);
            text-decoration: var(--framer-text-decoration, none);
            line-height: var(--framer-line-height, 1.2em);
            text-align: var(--framer-text-alignment, start);
        }
    `,
    `
        .framer-fit-text .framer-text {
            white-space: nowrap;
        }
    `,
    `
        strong.framer-text {
            font-family: var(--framer-font-family-bold);
            font-style: var(--framer-font-style-bold);
            font-weight: var(--framer-font-weight-bold, bolder);
        }
    `,
    `
        em.framer-text {
            font-family: var(--framer-font-family-italic);
            font-style: var(--framer-font-style-italic, italic);
            font-weight: var(--framer-font-weight-italic);
        }
    `,
    `
        em.framer-text > strong.framer-text {
            font-family: var(--framer-font-family-bold-italic);
            font-style: var(--framer-font-style-bold-italic, italic);
            font-weight: var(--framer-font-weight-bold-italic, bolder);
        }
    `,
    `
        p.framer-text:not(:first-child),
        div.framer-text:not(:first-child),
        h1.framer-text:not(:first-child),
        h2.framer-text:not(:first-child),
        h3.framer-text:not(:first-child),
        h4.framer-text:not(:first-child),
        h5.framer-text:not(:first-child),
        h6.framer-text:not(:first-child),
        ol.framer-text:not(:first-child),
        ul.framer-text:not(:first-child),
        .framer-image.framer-text:not(:first-child) {
            margin-top: var(--framer-paragraph-spacing, 0);
        }
    `,
    `
        li.framer-text > ul.framer-text:nth-child(2),
        li.framer-text > ol.framer-text:nth-child(2) {
            margin-top: 0;
        }
    `,
    `
        .framer-text[data-text-fill] {
            display: inline-block;
            background-clip: text;
            -webkit-background-clip: text;
            /* make this a transparent color if you want to visualise the clipping  */
            -webkit-text-fill-color: transparent;
            padding: max(0em, calc(calc(1.3em - var(--framer-line-height, 1.3em)) / 2));
            margin: min(0em, calc(calc(1.3em - var(--framer-line-height, 1.3em)) / -2));
        }
    `,
    `
        code.framer-text,
        code.framer-text span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-code-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-code-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-code-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-code-text-color, var(--framer-text-color, #000));
            font-size: calc(var(--framer-font-size, 16px) * var(--framer-font-size-scale, 1));
            letter-spacing: var(--framer-letter-spacing, 0);
            line-height: var(--framer-line-height, 1.2em);
        }
    `,
    `
        a.framer-text,
        a.framer-text span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-link-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-link-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-link-text-color, var(--framer-text-color, #000));
            font-size: calc(var(--framer-link-font-size, var(--framer-font-size, 16px)) * var(--framer-font-size-scale, 1));
            text-transform: var(--framer-link-text-transform, var(--framer-text-transform, none));
            text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration, none));
            /* Cursor inherit to overwrite the user agent stylesheet on rich text links. */
            cursor: var(--framer-custom-cursors, pointer);
        }
    `,
    `
        code.framer-text a.framer-text,
        code.framer-text a.framer-text span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-code-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-code-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-code-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-link-text-color, var(--framer-code-text-color, var(--framer-text-color, #000)));
            font-size: calc(var(--framer-link-font-size, var(--framer-font-size, 16px)) * var(--framer-font-size-scale, 1));
        }
    `,
    `
        a.framer-text:hover,
        a.framer-text:hover span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
            font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
            font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
            color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
            font-size: calc(var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))) * var(--framer-font-size-scale, 1));
            text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
            text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
        }
    `,
    `
        code.framer-text a.framer-text:hover,
        code.framer-text a.framer-text:hover span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-code-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-code-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-code-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-code-text-color, var(--framer-text-color, #000))));
            font-size: calc(var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))) * var(--framer-font-size-scale, 1));
        }
    `,
    `
        a.framer-text[data-framer-page-link-current],
        a.framer-text[data-framer-page-link-current] span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
            font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
            font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
            color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
            font-size: calc(var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))) * var(--framer-font-size-scale, 1));
            text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
            text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
        }
    `,
    `
        code.framer-text a.framer-text[data-framer-page-link-current],
        code.framer-text a.framer-text[data-framer-page-link-current] span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-code-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-code-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-code-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-code-text-color, var(--framer-text-color, #000))));
            font-size: calc(var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))) * var(--framer-font-size-scale, 1));
        }
    `,
    `
        a.framer-text[data-framer-page-link-current]:hover,
        a.framer-text[data-framer-page-link-current]:hover span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-link-hover-font-family, var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif))));
            font-style: var(--framer-link-hover-font-style, var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal))));
            font-weight: var(--framer-link-hover-font-weight, var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400))));
            color: var(--framer-link-hover-text-color, var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000))));
            font-size: calc(var(--framer-link-hover-font-size, var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)))) * var(--framer-font-size-scale, 1));
            text-transform: var(--framer-link-hover-text-transform, var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none))));
            text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))));
        }
    `,
    `
        code.framer-text a.framer-text[data-framer-page-link-current]:hover,
        code.framer-text a.framer-text[data-framer-page-link-current]:hover span.framer-text:not([data-text-fill]) {
            font-family: var(--framer-code-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
            font-style: var(--framer-code-font-style, var(--framer-font-style, normal));
            font-weight: var(--framer-code-font-weight, var(--framer-font-weight, 400));
            color: var(--framer-link-hover-text-color, var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-code-text-color, var(--framer-text-color, #000)))));
            font-size: calc(var(--framer-link-hover-font-size, var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)))) * var(--framer-font-size-scale, 1));
        }
    `,
    `
        .framer-image.framer-text {
            display: block;
            max-width: 100%;
            height: auto;
        }
    `,
    `
        .text-styles-preset-reset.framer-text {
            --framer-font-family: Inter, Inter Placeholder, sans-serif;
            --framer-font-style: normal;
            --framer-font-weight: 500;
            --framer-text-color: #000;
            --framer-font-size: 16px;
            --framer-letter-spacing: 0;
            --framer-text-transform: none;
            --framer-text-decoration: none;
            --framer-line-height: 1.2em;
            --framer-text-alignment: start;
        }
    `,
    `
        ol.framer-text {
            --list-style-type: decimal;
        }
    `,
    `
        ul.framer-text,
        ol.framer-text {
            display: table;
            width: 100%;
        }
    `,
    `
        li.framer-text {
            display: table-row;
            counter-increment: list-item;
            list-style: none;
        }
    `,
    `
        ol.framer-text > li.framer-text::before {
            display: table-cell;
            width: 2.25ch;
            box-sizing: border-box;
            padding-inline-end: 0.75ch;
            content: counter(list-item, var(--list-style-type)) ".";
            white-space: nowrap;
        }
    `,
    `
        ul.framer-text > li.framer-text::before {
            display: table-cell;
            width: 2.25ch;
            box-sizing: border-box;
            padding-inline-end: 0.75ch;
            content: "\u2022";
        }
    `,
    `
        .framer-text-module[style*="aspect-ratio"] > :first-child {
            width: 100%;
        }
    `,
    `
        @supports not (aspect-ratio: 1) {
            .framer-text-module[style*="aspect-ratio"] {
                position: relative;
            }
        }
    `,
    `
        @supports not (aspect-ratio: 1) {
            .framer-text-module[style*="aspect-ratio"]::before {
                content: "";
                display: block;
                padding-bottom: calc(100% / calc(var(--aspect-ratio)));
            }
        }
    `,
    `
        @supports not (aspect-ratio: 1) {
            .framer-text-module[style*="aspect-ratio"] > :first-child {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
            }
        }
    `,
  ],
  JL = new Set(),
  hp;
function YS(e, t, n = JL) {
  if (!(!e || n.has(e) || typeof document > "u")) {
    if ((n.add(e), !t)) {
      if (!hp) {
        let r = document.createElement("style");
        if (
          (r.setAttribute("type", "text/css"),
          r.setAttribute("data-framer-css", "true"),
          !document.head)
        ) {
          console.warn(
            "not injecting CSS: the document is missing a <head> element"
          );
          return;
        }
        if ((document.head.appendChild(r), r.sheet)) hp = r.sheet;
        else {
          console.warn(
            "not injecting CSS: injected <style> element does not have a sheet",
            r
          );
          return;
        }
      }
      t = hp;
    }
    try {
      t.insertRule(e, t.cssRules.length);
    } catch {}
  }
}
var eM = ["[data-framer-component-type] { position: absolute; }"],
  tM = `
[data-framer-component-type="Text"] > * {
    text-align: var(--framer-text-alignment, start);
}`,
  nM = `
[data-framer-component-type="Text"] span span,
[data-framer-component-type="Text"] p span,
[data-framer-component-type="Text"] h1 span,
[data-framer-component-type="Text"] h2 span,
[data-framer-component-type="Text"] h3 span,
[data-framer-component-type="Text"] h4 span,
[data-framer-component-type="Text"] h5 span,
[data-framer-component-type="Text"] h6 span {
    display: block;
}`,
  rM = `
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span {
    display: unset;
}`,
  iM = `
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    font-family: var(--font-family);
    font-style: var(--font-style);
    font-weight: min(calc(var(--framer-font-weight-increase, 0) + var(--font-weight, 400)), 900);
    color: var(--text-color);
    letter-spacing: var(--letter-spacing);
    font-size: var(--font-size);
    text-transform: var(--text-transform);
    text-decoration: var(--text-decoration);
    line-height: var(--line-height);
}`,
  oM = `
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    --font-family: var(--framer-font-family);
    --font-style: var(--framer-font-style);
    --font-weight: var(--framer-font-weight);
    --text-color: var(--framer-text-color);
    --letter-spacing: var(--framer-letter-spacing);
    --font-size: var(--framer-font-size);
    --text-transform: var(--framer-text-transform);
    --text-decoration: var(--framer-text-decoration);
    --line-height: var(--framer-line-height);
}`,
  sM = `
[data-framer-component-type="Text"] a,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] a span span span,
[data-framer-component-type="Text"] a p span span,
[data-framer-component-type="Text"] a h1 span span,
[data-framer-component-type="Text"] a h2 span span,
[data-framer-component-type="Text"] a h3 span span,
[data-framer-component-type="Text"] a h4 span span,
[data-framer-component-type="Text"] a h5 span span,
[data-framer-component-type="Text"] a h6 span span {
    --font-family: var(--framer-link-font-family, var(--framer-font-family));
    --font-style: var(--framer-link-font-style, var(--framer-font-style));
    --font-weight: var(--framer-link-font-weight, var(--framer-font-weight));
    --text-color: var(--framer-link-text-color, var(--framer-text-color));
    --font-size: var(--framer-link-font-size, var(--framer-font-size));
    --text-transform: var(--framer-link-text-transform, var(--framer-text-transform));
    --text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration));
}`,
  aM = `
[data-framer-component-type="Text"] a:hover,
[data-framer-component-type="Text"] a div span:hover,
[data-framer-component-type="Text"] a span span span:hover,
[data-framer-component-type="Text"] a p span span:hover,
[data-framer-component-type="Text"] a h1 span span:hover,
[data-framer-component-type="Text"] a h2 span span:hover,
[data-framer-component-type="Text"] a h3 span span:hover,
[data-framer-component-type="Text"] a h4 span span:hover,
[data-framer-component-type="Text"] a h5 span span:hover,
[data-framer-component-type="Text"] a h6 span span:hover {
    --font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration)));
}`,
  lM = `
[data-framer-component-type="Text"].isCurrent a,
[data-framer-component-type="Text"].isCurrent a div span,
[data-framer-component-type="Text"].isCurrent a span span span,
[data-framer-component-type="Text"].isCurrent a p span span,
[data-framer-component-type="Text"].isCurrent a h1 span span,
[data-framer-component-type="Text"].isCurrent a h2 span span,
[data-framer-component-type="Text"].isCurrent a h3 span span,
[data-framer-component-type="Text"].isCurrent a h4 span span,
[data-framer-component-type="Text"].isCurrent a h5 span span,
[data-framer-component-type="Text"].isCurrent a h6 span span {
    --font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration)));
}`,
  cM = [
    '[data-framer-component-type="Text"] { cursor: inherit; }',
    "[data-framer-component-text-autosized] * { white-space: pre; }",
    tM,
    nM,
    rM,
    iM,
    oM,
    sM,
    aM,
    lM,
  ],
  uM = `
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > *,
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-component-type],
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-legacy-stack-gap-enabled] > *,
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-legacy-stack-gap-enabled] > [data-framer-component-type] {
    position: relative;
}`,
  fM = [
    `[data-framer-stack-content-wrapper][data-framer-stack-gap-enabled="true"] {
        row-gap: var(--stack-native-row-gap);
        column-gap: var(--stack-native-column-gap);
    }`,
    `.${Ci} [data-framer-stack-content-wrapper][data-framer-stack-gap-enabled="true"] {
        row-gap: unset;
        column-gap: unset;
    }`,
  ],
  dM = `
.${Ci} [data-framer-legacy-stack-gap-enabled="true"] > *, [data-framer-legacy-stack-gap-enabled="true"][data-framer-stack-flexbox-gap="false"] {
    margin-top: calc(var(--stack-gap-y) / 2);
    margin-bottom: calc(var(--stack-gap-y) / 2);
    margin-right: calc(var(--stack-gap-x) / 2);
    margin-left: calc(var(--stack-gap-x) / 2);
}
`,
  hM = `
.${Ci}
[data-framer-stack-direction-reverse="false"]
[data-framer-legacy-stack-gap-enabled="true"]
> *:first-child,
[data-framer-stack-direction-reverse="false"]
[data-framer-legacy-stack-gap-enabled="true"][data-framer-stack-flexbox-gap="false"]
> *:first-child,
.${Ci}
[data-framer-stack-direction-reverse="true"]
[data-framer-legacy-stack-gap-enabled="true"]
> *:last-child,
[data-framer-stack-direction-reverse="true"]
[data-framer-legacy-stack-gap-enabled="true"][data-framer-stack-flexbox-gap="false"]
> *:last-child {
    margin-top: 0;
    margin-left: 0;
}`,
  pM = `
.${Ci}
[data-framer-stack-direction-reverse="false"]
[data-framer-legacy-stack-gap-enabled="true"]
> *:last-child,
[data-framer-stack-direction-reverse="false"]
[data-framer-legacy-stack-gap-enabled="true"][data-framer-stack-flexbox-gap="false"]
> *:last-child,
.${Ci}
[data-framer-stack-direction-reverse="true"]
[data-framer-legacy-stack-gap-enabled="true"]
> *:first-child,
[data-framer-stack-direction-reverse="true"]
[data-framer-legacy-stack-gap-enabled="true"][data-framer-stack-flexbox-gap="false"]
> *:first-child {
    margin-right: 0;
    margin-bottom: 0;
}`,
  mM = [uM, dM, ...fM, hM, pM],
  vM = [
    `
NavigationContainer
[data-framer-component-type="NavigationContainer"] > *,
[data-framer-component-type="NavigationContainer"] > [data-framer-component-type] {
    position: relative;
}`,
  ],
  gM = [
    '[data-framer-component-type="Scroll"]::-webkit-scrollbar { display: none; }',
    '[data-framer-component-type="ScrollContentWrapper"] > * { position: relative; }',
  ],
  yM = [
    '[data-framer-component-type="NativeScroll"] { -webkit-overflow-scrolling: touch; }',
    '[data-framer-component-type="NativeScroll"] > * { position: relative; }',
    '[data-framer-component-type="NativeScroll"].direction-both { overflow-x: scroll; overflow-y: scroll; }',
    '[data-framer-component-type="NativeScroll"].direction-vertical { overflow-x: hidden; overflow-y: scroll; }',
    '[data-framer-component-type="NativeScroll"].direction-horizontal { overflow-x: scroll; overflow-y: hidden; }',
    '[data-framer-component-type="NativeScroll"].direction-vertical > * { width: 100% !important; }',
    '[data-framer-component-type="NativeScroll"].direction-horizontal > * { height: 100% !important; }',
    '[data-framer-component-type="NativeScroll"].scrollbar-hidden::-webkit-scrollbar { display: none; }',
  ],
  bM = [
    '[data-framer-component-type="DeviceComponent"].no-device > * { width: 100% !important; height: 100% !important; }',
  ],
  xM = [
    '[data-framer-component-type="PageContentWrapper"] > *, [data-framer-component-type="PageContentWrapper"] > [data-framer-component-type] { position: relative; }',
  ],
  SM = [
    '[data-is-present="false"], [data-is-present="false"] * { pointer-events: none !important; }',
  ],
  wM = [
    '[data-framer-cursor="pointer"] { cursor: pointer; }',
    '[data-framer-cursor="grab"] { cursor: grab; }',
    '[data-framer-cursor="grab"]:active { cursor: grabbing; }',
  ],
  CM = [
    '[data-framer-component-type="Frame"] *, [data-framer-component-type="Stack"] * { pointer-events: auto; }',
    "[data-framer-generated] * { pointer-events: unset }",
  ],
  kM = [
    `[data-reset="button"] {
        border-width: 0;
        padding: 0;
        background: none;
}`,
  ],
  TM = [
    '[data-hide-scrollbars="true"]::-webkit-scrollbar { width: 0px; height: 0px; }',
    '[data-hide-scrollbars="true"]::-webkit-scrollbar-thumb { background: transparent; }',
  ],
  EM = (e) => (e ? CM : []),
  RM = [".svgContainer svg { display: block; }"],
  GS = (e) => [
    ...eM,
    ...cM,
    ...ZL,
    ...QL,
    ...mM,
    ...vM,
    ...gM,
    ...yM,
    ...xM,
    ...bM,
    ...SM,
    ...wM,
    ...EM(e),
    ...RM,
    ...kM,
    ...TM,
  ],
  PM = GS(!1),
  IM = GS(!0),
  T1 = !1;
function Ca() {
  if (T1) return;
  T1 = !0;
  let e = _e.current() === "PREVIEW" ? IM : PM;
  for (let t of e) YS(t, void 0, void 0);
}
function Yp(e) {
  return typeof e == "function";
}
function KS(e) {
  return typeof e == "boolean";
}
function Fe(e) {
  return typeof e == "string";
}
function mn(e) {
  return Number.isFinite(e);
}
function Gp(e) {
  return Array.isArray(e);
}
function Ae(e) {
  return e !== null && typeof e == "object" && !Gp(e);
}
function St(e) {
  return typeof e > "u";
}
function Ie(e) {
  return e === null;
}
function la(e) {
  return St(e) || Ie(e);
}
function qS(e) {
  return e instanceof Date && !isNaN(e.getTime());
}
function FM(e) {
  return Ae(e) || Yp(e);
}
var E1 = "optional";
function _M(e) {
  return !!e && E1 in e && e[E1] === !0;
}
function LM(e) {
  try {
    switch (e.type) {
      case "string":
      case "color":
      case "date":
      case "link":
      case "boxshadow":
        return Fe(e.defaultValue) ? e.defaultValue : void 0;
      case "boolean":
        return KS(e.defaultValue) ? e.defaultValue : void 0;
      case "enum":
        return St(e.defaultValue)
          ? void 0
          : e.options.includes(e.defaultValue)
          ? e.defaultValue
          : void 0;
      case "fusednumber":
      case "number":
        return mn(e.defaultValue) ? e.defaultValue : void 0;
      case "transition":
        return Ae(e.defaultValue) ? e.defaultValue : void 0;
      case "border":
        return Ae(e.defaultValue) ? e.defaultValue : void 0;
      case "font":
        return Ae(e.defaultValue) ? e.defaultValue : void 0;
      case "object": {
        let t = Ae(e.defaultValue) ? e.defaultValue : {};
        return Ae(e.controls) && QS(t, e.controls), t;
      }
      case "array":
        return Gp(e.defaultValue) ? e.defaultValue : void 0;
      case "file":
      case "image":
      case "richtext":
      case "pagescope":
      case "eventhandler":
      case "segmentedenum":
      case "responsiveimage":
      case "componentinstance":
      case "scrollsectionref":
      case "customcursor":
      case "cursor":
        return;
      default:
        return;
    }
  } catch {
    return;
  }
}
function QS(e, t) {
  for (let n in t) {
    let r = t[n];
    if (!r) continue;
    let i = e[n];
    if (!St(i) || _M(r)) continue;
    let o = LM(r);
    St(o) || (e[n] = o);
  }
}
function MM(e) {
  if (Ae(e.defaultProps)) return e.defaultProps;
  let t = {};
  return (e.defaultProps = t), t;
}
function OM(e, t) {
  if (!FM(e)) return;
  let n = MM(e);
  QS(n, t);
}
function lz(e, t) {
  Object.assign(e, { propertyControls: t }), OM(e, t);
}
function AM(e) {
  return e.propertyControls;
}
var _n = {
    iPhonePro: {
      screenRadius: 0,
      clayBezelLeft: 21,
      clayBezelRight: 21,
      clayBezelTop: 21,
      clayBezelBottom: 21,
      clayBezelRadius: 38 + 21,
    },
    iPhone8: {
      screenRadius: 0,
      clayBezelLeft: 24,
      clayBezelRight: 24,
      clayBezelTop: 96,
      clayBezelBottom: 96,
      clayBezelRadius: 38 * 1.5,
    },
    iPadPro: {
      screenRadius: 25,
      clayBezelLeft: 38,
      clayBezelRight: 38,
      clayBezelTop: 38,
      clayBezelBottom: 38,
      clayBezelRadius: 25 + 38,
    },
    desktop: {
      clayBezelLeft: 20,
      clayBezelRight: 20,
      clayBezelTop: 20,
      clayBezelBottom: 20,
      clayBezelRadius: 20,
    },
  },
  DM = [
    {
      id: "iphone-12",
      title: "iPhone 12",
      screenRadius: 0,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 390,
      screenHeight: 844,
      externalClay: {
        width: 500,
        height: 974,
        screenOffsetTop: 65,
        screenOffsetLeft: 55,
      },
      screenMask:
        '<g style="transform: scale(0.5);"><path d="M171.2 0c2.3 0 4 .5 5.4 1.3 1.6 1 2.8 2.2 3.7 3.8.8 1.6 1.2 2.3 1.2 4.9 0 12 2.2 19 6.2 26.5s9.8 13.3 17.3 17.4c7.5 4 15.8 6.1 30.6 6.1h311.5c14.3 0 22.5-2.2 29.9-6.1 7.5-4 13.3-10 17.3-17.4 4-7.5 6.2-14.5 6.2-26.5 0-2.6.4-3.2 1.1-4.9.8-1.6 2-2.9 3.4-3.8 1.4-.8 3.2-1.3 5.4-1.3h54.2c40.1 0 54.7 4.2 69.4 12a81.8 81.8 0 0134 34c7.8 14.7 12 29.3 12 69.4v1457.2c0 40.1-4.2 54.7-12 69.4a81.8 81.8 0 01-34 34c-14.7 7.8-29.3 12-69.4 12H115.4c-40.1 0-54.7-4.2-69.4-12a81.8 81.8 0 01-34-34c-7.8-14.7-12-29.3-12-69.4V115.4C0 75.3 4.2 60.7 12 46a81.8 81.8 0 0134-34C60.7 4.2 75.3 0 115.4 0h55.4z" fill="#000" fill-rule="evenodd"/></g>',
      realisticImage: {
        width: 490,
        height: 944,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#2E2C36" },
          { id: "white", title: "White", colorValue: "#F7F3F0" },
          { id: "blue", title: "Blue", colorValue: "#14496D" },
          { id: "green", title: "Green", colorValue: "#DAF0D9" },
          { id: "red", title: "Red", colorValue: "#DB4141" },
        ],
        handOffset: { left: 29, right: 29, bottom: 29 },
      },
    },
    {
      id: "iphone-12-mini",
      title: "iPhone 12 Mini",
      screenRadius: 0,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 360,
      screenHeight: 780,
      externalClay: {
        width: 450,
        height: 890,
        screenOffsetTop: 55,
        screenOffsetLeft: 45,
      },
      screenMask:
        '<g style="transform: scale(0.5);"><path d="M142 18c0 19 14 47 43 48h349c31 0 44-29 44-48 0-12 4-18 14-18h18c38 0 52 4 66 11 14 8 25 19 33 33v1c7 14 11 28 11 65v1340c0 38-4 52-11 66-8 14-19 25-33 33h-1c-14 7-28 11-65 11H110c-38 0-52-4-66-11-14-8-25-19-33-33v-1c-7-13-11-27-11-64V110c0-38 4-52 11-66 8-14 19-25 33-33h1C58 4 72 0 109 0h16c11 0 17 6 17 18z" fill="#000" fill-rule="evenodd"/></g>',
      realisticImage: {
        width: 460,
        height: 880,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#2E2C36" },
          { id: "white", title: "White", colorValue: "#F7F3F0" },
          { id: "blue", title: "Blue", colorValue: "#14496D" },
          { id: "green", title: "Green", colorValue: "#DAF0D9" },
          { id: "red", title: "Red", colorValue: "#DB4141" },
        ],
        handOffset: { left: 31.5, right: 30.5, bottom: 30 },
      },
    },
    {
      id: "iphone-12-pro",
      title: "iPhone 12 Pro",
      screenRadius: 0,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 390,
      screenHeight: 844,
      externalClay: {
        width: 494,
        height: 968,
        screenOffsetTop: 62,
        screenOffsetLeft: 52,
      },
      screenMask:
        '<g style="transform: scale(0.5);"><path d="M171.2 0c2.3 0 4 .5 5.4 1.3 1.6 1 2.8 2.2 3.7 3.8.8 1.6 1.2 2.3 1.2 4.9 0 12 2.2 19 6.2 26.5s9.8 13.3 17.3 17.4c7.5 4 15.8 6.1 30.6 6.1h311.5c14.3 0 22.5-2.2 29.9-6.1 7.5-4 13.3-10 17.3-17.4 4-7.5 6.2-14.5 6.2-26.5 0-2.6.4-3.2 1.1-4.9.8-1.6 2-2.9 3.4-3.8 1.4-.8 3.2-1.3 5.4-1.3h54.2c40.1 0 54.7 4.2 69.4 12a81.8 81.8 0 0134 34c7.8 14.7 12 29.3 12 69.4v1457.2c0 40.1-4.2 54.7-12 69.4a81.8 81.8 0 01-34 34c-14.7 7.8-29.3 12-69.4 12H115.4c-40.1 0-54.7-4.2-69.4-12a81.8 81.8 0 01-34-34c-7.8-14.7-12-29.3-12-69.4V115.4C0 75.3 4.2 60.7 12 46a81.8 81.8 0 0134-34C60.7 4.2 75.3 0 115.4 0h55.4z" fill="#000" fill-rule="evenodd"/></g>',
      realisticImage: {
        width: 490,
        height: 944,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "graphite", title: "Graphite", colorValue: "#585753" },
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "pacific-blue", title: "Pacific Blue", colorValue: "#415D6C" },
          { id: "gold", title: "Gold", colorValue: "#FCECD5" },
        ],
        handOffset: { left: 29, right: 29, bottom: 29 },
      },
    },
    {
      id: "iphone-12-pro-max",
      title: "iPhone 12 Pro Max",
      screenRadius: 50,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 428,
      screenHeight: 926,
      externalClay: {
        width: 532,
        height: 1050,
        screenOffsetTop: 62,
        screenOffsetLeft: 52,
      },
      screenMask:
        '<path d="M102 0c6 0 7 3 7 9 0 10 7 23 24 23h164c13 0 22-12 22-23 0-6 1-9 7-9h34c24 0 32 2 41 7s15 11 20 20 7 17 7 41v790c0 24-2 32-7 41s-11 15-20 20-17 7-41 7H68c-24 0-32-2-41-7s-15-11-20-20-7-17-7-41V68c0-24 2-32 7-41S18 12 27 7s17-7 41-7h34z" fill="#000" fill-rule="evenodd"/>',
      realisticImage: {
        width: 528,
        height: 1026,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "graphite", title: "Graphite", colorValue: "#585753" },
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "pacific-blue", title: "Pacific Blue", colorValue: "#415D6C" },
          { id: "gold", title: "Gold", colorValue: "#FCECD5" },
        ],
        handOffset: { left: 28.5, right: 28, bottom: 29 },
      },
    },
    {
      id: "iphone-11",
      title: "iPhone 11",
      screenRadius: 0,
      clayBezelLeft: 35.5,
      clayBezelRight: 35.5,
      clayBezelTop: 35.5,
      clayBezelBottom: 35.5,
      clayBezelRadius: 77,
      screenWidth: 414,
      screenHeight: 896,
      externalClay: {
        width: 524,
        height: 1026,
        screenOffsetTop: 65,
        screenOffsetLeft: 55,
      },
      screenMask:
        '<path d="M85.5 0C89.1 0 92 3 92 6.5c.3 6 1.5 10 3.4 13.5 2.2 4.1 5.5 7.4 9.6 9.6 4.2 2.2 8.9 3.4 17 3.4h170c8.1 0 12.8-1.2 17-3.4 4.1-2.2 7.4-5.5 9.6-9.6A31 31 0 00322 6.5c0-3.6 3-6.5 6.5-6.5h32.3c18.5 0 25.2 2 32 5.5 6.7 3.7 12 9 15.7 15.7 3.6 6.8 5.5 13.5 5.5 32v789.6c0 18.5-2 25.2-5.5 32-3.7 6.7-9 12-15.7 15.7-6.8 3.6-13.5 5.5-32 5.5H53.2c-18.5 0-25.2-2-32-5.5-6.7-3.7-12-9-15.7-15.7C2 868 0 861.3 0 842.8V53.2c0-18.5 2-25.2 5.5-32 3.7-6.7 9-12 15.7-15.7C28 2 34.7 0 53.2 0h32.3z" fill="#000" fill-rule="nonzero"/>',
      realisticImage: {
        width: 514,
        height: 996,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#202120" },
          { id: "white", title: "White", colorValue: "#F9F6EF" },
          { id: "purple", title: "Purple", colorValue: "#D1CDDB" },
          { id: "green", title: "Green", colorValue: "#ADE0CD" },
          { id: "red", title: "Red", colorValue: "#B90D2E" },
          { id: "yellow", title: "Yellow", colorValue: "#FFE680" },
        ],
        handOffset: { left: 14.5, right: 14.5, bottom: 14.5 },
      },
    },
    {
      id: "iphone-11-pro",
      title: "iPhone 11 Pro",
      ..._n.iPhonePro,
      screenWidth: 375,
      screenHeight: 812,
      externalClay: {
        width: 485,
        height: 942,
        screenOffsetTop: 65,
        screenOffsetLeft: 55,
      },
      screenMask:
        '<path d="M292 8.668V9c0 9.266-7.07 21-23.332 21h-162C90.402 30 83.332 18.266 83.332 9v-.332c0-4.285 0-8.668-7.664-8.668H43.332C16.312 0 0 16.313 0 43.332v725.336C0 795.688 16.313 812 43.332 812h288.336c27.02 0 43.332-16.313 43.332-43.332V43.332C375 16.312 358.687 0 331.668 0h-32C292 0 292 4.383 292 8.668zm0 0"/>',
      realisticImage: {
        width: 475,
        height: 912,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#52514F" },
          { id: "silver", title: "Silver", colorValue: "#EBEBE3" },
          { id: "gold", title: "Gold", colorValue: "#FBD7BD" },
          {
            id: "midnight-green",
            title: "Midnight Green",
            colorValue: "#4F5850",
          },
        ],
        handOffset: { left: 24.5, right: 24.5, bottom: 23.5 },
      },
    },
    {
      id: "iphone-11-pro-max",
      title: "iPhone 11 Pro Max",
      ..._n.iPhonePro,
      screenWidth: 414,
      screenHeight: 896,
      externalClay: {
        width: 524,
        height: 1026,
        screenOffsetTop: 65,
        screenOffsetLeft: 55,
      },
      screenMask:
        '<path d="M96 0c3.313 0 5.91 2.688 6 6 .18 6.645 1.191 10.148 2.938 13.41 1.917 3.586 4.73 6.402 8.316 8.317 3.586 1.918 7.441 2.941 15.445 2.941h156.602c8.004 0 11.86-1.023 15.445-2.941 3.586-1.915 6.399-4.73 8.317-8.317 1.746-3.265 2.746-6.758 2.937-13.41.094-3.313 2.688-6 6-6h46.004c17.387 0 23.687 1.809 30.043 5.21 6.355 3.4 11.344 8.388 14.742 14.743C412.191 26.31 414 32.61 414 49.996v796.008c0 17.387-1.809 23.687-5.21 30.043-3.4 6.355-8.388 11.344-14.743 14.742-6.356 3.402-12.656 5.211-30.043 5.211H49.996c-17.387 0-23.687-1.809-30.043-5.21-6.355-3.4-11.344-8.388-14.742-14.743C1.809 869.69 0 863.39 0 846.004V49.996C0 32.61 1.809 26.31 5.21 19.953c3.4-6.355 8.388-11.344 14.743-14.742C26.31 1.809 32.61 0 49.996 0zm0 0"/>',
      realisticImage: {
        width: 514,
        height: 996,
        screenOffsetLeft: 50,
        screenOffsetTop: 50,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#52514F" },
          { id: "silver", title: "Silver", colorValue: "#EBEBE3" },
          { id: "gold", title: "Gold", colorValue: "#FBD7BD" },
          {
            id: "midnight-green",
            title: "Midnight Green",
            colorValue: "#4F5850",
          },
        ],
        handOffset: { left: 23.5, right: 24.5, bottom: 24 },
      },
    },
    {
      id: "iphone-8",
      title: "iPhone 8",
      ..._n.iPhone8,
      screenWidth: 375,
      screenHeight: 667,
      externalClay: {
        width: 491,
        height: 971,
        screenOffsetLeft: 58,
        screenOffsetTop: 152,
      },
      realisticImage: {
        width: 475,
        height: 927,
        screenOffsetLeft: 50,
        screenOffsetTop: 130,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#28282A" },
          { id: "silver", title: "Silver", colorValue: "#DFE1E2" },
          { id: "gold", title: "Gold", colorValue: "#F6E6DB" },
        ],
        handOffset: { left: 22, right: 22, bottom: 18.5 },
      },
    },
    {
      id: "iphone-8-plus",
      title: "iPhone 8 Plus",
      ..._n.iPhone8,
      screenWidth: 414,
      screenHeight: 736,
      externalClay: {
        width: 530,
        height: 1064,
        screenOffsetLeft: 58,
        screenOffsetTop: 164,
      },
      realisticImage: {
        width: 514,
        height: 996,
        screenOffsetLeft: 50,
        screenOffsetTop: 130,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#28282A" },
          { id: "silver", title: "Silver", colorValue: "#DFE1E2" },
          { id: "gold", title: "Gold", colorValue: "#F6E6DB" },
        ],
        handOffset: { left: 21, right: 20.5, bottom: 19 },
      },
    },
    {
      id: "iphone-se",
      title: "iPhone SE",
      screenWidth: 320,
      screenHeight: 568,
      screenRadius: 0,
      clayBezelLeft: 20,
      clayBezelRight: 20,
      clayBezelTop: 112,
      clayBezelBottom: 112,
      clayBezelRadius: 38 * 1.5,
      externalClay: {
        width: 436,
        height: 872,
        screenOffsetLeft: 58,
        screenOffsetTop: 152,
      },
      realisticImage: {
        width: 420,
        height: 828,
        screenOffsetLeft: 50,
        screenOffsetTop: 130,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
          { id: "gold", title: "Gold", colorValue: "#EFD8BD" },
          { id: "rose-gold", title: "Rose Gold", colorValue: "#F7CFCA" },
        ],
        handOffset: { left: 22, right: 22, bottom: 26.5 },
      },
    },
    {
      id: "samsung-galaxy-s7",
      title: "Samsung Galaxy S7",
      screenRadius: 0,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 360,
      screenHeight: 640,
      externalClay: {
        width: 454,
        height: 880,
        screenOffsetTop: 120,
        screenOffsetLeft: 47,
      },
      realisticImage: {
        width: 440,
        height: 860,
        screenOffsetLeft: 40,
        screenOffsetTop: 110,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#2E2C36" },
          { id: "white", title: "White", colorValue: "#F7F3F0" },
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "gold", title: "Gold", colorValue: "#FCECD5" },
        ],
        handOffset: { left: 26, right: 25.5, bottom: 32 },
      },
    },
    {
      id: "samsung-note-10",
      title: "Samsung Note 10",
      screenWidth: 360,
      screenHeight: 760,
      screenRadius: 10,
      clayBezelLeft: 7,
      clayBezelRight: 7,
      clayBezelTop: 15,
      clayBezelBottom: 15,
      clayBezelRadius: 15,
    },
    {
      id: "pixel-5",
      title: "Google Pixel 5",
      screenRadius: 31,
      clayBezelLeft: 22,
      clayBezelRight: 22,
      clayBezelTop: 22,
      clayBezelBottom: 22,
      clayBezelRadius: 66,
      screenWidth: 360,
      screenHeight: 780,
      externalClay: {
        width: 460,
        height: 900,
        screenOffsetTop: 60,
        screenOffsetLeft: 50,
      },
      realisticImage: {
        width: 920 / 2,
        height: 1760 / 2,
        screenOffsetLeft: 100 / 2,
        screenOffsetTop: 100 / 2,
        availableColors: [
          { id: "just-black", title: "Just Black", colorValue: "#2E2C36" },
          { id: "sorta-sage", title: "Sorta Sage", colorValue: "#B7C9C0" },
        ],
        handOffset: { left: 31.5, right: 31, bottom: 31 },
      },
    },
    {
      id: "pixel-4",
      title: "Google Pixel 4",
      screenWidth: 360,
      screenHeight: 760,
      screenRadius: 34,
      clayBezelLeft: 10,
      clayBezelRight: 10,
      clayBezelTop: 50,
      clayBezelBottom: 25,
      clayBezelRadius: 50,
      externalClay: {
        width: 460,
        height: 938,
        screenOffsetLeft: 50,
        screenOffsetTop: 89,
      },
      realisticImage: {
        width: 460,
        height: 920,
        screenOffsetLeft: 50,
        screenOffsetTop: 80,
        availableColors: [
          {
            id: "clearly-white",
            title: "Clearly White",
            colorValue: "#EAEDF2",
          },
          { id: "just-black", title: "Just Black", colorValue: "#1A1A1A" },
          { id: "oh-so-orange", title: "Oh So Orange", colorValue: "#FF7A68" },
        ],
        handOffset: { left: 35.5, right: 35.5, bottom: 57 },
      },
    },
    {
      id: "macbook-air",
      title: "MacBook Air",
      screenWidth: 1440,
      screenHeight: 900,
      disableRotation: !0,
      externalClay: {
        width: 1890,
        height: 1125,
        screenOffsetLeft: 225,
        screenOffsetTop: 98,
      },
      realisticImage: {
        width: 3848 / 2,
        height: 2240 / 2,
        screenOffsetLeft: 484 / 2,
        screenOffsetTop: 196 / 2,
        availableColors: [
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "space-grey", title: "Space Grey", colorValue: "#B1B5B7" },
          { id: "gold", title: "Gold", colorValue: "#FCECD5" },
        ],
      },
    },
    {
      id: "macbook-pro-13",
      title: 'MacBook Pro 13"',
      screenWidth: 1440,
      screenHeight: 900,
      disableRotation: !0,
      externalClay: {
        width: 1914,
        height: 1169,
        screenOffsetLeft: 236,
        screenOffsetTop: 109,
      },
      realisticImage: {
        width: 3916 / 2,
        height: 2330 / 2,
        screenOffsetLeft: 518 / 2,
        screenOffsetTop: 218 / 2,
        availableColors: [
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "space-grey", title: "Space Grey", colorValue: "#B1B5B7" },
        ],
      },
    },
    {
      id: "macbook-pro-16",
      title: 'MacBook Pro 16"',
      screenWidth: 1536,
      screenHeight: 960,
      disableRotation: !0,
      externalClay: {
        width: 1984,
        height: 1179,
        screenOffsetLeft: 225,
        screenOffsetTop: 78,
      },
      realisticImage: {
        width: 4032 / 2,
        height: 2348 / 2,
        screenOffsetLeft: 480 / 2,
        screenOffsetTop: 148 / 2,
        availableColors: [
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "space-grey", title: "Space Grey", colorValue: "#B1B5B7" },
        ],
      },
    },
    {
      id: "imac-21-5",
      title: 'iMac 21.5"',
      screenWidth: 2048,
      screenHeight: 1152,
      disableRotation: !0,
      externalClay: {
        width: 2288,
        height: 1892,
        screenOffsetLeft: 120,
        screenOffsetTop: 120,
      },
      realisticImage: {
        width: 4562 / 2,
        height: 3796 / 2,
        screenOffsetLeft: 232 / 2,
        screenOffsetTop: 244 / 2,
      },
    },
    {
      id: "imac-27",
      title: 'iMac 27"',
      screenWidth: 2560,
      screenHeight: 1440,
      disableRotation: !0,
      externalClay: {
        width: 2848,
        height: 2351,
        screenOffsetLeft: 144,
        screenOffsetTop: 151,
      },
      realisticImage: {
        width: 5676 / 2,
        height: 4720 / 2,
        screenOffsetLeft: 278 / 2,
        screenOffsetTop: 292 / 2,
        availableColors: [
          { id: "silver", title: "Silver", colorValue: "#E5E6E1" },
          { id: "pro", title: "Pro", colorValue: "#5F5E63" },
        ],
      },
    },
    {
      id: "pro-display-xdr",
      title: "Pro Display XDR",
      screenWidth: 3008,
      screenHeight: 1692,
      disableRotation: !0,
      externalClay: {
        width: 3148,
        height: 2325,
        screenOffsetLeft: 70,
        screenOffsetTop: 60,
      },
      realisticImage: {
        width: 6276 / 2,
        height: 4695 / 2,
        screenOffsetLeft: 130 / 2,
        screenOffsetTop: 130 / 2,
      },
    },
    {
      id: "dell-xps",
      title: "Dell XPS",
      screenWidth: 1920,
      screenHeight: 1080,
      disableRotation: !0,
      externalClay: {
        width: 2624,
        height: 1381,
        screenOffsetLeft: 352,
        screenOffsetTop: 57,
      },
      realisticImage: {
        width: 5412 / 2,
        height: 2746 / 2,
        screenOffsetLeft: 786 / 2,
        screenOffsetTop: 108 / 2,
      },
    },
    {
      id: "surface-book",
      title: "Microsoft Surface Book",
      screenWidth: 1500,
      screenHeight: 1e3,
      disableRotation: !0,
      externalClay: {
        width: 2089,
        height: 1234,
        screenOffsetLeft: 296,
        screenOffsetTop: 93,
      },
      realisticImage: {
        width: 4200 / 2,
        height: 2508 / 2,
        screenOffsetLeft: 600 / 2,
        screenOffsetTop: 210 / 2,
      },
    },
    {
      id: "ipad",
      title: "iPad",
      screenRadius: 0,
      screenWidth: 810,
      screenHeight: 1080,
      clayBezelLeft: 30,
      clayBezelRight: 30,
      clayBezelTop: 95,
      clayBezelBottom: 95,
      clayBezelRadius: 0,
      externalClay: {
        width: 966,
        height: 1378,
        screenOffsetLeft: 78,
        screenOffsetTop: 149,
      },
      realisticImage: {
        width: 1920 / 2,
        height: 2720 / 2,
        screenOffsetLeft: 75,
        screenOffsetTop: 140,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
          { id: "gold", title: "Gold", colorValue: "#EFD8BD" },
        ],
      },
    },
    {
      id: "ipad-mini",
      title: "iPad Mini",
      screenRadius: 0,
      clayBezelLeft: 49,
      clayBezelRight: 49,
      clayBezelTop: 49,
      clayBezelBottom: 49,
      clayBezelRadius: 49,
      screenWidth: 768,
      screenHeight: 1024,
      externalClay: {
        width: 924,
        height: 1384,
        screenOffsetLeft: 78,
        screenOffsetTop: 180,
      },
      realisticImage: {
        width: 1856 / 2,
        height: 2728 / 2,
        screenOffsetLeft: 160 / 2,
        screenOffsetTop: 340 / 2,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
          { id: "gold", title: "Gold", colorValue: "#EFD8BD" },
        ],
      },
    },
    {
      id: "ipad-air",
      title: "iPad Air",
      screenRadius: 18,
      clayBezelLeft: 49,
      clayBezelRight: 49,
      clayBezelTop: 49,
      clayBezelBottom: 49,
      clayBezelRadius: 49,
      screenWidth: 820,
      screenHeight: 1180,
      externalClay: {
        width: 994,
        height: 1374,
        screenOffsetLeft: 87,
        screenOffsetTop: 97,
      },
      realisticImage: {
        width: 1960 / 2,
        height: 2680 / 2,
        screenOffsetLeft: 160 / 2,
        screenOffsetTop: 160 / 2,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
          { id: "rose-gold", title: "Rose Gold", colorValue: "#ECCBC4" },
          { id: "blue", title: "Blue", colorValue: "#CBDAE6" },
          { id: "green", title: "Green", colorValue: "#DAF0D9" },
        ],
      },
    },
    {
      id: "ipad-pro-11",
      title: "iPad Pro 11\u2033",
      screenRadius: 17,
      clayBezelLeft: 49,
      clayBezelRight: 49,
      clayBezelTop: 49,
      clayBezelBottom: 49,
      clayBezelRadius: 49,
      screenWidth: 834,
      screenHeight: 1194,
      externalClay: {
        width: 990,
        height: 1370,
        screenOffsetLeft: 78,
        screenOffsetTop: 88,
      },
      realisticImage: {
        width: 1968 / 2,
        height: 2688 / 2,
        screenOffsetLeft: 75,
        screenOffsetTop: 75,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
        ],
      },
    },
    {
      id: "ipad-pro-12-9",
      title: "iPad Pro 12.9\u2033",
      ..._n.iPadPro,
      screenRadius: 17,
      screenWidth: 1024,
      screenHeight: 1366,
      externalClay: {
        width: 1180,
        height: 1542,
        screenOffsetLeft: 78,
        screenOffsetTop: 88,
      },
      realisticImage: {
        width: 2348 / 2,
        height: 3032 / 2,
        screenOffsetLeft: 75,
        screenOffsetTop: 75,
        availableColors: [
          { id: "space-grey", title: "Space Grey", colorValue: "#C3C4C8" },
          { id: "silver", title: "Silver", colorValue: "#E1E2E4" },
        ],
      },
    },
    {
      id: "surface-3",
      title: "Microsoft Surface 3",
      screenRadius: 0,
      clayBezelLeft: 49,
      clayBezelRight: 49,
      clayBezelTop: 49,
      clayBezelBottom: 49,
      clayBezelRadius: 49,
      screenWidth: 960,
      screenHeight: 640,
      externalClay: {
        width: 1184,
        height: 864,
        screenOffsetLeft: 112,
        screenOffsetTop: 112,
      },
      realisticImage: {
        width: 2280 / 2,
        height: 1580 / 2,
        screenOffsetLeft: 180 / 2,
        screenOffsetTop: 150 / 2,
      },
    },
    {
      id: "surface-pro-4",
      title: "Microsoft Surface Pro 4",
      screenRadius: 0,
      clayBezelLeft: 49,
      clayBezelRight: 49,
      clayBezelTop: 49,
      clayBezelBottom: 49,
      clayBezelRadius: 49,
      screenWidth: 1368,
      screenHeight: 912,
      externalClay: {
        width: 1592,
        height: 1136,
        screenOffsetLeft: 112,
        screenOffsetTop: 112,
      },
      realisticImage: {
        width: 3176 / 2,
        height: 2224 / 2,
        screenOffsetLeft: 220 / 2,
        screenOffsetTop: 200 / 2,
      },
    },
    {
      id: "apple-watch-44",
      title: "Apple Watch 44mm",
      screenRadius: 33,
      screenWidth: 184,
      screenHeight: 224,
      disableRotation: !0,
      externalClay: {
        width: 298,
        height: 502,
        screenOffsetLeft: 57,
        screenOffsetTop: 129,
      },
      realisticImage: {
        width: 548 / 2,
        height: 908 / 2,
        screenOffsetLeft: 90 / 2,
        screenOffsetTop: 230 / 2,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#2E2C36" },
          { id: "white", title: "White", colorValue: "#F7F3F0" },
          { id: "yellow", title: "Yellow", colorValue: "#FDDC6C" },
          { id: "orange", title: "Orange", colorValue: "#F35C56" },
        ],
      },
    },
    {
      id: "apple-watch-40",
      title: "Apple Watch 40mm",
      screenRadius: 27,
      screenWidth: 162,
      screenHeight: 197,
      disableRotation: !0,
      externalClay: {
        width: 280,
        height: 463,
        screenOffsetLeft: 59,
        screenOffsetTop: 124,
      },
      realisticImage: {
        width: 504 / 2,
        height: 854 / 2,
        screenOffsetLeft: 90 / 2,
        screenOffsetTop: 230 / 2,
        availableColors: [
          { id: "black", title: "Black", colorValue: "#2E2C36" },
          { id: "white", title: "White", colorValue: "#F7F3F0" },
          { id: "yellow", title: "Yellow", colorValue: "#FDDC6C" },
          { id: "orange", title: "Orange", colorValue: "#F35C56" },
        ],
      },
    },
    {
      id: "tv-full-hd",
      title: "Full HD",
      screenRadius: 0,
      screenWidth: 1920,
      screenHeight: 1080,
      externalClay: {
        width: 1968,
        height: 1168,
        screenOffsetLeft: 24,
        screenOffsetTop: 12,
      },
      realisticImage: {
        width: 4040 / 2,
        height: 2360 / 2,
        screenOffsetLeft: 100 / 2,
        screenOffsetTop: 100 / 2,
      },
    },
    {
      id: "tv-4k",
      title: "4K",
      screenRadius: 0,
      screenWidth: 3840,
      screenHeight: 2160,
      externalClay: {
        width: 3908,
        height: 2308,
        screenOffsetLeft: 34,
        screenOffsetTop: 24,
      },
      realisticImage: {
        width: 7960 / 2,
        height: 4600 / 2,
        screenOffsetLeft: 140 / 2,
        screenOffsetTop: 140 / 2,
      },
    },
    {
      id: "720p",
      title: "720p",
      ..._n.desktop,
      screenWidth: 720,
      screenHeight: 1280,
    },
    {
      id: "900p",
      title: "900p",
      ..._n.desktop,
      screenWidth: 900,
      screenHeight: 1440,
    },
    {
      id: "1080p",
      title: "1080p",
      ..._n.desktop,
      screenWidth: 1080,
      screenHeight: 1920,
    },
    {
      id: "1440p",
      title: "1440p",
      ..._n.desktop,
      screenWidth: 1440,
      screenHeight: 2560,
    },
    {
      id: "4k",
      title: "4K",
      ..._n.desktop,
      screenWidth: 2160,
      screenHeight: 3840,
    },
  ];
var cz = DM.reduce((e, t) => ((e[t.id] = t), e), {});
var Ve = (e) => e;
function VM(e) {
  let t = Object.create(Object.prototype);
  return (n) => (t[n] === void 0 && (t[n] = e(n)), t[n]);
}
var BM =
    /^(?:children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|[dkrxyz]|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y1|y2|yChannelSelector|zoomAndPan|for|class|autofocus|(?:[Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*)$/,
  HM = VM(
    (e) =>
      BM.test(e) ||
      (e.charCodeAt(0) === 111 &&
        e.charCodeAt(1) === 110 &&
        e.charCodeAt(2) < 91)
  ),
  ZS = b.createContext(void 0),
  vz = ZS.Provider,
  zM = () => b.useContext(ZS) ?? {},
  NM = Yt(zp(), 1),
  tn = typeof qe < "u" ? qe : void 0,
  $r = () => typeof document == "object";
var $M = () => {
    let e = -1,
      n = tn && /Version\/([\d.]+)/.exec(tn.userAgent);
    return n && n[1] && (e = parseFloat(n[1])), e;
  },
  jM = () =>
    tn && /Chrome/.test(tn.userAgent) && /Google Inc/.test(tn.vendor) && !UM(),
  JS = () =>
    tn && /Safari/.test(tn.userAgent) && /Apple Computer/.test(tn.vendor);
var WM = () => tn && /FramerX/.test(tn.userAgent),
  UM = () => tn && /Edg\//.test(tn.userAgent);
var ew = () => NM.default.env.NODE_ENV === "test";
var R1 = (e) => () => {
    sa(e);
  },
  XM = () => () => {},
  YM = {
    useImageSource(e) {
      return e.src ?? "";
    },
    useImageElement(e, t, n) {
      let r = new Image();
      return (
        (r.src = Ke.useImageSource(e, t, n)),
        e.srcSet && (r.srcset = e.srcSet),
        r
      );
    },
    canRenderOptimizedCanvasImage() {
      return !1;
    },
  },
  GM = !1,
  KM = {
    get(e, t, n) {
      return Reflect.has(e, t)
        ? Reflect.get(e, t, n)
        : ["getLogger"].includes(String(t))
        ? XM()
        : R1(
            GM
              ? `${String(t)} is not available in this version of Framer.`
              : `${String(
                  t
                )} is only available inside of Framer. https://www.framer.com/`
          );
    },
  },
  Ke = new Proxy(YM, KM);
function qM(e, t, n = 1) {
  let { width: r, height: i } = t,
    o = e.pixelWidth ?? e.intrinsicWidth ?? 0,
    s = e.pixelHeight ?? e.intrinsicHeight ?? 0;
  if (r < 1 || i < 1 || o < 1 || s < 1) return;
  (r *= n), (i *= n);
  let a = r / i,
    l = o / s;
  switch (e.fit) {
    case "fill":
      return l > a ? s / i : o / r;
    case "fit":
    case "stretch":
      return Math.max(o / r, s / i);
  }
}
function P1(e, t) {
  return t && Math.max(1, e) > t ? "pixelated" : "auto";
}
var I1 = {
    position: "absolute",
    borderRadius: "inherit",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  QM = {
    backgroundSize: "16px 16px",
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(180, 180, 180, 0.8) 0, rgba(180, 180, 180, 0.8) 1px, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0.2) 50%)",
    border: "1px solid #c4c4c4",
  };
function ZM(e) {
  switch (e) {
    case "fit":
      return "contain";
    case "stretch":
      return "fill";
    default:
      return "cover";
  }
}
function tw(e, t) {
  let n = e ?? "center",
    r = t ?? "center";
  return n === "center" && r === "center" ? "center" : n + " " + r;
}
function JM(e, t) {
  if (!t) return "auto";
  let n = _e.current() === "CANVAS" ? De.devicePixelRatio : 1,
    r = qM(e, t, n);
  return _e.current() === "CANVAS" ? P1(1, r) : P1(Zc.zoom, r);
}
function Kp(e, t) {
  return {
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    objectPosition: tw(e.positionX, e.positionY),
    objectFit: ZM(e.fit),
    imageRendering: JM(e, t),
  };
}
function eO({ image: e, containerSize: t, nodeId: n, alt: r }) {
  let i = Ke.useImageSource(e, t, n),
    o = Kp(e, t),
    [s, a] = b.useState(),
    l = b.useRef(null),
    c = zM();
  return (
    b.useEffect(() => {
      if (!c.imgSizesWorkaroundEnabled) return;
      let u = l.current;
      if (!u || ew() || !e.sizes || !u.closest("[data-framer-name]")) return;
      let d = u.clientWidth,
        h = Number(e.sizes.replace("px", ""));
      (!isNaN(h) && d < h) || a(d + "px");
    }, [e.sizes]),
    T("img", {
      ref: l,
      decoding: "async",
      loading: e.loading,
      sizes: s ?? e.sizes,
      srcSet: e.srcSet,
      src: i,
      alt: r ?? e.alt,
      style: o,
    })
  );
}
function tO({ image: e, containerSize: t, nodeId: n }) {
  let r = b.useRef(null),
    i = Ke.useImageElement(e, t, n),
    o = Kp(e, t);
  return (
    b.useLayoutEffect(() => {
      let s = r.current;
      if (s !== null)
        return (
          s.appendChild(i),
          () => {
            s.removeChild(i);
          }
        );
    }, [i]),
    Object.assign(i.style, o),
    T("div", {
      ref: r,
      style: { display: "contents", borderRadius: "inherit" },
    })
  );
}
function nO({ nodeId: e, image: t, containerSize: n }) {
  let r = b.useRef(null),
    i = Ke.useImageSource(t, n, e);
  return (
    b.useLayoutEffect(() => {
      let o = r.current;
      if (o === null) return;
      let s = Kp(t, n);
      Ke.renderOptimizedCanvasImage(o, i, s, e);
    }, [e, t, i, n]),
    T("div", {
      ref: r,
      style: { display: "contents", borderRadius: "inherit" },
    })
  );
}
function nw({ layoutId: e, image: t, ...n }) {
  e && (e = e + "-background");
  let r = { ...I1, ...QM },
    i = null;
  if (Fe(t.src))
    if (t.fit === "tile" && t.pixelWidth && t.pixelHeight) {
      let o = mn(t.backgroundSize) ? t.backgroundSize : 1,
        s = {
          width: Math.round(o * t.pixelWidth),
          height: Math.round(o * t.pixelHeight),
        },
        a = Ke.useImageSource(t, s);
      (r.backgroundImage = `url(${a})`),
        (r.backgroundRepeat = "repeat"),
        (r.backgroundPosition = tw(t.positionX, t.positionY)),
        t.pixelWidth &&
          (r.backgroundSize = `${(o * (t.pixelWidth / 2)).toFixed(2)}px auto`),
        (r.border = 0),
        (i = null);
    } else
      _e.current() !== "CANVAS"
        ? (i = T(eO, { image: t, ...n }))
        : Ke.canRenderOptimizedCanvasImage(Ke.useImageSource(t))
        ? (i = T(nO, { image: t, ...n }))
        : (i = T(tO, { image: t, ...n }));
  return T(Ot.div, {
    layoutId: e,
    style: i ? I1 : r,
    "data-framer-background-image-wrapper": !0,
    children: i,
  });
}
var rO = "src",
  nr;
((e) => {
  e.isImageObject = function (t) {
    return !t || typeof t == "string" ? !1 : rO in t;
  };
})(nr || (nr = {}));
function iO(e, t) {
  let { _forwardedOverrideId: n, _forwardedOverrides: r, id: i } = t,
    o = n ?? i,
    s = r && o ? r[o] : void 0;
  return s && typeof s == "string" && (e = { ...e, src: s }), e;
}
function oO(e) {
  let { background: t, image: n } = e;
  if (n !== void 0 && t && !nr.isImageObject(t)) return;
  let r = null;
  if (
    (Fe(n) ? (r = { alt: "", src: n }) : (r = He.get(t, null)),
    !!nr.isImageObject(r))
  )
    return iO(r, e);
}
function sO(e, t, n = !0) {
  let { borderWidth: r, borderStyle: i, borderColor: o } = e;
  if (!r) return;
  let s, a, l, c;
  if (
    (typeof r == "number"
      ? (s = a = l = c = r)
      : ((s = r.top || 0),
        (a = r.bottom || 0),
        (l = r.left || 0),
        (c = r.right || 0)),
    !(s === 0 && a === 0 && l === 0 && c === 0))
  ) {
    if (n && s === a && s === l && s === c) {
      t.border = `${s}px ${i} ${o}`;
      return;
    }
    (t.borderStyle = e.borderStyle),
      (t.borderColor = e.borderColor),
      (t.borderTopWidth = `${s}px`),
      (t.borderBottomWidth = `${a}px`),
      (t.borderLeftWidth = `${l}px`),
      (t.borderRightWidth = `${c}px`);
  }
}
function aO(e) {
  let t = e.layoutId ? `${e.layoutId}-border` : void 0;
  if (!e.borderWidth) return null;
  let n = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
  };
  return e.border
    ? ((n.border = e.border), T(Ot.div, { style: n }))
    : (sO(e, n, !1),
      T(Ot.div, { "data-frame-border": !0, style: n, layoutId: t }));
}
function uu(e) {
  return e && e !== "search" && e !== "slot" && e !== "template"
    ? Ot[e]
    : Ot.div;
}
var lO = jM();
function rw(e) {
  let t = {};
  return (
    !lO ||
      _e.current() !== "CANVAS" ||
      ((e === !0 || e === "x") && (t["data-framer-layout-hint-center-x"] = !0),
      (e === !0 || e === "y") && (t["data-framer-layout-hint-center-y"] = !0)),
    t
  );
}
function qp(e) {
  return e.replace(/^id_/, "").replace(/\\/g, "");
}
function cO(e, t) {
  if (!t && ((t = e.children), !t)) return { props: e, children: t };
  let n = e._forwardedOverrides,
    r = e._overrideForwardingDescription;
  if (r) {
    n = void 0;
    for (let i in r) {
      let o = r[i];
      e[o] !== void 0 &&
        (n || ((n = {}), (e = { ...e })), (n[i] = e[o]), delete e[o]);
    }
  }
  return n
    ? ((t = b.Children.map(t, (i) =>
        b.isValidElement(i) ? b.cloneElement(i, { _forwardedOverrides: n }) : i
      )),
      { props: e, children: t })
    : { props: e, children: t };
}
function fu(e) {
  return (t, n) =>
    e === !0
      ? `translate(-50%, -50%) ${n}`
      : e === "x"
      ? `translateX(-50%) ${n}`
      : e === "y"
      ? `translateY(-50%) ${n}`
      : n || "none";
}
function ka(e, { specificLayoutId: t, postfix: n } = {}) {
  let {
      name: r,
      layoutIdKey: i,
      duplicatedFrom: o,
      __fromCodeComponentNode: s = !1,
      drag: a,
    } = e,
    { getLayoutId: l, enabled: c } = M(Ro);
  return fe(() => {
    if (!c) return e.layoutId;
    let u = t || e.layoutId;
    if (!u && (a || !i || s)) return;
    let f = u || l({ id: i, name: r, duplicatedFrom: o });
    if (f) return n ? `${f}-${n}` : f;
  }, [c]);
}
var iw = typeof document < "u" ? or : W,
  Fo = b.createContext(!1),
  bi = [],
  uO = function () {
    return bi.some(function (e) {
      return e.activeTargets.length > 0;
    });
  },
  fO = function () {
    return bi.some(function (e) {
      return e.skippedTargets.length > 0;
    });
  },
  F1 = "ResizeObserver loop completed with undelivered notifications.",
  dO = function () {
    var e;
    typeof ErrorEvent == "function"
      ? (e = new ErrorEvent("error", { message: F1 }))
      : ((e = document.createEvent("Event")),
        e.initEvent("error", !1, !1),
        (e.message = F1)),
      _.dispatchEvent(e);
  },
  ca;
(function (e) {
  (e.BORDER_BOX = "border-box"),
    (e.CONTENT_BOX = "content-box"),
    (e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box");
})(ca || (ca = {}));
var xi = function (e) {
    return Object.freeze(e);
  },
  hO = (function () {
    function e(t, n) {
      (this.inlineSize = t), (this.blockSize = n), xi(this);
    }
    return e;
  })(),
  ow = (function () {
    function e(t, n, r, i) {
      return (
        (this.x = t),
        (this.y = n),
        (this.width = r),
        (this.height = i),
        (this.top = this.y),
        (this.left = this.x),
        (this.bottom = this.top + this.height),
        (this.right = this.left + this.width),
        xi(this)
      );
    }
    return (
      (e.prototype.toJSON = function () {
        var t = this,
          n = t.x,
          r = t.y,
          i = t.top,
          o = t.right,
          s = t.bottom,
          a = t.left,
          l = t.width,
          c = t.height;
        return {
          x: n,
          y: r,
          top: i,
          right: o,
          bottom: s,
          left: a,
          width: l,
          height: c,
        };
      }),
      (e.fromRect = function (t) {
        return new e(t.x, t.y, t.width, t.height);
      }),
      e
    );
  })(),
  Qp = function (e) {
    return e instanceof SVGElement && "getBBox" in e;
  },
  sw = function (e) {
    if (Qp(e)) {
      var t = e.getBBox(),
        n = t.width,
        r = t.height;
      return !n && !r;
    }
    var i = e,
      o = i.offsetWidth,
      s = i.offsetHeight;
    return !(o || s || e.getClientRects().length);
  },
  _1 = function (e) {
    var t, n;
    if (e instanceof Element) return !0;
    var r =
      (n = (t = e) === null || t === void 0 ? void 0 : t.ownerDocument) ===
        null || n === void 0
        ? void 0
        : n.defaultView;
    return !!(r && e instanceof r.Element);
  },
  pO = function (e) {
    switch (e.tagName) {
      case "INPUT":
        if (e.type !== "image") break;
      case "VIDEO":
      case "AUDIO":
      case "EMBED":
      case "OBJECT":
      case "CANVAS":
      case "IFRAME":
      case "IMG":
        return !0;
    }
    return !1;
  },
  ra = typeof _ < "u" ? _ : {},
  Ac = new WeakMap(),
  L1 = /auto|scroll/,
  mO = /^tb|vertical/,
  vO = /msie|trident/i.test(ra.navigator && ra.navigator.userAgent),
  Ln = function (e) {
    return parseFloat(e || "0");
  },
  Eo = function (e, t, n) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = 0),
      n === void 0 && (n = !1),
      new hO((n ? t : e) || 0, (n ? e : t) || 0)
    );
  },
  M1 = xi({
    devicePixelContentBoxSize: Eo(),
    borderBoxSize: Eo(),
    contentBoxSize: Eo(),
    contentRect: new ow(0, 0, 0, 0),
  }),
  aw = function (e, t) {
    if ((t === void 0 && (t = !1), Ac.has(e) && !t)) return Ac.get(e);
    if (sw(e)) return Ac.set(e, M1), M1;
    var n = getComputedStyle(e),
      r = Qp(e) && e.ownerSVGElement && e.getBBox(),
      i = !vO && n.boxSizing === "border-box",
      o = mO.test(n.writingMode || ""),
      s = !r && L1.test(n.overflowY || ""),
      a = !r && L1.test(n.overflowX || ""),
      l = r ? 0 : Ln(n.paddingTop),
      c = r ? 0 : Ln(n.paddingRight),
      u = r ? 0 : Ln(n.paddingBottom),
      f = r ? 0 : Ln(n.paddingLeft),
      d = r ? 0 : Ln(n.borderTopWidth),
      h = r ? 0 : Ln(n.borderRightWidth),
      g = r ? 0 : Ln(n.borderBottomWidth),
      y = r ? 0 : Ln(n.borderLeftWidth),
      S = f + c,
      p = l + u,
      m = y + h,
      v = d + g,
      x = a ? e.offsetHeight - v - e.clientHeight : 0,
      C = s ? e.offsetWidth - m - e.clientWidth : 0,
      w = i ? S + m : 0,
      k = i ? p + v : 0,
      E = r ? r.width : Ln(n.width) - w - C,
      P = r ? r.height : Ln(n.height) - k - x,
      I = E + S + C + m,
      H = P + p + x + v,
      L = xi({
        devicePixelContentBoxSize: Eo(
          Math.round(E * devicePixelRatio),
          Math.round(P * devicePixelRatio),
          o
        ),
        borderBoxSize: Eo(I, H, o),
        contentBoxSize: Eo(E, P, o),
        contentRect: new ow(f, l, E, P),
      });
    return Ac.set(e, L), L;
  },
  lw = function (e, t, n) {
    var r = aw(e, n),
      i = r.borderBoxSize,
      o = r.contentBoxSize,
      s = r.devicePixelContentBoxSize;
    switch (t) {
      case ca.DEVICE_PIXEL_CONTENT_BOX:
        return s;
      case ca.BORDER_BOX:
        return i;
      default:
        return o;
    }
  },
  gO = (function () {
    function e(t) {
      var n = aw(t);
      (this.target = t),
        (this.contentRect = n.contentRect),
        (this.borderBoxSize = xi([n.borderBoxSize])),
        (this.contentBoxSize = xi([n.contentBoxSize])),
        (this.devicePixelContentBoxSize = xi([n.devicePixelContentBoxSize]));
    }
    return e;
  })(),
  cw = function (e) {
    if (sw(e)) return 1 / 0;
    for (var t = 0, n = e.parentNode; n; ) (t += 1), (n = n.parentNode);
    return t;
  },
  yO = function () {
    var e = 1 / 0,
      t = [];
    bi.forEach(function (s) {
      if (s.activeTargets.length !== 0) {
        var a = [];
        s.activeTargets.forEach(function (c) {
          var u = new gO(c.target),
            f = cw(c.target);
          a.push(u),
            (c.lastReportedSize = lw(c.target, c.observedBox)),
            f < e && (e = f);
        }),
          t.push(function () {
            s.callback.call(s.observer, a, s.observer);
          }),
          s.activeTargets.splice(0, s.activeTargets.length);
      }
    });
    for (var n = 0, r = t; n < r.length; n++) {
      var i = r[n];
      i();
    }
    return e;
  },
  O1 = function (e) {
    bi.forEach(function (n) {
      n.activeTargets.splice(0, n.activeTargets.length),
        n.skippedTargets.splice(0, n.skippedTargets.length),
        n.observationTargets.forEach(function (i) {
          i.isActive() &&
            (cw(i.target) > e
              ? n.activeTargets.push(i)
              : n.skippedTargets.push(i));
        });
    });
  },
  bO = function () {
    var e = 0;
    for (O1(e); uO(); ) (e = yO()), O1(e);
    return fO() && dO(), e > 0;
  },
  pp,
  uw = [],
  xO = function () {
    return uw.splice(0).forEach(function (e) {
      return e();
    });
  },
  SO = function (e) {
    if (!pp) {
      var t = 0,
        n = document.createTextNode(""),
        r = { characterData: !0 };
      new MutationObserver(function () {
        return xO();
      }).observe(n, r),
        (pp = function () {
          n.textContent = "" + (t ? t-- : t++);
        });
    }
    uw.push(e), pp();
  },
  wO = function (e) {
    SO(function () {
      requestAnimationFrame(e);
    });
  },
  Uc = 0,
  CO = function () {
    return !!Uc;
  },
  kO = 250,
  TO = { attributes: !0, characterData: !0, childList: !0, subtree: !0 },
  A1 = [
    "resize",
    "load",
    "transitionend",
    "animationend",
    "animationstart",
    "animationiteration",
    "keyup",
    "keydown",
    "mouseup",
    "mousedown",
    "mouseover",
    "mouseout",
    "blur",
    "focus",
  ],
  D1 = function (e) {
    return e === void 0 && (e = 0), Date.now() + e;
  },
  mp = !1,
  EO = (function () {
    function e() {
      var t = this;
      (this.stopped = !0),
        (this.listener = function () {
          return t.schedule();
        });
    }
    return (
      (e.prototype.run = function (t) {
        var n = this;
        if ((t === void 0 && (t = kO), !mp)) {
          mp = !0;
          var r = D1(t);
          wO(function () {
            var i = !1;
            try {
              i = bO();
            } finally {
              if (((mp = !1), (t = r - D1()), !CO())) return;
              i ? n.run(1e3) : t > 0 ? n.run(t) : n.start();
            }
          });
        }
      }),
      (e.prototype.schedule = function () {
        this.stop(), this.run();
      }),
      (e.prototype.observe = function () {
        var t = this,
          n = function () {
            return t.observer && t.observer.observe(document.body, TO);
          };
        document.body ? n() : ra.addEventListener("DOMContentLoaded", n);
      }),
      (e.prototype.start = function () {
        var t = this;
        this.stopped &&
          ((this.stopped = !1),
          (this.observer = new MutationObserver(this.listener)),
          this.observe(),
          A1.forEach(function (n) {
            return ra.addEventListener(n, t.listener, !0);
          }));
      }),
      (e.prototype.stop = function () {
        var t = this;
        this.stopped ||
          (this.observer && this.observer.disconnect(),
          A1.forEach(function (n) {
            return ra.removeEventListener(n, t.listener, !0);
          }),
          (this.stopped = !0));
      }),
      e
    );
  })(),
  Op = new EO(),
  V1 = function (e) {
    !Uc && e > 0 && Op.start(), (Uc += e), !Uc && Op.stop();
  },
  RO = function (e) {
    return !Qp(e) && !pO(e) && getComputedStyle(e).display === "inline";
  },
  PO = (function () {
    function e(t, n) {
      (this.target = t),
        (this.observedBox = n || ca.CONTENT_BOX),
        (this.lastReportedSize = { inlineSize: 0, blockSize: 0 });
    }
    return (
      (e.prototype.isActive = function () {
        var t = lw(this.target, this.observedBox, !0);
        return (
          RO(this.target) && (this.lastReportedSize = t),
          this.lastReportedSize.inlineSize !== t.inlineSize ||
            this.lastReportedSize.blockSize !== t.blockSize
        );
      }),
      e
    );
  })(),
  IO = (function () {
    function e(t, n) {
      (this.activeTargets = []),
        (this.skippedTargets = []),
        (this.observationTargets = []),
        (this.observer = t),
        (this.callback = n);
    }
    return e;
  })(),
  Dc = new WeakMap(),
  B1 = function (e, t) {
    for (var n = 0; n < e.length; n += 1) if (e[n].target === t) return n;
    return -1;
  },
  Vc = (function () {
    function e() {}
    return (
      (e.connect = function (t, n) {
        var r = new IO(t, n);
        Dc.set(t, r);
      }),
      (e.observe = function (t, n, r) {
        var i = Dc.get(t),
          o = i.observationTargets.length === 0;
        B1(i.observationTargets, n) < 0 &&
          (o && bi.push(i),
          i.observationTargets.push(new PO(n, r && r.box)),
          V1(1),
          Op.schedule());
      }),
      (e.unobserve = function (t, n) {
        var r = Dc.get(t),
          i = B1(r.observationTargets, n),
          o = r.observationTargets.length === 1;
        i >= 0 &&
          (o && bi.splice(bi.indexOf(r), 1),
          r.observationTargets.splice(i, 1),
          V1(-1));
      }),
      (e.disconnect = function (t) {
        var n = this,
          r = Dc.get(t);
        r.observationTargets.slice().forEach(function (i) {
          return n.unobserve(t, i.target);
        }),
          r.activeTargets.splice(0, r.activeTargets.length);
      }),
      e
    );
  })(),
  FO = (function () {
    function e(t) {
      if (arguments.length === 0)
        throw new TypeError(
          "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present."
        );
      if (typeof t != "function")
        throw new TypeError(
          "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function."
        );
      Vc.connect(this, t);
    }
    return (
      (e.prototype.observe = function (t, n) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present."
          );
        if (!_1(t))
          throw new TypeError(
            "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element"
          );
        Vc.observe(this, t, n);
      }),
      (e.prototype.unobserve = function (t) {
        if (arguments.length === 0)
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present."
          );
        if (!_1(t))
          throw new TypeError(
            "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element"
          );
        Vc.unobserve(this, t);
      }),
      (e.prototype.disconnect = function () {
        Vc.disconnect(this);
      }),
      (e.toString = function () {
        return "function ResizeObserver () { [polyfill code] }";
      }),
      e
    );
  })();
function du() {
  let [e, t] = b.useState(0);
  return b.useCallback(() => t((n) => n + 1), []);
}
var Qs,
  Zs,
  _O = class {
    constructor() {
      Go(this, Qs, void 0), Go(this, Zs, new WeakMap());
      let e = De.ResizeObserver ?? FO;
      of(this, Qs, new e(this.updateResizedElements.bind(this)));
    }
    updateResizedElements(e) {
      for (let t of e) {
        let n = Tt(this, Zs).get(t.target);
        n && n(t.contentRect);
      }
    }
    observeElementWithCallback(e, t) {
      Tt(this, Qs).observe(e), Tt(this, Zs).set(e, t);
    }
    unobserve(e) {
      Tt(this, Qs).unobserve(e), Tt(this, Zs).delete(e);
    }
  };
Qs = new WeakMap();
Zs = new WeakMap();
var Bc = $r() ? new _O() : void 0;
function LO(e) {
  let t = du();
  W(() => {
    let n = e?.current;
    if (n)
      return (
        Bc?.observeElementWithCallback(e.current, t),
        () => {
          Bc?.unobserve(n);
        }
      );
  }, [e, t]);
}
var MO = "data-framer-size-compatibility-wrapper";
function OO(e) {
  return [
    ...(e.firstElementChild && e.firstElementChild.hasAttribute(MO)
      ? e.firstElementChild.children
      : e.children),
  ]
    .filter(fw)
    .map(dw);
}
function fw(e) {
  return e instanceof HTMLBaseElement ||
    e instanceof HTMLHeadElement ||
    e instanceof HTMLLinkElement ||
    e instanceof HTMLMetaElement ||
    e instanceof HTMLScriptElement ||
    e instanceof HTMLStyleElement ||
    e instanceof HTMLTitleElement
    ? !1
    : e instanceof HTMLElement || e instanceof SVGElement;
}
function dw(e) {
  if (
    !(e instanceof HTMLElement) ||
    e.children.length === 0 ||
    e.style.display !== "contents"
  )
    return e;
  let t = [...e.children].find(fw);
  return t ? dw(t) : e;
}
function hu(e, t, n = () => [], r = {}) {
  let { id: i, visible: o, _needsMeasure: s } = e,
    { skipHook: a = !1 } = r,
    l = !!M(Fo),
    c = _e.current() === "CANVAS";
  iw(() => {
    !c ||
      l ||
      a ||
      (t.current &&
        i &&
        o &&
        s &&
        Ke.queueMeasureRequest(qp(i), t.current, n(t.current)));
  });
}
function AO(e) {
  let t = e.closest("[data-framer-component-container]");
  t && Ke.queueMeasureRequest(qp(t.id), t, OO(t));
}
var ki = Object.keys;
function ua(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function H1(e) {
  return ua(e, "equals") ? typeof e.equals == "function" : !1;
}
function Zp(e, t) {
  return e === t ? !0 : e !== e && t !== t;
}
function DO(e, t) {
  let n = e.length;
  if (n !== t.length) return !1;
  for (let r = n; r-- !== 0; ) if (!Zp(e[r], t[r])) return !1;
  return !0;
}
function VO(e, t) {
  let n = e.length;
  if (n !== t.length) return !1;
  for (let r = n; r-- !== 0; ) if (!pu(e[r], t[r], !0)) return !1;
  return !0;
}
function BO(e, t) {
  if (e.size !== t.size) return !1;
  for (let [n, r] of e.entries()) if (!Zp(r, t.get(n))) return !1;
  return !0;
}
function HO(e, t) {
  if (e.size !== t.size) return !1;
  for (let [n, r] of e.entries()) if (!pu(r, t.get(n), !0)) return !1;
  return !0;
}
function zO(e, t) {
  if (e.size !== t.size) return !1;
  for (let n of e.keys()) if (!t.has(n)) return !1;
  return !0;
}
function NO(e, t) {
  let n = ki(e);
  if (n.length !== ki(t).length) return !1;
  for (let r of n) {
    if (!ua(t, r)) return !1;
    if (!(r === "_owner" && ua(e, "$$typeof") && e.$$typeof) && !Zp(e[r], t[r]))
      return !1;
  }
  return !0;
}
function $O(e, t) {
  let n = ki(e);
  if (n.length !== ki(t).length) return !1;
  for (let r of n) {
    if (!ua(t, r)) return !1;
    if (
      !(r === "_owner" && ua(e, "$$typeof") && e.$$typeof) &&
      !pu(e[r], t[r], !0)
    )
      return !1;
  }
  return !0;
}
function pu(e, t, n) {
  if (e === t) return !0;
  if (!e || !t) return e !== e && t !== t;
  let r = typeof e;
  if (r !== typeof t || r !== "object") return !1;
  let o = Array.isArray(e),
    s = Array.isArray(t);
  if (o && s) return n ? VO(e, t) : DO(e, t);
  if (o !== s) return !1;
  let a = e instanceof Map,
    l = t instanceof Map;
  if (a && l) return n ? HO(e, t) : BO(e, t);
  if (a !== l) return !1;
  let c = e instanceof Set,
    u = t instanceof Set;
  if (c && u) return zO(e, t);
  if (c !== u) return !1;
  let f = e instanceof Date,
    d = t instanceof Date;
  if (f && d) return e.getTime() === t.getTime();
  if (f !== d) return !1;
  let h = e instanceof RegExp,
    g = t instanceof RegExp;
  return h && g
    ? e.toString() === t.toString()
    : h !== g
    ? !1
    : H1(e) && H1(t)
    ? e.equals(t)
    : n
    ? $O(e, t)
    : NO(e, t);
}
function ze(e, t, n = !0) {
  try {
    return pu(e, t, n);
  } catch (r) {
    if (r instanceof Error && /stack|recursion/iu.exec(r.message))
      return (
        console.warn(
          "Warning: isEqual does not handle circular references.",
          r.name,
          r.message
        ),
        !1
      );
    throw r;
  }
}
var hw = "0.000001px",
  vp = ` translateZ(${hw})`,
  pw = WM() || JS() || ew();
function jO(e) {
  e.willChange = "transform";
  let t = _e.current() === "CANVAS";
  pw && t && (e.translateZ = hw);
}
function Jp(e) {
  (e.willChange = "transform"), WO(e, !0);
}
function WO(e, t) {
  let n = _e.current() === "CANVAS";
  if (!pw || !n) return;
  let r = e.transform || "";
  t
    ? r.includes(vp) || (e.transform = r + vp)
    : (e.transform = r.replace(vp, ""));
}
function mw(e, t, n, r = !0) {
  if (!e) return;
  let i = Ve(e.style),
    o = n || i[t],
    s = () => {
      i[t] = o;
    };
  (i[t] = null), r ? Promise.resolve().then(s) : setTimeout(s, 0);
}
var ia = class extends be {
  constructor() {
    super(...arguments),
      R(this, "layerElement", null),
      R(this, "setLayerElement", (e) => {
        this.layerElement = e;
      });
  }
  static applyWillChange(e, t, n) {
    e.willChangeTransform && (n ? jO(t) : Jp(t));
  }
  shouldComponentUpdate(e, t) {
    return e._needsMeasure || this.state !== t || !ze(this.props, e);
  }
  componentDidUpdate(e) {
    Ve(this.props).clip &&
      Ve(this.props).radius === 0 &&
      Ve(e).radius !== 0 &&
      mw(this.layerElement, "overflow", "hidden", !1);
  }
};
R(ia, "defaultProps", {});
function UO(e, t) {
  if (e.size < t) return;
  let r = Math.round(Math.random());
  for (let i of e.keys()) (++r & 1) !== 1 && e.delete(i);
}
function XO(e, t, n, r) {
  let i = t.get(n);
  if (i) return i;
  UO(t, e);
  let o = r(n);
  return t.set(n, o), o;
}
var vw = (e) => {
    let t = 0,
      n,
      r;
    if (e.length === 0) return t;
    for (n = 0; n < e.length; n++)
      (r = e.charCodeAt(n)), (t = (t << 5) - t + r), (t |= 0);
    return t;
  },
  em = {
    hueRotate: (e, t) => $.toHslString($.hueRotate($(e), t)),
    setAlpha: (e, t) => $.toRgbString($.alpha($(e), t)),
    getAlpha: (e) => {
      let t = Up(e);
      return t ? t.a : 1;
    },
    multiplyAlpha: (e, t) => $.toRgbString($.multiplyAlpha($(e), t)),
    toHex: (e) => $.toHexString($(e)).toUpperCase(),
    toRgb: (e) => $.toRgb($(e)),
    toRgbString: (e) => $.toRgbString($(e)),
    toHSV: (e) => $.toHsv($(e)),
    toHSL: (e) => $.toHsl($(e)),
    toHslString: (e) => $.toHslString($(e)),
    toHsvString: (e) => $.toHsvString($(e)),
    hsvToHSLString: (e) => $.toHslString($(Mc(e.h, e.s, e.v, e.a))),
    hsvToHex: (e) => $.toHexString($(Mc(e.h, e.s, e.v, e.a))).toUpperCase(),
    hsvToRgbString: (e) => $.toRgbString($(Mc(e.h, e.s, e.v, e.a))),
    hsvToString: (e) => Mc(e.h, e.s, e.v),
    rgbaToString: (e) => $.toRgbString($(e)),
    rgbToHexString: (e) => $.toHexString($(e)),
    hslToString: (e) => $.toHslString($(e)),
    hslToRgbString: (e) => $.toRgbString($(e)),
    toColorPickerSquare: (e) => $.toRgbString($({ h: e, s: 1, l: 0.5, a: 1 })),
    isValid: (e) => $(e).isValid !== !1,
    equals: (e, t) => (
      typeof e == "string" && (e = $(e)),
      typeof t == "string" && (t = $(t)),
      $.equal(e, t)
    ),
    toHexOrRgbaString: (e) => {
      let t = $(e);
      return t.a !== 1 ? $.toRgbString(t) : $.toHexString(t);
    },
  },
  YO = /var\(.+\)/,
  GO = new Map();
function KO(e, t) {
  let n = [e, t];
  return YO.test(e) ? e : XO(1e3, GO, n, () => em.multiplyAlpha(e, t));
}
function Ta(e, t = 1) {
  let n;
  return (
    "stops" in e
      ? (n = e.stops)
      : (n = [
          { value: e.start, position: 0 },
          { value: e.end, position: 1 },
        ]),
    t === 1 ? n : n.map((r) => ({ ...r, value: KO(r.value, t) }))
  );
}
function gw(e, t) {
  let n = 0;
  return (
    Ta(e, t).forEach((r) => {
      n ^= vw(r.value) ^ r.position;
    }),
    n
  );
}
var qO = ["stops"];
function yw(e) {
  return e && qO.every((t) => t in e);
}
var QO = ["start", "end"];
function bw(e) {
  return e && QO.every((t) => t in e);
}
var ZO = ["angle", "alpha"],
  fa = {
    isLinearGradient: (e) => e && ZO.every((t) => t in e) && (bw(e) || yw(e)),
    hash: (e) => e.angle ^ gw(e, e.alpha),
    toCSS: (e, t) => {
      let n = Ta(e, e.alpha),
        r = t !== void 0 ? t : e.angle,
        i = n.map((o) => `${o.value} ${o.position * 100}%`);
      return `linear-gradient(${r}deg, ${i.join(", ")})`;
    },
  },
  JO = [
    "widthFactor",
    "heightFactor",
    "centerAnchorX",
    "centerAnchorY",
    "alpha",
  ],
  da = {
    isRadialGradient: (e) => e && JO.every((t) => t in e) && (bw(e) || yw(e)),
    hash: (e) =>
      e.centerAnchorX ^
      e.centerAnchorY ^
      e.widthFactor ^
      e.heightFactor ^
      gw(e, e.alpha),
    toCSS: (e) => {
      let {
          alpha: t,
          widthFactor: n,
          heightFactor: r,
          centerAnchorX: i,
          centerAnchorY: o,
        } = e,
        a = Ta(e, t).map((l) => `${l.value} ${l.position * 100}%`);
      return `radial-gradient(${n * 100}% ${r * 100}% at ${i * 100}% ${
        o * 100
      }%, ${a.join(", ")})`;
    },
  };
function eA({ background: e, backgroundColor: t }, n) {
  t
    ? typeof t == "string" || S1(t)
      ? (n.backgroundColor = t)
      : $.isColorObject(e) &&
        (n.backgroundColor = e.initialValue || $.toRgbString(e))
    : e &&
      ((e = He.get(e, null)),
      typeof e == "string" || S1(e)
        ? (n.background = e)
        : fa.isLinearGradient(e)
        ? (n.background = fa.toCSS(e))
        : da.isRadialGradient(e)
        ? (n.background = da.toCSS(e))
        : $.isColorObject(e) &&
          (n.backgroundColor = e.initialValue || $.toRgbString(e)));
}
function ie(e, t, n, r) {
  if ((r === void 0 && (r = t), e[t] !== void 0)) {
    n[r] = e[t];
    return;
  }
}
function tA(e) {
  return e ? e.left !== void 0 && e.right !== void 0 : !1;
}
function nA(e) {
  return e ? e.top !== void 0 && e.bottom !== void 0 : !1;
}
function rA(e) {
  if (!e) return {};
  let t = {};
  return (
    e.preserve3d === !0
      ? (t.transformStyle = "preserve-3d")
      : e.preserve3d === !1 && (t.transformStyle = "flat"),
    e.backfaceVisible === !0
      ? (t.backfaceVisibility = "visible")
      : e.backfaceVisible === !1 && (t.backfaceVisibility = "hidden"),
    t.backfaceVisibility && (t.WebkitBackfaceVisibility = t.backfaceVisibility),
    e.perspective !== void 0 &&
      (t.perspective = t.WebkitPerspective = e.perspective),
    e.__fromCanvasComponent ||
      (e.center === !0
        ? ((t.left = "50%"), (t.top = "50%"))
        : e.center === "x"
        ? (t.left = "50%")
        : e.center === "y" && (t.top = "50%")),
    ie(e, "size", t),
    ie(e, "width", t),
    ie(e, "height", t),
    ie(e, "minWidth", t),
    ie(e, "minHeight", t),
    ie(e, "top", t),
    ie(e, "right", t),
    ie(e, "bottom", t),
    ie(e, "left", t),
    ie(e, "position", t),
    ie(e, "overflow", t),
    ie(e, "opacity", t),
    (!e._border || !e._border.borderWidth) && ie(e, "border", t),
    ie(e, "borderRadius", t),
    ie(e, "radius", t, "borderRadius"),
    ie(e, "color", t),
    ie(e, "shadow", t, "boxShadow"),
    ie(e, "x", t),
    ie(e, "y", t),
    ie(e, "z", t),
    ie(e, "rotate", t),
    ie(e, "rotateX", t),
    ie(e, "rotateY", t),
    ie(e, "rotateZ", t),
    ie(e, "scale", t),
    ie(e, "scaleX", t),
    ie(e, "scaleY", t),
    ie(e, "skew", t),
    ie(e, "skewX", t),
    ie(e, "skewY", t),
    ie(e, "originX", t),
    ie(e, "originY", t),
    ie(e, "originZ", t),
    eA(e, t),
    t
  );
}
function iA(e) {
  for (let t in e)
    if (
      t === "drag" ||
      t.startsWith("while") ||
      (typeof Ve(e)[t] == "function" &&
        t.startsWith("on") &&
        !t.includes("Animation"))
    )
      return !0;
  return !1;
}
var z1 = [
    "onClick",
    "onDoubleClick",
    "onMouse",
    "onMouseDown",
    "onMouseUp",
    "onTapDown",
    "onTap",
    "onTapUp",
    "onPointer",
    "onPointerDown",
    "onPointerUp",
    "onTouch",
    "onTouchDown",
    "onTouchUp",
  ],
  oA = new Set([...z1, ...z1.map((e) => `${e}Capture`)]);
function sA(e) {
  if (e.drag) return "grab";
  for (let t in e) if (oA.has(t)) return "pointer";
}
var gp = "overflow";
function aA(e) {
  return N1(e) ? !0 : e.style ? !!N1(e.style) : !1;
}
function N1(e) {
  return gp in e && (e[gp] === "scroll" || e[gp] === "auto");
}
function xw(e) {
  let {
      left: t,
      top: n,
      bottom: r,
      right: i,
      width: o,
      height: s,
      center: a,
      _constraints: l,
      size: c,
      widthType: u,
      heightType: f,
      positionFixed: d,
      positionAbsolute: h,
    } = e,
    g = rt(e.minWidth),
    y = rt(e.minHeight),
    S = rt(e.maxWidth),
    p = rt(e.maxHeight);
  return {
    top: rt(n),
    left: rt(t),
    bottom: rt(r),
    right: rt(i),
    width: rt(o),
    height: rt(s),
    size: rt(c),
    center: a,
    _constraints: l,
    widthType: u,
    heightType: f,
    positionFixed: d,
    positionAbsolute: h,
    minWidth: g,
    minHeight: y,
    maxWidth: S,
    maxHeight: p,
  };
}
var $1 = { x: 0, y: 0, width: 200, height: 200 };
function lA(e) {
  b.useInsertionEffect(() => {
    Ca();
  }, []);
  let t = !!M(Fo),
    { style: n, _initialStyle: r, __fromCanvasComponent: i, size: o } = e,
    s = xw(e),
    a = LL(s),
    l = {
      display: "block",
      flex: n?.flex ?? "0 0 auto",
      userSelect: _e.current() !== "PREVIEW" ? "none" : void 0,
    };
  e.__fromCanvasComponent ||
    (l.backgroundColor =
      e.background === void 0 ? "rgba(0, 170, 255, 0.3)" : void 0);
  let c = !iA(e) && !e.__fromCanvasComponent && !aA(e),
    u = e.style ? !("pointerEvents" in e.style) : !0;
  c && u && (l.pointerEvents = "none");
  let d = b.Children.count(e.children) > 0 &&
      b.Children.toArray(e.children).every(
        (p) => typeof p == "string" || typeof p == "number"
      ) && {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      },
    h = rA(e);
  o === void 0 &&
    !i &&
    (tA(h) || (l.width = $1.width), nA(h) || (l.height = $1.height)),
    s.minWidth !== void 0 && (l.minWidth = s.minWidth),
    s.minHeight !== void 0 && (l.minHeight = s.minHeight);
  let g = {};
  Sa(s) &&
    a &&
    !Sw(e) &&
    (g = {
      left: a.x,
      top: a.y,
      width: a.width,
      height: a.height,
      right: void 0,
      bottom: void 0,
    }),
    Object.assign(l, d, r, h, g, n),
    Object.assign(l, {
      overflowX: l.overflowX ?? l.overflow,
      overflowY: l.overflowY ?? l.overflow,
      overflow: void 0,
    }),
    ia.applyWillChange(e, l, !0);
  let y = l;
  l.transform || (y = { x: 0, y: 0, ...l });
  let S = _e.current() === "CANVAS";
  return (
    e.positionSticky
      ? (!S || t) &&
        ((y.position = "sticky"),
        (y.willChange = "transform"),
        (y.zIndex = 1),
        (y.top = e.positionStickyTop),
        (y.right = e.positionStickyRight),
        (y.bottom = e.positionStickyBottom),
        (y.left = e.positionStickyLeft))
      : S &&
        (e.positionFixed || e.positionAbsolute) &&
        (y.position = "absolute"),
    "rotate" in y && y.rotate === void 0 && delete y.rotate,
    [y, a]
  );
}
var cA = new Set([
  "width",
  "height",
  "opacity",
  "overflow",
  "radius",
  "background",
  "color",
  "x",
  "y",
  "z",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "skew",
  "skewX",
  "skewY",
  "originX",
  "originY",
  "originZ",
]);
function uA(e) {
  let t = {};
  for (let n in e)
    (Ai(n) || HM(n)) && !cA.has(n)
      ? (t[n] = Ve(e)[n])
      : (n === "positionTransition" || n === "layoutTransition") &&
        ((t.layout = !0),
        typeof Ve(e)[n] != "boolean" &&
          !e.transition &&
          (t.transition = Ve(e)[n]));
  return t;
}
function fA(e) {
  return "data-framer-name" in e;
}
var dA = Ue(function (t, n) {
    let { name: r, center: i, border: o, _border: s, __portal: a } = t,
      { props: l, children: c } = cO(t),
      u = uA(l),
      f = ka(t),
      d = sA(t),
      h = D(null),
      g = n ?? h,
      y = {
        "data-framer-component-type": "Frame",
        "data-framer-cursor": d,
        "data-framer-highlight": d === "pointer" ? !0 : void 0,
        "data-layoutid": f,
        "data-framer-offset-parent-id": Ve(t)["data-framer-offset-parent-id"],
      };
    !fA(t) && r && (Ve(y)["data-framer-name"] = r);
    let [S, p] = lA(l),
      m = xw(l),
      v = Sw(m);
    i && !(p && !v && Sa(m))
      ? (u.transformTemplate || (u.transformTemplate = fu(i)),
        Object.assign(y, rw(i)))
      : u.transformTemplate || (u.transformTemplate = void 0),
      hu(t, g);
    let x = oO(t),
      C = !!M(Fo),
      w = hA(l, m, p, C),
      k = _L(
        oe(Ne, {
          children: [
            x
              ? T(nw, {
                  alt: t.alt ?? "",
                  image: x,
                  containerSize: p ?? void 0,
                  nodeId: t.id && qp(t.id),
                  layoutId: f,
                })
              : null,
            c,
            T(aO, { ...s, border: o, layoutId: f }),
          ],
        }),
        w
      ),
      E = uu(t.as),
      { size: P, radius: I, shadow: H } = S;
    return (
      P !== void 0 &&
        (delete S.size,
        S.height === void 0 && (S.height = P),
        S.width === void 0 && (S.width = P)),
      I !== void 0 && (delete S.radius, (S.borderRadius = I)),
      H !== void 0 && (delete S.shadow, (S.boxShadow = H)),
      oe(E, { ...y, ...u, layoutId: f, style: S, ref: g, children: [k, a] })
    );
  }),
  Xc = Ue(function (t, n) {
    let { visible: r = !0 } = t;
    return r ? T(dA, { ...t, ref: n }) : null;
  });
function hA(e, t, n, r) {
  if (r) return n ? { width: n.width, height: n.height } : 1;
  let { _usesDOMRect: i } = e,
    { widthType: o = 0, heightType: s = 0, width: a, height: l } = t;
  return n && !i
    ? n
    : o === 0 && s === 0 && typeof a == "number" && typeof l == "number"
    ? { width: a, height: l }
    : i || e.positionFixed || e.positionAbsolute
    ? 2
    : 0;
}
function Sw({ width: e, height: t }) {
  return (
    e === "auto" || e === "min-content" || t === "auto" || t === "min-content"
  );
}
var tm = "__LAYOUT_TREE_ROOT",
  ww = b.createContext({
    schedulePromoteTree: () => {},
    scheduleProjectionDidUpdate: () => {},
    initLead: () => {},
  }),
  pA = class extends be {
    constructor() {
      super(...arguments),
        R(this, "shouldAnimate", !1),
        R(this, "transition"),
        R(this, "lead"),
        R(this, "follow"),
        R(this, "scheduledPromotion", !1),
        R(this, "scheduledDidUpdate", !1),
        R(this, "scheduleProjectionDidUpdate", () => {
          this.scheduledDidUpdate = !0;
        }),
        R(this, "schedulePromoteTree", (e, t, n) => {
          (this.follow = this.lead),
            (this.shouldAnimate = n),
            (this.lead = e),
            (this.transition = t),
            (this.scheduledPromotion = !0);
        }),
        R(this, "initLead", (e, t) => {
          (this.follow = this.lead),
            (this.lead = e),
            this.follow && t && (this.follow.layoutMaybeMutated = !0);
        }),
        R(this, "sharedLayoutContext", {
          schedulePromoteTree: this.schedulePromoteTree,
          scheduleProjectionDidUpdate: this.scheduleProjectionDidUpdate,
          initLead: this.initLead,
        });
    }
    getSnapshotBeforeUpdate() {
      var e;
      if (!this.scheduledPromotion || !this.lead || !this.follow) return null;
      let t =
        !!((e = this.lead) != null && e.layoutMaybeMutated) &&
        !this.shouldAnimate;
      return (
        this.lead.projectionNodes.forEach((n) => {
          var r;
          n?.promote({
            needsReset: t,
            transition: this.shouldAnimate ? this.transition : void 0,
            preserveFollowOpacity:
              n.options.layoutId === tm &&
              !((r = this.follow) != null && r.isExiting),
          });
        }),
        this.shouldAnimate
          ? (this.follow.layoutMaybeMutated = !0)
          : this.scheduleProjectionDidUpdate(),
        (this.lead.layoutMaybeMutated = !1),
        (this.transition = void 0),
        (this.scheduledPromotion = !1),
        null
      );
    }
    componentDidUpdate() {
      var e, t;
      if (!this.lead) return null;
      this.scheduledDidUpdate &&
        ((t = (e = this.lead.rootProjectionNode) == null ? void 0 : e.root) ==
          null || t.didUpdate(),
        (this.scheduledDidUpdate = !1));
    }
    render() {
      return T(ww.Provider, {
        value: this.sharedLayoutContext,
        children: this.props.children,
      });
    }
  },
  mA = { width: "100%", height: "100%", backgroundColor: "none" };
function vA(e) {
  return T(Ot.div, { layoutId: tm, style: mA, children: e.children });
}
var Vr,
  Js,
  gA = class {
    constructor(e) {
      Go(this, Vr, void 0),
        Go(this, Js, new WeakMap()),
        document &&
          of(
            this,
            Vr,
            new IntersectionObserver(this.resizeObserverCallback.bind(this), e)
          );
    }
    resizeObserverCallback(e, t) {
      for (let n of e) {
        let r = Tt(this, Js).get(n.target);
        r && r([n], t);
      }
    }
    observeElementWithCallback(e, t) {
      Tt(this, Vr) && (Tt(this, Vr).observe(e), Tt(this, Js).set(e, t));
    }
    unobserve(e) {
      Tt(this, Vr) && (Tt(this, Vr).unobserve(e), Tt(this, Js).delete(e));
    }
    get root() {
      var e;
      return (e = Tt(this, Vr)) == null ? void 0 : e.root;
    }
  };
Vr = new WeakMap();
Js = new WeakMap();
var yA = b.createContext(new Map());
function bA(e, t, n) {
  if (typeof IntersectionObserver > "u") return;
  let r = _t(() => `${n.rootMargin}`),
    i = b.useContext(yA),
    { enabled: o } = n;
  b.useEffect(() => {
    var s;
    let a = e.current;
    if (!o || !a) return;
    let l = i.get(r);
    if (!l || l.root !== ((s = n.root) == null ? void 0 : s.current)) {
      let { root: c, ...u } = n;
      (l = new gA({ ...u, root: c?.current })), i.set(r, l);
    }
    return l.observeElementWithCallback(a, t), () => l?.unobserve(a);
  }, [o]);
}
var xA = new Array(100).fill(void 0).map((e, t) => t * 0.01),
  SA = b.createContext(null);
function wA(e, t, n) {
  let r = b.useRef({ isInView: !1, hasAnimatedOnce: !1 }),
    {
      enabled: i,
      animateOnce: o,
      threshold: s,
      rootMargin: a = "0px 0px 0px 0px",
    } = n,
    l = b.useCallback(
      ([c]) => {
        if (!c) return;
        let { isInView: u, hasAnimatedOnce: f } = r.current,
          d = kA(c, s?.y ?? 0);
        if (d && !u) {
          if (o && f) return;
          (r.current.hasAnimatedOnce = !0), (r.current.isInView = !0), t(!0);
          return;
        }
        if (!d && u) {
          if (((r.current.isInView = !1), o)) return;
          t(!1);
          return;
        }
      },
      [o, s?.y, t]
    );
  bA(e, l, { threshold: xA, rootMargin: a, enabled: i ?? !0 });
}
function CA(e, t) {
  return t.height === 0 ? 0 : e.height / Math.min(t.height, De.innerHeight);
}
function kA(
  { boundingClientRect: e, intersectionRect: t, isIntersecting: n },
  r
) {
  return e.height === 0 ? n : n && CA(t, e) >= r;
}
var zz = Yt(au(), 1);
var $z = Yt(au(), 1);
var Uz = b.createContext({ dragging: !1 });
var TA = { onMouseEnter: "mouseenter", onMouseLeave: "mouseleave" },
  Yz = Object.keys(TA);
var j1 = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  er = Symbol("private"),
  yp = (() => {
    function e(t = {}, n = !1, r = !0) {
      let i = {
          [er]: {
            makeAnimatables: n,
            observeAnimatables: r,
            observers: new NS(),
            reset() {
              for (let s in o)
                if (j1(o, s)) {
                  let a = j1(t, s) ? Ve(t)[s] : void 0;
                  a !== void 0 ? (o[s] = a) : delete o[s];
                }
            },
            transactions: new Set(),
          },
        },
        o = new Proxy(i, RA);
      return Object.assign(o, t), o;
    }
    return (
      (e.resetObject = (t) => t[er].reset()),
      (e.addObserver = (t, n) => t[er].observers.add(n)),
      e
    );
  })(),
  EA = class {
    constructor() {
      R(this, "set", (e, t, n, r) => {
        if (t === er) return !1;
        let i = e[er],
          o,
          s;
        if (
          (pn(n) ? ((o = n), (s = o.get())) : (s = n),
          i.makeAnimatables &&
            typeof n != "function" &&
            typeof n != "object" &&
            !o &&
            (o = He(n)),
          i.observeAnimatables && o)
        ) {
          let u = i.transactions;
          o.onUpdate({
            update: (f, d) => {
              d && u.add(d), i.observers.notify({ value: r }, d);
            },
            finish: (f) => {
              u.delete(f) && i.observers.finishTransaction(f);
            },
          });
        }
        let a = !1,
          l = !0,
          c = Ve(e)[t];
        if (c !== void 0) {
          pn(c)
            ? ((l = c.get() !== s), c.set(s))
            : ((l = c !== s), (Ve(e)[t] = s));
          let u = s !== null && typeof s == "object";
          (Array.isArray(s) || u) && (l = !0), (a = !0);
        } else o && (n = o), (a = Reflect.set(e, t, n));
        return l && i.observers.notify({ value: r }), a;
      }),
        R(this, "get", (e, t, n) => {
          if (t === er) return Ve(e)[t];
          let r = Reflect.get(e, t, n);
          return typeof r == "function" ? r.bind(n) : r;
        });
    }
    deleteProperty(e, t) {
      let n = Reflect.deleteProperty(e, t);
      return e[er].observers.notify({ value: e }), n;
    }
    ownKeys(e) {
      let t = Reflect.ownKeys(e),
        n = t.indexOf(er);
      return n !== -1 && t.splice(n, 1), t;
    }
    getOwnPropertyDescriptor(e, t) {
      if (t !== er) return Reflect.getOwnPropertyDescriptor(e, t);
    }
  },
  RA = new EA();
var PA = "opacity";
function IA(e) {
  return PA in e;
}
function FA(e, t) {
  if (!IA(e)) return;
  let n = He.getNumber(e.opacity);
  n !== 1 && (t.opacity = n);
}
function _A(e) {
  let t = [];
  if (e && e.length) {
    let n = e.map(
      (r) => `drop-shadow(${r.x}px ${r.y}px ${r.blur}px ${r.color})`
    );
    t.push(...n);
  }
  return t;
}
function Cw(e, t) {
  if (!e.shadows || e.shadows.length === 0) return;
  let n = e.shadows
    .map((r) => `${r.x}px ${r.y}px ${r.blur}px ${r.color}`)
    .join(", ");
  n && (t.textShadow = n);
}
function LA(e, t) {
  let n = [];
  X(e.brightness) && n.push(`brightness(${e.brightness / 100})`),
    X(e.contrast) && n.push(`contrast(${e.contrast / 100})`),
    X(e.grayscale) && n.push(`grayscale(${e.grayscale / 100})`),
    X(e.hueRotate) && n.push(`hue-rotate(${e.hueRotate}deg)`),
    X(e.invert) && n.push(`invert(${e.invert / 100})`),
    X(e.saturate) && n.push(`saturate(${e.saturate / 100})`),
    X(e.sepia) && n.push(`sepia(${e.sepia / 100})`),
    X(e.blur) && n.push(`blur(${e.blur}px)`),
    e.dropShadows && n.push(..._A(e.dropShadows)),
    n.length !== 0 && (t.filter = t.WebkitFilter = n.join(" "));
}
function MA(e, t) {
  X(e.backgroundBlur) &&
    (t.backdropFilter = t.WebkitBackdropFilter = `blur(${e.backgroundBlur}px)`);
}
function nm(e, t) {
  MA(e, t), LA(e, t);
}
var { getNumber: qz } = He;
var OA = class extends be {
    constructor() {
      super(...arguments),
        R(this, "layoutMaybeMutated"),
        R(this, "projectionNodes", new Map()),
        R(this, "rootProjectionNode"),
        R(this, "isExiting"),
        R(
          this,
          "shouldPreserveFollowOpacity",
          (e) => e.options.layoutId === tm && !this.props.isExiting
        ),
        R(this, "switchLayoutGroupContext", {
          register: (e) => this.addChild(e),
          deregister: (e) => this.removeChild(e),
          transition:
            this.props.isLead !== void 0 && this.props.animatesLayout
              ? this.props.transition
              : void 0,
          shouldPreserveFollowOpacity: this.shouldPreserveFollowOpacity,
        });
    }
    componentDidMount() {
      this.props.isLead &&
        this.props.sharedLayoutContext.initLead(
          this,
          !!this.props.animatesLayout
        );
    }
    shouldComponentUpdate(e) {
      let {
        isLead: t,
        isExiting: n,
        isOverlayed: r,
        animatesLayout: i,
        transition: o,
        sharedLayoutContext: s,
      } = e;
      if (((this.isExiting = n), t === void 0)) return !0;
      let a = !this.props.isLead && !!t,
        l = this.props.isExiting && !n,
        c = a || l,
        u = !!this.props.isLead && !t,
        f = this.props.isOverlayed !== r;
      return (
        (c || u) && this.projectionNodes.forEach((d) => d?.willUpdate()),
        c
          ? s.schedulePromoteTree(this, o, !!i)
          : f && s.scheduleProjectionDidUpdate(),
        !!c && !!i
      );
    }
    addChild(e) {
      let t = e.options.layoutId;
      t && (this.projectionNodes.set(t, e), this.setRootChild(e));
    }
    setRootChild(e) {
      if (!this.rootProjectionNode) return (this.rootProjectionNode = e);
      this.rootProjectionNode =
        this.rootProjectionNode.depth < e.depth ? this.rootProjectionNode : e;
    }
    removeChild(e) {
      let t = e.options.layoutId;
      t && this.projectionNodes.delete(t);
    }
    render() {
      return T(Za.Provider, {
        value: this.switchLayoutGroupContext,
        children: this.props.children,
      });
    }
  },
  AA = (e) => {
    let t = b.useContext(ww);
    return T(OA, { ...e, sharedLayoutContext: t });
  },
  DA = b.createContext(!0);
function VA() {
  return new Map();
}
function BA() {
  return _t(VA);
}
var kw = xe({ register: () => {}, deregister: () => {} }),
  HA = ({ isCurrent: e, isOverlayed: t, children: n }) => {
    let r = BA(),
      i = ce(
        (a) => {
          if (r.has(a)) {
            console.warn("NavigationTargetWrapper: already registered");
            return;
          }
          r.set(a, void 0);
        },
        [r]
      ),
      o = ce(
        (a) => {
          let l = r.get(a);
          l?.(), r.delete(a);
        },
        [r]
      ),
      s = D({ register: i, deregister: o }).current;
    return (
      W(
        () => (
          r.forEach((a, l) => {
            let c = l(e, t);
            r.set(l, Yp(c) ? c : void 0);
          }),
          () => {
            r.forEach((a, l) => {
              a && (a(), r.set(l, void 0));
            });
          }
        ),
        [e, t, r]
      ),
      T(kw.Provider, { value: s, children: n })
    );
  };
function zA(e, t = []) {
  let { register: n, deregister: r } = M(kw);
  W(() => {
    if (e) return n(e), () => r(e);
  }, [n, r, ...t]);
}
var bp = b.memo(function ({
  isLayeredContainer: t,
  isCurrent: n,
  isPrevious: r,
  isOverlayed: i = !1,
  visible: o,
  transitionProps: s,
  children: a,
  backdropColor: l,
  onTapBackdrop: c,
  backfaceVisible: u,
  exitBackfaceVisible: f,
  animation: d,
  exitAnimation: h,
  instant: g,
  initialProps: y,
  exitProps: S,
  position: p = { top: 0, right: 0, bottom: 0, left: 0 },
  withMagicMotion: m,
  index: v,
  areMagicMotionLayersPresent: x,
  id: C,
  isInitial: w,
}) {
  let k = Oy(),
    E = M(Vi),
    { persistLayoutIdCache: P } = M(Ro),
    I = D({
      wasCurrent: void 0,
      wasPrevious: !1,
      wasBeingRemoved: !1,
      wasReset: !0,
      origins: W1({}, y, s),
    }),
    H = D(null),
    L = E !== null && !E.isPresent;
  n && I.current.wasCurrent === void 0 && P(),
    W(() => {
      if (t || !k) return;
      if (L) {
        I.current = { ...I.current, wasBeingRemoved: L };
        return;
      }
      let { wasPrevious: q, wasCurrent: ee } = I.current,
        Wt = (n && !ee) || (!L && I.current.wasBeingRemoved && n),
        ne = r && !q,
        ut = W1(I.current.origins, y, s),
        Z = I.current.wasReset;
      Wt || ne
        ? (k.stop(), k.start({ zIndex: v, ...ut, ...s }), (Z = !1))
        : Z === !1 &&
          (k.stop(), k.set({ zIndex: v, ...yi, opacity: 0 }), (Z = !0)),
        (I.current = {
          wasCurrent: !!n,
          wasPrevious: !!r,
          wasBeingRemoved: !1,
          wasReset: Z,
          origins: ut,
        });
    }, [n, r, L]);
  let G = g ? { type: !1 } : "velocity" in d ? { ...d, velocity: 0 } : d,
    B = g ? { type: !1 } : h || d,
    J = { ...p };
  (J.left === void 0 || J.right === void 0) && (J.width = "auto"),
    (J.top === void 0 || J.bottom === void 0) && (J.height = "auto");
  let V = (U1(s) || U1(y)) && (t || n || r) ? 1200 : void 0,
    z = { ...yi, ...I.current.origins },
    A = t
      ? {
          initial: { ...z, ...y },
          animate: { ...z, ...s, transition: G },
          exit: { ...z, ...S, transition: d },
        }
      : { animate: k, exit: { ...z, ...S, transition: B } },
    K = !(L || x === !1),
    N = !!n && K;
  return oe(Xc, {
    "data-framer-component-type": "NavigationContainerWrapper",
    width: "100%",
    height: "100%",
    style: {
      position: "absolute",
      transformStyle: "flat",
      backgroundColor: "transparent",
      overflow: "hidden",
      zIndex: t || L || (n && m) ? v : void 0,
      pointerEvents: void 0,
      visibility: o ? "visible" : "hidden",
      perspective: V,
    },
    children: [
      t &&
        T(Xc, {
          width: "100%",
          height: "100%",
          "data-framer-component-type": "NavigationContainerBackdrop",
          transition: d,
          initial: { opacity: g && o ? 1 : 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          backgroundColor: l || "transparent",
          onTap: L ? void 0 : c,
        }),
      T(Xc, {
        ...J,
        ...A,
        transition: {
          default: G,
          originX: { type: !1 },
          originY: { type: !1 },
          originZ: { type: !1 },
        },
        backgroundColor: "transparent",
        backfaceVisible: L ? f : u,
        "data-framer-component-type": "NavigationContainer",
        "data-framer-is-current-navigation-target": !!n,
        style: {
          pointerEvents: void 0,
          opacity: (n && w) || t || (n && m) ? 1 : 0,
        },
        "data-is-present": K ? void 0 : !1,
        ref: H,
        children: T(SA.Provider, {
          value: H,
          children: T(DA.Provider, {
            value: N,
            children: T(HA, {
              isCurrent: N,
              isOverlayed: i,
              children: T(AA, {
                isLead: n,
                animatesLayout: !!m,
                transition: G,
                isExiting: !K,
                isOverlayed: i,
                id: C,
                children: a,
              }),
            }),
          }),
        }),
      }),
    ],
  });
},
NA);
function NA(e, t) {
  return !(
    t.isCurrent === void 0 ||
    e.isCurrent !== t.isCurrent ||
    e.isPrevious !== t.isPrevious ||
    (t.isCurrent && e.isOverlayed !== t.isOverlayed)
  );
}
function W1(e, t, n) {
  let r = { ...e };
  return (
    t &&
      (X(t.originX) && (r.originX = t.originX),
      X(t.originY) && (r.originY = t.originY),
      X(t.originZ) && (r.originZ = t.originZ)),
    n &&
      (X(n.originX) && (r.originX = n.originX),
      X(n.originY) && (r.originY = n.originY),
      X(n.originZ) && (r.originZ = n.originZ)),
    r
  );
}
function U1(e) {
  var t, n, r;
  if (!e || !("rotateX" in e || "rotateY" in e || "z" in e)) return !1;
  let o = e.rotateX !== 0 || e.rotateY !== 0 || e.z !== 0,
    s =
      ((t = e?.transition) == null ? void 0 : t.rotateX.from) !== 0 ||
      ((n = e?.transition) == null ? void 0 : n.rotateY.from) !== 0 ||
      ((r = e?.transition) == null ? void 0 : r.z.from) !== 0;
  return o || s;
}
var yi = {
    x: 0,
    y: 0,
    z: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skew: 0,
    skewX: 0,
    skewY: 0,
    originX: 0.5,
    originY: 0.5,
    originZ: 0,
    opacity: 1,
  },
  $A = class {
    constructor() {
      R(this, "warning", () => {
        sa(
          "The Navigator API is only available inside of Framer: https://www.framer.com/"
        );
      }),
        R(this, "goBack", () => this.warning()),
        R(this, "instant", () => this.warning()),
        R(this, "fade", () => this.warning()),
        R(this, "push", () => this.warning()),
        R(this, "modal", () => this.warning()),
        R(this, "overlay", () => this.warning()),
        R(this, "flip", () => this.warning()),
        R(this, "customTransition", () => this.warning()),
        R(this, "magicMotion", () => this.warning());
    }
  },
  jA = new $A(),
  Tw = xe(jA),
  Ge = {
    Fade: { exit: { opacity: 0 }, enter: { opacity: 0 } },
    PushLeft: { exit: { x: "-30%" }, enter: { x: "100%" } },
    PushRight: { exit: { x: "30%" }, enter: { x: "-100%" } },
    PushUp: { exit: { y: "-30%" }, enter: { y: "100%" } },
    PushDown: { exit: { y: "30%" }, enter: { y: "-100%" } },
    Instant: { animation: { type: !1 }, enter: { opacity: 0 } },
    Modal: {
      overCurrentContext: !0,
      goBackOnTapOutside: !0,
      position: { center: !0 },
      enter: { opacity: 0, scale: 1.2 },
    },
    OverlayLeft: {
      overCurrentContext: !0,
      goBackOnTapOutside: !0,
      position: { right: 0, top: 0, bottom: 0 },
      enter: { x: "100%" },
    },
    OverlayRight: {
      overCurrentContext: !0,
      goBackOnTapOutside: !0,
      position: { left: 0, top: 0, bottom: 0 },
      enter: { x: "-100%" },
    },
    OverlayUp: {
      overCurrentContext: !0,
      goBackOnTapOutside: !0,
      position: { bottom: 0, left: 0, right: 0 },
      enter: { y: "100%" },
    },
    OverlayDown: {
      overCurrentContext: !0,
      goBackOnTapOutside: !0,
      position: { top: 0, left: 0, right: 0 },
      enter: { y: "-100%" },
    },
    FlipLeft: {
      backfaceVisible: !1,
      exit: { rotateY: -180 },
      enter: { rotateY: 180 },
    },
    FlipRight: {
      backfaceVisible: !1,
      exit: { rotateY: 180 },
      enter: { rotateY: -180 },
    },
    FlipUp: {
      backfaceVisible: !1,
      exit: { rotateX: 180 },
      enter: { rotateX: -180 },
    },
    FlipDown: {
      backfaceVisible: !1,
      exit: { rotateX: -180 },
      enter: { rotateX: 180 },
    },
    MagicMotion: { withMagicMotion: !0 },
  };
function WA(e) {
  switch (e && e.appearsFrom ? e.appearsFrom : "right") {
    case "right":
      return Ge.PushLeft;
    case "left":
      return Ge.PushRight;
    case "bottom":
      return Ge.PushUp;
    case "top":
      return Ge.PushDown;
  }
}
function UA(e) {
  switch (e && e.appearsFrom ? e.appearsFrom : "bottom") {
    case "right":
      return Ge.OverlayLeft;
    case "left":
      return Ge.OverlayRight;
    case "bottom":
      return Ge.OverlayUp;
    case "top":
      return Ge.OverlayDown;
  }
}
function XA(e) {
  switch (e && e.appearsFrom ? e.appearsFrom : "bottom") {
    case "right":
      return Ge.FlipLeft;
    case "left":
      return Ge.FlipRight;
    case "bottom":
      return Ge.FlipUp;
    case "top":
      return Ge.FlipDown;
  }
}
var YA = () => ({
  current: -1,
  previous: -1,
  currentOverlay: -1,
  previousOverlay: -1,
  visualIndex: 0,
  overlayItemId: 0,
  historyItemId: 0,
  history: [],
  overlayStack: [],
  containers: {},
  containerIndex: {},
  containerVisualIndex: {},
  containerIsRemoved: {},
  transitionForContainer: {},
  previousTransition: null,
});
function X1(e, t) {
  switch (t.type) {
    case "addOverlay":
      return KA(e, t.transition, t.component);
    case "removeOverlay":
      return qA(e);
    case "add":
      return Ew(e, t.key, t.transition, t.component);
    case "remove":
      return Rw(e);
    case "update":
      return GA(e, t.key, t.component);
    case "back":
      return QA(e);
    case "forward":
      return ZA(e);
    default:
      return;
  }
}
function GA(e, t, n) {
  return { ...e, containers: { ...e.containers, [t]: n } };
}
function KA(e, t, n) {
  let r = e.overlayStack[e.currentOverlay];
  if (r && r.component === n) return;
  let i = e.overlayItemId + 1,
    o = [...e.overlayStack, { key: `stack-${i}`, component: n, transition: t }];
  return {
    ...e,
    overlayStack: o,
    overlayItemId: i,
    currentOverlay: Math.max(0, Math.min(e.currentOverlay + 1, o.length - 1)),
    previousOverlay: e.currentOverlay,
  };
}
function qA(e) {
  return {
    ...e,
    overlayStack: [],
    currentOverlay: -1,
    previousOverlay: e.currentOverlay,
  };
}
function Ew(e, t, n, r) {
  e.containers[t] || (e.containers[t] = r),
    (e.history = e.history.slice(0, e.current + 1)),
    (e.visualIndex = Math.max(e.history.length, 0));
  let i = e.history[e.history.length - 1],
    o = i && i.key === t;
  if (((e.overlayStack = []), o && e.currentOverlay > -1))
    return { ...e, currentOverlay: -1, previousOverlay: e.currentOverlay };
  if (o) return;
  let s = e.containerVisualIndex[t],
    a = e.containerIsRemoved[t],
    l = i?.key && n.withMagicMotion ? nD(t, s, a, e.history) : !0;
  e.history.push({
    key: t,
    transition: n,
    visualIndex: l ? Math.max(e.visualIndex, 0) : e.containerVisualIndex[t],
  });
  let c = e.current + 1,
    u = e.current;
  for (let g in e.containerIndex)
    e.containerIndex[g] === c && (e.containerIndex[g] = tD(g, e.history));
  e.containerIndex[t] = c;
  let { containerVisualIndex: f, containerIsRemoved: d } = JA(e, t, l),
    h = Pw(c, u, e.history, e.containerIndex, e.transitionForContainer);
  return {
    ...e,
    current: c,
    previous: u,
    containerVisualIndex: f,
    containerIsRemoved: d,
    transitionForContainer: h,
    previousTransition: null,
    currentOverlay: -1,
    historyItemId: e.historyItemId + 1,
    previousOverlay: e.currentOverlay,
  };
}
function QA(e) {
  let t = { ...e.containers },
    n = Rw(e);
  if (n) return (n.containers = t), n;
}
function ZA(e) {
  let t = e.history[e.current + 1];
  if (!t) return;
  let { key: n, transition: r, component: i } = t,
    o = [...e.history],
    s = Ew(e, n, r, i);
  if (s) return (s.history = o), s;
}
function Rw(e) {
  let t = [...e.history.slice(0, e.current + 1)];
  if (t.length === 1) return;
  let n = t.pop();
  if (!n) return;
  let r = t[t.length - 1];
  ae(r, "The navigation history must have at least one component"),
    (e.containerIndex[r.key] = t.length - 1),
    t.every((d) => d.key !== n.key) && delete e.containers[n.key];
  let o = e.current - 1,
    s = e.current,
    {
      containerIsRemoved: a,
      containerVisualIndex: l,
      previousTransition: c,
      visualIndex: u,
    } = eD(e, r, n),
    f = Pw(o, s, e.history, e.containerIndex, e.transitionForContainer);
  return {
    ...e,
    current: o,
    previous: s,
    containerIsRemoved: a,
    containerVisualIndex: l,
    previousTransition: c,
    visualIndex: u,
    transitionForContainer: f,
  };
}
function JA(e, t, n) {
  let r = {
    containerVisualIndex: { ...e.containerVisualIndex },
    containerIsRemoved: { ...e.containerIsRemoved },
  };
  if (n)
    (r.containerVisualIndex[t] = e.history.length - 1),
      (r.containerIsRemoved[t] = !1);
  else {
    let i = e.containerVisualIndex[t];
    for (let [o, s] of Object.entries(e.containerVisualIndex))
      i !== void 0 && s > i && (r.containerIsRemoved[o] = !0);
  }
  return r;
}
function eD(e, t, n) {
  let r = [t.key, n.key],
    i = e.history[e.history.length - 2],
    o = e.previousTransition === null ? null : { ...e.previousTransition },
    s = {
      containerIsRemoved: { ...e.containerIsRemoved },
      containerVisualIndex: { ...e.containerVisualIndex },
      previousTransition: o,
      visualIndex: e.visualIndex,
    };
  i && r.push(i.key);
  let a = e.containerVisualIndex[t.key],
    l = e.containerVisualIndex[n.key],
    c =
      (a !== void 0 && l !== void 0 && a <= l) ||
      (t.visualIndex !== void 0 && t.visualIndex < e.history.length - 1),
    u = t.visualIndex;
  return (
    c
      ? ((s.containerIsRemoved[n.key] = !0),
        (s.containerVisualIndex[t.key] =
          u !== void 0 ? u : e.history.length - 1))
      : ((s.visualIndex = e.visualIndex + 1),
        (s.containerVisualIndex[t.key] = e.visualIndex + 1)),
    n.transition.withMagicMotion &&
      (s.previousTransition = n.transition || null),
    (e.containerIsRemoved[t.key] = !1),
    s
  );
}
function tD(e, t) {
  var n;
  for (let r = t.length; r > t.length; r--)
    if (((n = t[r]) == null ? void 0 : n.key) === e) return r;
  return -1;
}
function Pw(e, t, n, r, i) {
  let o = { ...i };
  for (let [s, a] of Object.entries(r)) {
    let l = rD(a, { current: e, previous: t, history: n });
    l && (o[s] = l);
  }
  return o;
}
function nD(e, t, n, r) {
  return n || t === void 0
    ? !0
    : t === 0
    ? !1
    : r.slice(t, r.length).findIndex((s) => s.key === e) > -1
    ? !0
    : !(r.slice(0, t - 1).findIndex((s) => s.key === e) > -1);
}
function rD(e, t) {
  let { current: n, previous: r, history: i } = t;
  if (!(e !== n && e !== r)) {
    if (e === n && n > r) {
      let o = i[e];
      return Hc("enter", o?.transition.enter, o?.transition.animation);
    }
    if (e === r && n > r) {
      let o = i[e + 1];
      return Hc("exit", o?.transition.exit, o?.transition.animation);
    }
    if (e === n && n < r) {
      let o = i[e + 1];
      return Hc("enter", o?.transition.exit, o?.transition.animation);
    }
    if (e === r && n < r) {
      let o = i[e];
      return Hc("exit", o?.transition.enter, o?.transition.animation);
    }
  }
}
var iD = ki(yi);
function Hc(e, t, n) {
  let r = {},
    i = {};
  return (
    iD.forEach((o) => {
      (r[o] = yi[o]), (i[o] = { ...n, from: yi[o] });
    }),
    t &&
      Object.keys(t).forEach((o) => {
        if (t[o] === void 0) return;
        let s = t[o],
          a = typeof t[o] == "string" ? `${Ve(yi)[o]}%` : Ve(yi)[o];
        (Ve(r)[o] = e === "enter" ? a : s),
          (i[o] = { ...n, from: e === "enter" ? s : a, velocity: 0 });
      }),
    { ...r, transition: { ...i } }
  );
}
var aN = Tw.Consumer,
  Iw = b.createContext(void 0),
  lN = Iw.Provider,
  Fw = b.createContext(void 0),
  rm = class extends be {
    constructor(e) {
      var t;
      super(e),
        R(this, "lastEventTimeStamp", null),
        R(this, "state", YA()),
        R(this, "navigationAction", (a) => {
          if (!this.props.enabled && this.state.history.length > 0) return;
          let l = X1(this.state, a);
          if (!l) return;
          let { skipLayoutAnimation: c } = this.props,
            u = l.history[l.current],
            f =
              (a.type === "add" && a.transition.withMagicMotion) ||
              (a.type === "forward" && u?.transition.withMagicMotion) ||
              (a.type === "remove" && !!l.previousTransition),
            d = () => {
              var h;
              this.setState(l),
                u?.key && ((h = this.context) == null || h.call(this, u.key));
            };
          c && !f ? c(d) : d();
        }),
        R(this, "goBack", () => {
          var a;
          if (!this.isSameEventTransition())
            return (
              (this.lastEventTimeStamp =
                ((a = globalThis.event) == null ? void 0 : a.timeStamp) ||
                null),
              this.state.currentOverlay !== -1
                ? this.navigationAction({ type: "removeOverlay" })
                : this.navigationAction({ type: "remove" })
            );
        });
      let n = this.props.children;
      if (!n || !na(n) || !ta(n)) return;
      let r = { ...Ge.Instant },
        o = {
          type: "add",
          key:
            ((t = n.key) == null ? void 0 : t.toString()) ||
            `stack-${this.state.historyItemId + 1}`,
          transition: r,
          component: n,
        },
        s = X1(this.state, o);
      s && (this.state = s);
    }
    componentDidMount() {
      var e;
      let t = this.state.history[this.state.current];
      t && ((e = this.context) == null || e.call(this, t.key));
    }
    UNSAFE_componentWillReceiveProps(e) {
      var t;
      let n = e.children;
      if (!na(n) || !ta(n)) return;
      let r = (t = n.key) == null ? void 0 : t.toString();
      r &&
        (this.state.history.length === 0
          ? this.transition(n, Ge.Instant)
          : this.navigationAction({ type: "update", key: r, component: n }));
    }
    componentWillUnmount() {
      var e, t;
      (t = (e = this.props).resetProjection) == null || t.call(e);
    }
    getStackState(e) {
      let {
        current: t,
        previous: n,
        currentOverlay: r,
        previousOverlay: i,
      } = this.state;
      return e.overCurrentContext
        ? { current: r, previous: i, history: this.state.overlayStack }
        : { current: t, previous: n, history: this.state.history };
    }
    isSameEventTransition() {
      return globalThis.event
        ? this.lastEventTimeStamp === globalThis.event.timeStamp
        : !1;
    }
    transition(e, t, n) {
      var r, i;
      if (
        this.isSameEventTransition() ||
        ((this.lastEventTimeStamp =
          ((r = globalThis.event) == null ? void 0 : r.timeStamp) || null),
        !e || !na(e) || !ta(e))
      )
        return;
      let o = { ...t, ...n };
      if (!!o.overCurrentContext)
        return this.navigationAction({
          type: "addOverlay",
          transition: o,
          component: e,
        });
      let a =
        ((i = e.key) == null ? void 0 : i.toString()) ||
        `stack-${this.state.historyItemId + 1}`;
      this.navigationAction({
        type: "add",
        key: a,
        transition: o,
        component: e,
      });
    }
    instant(e) {
      this.transition(e, Ge.Instant, void 0);
    }
    fade(e, t) {
      this.transition(e, Ge.Fade, t);
    }
    push(e, t) {
      this.transition(e, WA(t), t);
    }
    modal(e, t) {
      this.transition(e, Ge.Modal, t);
    }
    overlay(e, t) {
      this.transition(e, UA(t), t);
    }
    flip(e, t) {
      this.transition(e, XA(t), t);
    }
    magicMotion(e, t) {
      this.transition(e, Ge.MagicMotion, t);
    }
    customTransition(e, t) {
      this.transition(e, t);
    }
    render() {
      var e, t, n, r, i;
      let o = this.getStackState({ overCurrentContext: !1 }),
        s = this.getStackState({ overCurrentContext: !0 }),
        a = oD(s),
        l = s.current > -1,
        c = this.state.history.length === 1,
        u = [];
      for (let [d, h] of Object.entries(this.state.containers)) {
        let g = this.state.containerIndex[d];
        ae(g !== void 0, "Container's index must be registered");
        let y = this.state.containerVisualIndex[d];
        ae(y !== void 0, "Container's visual index must be registered");
        let S = this.state.containerIsRemoved[d],
          p = this.state.history[g],
          m = this.state.transitionForContainer[d],
          v = g === this.state.current,
          x = g === this.state.previous,
          C = v ? !1 : S,
          w =
            ((e = p?.transition) == null ? void 0 : e.withMagicMotion) ||
            (v && !!this.state.previousTransition);
        u.push(
          T(
            bp,
            {
              id: d,
              index: y,
              isInitial: c,
              isCurrent: v,
              isPrevious: x,
              isOverlayed: l,
              visible: v || x,
              position: (t = p?.transition) == null ? void 0 : t.position,
              instant: G1(g, o),
              transitionProps: m,
              animation: Y1(g, o),
              backfaceVisible: dD(g, o),
              exitAnimation: (n = p?.transition) == null ? void 0 : n.animation,
              exitBackfaceVisible:
                (r = p?.transition) == null ? void 0 : r.backfaceVisible,
              exitProps: (i = p?.transition) == null ? void 0 : i.enter,
              withMagicMotion: w,
              areMagicMotionLayersPresent: C ? !1 : void 0,
              children: T(vA, {
                children: K1({ component: h, transition: p?.transition }),
              }),
            },
            d
          )
        );
      }
      let f = this.state.overlayStack.map((d, h) =>
        T(
          bp,
          {
            isLayeredContainer: !0,
            isCurrent: h === this.state.currentOverlay,
            position: d.transition.position,
            initialProps: fD(h, s),
            transitionProps: hD(h, s),
            instant: G1(h, s, !0),
            animation: Y1(h, s),
            exitProps: d.transition.enter,
            visible: pD(h, s),
            backdropColor: cD(d.transition),
            backfaceVisible: uD(h, s),
            onTapBackdrop: mD(d.transition, this.goBack),
            index: this.state.current + 1 + h,
            children: K1({ component: d.component, transition: d.transition }),
          },
          d.key
        )
      );
      return T(Xc, {
        "data-framer-component-type": "NavigationRoot",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "relative",
        style: {
          overflow: "hidden",
          backgroundColor: "unset",
          pointerEvents: void 0,
          ...this.props.style,
        },
        children: T(Tw.Provider, {
          value: this,
          children: oe(Fw.Provider, {
            value: c,
            children: [
              T(bp, {
                isLayeredContainer: !0,
                position: void 0,
                initialProps: {},
                instant: !1,
                transitionProps: sD(a),
                animation: aD(a),
                backfaceVisible: lD(a),
                visible: !0,
                backdropColor: void 0,
                onTapBackdrop: void 0,
                index: 0,
                children: T(cL, {
                  children: T(pA, {
                    children: T($f, { presenceAffectsLayout: !1, children: u }),
                  }),
                }),
              }),
              T($f, { children: f }),
            ],
          }),
        }),
      });
    }
  };
R(rm, "defaultProps", { enabled: !0 });
R(rm, "contextType", Iw);
var _w = { stiffness: 500, damping: 50, restDelta: 1, type: "spring" };
function oD(e) {
  let t, n;
  return (
    e.current !== -1 ? (t = e.history[e.current]) : (n = e.history[e.previous]),
    { currentOverlayItem: t, previousOverlayItem: n }
  );
}
function sD({ currentOverlayItem: e }) {
  return e && e.transition.exit;
}
function aD({ currentOverlayItem: e, previousOverlayItem: t }) {
  return e && e.transition.animation
    ? e.transition.animation
    : t && t.transition.animation
    ? t.transition.animation
    : _w;
}
function lD({ currentOverlayItem: e, previousOverlayItem: t }) {
  return e ? e.transition.backfaceVisible : t && t.transition.backfaceVisible;
}
function cD(e) {
  if (e.backdropColor) return e.backdropColor;
  if (e.overCurrentContext) return "rgba(4,4,15,.4)";
}
function uD(e, t) {
  let { current: n, history: r } = t;
  if (e === n) {
    let i = r[e];
    return i && i.transition ? i.transition.backfaceVisible : !0;
  } else if (e < n) {
    let i = r[e + 1];
    return i && i.transition ? i.transition.backfaceVisible : !0;
  } else {
    let i = r[e];
    return i && i.transition ? i.transition.backfaceVisible : !0;
  }
}
function fD(e, t) {
  let n = t.history[e];
  if (n) return n.transition.enter;
}
function dD(e, t) {
  var n, r, i, o;
  let { current: s, previous: a, history: l } = t;
  return (e === a && s > a) || (e === s && s < a)
    ? (r = (n = l[e + 1]) == null ? void 0 : n.transition) == null
      ? void 0
      : r.backfaceVisible
    : (o = (i = l[e]) == null ? void 0 : i.transition) == null
    ? void 0
    : o.backfaceVisible;
}
function hD(e, t) {
  let { current: n, history: r } = t;
  if (e !== n)
    if (e < n) {
      let i = r[e + 1];
      if (i && i.transition) return i.transition.exit;
    } else {
      let i = r[e];
      if (i && i.transition) return i.transition.enter;
    }
}
function Y1(e, t) {
  let { current: n, previous: r, history: i } = t,
    o = r > n ? r : n;
  if (e < o) {
    let s = i[e + 1];
    if (s && s.transition.animation) return s.transition.animation;
  } else if (e !== o) {
    let s = i[e];
    if (s && s.transition.animation) return s.transition.animation;
  } else {
    let s = i[e];
    if (s?.transition.animation) return s.transition.animation;
  }
  return _w;
}
function G1(e, t, n) {
  let { current: r, previous: i, history: o } = t;
  return !!((n && o.length > 1) || (e !== i && e !== r) || r === i);
}
function pD(e, t) {
  let { current: n, previous: r } = t;
  return e > n && e > r ? !1 : e === n;
}
function K1(e) {
  return b.Children.map(e.component, (n) => {
    var r;
    if (!na(n) || !ta(n) || !n.props) return n;
    let i = { style: n.props.style ?? {} },
      o = (r = e?.transition) == null ? void 0 : r.position,
      s = !o || (o.left !== void 0 && o.right !== void 0),
      a = !o || (o.top !== void 0 && o.bottom !== void 0),
      l = "style" in n.props ? Ae(n.props.style) : !0;
    return (
      s &&
        ("width" in n.props && (i.width = "100%"),
        l && (i.style.width = "100%")),
      a &&
        ("height" in n.props && (i.height = "100%"),
        l && (i.style.height = "100%")),
      b.cloneElement(n, i)
    );
  });
}
function mD(e, t) {
  if (e.goBackOnTapOutside !== !1) return t;
}
function vD() {
  return (
    b.useInsertionEffect(() => {
      Ca();
    }, []),
    null
  );
}
function gD(e) {
  let t = Vy(),
    n = Yf();
  return oe(rm, {
    ...e,
    resetProjection: t,
    skipLayoutAnimation: n,
    children: [e.children, T(vD, {})],
  });
}
var cN = Yt(au(), 1);
var dN = Yt(zp(), 1);
var gN = !!(JS() && $M() < 15.4);
function im(...e) {
  return e.filter(Boolean).join(" ");
}
var yD = {};
Object.freeze(yD);
var MN = (4 / 60) * 1e3;
var bD = (() => {
    function e(t = {}) {
      let n = yp(t, !1, !1);
      return e.addData(n), n;
    }
    return (
      (e._stores = []),
      (e.addData = (t) => {
        e._stores.push(t);
      }),
      (e.reset = () => {
        e._stores.forEach((t) => yp.resetObject(t));
      }),
      (e.addObserver = (t, n) => yp.addObserver(t, n)),
      e
    );
  })(),
  xp = bD;
var xD = { update: 0 },
  SD = b.createContext({ update: NaN });
var wD = class extends be {
    constructor() {
      super(...arguments),
        R(this, "observers", []),
        R(this, "state", xD),
        R(this, "taskAdded", !1),
        R(this, "frameTask", () => {
          this.setState({ update: this.state.update + 1 }),
            (this.taskAdded = !1);
        }),
        R(this, "observer", () => {
          this.taskAdded ||
            ((this.taskAdded = !0), WS.addFrameTask(this.frameTask));
        });
    }
    componentWillUnmount() {
      this.observers.map((e) => e()), xp.reset();
    }
    render() {
      let { children: e } = this.props;
      return (
        this.observers.map((t) => t()),
        (this.observers = []),
        xp._stores.forEach((t) => {
          let n = xp.addObserver(t, this.observer);
          this.observers.push(n);
        }),
        T(SD.Provider, { value: { ...this.state }, children: e })
      );
    }
  },
  zN = Yt(au(), 1);
var Lw = "__framer__",
  CD = Lw.length;
function kD(e) {
  if (e.startsWith(Lw)) return e.substr(CD);
}
var On = [
    "opacity",
    "x",
    "y",
    "scale",
    "rotate",
    "rotateX",
    "rotateY",
    "skewX",
    "skewY",
    "transformPerspective",
  ],
  nu = (e) => ({
    x: he(e?.x ?? 0),
    y: he(e?.y ?? 0),
    opacity: he(e?.opacity ?? 1),
    scale: he(e?.scale ?? 1),
    rotate: he(e?.rotate ?? 0),
    rotateX: he(e?.rotateX ?? 0),
    rotateY: he(e?.rotateY ?? 0),
    skewX: he(e?.skewX ?? 0),
    skewY: he(e?.skewY ?? 0),
    transformPerspective: he(e?.transformPerspective ?? 0),
  }),
  Oe = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0,
    transformPerspective: 0,
  };
function Mw(e) {
  return e in Oe;
}
function Ow(e, t) {
  let n = _t(() => ({ values: nu(t ? e : void 0) }));
  return (
    b.useEffect(() => {
      if (!t)
        for (let r of On) {
          let i = Oe[r];
          St(i) || n.values[r].set(i);
        }
    }, [n, t]),
    n
  );
}
var TD = new Set([
    "loopEffectEnabled",
    "loopTransition",
    "loop",
    "loopRepeatType",
    "loopRepeatDelay",
  ]),
  ED = () => {
    let e = D();
    return (
      W(
        () => () => {
          clearTimeout(e.current);
        },
        []
      ),
      async (t) =>
        new Promise((n) => {
          e.current = setTimeout(() => {
            n(!0);
          }, t * 1e3);
        })
    );
  };
function RD({
  loopEffectEnabled: e,
  loopRepeatDelay: t,
  loopTransition: n,
  loopRepeatType: r,
  loop: i,
}) {
  let o = ni(),
    s = _t(() => ({ values: nu() })),
    a = b.useRef(!1),
    l = ED(),
    c = async () => {
      if (!i) return;
      let d = n || void 0,
        h = a.current && r === "mirror",
        g = h ? Oe : i,
        y = h ? i : Oe;
      return (
        (a.current = !a.current),
        Promise.all(
          On.map((S) => {
            if (!(o && S !== "opacity"))
              return (
                s.values[S].set(y[S] ?? Oe[S]),
                new Promise((p) => {
                  let m = { ...d, onComplete: () => p() };
                  $i(s.values[S], g[S] ?? y[S], m);
                })
              );
          })
        )
      );
    },
    u = async () => {
      e && (await c(), await l(t ?? 0), await u());
    },
    f = ce(() => {
      On.forEach((d) => {
        s.values[d].stop();
      }),
        On.forEach((d) => {
          s.values[d].set(Oe[d]);
        }),
        (a.current = !1);
    }, [s]);
  return b.useEffect(() => (e && i ? u() : f(), () => f()), [e]), s;
}
function PD(e, t, n, r, i) {
  let o = n / 100 - 1,
    s = i ? (t - r) * o : 0,
    a = -e * o;
  return s + a;
}
var ID = new Set([
  "speed",
  "adjustPosition",
  "offset",
  "parallaxTransformEnabled",
]);
function FD(e, t, n) {
  let {
      speed: r = 100,
      offset: i = 0,
      adjustPosition: o = !1,
      parallaxTransformEnabled: s,
    } = e,
    a = b.useRef(null),
    l = ni(),
    c = b.useCallback(
      (g) => (a.current === null || r === 100 ? 0 : PD(g, a.current, r, i, o)),
      [a, r, i, o]
    );
  b.useLayoutEffect(() => {
    Q.read(() => {
      var g, y;
      a.current =
        ((y = (g = t.current) == null ? void 0 : g.getBoundingClientRect()) ==
        null
          ? void 0
          : y.top) ?? 0;
    }),
      Q.update(() => {
        f.set(c(u.get())), o && d.set(n ?? "initial");
      });
  }, [t, a, o]);
  let { scrollY: u } = Ey(),
    f = mt(u, c),
    d = Cn(o && a.current === null ? "hidden" : n),
    h = Cn(0);
  return {
    values: { y: l || !s ? h : f },
    style: s ? { visibility: d } : void 0,
  };
}
function _D(e) {
  if (!(Fe(e) || !Ae(e))) return e?.transition;
}
async function q1(e, t, n, r, i) {
  let o = _D(e);
  return Promise.all(
    On.map(
      (s) =>
        new Promise((a) => {
          if (n && s !== "opacity") return a();
          let l = t.values[s];
          l.stop();
          let c = Ae(e) ? e?.[s] ?? Oe[s] : Oe[s];
          if ((ge(c) && (c = c.get()), !mn(c))) return a();
          let u = $n.get(r.current);
          u && u.setBaseTarget(s, c);
          let f =
              Fe(i) && !l?.hasAnimated && De.HandoffAppearAnimations
                ? { elapsed: De.HandoffAppearAnimations(i, s, l, Q) }
                : void 0,
            d = { ...o, velocity: 0, elapsed: 0, ...f, onComplete: () => a() };
          $i(l, c, d);
        })
    )
  );
}
var LD = new Set(["presenceInitial", "presenceAnimate", "presenceExit"]);
function MD(e, t) {
  let n = e.getVariantContext(),
    r = { ...t };
  if (Array.isArray(n?.animate))
    for (let i of n.animate) Object.assign(r, e.getVariant(i));
  return r;
}
function OD(
  {
    initial: e,
    animate: t,
    exit: n,
    presenceInitial: r,
    presenceAnimate: i,
    presenceExit: o,
  },
  s,
  a,
  l,
  c
) {
  let u = r ?? e,
    f = i ?? t,
    d = o ?? n,
    h = D(!1),
    g = _t(() => {
      var m;
      let v = u ?? l;
      if (!Ae(v)) return { values: nu() };
      let x = {};
      for (let C in v) {
        let w = Ae(v) ? ((m = Ve(v)) == null ? void 0 : m[C]) : void 0;
        mn(w) && (x[C] = w);
      }
      return { values: nu(x) };
    }),
    [y, S] = ll(),
    p = ni();
  return (
    or(() => {
      if (((h.current = !0), !a)) {
        S?.();
        return;
      }
      y
        ? u && f && q1(f, g, p, s, c)
        : d
        ? q1(d, g, p, s).then(() => S())
        : S();
    }, [y]),
    or(() => {
      if (!h.current) return;
      let m = $n.get(s.current);
      if (!m) return;
      let v = Ae(f) ? f : MD(m, l);
      for (let x in g.values) {
        if (!Mw(x)) continue;
        let C = v?.[x];
        m.setBaseTarget(x, mn(C) ? C : Oe[x]);
      }
    }, [JSON.stringify(f)]),
    g
  );
}
function AD(e, t) {
  let n = 0,
    r = e;
  for (; r && r !== t && r instanceof HTMLElement; )
    (n += r.offsetTop), (r = r.offsetParent);
  return n;
}
var DD = 1;
function Aw(e, t = 0, n) {
  var r;
  let i = [],
    o = [];
  for (let s = e.length; s >= 0; s--) {
    let { ref: a, offset: l } = e[s] ?? {};
    if (!a || !a.current) continue;
    let u = AD(a.current, document.documentElement) - DD - (l ?? 0) - t,
      f = ((r = a.current) == null ? void 0 : r.clientHeight) ?? 0,
      d = i[i.length - 1],
      h = Math.max(u + f, 0);
    i.push(u),
      o.unshift(
        Math.max(u, 0),
        d === void 0 ? h : Math.min(h, Math.max(d - 1, 0))
      ),
      n?.(s);
  }
  return o;
}
function VD(e, t = 0) {
  return e < t ? "up" : "down";
}
var BD = 4;
function HD(e, t, n = {}) {
  let { direction: r, target: i } = e ?? {},
    { repeat: o = !0, enabled: s = !0 } = n;
  b.useEffect(() => {
    if (!r || !s) return;
    let a,
      l = 0,
      c,
      u;
    return Ni(({ y: f }) => {
      if ((!o && u === i) || f.current > f.scrollLength || f.current < 0)
        return;
      let d = VD(f.current, a);
      a = f.current;
      let h = d !== c;
      if (((c = d), h)) l = f.current;
      else {
        if (Math.abs(f.current - l) < BD) return;
        let y = d === r ? i : void 0;
        y !== u && t(y), (u = y);
      }
    });
  }, [r, o, i, s, t]);
}
var zD = new Set([
    "threshold",
    "animateOnce",
    "opacity",
    "targetOpacity",
    "x",
    "y",
    "scale",
    "transition",
    "rotate",
    "rotateX",
    "rotateY",
    "perspective",
    "enter",
    "exit",
    "animate",
    "styleAppearEffectEnabled",
    "targets",
    "scrollDirection",
  ]),
  ND = ["animate", "animate"],
  Q1 = { inputRange: [], outputRange: [] };
function $D(e, t, n) {
  let r = Aw(e, t),
    i = [...ND],
    o = r[0];
  if (!mn(o)) return Q1;
  if ((o > 1 && (r.unshift(0, o - 1), i.unshift("initial", "initial")), n)) {
    let s = r.length - 1,
      a = r[s];
    if (!mn(a)) return Q1;
    r.push(a + 1), i.push("exit");
  }
  return { inputRange: r, outputRange: i };
}
function Sp(e) {
  return {
    x: e?.x ?? Oe.x,
    y: e?.y ?? Oe.y,
    scale: e?.scale ?? Oe.scale,
    opacity: e?.opacity ?? Oe.opacity,
    transformPerspective: e?.transformPerspective ?? Oe.transformPerspective,
    rotate: e?.rotate ?? Oe.rotate,
    rotateX: e?.rotateX ?? Oe.rotateX,
    rotateY: e?.rotateY ?? Oe.rotateY,
    skewX: e?.skewX ?? Oe.skewX,
    skewY: e?.skewY ?? Oe.skewY,
    transition: e?.transition ?? void 0,
  };
}
function jD({
  opacity: e,
  targetOpacity: t,
  perspective: n,
  enter: r,
  exit: i,
  animate: o,
  ...s
}) {
  return b.useMemo(
    () => ({
      initial: r ?? Sp({ ...s, opacity: e ?? t ?? 1, transformPerspective: n }),
      animate: o ?? Sp({ opacity: t }),
      exit: i ?? Sp(),
    }),
    [o, s, r, i, e, t, n]
  );
}
function WD(e, t) {
  let n = ni(),
    r = jD(e),
    i = e.styleAppearEffectEnabled,
    o = Ow(i ? r.initial : r.animate, i),
    s = b.useRef({
      isPlaying: !1,
      scheduledAppearState: void 0,
      lastAppearState: !e.styleAppearEffectEnabled,
    }),
    a = b.useRef(),
    l = b.useCallback(async ({ transition: d, ...h }, g) => {
      let y = d ?? r.animate.transition ?? e.transition;
      await a.current,
        (a.current = Promise.all(
          On.map((S) => {
            g && o.values[S].set(r.initial[S] ?? Oe[S]);
            let p = h[S] ?? Oe[S],
              m = $n.get(t.current);
            return (
              m && typeof p != "object" && m.setBaseTarget(S, p),
              new Promise((v) => {
                if (n && S !== "opacity") v();
                else {
                  let x = {
                    restDelta: S === "scale" ? 0.001 : void 0,
                    ...y,
                    onComplete: () => v(),
                  };
                  $i(o.values[S], p, x);
                }
              })
            );
          })
        ));
    }, []),
    c = e.animateOnce && s.current.lastAppearState === !0,
    u = !e.targets && e.styleAppearEffectEnabled && !e.scrollDirection && !c;
  wA(
    t,
    (d) => {
      let { isPlaying: h, lastAppearState: g } = s.current;
      if (h) {
        s.current.scheduledAppearState = d;
        return;
      }
      (s.current.scheduledAppearState = void 0),
        (s.current.lastAppearState = d),
        g !== d && l(d ? r.animate : r.exit, d);
    },
    { enabled: u, animateOnce: !!e.animateOnce, threshold: { y: e.threshold } }
  );
  let f = e.targets && i && !e.scrollDirection;
  return (
    b.useEffect(() => {
      if (!f) return;
      let d = { initial: !0 },
        h = "initial";
      return Ni(({ y: g }) => {
        let { targets: y } = e;
        if (!y || !y[0] || (y[0].ref && !y[0].ref.current)) return;
        let { inputRange: S, outputRange: p } = $D(
          y,
          (e.threshold ?? 0) * g.containerLength,
          !!e.exit
        );
        if (S.length === 0 || S.length !== p.length) return;
        let m = ns(g.current, S, p);
        if ((e.animateOnce && d[m]) || ((d[m] = !0), h === m)) return;
        h = m;
        let v = Ve(r)[m];
        v && l(v);
      });
    }, [f]),
    HD(e.scrollDirection, (d) => l(d ?? r.animate), {
      enabled: i,
      repeat: !e.animateOnce,
    }),
    o
  );
}
var UD = new Set([
    "transformViewportThreshold",
    "styleTransformEffectEnabled",
    "transformTargets",
    "spring",
    "transformTrigger",
  ]),
  XD = (e, t) => {
    var n;
    let r = (n = e?.[0]) == null ? void 0 : n.target;
    return t ? { opacity: r?.opacity ?? 1 } : r;
  },
  Dw = () => ({
    opacity: [],
    x: [],
    y: [],
    scale: [],
    rotate: [],
    rotateX: [],
    rotateY: [],
    skewX: [],
    skewY: [],
    transformPerspective: [],
  });
function YD(e, t) {
  let n = b.useRef({});
  b.useEffect(() => {
    if (t !== void 0)
      for (let r of ki(e)) {
        let i = e[r];
        i.attach((o, s) => {
          let a = n.current[r];
          if (
            (a && a.stop(),
            (n.current[r] = ei({
              keyframes: [i.get(), o],
              velocity: i.getVelocity(),
              ...t,
              restDelta: 0.001,
              onUpdate: s,
            })),
            !Re.isProcessing)
          ) {
            let l = performance.now() - Re.timestamp;
            l < 40 && (n.current[r].time = l / 1e3);
          }
          return i.get();
        });
      }
  }, [JSON.stringify(t)]);
}
function GD(e, t) {
  let n = Dw();
  return {
    inputRange: Aw(e, t, (i) => {
      var o, s, a;
      let l = (o = e[i - 1]) == null ? void 0 : o.target,
        c = (s = e[i]) == null ? void 0 : s.target;
      for (let u of On)
        (a = n[u]) == null || a.unshift(l?.[u] ?? 0, c?.[u] ?? 0);
    }),
    effectKeyOutputRange: n,
  };
}
function KD(e) {
  var t;
  let n = Dw();
  for (let { target: r } of e)
    for (let i of On) (t = n[i]) == null || t.push(r[i]);
  return n;
}
var Z1 = [0, 1];
function qD(
  {
    transformTrigger: e,
    styleTransformEffectEnabled: t,
    transformTargets: n,
    spring: r,
    transformViewportThreshold: i = 0,
  },
  o
) {
  let s = ni(),
    a = Ow(XD(n, s), t);
  return (
    b.useLayoutEffect(() => {
      if (!(!t || !n))
        if (e !== "onScrollTarget") {
          let l = KD(n);
          return Ni(
            ({ y: c }) => {
              for (let u of On)
                (s && u !== "opacity") ||
                  (Z1.length === l[u].length &&
                    a.values[u].set(ns(c.progress, Z1, l[u])));
            },
            e === "onInView"
              ? {
                  target: o.current ?? void 0,
                  offset: ["start end", "end end"],
                }
              : void 0
          );
        } else
          return Ni(({ y: l }) => {
            if (!n[0] || (n[0].ref && !n[0].ref.current)) return;
            let { inputRange: c, effectKeyOutputRange: u } = GD(
              n,
              i * l.containerLength
            );
            if (c.length !== 0)
              for (let f of On)
                (s && f !== "opacity") ||
                  (c.length === u[f].length &&
                    a.values[f].set(ns(l.current, c, u[f])));
          });
    }, [s, e, o, i, t, a, n]),
    YD(a.values, r),
    a
  );
}
var Vw = {
    parallax: ID,
    styleAppear: zD,
    styleTransform: UD,
    loop: TD,
    presence: LD,
  },
  QD = ki(Vw);
function J1(e, t, n) {
  return (!(e in n) && t in n) || n[e] === !0;
}
function ZD(e) {
  let t = {
    parallax: {},
    styleAppear: {},
    styleTransform: {},
    presence: { animate: e.animate, initial: e.initial, exit: e.exit },
    loop: {},
    forwardedProps: {},
  };
  for (let n in e) {
    let r = kD(n);
    if (r)
      for (let i of QD) {
        let o = Vw[i];
        if (o?.has(r)) {
          t[i][r] = Ve(e)[n];
          break;
        }
      }
    else t.forwardedProps[n] = Ve(e)[n];
  }
  return (
    (t.parallax.parallaxTransformEnabled = J1(
      "parallaxTransformEnabled",
      "speed",
      t.parallax
    )),
    (t.styleAppear.styleAppearEffectEnabled = J1(
      "styleAppearEffectEnabled",
      "animateOnce",
      t.styleAppear
    )),
    t
  );
}
var Ar = (e) => e.reduce((t, n) => (t += n), 0),
  eS = (e) => e.reduce((t, n) => (t = t * n), 1),
  JD = "current";
function eV(e) {
  return Ae(e) && JD in e;
}
function tV(e, t) {
  if (!e || !Ae(e)) return t;
  for (let n in e) {
    let r = e[n];
    !ge(r) || !Mw(n) || (mn(r.get()) && t[n].push(r));
  }
}
function Ks(e) {
  return Fe(e) || Array.isArray(e);
}
var ZN = (e) =>
  b.forwardRef((t, n) => {
    if (t.__withFX)
      return T(e, {
        ...t,
        animate: void 0,
        initial: void 0,
        exit: void 0,
        ref: n,
      });
    if (_e.current() === "CANVAS") {
      let q = Ks(t.animate) ? t.animate : void 0,
        ee = Ks(t.initial) ? t.initial : void 0;
      return T(e, { ...t, animate: q, initial: ee, exit: void 0, ref: n });
    }
    let r = b.useRef(null),
      i = n ?? r,
      {
        parallax: o = {},
        styleAppear: s = {},
        styleTransform: a = {},
        presence: l = {},
        loop: c = {},
        forwardedProps: u,
      } = ZD(t),
      {
        __targetOpacity: f,
        __perspectiveFX: d,
        __smartComponentFX: h = !1,
      } = t,
      g = Cn(f ?? 1),
      { values: y } = OD(l, i, h, t.style, t[qa]),
      { values: S, style: p } = FD(o, i),
      { values: m } = qD(a, i),
      { values: v } = WD(s, i),
      { values: x } = RD(c),
      C = b.useMemo(
        () => ({
          scale: [v.scale, x.scale, y.scale, m.scale],
          opacity: [v.opacity, x.opacity, y.opacity, g, m.opacity],
          x: [v.x, x.x, y.x, m.x],
          y: [v.y, x.y, S.y, y.y, m.y],
          rotate: [v.rotate, x.rotate, y.rotate, m.rotate],
          rotateX: [v.rotateX, x.rotateX, y.rotateX, m.rotateX],
          rotateY: [v.rotateY, x.rotateY, y.rotateY, m.rotateY],
          skewX: [v.skewX, x.skewX, y.skewX, m.skewX],
          skewY: [v.skewY, x.skewY, y.skewY, m.skewY],
          transformPerspective: [
            m.transformPerspective,
            v.transformPerspective,
          ],
        }),
        [g, m, S, v, x, y]
      );
    tV(t.style, C);
    let w = mt(C.scale, eS),
      k = mt(C.opacity, eS),
      E = mt(C.x, Ar),
      P = mt(C.y, Ar),
      I = mt(C.rotate, Ar),
      H = mt(C.rotateX, Ar),
      L = mt(C.rotateY, Ar),
      G = mt(C.skewX, Ar),
      B = mt(C.skewY, Ar),
      J = mt(C.transformPerspective, Ar),
      { drag: Y, dragConstraints: V } = u;
    LO(Y && eV(V) ? V : void 0);
    let z = {
      opacity: k,
      scale: w,
      x: E,
      y: P,
      rotate: I,
      rotateX: H,
      rotateY: L,
      skewX: G,
      skewY: B,
    };
    St(d) && (z.transformPerspective = J);
    let A = Ks(t.animate) ? t.animate : void 0,
      K = Ks(t.initial) ? t.initial : void 0,
      N = Ks(t.exit) ? t.exit : void 0,
      te = h && !l.presenceInitial ? { initial: K, animate: A, exit: N } : {};
    return T(e, {
      ...u,
      ...te,
      __withFX: !0,
      style: { ...t.style, ...p, ...z },
      values: y,
      ref: i,
    });
  });
function om(e) {
  let t = _t(() => nV(e));
  return t.useSetup(e), t.cloneAsElement;
}
function nV(e) {
  let t = { forwardedRef: e, childRef: null, ref: null };
  t.ref = tS(t);
  let n = (s, a) => {
      if (!t.forwardedRef && t.forwardedRef === s) {
        t.ref = a;
        return;
      }
      let l = !1;
      t.childRef !== a && ((t.childRef = a), (l = !0)),
        t.forwardedRef !== s && ((t.forwardedRef = s), (l = !0)),
        l && (t.ref = tS(t));
    },
    r = !1;
  function i(s, a) {
    if (r)
      throw new ReferenceError(
        "useCloneChildrenWithPropsAndRef: You should not call cloneChildrenWithPropsAndRef more than once during the render cycle."
      );
    return (
      (r = !0),
      gn.count(s) > 1 && e && ((t.forwardedRef = void 0), (t.ref = t.childRef)),
      gn.map(s, (l) => {
        if (yn(l)) {
          let c = "ref" in l ? l.ref : void 0;
          n(t.forwardedRef, c);
          let u = t.ref !== c ? { ...a, ref: t.ref } : a;
          return rn(l, u);
        }
        return l;
      })
    );
  }
  let o = function (a, l) {
    return T(Ne, { children: i(a, l) });
  };
  return (
    (o.cloneAsArray = i),
    {
      useSetup: (s) => {
        (r = !1), n(s, t.childRef);
      },
      cloneAsElement: o,
    }
  );
}
function tS(e) {
  if (!e.forwardedRef) return e.childRef;
  let { forwardedRef: t, childRef: n } = e;
  return (r) => {
    nS(n, r), nS(t, r);
  };
}
function nS(e, t) {
  Yp(e) ? e(t) : rV(e) && (e.current = t);
}
function rV(e) {
  return Ae(e) && "current" in e;
}
var Bw = b.createContext({});
function i6() {
  return b.useContext(Bw);
}
var o6 = b.forwardRef(({ width: e, children: t, ...n }, r) => {
    let i = b.useMemo(() => ({ width: e }), [e]),
      o = om(r);
    return T(Bw.Provider, { value: i, children: o(t, n) });
  }),
  iV = (e) =>
    b.forwardRef((t, n) => {
      let r = ka(t);
      return T(e, {
        layoutId: r,
        ...t,
        layoutIdKey: void 0,
        duplicatedFrom: void 0,
        ref: n,
      });
    }),
  oV = b.forwardRef(({ children: e, layoutId: t, ...n }, r) => {
    let i = _t(() => (t ? `${t}-container` : void 0));
    return T(Ot.div, {
      layoutId: i,
      ...n,
      ref: r,
      children: T(Fo.Provider, {
        value: !0,
        children: T(fL, {
          enabled: !1,
          children: T(Cy, {
            id: t ?? "",
            inherit: "id",
            children: b.Children.map(e, (o) =>
              b.isValidElement(o) ? b.cloneElement(o, { layoutId: t }) : o
            ),
          }),
        }),
      }),
    });
  }),
  u6 = iV(oV),
  sV = b.createContext(void 0);
if ($r())
  for (let e of document.querySelectorAll("style[data-framer-css-ssr]"))
    document.head.appendChild(e);
var aV = (() => {
    var e;
    if (!$r()) return new Set();
    let t =
      (e = document.querySelector("style[data-framer-css-ssr-minified]")) ==
      null
        ? void 0
        : e.getAttribute("data-framer-components");
    return t ? new Set(t.split(" ")) : new Set();
  })(),
  Hw = { "data-framer-css-ssr": !0 },
  lV = (e, t, n) =>
    b.forwardRef((r, i) => {
      let { sheet: o, cache: s } = b.useContext(sV) ?? {};
      if (!$r()) {
        let a = Array.isArray(t)
          ? t.join(`
`)
          : t;
        return oe(Ne, {
          children: [
            T("style", {
              ...Hw,
              "data-framer-component": n,
              dangerouslySetInnerHTML: { __html: a },
            }),
            T(e, { ...r, ref: i }),
          ],
        });
      }
      return (
        b.useInsertionEffect(() => {
          if (n && aV.has(n)) return;
          (Array.isArray(t)
            ? t
            : t.split(`
`)
          ).forEach((l) => l && YS(l, o, s));
        }, []),
        T(e, { ...r, ref: i })
      );
    }),
  sm = b.createContext({
    onRegisterCursors: () => () => {},
    registerCursors: () => {},
  }),
  ru = "framer-cursor-none",
  Ap = "framer-pointer-events-none",
  cV = b.memo(function ({ children: t }) {
    let n = _t(() => {
        let i = new Set(),
          o = {};
        return {
          onRegisterCursors: (s) => (s(o), i.add(s), () => i.delete(s)),
          registerCursors: (s) => {
            let a = {};
            for (let l in s) {
              let c = o[l] ?? s[l];
              c && (a[l] = c);
            }
            o = a;
            for (let l of i) l(o);
          },
        };
      }),
      r = ni();
    return oe(sm.Provider, { value: n, children: [t, !r && T(mV, {})] });
  }),
  uV = lV(cV, [
    `.${ru}, .${ru} * { cursor: none !important; }`,
    `.${Ap}, .${Ap} * { pointer-events: none !important; }`,
  ]),
  fV = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 12 + 1,
    pointerEvents: "none",
  };
function dV(e) {
  return !(!e || e.placement || e.alignment);
}
function zc(e) {
  switch (e) {
    case "start":
      return "0%";
    case "center":
      return "-50%";
    case "end":
      return "-100%";
    default:
      We(e);
  }
}
function hV(e, t = "center") {
  switch (e) {
    case "top":
      return `${zc(t)}, -100%`;
    case "right":
      return `0%, ${zc(t)}`;
    case "bottom":
      return `${zc(t)}, 0%`;
    case "left":
      return `-100%, ${zc(t)}`;
    default:
      return "-50%, -50%";
  }
}
var rS = "data-framer-portal-id";
function iS(e, t) {
  let n = document.elementFromPoint(e, t);
  for (; n; ) {
    if (n === document.body) return;
    let r = n.getAttribute("data-framer-cursor");
    if (r) return r;
    if (n.hasAttribute(rS)) {
      let i = n.getAttribute(rS);
      (n = n.parentElement), i && (n = document.getElementById(i) ?? n);
    } else n = n.parentElement;
  }
}
function pV(e) {
  for (let t in e) return !1;
  return !0;
}
var mV = b.memo(function () {
  let { onRegisterCursors: t } = M(sm),
    n = Cn(0),
    r = Cn(0),
    i = Cn(0),
    o = b.useRef(null),
    s = b.useRef({ cursors: {}, cursorHash: void 0 }),
    a = du(),
    l = !pV(s.current.cursors);
  b.useEffect(() => {
    let w = 0,
      k = 0;
    function E() {
      n.set(w), r.set(k), $i(i, 1, { type: "tween", duration: 0.2 });
    }
    function P(L) {
      L.pointerType !== "touch" &&
        ((w = L.clientX), (k = L.clientY), Q.update(E));
    }
    let I = () => {
      if (!l) return;
      let L = iS(w, k);
      L !== s.current.cursorHash &&
        ((s.current.cursorHash = L), Q.update(() => a()));
    };
    Q.read(I, !0);
    function H(L) {
      if (L.target === o.current || !o.current) return;
      let G = new PointerEvent(L.type, {
        bubbles: !0,
        cancelable: L.cancelable,
        pointerType: L.pointerType,
        pointerId: L.pointerId,
        composed: L.composed,
        isPrimary: L.isPrimary,
        buttons: L.buttons,
        button: L.button,
      });
      Q.update(() => {
        var B;
        (B = o.current) == null || B.dispatchEvent(G);
      });
    }
    return (
      De.addEventListener("pointermove", P),
      document.addEventListener("pointerdown", H),
      document.addEventListener("pointerup", H),
      () => {
        De.removeEventListener("pointermove", P),
          document.removeEventListener("pointerdown", H),
          document.removeEventListener("pointerup", H),
          pt(I);
      }
    );
  }, [i, n, r, l, a]),
    b.useEffect(() => {
      function w() {
        $i(i, 0, { type: "tween", duration: 0.2 });
      }
      return (
        document.addEventListener("mouseleave", w),
        De.addEventListener("blur", w),
        () => {
          document.removeEventListener("mouseleave", w),
            De.removeEventListener("blur", w);
        }
      );
    }, [i]),
    b.useLayoutEffect(() => {
      function w(E) {
        (s.current.cursors = E),
          (s.current.cursorHash = iS(n.get(), r.get())),
          a();
      }
      let k = t(w);
      return () => {
        k(), document.body.classList.toggle(ru, !1);
      };
    }, [n, r, t, a]);
  let { cursors: c, cursorHash: u } = s.current,
    f = u ? c[u] : null,
    d = dV(f);
  b.useLayoutEffect(() => {
    document.body.classList.toggle(ru, d);
  }, [d]);
  let h = f?.component,
    g = f?.transition ?? { duration: 0 },
    y = Wf(n, g),
    S = Wf(r, g),
    p = mt(() => {
      var w;
      return y.get() + (((w = f?.offset) == null ? void 0 : w.x) ?? 0);
    }),
    m = mt(() => {
      var w;
      return S.get() + (((w = f?.offset) == null ? void 0 : w.y) ?? 0);
    }),
    v = f?.alignment,
    x = f?.placement,
    C = b.useCallback((w, k) => `translate(${hV(x, v)}) ${k}`, [v, x]);
  return !f || !h
    ? null
    : T(h, {
        transformTemplate: C,
        style: { ...fV, x: p, y: m, opacity: i },
        globalTapTarget: !0,
        variant: f?.variant,
        ref: o,
        className: Ap,
      });
});
function v6(e) {
  let { registerCursors: t } = M(sm),
    n = _t(() => e);
  b.useLayoutEffect(() => {
    t(n);
  }, [n, t]);
}
function oS(e) {
  switch (e) {
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "bottom":
      return "top";
    case "left":
      return "right";
    default:
      We(e);
  }
}
function sS(e, t, n, r = 0) {
  let i = Math.max(e, r);
  if (e < i) return i;
  let o = t + r;
  return i + o > n ? n - o : i;
}
function vV(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return t.y < 0 || t.y + t.height > n.height ? "y" : void 0;
    case "left":
    case "right":
      return t.x < 0 || t.x + t.width > n.width ? "x" : void 0;
    default:
      We(e);
  }
}
function gV(e, t, n, r) {
  switch (vV(t, e, r)) {
    case "x":
      return { placement: oS(t), x: n.x * -1, y: n.y };
    case "y":
      return { placement: oS(t), x: n.x, y: n.y * -1 };
    default:
      return { placement: t, x: n.x, y: n.y };
  }
}
function yV(e, t, n, r, i, o, s) {
  let a = ir.rebaseRectOnto(t, e, n, r),
    l = { x: a.x + i.x, y: a.y + i.y, width: t.width, height: t.height };
  if (!o) return [n, l];
  let { x: c, y: u, placement: f } = gV(l, n, i, o),
    d = ir.rebaseRectOnto(t, e, f, r);
  return [
    f,
    {
      x: sS(d.x + c, t.width, o.width, s),
      y: sS(d.y + u, t.height, o.height, s),
      width: t.width,
      height: t.height,
    },
  ];
}
function Dr(e, t, n) {
  return tt.insidePoints(e, [t, ...n]) ? t : e;
}
var Nc = 5;
function bV(e) {
  return {
    constrainX: (t) => Math.min(Math.max(t, e.x + Nc), e.x + e.width - Nc),
    constrainY: (t) => Math.min(Math.max(t, e.y + Nc), e.y + e.height - Nc),
  };
}
var $c = 4;
function xV({ x: e, y: t }, n, r, { constrainX: i, constrainY: o }) {
  let [s, a, l, c] = ir.points(r);
  switch (n) {
    case "left": {
      let u = { x: i(e - $c), y: t };
      return [u, Dr(c, a, [u, l]), Dr(l, s, [u, c])];
    }
    case "right": {
      let u = { x: i(e + $c), y: t };
      return [u, Dr(a, c, [u, s]), Dr(s, l, [u, a])];
    }
    case "top": {
      let u = { x: e, y: o(t - $c) };
      return [u, Dr(a, s, [u, c]), Dr(c, l, [u, a])];
    }
    case "bottom": {
      let u = { x: e, y: o(t + $c) };
      return [u, Dr(s, a, [u, l]), Dr(l, c, [u, s])];
    }
    default:
      We(n);
  }
}
function SV(e, t) {
  switch (e) {
    case "left":
      return `${Math.min(t.y, 0)}px auto auto 0px`;
    case "right":
      return `${Math.min(t.y, 0)}px 0px auto auto`;
    case "top":
      return `0px auto auto ${Math.min(t.x, 0)}px`;
    case "bottom":
      return `auto auto 0px ${Math.min(t.x, 0)}px`;
    default:
      We(e);
  }
}
function wV(e, t, n, r, i) {
  let o = Math.min(i.x, r.x),
    s = Math.min(i.y, r.y),
    a = ir.merge(r, i),
    l = xV({ x: e, y: t }, n, i, bV(r))
      .map((c) => `${c.x - o}px ${c.y - s}px`)
      .join(", ");
  return {
    height: `${a.height}px`,
    width: `${a.width}px`,
    clipPath: `polygon(${l})`,
    inset: SV(n, ir.delta(r, i)),
  };
}
function jc(e) {
  switch (e) {
    case "start":
      return 0;
    case "center":
      return 0.5;
    case "end":
      return 1;
    default:
      We(e);
  }
}
function aS(e = "bottom", t = "center") {
  switch (e) {
    case "top":
      return { originX: jc(t), originY: 1 };
    case "right":
      return { originX: 0, originY: jc(t) };
    case "bottom":
      return { originX: jc(t), originY: 0 };
    case "left":
      return { originX: 1, originY: jc(t) };
    default:
      We(e);
  }
}
function CV(e) {
  return Ae(e) && "current" in e;
}
function kV(e) {
  var t;
  let n = e.current,
    r = { position: "absolute", scrolls: !1 };
  for (; n; ) {
    if (
      n?.tagName === "BODY" ||
      (((t = getComputedStyle(n)) == null ? void 0 : t.position) === "fixed" &&
        (r.position = "fixed"),
      (n.scrollWidth > n.clientWidth || n.scrollHeight > n.clientHeight) &&
        (r.scrolls = !0),
      r.scrolls && r.position === "fixed")
    )
      return r;
    n = n.parentElement;
  }
  return r;
}
function TV(e) {
  let t;
  function n() {
    t = requestAnimationFrame(() => {
      e(), n();
    });
  }
  return [n, () => cancelAnimationFrame(t)];
}
function EV(e) {
  let t = 0,
    n = 0;
  return (r, i, o, s) => {
    var a;
    (a = e.current) != null &&
      a.style &&
      ((t = s?.clientX ?? t),
      (n = s?.clientY ?? n),
      Object.assign(e.current.style, wV(t, n, o, r, i)));
  };
}
function lS(e, t, n) {
  e.current &&
    Object.assign(e.current.style, {
      position: t,
      visibility: "visible",
      left: (n?.x ?? 0) + (t === "fixed" ? 0 : De.scrollX) + "px",
      top: (n?.y ?? 0) + (t === "fixed" ? 0 : De.scrollY) + "px",
    });
}
var zw = b.createContext(new Set());
function RV(e, t, n, { safeArea: r, onDismiss: i }) {
  let o = _t(() => new Set()),
    s = b.useContext(zw),
    [a, l] = ll();
  return (
    b.useEffect(() => {
      if (a) {
        if (!t.current) return;
        (t.current.style.pointerEvents = ""), s.add(t.current);
      } else {
        if (!t.current) return;
        (t.current.style.pointerEvents = "none"), s.delete(t.current), l();
      }
    }, [a, t, s]),
    b.useEffect(() => {
      if (!r) {
        let u = (f) => {
          f.key === "Escape" && i();
        };
        return (
          De.addEventListener("keyup", u),
          () => De.removeEventListener("keyup", u)
        );
      }
      function c(u) {
        if (o.size === 0) {
          for (let f of document.elementsFromPoint(u.x, u.y))
            if (f === e.current || f === t.current || f === n.current) return;
          i();
        }
      }
      return (
        De.addEventListener("mousemove", c),
        () => {
          De.removeEventListener("mousemove", c);
        }
      );
    }, [i, r, e, n, t, l, s, o]),
    o
  );
}
function PV({
  placement: e,
  alignment: t,
  offset: n,
  collisionDetectionSize: r,
  collisionDetectionPadding: i,
}) {
  return (o, s) => yV(o, s, e, t, n, r, i);
}
function IV(e, t) {
  return _t(() => {
    let { originX: n, originY: r } = aS(e, t),
      i = { x: he(n), y: he(r) };
    return [
      i,
      (o) => {
        let s = aS(o, t);
        i.x.set(s.originX), i.y.set(s.originY);
      },
    ];
  });
}
function FV(e, { x: t, y: n }) {
  if (!e || !na(e) || !ta(e) || (!Ae(e.props.style) && !St(e.props.style)))
    return null;
  let r = { ...e.props.style, originX: t, originY: n };
  return b.cloneElement(e, { style: r });
}
function x6({
  alignment: e,
  placement: t,
  safeArea: n,
  offsetX: r,
  offsetY: i,
  anchorRef: o,
  className: s,
  children: a,
  portalSelector: l,
  zIndex: c,
  collisionDetection: u = !1,
  collisionDetectionPadding: f,
  onDismiss: d,
  ...h
}) {
  let g = b.useRef(null),
    y = b.useRef(null),
    S = b.useRef(null),
    [p, m] = IV(t, e);
  b.useLayoutEffect(() => {
    if (!CV(o) || !S.current || !t || !e) return;
    let { position: x, scrolls: C } = kV(o),
      w = S.current.getBoundingClientRect(),
      k = o.current.getBoundingClientRect(),
      P = PV({
        placement: t,
        alignment: e,
        offset: { x: r ?? 0, y: i ?? 0 },
        collisionDetectionSize: u
          ? { width: De.innerWidth, height: De.innerHeight }
          : void 0,
        collisionDetectionPadding: f,
      }),
      [I, H] = P(k, w);
    lS(g, x, H), m(I);
    let L = EV(y),
      [G, B] = TV(() => {
        let V = o.current.getBoundingClientRect(),
          [z, A] = P(V, w);
        lS(g, x, A), m(z), n && L(V, A, z);
      });
    if ((C && G?.(), !n)) return () => B?.();
    let J = (V) => {
        let z = o.current.getBoundingClientRect(),
          [A, K] = P(z, w);
        L(z, K, A, V);
      },
      Y = o.current;
    return (
      Y.addEventListener("mousemove", J),
      () => {
        B?.(), Y.removeEventListener("mousemove", J);
      }
    );
  }, [n, t, e, r, i, o, u, f, m]);
  let v = RV(o, g, y, { safeArea: n, onDismiss: d });
  return sp.createPortal(
    oe("div", {
      ref: g,
      className: s,
      style: {
        visibility: "hidden",
        width: "auto",
        height: "auto",
        position: "absolute",
        zIndex: c,
      },
      ...h,
      children: [
        n
          ? T("div", {
              ref: y,
              style: { position: "absolute" },
              "data-safearea": !0,
            })
          : T("div", {
              style: { position: "fixed", inset: 0 },
              "aria-hidden": !0,
              onMouseDown: d,
            }),
        T(zw.Provider, {
          value: v,
          children: T("div", { ref: S, children: FV(a, p) }),
        }),
      ],
    }),
    document.querySelector(l) ?? document.body
  );
}
var _V = b.createContext(void 0),
  Nw = class {
    constructor(e) {
      (this.resolver = e), R(this, "status");
    }
    static is(e) {
      return e instanceof Nw;
    }
    preload() {
      if (this.status) {
        let t = this.status;
        return t.type !== "pending" ? void 0 : t.promise;
      }
      let e = this.resolver().then(
        (t) => {
          this.status = { type: "fulfilled", value: t };
        },
        (t) => {
          this.status = { type: "rejected", error: t };
        }
      );
      return (this.status = { type: "pending", promise: e }), e;
    }
    read() {
      let e = this.status;
      if (!e) throw new Error("Need to call preload() before read()");
      switch (e.type) {
        case "pending":
          throw new Error("Need to wait for preload() to resolve");
        case "fulfilled":
          return e.value;
        case "rejected":
          throw e.error;
        default:
          We(e);
      }
    }
  };
function am(e, t) {
  return e instanceof HTMLAnchorElement
    ? e
    : e instanceof Element
    ? e === t
      ? null
      : am(e.parentElement, t)
    : null;
}
var cS = "element",
  LV = "collection",
  MV = "collectionItemId",
  OV = "pathVariables",
  $w = "framer/page-link,";
function jw(e) {
  return Fe(e) && e.startsWith(`data:${$w}`);
}
function lm(e) {
  if (jw(e))
    try {
      let t = new URL(e),
        n = t.pathname.substring($w.length),
        r = t.searchParams,
        i = r.has(cS) ? r.get(cS) : void 0,
        o,
        s = r.get(LV),
        a = r.get(MV),
        l = r.get(OV);
      if (s && a && l) {
        let c = Object.fromEntries(new URLSearchParams(l).entries());
        o = { collection: s, collectionItemId: a, pathVariables: c };
      }
      return {
        target: n === "none" ? null : n,
        element: i === "none" ? void 0 : i,
        collectionItem: o,
      };
    } catch {
      return;
    }
}
function AV(e, t, n) {
  var r;
  let i = t.getAttribute("data-framer-page-link-target"),
    o,
    s;
  if (i) {
    o = t.getAttribute("data-framer-page-link-element") ?? void 0;
    let l = t.getAttribute("data-framer-page-link-path-variables");
    l && (s = Object.fromEntries(new URLSearchParams(l).entries()));
  } else {
    let l = t.getAttribute("href");
    if (!l) return !1;
    let c = lm(l);
    if (!c || !c.target) return !1;
    (i = c.target),
      (o = c.element ?? void 0),
      (s = (r = c.collectionItem) == null ? void 0 : r.pathVariables);
  }
  let a = o ? t.dataset.framerSmoothScroll !== void 0 : void 0;
  return e(i, o, Object.assign({}, n, s), a), !0;
}
var wp = {},
  Wc = new WeakMap();
function DV(e, t, n) {
  var r, i;
  let o =
    (i = (r = Wc?.get(n ?? wp)) == null ? void 0 : r.get(e.collectionId)) ==
    null
      ? void 0
      : i.get(e.collectionItemId);
  if (o) return o;
  let s = Wc.get(n ?? wp) ?? new Map();
  Wc.set(n ?? wp, s);
  let a = s.get(e.collectionId) ?? new Map();
  s.set(e.collectionId, a);
  let l = new Nw(async () => {
    try {
      let c = t[e.collectionId];
      if (!c)
        throw new Error(
          `Key not found in collection utils for collection id: "${e.collectionId}`
        );
      let u = await c();
      if (!u) throw new Error("Collection does not contain utility functions");
      return await u.getSlugByRecordId(e.collectionItemId, n ?? void 0);
    } catch (c) {
      console.warn(
        `Failed to resolve slug: ${
          c instanceof Error ? c.message : "Unknown error"
        }`
      );
      return;
    }
  });
  return a.set(e.collectionItemId, l), l;
}
var VV = "webPageId";
function BV(e) {
  return !!(e && typeof e == "object" && VV in e);
}
function HV(e) {
  if (!e) return;
  let t = {};
  for (let n in e.pathVariables) {
    let r = e.pathVariables[n];
    r && (t[n] = r);
  }
  return t;
}
function Ww(e) {
  if (!jw(e)) return e;
  let t = lm(e);
  if (!t) return;
  let { target: n, element: r, collectionItem: i } = t;
  if (n) return { webPageId: n, hash: r ?? void 0, pathVariables: HV(i) };
}
var Uw = /:([a-z]\w*)/gi,
  zV = b.createContext(void 0);
function Xw() {
  var e;
  let t = b.useContext(zV),
    n = (e = cu()) == null ? void 0 : e.pathVariables;
  return t || n;
}
function Yw(e, { webPageId: t, hash: n, pathVariables: r }, i) {
  if (t !== e.id || n) return !1;
  if (e.path && e.pathVariables) {
    let o = Object.assign({}, i, r);
    for (let [, s] of e.path.matchAll(Uw))
      if (!s || e.pathVariables[s] !== o[s]) return !1;
  }
  return !0;
}
function Gw(e) {
  return e === void 0
    ? !1
    : !!(e.startsWith("#") || e.startsWith("/") || e.startsWith("."));
}
function NV(e, t) {
  try {
    return !!new URL(e).protocol;
  } catch {}
  return t;
}
function cm(e, t) {
  return e !== void 0 ? (e ? "_blank" : void 0) : t ? void 0 : "_blank";
}
function uS(e, t = void 0) {
  let n = Gw(e),
    r = cm(t, n);
  return {
    href: NV(e, n) ? e : `https://${e}`,
    target: r,
    rel: n ? void 0 : "noopener",
  };
}
function Kw(e, t, n, r, i) {
  return async (o) => {
    var s, a;
    if (o.metaKey) return;
    let l = am(o.target);
    if (!l || l.getAttribute("target") === "_blank") return;
    o.preventDefault();
    let c = (s = e.getRoute) == null ? void 0 : s.call(e, t);
    c && LS(c?.page) && (await c.page.preload()),
      (a = e.navigate) == null || a.call(e, t, n, r, i);
  };
}
function $V(e, t, n, r, i, o) {
  let s = Gw(e);
  if (!n.routes || !n.getRoute || !r || !s) return uS(e, t);
  try {
    let [a, l] = e.split("#", 2);
    ae(a !== void 0, "A href must have a defined pathname.");
    let [c] = a.split("?", 2);
    ae(c !== void 0, "A href must have a defined pathname.");
    let { routeId: u, pathVariables: f } = M2(n.routes, c),
      d = n.getRoute(u);
    if (d) {
      jp(d.page);
      let h = Object.assign({}, i, f),
        g = Np(d, {
          currentRoutePath: r.path,
          currentPathVariables: r.pathVariables,
          hash: l || void 0,
          pathVariables: h,
          preserveQueryParams: n.preserveQueryParams,
        }),
        y = cm(t, !0);
      return { href: g, target: y, onClick: Kw(n, u, l || void 0, h, o) };
    }
  } catch {}
  return uS(e, t);
}
function jV(e, t, n, r) {
  let i = [];
  function o(a) {
    if (!a || !n) return;
    let l = {};
    for (let c in a) {
      let u = a[c];
      ae(u, "unresolvedSlug should be defined");
      let f = DV(u, n, r),
        d = f.preload();
      if (d) i.push(d);
      else {
        let h = f.read();
        h && (l[c] = h);
      }
    }
    return l;
  }
  let s = { path: o(e), hash: o(t) };
  if (i.length) throw Promise.allSettled(i);
  return s;
}
var C6 = b.forwardRef(
  ({ children: e, href: t, openInNewTab: n, smoothScroll: r, ...i }, o) => {
    let s = xa(),
      a = cu(),
      l = Xw(),
      { activeLocale: c } = R2(),
      u = om(o),
      f = b.useMemo(() => {
        var d;
        if (!t) return {};
        let h = BV(t) ? t : Ww(t);
        if (!h) return {};
        if (Fe(h)) return $V(h, n, s, a, l, r);
        let {
            webPageId: g,
            hash: y,
            pathVariables: S,
            hashVariables: p,
            unresolvedHashSlugs: m,
            unresolvedPathSlugs: v,
          } = h,
          x = (d = s.getRoute) == null ? void 0 : d.call(s, g),
          C = jV(v, m, s.collectionUtils, c);
        x && jp(x.page);
        let w = Object.assign({}, l, S, C?.path),
          k = Object.assign({}, l, p, C?.hash),
          E = cm(n, !0),
          P = Np(x, {
            currentRoutePath: a?.path,
            currentPathVariables: a?.pathVariables,
            hash: y,
            pathVariables: w,
            hashVariables: k,
            preserveQueryParams: s.preserveQueryParams,
          }),
          I = P.split("#", 2)[1];
        return {
          href: P,
          target: E,
          onClick: Kw(s, g, I, w, r),
          "data-framer-page-link-current": (a && Yw(a, h, l)) || void 0,
        };
      }, [t, s, c, l, n, a, r]);
    return u(e, { ...i, ...f });
  }
);
function E6({
  RootComponent: e,
  isWebsite: t,
  routeId: n,
  pathVariables: r,
  routes: i,
  collectionUtils: o,
  notFoundPage: s,
  isReducedMotion: a = !1,
  includeDataObserver: l = !1,
  localeId: c,
  locales: u,
  preserveQueryParams: f,
  enableSuspenseThatPreservesDom: d,
  shouldMarkHydrationEnd: h = !1,
}) {
  if (
    (b.useLayoutEffect(() => {
      h &&
        (performance.mark("framer-hydration-end"),
        performance.measure(
          "framer-hydration",
          "framer-hydration-start",
          "framer-hydration-end"
        ));
    }, []),
    b.useEffect(() => {
      t || WS.start();
    }, []),
    t)
  )
    return T(xy, {
      reducedMotion: a ? "user" : "never",
      children: T(uV, {
        children: T(F2, {
          initialRoute: n,
          initialPathVariables: r,
          initialLocaleId: c,
          routes: i,
          collectionUtils: o,
          notFoundPage: s,
          locales: u,
          defaultPageStyle: { minHeight: "100vh", width: "auto" },
          preserveQueryParams: f,
          enableSuspenseThatPreservesDom: d,
        }),
      }),
    });
  {
    let g = l ? wD : b.Fragment;
    return T(g, {
      children: T(b2, {
        routes: i,
        children: T(gD, {
          children: b.isValidElement(e) ? e : b.createElement(e, { key: n }),
        }),
      }),
    });
  }
}
function Cp(e, t, n) {
  let r = gn.map(e, (i) => (yn(i) ? rn(i, t) : i));
  return n ? r : T(Ne, { children: r });
}
var qw = b.createContext(void 0),
  fS = "ssr-variant";
function WV(e, t, n, r, i, o, s) {
  if ($r()) throw new Error("This should not be called on the client");
  let a = b.Children.toArray(t),
    l = a[0];
  if (a.length !== 1 || !b.isValidElement(l))
    return (
      console.warn(s + ": expected exactly one React element for a child", t),
      Cp(t, n)
    );
  let c = [],
    u = [];
  for (let [g] of Object.entries(r)) {
    if (g === i) continue;
    let y = e[g];
    if (!y || !XV(l.props, y)) {
      u.push(g);
      continue;
    }
    let S = dS([g], o);
    S.length && c.push({ variants: S, propOverrides: y });
  }
  if (c.length === 0) return Cp(l, n);
  let f = [i, ...u],
    d = dS(f, o);
  d.length && c.unshift({ variants: d });
  let h = `.${fS} { display: contents }`;
  return oe(Ne, {
    children: [
      !o && T("style", { ...Hw, children: h }),
      c.map(({ variants: g, propOverrides: y }) => {
        let S = g.join("+"),
          p = T(
            qw.Provider,
            { value: new Set(g), children: Cp(l, { ...n, ...y }) },
            S
          ),
          m = UV(g, o, r);
        return (
          m.length
            ? (ae(
                c.length > 1,
                "Must branch out when there are hiddenClassNames"
              ),
              (p = T(
                "div",
                { className: `${fS} ${m.join(" ")}`, children: p },
                S
              )))
            : ae(
                c.length === 1,
                "Cannot branch out when hiddenClassNames is empty"
              ),
          p
        );
      }),
    ],
  });
}
function UV(e, t, n) {
  let r = [];
  for (let [i, o] of Object.entries(n)) {
    let s = t && !t.has(i);
    if (e.includes(i) || s) continue;
    let a = o.split("-")[2];
    r.push(`hidden-${a}`);
  }
  return r;
}
function dS(e, t) {
  return t ? e.filter((n) => t.has(n)) : e;
}
function XV(e, t) {
  for (let n of Object.keys(t)) if (!ze(e[n], t[n], !0)) return !0;
  return !1;
}
function YV(e, t, n) {
  return !n || !e ? t : { ...t, ...n[e] };
}
var F6 = b.forwardRef(function (
  { breakpoint: t, overrides: n, children: r, ...i },
  o
) {
  let s = om(o);
  if ($r()) return s(r, YV(t, i, n));
  let a = b.useContext(_V);
  if (!a)
    return (
      console.warn("PropertyOverrides is missing GeneratedComponentContext"),
      s(r, i)
    );
  let { primaryVariantId: l, variantClassNames: c } = a,
    u = b.useContext(qw);
  return WV(n, r, i, c, l, u, "PropertyOverrides");
});
var GV = Yt(A_(), 1);
function KV(e) {
  return {
    trace(...t) {
      var n;
      return (n = Ke.getLogger(e)) == null ? void 0 : n.trace(...t);
    },
    debug(...t) {
      var n;
      return (n = Ke.getLogger(e)) == null ? void 0 : n.debug(...t);
    },
    info(...t) {
      var n;
      return (n = Ke.getLogger(e)) == null ? void 0 : n.info(...t);
    },
    warn(...t) {
      var n;
      return (n = Ke.getLogger(e)) == null ? void 0 : n.warn(...t);
    },
    error(...t) {
      var n;
      return (n = Ke.getLogger(e)) == null ? void 0 : n.error(...t);
    },
  };
}
function um(e) {
  return Ae(e) && Ae(e.collectionByLocaleId);
}
var nn = {
  equal(e, t, n) {
    return e?.type !== t?.type ? !1 : qs(e, t, n) === 0;
  },
  lessThan(e, t, n) {
    return e?.type !== t?.type ? !1 : qs(e, t, n) < 0;
  },
  lessThanOrEqual(e, t, n) {
    return e?.type !== t?.type ? !1 : qs(e, t, n) <= 0;
  },
  greaterThan(e, t, n) {
    return e?.type !== t?.type ? !1 : qs(e, t, n) > 0;
  },
  greaterThanOrEqual(e, t, n) {
    return e?.type !== t?.type ? !1 : qs(e, t, n) >= 0;
  },
  stringify(e) {
    if (e === null) return "null";
    switch (e.type) {
      case "boolean":
      case "number":
        return String(e.value);
      case "string":
        return `'${e.value}'`;
      case "enum":
        return `'${e.value}' /* Enum */`;
      case "color":
        return `'${e.value}' /* Color */`;
      case "date":
        return `'${e.value}' /* Date */`;
      case "richtext":
        return "RichText";
      case "responsiveimage":
        return "ResponsiveImage";
      case "file":
        return "File";
      case "link":
        return Fe(e.value) ? `'${e.value}' /* Link */` : "Link";
      default:
        We(e);
    }
  },
};
function qs(e, t, n) {
  if (Ie(e) || Ie(t)) return ae(e === t), 0;
  switch (e.type) {
    case "boolean":
      return (
        ae(e.type === t.type),
        e.value < t.value ? -1 : e.value > t.value ? 1 : 0
      );
    case "color":
      return (
        ae(e.type === t.type),
        e.value < t.value ? -1 : e.value > t.value ? 1 : 0
      );
    case "date": {
      ae(e.type === t.type);
      let r = new Date(e.value),
        i = new Date(t.value);
      return r < i ? -1 : r > i ? 1 : 0;
    }
    case "enum":
      return (
        ae(e.type === t.type),
        e.value < t.value ? -1 : e.value > t.value ? 1 : 0
      );
    case "file":
      return (
        ae(e.type === t.type),
        e.value < t.value ? -1 : e.value > t.value ? 1 : 0
      );
    case "responsiveimage": {
      ae(e.type === t.type);
      let r = JSON.stringify(e.value),
        i = JSON.stringify(t.value);
      return r < i ? -1 : r > i ? 1 : 0;
    }
    case "link": {
      ae(e.type === t.type);
      let r = JSON.stringify(e.value),
        i = JSON.stringify(t.value);
      return r < i ? -1 : r > i ? 1 : 0;
    }
    case "number":
      return (
        ae(e.type === t.type),
        e.value < t.value ? -1 : e.value > t.value ? 1 : 0
      );
    case "richtext": {
      ae(e.type === t.type);
      let r = e.value,
        i = t.value;
      return r < i ? -1 : r > i ? 1 : 0;
    }
    case "string": {
      ae(e.type === t.type);
      let r = e.value,
        i = t.value;
      return (
        n.type === 0 &&
          ((r = e.value.toLowerCase()), (i = t.value.toLowerCase())),
        r < i ? -1 : r > i ? 1 : 0
      );
    }
    default:
      We(e);
  }
}
var Dp = "index",
  bt = class {
    static from(e, t) {
      return Mn(e, t, void 0);
    }
  },
  nt = class extends bt {
    constructor(e, t) {
      super(),
        (this.schema = e),
        (this.name = t),
        R(this, "definition"),
        t === Dp
          ? (this.definition = { type: "number", isNullable: !1 })
          : (this.definition = e[t] ?? null);
    }
    stringify() {
      return this.name;
    }
    equals(e) {
      return (
        e instanceof nt &&
        ze(this.definition, e.definition) &&
        ze(e.name, this.name)
      );
    }
    evaluate(e) {
      let t = this.name;
      if (St(e) || t === Dp) throw new Error(`Can't evaluate identifier: ${t}`);
      return e.data[t] ?? null;
    }
    canEvaluate() {
      return !1;
    }
  },
  ke = class extends bt {
    constructor(e, t) {
      super(), (this.definition = e), (this.value = t);
    }
    stringify() {
      return nn.stringify(this.value);
    }
    static fromNull() {
      return new ke(null, null);
    }
    static fromBoolean(e) {
      return new ke(
        { type: "boolean", isNullable: Ie(e) },
        Ie(e) ? null : { type: "boolean", value: e }
      );
    }
    static fromDate(e) {
      return new ke(
        { type: "date", isNullable: Ie(e) },
        Ie(e) ? null : { type: "date", value: e.toISOString() }
      );
    }
    static fromEnum(e) {
      return new ke(
        { type: "enum", isNullable: Ie(e) },
        Ie(e) ? null : { type: "enum", value: e }
      );
    }
    static fromNumber(e) {
      return new ke(
        { type: "number", isNullable: Ie(e) },
        Ie(e) ? null : { type: "number", value: e }
      );
    }
    static fromString(e) {
      return new ke(
        { type: "string", isNullable: Ie(e) },
        Ie(e) ? null : { type: "string", value: e }
      );
    }
    equals(e) {
      return (
        e instanceof ke &&
        ze(this.definition, e.definition) &&
        ze(e.value, this.value)
      );
    }
    evaluate() {
      return this.value;
    }
    canEvaluate() {
      return !0;
    }
  },
  Ea = class extends bt {
    constructor(e) {
      super(),
        (this.argumentExpressions = e),
        R(this, "collation", { type: 0 });
    }
    getArgumentExpression(e) {
      let t = this.argumentExpressions[e];
      if (St(t)) throw new Error("Missing argument in function call");
      return t;
    }
    equals(e) {
      return (
        e instanceof Ea &&
        ze(this.constructor, e.constructor) &&
        ze(this.argumentExpressions, e.argumentExpressions)
      );
    }
    canEvaluate() {
      return this.argumentExpressions.every((e) => e.canEvaluate());
    }
  },
  mu = class extends Ea {
    constructor() {
      super(...arguments),
        R(this, "definition", mu.getDefinition()),
        R(this, "sourceExpression", this.getArgumentExpression(0)),
        R(this, "targetExpression", this.getArgumentExpression(1));
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return `CONTAINS(${this.sourceExpression.stringify()}, ${this.targetExpression.stringify()})`;
    }
    getValue(e, t) {
      if (Ie(e) || e.type !== "string" || Ie(t) || t.type !== "string")
        return !1;
      let n = e.value,
        r = t.value;
      return (
        this.collation.type === 0 &&
          ((n = n.toLowerCase()), (r = r.toLowerCase())),
        n.includes(r)
      );
    }
    evaluate(e) {
      let t = this.sourceExpression.evaluate(e),
        n = this.targetExpression.evaluate(e);
      return { type: "boolean", value: this.getValue(t, n) };
    }
  },
  vu = class extends Ea {
    constructor() {
      super(...arguments),
        R(this, "definition", vu.getDefinition()),
        R(this, "sourceExpression", this.getArgumentExpression(0)),
        R(this, "targetExpression", this.getArgumentExpression(1));
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return `STARTS_WITH(${this.sourceExpression.stringify()}, ${this.targetExpression.stringify()})`;
    }
    getValue(e, t) {
      if (Ie(e) || e.type !== "string" || Ie(t) || t.type !== "string")
        return !1;
      let n = e.value,
        r = t.value;
      return (
        this.collation.type === 0 &&
          ((n = n.toLowerCase()), (r = r.toLowerCase())),
        n.startsWith(r)
      );
    }
    evaluate(e) {
      let t = this.sourceExpression.evaluate(e),
        n = this.targetExpression.evaluate(e);
      return { type: "boolean", value: this.getValue(t, n) };
    }
  },
  gu = class extends Ea {
    constructor() {
      super(...arguments),
        R(this, "definition", gu.getDefinition()),
        R(this, "sourceExpression", this.getArgumentExpression(0)),
        R(this, "targetExpression", this.getArgumentExpression(1));
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return `ENDS_WITH(${this.sourceExpression.stringify()}, ${this.targetExpression.stringify()})`;
    }
    getValue(e, t) {
      if (Ie(e) || e.type !== "string" || Ie(t) || t.type !== "string")
        return !1;
      let n = e.value,
        r = t.value;
      return (
        this.collation.type === 0 &&
          ((n = n.toLowerCase()), (r = r.toLowerCase())),
        n.endsWith(r)
      );
    }
    evaluate(e) {
      let t = this.sourceExpression.evaluate(e),
        n = this.targetExpression.evaluate(e);
      return { type: "boolean", value: this.getValue(t, n) };
    }
  },
  iu = class extends bt {
    constructor(e, t, n) {
      super(),
        (this.valueExpression = e),
        (this.conditions = t),
        (this.elseExpression = n),
        R(this, "definition"),
        R(this, "collation", { type: 0 });
      let r = [];
      for (let { thenExpression: i } of t) r.push(i.definition);
      n && r.push(n.definition), (this.definition = iu.getDefinition(r));
    }
    static getDefinition(e) {
      let t = null,
        n = !1;
      for (let r of e) {
        if ((t ?? (t = r), t && r && t.type !== r.type))
          throw new Error("Incompatible types in CASE expression");
        n || (n = r?.isNullable ?? !0);
      }
      return t ? { type: t.type, isNullable: n } : null;
    }
    stringify() {
      let e = "CASE";
      this.valueExpression && (e += ` ${this.valueExpression.stringify()}`);
      for (let { whenExpression: t, thenExpression: n } of this.conditions)
        e += ` WHEN ${t.stringify()} THEN ${n.stringify()}`;
      return (
        this.elseExpression &&
          (e += ` ELSE ${this.elseExpression.stringify()}`),
        (e += " END"),
        e
      );
    }
    equals(e) {
      return (
        e instanceof iu &&
        ze(this.valueExpression, e.valueExpression) &&
        ze(this.conditions, e.conditions) &&
        ze(this.elseExpression, e.elseExpression)
      );
    }
    evaluate(e) {
      var t, n;
      let r =
        ((t = this.valueExpression) == null ? void 0 : t.evaluate(e)) ?? null;
      for (let { whenExpression: i, thenExpression: o } of this.conditions) {
        let s = i.evaluate(e);
        if (this.valueExpression ? nn.equal(s, r, this.collation) : Ti(s))
          return o.evaluate(e);
      }
      return (
        ((n = this.elseExpression) == null ? void 0 : n.evaluate(e)) ?? null
      );
    }
    canEvaluate() {
      let e = [];
      this.valueExpression && e.push(this.valueExpression);
      for (let t of this.conditions)
        e.push(t.whenExpression), e.push(t.thenExpression);
      return (
        this.elseExpression && e.push(this.elseExpression),
        e.every((t) => t.canEvaluate())
      );
    }
  },
  qV = class {
    constructor(e, t) {
      (this.whenExpression = e), (this.thenExpression = t);
    }
  },
  Qw = class extends bt {
    constructor(e) {
      super(), (this.valueExpression = e);
    }
    equals(e) {
      return (
        e instanceof Qw &&
        ze(this.constructor, e.constructor) &&
        ze(this.valueExpression, e.valueExpression)
      );
    }
    canEvaluate() {
      return this.valueExpression.canEvaluate();
    }
  },
  ha = class extends Qw {
    constructor() {
      super(...arguments), R(this, "definition", ha.getDefinition());
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return `NOT ${this.valueExpression.stringify()}`;
    }
    evaluate(e) {
      let t = this.valueExpression.evaluate(e);
      return { type: "boolean", value: !Ti(t) };
    }
  },
  pa = class extends bt {
    constructor(e) {
      super(),
        (this.operandExpressions = e),
        R(this, "definition", pa.getDefinition());
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return this.operandExpressions.map((e) => e.stringify()).join(" AND ");
    }
    equals(e) {
      return (
        e instanceof pa &&
        ze(this.constructor, e.constructor) &&
        ze(this.operandExpressions, e.operandExpressions)
      );
    }
    canEvaluate() {
      return this.operandExpressions.every((e) => e.canEvaluate());
    }
  },
  Si = class extends pa {
    constructor() {
      super(...arguments), R(this, "operator", "AND");
    }
    evaluate(e) {
      return {
        type: "boolean",
        value: this.operandExpressions.every((n) => {
          let r = n.evaluate(e);
          return Ti(r);
        }),
      };
    }
  },
  oa = class extends pa {
    constructor() {
      super(...arguments), R(this, "operator", "OR");
    }
    evaluate(e) {
      return {
        type: "boolean",
        value: this.operandExpressions.some((n) => {
          let r = n.evaluate(e);
          return Ti(r);
        }),
      };
    }
  },
  An = class extends bt {
    constructor(e, t) {
      super(),
        (this.leftExpression = e),
        (this.rightExpression = t),
        R(this, "definition", An.getDefinition()),
        R(this, "collation", { type: 0 });
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    stringify() {
      return `${this.leftExpression.stringify()} ${
        this.operator
      } ${this.rightExpression.stringify()}`;
    }
    equals(e) {
      return (
        e instanceof An &&
        ze(this.constructor, e.constructor) &&
        ze(this.leftExpression, e.leftExpression) &&
        ze(this.rightExpression, e.rightExpression)
      );
    }
    canEvaluate() {
      return (
        this.leftExpression.canEvaluate() && this.rightExpression.canEvaluate()
      );
    }
  },
  Po = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", "=");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return { type: "boolean", value: nn.equal(t, n, this.collation) };
    }
  },
  Io = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", "!=");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return { type: "boolean", value: !nn.equal(t, n, this.collation) };
    }
  },
  ma = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", "<");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return { type: "boolean", value: nn.lessThan(t, n, this.collation) };
    }
  },
  va = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", "<=");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return {
        type: "boolean",
        value: nn.lessThanOrEqual(t, n, this.collation),
      };
    }
  },
  ga = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", ">");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return { type: "boolean", value: nn.greaterThan(t, n, this.collation) };
    }
  },
  ya = class extends An {
    constructor() {
      super(...arguments), R(this, "operator", ">=");
    }
    evaluate(e) {
      let t = this.leftExpression.evaluate(e),
        n = this.rightExpression.evaluate(e);
      return {
        type: "boolean",
        value: nn.greaterThanOrEqual(t, n, this.collation),
      };
    }
  },
  Ra = class extends bt {
    constructor(e) {
      super(), (this.valueExpression = e);
    }
    stringify() {
      return `CAST(${this.valueExpression.stringify()} AS ${this.dataType})`;
    }
    equals(e) {
      return (
        e instanceof Ra &&
        ze(this.constructor, e.constructor) &&
        ze(this.valueExpression, e.valueExpression)
      );
    }
    canEvaluate() {
      return this.valueExpression.canEvaluate();
    }
  },
  yu = class extends Ra {
    constructor() {
      super(...arguments),
        R(this, "dataType", "BOOLEAN"),
        R(this, "definition", yu.getDefinition());
    }
    static getDefinition() {
      return { type: "boolean", isNullable: !1 };
    }
    evaluate(e) {
      let t = this.valueExpression.evaluate(e);
      return { type: "boolean", value: Ti(t) };
    }
  };
function Ti(e) {
  switch (e?.type) {
    case "boolean":
    case "number":
    case "string":
      return !!e.value;
  }
  return !1;
}
var fm = class extends Ra {
  constructor() {
    super(...arguments),
      R(this, "dataType", "DATE"),
      R(this, "definition", fm.getDefinition());
  }
  static getDefinition() {
    return { type: "date", isNullable: !0 };
  }
  evaluate(e) {
    let t = this.valueExpression.evaluate(e),
      n = Zw(t);
    return Ie(n) ? null : { type: "date", value: n.toISOString() };
  }
};
function Zw(e) {
  switch (e?.type) {
    case "date":
    case "number":
    case "string": {
      let t = new Date(e.value);
      return qS(t) ? t : null;
    }
  }
  return null;
}
var dm = class extends Ra {
  constructor() {
    super(...arguments),
      R(this, "dataType", "NUMBER"),
      R(this, "definition", dm.getDefinition());
  }
  static getDefinition() {
    return { type: "number", isNullable: !0 };
  }
  evaluate(e) {
    let t = this.valueExpression.evaluate(e),
      n = Jw(t);
    return Ie(n) ? null : { type: "number", value: n };
  }
};
function Jw(e) {
  switch (e?.type) {
    case "number":
    case "string": {
      let t = Number(e.value);
      return Number.isFinite(t) ? t : null;
    }
  }
  return null;
}
var hm = class extends Ra {
  constructor() {
    super(...arguments),
      R(this, "dataType", "STRING"),
      R(this, "definition", hm.getDefinition());
  }
  static getDefinition() {
    return { type: "string", isNullable: !0 };
  }
  evaluate(e) {
    let t = this.valueExpression.evaluate(e),
      n = eC(t);
    return Ie(n) ? null : { type: "string", value: n };
  }
};
function eC(e) {
  switch (e?.type) {
    case "string":
    case "number":
      return String(e.value);
  }
  return null;
}
function Mn(e, t, n) {
  let r = QV(e, t, n),
    i = r instanceof ke;
  if (r.canEvaluate() && !i) {
    let o = r.evaluate();
    return new ke(r.definition, o);
  }
  return r;
}
function QV(e, t, n) {
  switch (e.type) {
    case "Identifier":
      return ZV(e, t);
    case "LiteralValue":
      return JV(e, n);
    case "FunctionCall":
      return t3(e, t);
    case "Case":
      return n3(e, t, n);
    case "UnaryOperation":
      return r3(e, t);
    case "BinaryOperation":
      return i3(e, t);
    case "TypeCast":
      return h3(e, t);
    default:
      throw new Error(`Unsupported expression: ${JSON.stringify(e)}`);
  }
}
function ZV(e, t) {
  return new nt(t, e.name);
}
function JV(e, t) {
  var n;
  let r = e3(e.value);
  switch (t?.type) {
    case "boolean": {
      let i = Ti(r.value);
      return ke.fromBoolean(i);
    }
    case "date": {
      let i = Zw(r.value);
      return ke.fromDate(i);
    }
    case "enum":
      return ((n = r.value) == null ? void 0 : n.type) === "string"
        ? ke.fromEnum(r.value.value)
        : r;
    case "number": {
      let i = Jw(r.value);
      return ke.fromNumber(i);
    }
    case "string": {
      let i = eC(r.value);
      return ke.fromString(i);
    }
  }
  return r;
}
function e3(e) {
  return KS(e)
    ? ke.fromBoolean(e)
    : qS(e)
    ? ke.fromDate(e)
    : mn(e)
    ? ke.fromNumber(e)
    : Fe(e)
    ? ke.fromString(e)
    : ke.fromNull();
}
function t3(e, t) {
  let n = e.arguments.map((r) => Mn(r, t, void 0));
  switch (e.functionName) {
    case "CONTAINS":
      return new mu(n);
    case "STARTS_WITH":
      return new vu(n);
    case "ENDS_WITH":
      return new gu(n);
    default:
      throw new Error(`Unsupported function name: ${e.functionName}`);
  }
}
function n3(e, t, n) {
  let r = e.value && Mn(e.value, t, void 0),
    i = e.value && ba(e.value, t),
    o = e.conditions.map((a) => {
      let l = Mn(a.when, t, i),
        c = Mn(a.then, t, n);
      return new qV(l, c);
    }),
    s = e.else && Mn(e.else, t, n);
  return new iu(r, o, s);
}
function r3(e, t) {
  let n = Mn(e.value, t, void 0);
  switch (e.operator) {
    case "not":
      return Vp(n);
    default:
      throw new Error(`Unsupported unary operator: ${e.operator}`);
  }
}
function Vp(e) {
  var t;
  if (e instanceof ha) {
    let n = e.valueExpression;
    return ((t = n.definition) == null ? void 0 : t.type) === "boolean"
      ? n
      : new yu(n);
  }
  if (e instanceof Po) {
    let { leftExpression: n, rightExpression: r } = e;
    return new Io(n, r);
  }
  if (e instanceof Io) {
    let { leftExpression: n, rightExpression: r } = e;
    return new Po(n, r);
  }
  if (e instanceof ma) {
    let { leftExpression: n, rightExpression: r } = e;
    return new ya(n, r);
  }
  if (e instanceof va) {
    let { leftExpression: n, rightExpression: r } = e;
    return new ga(n, r);
  }
  if (e instanceof ga) {
    let { leftExpression: n, rightExpression: r } = e;
    return new va(n, r);
  }
  if (e instanceof ya) {
    let { leftExpression: n, rightExpression: r } = e;
    return new ma(n, r);
  }
  if (e instanceof Si) {
    let { operandExpressions: n } = e,
      r = n.map(Vp);
    return new oa(r);
  }
  if (e instanceof Si) {
    let { operandExpressions: n } = e,
      r = n.map(Vp);
    return new Si(r);
  }
  return new ha(e);
}
function i3(e, t) {
  let n =
      e.operator !== "and" && e.operator !== "or"
        ? ba(e.left, t) || ba(e.right, t)
        : void 0,
    r = Mn(e.left, t, n),
    i = Mn(e.right, t, n);
  switch (e.operator) {
    case "and":
      return o3(r, i);
    case "or":
      return s3(r, i);
    case "==":
      return a3(r, i);
    case "!=":
      return l3(r, i);
    case "<":
      return c3(r, i);
    case "<=":
      return u3(r, i);
    case ">":
      return f3(r, i);
    case ">=":
      return d3(r, i);
    default:
      throw new Error(`Unsupported binary operator: ${e.operator}`);
  }
}
function o3(e, t) {
  let n = [];
  return (
    e instanceof Si ? n.push(...e.operandExpressions) : n.push(e),
    t instanceof Si ? n.push(...t.operandExpressions) : n.push(t),
    new Si(n)
  );
}
function s3(e, t) {
  let n = [];
  return (
    e instanceof oa ? n.push(...e.operandExpressions) : n.push(e),
    t instanceof oa ? n.push(...t.operandExpressions) : n.push(t),
    new oa(n)
  );
}
function a3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new Po(t, e) : new Po(e, t);
}
function l3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new Io(t, e) : new Io(e, t);
}
function c3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new ga(t, e) : new ma(e, t);
}
function u3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new ya(t, e) : new va(e, t);
}
function f3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new ma(t, e) : new ga(e, t);
}
function d3(e, t) {
  let n = e instanceof nt;
  return t instanceof nt && !n ? new va(t, e) : new ya(e, t);
}
function h3(e, t) {
  let n = Mn(e.value, t, void 0);
  switch (e.dataType) {
    case "BOOLEAN":
      return p3(n);
    case "DATE":
      return m3(n);
    case "NUMBER":
      return v3(n);
    case "STRING":
      return g3(n);
    default:
      throw new Error(`Unsupported data type: ${e.dataType}`);
  }
}
function p3(e) {
  var t;
  return ((t = e.definition) == null ? void 0 : t.type) === "boolean"
    ? e
    : new yu(e);
}
function m3(e) {
  var t;
  return ((t = e.definition) == null ? void 0 : t.type) === "date"
    ? e
    : new fm(e);
}
function v3(e) {
  var t;
  return ((t = e.definition) == null ? void 0 : t.type) === "number"
    ? e
    : new dm(e);
}
function g3(e) {
  var t;
  return ((t = e.definition) == null ? void 0 : t.type) === "string"
    ? e
    : new hm(e);
}
function ba(e, t) {
  switch (e.type) {
    case "Identifier":
      return y3(e, t);
    case "LiteralValue":
      return;
    case "FunctionCall":
      return b3(e);
    case "Case":
      return x3(e, t);
    case "UnaryOperation":
      return S3(e);
    case "BinaryOperation":
      return w3(e);
    case "TypeCast":
      return C3(e);
    default:
      throw new Error(`Unsupported expression: ${JSON.stringify(e)}`);
  }
}
function y3(e, t) {
  return t[e.name];
}
function b3(e) {
  switch (e.functionName) {
    case "CONTAINS":
      return mu.getDefinition();
    case "STARTS_WITH":
      return vu.getDefinition();
    case "ENDS_WITH":
      return gu.getDefinition();
    default:
      throw new Error(`Unsupported function name: ${e.functionName}`);
  }
}
function x3(e, t) {
  let n = [];
  for (let r of e.conditions) {
    let i = ba(r.then, t);
    St(i) || n.push(i);
  }
  if (e.else) {
    let r = ba(e.else, t);
    St(r) || n.push(r);
  }
  return iu.getDefinition(n) ?? void 0;
}
function S3(e) {
  switch (e.operator) {
    case "not":
      return ha.getDefinition();
    default:
      throw new Error(`Unsupported unary operator: ${e.operator}`);
  }
}
function w3(e) {
  switch (e.operator) {
    case "and":
    case "or":
      return pa.getDefinition();
    case "==":
    case "!=":
    case "<":
    case "<=":
    case ">":
    case ">=":
      return An.getDefinition();
    default:
      throw new Error(`Unsupported binary operator: ${e.operator}`);
  }
}
function C3(e) {
  switch (e.dataType) {
    case "BOOLEAN":
      return yu.getDefinition();
    case "DATE":
      return fm.getDefinition();
    case "NUMBER":
      return dm.getDefinition();
    case "STRING":
      return hm.getDefinition();
    default:
      throw new Error(`Unsupported data type: ${e.dataType}`);
  }
}
function jr(e, t) {
  return `(self: ${e}ms${t ? `, total: ${t}ms` : ""})`;
}
function Dn(e) {
  return `(items: ${e})`;
}
var Wr = class {
    constructor() {
      R(this, "executionTime", 0), R(this, "itemCount", 0);
    }
    async execute() {
      let e = performance.now(),
        t = await this._execute();
      return (
        (this.executionTime = performance.now() - e),
        (this.itemCount = t.length),
        t
      );
    }
  },
  tC = class extends Wr {
    constructor(e) {
      super(), (this.collection = e);
    }
    inspect() {
      return {
        label: `ScanCollectionPlan ${jr(this.executionTime)} ${Dn(
          this.itemCount
        )}`,
      };
    }
    async _execute() {
      return this.collection.scanItems();
    }
  },
  tr = class extends Wr {
    constructor(e, t) {
      super(), (this.index = e), (this.query = t);
    }
    inspect() {
      let e = [],
        t = (n) => {
          switch (n.type) {
            case "All":
              return n.type;
            case "Equals":
            case "NotEquals":
            case "LessThan":
            case "GreaterThan":
            case "Contains":
            case "StartsWith":
            case "EndsWith":
              return `${n.type} ${nn.stringify(n.value)}`;
            default:
              We(n);
          }
        };
      for (let n = 0; n < this.index.fields.length; n++) {
        let r = this.index.fields[n],
          i = this.query[n];
        !r ||
          r.type !== "Identifier" ||
          !i ||
          i.type === "All" ||
          e.push(`${r.name} ${t(i)}`);
      }
      return {
        label: `LookupIndexPlan(${e.join(", ")}) ${jr(this.executionTime)} ${Dn(
          this.itemCount
        )}`,
      };
    }
    async _execute() {
      return this.index.lookupItems(this.query);
    }
  },
  k3 = class extends Wr {
    constructor(e) {
      super(), (this.childPlans = e);
    }
    inspect() {
      let e = Math.max(...this.childPlans.map((t) => t.executionTime ?? 0));
      return {
        label: `UnionPlan ${jr(
          this.executionTime - e,
          this.executionTime
        )} ${Dn(this.itemCount)}`,
        nodes: this.childPlans.map((t) => t.inspect()),
      };
    }
    async _execute() {
      let e = await Promise.all(
          this.childPlans.map(async (n) => {
            let r = await n.execute();
            return new ou(r);
          })
        ),
        t;
      for (let n of e) t ? (t = t.union(n)) : (t = n);
      return t?.items() ?? [];
    }
  },
  T3 = class extends Wr {
    constructor(e) {
      super(), (this.childPlans = e);
    }
    inspect() {
      let e = Math.max(...this.childPlans.map((t) => t.executionTime ?? 0));
      return {
        label: `IntersectionPlan ${jr(
          this.executionTime - e,
          this.executionTime
        )} ${Dn(this.itemCount)} ${Dn(this.itemCount)}`,
        nodes: this.childPlans.map((t) => t.inspect()),
      };
    }
    async _execute() {
      let e = await Promise.all(
          this.childPlans.map(async (n) => {
            let r = await n.execute();
            return new ou(r);
          })
        ),
        t;
      for (let n of e) t ? (t = t.intersection(n)) : (t = n);
      return t?.items() ?? [];
    }
  },
  E3 = class extends Wr {
    constructor(e, t, n, r) {
      super(),
        (this.childPlan = e),
        (this.collection = t),
        (this.richTextResolver = n),
        (this.select = r);
    }
    inspect() {
      return {
        label: `ResolveItemsPlan ${jr(
          this.executionTime - this.childPlan.executionTime,
          this.executionTime
        )} ${Dn(this.itemCount)}`,
        nodes: [this.childPlan.inspect()],
      };
    }
    async _execute() {
      let e = await this.childPlan.execute(),
        t = e.map((n) => n.pointer);
      for (let n of e)
        for (let r of this.select) {
          if (r.type !== "Identifier") continue;
          let i = n.data[r.name];
          i?.type === "richtext" && this.richTextResolver.resolve(i.value);
        }
      return this.collection.resolveItems(t);
    }
  },
  R3 = class extends Wr {
    constructor(e, t) {
      super(), (this.childPlan = e), (this.filterExpression = t);
    }
    inspect() {
      return {
        label: `FilterItemsPlan(${this.filterExpression.stringify()}) ${jr(
          this.executionTime - this.childPlan.executionTime,
          this.executionTime
        )} ${Dn(this.itemCount)} ${Dn(this.itemCount)}`,
        nodes: [this.childPlan.inspect()],
      };
    }
    async _execute() {
      return (await this.childPlan.execute()).filter((t) => {
        let n = this.filterExpression.evaluate(t);
        return Ti(n);
      });
    }
  },
  P3 = class extends Wr {
    constructor(e, t, n) {
      super(),
        (this.childPlan = e),
        (this.orderExpressions = t),
        (this.collection = n);
    }
    inspect() {
      return {
        label: `SortItemsPlan(${this.orderExpressions
          .map(
            (t) => `${t.expression.stringify()} ${t.direction.toUpperCase()}`
          )
          .join(", ")}) ${jr(
          this.executionTime - this.childPlan.executionTime,
          this.executionTime
        )} ${Dn(this.itemCount)}`,
        nodes: [this.childPlan.inspect()],
      };
    }
    async _execute() {
      return (await this.childPlan.execute()).sort((t, n) => {
        for (let { expression: r, direction: i, collation: o } of this
          .orderExpressions) {
          let s = i === "asc";
          if (r instanceof nt && r.name === Dp) {
            let c = this.collection.compareItems(t, n);
            return s ? c : -c;
          }
          let a = r.evaluate(t),
            l = r.evaluate(n);
          if (!nn.equal(a, l, o)) {
            if (nn.lessThan(a, l, o) || la(a)) return s ? -1 : 1;
            if (nn.greaterThan(a, l, o) || la(l)) return s ? 1 : -1;
            throw new Error("Invalid comparison result.");
          }
        }
        return this.collection.compareItems(t, n);
      });
    }
  },
  I3 = class {
    constructor(e, t, n) {
      (this.expression = e), (this.direction = t), (this.collation = n);
    }
  },
  F3 = class extends Wr {
    constructor(e, t, n) {
      super(),
        (this.childPlan = e),
        (this.offsetExpression = t),
        (this.limitExpression = n);
    }
    inspect() {
      var e, t;
      return {
        label: `SliceItemsPlan(LIMIT ${
          ((e = this.limitExpression) == null ? void 0 : e.stringify()) ??
          "Infinity"
        }, OFFSET ${
          ((t = this.offsetExpression) == null ? void 0 : t.stringify()) ?? "0"
        }) ${jr(
          this.executionTime - this.childPlan.executionTime,
          this.executionTime
        )} ${Dn(this.itemCount)}`,
        nodes: [this.childPlan.inspect()],
      };
    }
    getOffset() {
      var e;
      let t = (e = this.offsetExpression) == null ? void 0 : e.evaluate();
      if (!(la(t) || t.type !== "number")) return t.value;
    }
    getLimit() {
      var e;
      let t = (e = this.limitExpression) == null ? void 0 : e.evaluate();
      if (!(la(t) || t.type !== "number")) return t.value;
    }
    async _execute() {
      let e = await this.childPlan.execute(),
        t = this.getOffset() ?? 0,
        n = this.getLimit() ?? 1 / 0;
      return e.slice(t, t + n);
    }
  },
  ou = class extends Map {
    constructor(e = []) {
      super();
      for (let t of e) this.set(t.pointer, t);
    }
    union(e) {
      let t = new ou();
      for (let [n, r] of this) t.set(n, r);
      for (let [n, r] of e) t.set(n, r);
      return t;
    }
    intersection(e) {
      let t = new ou();
      for (let [n, r] of this) e.has(n) && t.set(n, r);
      return t;
    }
    items() {
      return [...this.values()];
    }
  },
  _3 = class {
    constructor(e) {
      (this.collection = e), R(this, "cache", new Map());
    }
    resolve(e) {
      let t = this.cache.get(e);
      if (t) return t;
      let n = this.collection.resolveRichText(e);
      return this.cache.set(e, n), n;
    }
  };
function L3(e, t) {
  var n;
  if (um(e)) {
    let r = AM(e),
      i = (n = r?.[t.name]) == null ? void 0 : n.title;
    if (i) return `"${t.name}" /* ${i} */`;
  }
  return `"${t.name}"`;
}
function M3(e) {
  return typeof e.value == "string" ? `'${e.value}'` : e.value;
}
function O3(e, t) {
  return `${t.functionName}(${t.arguments.map((n) => jt(e, n)).join(", ")})`;
}
function A3(e, t) {
  let n = "CASE";
  t.value && (n += ` ${jt(e, t.value)}`);
  for (let r of t.conditions)
    n += ` WHEN ${jt(e, r.when)} THEN ${jt(e, r.then)}`;
  return t.else && (n += ` ELSE ${t.else}`), (n += " END"), n;
}
function D3(e, t) {
  let n = jt(e, t.value);
  return `${t.operator.toUpperCase()} ${n}`;
}
function V3(e, t) {
  let n = jt(e, t.left),
    r = jt(e, t.right),
    i = t.operator.toUpperCase();
  return `${n} ${i} ${r}`;
}
function B3(e, t) {
  return `CAST(${jt(e, t.value)} as ${t.dataType})`;
}
function jt(e, t) {
  switch (t.type) {
    case "Identifier":
      return L3(e, t);
    case "LiteralValue":
      return M3(t);
    case "FunctionCall":
      return O3(e, t);
    case "Case":
      return A3(e, t);
    case "UnaryOperation":
      return D3(e, t);
    case "BinaryOperation":
      return V3(e, t);
    case "TypeCast":
      return B3(e, t);
    default:
      We(t);
  }
}
function H3(e) {
  let t = "";
  return (
    e.split(/\s+/u).forEach((r) => {
      r !== "" &&
        (["SELECT", "FROM", "WHERE", "ORDER", "LIMIT", "OFFSET"].includes(r)
          ? (t += `
${r}`)
          : ["AND", "OR"].includes(r)
          ? (t += `
	${r}`)
          : (t += ` ${r}`));
    }),
    t.trim()
  );
}
function z3(e) {
  let t = "";
  return (
    (t += `SELECT ${e.select
      .map((n) => {
        let r = jt(e.from.data, n);
        return n.alias ? `${r} AS ${n.alias}` : r;
      })
      .join(", ")}`),
    um(e.from.data)
      ? (t += ` FROM ${e.from.data.displayName}`)
      : (t += ` FROM ${e.from.data.displayName}`),
    e.where && (t += ` WHERE ${jt(e.from.data, e.where)}`),
    e.orderBy &&
      (t += ` ORDER BY ${e.orderBy
        .map((n) => `${jt(e.from.data, n)} ${n.direction ?? "asc"}`)
        .join(", ")}`),
    e.limit && (t += ` LIMIT ${jt(e.from.data, e.limit)}`),
    e.offset && (t += ` OFFSET ${jt(e.from.data, e.offset)}`),
    H3(t)
  );
}
var N3 = KV("query-engine");
function $3({ data: e }, t) {
  if (um(e)) {
    for (; t; ) {
      let n = e.collectionByLocaleId[t.id];
      if (n) return n;
      t = t.fallback;
    }
    return e.collectionByLocaleId.default;
  }
  throw new Error("Unsupported collection type");
}
var _6 = class {
  async query(e, t) {
    let n = $3(e.from, t),
      r = new _3(n),
      i = this.createQueryPlan(n, r, e),
      o = await this.executeQueryPlan(n, r, e, i);
    return (
      N3.debug(`Query:
${z3(e)}

${(0, GV.default)(i.inspect())}`),
      o
    );
  }
  createQueryPlan(e, t, n) {
    var r;
    let i = new tC(e);
    if (n.where) {
      let l = bt.from(n.where, e.schema);
      i = Bp(e, l);
    }
    let o =
      (r = n.orderBy) == null
        ? void 0
        : r.map(
            (l) =>
              new I3(bt.from(l, e.schema), l.direction ?? "asc", { type: 0 })
          );
    i = new P3(i, o ?? [], e);
    let s;
    n.offset && (s = bt.from(n.offset, e.schema));
    let a;
    return (
      n.limit && (a = bt.from(n.limit, e.schema)),
      (s || a) && (i = new F3(i, s, a)),
      n.select.length > 0 && (i = new E3(i, e, t, n.select)),
      i
    );
  }
  async executeQueryPlan(e, t, n, r) {
    let i = await r.execute();
    return Promise.all(
      i.map(async (o) => {
        let s = {};
        for (let a of n.select) {
          let l = bt.from(a, e.schema),
            c = j3(a),
            u = l.evaluate(o);
          s[c] = await W3(t, u);
        }
        return s;
      })
    );
  }
};
function j3(e) {
  if (e.alias) return e.alias;
  if (e.type === "Identifier") return e.name;
  throw new Error("Can't serialize expression");
}
async function W3(e, t) {
  return la(t) ? null : t.type === "richtext" ? e.resolve(t.value) : t.value;
}
function Bp(e, t) {
  if (t instanceof Si) {
    let n = t.operandExpressions.map((r) => Bp(e, r));
    return new T3(n);
  }
  if (t instanceof oa) {
    let n = t.operandExpressions.map((r) => Bp(e, r));
    return new k3(n);
  }
  return U3(e, t) ?? Y3(e, t);
}
function U3(e, t) {
  var n, r;
  if (t instanceof An) return kp(e, t);
  if (t instanceof Ea) return X3(e, t);
  if (
    t instanceof nt &&
    ((n = t.definition) == null ? void 0 : n.type) === "boolean"
  ) {
    let i = ke.fromBoolean(!0),
      o = new Po(t, i);
    return kp(e, o);
  }
  if (
    t instanceof ha &&
    t.valueExpression instanceof nt &&
    ((r = t.valueExpression.definition) == null ? void 0 : r.type) === "boolean"
  ) {
    let i = ke.fromBoolean(!0),
      o = new Io(t.valueExpression, i);
    return kp(e, o);
  }
}
function kp(e, t) {
  let n = t.leftExpression,
    r = t.rightExpression;
  if (r instanceof ke)
    for (let i of e.indexes) {
      let o = i.fields[0];
      if (St(o)) continue;
      let s = bt.from(o, e.schema);
      if (!n.equals(s)) continue;
      let a = new Array(i.fields.length - 1).fill({ type: "All" });
      if (t instanceof Po && i.supportedLookupTypes.includes("Equals"))
        return new tr(i, [{ type: "Equals", value: r.evaluate() }, ...a]);
      if (t instanceof Io && i.supportedLookupTypes.includes("NotEquals"))
        return new tr(i, [{ type: "NotEquals", value: r.evaluate() }, ...a]);
      if (t instanceof ma && i.supportedLookupTypes.includes("LessThan"))
        return new tr(i, [
          { type: "LessThan", value: r.evaluate(), inclusive: !1 },
          ...a,
        ]);
      if (t instanceof va && i.supportedLookupTypes.includes("LessThan"))
        return new tr(i, [
          { type: "LessThan", value: r.evaluate(), inclusive: !0 },
          ...a,
        ]);
      if (t instanceof ga && i.supportedLookupTypes.includes("GreaterThan"))
        return new tr(i, [
          { type: "GreaterThan", value: r.evaluate(), inclusive: !1 },
          ...a,
        ]);
      if (t instanceof ya && i.supportedLookupTypes.includes("GreaterThan"))
        return new tr(i, [
          { type: "GreaterThan", value: r.evaluate(), inclusive: !0 },
          ...a,
        ]);
    }
}
function X3(e, t) {
  if (t.argumentExpressions.length !== 2) return;
  let n = t.argumentExpressions[0],
    r = t.argumentExpressions[1];
  if (!St(n) && !St(r) && r instanceof ke)
    for (let i of e.indexes) {
      let o = i.fields[0];
      if (St(o)) continue;
      let s = bt.from(o, e.schema);
      if (!n.equals(s)) continue;
      let a = new Array(i.fields.length - 1).fill({ type: "All" });
      if (t instanceof mu && i.supportedLookupTypes.includes("Contains"))
        return new tr(i, [{ type: "Contains", value: r.evaluate() }, ...a]);
      if (t instanceof vu && i.supportedLookupTypes.includes("StartsWith"))
        return new tr(i, [{ type: "StartsWith", value: r.evaluate() }, ...a]);
      if (t instanceof gu && i.supportedLookupTypes.includes("EndsWith"))
        return new tr(i, [{ type: "EndsWith", value: r.evaluate() }, ...a]);
    }
}
function Y3(e, t) {
  let n = new tC(e);
  return new R3(n, t);
}
var G3 = class {
    constructor() {
      R(this, "entries", new Map());
    }
    set(e, t, n, r) {
      let i = this.entries.get(e);
      switch (t) {
        case "transformTemplate": {
          ae(
            typeof n == "string",
            `transformTemplate must be a string, received: ${n}`
          ),
            i
              ? (i.transformTemplate = n)
              : this.entries.set(e, { transformTemplate: n });
          break;
        }
        case "initial":
        case "animate": {
          ae(
            typeof n == "object",
            `${t} must be a valid object, received: ${n}`
          ),
            i
              ? ((i[t] = n), i.variantHash || (i.variantHash = r))
              : this.entries.set(e, { [t]: n, variantHash: r });
          break;
        }
        default:
          break;
      }
    }
    clear() {
      this.entries.clear();
    }
    toObject() {
      return Object.fromEntries(this.entries);
    }
  },
  L6 = new G3();
var M6 = "__Appear_Animation_Transform__";
var O6 = "data-framer-appear-id",
  A6 = "data-framer-appear-animation";
function Tp(e, t) {
  e.forEach((n) => clearTimeout(n)),
    e.clear(),
    t.forEach((n) => n && n("Callback cancelled by variant change")),
    t.clear();
}
function hS() {
  return new Set();
}
function V6(e) {
  let t = _t(hS),
    n = _t(hS);
  return (
    zA(() => () => Tp(n, t)),
    b.useEffect(() => () => Tp(n, t), [t, n]),
    b.useEffect(() => {
      Tp(n, t);
    }, [e, t, n]),
    b.useRef({
      activeVariantCallback:
        (r) =>
        (...i) =>
          new Promise((o, s) => {
            t.add(s), r(...i).then(o);
          }).catch(() => {}),
      delay: async (r, i) => {
        await new Promise((o) => n.add(globalThis.setTimeout(() => o(!0), i))),
          r();
      },
    }).current
  );
}
function K3(e, t, n) {
  return b.useCallback(
    (r) => {
      var i, o, s;
      return n
        ? e
          ? t
            ? Object.assign(
                {},
                (i = n[e]) == null ? void 0 : i[r],
                (o = n[t]) == null ? void 0 : o[r]
              )
            : ((s = n[e]) == null ? void 0 : s[r]) || {}
          : {}
        : {};
    },
    [e, t, n]
  );
}
function q3(e) {
  for (let [t, n] of Object.entries(e)) if (De.matchMedia(n).matches) return t;
}
function z6(e, t, n = !0) {
  let r = M(Fw),
    i = D($r() ? q3(t) ?? e : e),
    o = D(n && r ? e : i.current),
    s = du(),
    a = Dy(),
    l = ce(
      (c) => {
        (c !== i.current || c !== o.current) &&
          a(() => {
            (i.current = o.current = c),
              Fi(() => {
                s();
              });
          });
      },
      [a, s]
    );
  return (
    iw(() => {
      !n || r !== !0 || l(i.current);
    }, []),
    W(() => {
      let c = [];
      for (let [u, f] of Object.entries(t)) {
        let d = De.matchMedia(f),
          h = (g) => {
            g.matches && l(u);
          };
        Q3(d, h), c.push([d, h]);
      }
      return () => c.forEach(([u, f]) => Z3(u, f));
    }, [t, l]),
    [i.current, o.current]
  );
}
function Q3(e, t) {
  e.addEventListener ? e.addEventListener("change", t) : e.addListener(t);
}
function Z3(e, t) {
  e.removeEventListener
    ? e.removeEventListener("change", t)
    : e.removeListener(t);
}
function nC() {
  return _e.current() === "CANVAS";
}
function Y6({ blockDocumentScrolling: e = !0 } = {}) {
  let [t, n] = b.useState(!1),
    r = b.useCallback(
      (i) => {
        n(i),
          e !== !1 &&
            (i
              ? document.documentElement.style.setProperty("overflow", "hidden")
              : document.documentElement.style.removeProperty("overflow"));
      },
      [e]
    );
  return (
    b.useEffect(
      () => () => {
        e !== !1 && document.documentElement.style.removeProperty("overflow");
      },
      [e]
    ),
    [t, r]
  );
}
function J3(e, t) {
  return `${e}-${t}`;
}
function e4(e, t) {
  let r = e.indexOf(t) + 1;
  r >= e.length && (r = 0);
  let i = e[r];
  return ae(i !== void 0, "nextVariant should be defined"), i;
}
function t4(e, t) {
  if (e) {
    if (t) {
      let n = e[t];
      if (n) return n;
    }
    return e.default;
  }
}
function pS(e, t, n) {
  let { hover: r, pressed: i } = e || {};
  if (i && n) return "pressed";
  if (r && t) return "hover";
}
function n4(e, t) {
  let n = t[e];
  return n || `framer-v-${e}`;
}
function mS(e, t, n) {
  return e && n.has(e) ? e : t;
}
var r4 = Symbol("cycle");
function Q6({
  variant: e,
  defaultVariant: t,
  transitions: n,
  enabledGestures: r,
  cycleOrder: i = [],
  variantProps: o = {},
  variantClassNames: s = {},
}) {
  let a = du(),
    l = _t(() => new Set(i)),
    c = b.useRef({
      isHovered: !1,
      isPressed: !1,
      baseVariant: mS(e, t, l),
      lastVariant: e,
      gestureVariant: void 0,
      defaultVariant: t,
      enabledGestures: r,
      cycleOrder: i,
      transitions: n,
    }),
    u = b.useCallback(
      (x) => {
        let {
            isHovered: C,
            isPressed: w,
            enabledGestures: k,
            defaultVariant: E,
          } = c.current,
          P = mS(x, E, l),
          I = pS(k?.[P], C, w),
          H = I ? J3(P, I) : void 0;
        return [P, H];
      },
      [l]
    ),
    f = b.useCallback(
      ({ isHovered: x, isPressed: C }) => {
        x !== void 0 && (c.current.isHovered = x),
          C !== void 0 && (c.current.isPressed = C);
        let {
            baseVariant: w,
            gestureVariant: k,
            defaultVariant: E,
          } = c.current,
          [P, I] = u(w);
        (P !== w || I !== k) &&
          ((c.current.baseVariant = P || E),
          (c.current.gestureVariant = I),
          a());
      },
      [u, a]
    ),
    d = b.useCallback(
      (x) => {
        let {
            defaultVariant: C,
            cycleOrder: w,
            baseVariant: k,
            gestureVariant: E,
          } = c.current,
          P = x === r4 ? e4(w || [], k || C) : x,
          [I, H] = u(P);
        (I !== k || H !== E) &&
          ((c.current.baseVariant = I || C),
          (c.current.gestureVariant = H),
          a());
      },
      [u, a]
    );
  if (e !== c.current.lastVariant) {
    let [x, C] = u(e);
    (c.current.lastVariant = x),
      (x !== c.current.baseVariant || C !== c.current.gestureVariant) &&
        ((c.current.baseVariant = x), (c.current.gestureVariant = C));
  }
  let {
      baseVariant: h,
      gestureVariant: g,
      defaultVariant: y,
      enabledGestures: S,
      isHovered: p,
      isPressed: m,
    } = c.current,
    v = K3(c.current.baseVariant, c.current.gestureVariant, o);
  return b.useMemo(() => {
    let x = [];
    return (
      h !== y && x.push(h),
      g && x.push(g),
      {
        variants: x,
        baseVariant: h,
        gestureVariant: g,
        transition: t4(c.current.transitions, h),
        setVariant: d,
        setGestureState: f,
        addVariantProps: v,
        classNames: im(n4(h, s), pS(S?.[h], p, m)),
      }
    );
  }, [h, g, p, m, v, d, y, S, f, s]);
}
var Br = (() => {
  function e(t, n) {
    return { a: t, b: n };
  }
  return (
    (e.intersection = (t, n) => {
      let r = t.a.x,
        i = t.a.y,
        o = t.b.x,
        s = t.b.y,
        a = n.a.x,
        l = n.a.y,
        c = n.b.x,
        u = n.b.y,
        f = (r - o) * (l - u) - (i - s) * (a - c);
      if (f === 0) return null;
      let d = ((a - c) * (r * s - i * o) - (r - o) * (a * u - l * c)) / f,
        h = ((l - u) * (r * s - i * o) - (i - s) * (a * u - l * c)) / f;
      return { x: d, y: h };
    }),
    (e.intersectionAngle = (t, n) => {
      let r = t.b.x - t.a.x,
        i = t.b.y - t.a.y,
        o = n.b.x - n.a.x,
        s = n.b.y - n.a.y;
      return Math.atan2(r * s - i * o, r * o + i * s) * (180 / Math.PI);
    }),
    (e.isOrthogonal = (t) => t.a.x === t.b.x || t.a.y === t.b.y),
    (e.perpendicular = (t, n) => {
      let r = t.a.x - t.b.x,
        i = t.a.y - t.b.y,
        o = tt(n.x - i, n.y + r);
      return e(o, n);
    }),
    (e.projectPoint = (t, n) => {
      let r = e.perpendicular(t, n);
      return e.intersection(t, r);
    }),
    (e.pointAtPercentDistance = (t, n) => {
      let r = e.distance(t),
        i = (n * r) / r;
      return { x: i * t.b.x + (1 - i) * t.a.x, y: i * t.b.y + (1 - i) * t.a.y };
    }),
    (e.distance = (t) => tt.distance(t.a, t.b)),
    e
  );
})();
function i4(e) {
  var t, n;
  let r = (e * Math.PI) / 180,
    i = { x: -Math.sin(r) * 100, y: Math.cos(r) * 100 },
    o = tt(i.x, i.y),
    s = Br(tt(0.5, 0.5), o),
    a = ir.points({ x: 0, y: 0, width: 1, height: 1 }),
    l = a
      .map((y) => ({ point: y, distance: tt.distance(o, y) }))
      .sort((y, S) => y.distance - S.distance),
    c = (t = l[0]) == null ? void 0 : t.point,
    u = (n = l[1]) == null ? void 0 : n.point;
  ae(c && u, "linearGradientLine: Must have 2 closest points.");
  let [f, d] = a.filter((y) => !tt.isEqual(y, c) && !tt.isEqual(y, u));
  ae(f && d, "linearGradientLine: Must have 2 opposing points.");
  let h = Br.intersection(s, Br(c, u)),
    g = Br.intersection(s, Br(f, d));
  return (
    ae(h && g, "linearGradientLine: Must have a start and end point."), Br(h, g)
  );
}
function o4(e, t) {
  var n, r;
  let i = i4(e.angle),
    o = Ta(e),
    s = ((n = o[0]) == null ? void 0 : n.position) ?? 0,
    a = ((r = o[o.length - 1]) == null ? void 0 : r.position) ?? 1,
    l = Br.pointAtPercentDistance(i, s),
    c = Br.pointAtPercentDistance(i, a),
    u = zi([s, a], [0, 1]);
  return {
    id: `id${t}g${fa.hash(e)}`,
    x1: l.x,
    y1: l.y,
    x2: c.x,
    y2: c.y,
    stops: o.map((f) => ({
      color: f.value,
      alpha: em.getAlpha(f.value) * e.alpha,
      position: u(f.position),
    })),
  };
}
function s4(e, t) {
  return {
    id: `id${t}g${da.hash(e)}`,
    widthFactor: e.widthFactor,
    heightFactor: e.heightFactor,
    centerAnchorX: e.centerAnchorX,
    centerAnchorY: e.centerAnchorY,
    stops: Ta(e).map((n) => ({
      color: n.value,
      alpha: em.getAlpha(n.value) * e.alpha,
      position: n.position,
    })),
  };
}
function rC(e) {
  if (!Fe(e) || e.charAt(e.length - 1) !== "%") return !1;
  let n = e.slice(0, -1),
    r = parseFloat(n);
  return mn(r);
}
function iC(e) {
  let t = e.slice(0, -1),
    n = parseFloat(t);
  return mn(n) ? n : 50;
}
function vS(e) {
  return rC(e) ? iC(e) / 100 : e === "left" ? 0 : e === "right" ? 1 : 0.5;
}
function gS(e) {
  return rC(e) ? iC(e) / 100 : e === "top" ? 0 : e === "bottom" ? 1 : 0.5;
}
function a4(e, t, n, r) {
  if (
    ((e = He.get(e, "#09F")),
    !nr.isImageObject(e) || !e.pixelWidth || !e.pixelHeight)
  )
    return;
  let i = e.pixelWidth,
    o = e.pixelHeight,
    s,
    { fit: a } = e,
    l = 1,
    c = 1,
    u = 0,
    f = 0;
  if (a === "fill" || a === "fit" || a === "tile" || !a) {
    let h = 1,
      g = 1,
      y = i / o,
      S = t.height * y,
      p = t.width / y,
      m = S / t.width,
      v = p / t.height;
    if (a === "tile") {
      e.backgroundSize ?? (e.backgroundSize = 1),
        (l = Math.round(e.backgroundSize * (i / 2))),
        (c = Math.round(e.backgroundSize * (o / 2)));
      let x = t.x ?? 0,
        C = t.y ?? 0,
        w = 0,
        k = 0;
      r && ((w = x), (k = C)),
        (u = (t.width - l) * vS(e.positionX) + w),
        (f = (t.height - c) * gS(e.positionY) + k),
        (s = `translate(${u + x}, ${f + C})`);
    } else
      (a === "fill" || !a ? v > m : v < m)
        ? ((g = v), (f = (1 - v) * gS(e.positionY)))
        : ((h = m), (u = (1 - m) * vS(e.positionX))),
        (s = `translate(${u}, ${f}) scale(${h}, ${g})`);
  }
  return {
    id: `id${n}g-fillImage`,
    path: e.src ?? "",
    transform: s,
    width: l,
    height: c,
    offsetX: u,
    offsetY: f,
  };
}
var l4 = b.createContext(void 0),
  c4 = () => b.useContext(l4),
  u4 = "framer/asset-reference,";
function f4(e) {
  return e.startsWith(`data:${u4}`);
}
function d4(e, t) {
  if (/^\w+:/.test(e) && !f4(e)) return e;
  typeof t != "number"
    ? (t = void 0)
    : t <= 512
    ? (t = 512)
    : t <= 1024
    ? (t = 1024)
    : t <= 2048
    ? (t = 2048)
    : (t = 4096);
  let n = _e.current() === "EXPORT";
  return Ke.assetResolver(e, { pixelSize: t, isExport: n }) ?? "";
}
var h4 = ({
    id: e,
    path: t,
    transform: n,
    repeat: r,
    width: i,
    height: o,
    offsetX: s,
    offsetY: a,
  }) => {
    let l = d4(t);
    return T("pattern", {
      id: e,
      width: r ? i : "100%",
      height: r ? o : "100%",
      patternContentUnits: r ? void 0 : "objectBoundingBox",
      patternUnits: r ? "userSpaceOnUse" : void 0,
      x: r ? s : void 0,
      y: r ? a : void 0,
      children: T(
        "image",
        {
          width: r ? i : 1,
          height: r ? o : 1,
          href: l,
          preserveAspectRatio: "none",
          transform: r ? void 0 : n,
          x: r ? 0 : void 0,
          y: r ? 0 : void 0,
        },
        l
      ),
    });
  },
  yS = $r(),
  p4 = class {
    constructor(e, t, n, r, i = 0) {
      (this.id = e),
        (this.svg = t),
        (this.innerHTML = n),
        (this.viewBox = r),
        (this.count = i);
    }
  },
  m4 = class {
    constructor() {
      R(this, "entries", new Map());
    }
    debugGetEntries() {
      return this.entries;
    }
    subscribe(e, t, n) {
      if (!e || e === "") return "";
      let r = this.entries.get(e);
      if (!r) {
        n || (n = "svg" + String(vw(e)) + "_" + String(e.length));
        let i = e,
          o,
          s = v4(e);
        s && (t && g4(s, n), (s.id = n), (o = S4(s)), (i = s.outerHTML)),
          (r = this.createDOMElementFor(i, n, o)),
          this.entries.set(e, r);
      }
      return (r.count += 1), r.innerHTML;
    }
    getViewBox(e) {
      if (!e || e === "") return;
      let t = this.entries.get(e);
      return t?.viewBox;
    }
    unsubscribe(e) {
      if (!e || e === "") return;
      let t = this.entries.get(e);
      t &&
        ((t.count -= 1),
        !(t.count > 0) && setTimeout(() => this.maybeRemoveEntry(e), 5e3));
    }
    maybeRemoveEntry(e) {
      let t = this.entries.get(e);
      t && (t.count > 0 || (this.entries.delete(e), this.removeDOMElement(t)));
    }
    removeDOMElement(e) {
      let t = "container_" + e.id;
      if (yS) {
        let n = document?.querySelector("#" + t);
        n?.remove();
      }
    }
    createDOMElementFor(e, t, n) {
      let r = "container_" + t;
      if (yS) {
        let a = document.querySelector("#svg-templates");
        if (
          (a ||
            ((a = document.createElement("div")),
            (a.id = "svg-templates"),
            (a.style.position = "absolute"),
            (a.style.top = "0"),
            (a.style.left = "0"),
            (a.style.width = "0"),
            (a.style.height = "0"),
            (a.style.overflow = "hidden"),
            document.body.appendChild(a)),
          !document.querySelector("#" + r))
        ) {
          let l = document.createElement("div");
          (l.id = r),
            (l.innerHTML = e),
            l.firstElementChild && (l.firstElementChild.id = t),
            a.appendChild(l);
        }
      }
      let i = n ? `0 0 ${n.width} ${n.height}` : void 0,
        s = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 100%; height: 100%"${
          i ? ` viewBox="${i}"` : ""
        }><use href="#${t}"></use></svg>`;
      return new p4(t, e, s, i);
    }
    clear() {
      this.entries.clear();
    }
    generateTemplates() {
      let e = [],
        t =
          "position: absolute; overflow: hidden; top: 0; left: 0; width: 0; height: 0";
      e.push(`<div id="svg-templates" style="${t}">`);
      for (let n of this.entries.values()) {
        let r = "container_" + n.id;
        e.push(`  <div id="${r}">`), e.push(`    ${n.svg}`), e.push("  </div>");
      }
      return (
        e.push("</div>"),
        e.join(`
`)
      );
    }
  },
  xo = new m4();
function v4(e) {
  if (typeof DOMParser > "u") {
    console.warn("unable to find DOMParser");
    return;
  }
  try {
    let r = new DOMParser()
      .parseFromString(e, "text/html")
      .getElementsByTagName("svg")[0];
    if (!r) throw Error("no svg element found");
    return r;
  } catch {
    return;
  }
}
function g4(e, t) {
  let n = y4(t);
  oC(e, n);
}
function y4(e) {
  return e.replace(/[^\w\-:.]|^[^a-z]+/gi, "");
}
function oC(e, t) {
  b4(e, t),
    Array.from(e.children).forEach((r) => {
      oC(r, t);
    });
}
function b4(e, t) {
  e.getAttributeNames().forEach((r) => {
    let i = e.getAttribute(r);
    if (!i) return;
    if (
      (r === "id" && e.setAttribute(r, `${t}_${i}`),
      r === "href" || r === "xlink:href")
    ) {
      let [s, a] = i.split("#");
      if (s) return;
      e.setAttribute(r, `#${t}_${a}`);
      return;
    }
    let o = "url(#";
    if (i.includes(o)) {
      let s = i.replace(o, `${o}${t}_`);
      e.setAttribute(r, s);
    }
  });
}
var x4 = {
  cm: 96 / 2.54,
  mm: 96 / 2.54 / 10,
  Q: 96 / 2.54 / 40,
  in: 96,
  pc: 96 / 6,
  pt: 96 / 72,
  px: 1,
  em: 16,
  ex: 8,
  ch: 8,
  rem: 16,
};
function bS(e) {
  var t;
  if (!e) return;
  let n = /(-?[\d.]+)([a-z%]*)/.exec(e);
  if (
    !(n?.[1] === void 0 || n?.[2] === void 0) &&
    !((t = n[2]) != null && t.startsWith("%"))
  )
    return Math.round(parseFloat(n[1]) * (x4[n[2]] || 1));
}
function S4(e) {
  let t = bS(e.getAttribute("width")),
    n = bS(e.getAttribute("height"));
  if (!(typeof t != "number" || typeof n != "number") && !(t <= 0 || n <= 0))
    return { width: t, height: n };
}
function u$(e) {
  let t = wa(),
    n = ka(e),
    r = b.useRef(null),
    i = c4();
  return (
    hu(e, r),
    T(R4, { ...e, innerRef: r, parentSize: t, layoutId: n, providedWindow: i })
  );
}
var w4 = 5e4;
function C4(e) {
  return e.indexOf("image") >= 0;
}
function k4(e) {
  return e.indexOf("var(--") >= 0;
}
function T4(e) {
  return !!(
    e.borderRadius ||
    e.borderBottomLeftRadius ||
    e.borderBottomRightRadius ||
    e.borderTopLeftRadius ||
    e.borderTopRightRadius
  );
}
function xS(e, t) {
  var n, r;
  let i = e.current;
  if (!i) return;
  let o = t.providedWindow ?? De,
    s = i.firstElementChild;
  if (!s || !(s instanceof o.SVGSVGElement)) return;
  if (!s.getAttribute("viewBox")) {
    let h = xo.getViewBox(t.svg);
    h && s.setAttribute("viewBox", h);
  }
  let { withExternalLayout: a, parentSize: l } = t;
  if (!a && Sa(t) && l !== 1 && l !== 2) return;
  let { intrinsicWidth: u, intrinsicHeight: f, _constraints: d } = t;
  ((n = s.viewBox.baseVal) == null ? void 0 : n.width) === 0 &&
    ((r = s.viewBox.baseVal) == null ? void 0 : r.height) === 0 &&
    X(u) &&
    X(f) &&
    s.setAttribute("viewBox", `0 0 ${u} ${f}`),
    d && d.aspectRatio
      ? s.setAttribute("preserveAspectRatio", "")
      : s.setAttribute("preserveAspectRatio", "none"),
    s.setAttribute("width", "100%"),
    s.setAttribute("height", "100%");
}
function E4() {
  return (
    b.useInsertionEffect(() => {
      Ca();
    }, []),
    null
  );
}
var R4 = (() => {
    var e;
    return (
      (e = class extends ia {
        constructor() {
          super(...arguments),
            R(this, "container", b.createRef()),
            R(this, "svgElement", null),
            R(this, "setSVGElement", (t) => {
              (this.svgElement = t), this.setLayerElement(t);
            }),
            R(this, "previouslyRenderedSVG", ""),
            R(this, "unmountedSVG", "");
        }
        static frame(t) {
          return aa(t, t.parentSize || 0);
        }
        get frame() {
          return aa(this.props, this.props.parentSize || 0);
        }
        componentDidMount() {
          if (this.unmountedSVG) {
            let { svgContentId: t } = this.props,
              n = t ? "svg" + t : null;
            xo.subscribe(this.unmountedSVG, !t, n),
              (this.previouslyRenderedSVG = this.unmountedSVG);
          }
          this.props.svgContentId || xS(this.container, this.props);
        }
        componentWillUnmount() {
          xo.unsubscribe(this.previouslyRenderedSVG),
            (this.unmountedSVG = this.previouslyRenderedSVG),
            (this.previouslyRenderedSVG = "");
        }
        componentDidUpdate(t) {
          if ((super.componentDidUpdate(t), this.props.svgContentId)) return;
          let { fill: n } = this.props;
          nr.isImageObject(n) &&
            nr.isImageObject(t.fill) &&
            n.src !== t.fill.src &&
            mw(this.svgElement, "fill", null, !1),
            xS(this.container, this.props);
        }
        collectLayout(t, n) {
          if (this.props.withExternalLayout) {
            (n.width = "100%"),
              (n.height = "100%"),
              (n.aspectRatio = "inherit");
            return;
          }
          let r = this.frame,
            {
              rotation: i,
              intrinsicWidth: o,
              intrinsicHeight: s,
              width: a,
              height: l,
            } = this.props,
            c = He.getNumber(i);
          if (
            ((t.opacity = X(this.props.opacity) ? this.props.opacity : 1),
            _e.hasRestrictions() && r)
          ) {
            Object.assign(t, {
              transform: `translate(${r.x}px, ${r.y}px) rotate(${c.toFixed(
                4
              )}deg)`,
              width: `${r.width}px`,
              height: `${r.height}px`,
            }),
              Sa(this.props) && (t.position = "absolute");
            let u = r.width / (o || 1),
              f = r.height / (s || 1);
            n.transformOrigin = "top left";
            let { zoom: d, target: h } = Zc;
            if (h === "EXPORT") {
              let g = d > 1 ? d : 1;
              (n.transform = `scale(${u * g}, ${f * g})`), (n.zoom = 1 / g);
            } else n.transform = `scale(${u}, ${f})`;
            o && s && ((n.width = o), (n.height = s));
          } else {
            let { left: u, right: f, top: d, bottom: h } = this.props;
            Object.assign(t, {
              left: u,
              right: f,
              top: d,
              bottom: h,
              width: a,
              height: l,
              rotate: c,
            }),
              Object.assign(n, {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
              });
          }
        }
        render() {
          let {
            id: t,
            visible: n,
            style: r,
            fill: i,
            svg: o,
            intrinsicHeight: s,
            intrinsicWidth: a,
            title: l,
            description: c,
            layoutId: u,
            className: f,
            variants: d,
            withExternalLayout: h,
            innerRef: g,
            svgContentId: y,
            height: S,
            opacity: p,
            width: m,
            ...v
          } = this.props;
          if (!h && (!n || !t)) return null;
          let x = t ?? u ?? "svg",
            C = this.frame,
            w = C || { width: a || 100, height: s || 100 },
            k = { ...r, imageRendering: "pixelated", flexShrink: 0 },
            E = {};
          this.collectLayout(k, E),
            FA(this.props, k),
            nm(this.props, k),
            ia.applyWillChange(this.props, k, !1);
          let P = null;
          if (typeof i == "string" || $.isColorObject(i)) {
            let A = $.isColorObject(i) ? i.initialValue || $.toRgbString(i) : i;
            (k.fill = A), (k.color = A);
          } else if (fa.isLinearGradient(i)) {
            let A = i,
              K = `${encodeURI(t || "")}g${fa.hash(A)}`;
            k.fill = `url(#${K})`;
            let { stops: N, x1: te, x2: q, y1: ee, y2: Wt } = o4(A, x);
            P = T("svg", {
              ref: this.setSVGElement,
              xmlns: "http://www.w3.org/2000/svg",
              width: "100%",
              height: "100%",
              style: { position: "absolute" },
              children: T("linearGradient", {
                id: K,
                x1: te,
                x2: q,
                y1: ee,
                y2: Wt,
                children: N.map((ne, ut) =>
                  T(
                    "stop",
                    {
                      offset: ne.position,
                      stopColor: ne.color,
                      stopOpacity: ne.alpha,
                    },
                    ut
                  )
                ),
              }),
            });
          } else if (da.isRadialGradient(i)) {
            let A = i,
              K = `${encodeURI(t || "")}g${da.hash(A)}`;
            k.fill = `url(#${K})`;
            let N = s4(A, x);
            P = T("svg", {
              ref: this.setSVGElement,
              xmlns: "http://www.w3.org/2000/svg",
              width: "100%",
              height: "100%",
              style: { position: "absolute" },
              children: T("radialGradient", {
                id: K,
                cy: A.centerAnchorY,
                cx: A.centerAnchorX,
                r: A.widthFactor,
                children: N.stops.map((te, q) =>
                  T(
                    "stop",
                    {
                      offset: te.position,
                      stopColor: te.color,
                      stopOpacity: te.alpha,
                    },
                    q
                  )
                ),
              }),
            });
          } else if (nr.isImageObject(i)) {
            let A = a4(i, w, x);
            A &&
              ((k.fill = `url(#${A.id})`),
              (P = T("svg", {
                ref: this.setSVGElement,
                xmlns: "http://www.w3.org/2000/svg",
                xmlnsXlink: "http://www.w3.org/1999/xlink",
                width: "100%",
                height: "100%",
                style: { position: "absolute" },
                children: T("defs", { children: T(h4, { ...A }) }),
              })));
          }
          let I = { "data-framer-component-type": "SVG" },
            H = !C;
          H && Object.assign(I, rw(this.props.center));
          let L =
              !P &&
              !k.fill &&
              !k.background &&
              !k.backgroundImage &&
              o.length < w4 &&
              !C4(o) &&
              !k4(o),
            G = null;
          if (L)
            (k.backgroundSize = "100% 100%"),
              (k.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(
                o
              )}')`),
              xo.unsubscribe(this.previouslyRenderedSVG),
              (this.previouslyRenderedSVG = "");
          else {
            let A = y ? "svg" + y : null,
              K = xo.subscribe(o, !y, A);
            xo.unsubscribe(this.previouslyRenderedSVG),
              (this.previouslyRenderedSVG = o),
              T4(k) && (k.overflow = "hidden"),
              (G = oe(Ne, {
                children: [
                  P,
                  T(
                    "div",
                    {
                      className: "svgContainer",
                      style: E,
                      ref: this.container,
                      dangerouslySetInnerHTML: { __html: K },
                    },
                    nr.isImageObject(i) ? i.src : ""
                  ),
                ],
              }));
          }
          let B = uu(this.props.as),
            { href: J, target: Y, rel: V, onClick: z } = this.props;
          return oe(B, {
            ...I,
            ...v,
            layoutId: u,
            transformTemplate: H ? fu(this.props.center) : void 0,
            id: t,
            ref: g,
            style: k,
            className: f,
            variants: d,
            tabIndex: this.props.tabIndex,
            role: l || c ? "img" : void 0,
            "aria-label": l,
            "aria-description": c,
            href: J,
            target: Y,
            rel: V,
            onClick: z,
            children: [G, T(E4, {})],
          });
        }
      }),
      R(e, "supportsConstraints", !0),
      R(e, "defaultSVGProps", {
        left: void 0,
        right: void 0,
        top: void 0,
        bottom: void 0,
        style: void 0,
        _constraints: { enabled: !0, aspectRatio: null },
        parentSize: 0,
        rotation: 0,
        visible: !0,
        svg: "",
        shadows: [],
      }),
      R(e, "defaultProps", { ...ia.defaultProps, ...e.defaultSVGProps }),
      e
    );
  })(),
  P4 = /[&<>'"]/g,
  I4 = (e) =>
    e.replace(
      P4,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        }[t] || t)
    ),
  F4 =
    /(<([a-z]+)(?:\s+(?!href[\s=])[^=\s]+=(?:'[^']*'|"[^"]*"))*)(?:(\s+href\s*=)(?:'([^']*)'|"([^"]*)"))?((?:\s+[^=\s]+=(?:'[^']*'|"[^"]*"))*>)/gi;
function _4(e, t, n, r) {
  return e.replace(F4, (i, o, s, a, l, c, u) => {
    var f, d;
    if (s.toLowerCase() !== "a") return i;
    let h = l || c,
      g = lm(h.replace(/&amp;/g, "&"));
    if (!g || !g.target) return i;
    let y = t(g.target);
    if (!d1(y) || !d1(n)) return i;
    let S = y.path,
      p = n.path;
    if (!S || !p) return i;
    let m = ` data-framer-page-link-target="${g.target}"`,
      v = lu(y, g.element ?? void 0);
    v && (m += ` data-framer-page-link-element="${g.element}"`);
    let x = Ww(h);
    if (!x || Fe(x)) return i;
    Yw(n, x, r) && (m += " data-framer-page-link-current");
    let C = S,
      w = Object.assign(
        {},
        r,
        (f = g.collectionItem) == null ? void 0 : f.pathVariables
      );
    if (
      (Object.keys(w).length > 0 && (C = C.replace(Uw, (k, E) => "" + w[E])),
      (d = g.collectionItem) != null && d.pathVariables)
    ) {
      let k = new URLSearchParams(g.collectionItem.pathVariables);
      m += ` data-framer-page-link-path-variables="${k}"`;
    }
    return (C = FS(p, C)), o + a + `"${I4(C + (v ? `#${v}` : ""))}"` + m + u;
  });
}
var L4 = Yt(zp(), 1);
var Co = "CUSTOM;";
function M4(e, t) {
  if (!t) return e.substring(0, e.lastIndexOf("."));
  let n =
      t.font.preferredFamily === ""
        ? t.font.fontFamily
        : t.font.preferredFamily,
    r =
      t.font.preferredSubFamily === ""
        ? t.font.fontSubFamily
        : t.font.preferredSubFamily;
  return `${n} ${r}`;
}
var O4 = class {
  constructor() {
    R(this, "name", "custom"),
      R(this, "fontFamilies", []),
      R(this, "byFamilyName", new Map()),
      R(this, "assetsByFamily", new Map());
  }
  importFonts(e) {
    var t;
    (this.fontFamilies.length = 0),
      this.byFamilyName.clear(),
      this.assetsByFamily.clear();
    let n = [];
    for (let r of e) {
      if (!this.isValidCustomFontAsset(r)) continue;
      let i = M4(r.name, r.properties),
        o = this.createFontFamily(i),
        s = {
          family: o,
          selector: `${Co}${i}`,
          variant: this.inferVariantName(i),
          postscriptName:
            (t = r.properties) == null ? void 0 : t.font.postscriptName,
          file: r.url,
        };
      o.fonts.push(s),
        (o.owner = r.ownerType === "team" ? "team" : "project"),
        this.assetsByFamily.set(i, r),
        n.push(...o.fonts);
    }
    return n;
  }
  isValidCustomFontAsset(e) {
    var t;
    return !e.mimeType.startsWith("font/") ||
      ((t = e.properties) == null ? void 0 : t.kind) !== "font" ||
      !e.properties.font
      ? !1
      : "fontFamily" in e.properties.font;
  }
  inferVariantName(e) {
    let t = [
        "thin",
        "ultra light",
        "extra light",
        "light",
        "normal",
        "medium",
        "semi bold",
        "bold",
        "extra bold",
        "black",
      ],
      n = [...t.map((s) => `${s} italic`), ...t],
      r = e.toLowerCase(),
      i = [...r.split(" "), ...r.split("-"), ...r.split("_")],
      o = n.find((s) => i.includes(s) || i.includes(s.replace(/\s+/g, "")));
    return o ? o.replace(/^\w|\s\w/g, (s) => s.toUpperCase()) : "Regular";
  }
  createFontFamily(e) {
    let t = this.byFamilyName.get(e);
    if (t) return t;
    let n = { source: this.name, name: e, fonts: [] };
    return this.addFontFamily(n), n;
  }
  addFontFamily(e) {
    this.fontFamilies.push(e), this.byFamilyName.set(e.name, e);
  }
  parseSelector(e) {
    if (!e.startsWith(Co)) return null;
    let t = e.split(Co);
    return t[1] === void 0 ? null : { source: "custom", name: t[1] };
  }
  getFontBySelector(e, t = !0) {
    let n = this.parseSelector(e);
    if (!n || (!t && !this.byFamilyName.get(n.name))) return;
    let r = this.getFontFamilyByName(n.name).fonts;
    return (
      r.find((o) => {
        var s;
        return (s = o.file) == null ? void 0 : s.endsWith(".woff2");
      }) || r[0]
    );
  }
  getFontFamilyByName(e) {
    let t = this.byFamilyName.get(e);
    if (t) return t;
    let n = { source: "custom", name: e, fonts: [] };
    return (
      n.fonts.push({
        selector: `${Co}${e}`,
        variant: this.inferVariantName(e),
        family: n,
      }),
      n
    );
  }
};
function sC(e, t, n) {
  if (t.length === 0) return {};
  let r = n(e);
  if (!r) return {};
  let { weight: i, style: o } = r,
    s = new Map(),
    a = new Map();
  t.forEach((f) => {
    let d = Fe(f) ? f : f.name.toLocaleLowerCase(),
      h = n(d);
    h &&
      (s.set(`${h.weight}-${h.style}`, d),
      !(h.weight <= i) && (a.has(h.style) || a.set(h.style, d)));
  });
  let l = a.get(o),
    c = a.get("italic") ?? a.get("oblique");
  r.weight <= 300
    ? ((l = s.get(`400-${o}`) ?? l),
      (c = s.get("400-italic") ?? s.get("400-oblique") ?? c))
    : r.weight <= 500
    ? ((l = s.get(`700-${o}`) ?? l),
      (c = s.get("700-italic") ?? s.get("700-oblique") ?? c))
    : ((l = s.get(`900-${o}`) ?? l),
      (c = s.get("900-italic") ?? s.get("900-oblique") ?? c));
  let u = s.get(`${i}-italic`) ?? s.get(`${i}-oblique`);
  return { variantBold: l, variantItalic: u, variantBoldItalic: c };
}
var A4 = ["display", "sans", "serif", "slab", "handwritten", "script"];
function D4(e) {
  return e
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(V4);
}
function V4(e) {
  return A4.includes(e);
}
var Yc = "FS;",
  aC = {
    thin: 100,
    hairline: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    ultra: 800,
    black: 900,
    heavy: 900,
  },
  lC = Object.keys(aC),
  B4 = new RegExp(`^(?:${[...lC, "italic"].join("|")})`, "u"),
  Hr = class {
    constructor() {
      R(this, "name", "fontshare"),
        R(this, "fontFamilies", []),
        R(this, "byFamilyName", new Map());
    }
    getFontFamilyByName(e) {
      return this.byFamilyName.get(e) ?? null;
    }
    static parseVariant(e) {
      let t = e.split(" "),
        n = lC.find((s) => t.includes(s)),
        r = e.includes("italic") ? "italic" : "normal";
      return {
        weight: (n && aC[n]) || 400,
        style: r === "italic" ? r : "normal",
      };
    }
    parseSelector(e) {
      if (!e.startsWith(Yc)) return null;
      let t = e.split("-");
      if (t.length !== 2) return null;
      let [n, r] = t;
      return !n || !r
        ? null
        : { name: n.replace(Yc, ""), variant: r, source: this.name };
    }
    static createSelector(e, t) {
      return `${Yc}${e}-${t}`;
    }
    addFontFamily(e) {
      this.fontFamilies.push(e), this.byFamilyName.set(e.name, e);
    }
    importFonts(e) {
      (this.fontFamilies.length = 0), this.byFamilyName.clear();
      let t = [];
      for (let n of e) {
        let r = n.font_styles.filter((i) => {
          let o = i.name.toLowerCase();
          return !(!B4.exec(o) || o.endsWith("wide"));
        });
        for (let i of r) {
          let { name: o } = n,
            s = i.name.toLowerCase(),
            a = this.getFontFamilyByName(o);
          a ||
            ((a = { name: o, fonts: [], source: this.name }),
            this.addFontFamily(a));
          let l = Hr.createSelector(o, s),
            c = Hr.parseVariant(s) || { weight: void 0, style: void 0 },
            { weight: u, style: f } = c,
            {
              variantBold: d,
              variantBoldItalic: h,
              variantItalic: g,
            } = sC(s, r, Hr.parseVariant),
            y = {
              family: a,
              variant: s,
              selector: l,
              selectorBold: d ? Hr.createSelector(o, d) : void 0,
              selectorBoldItalic: h ? Hr.createSelector(o, h) : void 0,
              selectorItalic: g ? Hr.createSelector(o, g) : void 0,
              weight: u,
              style: f,
              file: i.file,
              category: H4(n.category),
            };
          a.fonts.push(y), t.push(y);
        }
      }
      return t;
    }
  };
function H4(e) {
  let t = {
      serif: "serif",
      sans: "sans-serif",
      slab: "slab",
      display: "display",
      handwritten: "handwriting",
      script: "handwriting",
    },
    n = D4(e)[0];
  return n && t[n];
}
var z4 = "Inter",
  N4 = {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    "": 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
  },
  SS = class {
    constructor() {
      R(this, "name", "framer"),
        R(this, "fontFamilies", []),
        R(this, "byFamilyName", new Map());
    }
    getFontFamilyByName(e) {
      return this.byFamilyName.get(e) ?? null;
    }
    addFontFamily(e) {
      let t = { name: e, fonts: [], source: this.name };
      return this.fontFamilies.push(t), this.byFamilyName.set(t.name, t), t;
    }
    static getDraftFontPropertiesBySelector(e) {
      if (!e.startsWith(z4)) return null;
      let t = e.split("-"),
        [n, r = ""] = t;
      if (!n) return null;
      let i = r.includes("Italic") ? "italic" : "normal",
        o = r.replace("Italic", ""),
        s = (o && N4[o]) || 400;
      return {
        family: n,
        style: i,
        weight: s,
        source: "framer",
        variant: void 0,
        category: "sans-serif",
      };
    }
    importFonts(e) {
      (this.fontFamilies.length = 0), this.byFamilyName.clear();
      let t = [];
      return (
        e.forEach((n) => {
          let { familyName: r, ...i } = n,
            o = this.getFontFamilyByName(r);
          o || (o = this.addFontFamily(r));
          let s = { ...i, family: o };
          o.fonts.push(s), t.push(s);
        }),
        t
      );
    }
  },
  Gc = "GF;",
  zr = class {
    constructor() {
      R(this, "name", "google"),
        R(this, "fontFamilies", []),
        R(this, "byFamilyName", new Map());
    }
    getFontFamilyByName(e) {
      return this.byFamilyName.get(e) ?? null;
    }
    static parseVariant(e) {
      if (e === "regular") return { style: "normal", weight: 400 };
      let t = /(\d*)(normal|italic)?/.exec(e);
      if (!t) return null;
      let n = parseInt(t[1] || "400"),
        r = t[2] === "italic" ? "italic" : "normal";
      return { weight: n, style: r };
    }
    parseSelector(e) {
      if (!e.startsWith(Gc)) return null;
      let t = e.split("-");
      if (t.length !== 2) return null;
      let [n, r] = t;
      return !n || !r
        ? null
        : { name: n.replace(Gc, ""), variant: r, source: this.name };
    }
    static createSelector(e, t) {
      return `${Gc}${e}-${t}`;
    }
    addFontFamily(e) {
      let t = { name: e, fonts: [], source: this.name };
      return this.fontFamilies.push(t), this.byFamilyName.set(t.name, t), t;
    }
    importFonts(e) {
      (this.fontFamilies.length = 0), this.byFamilyName.clear();
      let t = [];
      return (
        e.forEach((n) => {
          n.variants.forEach((r) => {
            var i;
            let o = n.family,
              s = this.getFontFamilyByName(o);
            s || (s = this.addFontFamily(o));
            let a = zr.parseVariant(r) ?? {},
              { weight: l, style: c } = a,
              u = zr.createSelector(o, r),
              {
                variantBold: f,
                variantItalic: d,
                variantBoldItalic: h,
              } = sC(r, n.variants, zr.parseVariant),
              g = {
                family: s,
                variant: r,
                selector: u,
                selectorBold: f ? zr.createSelector(o, f) : void 0,
                selectorBoldItalic: h ? zr.createSelector(o, h) : void 0,
                selectorItalic: d ? zr.createSelector(o, d) : void 0,
                weight: l,
                style: c,
                category: $4(n.category),
                file:
                  (i = n.files[r]) == null
                    ? void 0
                    : i.replace("http://", "https://"),
              };
            s.fonts.push(g), t.push(g);
          });
        }),
        t
      );
    }
  };
function $4(e) {
  let t = {
    serif: "serif",
    "sans-serif": "sans-serif",
    display: "display",
    handwriting: "handwriting",
    monospace: "monospace",
  };
  if (e) return t[e];
}
var j4 = Yt(D_(), 1),
  wS = 5e3,
  W4 = 3,
  cC = class extends Error {
    constructor(e) {
      super(e), (this.name = "FontLoadingError");
    }
  },
  Ep = new Map(),
  Rp = new Map(),
  U4 = (e, t) => uC(e, t);
async function uC(e, t, n = 0) {
  let { family: r, url: i, stretch: o, unicodeRange: s } = e,
    a = e.weight || 500,
    l = e.style || "normal",
    c = `${r}-${l}-${a}-${i}`;
  if (!Ep.has(c) || n > 0) {
    let u = new FontFace(r, `url(${i})`, {
        weight: Fe(a) ? a : a?.toString(),
        style: l,
        stretch: o,
        unicodeRange: s,
      }),
      f = u
        .load()
        .then(() => (t.fonts.add(u), fC(r, l, a)))
        .catch((d) => {
          if (d.name !== "NetworkError") throw d;
          if (n < W4) return uC(e, t, n + 1);
          throw new cC(
            `Font loading failed after ${n} retries due to network error: ${JSON.stringify(
              {
                family: r,
                style: l,
                weight: a,
                url: i,
                stretch: o,
                unicodeRange: s,
              }
            )}`
          );
        });
    Ep.set(c, f);
  }
  await Ep.get(c);
}
async function fC(e, t, n) {
  let r = `${e}-${t}-${n}`;
  if (!Rp.has(r)) {
    let o = new j4.default(e, { style: t, weight: n }).load(null, wS);
    Rp.set(r, o);
  }
  try {
    await Rp.get(r);
  } catch {
    throw new cC(
      `Failed to check if font is ready (${wS}ms timeout exceeded): ${JSON.stringify(
        { family: e, style: t, weight: n }
      )}`
    );
  }
}
var X4 = {
    Arial: {
      Regular: { selector: "Arial", weight: void 0 },
      Black: { selector: "Arial-Black", weight: void 0 },
      Narrow: { selector: "Arial Narrow", weight: void 0 },
      "Rounded Bold": { selector: "Arial Rounded MT Bold", weight: void 0 },
    },
    Avenir: {
      Book: { selector: "Avenir", weight: void 0 },
      Light: { selector: "Avenir-Light", weight: void 0 },
      Medium: { selector: "Avenir-Medium", weight: void 0 },
      Heavy: { selector: "Avenir-Heavy", weight: void 0 },
      Black: { selector: "Avenir-Black", weight: void 0 },
    },
    "Avenir Next": {
      Regular: { selector: "Avenir Next", weight: void 0 },
      "Ultra Light": { selector: "AvenirNext-UltraLight", weight: void 0 },
      Medium: { selector: "AvenirNext-Medium", weight: void 0 },
      "Demi Bold": { selector: "AvenirNext-DemiBold", weight: void 0 },
      Heavy: { selector: "AvenirNext-Heavy", weight: void 0 },
    },
    "Avenir Next Condensed": {
      Regular: { selector: "Avenir Next Condensed", weight: void 0 },
      "Ultra Light": {
        selector: "AvenirNextCondensed-UltraLight",
        weight: void 0,
      },
      Medium: { selector: "AvenirNextCondensed-Medium", weight: void 0 },
      "Demi Bold": { selector: "AvenirNextCondensed-DemiBold", weight: void 0 },
      Heavy: { selector: "AvenirNextCondensed-Heavy", weight: void 0 },
    },
    Baskerville: {
      Regular: { selector: "Baskerville", weight: void 0 },
      "Semi Bold": { selector: "Baskerville-SemiBold", weight: void 0 },
    },
    "Bodoni 72": {
      Book: { selector: "Bodoni 72", weight: void 0 },
      Oldstyle: { selector: "Bodoni 72 Oldstyle", weight: void 0 },
      Smallcaps: { selector: "Bodoni 72 Smallcaps", weight: void 0 },
    },
    Courier: { Regular: { selector: "Courier", weight: void 0 } },
    "Courier New": { Regular: { selector: "Courier New", weight: void 0 } },
    Futura: {
      Medium: { selector: "Futura", weight: void 0 },
      Condensed: { selector: "Futura-CondensedMedium", weight: void 0 },
      "Condensed ExtraBold": {
        selector: "Futura-CondensedExtraBold",
        weight: void 0,
      },
    },
    Georgia: { Regular: { selector: "Georgia", weight: void 0 } },
    "Gill Sans": {
      Regular: { selector: "Gill Sans", weight: void 0 },
      Light: { selector: "GillSans-Light", weight: void 0 },
      SemiBold: { selector: "GillSans-SemiBold", weight: void 0 },
      UltraBold: { selector: "GillSans-UltraBold", weight: void 0 },
    },
    Helvetica: {
      Regular: { selector: "Helvetica", weight: void 0 },
      Light: { selector: "Helvetica-Light", weight: void 0 },
      Bold: { selector: "Helvetica-Bold", weight: void 0 },
      Oblique: { selector: "Helvetica-Oblique", weight: void 0 },
      "Light Oblique": { selector: "Helvetica-LightOblique", weight: void 0 },
      "Bold Oblique": { selector: "Helvetica-BoldOblique", weight: void 0 },
    },
    "Helvetica Neue": {
      Regular: { selector: "Helvetica Neue", weight: void 0 },
      UltraLight: { selector: "HelveticaNeue-UltraLight", weight: void 0 },
      Thin: { selector: "HelveticaNeue-Thin", weight: void 0 },
      Light: { selector: "HelveticaNeue-Light", weight: void 0 },
      Medium: { selector: "HelveticaNeue-Medium", weight: void 0 },
      Bold: { selector: "HelveticaNeue-Bold", weight: void 0 },
      Italic: { selector: "HelveticaNeue-Italic", weight: void 0 },
      "UltraLight Italic": {
        selector: "HelveticaNeue-UltraLightItalic",
        weight: void 0,
      },
      "Thin Italic": { selector: "HelveticaNeue-ThinItalic", weight: void 0 },
      "Light Italic": { selector: "HelveticaNeue-LightItalic", weight: void 0 },
      "Medium Italic": {
        selector: "HelveticaNeue-MediumItalic",
        weight: void 0,
      },
      "Bold Italic": { selector: "HelveticaNeue-BoldItalic", weight: void 0 },
      "Condensed Bold": {
        selector: "HelveticaNeue-CondensedBold",
        weight: void 0,
      },
      "Condensed Black": {
        selector: "HelveticaNeue-CondensedBlack",
        weight: void 0,
      },
    },
    "Hoefler Text": { Regular: { selector: "Hoefler Text", weight: void 0 } },
    Impact: { Regular: { selector: "Impact", weight: void 0 } },
    "Lucida Grande": { Regular: { selector: "Lucida Grande", weight: void 0 } },
    Menlo: { Regular: { selector: "Menlo", weight: void 0 } },
    Monaco: { Regular: { selector: "Monaco", weight: void 0 } },
    Optima: {
      Regular: { selector: "Optima", weight: void 0 },
      ExtraBlack: { selector: "Optima-ExtraBlack", weight: void 0 },
    },
    Palatino: { Regular: { selector: "Palatino", weight: void 0 } },
    "SF Pro Display": {
      Regular: { selector: "__SF-UI-Display-Regular__", weight: 400 },
      Ultralight: { selector: "__SF-UI-Display-Ultralight__", weight: 100 },
      Thin: { selector: "__SF-UI-Display-Thin__", weight: 200 },
      Light: { selector: "__SF-UI-Display-Light__", weight: 300 },
      Medium: { selector: "__SF-UI-Display-Medium__", weight: 500 },
      Semibold: { selector: "__SF-UI-Display-Semibold__", weight: 600 },
      Bold: { selector: "__SF-UI-Display-Bold__", weight: 700 },
      Heavy: { selector: "__SF-UI-Display-Heavy__", weight: 800 },
      Black: { selector: "__SF-UI-Display-Black__", weight: 900 },
      Italic: { selector: "__SF-UI-Display-Italic__", weight: 400 },
      "Ultralight Italic": {
        selector: "__SF-UI-Display-Ultralight-Italic__",
        weight: 100,
      },
      "Thin Italic": { selector: "__SF-UI-Display-Thin-Italic__", weight: 200 },
      "Light Italic": {
        selector: "__SF-UI-Display-Light-Italic__",
        weight: 300,
      },
      "Medium Italic": {
        selector: "__SF-UI-Display-Medium-Italic__",
        weight: 500,
      },
      "Semibold Italic": {
        selector: "__SF-UI-Display-Semibold-Italic__",
        weight: 600,
      },
      "Bold Italic": { selector: "__SF-UI-Display-Bold-Italic__", weight: 700 },
      "Heavy Italic": {
        selector: "__SF-UI-Display-Heavy-Italic__",
        weight: 800,
      },
      "Black Italic": {
        selector: "__SF-UI-Display-Black-Italic__",
        weight: 900,
      },
    },
    "SF Pro Display Condensed": {
      Regular: { selector: "__SF-UI-Display-Condensed-Regular__", weight: 400 },
      Ultralight: {
        selector: "__SF-UI-Display-Condensed-Ultralight__",
        weight: 100,
      },
      Thin: { selector: "__SF-UI-Display-Condensed-Thin__", weight: 200 },
      Light: { selector: "__SF-UI-Display-Condensed-Light__", weight: 300 },
      Medium: { selector: "__SF-UI-Display-Condensed-Medium__", weight: 500 },
      Semibold: {
        selector: "__SF-UI-Display-Condensed-Semibold__",
        weight: 600,
      },
      Bold: { selector: "__SF-UI-Display-Condensed-Bold__", weight: 700 },
      Heavy: { selector: "__SF-UI-Display-Condensed-Heavy__", weight: 800 },
      Black: { selector: "__SF-UI-Display-Condensed-Black__", weight: 900 },
    },
    "SF Pro Text": {
      Regular: { selector: "__SF-UI-Text-Regular__", weight: 400 },
      Light: { selector: "__SF-UI-Text-Light__", weight: 200 },
      Medium: { selector: "__SF-UI-Text-Medium__", weight: 500 },
      Semibold: { selector: "__SF-UI-Text-Semibold__", weight: 600 },
      Bold: { selector: "__SF-UI-Text-Bold__", weight: 700 },
      Heavy: { selector: "__SF-UI-Text-Heavy__", weight: 800 },
      Italic: { selector: "__SF-UI-Text-Italic__", weight: 400 },
      "Light Italic": { selector: "__SF-UI-Text-Light-Italic__", weight: 200 },
      "Medium Italic": {
        selector: "__SF-UI-Text-Medium-Italic__",
        weight: 500,
      },
      "Semibold Italic": {
        selector: "__SF-UI-Text-Semibold-Italic__",
        weight: 600,
      },
      "Bold Italic": { selector: "__SF-UI-Text-Bold-Italic__", weight: 700 },
      "Heavy Italic": { selector: "__SF-UI-Text-Heavy-Italic__", weight: 800 },
    },
    "SF Pro Text Condensed": {
      Regular: { selector: "__SF-UI-Text-Condensed-Regular__", weight: 400 },
      Light: { selector: "__SF-UI-Text-Condensed-Light__", weight: 200 },
      Medium: { selector: "__SF-UI-Text-Condensed-Medium__", weight: 500 },
      Semibold: { selector: "__SF-UI-Text-Condensed-Semibold__", weight: 600 },
      Bold: { selector: "__SF-UI-Text-Condensed-Bold__", weight: 700 },
      Heavy: { selector: "__SF-UI-Text-Condensed-Heavy__", weight: 800 },
    },
    Tahoma: { Regular: { selector: "Tahoma", weight: void 0 } },
    Times: { Regular: { selector: "Times", weight: void 0 } },
    "Times New Roman": {
      Regular: { selector: "Times New Roman", weight: void 0 },
    },
    Trebuchet: { Regular: { selector: "Trebuchet MS", weight: void 0 } },
    Verdana: { Regular: { selector: "Verdana", weight: void 0 } },
  },
  Y4 = {
    "__SF-Compact-Display-Regular__":
      "SFCompactDisplay-Regular|.SFCompactDisplay-Regular",
    "__SF-Compact-Display-Ultralight__":
      "SFCompactDisplay-Ultralight|.SFCompactDisplay-Ultralight",
    "__SF-Compact-Display-Thin__":
      "SFCompactDisplay-Thin|.SFCompactDisplay-Thin",
    "__SF-Compact-Display-Light__":
      "SFCompactDisplay-Light|.SFCompactDisplay-Light",
    "__SF-Compact-Display-Medium__":
      "SFCompactDisplay-Medium|.SFCompactDisplay-Medium",
    "__SF-Compact-Display-Semibold__":
      "SFCompactDisplay-Semibold|.SFCompactDisplay-Semibold",
    "__SF-Compact-Display-Heavy__":
      "SFCompactDisplay-Heavy|.SFCompactDisplay-Heavy",
    "__SF-Compact-Display-Black__":
      "SFCompactDisplay-Black|.SFCompactDisplay-Black",
    "__SF-Compact-Display-Bold__":
      "SFCompactDisplay-Bold|.SFCompactDisplay-Bold",
    "__SF-UI-Text-Regular__":
      ".SFNSText|SFProText-Regular|SFUIText-Regular|.SFUIText",
    "__SF-UI-Text-Light__":
      ".SFNSText-Light|SFProText-Light|SFUIText-Light|.SFUIText-Light",
    "__SF-UI-Text-Medium__":
      ".SFNSText-Medium|SFProText-Medium|SFUIText-Medium|.SFUIText-Medium",
    "__SF-UI-Text-Semibold__":
      ".SFNSText-Semibold|SFProText-Semibold|SFUIText-Semibold|.SFUIText-Semibold",
    "__SF-UI-Text-Bold__":
      ".SFNSText-Bold|SFProText-Bold|SFUIText-Bold|.SFUIText-Bold",
    "__SF-UI-Text-Heavy__": ".SFNSText-Heavy|SFProText-Heavy|.SFUIText-Heavy",
    "__SF-UI-Text-Italic__":
      ".SFNSText-Italic|SFProText-Italic|SFUIText-Italic|.SFUIText-Italic",
    "__SF-UI-Text-Light-Italic__":
      ".SFNSText-LightItalic|SFProText-LightItalic|SFUIText-LightItalic|.SFUIText-LightItalic",
    "__SF-UI-Text-Medium-Italic__":
      ".SFNSText-MediumItalic|SFProText-MediumItalic|SFUIText-MediumItalic|.SFUIText-MediumItalic",
    "__SF-UI-Text-Semibold-Italic__":
      ".SFNSText-SemiboldItalic|SFProText-SemiboldItalic|SFUIText-SemiboldItalic|.SFUIText-SemiboldItalic",
    "__SF-UI-Text-Bold-Italic__":
      ".SFNSText-BoldItalic|SFProText-BoldItalic|SFUIText-BoldItalic|.SFUIText-BoldItalic",
    "__SF-UI-Text-Heavy-Italic__":
      ".SFNSText-HeavyItalic|SFProText-HeavyItalic|.SFUIText-HeavyItalic",
    "__SF-Compact-Text-Regular__":
      "SFCompactText-Regular|.SFCompactText-Regular",
    "__SF-Compact-Text-Light__": "SFCompactText-Light|.SFCompactText-Light",
    "__SF-Compact-Text-Medium__": "SFCompactText-Medium|.SFCompactText-Medium",
    "__SF-Compact-Text-Semibold__":
      "SFCompactText-Semibold|.SFCompactText-Semibold",
    "__SF-Compact-Text-Bold__": "SFCompactText-Bold|.SFCompactText-Bold",
    "__SF-Compact-Text-Heavy__": "SFCompactText-Heavy|.SFCompactText-Heavy",
    "__SF-Compact-Text-Italic__": "SFCompactText-Italic|.SFCompactText-Italic",
    "__SF-Compact-Text-Light-Italic__":
      "SFCompactText-LightItalic|.SFCompactText-LightItalic",
    "__SF-Compact-Text-Medium-Italic__":
      "SFCompactText-MediumItalic|.SFCompactText-MediumItalic",
    "__SF-Compact-Text-Semibold-Italic__":
      "SFCompactText-SemiboldItalic|.SFCompactText-SemiboldItalic",
    "__SF-Compact-Text-Bold-Italic__":
      "SFCompactText-BoldItalic|.SFCompactText-BoldItalic",
    "__SF-Compact-Text-Heavy-Italic__":
      "SFCompactText-HeavyItalic|.SFCompactText-HeavyItalic",
    "__SF-UI-Display-Condensed-Regular__":
      ".SFNSDisplayCondensed-Regular|SFUIDisplayCondensed-Regular|.SFUIDisplayCondensed-Regular",
    "__SF-UI-Display-Condensed-Ultralight__":
      ".SFNSDisplayCondensed-Ultralight|SFUIDisplayCondensed-Ultralight|.SFUIDisplayCondensed-Ultralight",
    "__SF-UI-Display-Condensed-Thin__":
      ".SFNSDisplayCondensed-Thin|SFUIDisplayCondensed-Thin|.SFUIDisplayCondensed-Thin",
    "__SF-UI-Display-Condensed-Light__":
      ".SFNSDisplayCondensed-Light|SFUIDisplayCondensed-Light|.SFUIDisplayCondensed-Light",
    "__SF-UI-Display-Condensed-Medium__":
      ".SFNSDisplayCondensed-Medium|SFUIDisplayCondensed-Medium|.SFUIDisplayCondensed-Medium",
    "__SF-UI-Display-Condensed-Semibold__":
      ".SFNSDisplayCondensed-Semibold|SFUIDisplayCondensed-Semibold|.SFUIDisplayCondensed-Semibold",
    "__SF-UI-Display-Condensed-Bold__":
      ".SFNSDisplayCondensed-Bold|SFUIDisplayCondensed-Bold|.SFUIDisplayCondensed-Bold",
    "__SF-UI-Display-Condensed-Heavy__":
      ".SFNSDisplayCondensed-Heavy|SFUIDisplayCondensed-Heavy|.SFUIDisplayCondensed-Heavy",
    "__SF-UI-Display-Condensed-Black__":
      ".SFNSDisplayCondensed-Black|.SFUIDisplayCondensed-Black",
    "__SF-UI-Display-Regular__":
      ".SFNSDisplay|SFProDisplay-Regular|SFUIDisplay-Regular|.SFUIDisplay",
    "__SF-UI-Display-Ultralight__":
      ".SFNSDisplay-Ultralight|SFProDisplay-Ultralight|SFUIDisplay-Ultralight|.SFUIDisplay-Ultralight",
    "__SF-UI-Display-Thin__":
      ".SFNSDisplay-Thin|SFProDisplay-Thin|SFUIDisplay-Thin|.SFUIDisplay-Thin",
    "__SF-UI-Display-Light__":
      ".SFNSDisplay-Light|SFProDisplay-Light|SFUIDisplay-Light|.SFUIDisplay-Light",
    "__SF-UI-Display-Medium__":
      ".SFNSDisplay-Medium|SFProDisplay-Medium|SFUIDisplay-Medium|.SFUIDisplay-Medium",
    "__SF-UI-Display-Semibold__":
      ".SFNSDisplay-Semibold|SFProDisplay-Semibold|SFUIDisplay-Semibold|.SFUIDisplay-Semibold",
    "__SF-UI-Display-Bold__":
      ".SFNSDisplay-Bold|SFProDisplay-Bold|SFUIDisplay-Bold|.SFUIDisplay-Bold",
    "__SF-UI-Display-Heavy__":
      ".SFNSDisplay-Heavy|SFProDisplay-Heavy|SFUIDisplay-Heavy|.SFUIDisplay-Heavy",
    "__SF-UI-Display-Black__":
      ".SFNSDisplay-Black|SFProDisplay-Black|.SFUIDisplay-Black",
    "__SF-UI-Display-Italic__":
      ".SFNSDisplay-Italic|SFProDisplay-Italic|SFUIDisplay-Italic",
    "__SF-UI-Display-Ultralight-Italic__":
      ".SFNSDisplay-UltralightItalic|SFProDisplay-UltralightItalic|SFUIDisplay-UltralightItalic|.SFUIDisplay-UltralightItalic",
    "__SF-UI-Display-Thin-Italic__":
      ".SFNSDisplay-ThinItalic|SFProDisplay-ThinItalic|SFUIDisplay-ThinItalic|.SFUIDisplay-ThinItalic",
    "__SF-UI-Display-Light-Italic__":
      ".SFNSDisplay-LightItalic|SFProDisplay-LightItalic|SFUIDisplay-LightItalic|.SFUIDisplay-LightItalic",
    "__SF-UI-Display-Medium-Italic__":
      ".SFNSDisplay-MediumItalic|SFProDisplay-MediumItalic|SFUIDisplay-MediumItalic|.SFUIDisplay-MediumItalic",
    "__SF-UI-Display-Semibold-Italic__":
      ".SFNSDisplay-SemiboldItalic|SFProDisplay-SemiboldItalic|SFUIDisplay-SemiboldItalic|.SFUIDisplay-SemiboldItalic",
    "__SF-UI-Display-Bold-Italic__":
      ".SFNSDisplay-BoldItalic|SFProDisplay-BoldItalic|SFUIDisplay-BoldItalic|.SFUIDisplay-BoldItalic",
    "__SF-UI-Display-Heavy-Italic__":
      ".SFNSDisplay-HeavyItalic|SFProDisplay-HeavyItalic|SFUIDisplay-HeavyItalic|.SFUIDisplay-HeavyItalic",
    "__SF-UI-Display-Black-Italic__":
      ".SFNSDisplay-BlackItalic|SFProDisplay-BlackItalic|.SFUIDisplay-BlackItalic",
    "__SF-UI-Text-Condensed-Regular__":
      ".SFNSTextCondensed-Regular|SFUITextCondensed-Regular|.SFUITextCondensed-Regular",
    "__SF-UI-Text-Condensed-Light__":
      ".SFNSTextCondensed-Light|SFUITextCondensed-Light|.SFUITextCondensed-Light",
    "__SF-UI-Text-Condensed-Medium__":
      ".SFNSTextCondensed-Medium|SFUITextCondensed-Medium|.SFUITextCondensed-Medium",
    "__SF-UI-Text-Condensed-Semibold__":
      ".SFNSTextCondensed-Semibold|SFUITextCondensed-Semibold|.SFUITextCondensed-Semibold",
    "__SF-UI-Text-Condensed-Bold__":
      ".SFNSTextCondensed-Bold|SFUITextCondensed-Bold|.SFUITextCondensed-Bold",
    "__SF-UI-Text-Condensed-Heavy__":
      ".SFNSTextCondensed-Heavy|.SFUITextCondensed-Heavy",
    "__SF-Compact-Rounded-Regular__":
      "SFCompactRounded-Regular|.SFCompactRounded-Regular",
    "__SF-Compact-Rounded-Ultralight__":
      "SFCompactRounded-Ultralight|.SFCompactRounded-Ultralight",
    "__SF-Compact-Rounded-Thin__":
      "SFCompactRounded-Thin|.SFCompactRounded-Thin",
    "__SF-Compact-Rounded-Light__":
      "SFCompactRounded-Light|.SFCompactRounded-Light",
    "__SF-Compact-Rounded-Medium__":
      "SFCompactRounded-Medium|.SFCompactRounded-Medium",
    "__SF-Compact-Rounded-Semibold__":
      "SFCompactRounded-Semibold|.SFCompactRounded-Semibold",
    "__SF-Compact-Rounded-Bold__":
      "SFCompactRounded-Bold|.SFCompactRounded-Bold",
    "__SF-Compact-Rounded-Heavy__":
      "SFCompactRounded-Heavy|.SFCompactRounded-Heavy",
    "__SF-Compact-Rounded-Black__":
      "SFCompactRounded-Black|.SFCompactRounded-Black",
  },
  CS = X4,
  G4 = "System Default",
  K4 = class {
    constructor() {
      R(this, "name", "local"),
        R(this, "fontFamilies", []),
        R(this, "byFamilyName", new Map()),
        R(this, "fontAliasBySelector", new Map()),
        R(this, "fontAliases", new Map());
    }
    getFontFamilyByName(e) {
      return this.byFamilyName.get(e) ?? null;
    }
    createFontFamily(e) {
      let t = { name: e, fonts: [], source: this.name };
      return this.addFontFamily(t), t;
    }
    addFontFamily(e) {
      this.fontFamilies.push(e), this.byFamilyName.set(e.name, e);
    }
    importFonts() {
      let e = [];
      for (let r of Object.keys(CS)) {
        let i = CS[r];
        if (!i) continue;
        let o = this.createFontFamily(r);
        for (let s of Object.keys(i)) {
          let a = i[s];
          if (!a) continue;
          let { selector: l, weight: c } = a,
            u = { variant: s, selector: l, weight: c, family: o };
          o.fonts.push(u);
        }
        e.push(...o.fonts);
      }
      for (let [r, i] of Object.entries(Y4)) this.addFontAlias(r, i);
      let { fontFamily: t, aliases: n } = this.getSystemFontFamily();
      this.addFontFamily(t);
      for (let [r, i] of n) this.addFontAlias(r, i);
      return e.push(...t.fonts), e;
    }
    addFontAlias(e, t) {
      this.fontAliases.set(e, t), this.fontAliasBySelector.set(t, e);
    }
    getSystemFontFamily() {
      let e =
          "system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Oxygen|Ubuntu|Cantarell|Fira Sans|Droid Sans|Helvetica Neue|sans-serif",
        t = { name: G4, fonts: [], source: this.name },
        n = new Map(),
        r = [400, 100, 200, 300, 500, 600, 700, 800, 900],
        i = ["normal", "italic"];
      for (let o of i)
        for (let s of r) {
          let a = q4(s, o),
            l = `__SystemDefault-${s}-${o}__`,
            c = { variant: a, selector: l, style: o, weight: s, family: t };
          t.fonts.push(c), n.set(l, e);
        }
      return { fontFamily: t, aliases: n };
    }
    getFontAliasBySelector(e) {
      return this.fontAliasBySelector.get(e) || null;
    }
    getFontSelectorByAlias(e) {
      return this.fontAliases.get(e) || null;
    }
    isFontFamilyAlias(e) {
      return !!(e && /^__.*__$/u.exec(e));
    }
  },
  kS = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Normal",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
  };
function q4(e, t) {
  let n = t === "normal" ? "Regular" : "Italic";
  return e === 400 ? n : t !== "normal" ? `${kS[e]} ${n}` : `${kS[e]}`;
}
var Q4 = class {
    constructor() {
      R(this, "enabled", !1),
        R(this, "bySelector", new Map()),
        R(this, "getGoogleFontsListPromise"),
        R(this, "getFontshareFontsListPromise"),
        R(this, "loadedSelectors", new Set()),
        R(this, "googleFamilyNames", new Set()),
        R(this, "local"),
        R(this, "google"),
        R(this, "fontshare"),
        R(this, "framer"),
        R(this, "custom"),
        (this.local = new K4()),
        (this.google = new zr()),
        (this.fontshare = new Hr()),
        (this.framer = new SS()),
        (this.custom = new O4()),
        (this.bySelector = new Map()),
        this.importLocalFonts();
    }
    addFont(e) {
      this.bySelector.set(e.selector, e);
    }
    getAvailableFonts() {
      return Array.from(this.bySelector.values());
    }
    importLocalFonts() {
      for (let e of this.local.importFonts()) this.addFont(e), this.loadFont(e);
    }
    async importGoogleFonts() {
      if (!this.getGoogleFontsListPromise) {
        this.getGoogleFontsListPromise = Ke.fetchGoogleFontsList();
        let e = await this.getGoogleFontsListPromise;
        for (let t of this.google.importFonts(e))
          this.googleFamilyNames.add(t.family.name.toLowerCase()),
            this.addFont(t);
      }
      return this.getGoogleFontsListPromise;
    }
    async importFontshareFonts() {
      if (!this.getFontshareFontsListPromise) {
        this.getFontshareFontsListPromise = Ke.fetchFontshareFontsList();
        let e = await this.getFontshareFontsListPromise;
        for (let t of this.fontshare.importFonts(e))
          this.googleFamilyNames.has(t.family.name.toLowerCase()) ||
            this.addFont(t);
      }
      return this.getFontshareFontsListPromise;
    }
    importFramerFonts(e) {
      this.framer.importFonts(e).forEach((t) => {
        this.addFont(t);
      });
    }
    importCustomFonts(e) {
      this.bySelector.forEach((t, n) => {
        n.startsWith(Co) && this.bySelector.delete(n);
      });
      for (let t of this.custom.importFonts(e)) this.addFont(t);
    }
    getFontFamily(e) {
      return this[e.source].getFontFamilyByName(e.name);
    }
    getFontBySelector(e, t = !0) {
      return e.startsWith(Co)
        ? this.custom.getFontBySelector(e, t)
        : this.bySelector.get(e);
    }
    getDraftPropertiesBySelector(e) {
      let t = this.getFontBySelector(e);
      if (t)
        return {
          style: t.style,
          weight: t.weight,
          variant: t.variant,
          family: t.family.name,
          source: t.family.source,
          category: t.category,
        };
      let n = this.google.parseSelector(e);
      if (n) {
        let o = zr.parseVariant(n.variant);
        if (o)
          return {
            style: o.style,
            weight: o.weight,
            variant: n.variant,
            family: n.name,
            source: "google",
            category: void 0,
          };
      }
      let r = this.fontshare.parseSelector(e);
      if (r) {
        let o = Hr.parseVariant(r.variant);
        if (o)
          return {
            style: o.style,
            weight: o.weight,
            variant: r.variant,
            family: r.name,
            source: "fontshare",
            category: void 0,
          };
      }
      let i = SS.getDraftFontPropertiesBySelector(e);
      return i || null;
    }
    isSelectorLoaded(e) {
      return this.loadedSelectors.has(e);
    }
    async loadFont(e) {
      if (this.isSelectorLoaded(e.selector)) return 0;
      let t = e.family.source;
      switch (t) {
        case "local":
          return this.loadedSelectors.add(e.selector), 1;
        case "framer":
          return (
            L4.default.env.NODE_ENV !== "test" &&
              (await fC(e.family.name, e.style, e.weight)),
            this.loadedSelectors.add(e.selector),
            1
          );
        case "google":
        case "fontshare":
        case "custom":
          return e.file
            ? (await U4(
                {
                  family: e.family.name,
                  url: e.file,
                  weight: e.weight,
                  style: e.style,
                },
                document
              ),
              this.loadedSelectors.add(e.selector),
              1)
            : Promise.reject(`Unable to load font: ${e.selector}`);
        default:
          We(t);
      }
    }
    async loadFontsFromSelectors(e) {
      if (!this.enabled) return [];
      let t = e.some((i) => i.startsWith(Gc)),
        n = e.some((i) => i.startsWith(Yc));
      if (t || n) {
        try {
          await this.importGoogleFonts();
        } catch (i) {
          sa("Failed to load Google fonts:", i);
        }
        try {
          await this.importFontshareFonts();
        } catch (i) {
          sa("Failed to load Fontshare fonts:", i);
        }
      }
      let r = e.map((i) => this.bySelector.get(i)).filter((i) => !!i);
      return Promise.allSettled(r.map((i) => this.loadFont(i)));
    }
    async loadFonts(e) {
      return {
        newlyLoadedFontCount: (await this.loadFontsFromSelectors(e)).filter(
          (r) => r.status === "fulfilled" && r.value === 1
        ).length,
      };
    }
    async loadMissingFonts(e, t) {
      let n = e.filter((i) => !Kc.isSelectorLoaded(i));
      if (n.length === 0) return;
      await Kc.loadWebFontsFromSelectors(n),
        n.every((i) => Kc.isSelectorLoaded(i)) && t && t();
    }
    async loadWebFontsFromSelectors(e) {
      return this.loadFontsFromSelectors(e);
    }
    get defaultFont() {
      let e = this.getFontBySelector("Inter");
      return ae(e, "Can\u2019t find Inter font"), e;
    }
  },
  Kc = new Q4();
Promise.allSettled =
  Promise.allSettled ||
  ((e) =>
    Promise.all(
      e.map((t) =>
        t
          .then((n) => ({ status: "fulfilled", value: n }))
          .catch((n) => ({ status: "rejected", reason: n }))
      )
    ));
function Z4(e, t) {
  return e.length === t.length && e.every((n, r) => n === t[r]);
}
var J4 = "(?:<a[^>]*>)?",
  e5 = "(?:</a>)?",
  t5 = "<[^>]+>",
  n5 = "</[^>]+>",
  r5 = "<(?:div|span)[^>]*>",
  i5 = "</(?:div|span)>",
  o5 = "<[^>]+>",
  s5 = "</[^>]+>",
  p$ = new RegExp(
    `^(${J4}${t5}${r5}${o5}).*?(${s5}).*?(${i5}${n5}${e5})$`,
    "s"
  );
var su = class {
  constructor(e) {
    R(this, "__class", "PathSegment"),
      R(this, "x", 0),
      R(this, "y", 0),
      R(this, "handleMirroring", "straight"),
      R(this, "handleOutX", 0),
      R(this, "handleOutY", 0),
      R(this, "handleInX", 0),
      R(this, "handleInY", 0),
      R(this, "radius", 0),
      e && Object.assign(this, e);
  }
  merge(e) {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, e);
  }
};
R(su, "displayName", "WithClassDiscriminatorMixin(PathSegment)");
su.prototype.__class = "PathSegment";
((e) => {
  (e.point = (t) => ({ x: t.x, y: t.y })),
    (e.handleOut = (t) => ({ x: t.handleOutX, y: t.handleOutY })),
    (e.handleIn = (t) => ({ x: t.handleInX, y: t.handleInY })),
    (e.calculatedHandleOut = (t) => {
      switch (t.handleMirroring) {
        case "symmetric":
        case "disconnected":
        case "asymmetric":
          return tt.add((0, e.point)(t), (0, e.handleOut)(t));
        default:
          return { x: t.x, y: t.y };
      }
    }),
    (e.calculatedHandleIn = (t) => {
      switch (t.handleMirroring) {
        case "symmetric":
          return tt.subtract((0, e.point)(t), (0, e.handleOut)(t));
        case "disconnected":
        case "asymmetric":
          return tt.add((0, e.point)(t), (0, e.handleIn)(t));
        default:
          return (0, e.point)(t);
      }
    }),
    (e.curveDefault = (t, n) => {
      if (t.length > 2) {
        let r, i;
        n === 0 ? (r = t[t.length - 1]) : (r = t[n - 1]),
          n === t.length - 1 ? (i = t[0]) : (i = t[n + 1]),
          ae(r, "pointBefore should be defined"),
          ae(i, "pointAfter should be defined");
        let o = tt.subtract((0, e.point)(i), (0, e.point)(r));
        return { x: o.x / 4, y: o.y / 4 };
      }
      return { x: 10, y: 10 };
    });
})(su || (su = {}));
var So = class {
    constructor() {
      R(this, "canvas", { children: [] }),
        R(this, "listeners", []),
        R(this, "ids", []);
    }
    static shared(e) {
      if (e) {
        let t = new So();
        return t.setCanvas(e), t;
      }
      return So.__shared || (So.__shared = new So()), So.__shared;
    }
    updateNode(e) {
      let t = e.props.id,
        n = this.canvas.children;
      n || (this.canvas.children = n = []);
      let r = !1;
      for (let i = 0; i < n.length; i++) {
        let o = n[i];
        if (o?.props.id === t) {
          (r = !0), (n[i] = e);
          break;
        }
      }
      r || n.push(e), this.setCanvas(this.canvas);
    }
    setCanvas(e) {
      e.children &&
        ((this.canvas = e),
        this.listeners.forEach((t, n) => {
          let r = this.ids[n];
          if (!r) return;
          let i = Hp(e, r);
          t.setState({ data: i });
        }));
    }
    registerListener(e, t) {
      return this.listeners.push(e), this.ids.push(t), Hp(this.canvas, t);
    }
    removeListener(e) {
      let t = this.listeners.indexOf(e);
      t !== -1 && (this.listeners.splice(t, 1), this.ids.splice(t, 1));
    }
  },
  a5 = So;
R(a5, "__shared", null);
function TS(e, t) {
  let { name: n, props: r } = t;
  return (r && r.id === e) || n === e;
}
function Hp(e, t) {
  if (!e) return null;
  if (TS(t, e)) return e;
  let { children: n } = e;
  if (!n || !Gp(n)) return null;
  for (let r of n) if (TS(t, r)) return r;
  for (let r of n) {
    let i = Hp(r, t);
    if (i) return i;
  }
  return null;
}
var l5 = b.createContext(null),
  w$ = l5.Provider;
var E$ = b.forwardRef(function (t, n) {
  let { background: r, children: i, alt: o, ...s } = t,
    a = { ...s.style };
  r && delete a.background;
  let l = uu(t.as);
  return oe(l, {
    ...s,
    style: a,
    ref: n,
    children: [r && T(nw, { image: r, alt: o }), i],
  });
});
var c5 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  },
  dC = /[&<>"']/g,
  u5 = RegExp(dC.source);
function ES(e) {
  return e && u5.test(e) ? e.replace(dC, (t) => c5[t] ?? "") : e || "";
}
var RS = "{{ text-placeholder }}",
  f5 = "rich-text-wrapper",
  d5 = Ue(function (t, n) {
    let {
        id: r,
        name: i,
        html: o,
        htmlFromDesign: s,
        text: a,
        textFromDesign: l,
        fonts: c = [],
        width: u,
        height: f,
        left: d,
        right: h,
        top: g,
        bottom: y,
        center: S,
        className: p,
        stylesPresetsClassName: m,
        visible: v = !0,
        opacity: x,
        rotation: C = 0,
        verticalAlignment: w = "top",
        isEditable: k = !1,
        willChangeTransform: E,
        environment: P = _e.current,
        withExternalLayout: I = !1,
        positionSticky: H,
        positionStickyTop: L,
        positionStickyRight: G,
        positionStickyBottom: B,
        positionStickyLeft: J,
        __htmlStructure: Y,
        __fromCanvasComponent: V = !1,
        _forwardedOverrideId: z,
        _forwardedOverrides: A,
        _usesDOMRect: K,
        children: N,
        ...te
      } = t,
      q = wa(),
      ee = ka(t),
      Wt = D(null),
      ne = n ?? Wt,
      { navigate: ut, getRoute: Z } = xa(),
      Lt = cu();
    H2(t.preload ?? []), hu(t, ne);
    let wt = M(Fo),
      ft = nC(),
      _o = a,
      Ei = z ?? r;
    if (Ei && A) {
      let Ct = A[Ei];
      typeof Ct == "string" && (_o = Ct);
    }
    let vn = "";
    if (_o) {
      let Ct = ES(_o);
      vn = Y ? Y.replace(RS, Ct) : `<p>${Ct}</p>`;
    } else if (o) vn = o;
    else if (l) {
      let Ct = ES(l);
      vn = Y ? Y.replace(RS, Ct) : `<p>${Ct}</p>`;
    } else s && (vn = s);
    let Ri = Xw(),
      mC = fe(
        () => (ft || !Z || !Lt ? vn : _4(vn, Z, Lt, Ri)),
        [ft, vn, Z, Lt, Ri]
      );
    if (
      (W(() => {
        let Ct = ne.current;
        if (Ct === null) return;
        function vm(bu) {
          let xu = am(bu.target, ne.current);
          if (
            bu.metaKey ||
            !ut ||
            !xu ||
            xu.getAttribute("target") === "_blank"
          )
            return;
          AV(ut, xu, Ri) && bu.preventDefault();
        }
        return (
          Ct.addEventListener("click", vm),
          () => {
            Ct.removeEventListener("click", vm);
          }
        );
      }, [ut, Ri]),
      pC(c, V, ne),
      ht(() => {
        Ca();
      }, []),
      !v)
    )
      return null;
    let vC = k && P() === "CANVAS",
      ve = {
        outline: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: hC(w),
        opacity: vC ? 0 : x,
        flexShrink: 0,
      },
      pm = _e.hasRestrictions(),
      Ur = aa(t, q || 0, !1),
      mm = K && (u === "auto" || f === "auto"),
      gC =
        !!t.transformTemplate || !Ur || !pm || V || mm
          ? t.transformTemplate ?? fu(S)
          : void 0;
    if (!I) {
      if (Ur && pm && !mm) {
        let Ct = He.getNumber(C).toFixed(4);
        (ve.transform = `translate(${Ur.x}px, ${Ur.y}px) rotate(${Ct}deg)`),
          (ve.width = Ur.width),
          (ve.minWidth = Ur.width),
          (ve.height = Ur.height);
      } else
        (ve.left = d),
          (ve.right = h),
          (ve.top = g),
          (ve.bottom = y),
          (ve.width = u),
          (ve.height = f),
          (ve.rotate = C);
      H
        ? (!ft || wt) &&
          ((ve.position = "sticky"),
          (ve.willChange = "transform"),
          (ve.zIndex = 1),
          (ve.top = L),
          (ve.right = G),
          (ve.bottom = B),
          (ve.left = J))
        : ft &&
          (t.positionFixed || t.positionAbsolute) &&
          (ve.position = "absolute");
    }
    return (
      nm(t, ve),
      Cw(t, ve),
      E && Jp(ve),
      Object.assign(ve, t.style),
      T(Ot.div, {
        id: r,
        ref: ne,
        ...te,
        style: ve,
        layoutId: ee,
        "data-framer-name": i,
        "data-framer-component-type": "DeprecatedRichText",
        "data-center": S,
        className: im(p, m, f5),
        transformTemplate: gC,
        dangerouslySetInnerHTML: { __html: mC },
      })
    );
  });
function hC(e) {
  switch (e) {
    case "top":
      return "flex-start";
    case "center":
      return "center";
    case "bottom":
      return "flex-end";
  }
}
function pC(e, t, n) {
  let r = D([]);
  Z4(r.current, e) ||
    ((r.current = e),
    Kc.loadFonts(e).then(({ newlyLoadedFontCount: i }) => {
      !t || !n.current || _e.current() !== "CANVAS" || (i > 0 && AO(n.current));
    }));
}
var PS = Ue(({ viewBoxScale: e, viewBox: t, children: n, ...r }, i) =>
    T(Ot.svg, {
      ref: i,
      ...r,
      viewBox: t,
      children: T(Ot.foreignObject, {
        width: "100%",
        height: "100%",
        className: "framer-fit-text",
        transform: `scale(${e})`,
        style: { overflow: "visible", transformOrigin: "center center" },
        children: n,
      }),
    })
  ),
  h5 = Ue((e, t) => {
    let {
        __fromCanvasComponent: n = !1,
        _forwardedOverrideId: r,
        _forwardedOverrides: i,
        _usesDOMRect: o,
        as: s,
        bottom: a,
        center: l,
        children: c,
        environment: u = _e.current,
        fonts: f = [],
        height: d,
        isEditable: h = !1,
        left: g,
        name: y,
        opacity: S,
        positionSticky: p,
        positionStickyBottom: m,
        positionStickyLeft: v,
        positionStickyRight: x,
        positionStickyTop: C,
        right: w,
        rotation: k = 0,
        style: E,
        _initialStyle: P,
        stylesPresetsClassNames: I,
        text: H,
        top: L,
        verticalAlignment: G = "top",
        visible: B = !0,
        width: J,
        willChangeTransform: Y,
        withExternalLayout: V = !1,
        viewBox: z,
        viewBoxScale: A = 1,
        ...K
      } = e,
      N = wa(),
      te = nC(),
      q = M(Fo),
      ee = ka(e),
      Wt = D(null),
      ne = t ?? Wt;
    if (
      (hu(e, ne),
      pC(f, n, ne),
      ht(() => {
        Ca();
      }, []),
      !B)
    )
      return null;
    let ut = h && u() === "CANVAS",
      Z = {
        outline: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: hC(G),
        opacity: ut ? 0 : S,
        flexShrink: 0,
      },
      Lt = _e.hasRestrictions(),
      wt = aa(e, N || 0, !1),
      ft = o && (J === "auto" || d === "auto"),
      Ei =
        !!e.transformTemplate || !wt || !Lt || n || ft
          ? e.transformTemplate ?? fu(l)
          : void 0;
    if (!V) {
      if (wt && Lt && !ft) {
        let Ri = He.getNumber(k).toFixed(4);
        (Z.transform = `translate(${wt.x}px, ${wt.y}px) rotate(${Ri}deg)`),
          (Z.width = wt.width),
          (Z.minWidth = wt.width),
          (Z.height = wt.height);
      } else
        (Z.left = g),
          (Z.right = w),
          (Z.top = L),
          (Z.bottom = a),
          (Z.width = J),
          (Z.height = d),
          (Z.rotate = k);
      p
        ? (!te || q) &&
          ((Z.position = "sticky"),
          (Z.willChange = "transform"),
          (Z.zIndex = 1),
          (Z.top = C),
          (Z.right = x),
          (Z.bottom = m),
          (Z.left = v))
        : te &&
          (e.positionFixed || e.positionAbsolute) &&
          (Z.position = "absolute");
    }
    nm(e, Z),
      Cw(e, Z),
      Y && Jp(Z),
      Object.assign(Z, P, E),
      ee && (K.layout = "preserve-aspect");
    let vn = uu(e.as);
    return Fe(e.viewBox)
      ? e.as !== void 0
        ? T(vn, {
            ...K,
            ref: ne,
            style: Z,
            layoutId: ee,
            transformTemplate: Ei,
            "data-framer-name": y,
            "data-framer-component-type": "RichTextContainer",
            children: T(PS, {
              viewBox: z,
              viewBoxScale: A,
              style: { width: "100%", height: "100%" },
              children: c && qc(c, I, H),
            }),
          })
        : T(PS, {
            ...K,
            ref: ne,
            style: Z,
            layoutId: ee,
            viewBox: z,
            viewBoxScale: A,
            transformTemplate: Ei,
            "data-framer-name": y,
            "data-framer-component-type": "RichTextContainer",
            children: c && qc(c, I, H),
          })
      : T(vn, {
          ...K,
          ref: ne,
          style: Z,
          layoutId: ee,
          transformTemplate: Ei,
          "data-framer-name": y,
          "data-framer-component-type": "RichTextContainer",
          children: c && qc(c, I, H),
        });
  });
function qc(e, t, n) {
  let r = gn.toArray(e.props.children);
  Fe(n) && (r = r.slice(0, 1)),
    (r = r.map((s) => (yn(s) ? qc(s, t, n) : Fe(n) ? n : s)));
  let { ["data-preset-tag"]: i, ...o } = e.props;
  if (Fe(e.type) || Xf(e.type)) {
    let s = i || Ay(e.type) || e.type,
      a = Fe(s) ? t?.[s] : void 0;
    o.className = im("framer-text", o.className, a);
  }
  return rn(e, o, ...r);
}
var _$ = Ue(({ children: e, html: t, htmlFromDesign: n, ...r }, i) => {
  let o = t || e || n;
  if (Fe(o)) {
    !r.stylesPresetsClassName &&
      Ae(r.stylesPresetsClassNames) &&
      (r.stylesPresetsClassName = Object.values(r.stylesPresetsClassNames).join(
        " "
      ));
    let s = { [Fe(t) ? "html" : "htmlFromDesign"]: o };
    return T(d5, { ...r, ...s, ref: i });
  }
  if (!r.stylesPresetsClassNames && Fe(r.stylesPresetsClassName)) {
    let [s, a, l, c, u] = r.stylesPresetsClassName.split(" ");
    s === void 0 || a === void 0 || l === void 0 || c === void 0 || u === void 0
      ? console.warn(
          `Encountered invalid stylesPresetsClassNames: ${r.stylesPresetsClassNames}`
        )
      : (r.stylesPresetsClassNames = { h1: s, h2: a, h3: l, p: c, a: u });
  }
  return T(h5, { ...r, ref: i, children: yn(o) ? o : void 0 });
});
function L$(e, t, n) {
  let r = p5(t);
  !n?.supportsExplicitInterCodegen &&
    !r.some((i) => i.explicitInter === !1) &&
    r.push({ explicitInter: !1, fonts: [] }),
    Object.assign(e, { fonts: r });
}
function M$(e) {
  return e.fonts ?? [];
}
function p5(e) {
  let t = { explicitInter: !1, fonts: [] },
    n = [];
  for (let r of e) v5(r) ? n.push(r) : t.fonts.push(g5(r));
  return t.fonts.length > 0 && n.push(t), n;
}
var m5 = "explicitInter";
function v5(e) {
  return m5 in e;
}
function g5(e) {
  let t;
  return (
    e.url.startsWith("https://fonts.gstatic.com/s/")
      ? (t = "google")
      : e.url.startsWith(
          "https://framerusercontent.com/third-party-assets/fontshare/"
        )
      ? (t = "fontshare")
      : (t = "custom"),
    { ...e, source: t }
  );
}
var y5 = {
    name: "framer",
    version: "2.4.1",
    main: "build/index.js",
    type: "module",
    exports: {
      ".": "./build/index.js",
      "./package.json": "./package.json",
      "./*": "./build/*",
    },
    files: [
      "build",
      "CHANGELOG.md",
      "README.md",
      "LICENSE.md",
      "postinstall.cjs",
    ],
    types: "./build/index.d.ts",
    author: "Framer",
    license: "MIT",
    scripts: {
      prepublishOnly: "make build",
      coverage: "yarn :jest --coverage",
      lint: "yarn :eslint ./src --ext .ts,.tsx --format codeframe --quiet",
      "lint:fix": "yarn lint --fix --cache",
      test: "yarn :jest",
      watch: "yarn :jest --watch",
      postinstall: "node postinstall.cjs",
    },
    dependencies: {
      "@framerjs/router": "workspace:*",
      "@juggle/resize-observer": "^3.3.1",
      eventemitter3: "^3.1.0",
      fontfaceobserver: "^2.1.0",
      "hoist-non-react-statics": "^3.3.2",
      hsluv: "^0.0.3",
    },
    devDependencies: {
      "@microsoft/api-extractor": "^7.42.3",
      "@testing-library/dom": "^8.19.1",
      "@testing-library/jest-dom": "^5.16.5",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^14.4.3",
      "@types/google.fonts": "1.0.3",
      "@types/hsluv": "https://github.com/framer/typed_hsluv#bump",
      "@types/node": "^18.17.15",
      "@types/react": "^18.0.26",
      "@types/react-dom": "^18.0.10",
      "@types/yargs": "^17.0.19",
      "@typescript-eslint/eslint-plugin": "^6.16.0",
      "@typescript-eslint/parser": "^6.16.0",
      chalk: "^4.1.2",
      eslint: "^8.56.0",
      immutable: "^3.8.2",
      "jest-diff": "^29.3.1",
      "jest-junit": "^15.0.0",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      semver: "^7.5.2",
      typescript: "^5.3.3",
      yargs: "^17.6.2",
    },
    peerDependencies: {
      "framer-motion": "11.0.7",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    tsdoc: { tsdocFlavor: "AEDoc" },
    framer: {
      components: [
        {
          name: "Scroll",
          children: !0,
          properties: [
            {
              key: "direction",
              title: "Direction",
              kind: "enum",
              options: ["horizontal", "vertical", "both"],
            },
          ],
        },
        { name: "Page" },
      ],
    },
  },
  { version: A$ } = y5;
sl.prototype.addChild = function ({ transformer: e = (t) => t }) {
  let t = he(e(this.get()));
  return this.onChange((n) => t.set(e(n))), t;
};
/**
 * @license Emotion v11.0.0
 * MIT License
 *
 * Copyright (c) Emotion team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */ /*! Bundled license information:

react-is/cjs/react-is.production.min.js:
  (** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/ export {
  b as a,
  gn as b,
  be as c,
  Ii as d,
  rn as e,
  le as f,
  Rm as g,
  Ue as h,
  Fi as i,
  ce as j,
  M as k,
  W as l,
  Xr as m,
  or as n,
  fe as o,
  D as p,
  Mt as q,
  Te as r,
  Hn as s,
  Ot as t,
  $f as u,
  Cy as v,
  Cn as w,
  ns as x,
  mt as y,
  ZR as z,
  Wf as A,
  JR as B,
  Iy as C,
  $i as D,
  NP as E,
  Ne as F,
  T as G,
  oe as H,
  sp as I,
  F_ as J,
  wH as K,
  EH as L,
  R2 as M,
  M2 as N,
  jH as O,
  $ as P,
  _e as Q,
  ez as R,
  ML as S,
  az as T,
  IM as U,
  lz as V,
  vz as W,
  im as X,
  ZN as Y,
  i6 as Z,
  o6 as _,
  u6 as $,
  lV as aa,
  v6 as ba,
  x6 as ca,
  _V as da,
  C6 as ea,
  E6 as fa,
  F6 as ga,
  _6 as ha,
  L6 as ia,
  M6 as ja,
  O6 as ka,
  A6 as la,
  V6 as ma,
  z6 as na,
  Y6 as oa,
  Q6 as pa,
  xo as qa,
  u$ as ra,
  E$ as sa,
  _$ as ta,
  L$ as ua,
  M$ as va,
};
//# sourceMappingURL=chunk-2J7DHOVR.mjs.map
