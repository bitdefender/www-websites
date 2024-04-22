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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_bubble_dist_browser_index_js"],{

/***/ "../../interactions/external/bubble/dist/browser/Options/Classes/Bubble.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Classes/Bubble.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Bubble: () => (/* binding */ Bubble)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _BubbleBase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BubbleBase.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js\");\n/* harmony import */ var _BubbleDiv_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BubbleDiv.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/BubbleDiv.js\");\n\n\n\nclass Bubble extends _BubbleBase_js__WEBPACK_IMPORTED_MODULE_1__.BubbleBase {\n  load(data) {\n    super.load(data);\n    if (!data) {\n      return;\n    }\n    this.divs = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(data.divs, div => {\n      const tmp = new _BubbleDiv_js__WEBPACK_IMPORTED_MODULE_2__.BubbleDiv();\n      tmp.load(div);\n      return tmp;\n    });\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Classes/Bubble.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js":
/*!*************************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BubbleBase: () => (/* binding */ BubbleBase)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass BubbleBase {\n  constructor() {\n    this.distance = 200;\n    this.duration = 0.4;\n    this.mix = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    if (data.duration !== undefined) {\n      this.duration = data.duration;\n    }\n    if (data.mix !== undefined) {\n      this.mix = data.mix;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n    if (data.color !== undefined) {\n      const sourceColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isArray)(this.color) ? undefined : this.color;\n      this.color = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(data.color, color => {\n        return _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(sourceColor, color);\n      });\n    }\n    if (data.size !== undefined) {\n      this.size = data.size;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/Options/Classes/BubbleDiv.js":
/*!************************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Classes/BubbleDiv.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BubbleDiv: () => (/* binding */ BubbleDiv)\n/* harmony export */ });\n/* harmony import */ var _BubbleBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BubbleBase.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js\");\n\nclass BubbleDiv extends _BubbleBase_js__WEBPACK_IMPORTED_MODULE_0__.BubbleBase {\n  constructor() {\n    super();\n    this.selectors = [];\n  }\n  load(data) {\n    super.load(data);\n    if (!data) {\n      return;\n    }\n    if (data.selectors !== undefined) {\n      this.selectors = data.selectors;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Classes/BubbleDiv.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubble.js":
/*!*************************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubble.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubble.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleBase.js":
/*!*****************************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleBase.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleBase.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleDiv.js":
/*!****************************************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleDiv.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleDiv.js?");

/***/ }),

/***/ "../../interactions/external/bubble/dist/browser/index.js":
/*!****************************************************************!*\
  !*** ../../interactions/external/bubble/dist/browser/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Bubble: () => (/* reexport safe */ _Options_Classes_Bubble_js__WEBPACK_IMPORTED_MODULE_2__.Bubble),\n/* harmony export */   BubbleBase: () => (/* reexport safe */ _Options_Classes_BubbleBase_js__WEBPACK_IMPORTED_MODULE_0__.BubbleBase),\n/* harmony export */   BubbleDiv: () => (/* reexport safe */ _Options_Classes_BubbleDiv_js__WEBPACK_IMPORTED_MODULE_1__.BubbleDiv),\n/* harmony export */   loadExternalBubbleInteraction: () => (/* binding */ loadExternalBubbleInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_BubbleBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/BubbleBase.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/BubbleBase.js\");\n/* harmony import */ var _Options_Classes_BubbleDiv_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/BubbleDiv.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/BubbleDiv.js\");\n/* harmony import */ var _Options_Classes_Bubble_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Options/Classes/Bubble.js */ \"../../interactions/external/bubble/dist/browser/Options/Classes/Bubble.js\");\n/* harmony import */ var _Options_Interfaces_IBubbleBase_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options/Interfaces/IBubbleBase.js */ \"../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleBase.js\");\n/* harmony import */ var _Options_Interfaces_IBubbleDiv_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options/Interfaces/IBubbleDiv.js */ \"../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubbleDiv.js\");\n/* harmony import */ var _Options_Interfaces_IBubble_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Options/Interfaces/IBubble.js */ \"../../interactions/external/bubble/dist/browser/Options/Interfaces/IBubble.js\");\nasync function loadExternalBubbleInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalBubble\", async container => {\n    const {\n      Bubbler\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_bubble_dist_browser_Bubbler_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Bubbler.js */ \"../../interactions/external/bubble/dist/browser/Bubbler.js\"));\n    return new Bubbler(container);\n  }, refresh);\n}\n\n\n\n\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bubble/dist/browser/index.js?");

/***/ })

}]);