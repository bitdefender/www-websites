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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_image_dist_browser_ImagePreloader_js"],{

/***/ "../../shapes/image/dist/browser/ImagePreloader.js":
/*!*********************************************************!*\
  !*** ../../shapes/image/dist/browser/ImagePreloader.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ImagePreloaderPlugin: () => (/* binding */ ImagePreloaderPlugin)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Preload_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Preload.js */ \"../../shapes/image/dist/browser/Options/Classes/Preload.js\");\n\nclass ImagePreloaderPlugin {\n  constructor(engine) {\n    this.id = \"imagePreloader\";\n    this._engine = engine;\n  }\n  async getPlugin() {\n    await Promise.resolve();\n    return {};\n  }\n  loadOptions(options, source) {\n    if (!source?.preload) {\n      return;\n    }\n    if (!options.preload) {\n      options.preload = [];\n    }\n    const preloadOptions = options.preload;\n    for (const item of source.preload) {\n      const existing = preloadOptions.find(t => t.name === item.name || t.src === item.src);\n      if (existing) {\n        existing.load(item);\n      } else {\n        const preload = new _Options_Classes_Preload_js__WEBPACK_IMPORTED_MODULE_0__.Preload();\n        preload.load(item);\n        preloadOptions.push(preload);\n      }\n    }\n  }\n  needsPlugin() {\n    return true;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/image/dist/browser/ImagePreloader.js?");

/***/ }),

/***/ "../../shapes/image/dist/browser/Options/Classes/Preload.js":
/*!******************************************************************!*\
  !*** ../../shapes/image/dist/browser/Options/Classes/Preload.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Preload: () => (/* binding */ Preload)\n/* harmony export */ });\nclass Preload {\n  constructor() {\n    this.src = \"\";\n    this.gif = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.gif !== undefined) {\n      this.gif = data.gif;\n    }\n    if (data.height !== undefined) {\n      this.height = data.height;\n    }\n    if (data.name !== undefined) {\n      this.name = data.name;\n    }\n    if (data.replaceColor !== undefined) {\n      this.replaceColor = data.replaceColor;\n    }\n    if (data.src !== undefined) {\n      this.src = data.src;\n    }\n    if (data.width !== undefined) {\n      this.width = data.width;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/image/dist/browser/Options/Classes/Preload.js?");

/***/ })

}]);