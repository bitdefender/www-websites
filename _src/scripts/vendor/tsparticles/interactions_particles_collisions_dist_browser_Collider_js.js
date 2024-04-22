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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_particles_collisions_dist_browser_Collider_js"],{

/***/ "../../interactions/particles/collisions/dist/browser/Absorb.js":
/*!**********************************************************************!*\
  !*** ../../interactions/particles/collisions/dist/browser/Absorb.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   absorb: () => (/* binding */ absorb)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst half = 0.5,\n  absorbFactor = 10,\n  minAbsorbFactor = 0;\nfunction updateAbsorb(p1, r1, p2, r2, delta, pixelRatio) {\n  const factor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.clamp)(p1.options.collisions.absorb.speed * delta.factor / absorbFactor, minAbsorbFactor, r2);\n  p1.size.value += factor * half;\n  p2.size.value -= factor;\n  if (r2 <= pixelRatio) {\n    p2.size.value = 0;\n    p2.destroy();\n  }\n}\nfunction absorb(p1, p2, delta, pixelRatio) {\n  const r1 = p1.getRadius(),\n    r2 = p2.getRadius();\n  if (r1 === undefined && r2 !== undefined) {\n    p1.destroy();\n  } else if (r1 !== undefined && r2 === undefined) {\n    p2.destroy();\n  } else if (r1 !== undefined && r2 !== undefined) {\n    if (r1 >= r2) {\n      updateAbsorb(p1, r1, p2, r2, delta, pixelRatio);\n    } else {\n      updateAbsorb(p2, r2, p1, r1, delta, pixelRatio);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/collisions/dist/browser/Absorb.js?");

/***/ }),

/***/ "../../interactions/particles/collisions/dist/browser/Bounce.js":
/*!**********************************************************************!*\
  !*** ../../interactions/particles/collisions/dist/browser/Bounce.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   bounce: () => (/* binding */ bounce)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst fixBounceSpeed = p => {\n  if (p.collisionMaxSpeed === undefined) {\n    p.collisionMaxSpeed = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(p.options.collisions.maxSpeed);\n  }\n  if (p.velocity.length > p.collisionMaxSpeed) {\n    p.velocity.length = p.collisionMaxSpeed;\n  }\n};\nfunction bounce(p1, p2) {\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.circleBounce)((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.circleBounceDataFromParticle)(p1), (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.circleBounceDataFromParticle)(p2));\n  fixBounceSpeed(p1);\n  fixBounceSpeed(p2);\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/collisions/dist/browser/Bounce.js?");

/***/ }),

/***/ "../../interactions/particles/collisions/dist/browser/Collider.js":
/*!************************************************************************!*\
  !*** ../../interactions/particles/collisions/dist/browser/Collider.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Collider: () => (/* binding */ Collider)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _ResolveCollision_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResolveCollision.js */ \"../../interactions/particles/collisions/dist/browser/ResolveCollision.js\");\n\n\nconst double = 2;\nclass Collider extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ParticlesInteractorBase {\n  constructor(container) {\n    super(container);\n  }\n  clear() {}\n  init() {}\n  interact(p1, delta) {\n    if (p1.destroyed || p1.spawning) {\n      return;\n    }\n    const container = this.container,\n      pos1 = p1.getPosition(),\n      radius1 = p1.getRadius(),\n      query = container.particles.quadTree.queryCircle(pos1, radius1 * double);\n    for (const p2 of query) {\n      if (p1 === p2 || !p2.options.collisions.enable || p1.options.collisions.mode !== p2.options.collisions.mode || p2.destroyed || p2.spawning) {\n        continue;\n      }\n      const pos2 = p2.getPosition(),\n        radius2 = p2.getRadius();\n      if (Math.abs(Math.round(pos1.z) - Math.round(pos2.z)) > radius1 + radius2) {\n        continue;\n      }\n      const dist = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistance)(pos1, pos2),\n        distP = radius1 + radius2;\n      if (dist > distP) {\n        continue;\n      }\n      (0,_ResolveCollision_js__WEBPACK_IMPORTED_MODULE_1__.resolveCollision)(p1, p2, delta, container.retina.pixelRatio);\n    }\n  }\n  isEnabled(particle) {\n    return particle.options.collisions.enable;\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/collisions/dist/browser/Collider.js?");

/***/ }),

/***/ "../../interactions/particles/collisions/dist/browser/Destroy.js":
/*!***********************************************************************!*\
  !*** ../../interactions/particles/collisions/dist/browser/Destroy.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   destroy: () => (/* binding */ destroy)\n/* harmony export */ });\n/* harmony import */ var _Bounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bounce.js */ \"../../interactions/particles/collisions/dist/browser/Bounce.js\");\n\nfunction destroy(p1, p2) {\n  if (!p1.unbreakable && !p2.unbreakable) {\n    (0,_Bounce_js__WEBPACK_IMPORTED_MODULE_0__.bounce)(p1, p2);\n  }\n  if (p1.getRadius() === undefined && p2.getRadius() !== undefined) {\n    p1.destroy();\n  } else if (p1.getRadius() !== undefined && p2.getRadius() === undefined) {\n    p2.destroy();\n  } else if (p1.getRadius() !== undefined && p2.getRadius() !== undefined) {\n    const deleteP = p1.getRadius() >= p2.getRadius() ? p2 : p1;\n    deleteP.destroy();\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/collisions/dist/browser/Destroy.js?");

/***/ }),

/***/ "../../interactions/particles/collisions/dist/browser/ResolveCollision.js":
/*!********************************************************************************!*\
  !*** ../../interactions/particles/collisions/dist/browser/ResolveCollision.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   resolveCollision: () => (/* binding */ resolveCollision)\n/* harmony export */ });\n/* harmony import */ var _Absorb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Absorb.js */ \"../../interactions/particles/collisions/dist/browser/Absorb.js\");\n/* harmony import */ var _Bounce_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bounce.js */ \"../../interactions/particles/collisions/dist/browser/Bounce.js\");\n/* harmony import */ var _Destroy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Destroy.js */ \"../../interactions/particles/collisions/dist/browser/Destroy.js\");\n\n\n\nfunction resolveCollision(p1, p2, delta, pixelRatio) {\n  switch (p1.options.collisions.mode) {\n    case \"absorb\":\n      {\n        (0,_Absorb_js__WEBPACK_IMPORTED_MODULE_0__.absorb)(p1, p2, delta, pixelRatio);\n        break;\n      }\n    case \"bounce\":\n      {\n        (0,_Bounce_js__WEBPACK_IMPORTED_MODULE_1__.bounce)(p1, p2);\n        break;\n      }\n    case \"destroy\":\n      {\n        (0,_Destroy_js__WEBPACK_IMPORTED_MODULE_2__.destroy)(p1, p2);\n        break;\n      }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/collisions/dist/browser/ResolveCollision.js?");

/***/ })

}]);