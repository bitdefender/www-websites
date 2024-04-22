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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_color_dist_browser_ColorUpdater_js"],{

/***/ "../../updaters/color/dist/browser/ColorUpdater.js":
/*!*********************************************************!*\
  !*** ../../updaters/color/dist/browser/ColorUpdater.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ColorUpdater: () => (/* binding */ ColorUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass ColorUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const hslColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.rangeColorToHsl)(particle.options.color, particle.id, particle.options.reduceDuplicates);\n    if (hslColor) {\n      particle.color = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getHslAnimationFromHsl)(hslColor, particle.options.color.animation, this.container.retina.reduceFactor);\n    }\n  }\n  isEnabled(particle) {\n    const {\n        h: hAnimation,\n        s: sAnimation,\n        l: lAnimation\n      } = particle.options.color.animation,\n      {\n        color\n      } = particle;\n    return !particle.destroyed && !particle.spawning && (color?.h.value !== undefined && hAnimation.enable || color?.s.value !== undefined && sAnimation.enable || color?.l.value !== undefined && lAnimation.enable);\n  }\n  update(particle, delta) {\n    (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.updateColor)(particle.color, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/color/dist/browser/ColorUpdater.js?");

/***/ })

}]);