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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// Module\nvar code = `<h1 id=\"dot-amount-display\">You've got 0 Dots on the canvas</h1>\n<div id=\"groups-container\"></div>\n<button id=\"btn-add-group\">New Group</button>\n\n${\"<\" + \"script\"}>\n    // Initialize groups object\n    let groups = {};\n\n    const displayDotCount = document.querySelector(\"#dot-amount-display\");\n    const addGroupBtn = document.querySelector(\"#btn-add-group\");\n    const groupsContainer = document.querySelector(\"#groups-container\");\n\n    // Render groups in the UI\n    function renderGroups(groupsData) {\n        console.log(\"Rendering groups data:\", JSON.stringify(groupsData, null, 2)); // Better debug view\n        groupsContainer.innerHTML = '';\n        \n        Object.entries(groupsData).forEach(([groupId, group]) => {\n            console.log(\\`Rendering group \\${groupId}:\\`, JSON.stringify(group, null, 2)); // Better debug view\n            \n            const groupElement = document.createElement('div');\n            groupElement.className = 'group-row';\n            \n            // Directly access the nested properties\n            const groupName = document.createElement('span');\n            groupName.textContent = \\`\\${group.name}: \\${group.dotCount} Dot\\${group.dotCount !== 1 ? 's' : ''}\\`;\n            \n            const addButton = document.createElement('button');\n            addButton.textContent = '+';\n            addButton.onclick = () => addDotToGroup(groupId);\n            \n            const deleteButton = document.createElement('button');\n            deleteButton.textContent = '🗑️';\n            deleteButton.onclick = () => deleteGroup(groupId);\n            \n            groupElement.appendChild(groupName);\n            groupElement.appendChild(addButton);\n            groupElement.appendChild(deleteButton);\n            groupsContainer.appendChild(groupElement);\n        });\n    }\n\n    // Add new group\n    function addNewGroup() {\n        const newGroupId = \\`group-\\${Object.keys(groups).length + 1}\\`;\n        groups[newGroupId] = { name: \\`Group \\${Object.keys(groups).length + 1}\\`, dotCount: 0 };\n        parent.postMessage({ \n            pluginMessage: { \n                type: \"SAVE_GROUPS\",\n                groups: groups\n            } \n        }, \"*\");\n        renderGroups(groups);\n    }\n\n    // Add dot to a specific group\n    function addDotToGroup(groupId) {\n        parent.postMessage({ \n            pluginMessage: { \n                type: \"ADD_DOT\",\n                groupId: groupId\n            } \n        }, \"*\");\n    }\n\n    // Delete a group and its dots\n    function deleteGroup(groupId) {\n        delete groups[groupId];\n        parent.postMessage({ \n            pluginMessage: { \n                type: \"DELETE_GROUP\",\n                groupId: groupId,\n                groups: groups\n            } \n        }, \"*\");\n    }\n\n    // Event listeners\n    addGroupBtn.addEventListener(\"click\", addNewGroup);\n\n    window.onmessage = (event) => {\n        const msg = event.data.pluginMessage;\n        if (msg.type === 'UPDATE_COUNT') {\n            displayDotCount.textContent = \\`You've got \\${msg.count} Dots on the canvas\\`;\n            groups = msg.groups;\n            renderGroups(groups);\n        }\n    };\n${\"<\" + \"/script\"}>`;\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);\n\n//# sourceURL=webpack://figma-dots-plugin/./ui.html?");

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