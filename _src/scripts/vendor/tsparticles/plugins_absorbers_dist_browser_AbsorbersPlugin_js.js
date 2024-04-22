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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["plugins_absorbers_dist_browser_AbsorbersPlugin_js"],{

/***/ "../../plugins/absorbers/dist/browser/AbsorbersPlugin.js":
/*!***************************************************************!*\
  !*** ../../plugins/absorbers/dist/browser/AbsorbersPlugin.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbsorbersPlugin: () => (/* binding */ AbsorbersPlugin)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Absorber_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Absorber.js */ \"../../plugins/absorbers/dist/browser/Options/Classes/Absorber.js\");\n\n\nclass AbsorbersPlugin {\n  constructor() {\n    this.id = \"absorbers\";\n  }\n  async getPlugin(container) {\n    const {\n      Absorbers\n    } = await __webpack_require__.e(/*! import() */ \"plugins_absorbers_dist_browser_Absorbers_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Absorbers.js */ \"../../plugins/absorbers/dist/browser/Absorbers.js\"));\n    return new Absorbers(container);\n  }\n  loadOptions(options, source) {\n    if (!this.needsPlugin(options) && !this.needsPlugin(source)) {\n      return;\n    }\n    if (source?.absorbers) {\n      options.absorbers = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(source.absorbers, absorber => {\n        const tmp = new _Options_Classes_Absorber_js__WEBPACK_IMPORTED_MODULE_1__.Absorber();\n        tmp.load(absorber);\n        return tmp;\n      });\n    }\n    options.interactivity.modes.absorbers = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(source?.interactivity?.modes?.absorbers, absorber => {\n      const tmp = new _Options_Classes_Absorber_js__WEBPACK_IMPORTED_MODULE_1__.Absorber();\n      tmp.load(absorber);\n      return tmp;\n    });\n  }\n  needsPlugin(options) {\n    if (!options) {\n      return false;\n    }\n    const absorbers = options.absorbers;\n    if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isArray)(absorbers)) {\n      return !!absorbers.length;\n    } else if (absorbers) {\n      return true;\n    } else if (options.interactivity?.events?.onClick?.mode && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(\"absorber\", options.interactivity.events.onClick.mode)) {\n      return true;\n    }\n    return false;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/absorbers/dist/browser/AbsorbersPlugin.js?");

/***/ }),

/***/ "../../plugins/absorbers/dist/browser/Options/Classes/Absorber.js":
/*!************************************************************************!*\
  !*** ../../plugins/absorbers/dist/browser/Options/Classes/Absorber.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Absorber: () => (/* binding */ Absorber)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _AbsorberSize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbsorberSize.js */ \"../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSize.js\");\n\n\nclass Absorber {\n  constructor() {\n    this.color = new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor();\n    this.color.value = \"#000000\";\n    this.draggable = false;\n    this.opacity = 1;\n    this.destroy = true;\n    this.orbits = false;\n    this.size = new _AbsorberSize_js__WEBPACK_IMPORTED_MODULE_1__.AbsorberSize();\n  }\n  load(data) {\n    if (data === undefined) {\n      return;\n    }\n    if (data.color !== undefined) {\n      this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    }\n    if (data.draggable !== undefined) {\n      this.draggable = data.draggable;\n    }\n    this.name = data.name;\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n    if (data.position !== undefined) {\n      this.position = {};\n      if (data.position.x !== undefined) {\n        this.position.x = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.position.x);\n      }\n      if (data.position.y !== undefined) {\n        this.position.y = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.position.y);\n      }\n    }\n    if (data.size !== undefined) {\n      this.size.load(data.size);\n    }\n    if (data.destroy !== undefined) {\n      this.destroy = data.destroy;\n    }\n    if (data.orbits !== undefined) {\n      this.orbits = data.orbits;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/absorbers/dist/browser/Options/Classes/Absorber.js?");

/***/ }),

/***/ "../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSize.js":
/*!****************************************************************************!*\
  !*** ../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSize.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbsorberSize: () => (/* binding */ AbsorberSize)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _AbsorberSizeLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbsorberSizeLimit.js */ \"../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSizeLimit.js\");\n\n\nclass AbsorberSize extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ValueWithRandom {\n  constructor() {\n    super();\n    this.density = 5;\n    this.value = 50;\n    this.limit = new _AbsorberSizeLimit_js__WEBPACK_IMPORTED_MODULE_1__.AbsorberSizeLimit();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    super.load(data);\n    if (data.density !== undefined) {\n      this.density = data.density;\n    }\n    if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isNumber)(data.limit)) {\n      this.limit.radius = data.limit;\n    } else {\n      this.limit.load(data.limit);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSize.js?");

/***/ }),

/***/ "../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSizeLimit.js":
/*!*********************************************************************************!*\
  !*** ../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSizeLimit.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AbsorberSizeLimit: () => (/* binding */ AbsorberSizeLimit)\n/* harmony export */ });\nclass AbsorberSizeLimit {\n  constructor() {\n    this.radius = 0;\n    this.mass = 0;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.mass !== undefined) {\n      this.mass = data.mass;\n    }\n    if (data.radius !== undefined) {\n      this.radius = data.radius;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/absorbers/dist/browser/Options/Classes/AbsorberSizeLimit.js?");

/***/ })

}]);