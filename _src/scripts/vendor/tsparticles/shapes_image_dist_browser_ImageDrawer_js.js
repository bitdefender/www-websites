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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_image_dist_browser_ImageDrawer_js"],{

/***/ "../../shapes/image/dist/browser/ImageDrawer.js":
/*!******************************************************!*\
  !*** ../../shapes/image/dist/browser/ImageDrawer.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ImageDrawer: () => (/* binding */ ImageDrawer)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/image/dist/browser/Utils.js\");\n/* harmony import */ var _GifUtils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GifUtils/Utils.js */ \"../../shapes/image/dist/browser/GifUtils/Utils.js\");\n\n\n\nconst double = 2,\n  defaultAlpha = 1,\n  sides = 12,\n  defaultRatio = 1;\nclass ImageDrawer {\n  constructor(engine) {\n    this.loadImageShape = async imageShape => {\n      if (!this._engine.loadImage) {\n        throw new Error(`${_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.errorPrefix} image shape not initialized`);\n      }\n      await this._engine.loadImage({\n        gif: imageShape.gif,\n        name: imageShape.name,\n        replaceColor: imageShape.replaceColor ?? false,\n        src: imageShape.src\n      });\n    };\n    this._engine = engine;\n  }\n  addImage(image) {\n    if (!this._engine.images) {\n      this._engine.images = [];\n    }\n    this._engine.images.push(image);\n  }\n  draw(data) {\n    const {\n        context,\n        radius,\n        particle,\n        opacity\n      } = data,\n      image = particle.image,\n      element = image?.element;\n    if (!image) {\n      return;\n    }\n    context.globalAlpha = opacity;\n    if (image.gif && image.gifData) {\n      (0,_GifUtils_Utils_js__WEBPACK_IMPORTED_MODULE_2__.drawGif)(data);\n    } else if (element) {\n      const ratio = image.ratio,\n        pos = {\n          x: -radius,\n          y: -radius\n        },\n        diameter = radius * double;\n      context.drawImage(element, pos.x, pos.y, diameter, diameter / ratio);\n    }\n    context.globalAlpha = defaultAlpha;\n  }\n  getSidesCount() {\n    return sides;\n  }\n  async init(container) {\n    const options = container.actualOptions;\n    if (!options.preload || !this._engine.loadImage) {\n      return;\n    }\n    for (const imageData of options.preload) {\n      await this._engine.loadImage(imageData);\n    }\n  }\n  loadShape(particle) {\n    if (particle.shape !== \"image\" && particle.shape !== \"images\") {\n      return;\n    }\n    if (!this._engine.images) {\n      this._engine.images = [];\n    }\n    const imageData = particle.shapeData;\n    if (!imageData) {\n      return;\n    }\n    const image = this._engine.images.find(t => t.name === imageData.name || t.source === imageData.src);\n    if (!image) {\n      void this.loadImageShape(imageData).then(() => {\n        this.loadShape(particle);\n      });\n    }\n  }\n  particleInit(container, particle) {\n    if (particle.shape !== \"image\" && particle.shape !== \"images\") {\n      return;\n    }\n    if (!this._engine.images) {\n      this._engine.images = [];\n    }\n    const images = this._engine.images,\n      imageData = particle.shapeData;\n    if (!imageData) {\n      return;\n    }\n    const color = particle.getFillColor(),\n      image = images.find(t => t.name === imageData.name || t.source === imageData.src);\n    if (!image) {\n      return;\n    }\n    const replaceColor = imageData.replaceColor ?? image.replaceColor;\n    if (image.loading) {\n      setTimeout(() => {\n        this.particleInit(container, particle);\n      });\n      return;\n    }\n    void (async () => {\n      let imageRes;\n      if (image.svgData && color) {\n        imageRes = await (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.replaceImageColor)(image, imageData, color, particle);\n      } else {\n        imageRes = {\n          color,\n          data: image,\n          element: image.element,\n          gif: image.gif,\n          gifData: image.gifData,\n          gifLoopCount: image.gifLoopCount,\n          loaded: true,\n          ratio: imageData.width && imageData.height ? imageData.width / imageData.height : image.ratio ?? defaultRatio,\n          replaceColor: replaceColor,\n          source: imageData.src\n        };\n      }\n      if (!imageRes.ratio) {\n        imageRes.ratio = 1;\n      }\n      const fill = imageData.fill ?? particle.shapeFill,\n        close = imageData.close ?? particle.shapeClose,\n        imageShape = {\n          image: imageRes,\n          fill,\n          close\n        };\n      particle.image = imageShape.image;\n      particle.shapeFill = imageShape.fill;\n      particle.shapeClose = imageShape.close;\n    })();\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/image/dist/browser/ImageDrawer.js?");

/***/ })

}]);