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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_twinkle_dist_browser_TwinkleUpdater_js"],{

/***/ "../../updaters/twinkle/dist/browser/Options/Classes/Twinkle.js":
/*!**********************************************************************!*\
  !*** ../../updaters/twinkle/dist/browser/Options/Classes/Twinkle.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Twinkle: () => (/* binding */ Twinkle)\n/* harmony export */ });\n/* harmony import */ var _TwinkleValues_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TwinkleValues.js */ \"../../updaters/twinkle/dist/browser/Options/Classes/TwinkleValues.js\");\n\nclass Twinkle {\n  constructor() {\n    this.lines = new _TwinkleValues_js__WEBPACK_IMPORTED_MODULE_0__.TwinkleValues();\n    this.particles = new _TwinkleValues_js__WEBPACK_IMPORTED_MODULE_0__.TwinkleValues();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    this.lines.load(data.lines);\n    this.particles.load(data.particles);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/twinkle/dist/browser/Options/Classes/Twinkle.js?");

/***/ }),

/***/ "../../updaters/twinkle/dist/browser/Options/Classes/TwinkleValues.js":
/*!****************************************************************************!*\
  !*** ../../updaters/twinkle/dist/browser/Options/Classes/TwinkleValues.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TwinkleValues: () => (/* binding */ TwinkleValues)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass TwinkleValues {\n  constructor() {\n    this.enable = false;\n    this.frequency = 0.05;\n    this.opacity = 1;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.color !== undefined) {\n      this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.frequency !== undefined) {\n      this.frequency = data.frequency;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.opacity);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/twinkle/dist/browser/Options/Classes/TwinkleValues.js?");

/***/ }),

/***/ "../../updaters/twinkle/dist/browser/TwinkleUpdater.js":
/*!*************************************************************!*\
  !*** ../../updaters/twinkle/dist/browser/TwinkleUpdater.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TwinkleUpdater: () => (/* binding */ TwinkleUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Twinkle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Twinkle.js */ \"../../updaters/twinkle/dist/browser/Options/Classes/Twinkle.js\");\n\n\nclass TwinkleUpdater {\n  getColorStyles(particle, context, radius, opacity) {\n    const pOptions = particle.options,\n      twinkleOptions = pOptions.twinkle;\n    if (!twinkleOptions) {\n      return {};\n    }\n    const twinkle = twinkleOptions.particles,\n      twinkling = twinkle.enable && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() < twinkle.frequency,\n      zIndexOptions = particle.options.zIndex,\n      zOffset = 1,\n      zOpacityFactor = (zOffset - particle.zIndexFactor) ** zIndexOptions.opacityRate,\n      twinklingOpacity = twinkling ? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(twinkle.opacity) * zOpacityFactor : opacity,\n      twinkleRgb = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.rangeColorToHsl)(twinkle.color),\n      twinkleStyle = twinkleRgb ? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getStyleFromHsl)(twinkleRgb, twinklingOpacity) : undefined,\n      res = {},\n      needsTwinkle = twinkling && twinkleStyle;\n    res.fill = needsTwinkle ? twinkleStyle : undefined;\n    res.stroke = needsTwinkle ? twinkleStyle : undefined;\n    return res;\n  }\n  async init() {\n    await Promise.resolve();\n  }\n  isEnabled(particle) {\n    const pOptions = particle.options,\n      twinkleOptions = pOptions.twinkle;\n    if (!twinkleOptions) {\n      return false;\n    }\n    return twinkleOptions.particles.enable;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.twinkle) {\n      options.twinkle = new _Options_Classes_Twinkle_js__WEBPACK_IMPORTED_MODULE_1__.Twinkle();\n    }\n    for (const source of sources) {\n      options.twinkle.load(source?.twinkle);\n    }\n  }\n  async update() {\n    await Promise.resolve();\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/twinkle/dist/browser/TwinkleUpdater.js?");

/***/ })

}]);