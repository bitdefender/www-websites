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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_attract_dist_browser_index_js"],{

/***/ "../../interactions/external/attract/dist/browser/Options/Classes/Attract.js":
/*!***********************************************************************************!*\
  !*** ../../interactions/external/attract/dist/browser/Options/Classes/Attract.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Attract: () => (/* binding */ Attract)\n/* harmony export */ });\nclass Attract {\n  constructor() {\n    this.distance = 200;\n    this.duration = 0.4;\n    this.easing = \"ease-out-quad\";\n    this.factor = 1;\n    this.maxSpeed = 50;\n    this.speed = 1;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    if (data.duration !== undefined) {\n      this.duration = data.duration;\n    }\n    if (data.easing !== undefined) {\n      this.easing = data.easing;\n    }\n    if (data.factor !== undefined) {\n      this.factor = data.factor;\n    }\n    if (data.maxSpeed !== undefined) {\n      this.maxSpeed = data.maxSpeed;\n    }\n    if (data.speed !== undefined) {\n      this.speed = data.speed;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/attract/dist/browser/Options/Classes/Attract.js?");

/***/ }),

/***/ "../../interactions/external/attract/dist/browser/Options/Interfaces/IAttract.js":
/*!***************************************************************************************!*\
  !*** ../../interactions/external/attract/dist/browser/Options/Interfaces/IAttract.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/attract/dist/browser/Options/Interfaces/IAttract.js?");

/***/ }),

/***/ "../../interactions/external/attract/dist/browser/index.js":
/*!*****************************************************************!*\
  !*** ../../interactions/external/attract/dist/browser/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Attract: () => (/* reexport safe */ _Options_Classes_Attract_js__WEBPACK_IMPORTED_MODULE_0__.Attract),\n/* harmony export */   loadExternalAttractInteraction: () => (/* binding */ loadExternalAttractInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Attract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Attract.js */ \"../../interactions/external/attract/dist/browser/Options/Classes/Attract.js\");\n/* harmony import */ var _Options_Interfaces_IAttract_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Interfaces/IAttract.js */ \"../../interactions/external/attract/dist/browser/Options/Interfaces/IAttract.js\");\nasync function loadExternalAttractInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalAttract\", async container => {\n    const {\n      Attractor\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_attract_dist_browser_Attractor_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Attractor.js */ \"../../interactions/external/attract/dist/browser/Attractor.js\"));\n    return new Attractor(engine, container);\n  }, refresh);\n}\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/attract/dist/browser/index.js?");

/***/ })

}]);