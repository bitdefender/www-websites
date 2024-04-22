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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_size_dist_browser_SizeUpdater_js"],{

/***/ "../../updaters/size/dist/browser/SizeUpdater.js":
/*!*******************************************************!*\
  !*** ../../updaters/size/dist/browser/SizeUpdater.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SizeUpdater: () => (/* binding */ SizeUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst minLoops = 0;\nclass SizeUpdater {\n  init(particle) {\n    const container = particle.container,\n      sizeOptions = particle.options.size,\n      sizeAnimation = sizeOptions.animation;\n    if (sizeAnimation.enable) {\n      particle.size.velocity = (particle.retina.sizeAnimationSpeed ?? container.retina.sizeAnimationSpeed) / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator * container.retina.reduceFactor;\n      if (!sizeAnimation.sync) {\n        particle.size.velocity *= (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)();\n      }\n    }\n  }\n  isEnabled(particle) {\n    return !particle.destroyed && !particle.spawning && particle.size.enable && ((particle.size.maxLoops ?? minLoops) <= minLoops || (particle.size.maxLoops ?? minLoops) > minLoops && (particle.size.loops ?? minLoops) < (particle.size.maxLoops ?? minLoops));\n  }\n  reset(particle) {\n    particle.size.loops = minLoops;\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.updateAnimation)(particle, particle.size, true, particle.options.size.animation.destroy, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/size/dist/browser/SizeUpdater.js?");

/***/ })

}]);