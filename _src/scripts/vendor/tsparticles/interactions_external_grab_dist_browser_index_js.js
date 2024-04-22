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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_grab_dist_browser_index_js"],{

/***/ "../../interactions/external/grab/dist/browser/Options/Classes/Grab.js":
/*!*****************************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Options/Classes/Grab.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Grab: () => (/* binding */ Grab)\n/* harmony export */ });\n/* harmony import */ var _GrabLinks_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GrabLinks.js */ \"../../interactions/external/grab/dist/browser/Options/Classes/GrabLinks.js\");\n\nclass Grab {\n  constructor() {\n    this.distance = 100;\n    this.links = new _GrabLinks_js__WEBPACK_IMPORTED_MODULE_0__.GrabLinks();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    this.links.load(data.links);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Options/Classes/Grab.js?");

/***/ }),

/***/ "../../interactions/external/grab/dist/browser/Options/Classes/GrabLinks.js":
/*!**********************************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Options/Classes/GrabLinks.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GrabLinks: () => (/* binding */ GrabLinks)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass GrabLinks {\n  constructor() {\n    this.blink = false;\n    this.consent = false;\n    this.opacity = 1;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.blink !== undefined) {\n      this.blink = data.blink;\n    }\n    if (data.color !== undefined) {\n      this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    }\n    if (data.consent !== undefined) {\n      this.consent = data.consent;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Options/Classes/GrabLinks.js?");

/***/ }),

/***/ "../../interactions/external/grab/dist/browser/Options/Interfaces/IGrab.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Options/Interfaces/IGrab.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Options/Interfaces/IGrab.js?");

/***/ }),

/***/ "../../interactions/external/grab/dist/browser/Options/Interfaces/IGrabLinks.js":
/*!**************************************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Options/Interfaces/IGrabLinks.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Options/Interfaces/IGrabLinks.js?");

/***/ }),

/***/ "../../interactions/external/grab/dist/browser/index.js":
/*!**************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Grab: () => (/* reexport safe */ _Options_Classes_Grab_js__WEBPACK_IMPORTED_MODULE_0__.Grab),\n/* harmony export */   GrabLinks: () => (/* reexport safe */ _Options_Classes_GrabLinks_js__WEBPACK_IMPORTED_MODULE_1__.GrabLinks),\n/* harmony export */   loadExternalGrabInteraction: () => (/* binding */ loadExternalGrabInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Grab_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Grab.js */ \"../../interactions/external/grab/dist/browser/Options/Classes/Grab.js\");\n/* harmony import */ var _Options_Classes_GrabLinks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/GrabLinks.js */ \"../../interactions/external/grab/dist/browser/Options/Classes/GrabLinks.js\");\n/* harmony import */ var _Options_Interfaces_IGrab_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Options/Interfaces/IGrab.js */ \"../../interactions/external/grab/dist/browser/Options/Interfaces/IGrab.js\");\n/* harmony import */ var _Options_Interfaces_IGrabLinks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options/Interfaces/IGrabLinks.js */ \"../../interactions/external/grab/dist/browser/Options/Interfaces/IGrabLinks.js\");\nasync function loadExternalGrabInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalGrab\", async container => {\n    const {\n      Grabber\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_grab_dist_browser_Grabber_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Grabber.js */ \"../../interactions/external/grab/dist/browser/Grabber.js\"));\n    return new Grabber(container);\n  }, refresh);\n}\n\n\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/index.js?");

/***/ })

}]);