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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["move_parallax_dist_browser_ParallaxMover_js"],{

/***/ "../../move/parallax/dist/browser/ParallaxMover.js":
/*!*********************************************************!*\
  !*** ../../move/parallax/dist/browser/ParallaxMover.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ParallaxMover: () => (/* binding */ ParallaxMover)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst half = 0.5;\nclass ParallaxMover {\n  init() {}\n  isEnabled(particle) {\n    return !(0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isSsr)() && !particle.destroyed && particle.container.actualOptions.interactivity.events.onHover.parallax.enable;\n  }\n  move(particle) {\n    const container = particle.container,\n      options = container.actualOptions,\n      parallaxOptions = options.interactivity.events.onHover.parallax;\n    if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isSsr)() || !parallaxOptions.enable) {\n      return;\n    }\n    const parallaxForce = parallaxOptions.force,\n      mousePos = container.interactivity.mouse.position;\n    if (!mousePos) {\n      return;\n    }\n    const canvasSize = container.canvas.size,\n      canvasCenter = {\n        x: canvasSize.width * half,\n        y: canvasSize.height * half\n      },\n      parallaxSmooth = parallaxOptions.smooth,\n      factor = particle.getRadius() / parallaxForce,\n      centerDistance = {\n        x: (mousePos.x - canvasCenter.x) * factor,\n        y: (mousePos.y - canvasCenter.y) * factor\n      },\n      {\n        offset\n      } = particle;\n    offset.x += (centerDistance.x - offset.x) / parallaxSmooth;\n    offset.y += (centerDistance.y - offset.y) / parallaxSmooth;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../move/parallax/dist/browser/ParallaxMover.js?");

/***/ })

}]);