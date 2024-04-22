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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_line_dist_browser_LineDrawer_js"],{

/***/ "../../shapes/line/dist/browser/LineDrawer.js":
/*!****************************************************!*\
  !*** ../../shapes/line/dist/browser/LineDrawer.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LineDrawer: () => (/* binding */ LineDrawer)\n/* harmony export */ });\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/line/dist/browser/Utils.js\");\n\nconst sides = 1;\nclass LineDrawer {\n  draw(data) {\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_0__.drawLine)(data);\n  }\n  getSidesCount() {\n    return sides;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/line/dist/browser/LineDrawer.js?");

/***/ }),

/***/ "../../shapes/line/dist/browser/Utils.js":
/*!***********************************************!*\
  !*** ../../shapes/line/dist/browser/Utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawLine: () => (/* binding */ drawLine)\n/* harmony export */ });\nfunction drawLine(data) {\n  const {\n      context,\n      particle,\n      radius\n    } = data,\n    shapeData = particle.shapeData,\n    centerY = 0;\n  context.moveTo(-radius, centerY);\n  context.lineTo(radius, centerY);\n  context.lineCap = shapeData?.cap ?? \"butt\";\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/line/dist/browser/Utils.js?");

/***/ })

}]);