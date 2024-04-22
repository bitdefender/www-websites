/*!
 * Author : Matteo Bruni
 * MIT license: https://opensource.org/licenses/MIT
 * Demo / Generator : https://particles.js.org/
 * GitHub : https://www.github.com/matteobruni/tsparticles
 * How to use? : Check the GitHub README
 * v3.3.0
 */
"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_destroy_dist_browser_DestroyUpdater_js"],{

/***/ "../../updaters/destroy/dist/browser/DestroyUpdater.js":
/*!*************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/DestroyUpdater.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DestroyUpdater: () => (/* binding */ DestroyUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Destroy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Destroy.js */ \"../../updaters/destroy/dist/browser/Options/Classes/Destroy.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"../../updaters/destroy/dist/browser/Utils.js\");\n\n\n\nclass DestroyUpdater {\n  constructor(engine, container) {\n    this.container = container;\n    this.engine = engine;\n  }\n  init(particle) {\n    const container = this.container,\n      particlesOptions = particle.options,\n      destroyOptions = particlesOptions.destroy;\n    if (!destroyOptions) {\n      return;\n    }\n    particle.splitCount = 0;\n    const destroyBoundsOptions = destroyOptions.bounds;\n    if (!particle.destroyBounds) {\n      particle.destroyBounds = {};\n    }\n    const {\n        bottom,\n        left,\n        right,\n        top\n      } = destroyBoundsOptions,\n      {\n        destroyBounds\n      } = particle,\n      canvasSize = container.canvas.size;\n    if (bottom) {\n      destroyBounds.bottom = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(bottom) * canvasSize.height / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator;\n    }\n    if (left) {\n      destroyBounds.left = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(left) * canvasSize.width / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator;\n    }\n    if (right) {\n      destroyBounds.right = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(right) * canvasSize.width / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator;\n    }\n    if (top) {\n      destroyBounds.top = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(top) * canvasSize.height / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator;\n    }\n  }\n  isEnabled(particle) {\n    return !particle.destroyed;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.destroy) {\n      options.destroy = new _Options_Classes_Destroy_js__WEBPACK_IMPORTED_MODULE_1__.Destroy();\n    }\n    for (const source of sources) {\n      options.destroy.load(source?.destroy);\n    }\n  }\n  particleDestroyed(particle, override) {\n    if (override) {\n      return;\n    }\n    const destroyOptions = particle.options.destroy;\n    if (destroyOptions && destroyOptions.mode === \"split\") {\n      (0,_Utils_js__WEBPACK_IMPORTED_MODULE_2__.split)(this.engine, this.container, particle);\n    }\n  }\n  update(particle) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    const position = particle.getPosition(),\n      bounds = particle.destroyBounds;\n    if (!bounds) {\n      return;\n    }\n    if (bounds.bottom !== undefined && position.y >= bounds.bottom || bounds.left !== undefined && position.x <= bounds.left || bounds.right !== undefined && position.x >= bounds.right || bounds.top !== undefined && position.y <= bounds.top) {\n      particle.destroy();\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/DestroyUpdater.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Options/Classes/Destroy.js":
/*!**********************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Options/Classes/Destroy.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Destroy: () => (/* binding */ Destroy)\n/* harmony export */ });\n/* harmony import */ var _DestroyBounds_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DestroyBounds.js */ \"../../updaters/destroy/dist/browser/Options/Classes/DestroyBounds.js\");\n/* harmony import */ var _Split_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Split.js */ \"../../updaters/destroy/dist/browser/Options/Classes/Split.js\");\n\n\nclass Destroy {\n  constructor() {\n    this.bounds = new _DestroyBounds_js__WEBPACK_IMPORTED_MODULE_0__.DestroyBounds();\n    this.mode = \"none\";\n    this.split = new _Split_js__WEBPACK_IMPORTED_MODULE_1__.Split();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.mode) {\n      this.mode = data.mode;\n    }\n    if (data.bounds) {\n      this.bounds.load(data.bounds);\n    }\n    this.split.load(data.split);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Options/Classes/Destroy.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Options/Classes/DestroyBounds.js":
/*!****************************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Options/Classes/DestroyBounds.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DestroyBounds: () => (/* binding */ DestroyBounds)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass DestroyBounds {\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.bottom !== undefined) {\n      this.bottom = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.bottom);\n    }\n    if (data.left !== undefined) {\n      this.left = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.left);\n    }\n    if (data.right !== undefined) {\n      this.right = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.right);\n    }\n    if (data.top !== undefined) {\n      this.top = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.top);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Options/Classes/DestroyBounds.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Options/Classes/Split.js":
/*!********************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Options/Classes/Split.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Split: () => (/* binding */ Split)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _SplitFactor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SplitFactor.js */ \"../../updaters/destroy/dist/browser/Options/Classes/SplitFactor.js\");\n/* harmony import */ var _SplitRate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SplitRate.js */ \"../../updaters/destroy/dist/browser/Options/Classes/SplitRate.js\");\n\n\n\nclass Split {\n  constructor() {\n    this.count = 1;\n    this.factor = new _SplitFactor_js__WEBPACK_IMPORTED_MODULE_1__.SplitFactor();\n    this.rate = new _SplitRate_js__WEBPACK_IMPORTED_MODULE_2__.SplitRate();\n    this.sizeOffset = true;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.color !== undefined) {\n      this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    }\n    if (data.count !== undefined) {\n      this.count = data.count;\n    }\n    this.factor.load(data.factor);\n    this.rate.load(data.rate);\n    this.particles = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(data.particles, particles => {\n      return (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.deepExtend)({}, particles);\n    });\n    if (data.sizeOffset !== undefined) {\n      this.sizeOffset = data.sizeOffset;\n    }\n    if (data.colorOffset) {\n      this.colorOffset = this.colorOffset ?? {};\n      if (data.colorOffset.h !== undefined) {\n        this.colorOffset.h = data.colorOffset.h;\n      }\n      if (data.colorOffset.s !== undefined) {\n        this.colorOffset.s = data.colorOffset.s;\n      }\n      if (data.colorOffset.l !== undefined) {\n        this.colorOffset.l = data.colorOffset.l;\n      }\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Options/Classes/Split.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Options/Classes/SplitFactor.js":
/*!**************************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Options/Classes/SplitFactor.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SplitFactor: () => (/* binding */ SplitFactor)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass SplitFactor extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.value = 3;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Options/Classes/SplitFactor.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Options/Classes/SplitRate.js":
/*!************************************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Options/Classes/SplitRate.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SplitRate: () => (/* binding */ SplitRate)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass SplitRate extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.value = {\n      min: 4,\n      max: 9\n    };\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Options/Classes/SplitRate.js?");

