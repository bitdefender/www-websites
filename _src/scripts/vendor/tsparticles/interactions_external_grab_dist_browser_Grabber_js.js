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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_grab_dist_browser_Grabber_js"],{

/***/ "../../interactions/external/grab/dist/browser/Grabber.js":
/*!****************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Grabber.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Grabber: () => (/* binding */ Grabber)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Grab_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Grab.js */ \"../../interactions/external/grab/dist/browser/Options/Classes/Grab.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"../../interactions/external/grab/dist/browser/Utils.js\");\n\n\n\nconst grabMode = \"grab\",\n  minDistance = 0,\n  minOpacity = 0;\nclass Grabber extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(container) {\n    super(container);\n  }\n  clear() {}\n  init() {\n    const container = this.container,\n      grab = container.actualOptions.interactivity.modes.grab;\n    if (!grab) {\n      return;\n    }\n    container.retina.grabModeDistance = grab.distance * container.retina.pixelRatio;\n  }\n  interact() {\n    const container = this.container,\n      options = container.actualOptions,\n      interactivity = options.interactivity;\n    if (!interactivity.modes.grab || !interactivity.events.onHover.enable || container.interactivity.status !== _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.mouseMoveEvent) {\n      return;\n    }\n    const mousePos = container.interactivity.mouse.position;\n    if (!mousePos) {\n      return;\n    }\n    const distance = container.retina.grabModeDistance;\n    if (!distance || distance < minDistance) {\n      return;\n    }\n    const query = container.particles.quadTree.queryCircle(mousePos, distance, p => this.isEnabled(p));\n    for (const particle of query) {\n      const pos = particle.getPosition(),\n        pointDistance = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistance)(pos, mousePos);\n      if (pointDistance > distance) {\n        continue;\n      }\n      const grabLineOptions = interactivity.modes.grab.links,\n        lineOpacity = grabLineOptions.opacity,\n        opacityLine = lineOpacity - pointDistance * lineOpacity / distance;\n      if (opacityLine <= minOpacity) {\n        continue;\n      }\n      const optColor = grabLineOptions.color ?? particle.options.links?.color;\n      if (!container.particles.grabLineColor && optColor) {\n        const linksOptions = interactivity.modes.grab.links;\n        container.particles.grabLineColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getLinkRandomColor)(optColor, linksOptions.blink, linksOptions.consent);\n      }\n      const colorLine = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getLinkColor)(particle, undefined, container.particles.grabLineColor);\n      if (!colorLine) {\n        continue;\n      }\n      (0,_Utils_js__WEBPACK_IMPORTED_MODULE_2__.drawGrab)(container, particle, colorLine, opacityLine, mousePos);\n    }\n  }\n  isEnabled(particle) {\n    const container = this.container,\n      mouse = container.interactivity.mouse,\n      events = (particle?.interactivity ?? container.actualOptions.interactivity).events;\n    return events.onHover.enable && !!mouse.position && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(grabMode, events.onHover.mode);\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.grab) {\n      options.grab = new _Options_Classes_Grab_js__WEBPACK_IMPORTED_MODULE_1__.Grab();\n    }\n    for (const source of sources) {\n      options.grab.load(source?.grab);\n    }\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Grabber.js?");

/***/ }),

/***/ "../../interactions/external/grab/dist/browser/Utils.js":
/*!**************************************************************!*\
  !*** ../../interactions/external/grab/dist/browser/Utils.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawGrab: () => (/* binding */ drawGrab),\n/* harmony export */   drawGrabLine: () => (/* binding */ drawGrabLine)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst defaultWidth = 0;\nfunction drawGrabLine(context, width, begin, end, colorLine, opacity) {\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.drawLine)(context, begin, end);\n  context.strokeStyle = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getStyleFromRgb)(colorLine, opacity);\n  context.lineWidth = width;\n  context.stroke();\n}\nfunction drawGrab(container, particle, lineColor, opacity, mousePos) {\n  container.canvas.draw(ctx => {\n    const beginPos = particle.getPosition();\n    drawGrabLine(ctx, particle.retina.linksWidth ?? defaultWidth, beginPos, mousePos, lineColor, opacity);\n  });\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/grab/dist/browser/Utils.js?");

/***/ })

}]);