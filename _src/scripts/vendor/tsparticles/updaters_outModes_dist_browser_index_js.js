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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_outModes_dist_browser_index_js"],{

/***/ "../../updaters/outModes/dist/browser/index.js":
/*!*****************************************************!*\
  !*** ../../updaters/outModes/dist/browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadOutModesUpdater: () => (/* binding */ loadOutModesUpdater)\n/* harmony export */ });\nasync function loadOutModesUpdater(engine, refresh = true) {\n  await engine.addParticleUpdater(\"outModes\", async container => {\n    const {\n      OutOfCanvasUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_outModes_dist_browser_OutOfCanvasUpdater_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./OutOfCanvasUpdater.js */ \"../../updaters/outModes/dist/browser/OutOfCanvasUpdater.js\"));\n    return new OutOfCanvasUpdater(container);\n  }, refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/outModes/dist/browser/index.js?");

/***/ })

}]);