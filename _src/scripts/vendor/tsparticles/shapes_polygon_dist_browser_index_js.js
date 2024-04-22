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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_polygon_dist_browser_index_js"],{

/***/ "../../shapes/polygon/dist/browser/index.js":
/*!**************************************************!*\
  !*** ../../shapes/polygon/dist/browser/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadGenericPolygonShape: () => (/* binding */ loadGenericPolygonShape),\n/* harmony export */   loadPolygonShape: () => (/* binding */ loadPolygonShape),\n/* harmony export */   loadTriangleShape: () => (/* binding */ loadTriangleShape)\n/* harmony export */ });\nasync function loadGenericPolygonShape(engine, refresh = true) {\n  const {\n    PolygonDrawer\n  } = await __webpack_require__.e(/*! import() */ \"shapes_polygon_dist_browser_PolygonDrawer_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./PolygonDrawer.js */ \"../../shapes/polygon/dist/browser/PolygonDrawer.js\"));\n  await engine.addShape(\"polygon\", new PolygonDrawer(), refresh);\n}\nasync function loadTriangleShape(engine, refresh = true) {\n  const {\n    TriangleDrawer\n  } = await __webpack_require__.e(/*! import() */ \"shapes_polygon_dist_browser_TriangleDrawer_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./TriangleDrawer.js */ \"../../shapes/polygon/dist/browser/TriangleDrawer.js\"));\n  await engine.addShape(\"triangle\", new TriangleDrawer(), refresh);\n}\nasync function loadPolygonShape(engine, refresh = true) {\n  await loadGenericPolygonShape(engine, refresh);\n  await loadTriangleShape(engine, refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/polygon/dist/browser/index.js?");

/***/ })

}]);