/***/ }),

/***/ "../../updaters/destroy/dist/browser/Utils.js":
/*!****************************************************!*\
  !*** ../../updaters/destroy/dist/browser/Utils.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   split: () => (/* binding */ split)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst defaultOffset = 0,\n  minDestroySize = 0.5,\n  defaultSplitCount = 0,\n  increment = 1,\n  unbreakableTime = 500,\n  minSplitCount = 0;\nfunction addSplitParticle(engine, container, parent, splitParticlesOptions) {\n  const destroyOptions = parent.options.destroy;\n  if (!destroyOptions) {\n    return;\n  }\n  const splitOptions = destroyOptions.split,\n    options = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.loadParticlesOptions)(engine, container, parent.options),\n    factor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(splitOptions.factor.value),\n    parentColor = parent.getFillColor();\n  if (splitOptions.color) {\n    options.color.load(splitOptions.color);\n  } else if (splitOptions.colorOffset && parentColor) {\n    options.color.load({\n      value: {\n        hsl: {\n          h: parentColor.h + (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(splitOptions.colorOffset.h ?? defaultOffset),\n          s: parentColor.s + (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(splitOptions.colorOffset.s ?? defaultOffset),\n          l: parentColor.l + (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(splitOptions.colorOffset.l ?? defaultOffset)\n        }\n      }\n    });\n  } else {\n    options.color.load({\n      value: {\n        hsl: parent.getFillColor()\n      }\n    });\n  }\n  options.move.load({\n    center: {\n      x: parent.position.x,\n      y: parent.position.y,\n      mode: \"precise\"\n    }\n  });\n  if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isNumber)(options.size.value)) {\n    options.size.value /= factor;\n  } else {\n    options.size.value.min /= factor;\n    options.size.value.max /= factor;\n  }\n  options.load(splitParticlesOptions);\n  const offset = splitOptions.sizeOffset ? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(-parent.size.value, parent.size.value) : defaultOffset,\n    position = {\n      x: parent.position.x + (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.randomInRange)(offset),\n      y: parent.position.y + (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.randomInRange)(offset)\n    };\n  return container.particles.addParticle(position, options, parent.group, particle => {\n    if (particle.size.value < minDestroySize) {\n      return false;\n    }\n    particle.velocity.length = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.randomInRange)((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(parent.velocity.length, particle.velocity.length));\n    particle.splitCount = (parent.splitCount ?? defaultSplitCount) + increment;\n    particle.unbreakable = true;\n    setTimeout(() => {\n      particle.unbreakable = false;\n    }, unbreakableTime);\n    return true;\n  });\n}\nfunction split(engine, container, particle) {\n  const destroyOptions = particle.options.destroy;\n  if (!destroyOptions) {\n    return;\n  }\n  const splitOptions = destroyOptions.split;\n  if (splitOptions.count >= minSplitCount && (particle.splitCount === undefined || particle.splitCount++ > splitOptions.count)) {\n    return;\n  }\n  const rate = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(splitOptions.rate.value),\n    particlesSplitOptions = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromSingleOrMultiple)(splitOptions.particles);\n  for (let i = 0; i < rate; i++) {\n    addSplitParticle(engine, container, particle, particlesSplitOptions);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/destroy/dist/browser/Utils.js?");

/***/ })

}]);