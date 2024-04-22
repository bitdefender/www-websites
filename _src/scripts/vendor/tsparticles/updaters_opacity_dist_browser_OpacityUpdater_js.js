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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_opacity_dist_browser_OpacityUpdater_js"],{

/***/ "../../updaters/opacity/dist/browser/OpacityUpdater.js":
/*!*************************************************************!*\
  !*** ../../updaters/opacity/dist/browser/OpacityUpdater.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   OpacityUpdater: () => (/* binding */ OpacityUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass OpacityUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const opacityOptions = particle.options.opacity,\n      pxRatio = 1;\n    particle.opacity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.initParticleNumericAnimationValue)(opacityOptions, pxRatio);\n    const opacityAnimation = opacityOptions.animation;\n    if (opacityAnimation.enable) {\n      particle.opacity.velocity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(opacityAnimation.speed) / _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.percentDenominator * this.container.retina.reduceFactor;\n      if (!opacityAnimation.sync) {\n        particle.opacity.velocity *= (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)();\n      }\n    }\n  }\n  isEnabled(particle) {\n    const none = 0;\n    return !particle.destroyed && !particle.spawning && !!particle.opacity && particle.opacity.enable && ((particle.opacity.maxLoops ?? none) <= none || (particle.opacity.maxLoops ?? none) > none && (particle.opacity.loops ?? none) < (particle.opacity.maxLoops ?? none));\n  }\n  reset(particle) {\n    if (particle.opacity) {\n      particle.opacity.time = 0;\n      particle.opacity.loops = 0;\n    }\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle) || !particle.opacity) {\n      return;\n    }\n    (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.updateAnimation)(particle, particle.opacity, true, particle.options.opacity.animation.destroy, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/opacity/dist/browser/OpacityUpdater.js?");

/***/ })

}]);