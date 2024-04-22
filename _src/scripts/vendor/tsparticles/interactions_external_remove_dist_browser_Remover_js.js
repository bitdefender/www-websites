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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_remove_dist_browser_Remover_js"],{

/***/ "../../interactions/external/remove/dist/browser/Remover.js":
/*!******************************************************************!*\
  !*** ../../interactions/external/remove/dist/browser/Remover.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Remover: () => (/* binding */ Remover)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Remove_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Remove.js */ \"../../interactions/external/remove/dist/browser/Options/Classes/Remove.js\");\n\n\nconst removeMode = \"remove\";\nclass Remover extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(container) {\n    super(container);\n    this.handleClickMode = mode => {\n      const container = this.container,\n        options = container.actualOptions;\n      if (!options.interactivity.modes.remove || mode !== removeMode) {\n        return;\n      }\n      const removeNb = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(options.interactivity.modes.remove.quantity);\n      container.particles.removeQuantity(removeNb);\n    };\n  }\n  clear() {}\n  init() {}\n  interact() {}\n  isEnabled() {\n    return true;\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.remove) {\n      options.remove = new _Options_Classes_Remove_js__WEBPACK_IMPORTED_MODULE_1__.Remove();\n    }\n    for (const source of sources) {\n      options.remove.load(source?.remove);\n    }\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/remove/dist/browser/Remover.js?");

/***/ })

}]);