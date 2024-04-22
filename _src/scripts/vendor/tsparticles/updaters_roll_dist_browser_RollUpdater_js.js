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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_roll_dist_browser_RollUpdater_js"],{

/***/ "../../updaters/roll/dist/browser/Options/Classes/Roll.js":
/*!****************************************************************!*\
  !*** ../../updaters/roll/dist/browser/Options/Classes/Roll.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Roll: () => (/* binding */ Roll)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _RollLight_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RollLight.js */ \"../../updaters/roll/dist/browser/Options/Classes/RollLight.js\");\n\n\nclass Roll {\n  constructor() {\n    this.darken = new _RollLight_js__WEBPACK_IMPORTED_MODULE_1__.RollLight();\n    this.enable = false;\n    this.enlighten = new _RollLight_js__WEBPACK_IMPORTED_MODULE_1__.RollLight();\n    this.mode = \"vertical\";\n    this.speed = 25;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.backColor !== undefined) {\n      this.backColor = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.backColor, data.backColor);\n    }\n    this.darken.load(data.darken);\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    this.enlighten.load(data.enlighten);\n    if (data.mode !== undefined) {\n      this.mode = data.mode;\n    }\n    if (data.speed !== undefined) {\n      this.speed = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.speed);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/roll/dist/browser/Options/Classes/Roll.js?");

/***/ }),

/***/ "../../updaters/roll/dist/browser/Options/Classes/RollLight.js":
/*!*********************************************************************!*\
  !*** ../../updaters/roll/dist/browser/Options/Classes/RollLight.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RollLight: () => (/* binding */ RollLight)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass RollLight {\n  constructor() {\n    this.enable = false;\n    this.value = 0;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.value !== undefined) {\n      this.value = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.value);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/roll/dist/browser/Options/Classes/RollLight.js?");

/***/ }),

/***/ "../../updaters/roll/dist/browser/RollUpdater.js":
/*!*******************************************************!*\
  !*** ../../updaters/roll/dist/browser/RollUpdater.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RollUpdater: () => (/* binding */ RollUpdater)\n/* harmony export */ });\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ \"../../updaters/roll/dist/browser/Utils.js\");\n/* harmony import */ var _Options_Classes_Roll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Roll.js */ \"../../updaters/roll/dist/browser/Options/Classes/Roll.js\");\n\n\nclass RollUpdater {\n  getTransformValues(particle) {\n    const roll = particle.roll?.enable && particle.roll,\n      rollHorizontal = roll && roll.horizontal,\n      rollVertical = roll && roll.vertical;\n    return {\n      a: rollHorizontal ? Math.cos(roll.angle) : undefined,\n      d: rollVertical ? Math.sin(roll.angle) : undefined\n    };\n  }\n  init(particle) {\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_0__.initParticle)(particle);\n  }\n  isEnabled(particle) {\n    const roll = particle.options.roll;\n    return !particle.destroyed && !particle.spawning && !!roll?.enable;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.roll) {\n      options.roll = new _Options_Classes_Roll_js__WEBPACK_IMPORTED_MODULE_1__.Roll();\n    }\n    for (const source of sources) {\n      options.roll.load(source?.roll);\n    }\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_0__.updateRoll)(particle, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/roll/dist/browser/RollUpdater.js?");

/***/ }),

/***/ "../../updaters/roll/dist/browser/Utils.js":
/*!*************************************************!*\
  !*** ../../updaters/roll/dist/browser/Utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initParticle: () => (/* binding */ initParticle),\n/* harmony export */   updateRoll: () => (/* binding */ updateRoll)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst double = 2,\n  doublePI = Math.PI * double,\n  maxAngle = 360;\nfunction initParticle(particle) {\n  const rollOpt = particle.options.roll;\n  if (!rollOpt?.enable) {\n    particle.roll = {\n      enable: false,\n      horizontal: false,\n      vertical: false,\n      angle: 0,\n      speed: 0\n    };\n    return;\n  }\n  particle.roll = {\n    enable: rollOpt.enable,\n    horizontal: rollOpt.mode === \"horizontal\" || rollOpt.mode === \"both\",\n    vertical: rollOpt.mode === \"vertical\" || rollOpt.mode === \"both\",\n    angle: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() * doublePI,\n    speed: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.speed) / maxAngle\n  };\n  if (rollOpt.backColor) {\n    particle.backColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.rangeColorToHsl)(rollOpt.backColor);\n  } else if (rollOpt.darken.enable && rollOpt.enlighten.enable) {\n    const alterType = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() >= _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.halfRandom ? \"darken\" : \"enlighten\";\n    particle.roll.alter = {\n      type: alterType,\n      value: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(alterType === \"darken\" ? rollOpt.darken.value : rollOpt.enlighten.value)\n    };\n  } else if (rollOpt.darken.enable) {\n    particle.roll.alter = {\n      type: \"darken\",\n      value: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.darken.value)\n    };\n  } else if (rollOpt.enlighten.enable) {\n    particle.roll.alter = {\n      type: \"enlighten\",\n      value: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.enlighten.value)\n    };\n  }\n}\nfunction updateRoll(particle, delta) {\n  const roll = particle.options.roll,\n    data = particle.roll;\n  if (!data || !roll?.enable) {\n    return;\n  }\n  const speed = data.speed * delta.factor,\n    max = doublePI;\n  data.angle += speed;\n  if (data.angle > max) {\n    data.angle -= max;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/roll/dist/browser/Utils.js?");

/***/ })

}]);