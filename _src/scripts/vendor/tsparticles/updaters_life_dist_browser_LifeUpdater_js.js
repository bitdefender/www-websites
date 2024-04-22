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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_life_dist_browser_LifeUpdater_js"],{

/***/ "../../updaters/life/dist/browser/LifeUpdater.js":
/*!*******************************************************!*\
  !*** ../../updaters/life/dist/browser/LifeUpdater.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LifeUpdater: () => (/* binding */ LifeUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Life_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Life.js */ \"../../updaters/life/dist/browser/Options/Classes/Life.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"../../updaters/life/dist/browser/Utils.js\");\n\n\n\nconst noTime = 0,\n  identity = 1,\n  infiniteValue = -1;\nclass LifeUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const container = this.container,\n      particlesOptions = particle.options,\n      lifeOptions = particlesOptions.life;\n    if (!lifeOptions) {\n      return;\n    }\n    particle.life = {\n      delay: container.retina.reduceFactor ? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(lifeOptions.delay.value) * (lifeOptions.delay.sync ? identity : (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)()) / container.retina.reduceFactor * _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds : noTime,\n      delayTime: noTime,\n      duration: container.retina.reduceFactor ? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(lifeOptions.duration.value) * (lifeOptions.duration.sync ? identity : (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)()) / container.retina.reduceFactor * _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds : noTime,\n      time: noTime,\n      count: lifeOptions.count\n    };\n    if (particle.life.duration <= noTime) {\n      particle.life.duration = infiniteValue;\n    }\n    if (particle.life.count <= noTime) {\n      particle.life.count = infiniteValue;\n    }\n    if (particle.life) {\n      particle.spawning = particle.life.delay > noTime;\n    }\n  }\n  isEnabled(particle) {\n    return !particle.destroyed;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.life) {\n      options.life = new _Options_Classes_Life_js__WEBPACK_IMPORTED_MODULE_1__.Life();\n    }\n    for (const source of sources) {\n      options.life.load(source?.life);\n    }\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle) || !particle.life) {\n      return;\n    }\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_2__.updateLife)(particle, delta, this.container.canvas.size);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/LifeUpdater.js?");

/***/ }),

/***/ "../../updaters/life/dist/browser/Options/Classes/Life.js":
/*!****************************************************************!*\
  !*** ../../updaters/life/dist/browser/Options/Classes/Life.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Life: () => (/* binding */ Life)\n/* harmony export */ });\n/* harmony import */ var _LifeDelay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LifeDelay.js */ \"../../updaters/life/dist/browser/Options/Classes/LifeDelay.js\");\n/* harmony import */ var _LifeDuration_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LifeDuration.js */ \"../../updaters/life/dist/browser/Options/Classes/LifeDuration.js\");\n\n\nclass Life {\n  constructor() {\n    this.count = 0;\n    this.delay = new _LifeDelay_js__WEBPACK_IMPORTED_MODULE_0__.LifeDelay();\n    this.duration = new _LifeDuration_js__WEBPACK_IMPORTED_MODULE_1__.LifeDuration();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.count !== undefined) {\n      this.count = data.count;\n    }\n    this.delay.load(data.delay);\n    this.duration.load(data.duration);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/Options/Classes/Life.js?");

/***/ }),

/***/ "../../updaters/life/dist/browser/Options/Classes/LifeDelay.js":
/*!*********************************************************************!*\
  !*** ../../updaters/life/dist/browser/Options/Classes/LifeDelay.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LifeDelay: () => (/* binding */ LifeDelay)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass LifeDelay extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.sync = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    super.load(data);\n    if (data.sync !== undefined) {\n      this.sync = data.sync;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/Options/Classes/LifeDelay.js?");

/***/ }),

/***/ "../../updaters/life/dist/browser/Options/Classes/LifeDuration.js":
/*!************************************************************************!*\
  !*** ../../updaters/life/dist/browser/Options/Classes/LifeDuration.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LifeDuration: () => (/* binding */ LifeDuration)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass LifeDuration extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.sync = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    super.load(data);\n    if (data.sync !== undefined) {\n      this.sync = data.sync;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/Options/Classes/LifeDuration.js?");

/***/ }),

/***/ "../../updaters/life/dist/browser/Utils.js":
/*!*************************************************!*\
  !*** ../../updaters/life/dist/browser/Utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   updateLife: () => (/* binding */ updateLife)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst noTime = 0,\n  infiniteValue = -1,\n  noLife = 0,\n  minCanvasSize = 0;\nfunction updateLife(particle, delta, canvasSize) {\n  if (!particle.life) {\n    return;\n  }\n  const life = particle.life;\n  let justSpawned = false;\n  if (particle.spawning) {\n    life.delayTime += delta.value;\n    if (life.delayTime >= particle.life.delay) {\n      justSpawned = true;\n      particle.spawning = false;\n      life.delayTime = noTime;\n      life.time = noTime;\n    } else {\n      return;\n    }\n  }\n  if (life.duration === infiniteValue) {\n    return;\n  }\n  if (particle.spawning) {\n    return;\n  }\n  if (justSpawned) {\n    life.time = noTime;\n  } else {\n    life.time += delta.value;\n  }\n  if (life.time < life.duration) {\n    return;\n  }\n  life.time = noTime;\n  if (particle.life.count > noLife) {\n    particle.life.count--;\n  }\n  if (particle.life.count === noLife) {\n    particle.destroy();\n    return;\n  }\n  const widthRange = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(minCanvasSize, canvasSize.width),\n    heightRange = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(minCanvasSize, canvasSize.width);\n  particle.position.x = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.randomInRange)(widthRange);\n  particle.position.y = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.randomInRange)(heightRange);\n  particle.spawning = true;\n  life.delayTime = noTime;\n  life.time = noTime;\n  particle.reset();\n  const lifeOptions = particle.options.life;\n  if (lifeOptions) {\n    life.delay = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(lifeOptions.delay.value) * _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds;\n    life.duration = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(lifeOptions.duration.value) * _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/Utils.js?");

/***/ })

}]);