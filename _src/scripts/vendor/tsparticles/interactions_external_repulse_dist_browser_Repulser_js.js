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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_repulse_dist_browser_Repulser_js"],{

/***/ "../../interactions/external/repulse/dist/browser/Repulser.js":
/*!********************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Repulser.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Repulser: () => (/* binding */ Repulser)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Repulse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Repulse.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/Repulse.js\");\n\n\nconst repulseMode = \"repulse\",\n  minDistance = 0,\n  repulseRadiusFactor = 6,\n  repulseRadiusPower = 3,\n  squarePower = 2,\n  minRadius = 0,\n  minSpeed = 0,\n  easingOffset = 1,\n  half = 0.5;\nclass Repulser extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(engine, container) {\n    super(container);\n    this._clickRepulse = () => {\n      const container = this.container,\n        repulseOptions = container.actualOptions.interactivity.modes.repulse;\n      if (!repulseOptions) {\n        return;\n      }\n      const repulse = container.repulse ?? {\n        particles: []\n      };\n      if (!repulse.finish) {\n        if (!repulse.count) {\n          repulse.count = 0;\n        }\n        repulse.count++;\n        if (repulse.count === container.particles.count) {\n          repulse.finish = true;\n        }\n      }\n      if (repulse.clicking) {\n        const repulseDistance = container.retina.repulseModeDistance;\n        if (!repulseDistance || repulseDistance < minDistance) {\n          return;\n        }\n        const repulseRadius = Math.pow(repulseDistance / repulseRadiusFactor, repulseRadiusPower),\n          mouseClickPos = container.interactivity.mouse.clickPosition;\n        if (mouseClickPos === undefined) {\n          return;\n        }\n        const range = new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Circle(mouseClickPos.x, mouseClickPos.y, repulseRadius),\n          query = container.particles.quadTree.query(range, p => this.isEnabled(p));\n        for (const particle of query) {\n          const {\n              dx,\n              dy,\n              distance\n            } = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistances)(mouseClickPos, particle.position),\n            d = distance ** squarePower,\n            velocity = repulseOptions.speed,\n            force = -repulseRadius * velocity / d;\n          if (d <= repulseRadius) {\n            repulse.particles.push(particle);\n            const vect = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Vector.create(dx, dy);\n            vect.length = force;\n            particle.velocity.setTo(vect);\n          }\n        }\n      } else if (repulse.clicking === false) {\n        for (const particle of repulse.particles) {\n          particle.velocity.setTo(particle.initialVelocity);\n        }\n        repulse.particles = [];\n      }\n    };\n    this._hoverRepulse = () => {\n      const container = this.container,\n        mousePos = container.interactivity.mouse.position,\n        repulseRadius = container.retina.repulseModeDistance;\n      if (!repulseRadius || repulseRadius < minRadius || !mousePos) {\n        return;\n      }\n      this._processRepulse(mousePos, repulseRadius, new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Circle(mousePos.x, mousePos.y, repulseRadius));\n    };\n    this._processRepulse = (position, repulseRadius, area, divRepulse) => {\n      const container = this.container,\n        query = container.particles.quadTree.query(area, p => this.isEnabled(p)),\n        repulseOptions = container.actualOptions.interactivity.modes.repulse;\n      if (!repulseOptions) {\n        return;\n      }\n      const {\n          easing,\n          speed,\n          factor,\n          maxSpeed\n        } = repulseOptions,\n        easingFunc = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getEasing)(easing),\n        velocity = (divRepulse?.speed ?? speed) * factor;\n      for (const particle of query) {\n        const {\n            dx,\n            dy,\n            distance\n          } = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistances)(particle.position, position),\n          repulseFactor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.clamp)(easingFunc(easingOffset - distance / repulseRadius) * velocity, minSpeed, maxSpeed),\n          normVec = _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Vector.create(!distance ? velocity : dx / distance * repulseFactor, !distance ? velocity : dy / distance * repulseFactor);\n        particle.position.addTo(normVec);\n      }\n    };\n    this._singleSelectorRepulse = (selector, div) => {\n      const container = this.container,\n        repulse = container.actualOptions.interactivity.modes.repulse;\n      if (!repulse) {\n        return;\n      }\n      const query = document.querySelectorAll(selector);\n      if (!query.length) {\n        return;\n      }\n      query.forEach(item => {\n        const elem = item,\n          pxRatio = container.retina.pixelRatio,\n          pos = {\n            x: (elem.offsetLeft + elem.offsetWidth * half) * pxRatio,\n            y: (elem.offsetTop + elem.offsetHeight * half) * pxRatio\n          },\n          repulseRadius = elem.offsetWidth * half * pxRatio,\n          area = div.type === \"circle\" ? new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Circle(pos.x, pos.y, repulseRadius) : new _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.Rectangle(elem.offsetLeft * pxRatio, elem.offsetTop * pxRatio, elem.offsetWidth * pxRatio, elem.offsetHeight * pxRatio),\n          divs = repulse.divs,\n          divRepulse = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.divMode)(divs, elem);\n        this._processRepulse(pos, repulseRadius, area, divRepulse);\n      });\n    };\n    this._engine = engine;\n    if (!container.repulse) {\n      container.repulse = {\n        particles: []\n      };\n    }\n    this.handleClickMode = mode => {\n      const options = this.container.actualOptions,\n        repulseOpts = options.interactivity.modes.repulse;\n      if (!repulseOpts || mode !== repulseMode) {\n        return;\n      }\n      if (!container.repulse) {\n        container.repulse = {\n          particles: []\n        };\n      }\n      const repulse = container.repulse;\n      repulse.clicking = true;\n      repulse.count = 0;\n      for (const particle of container.repulse.particles) {\n        if (!this.isEnabled(particle)) {\n          continue;\n        }\n        particle.velocity.setTo(particle.initialVelocity);\n      }\n      repulse.particles = [];\n      repulse.finish = false;\n      setTimeout(() => {\n        if (container.destroyed) {\n          return;\n        }\n        repulse.clicking = false;\n      }, repulseOpts.duration * _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds);\n    };\n  }\n  clear() {}\n  init() {\n    const container = this.container,\n      repulse = container.actualOptions.interactivity.modes.repulse;\n    if (!repulse) {\n      return;\n    }\n    container.retina.repulseModeDistance = repulse.distance * container.retina.pixelRatio;\n  }\n  interact() {\n    const container = this.container,\n      options = container.actualOptions,\n      mouseMoveStatus = container.interactivity.status === _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.mouseMoveEvent,\n      events = options.interactivity.events,\n      hover = events.onHover,\n      hoverEnabled = hover.enable,\n      hoverMode = hover.mode,\n      click = events.onClick,\n      clickEnabled = click.enable,\n      clickMode = click.mode,\n      divs = events.onDiv;\n    if (mouseMoveStatus && hoverEnabled && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(repulseMode, hoverMode)) {\n      this._hoverRepulse();\n    } else if (clickEnabled && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(repulseMode, clickMode)) {\n      this._clickRepulse();\n    } else {\n      (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.divModeExecute)(repulseMode, divs, (selector, div) => this._singleSelectorRepulse(selector, div));\n    }\n  }\n  isEnabled(particle) {\n    const container = this.container,\n      options = container.actualOptions,\n      mouse = container.interactivity.mouse,\n      events = (particle?.interactivity ?? options.interactivity).events,\n      divs = events.onDiv,\n      hover = events.onHover,\n      click = events.onClick,\n      divRepulse = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isDivModeEnabled)(repulseMode, divs);\n    if (!(divRepulse || hover.enable && !!mouse.position || click.enable && mouse.clickPosition)) {\n      return false;\n    }\n    const hoverMode = hover.mode,\n      clickMode = click.mode;\n    return (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(repulseMode, hoverMode) || (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(repulseMode, clickMode) || divRepulse;\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.repulse) {\n      options.repulse = new _Options_Classes_Repulse_js__WEBPACK_IMPORTED_MODULE_1__.Repulse();\n    }\n    for (const source of sources) {\n      options.repulse.load(source?.repulse);\n    }\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Repulser.js?");

/***/ })

}]);