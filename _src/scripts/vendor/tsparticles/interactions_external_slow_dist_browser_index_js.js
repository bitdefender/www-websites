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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_slow_dist_browser_index_js"],{

/***/ "../../interactions/external/slow/dist/browser/Options/Classes/Slow.js":
/*!*****************************************************************************!*\
  !*** ../../interactions/external/slow/dist/browser/Options/Classes/Slow.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Slow: () => (/* binding */ Slow)\n/* harmony export */ });\nclass Slow {\n  constructor() {\n    this.factor = 3;\n    this.radius = 200;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.factor !== undefined) {\n      this.factor = data.factor;\n    }\n    if (data.radius !== undefined) {\n      this.radius = data.radius;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/slow/dist/browser/Options/Classes/Slow.js?");

/***/ }),

/***/ "../../interactions/external/slow/dist/browser/Options/Interfaces/ISlow.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/slow/dist/browser/Options/Interfaces/ISlow.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/slow/dist/browser/Options/Interfaces/ISlow.js?");

/***/ }),

/***/ "../../interactions/external/slow/dist/browser/index.js":
/*!**************************************************************!*\
  !*** ../../interactions/external/slow/dist/browser/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Slow: () => (/* reexport safe */ _Options_Classes_Slow_js__WEBPACK_IMPORTED_MODULE_0__.Slow),\n/* harmony export */   loadExternalSlowInteraction: () => (/* binding */ loadExternalSlowInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Slow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Slow.js */ \"../../interactions/external/slow/dist/browser/Options/Classes/Slow.js\");\n/* harmony import */ var _Options_Interfaces_ISlow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Interfaces/ISlow.js */ \"../../interactions/external/slow/dist/browser/Options/Interfaces/ISlow.js\");\nasync function loadExternalSlowInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalSlow\", async container => {\n    const {\n      Slower\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_slow_dist_browser_Slower_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Slower.js */ \"../../interactions/external/slow/dist/browser/Slower.js\"));\n    return new Slower(container);\n  }, refresh);\n}\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/slow/dist/browser/index.js?");

/***/ })

}]);