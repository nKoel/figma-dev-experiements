/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ui.html":
/*!*****************!*\
  !*** ./ui.html ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// Module\nvar code = `<h1 id=\"dot-amount-display\">You've got 0 Dots on the canvas</h1>\n<button id=\"btn-add-dot\">Add a Dot</button>\n\n\n${\"<\" + \"script\"}>\n    const displayDotCount = document.querySelector(\"#dot-amount-display\");\n    const addDotBtn = document.querySelector(\"#btn-add-dot\");\n\n    // FUNCTIONS\n    // Add dot to canvas\n    function addBtnClicked (e) {\n        e.preventDefault();\n\n        parent.postMessage({ \n            pluginMessage: { \n                type: \"ADD_DOT\"\n            } }, \"*\");\n\n    }\n    \n\n    // Add one to dot count\n\n    // EVENTLISTENERS\n    addDotBtn.addEventListener(\"click\", addBtnClicked);\n\n    window.onmessage = (event) => {\n            const msg = event.data.pluginMessage;\n            if (msg.type === 'UPDATE_COUNT') {\n                displayDotCount.textContent = \\`You've got \\${msg.count} Dots on the canvas\\`;\n            }\n        };\n${\"<\" + \"/script\"}>`;\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);\n\n//# sourceURL=webpack://figma-dots-plugin/./ui.html?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./ui.html"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;