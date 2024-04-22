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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_emoji_dist_browser_EmojiDrawer_js"],{

/***/ "../../shapes/emoji/dist/browser/EmojiDrawer.js":
/*!******************************************************!*\
  !*** ../../shapes/emoji/dist/browser/EmojiDrawer.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EmojiDrawer: () => (/* binding */ EmojiDrawer)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/emoji/dist/browser/Utils.js\");\n/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Constants.js */ \"../../shapes/emoji/dist/browser/Constants.js\");\n\n\n\nconst defaultFont = '\"Twemoji Mozilla\", Apple Color Emoji, \"Segoe UI Emoji\", \"Noto Color Emoji\", \"EmojiOne Color\"';\nclass EmojiDrawer {\n  constructor() {\n    this._emojiShapeDict = new Map();\n  }\n  destroy() {\n    for (const [key, emojiData] of this._emojiShapeDict) {\n      if (emojiData instanceof ImageBitmap) {\n        emojiData?.close();\n        this._emojiShapeDict.delete(key);\n      }\n    }\n  }\n  draw(data) {\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.drawEmoji)(data);\n  }\n  async init(container) {\n    const options = container.actualOptions;\n    if (!_Constants_js__WEBPACK_IMPORTED_MODULE_2__.validTypes.find(t => (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(t, options.particles.shape.type))) {\n      return;\n    }\n    const promises = [(0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.loadFont)(defaultFont)],\n      shapeOptions = _Constants_js__WEBPACK_IMPORTED_MODULE_2__.validTypes.map(t => options.particles.shape.options[t]).find(t => !!t);\n    if (shapeOptions) {\n      (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(shapeOptions, shape => {\n        if (shape.font) {\n          promises.push((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.loadFont)(shape.font));\n        }\n      });\n    }\n    await Promise.all(promises);\n  }\n  particleDestroy(particle) {\n    delete particle.emojiData;\n  }\n  particleInit(container, particle) {\n    const double = 2,\n      shapeData = particle.shapeData;\n    if (!shapeData?.value) {\n      return;\n    }\n    const emoji = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromSingleOrMultiple)(shapeData.value, particle.randomIndexData),\n      font = shapeData.font ?? defaultFont;\n    if (!emoji) {\n      return;\n    }\n    const key = `${emoji}_${font}`,\n      existingData = this._emojiShapeDict.get(key);\n    if (existingData) {\n      particle.emojiData = existingData;\n      return;\n    }\n    const canvasSize = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeMax)(particle.size.value) * double;\n    let emojiData;\n    const maxSize = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeMax)(particle.size.value);\n    if (typeof OffscreenCanvas !== \"undefined\") {\n      const canvas = new OffscreenCanvas(canvasSize, canvasSize),\n        context = canvas.getContext(\"2d\");\n      if (!context) {\n        return;\n      }\n      context.font = `400 ${maxSize * double}px ${font}`;\n      context.textBaseline = \"middle\";\n      context.textAlign = \"center\";\n      context.fillText(emoji, maxSize, maxSize);\n      emojiData = canvas.transferToImageBitmap();\n    } else {\n      const canvas = document.createElement(\"canvas\");\n      canvas.width = canvasSize;\n      canvas.height = canvasSize;\n      const context = canvas.getContext(\"2d\");\n      if (!context) {\n        return;\n      }\n      context.font = `400 ${maxSize * double}px ${font}`;\n      context.textBaseline = \"middle\";\n      context.textAlign = \"center\";\n      context.fillText(emoji, maxSize, maxSize);\n      emojiData = canvas;\n    }\n    this._emojiShapeDict.set(key, emojiData);\n    particle.emojiData = emojiData;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/emoji/dist/browser/EmojiDrawer.js?");

/***/ }),

/***/ "../../shapes/emoji/dist/browser/Utils.js":
/*!************************************************!*\
  !*** ../../shapes/emoji/dist/browser/Utils.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawEmoji: () => (/* binding */ drawEmoji)\n/* harmony export */ });\nfunction drawEmoji(data) {\n  const {\n      context,\n      particle,\n      radius,\n      opacity\n    } = data,\n    emojiData = particle.emojiData,\n    double = 2,\n    diameter = radius * double,\n    previousAlpha = context.globalAlpha;\n  if (!emojiData) {\n    return;\n  }\n  context.globalAlpha = opacity;\n  context.drawImage(emojiData, -radius, -radius, diameter, diameter);\n  context.globalAlpha = previousAlpha;\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/emoji/dist/browser/Utils.js?");

/***/ })

}]);