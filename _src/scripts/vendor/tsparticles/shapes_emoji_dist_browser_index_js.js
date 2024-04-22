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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_emoji_dist_browser_index_js"],{

/***/ "../../shapes/emoji/dist/browser/Constants.js":
/*!****************************************************!*\
  !*** ../../shapes/emoji/dist/browser/Constants.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   validTypes: () => (/* binding */ validTypes)\n/* harmony export */ });\nconst validTypes = [\"emoji\"];\n\n//# sourceURL=webpack://tsparticles/../../shapes/emoji/dist/browser/Constants.js?");

/***/ }),

/***/ "../../shapes/emoji/dist/browser/index.js":
/*!************************************************!*\
  !*** ../../shapes/emoji/dist/browser/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadEmojiShape: () => (/* binding */ loadEmojiShape)\n/* harmony export */ });\n/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants.js */ \"../../shapes/emoji/dist/browser/Constants.js\");\n\nasync function loadEmojiShape(engine, refresh = true) {\n  const {\n    EmojiDrawer\n  } = await __webpack_require__.e(/*! import() */ \"shapes_emoji_dist_browser_EmojiDrawer_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./EmojiDrawer.js */ \"../../shapes/emoji/dist/browser/EmojiDrawer.js\"));\n  await engine.addShape(_Constants_js__WEBPACK_IMPORTED_MODULE_0__.validTypes, new EmojiDrawer(), refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/emoji/dist/browser/index.js?");

/***/ })

}]);