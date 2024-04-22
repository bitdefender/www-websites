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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_rotate_dist_browser_RotateUpdater_js"],{

/***/ "../../updaters/rotate/dist/browser/Options/Classes/Rotate.js":
/*!********************************************************************!*\
  !*** ../../updaters/rotate/dist/browser/Options/Classes/Rotate.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Rotate: () => (/* binding */ Rotate)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _RotateAnimation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RotateAnimation.js */ \"../../updaters/rotate/dist/browser/Options/Classes/RotateAnimation.js\");\n\n\nclass Rotate extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.animation = new _RotateAnimation_js__WEBPACK_IMPORTED_MODULE_1__.RotateAnimation();\n    this.direction = \"clockwise\";\n    this.path = false;\n    this.value = 0;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    super.load(data);\n    if (data.direction !== undefined) {\n      this.direction = data.direction;\n    }\n    this.animation.load(data.animation);\n    if (data.path !== undefined) {\n      this.path = data.path;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/rotate/dist/browser/Options/Classes/Rotate.js?");

/***/ }),

/***/ "../../updaters/rotate/dist/browser/Options/Classes/RotateAnimation.js":
/*!*****************************************************************************!*\
  !*** ../../updaters/rotate/dist/browser/Options/Classes/RotateAnimation.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RotateAnimation: () => (/* binding */ RotateAnimation)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass RotateAnimation {\n  constructor() {\n    this.enable = false;\n    this.speed = 0;\n    this.decay = 0;\n    this.sync = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.speed !== undefined) {\n      this.speed = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.speed);\n    }\n    if (data.decay !== undefined) {\n      this.decay = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.decay);\n    }\n    if (data.sync !== undefined) {\n      this.sync = data.sync;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/rotate/dist/browser/Options/Classes/RotateAnimation.js?");

/***/ }),

/***/ "../../updaters/rotate/dist/browser/RotateUpdater.js":
/*!***********************************************************!*\
  !*** ../../updaters/rotate/dist/browser/RotateUpdater.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RotateUpdater: () => (/* binding */ RotateUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Rotate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Rotate.js */ \"../../updaters/rotate/dist/browser/Options/Classes/Rotate.js\");\n\n\nconst double = 2,\n  doublePI = Math.PI * double,\n  identity = 1,\n  doublePIDeg = 360;\nclass RotateUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const rotateOptions = particle.options.rotate;\n    if (!rotateOptions) {\n      return;\n    }\n    particle.rotate = {\n      enable: rotateOptions.animation.enable,\n      value: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.degToRad)((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rotateOptions.value)),\n      min: 0,\n      max: doublePI\n    };\n    particle.pathRotation = rotateOptions.path;\n    let rotateDirection = rotateOptions.direction;\n    if (rotateDirection === \"random\") {\n      const index = Math.floor((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() * double),\n        minIndex = 0;\n      rotateDirection = index > minIndex ? \"counter-clockwise\" : \"clockwise\";\n    }\n    switch (rotateDirection) {\n      case \"counter-clockwise\":\n      case \"counterClockwise\":\n        particle.rotate.status = \"decreasing\";\n        break;\n      case \"clockwise\":\n        particle.rotate.status = \"increasing\";\n        break;\n    }\n    const rotateAnimation = rotateOptions.animation;\n    if (rotateAnimation.enable) {\n      particle.rotate.decay = identity - (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rotateAnimation.decay);\n      particle.rotate.velocity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rotateAnimation.speed) / doublePIDeg * this.container.retina.reduceFactor;\n      if (!rotateAnimation.sync) {\n        particle.rotate.velocity *= (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)();\n      }\n    }\n    particle.rotation = particle.rotate.value;\n  }\n  isEnabled(particle) {\n    const rotate = particle.options.rotate;\n    if (!rotate) {\n      return false;\n    }\n    return !particle.destroyed && !particle.spawning && rotate.animation.enable && !rotate.path;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.rotate) {\n      options.rotate = new _Options_Classes_Rotate_js__WEBPACK_IMPORTED_MODULE_1__.Rotate();\n    }\n    for (const source of sources) {\n      options.rotate.load(source?.rotate);\n    }\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    if (!particle.rotate) {\n      return;\n    }\n    (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.updateAnimation)(particle, particle.rotate, false, \"none\", delta);\n    particle.rotation = particle.rotate.value;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/rotate/dist/browser/RotateUpdater.js?");

/***/ })

}]);