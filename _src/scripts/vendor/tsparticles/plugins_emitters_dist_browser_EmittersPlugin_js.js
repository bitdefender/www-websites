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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["plugins_emitters_dist_browser_EmittersPlugin_js"],{

/***/ "../../plugins/emitters/dist/browser/EmittersPlugin.js":
/*!*************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/EmittersPlugin.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmittersPlugin: () => (/* binding */ EmittersPlugin)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Emitter.js */ \"../../plugins/emitters/dist/browser/Options/Classes/Emitter.js\");\n\n\nclass EmittersPlugin {\n  constructor(engine) {\n    this._engine = engine;\n    this.id = \"emitters\";\n  }\n  async getPlugin(container) {\n    const {\n      Emitters\n    } = await __webpack_require__.e(/*! import() */ \"plugins_emitters_dist_browser_Emitters_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Emitters.js */ \"../../plugins/emitters/dist/browser/Emitters.js\"));\n    return new Emitters(this._engine, container);\n  }\n  loadOptions(options, source) {\n    if (!this.needsPlugin(options) && !this.needsPlugin(source)) {\n      return;\n    }\n    if (source?.emitters) {\n      options.emitters = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(source.emitters, emitter => {\n        const tmp = new _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__.Emitter();\n        tmp.load(emitter);\n        return tmp;\n      });\n    }\n    const interactivityEmitters = source?.interactivity?.modes?.emitters;\n    if (interactivityEmitters) {\n      if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isArray)(interactivityEmitters)) {\n        options.interactivity.modes.emitters = {\n          random: {\n            count: 1,\n            enable: true\n          },\n          value: interactivityEmitters.map(s => {\n            const tmp = new _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__.Emitter();\n            tmp.load(s);\n            return tmp;\n          })\n        };\n      } else {\n        const emitterMode = interactivityEmitters;\n        if (emitterMode.value !== undefined) {\n          const defaultCount = 1;\n          if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isArray)(emitterMode.value)) {\n            options.interactivity.modes.emitters = {\n              random: {\n                count: emitterMode.random.count ?? defaultCount,\n                enable: emitterMode.random.enable ?? false\n              },\n              value: emitterMode.value.map(s => {\n                const tmp = new _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__.Emitter();\n                tmp.load(s);\n                return tmp;\n              })\n            };\n          } else {\n            const tmp = new _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__.Emitter();\n            tmp.load(emitterMode.value);\n            options.interactivity.modes.emitters = {\n              random: {\n                count: emitterMode.random.count ?? defaultCount,\n                enable: emitterMode.random.enable ?? false\n              },\n              value: tmp\n            };\n          }\n        } else {\n          const emitterOptions = options.interactivity.modes.emitters = {\n            random: {\n              count: 1,\n              enable: false\n            },\n            value: new _Options_Classes_Emitter_js__WEBPACK_IMPORTED_MODULE_1__.Emitter()\n          };\n          emitterOptions.value.load(interactivityEmitters);\n        }\n      }\n    }\n  }\n  needsPlugin(options) {\n    if (!options) {\n      return false;\n    }\n    const emitters = options.emitters;\n    return (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isArray)(emitters) && !!emitters.length || emitters !== undefined || !!options.interactivity?.events?.onClick?.mode && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(\"emitter\", options.interactivity.events.onClick.mode);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/EmittersPlugin.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/Emitter.js":
/*!**********************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/Emitter.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Emitter: () => (/* binding */ Emitter)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _EmitterLife_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmitterLife.js */ \"../../plugins/emitters/dist/browser/Options/Classes/EmitterLife.js\");\n/* harmony import */ var _EmitterRate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EmitterRate.js */ \"../../plugins/emitters/dist/browser/Options/Classes/EmitterRate.js\");\n/* harmony import */ var _EmitterShape_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmitterShape.js */ \"../../plugins/emitters/dist/browser/Options/Classes/EmitterShape.js\");\n/* harmony import */ var _EmitterSize_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EmitterSize.js */ \"../../plugins/emitters/dist/browser/Options/Classes/EmitterSize.js\");\n\n\n\n\n\nclass Emitter {\n  constructor() {\n    this.autoPlay = true;\n    this.fill = true;\n    this.life = new _EmitterLife_js__WEBPACK_IMPORTED_MODULE_1__.EmitterLife();\n    this.rate = new _EmitterRate_js__WEBPACK_IMPORTED_MODULE_2__.EmitterRate();\n    this.shape = new _EmitterShape_js__WEBPACK_IMPORTED_MODULE_3__.EmitterShape();\n    this.startCount = 0;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.autoPlay !== undefined) {\n      this.autoPlay = data.autoPlay;\n    }\n    if (data.size !== undefined) {\n      if (!this.size) {\n        this.size = new _EmitterSize_js__WEBPACK_IMPORTED_MODULE_4__.EmitterSize();\n      }\n      this.size.load(data.size);\n    }\n    if (data.direction !== undefined) {\n      this.direction = data.direction;\n    }\n    this.domId = data.domId;\n    if (data.fill !== undefined) {\n      this.fill = data.fill;\n    }\n    this.life.load(data.life);\n    this.name = data.name;\n    this.particles = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(data.particles, particles => {\n      return (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.deepExtend)({}, particles);\n    });\n    this.rate.load(data.rate);\n    this.shape.load(data.shape);\n    if (data.position !== undefined) {\n      this.position = {};\n      if (data.position.x !== undefined) {\n        this.position.x = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.position.x);\n      }\n      if (data.position.y !== undefined) {\n        this.position.y = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.position.y);\n      }\n    }\n    if (data.spawnColor !== undefined) {\n      if (this.spawnColor === undefined) {\n        this.spawnColor = new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.AnimatableColor();\n      }\n      this.spawnColor.load(data.spawnColor);\n    }\n    if (data.startCount !== undefined) {\n      this.startCount = data.startCount;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/Emitter.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/EmitterLife.js":
/*!**************************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/EmitterLife.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmitterLife: () => (/* binding */ EmitterLife)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass EmitterLife {\n  constructor() {\n    this.wait = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.count !== undefined) {\n      this.count = data.count;\n    }\n    if (data.delay !== undefined) {\n      this.delay = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.delay);\n    }\n    if (data.duration !== undefined) {\n      this.duration = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.duration);\n    }\n    if (data.wait !== undefined) {\n      this.wait = data.wait;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/EmitterLife.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/EmitterRate.js":
/*!**************************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/EmitterRate.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmitterRate: () => (/* binding */ EmitterRate)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass EmitterRate {\n  constructor() {\n    this.quantity = 1;\n    this.delay = 0.1;\n  }\n  load(data) {\n    if (data === undefined) {\n      return;\n    }\n    if (data.quantity !== undefined) {\n      this.quantity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.quantity);\n    }\n    if (data.delay !== undefined) {\n      this.delay = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.delay);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/EmitterRate.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/EmitterShape.js":
/*!***************************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/EmitterShape.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmitterShape: () => (/* binding */ EmitterShape)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _EmitterShapeReplace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmitterShapeReplace.js */ \"../../plugins/emitters/dist/browser/Options/Classes/EmitterShapeReplace.js\");\n\n\nclass EmitterShape {\n  constructor() {\n    this.options = {};\n    this.replace = new _EmitterShapeReplace_js__WEBPACK_IMPORTED_MODULE_1__.EmitterShapeReplace();\n    this.type = \"square\";\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.options !== undefined) {\n      this.options = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.deepExtend)({}, data.options ?? {});\n    }\n    this.replace.load(data.replace);\n    if (data.type !== undefined) {\n      this.type = data.type;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/EmitterShape.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/EmitterShapeReplace.js":
/*!**********************************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/EmitterShapeReplace.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmitterShapeReplace: () => (/* binding */ EmitterShapeReplace)\n/* harmony export */ });\nclass EmitterShapeReplace {\n  constructor() {\n    this.color = false;\n    this.opacity = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.color !== undefined) {\n      this.color = data.color;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/EmitterShapeReplace.js?");

/***/ }),

/***/ "../../plugins/emitters/dist/browser/Options/Classes/EmitterSize.js":
/*!**************************************************************************!*\
  !*** ../../plugins/emitters/dist/browser/Options/Classes/EmitterSize.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmitterSize: () => (/* binding */ EmitterSize)\n/* harmony export */ });\nclass EmitterSize {\n  constructor() {\n    this.mode = \"percent\";\n    this.height = 0;\n    this.width = 0;\n  }\n  load(data) {\n    if (data === undefined) {\n      return;\n    }\n    if (data.mode !== undefined) {\n      this.mode = data.mode;\n    }\n    if (data.height !== undefined) {\n      this.height = data.height;\n    }\n    if (data.width !== undefined) {\n      this.width = data.width;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/emitters/dist/browser/Options/Classes/EmitterSize.js?");

/***/ })

}]);