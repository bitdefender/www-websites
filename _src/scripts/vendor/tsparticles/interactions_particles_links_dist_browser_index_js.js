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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_particles_links_dist_browser_index_js"],{

/***/ "../../interactions/particles/links/dist/browser/Options/Classes/Links.js":
/*!********************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Classes/Links.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Links: () => (/* binding */ Links)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _LinksShadow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LinksShadow.js */ \"../../interactions/particles/links/dist/browser/Options/Classes/LinksShadow.js\");\n/* harmony import */ var _LinksTriangle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LinksTriangle.js */ \"../../interactions/particles/links/dist/browser/Options/Classes/LinksTriangle.js\");\n\n\n\nclass Links {\n  constructor() {\n    this.blink = false;\n    this.color = new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor();\n    this.color.value = \"#fff\";\n    this.consent = false;\n    this.distance = 100;\n    this.enable = false;\n    this.frequency = 1;\n    this.opacity = 1;\n    this.shadow = new _LinksShadow_js__WEBPACK_IMPORTED_MODULE_1__.LinksShadow();\n    this.triangles = new _LinksTriangle_js__WEBPACK_IMPORTED_MODULE_2__.LinksTriangle();\n    this.width = 1;\n    this.warp = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.id !== undefined) {\n      this.id = data.id;\n    }\n    if (data.blink !== undefined) {\n      this.blink = data.blink;\n    }\n    this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    if (data.consent !== undefined) {\n      this.consent = data.consent;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.frequency !== undefined) {\n      this.frequency = data.frequency;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n    this.shadow.load(data.shadow);\n    this.triangles.load(data.triangles);\n    if (data.width !== undefined) {\n      this.width = data.width;\n    }\n    if (data.warp !== undefined) {\n      this.warp = data.warp;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Classes/Links.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/Options/Classes/LinksShadow.js":
/*!**************************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Classes/LinksShadow.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LinksShadow: () => (/* binding */ LinksShadow)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass LinksShadow {\n  constructor() {\n    this.blur = 5;\n    this.color = new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor();\n    this.color.value = \"#000\";\n    this.enable = false;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.blur !== undefined) {\n      this.blur = data.blur;\n    }\n    this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Classes/LinksShadow.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/Options/Classes/LinksTriangle.js":
/*!****************************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Classes/LinksTriangle.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LinksTriangle: () => (/* binding */ LinksTriangle)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass LinksTriangle {\n  constructor() {\n    this.enable = false;\n    this.frequency = 1;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.color !== undefined) {\n      this.color = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.OptionsColor.create(this.color, data.color);\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.frequency !== undefined) {\n      this.frequency = data.frequency;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Classes/LinksTriangle.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/Options/Interfaces/ILinks.js":
/*!************************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Interfaces/ILinks.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Interfaces/ILinks.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksShadow.js":
/*!******************************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksShadow.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksShadow.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksTriangle.js":
/*!********************************************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksTriangle.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksTriangle.js?");

/***/ }),

/***/ "../../interactions/particles/links/dist/browser/index.js":
/*!****************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Links: () => (/* reexport safe */ _Options_Classes_Links_js__WEBPACK_IMPORTED_MODULE_0__.Links),\n/* harmony export */   LinksShadow: () => (/* reexport safe */ _Options_Classes_LinksShadow_js__WEBPACK_IMPORTED_MODULE_1__.LinksShadow),\n/* harmony export */   LinksTriangle: () => (/* reexport safe */ _Options_Classes_LinksTriangle_js__WEBPACK_IMPORTED_MODULE_2__.LinksTriangle),\n/* harmony export */   loadParticlesLinksInteraction: () => (/* binding */ loadParticlesLinksInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Links_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Links.js */ \"../../interactions/particles/links/dist/browser/Options/Classes/Links.js\");\n/* harmony import */ var _Options_Classes_LinksShadow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/LinksShadow.js */ \"../../interactions/particles/links/dist/browser/Options/Classes/LinksShadow.js\");\n/* harmony import */ var _Options_Classes_LinksTriangle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Options/Classes/LinksTriangle.js */ \"../../interactions/particles/links/dist/browser/Options/Classes/LinksTriangle.js\");\n/* harmony import */ var _Options_Interfaces_ILinks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options/Interfaces/ILinks.js */ \"../../interactions/particles/links/dist/browser/Options/Interfaces/ILinks.js\");\n/* harmony import */ var _Options_Interfaces_ILinksShadow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options/Interfaces/ILinksShadow.js */ \"../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksShadow.js\");\n/* harmony import */ var _Options_Interfaces_ILinksTriangle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Options/Interfaces/ILinksTriangle.js */ \"../../interactions/particles/links/dist/browser/Options/Interfaces/ILinksTriangle.js\");\nasync function loadParticlesLinksInteraction(engine, refresh = true) {\n  const {\n      loadLinksInteraction\n    } = await __webpack_require__.e(/*! import() */ \"interactions_particles_links_dist_browser_interaction_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./interaction.js */ \"../../interactions/particles/links/dist/browser/interaction.js\")),\n    {\n      loadLinksPlugin\n    } = await __webpack_require__.e(/*! import() */ \"interactions_particles_links_dist_browser_plugin_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./plugin.js */ \"../../interactions/particles/links/dist/browser/plugin.js\"));\n  await loadLinksInteraction(engine, refresh);\n  await loadLinksPlugin(engine, refresh);\n}\n\n\n\n\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/index.js?");

/***/ })

}]);