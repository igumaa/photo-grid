var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/photo-grid.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/photo-grid.js":
/*!***************************!*\
  !*** ./src/photo-grid.js ***!
  \***************************/
/*! exports provided: onRandomizeAspectRatios, onFit, onSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRandomizeAspectRatios", function() { return onRandomizeAspectRatios; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onFit", function() { return onFit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onSettings", function() { return onSettings; });
var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui"),
    DOM = __webpack_require__(/*! sketch/dom */ "sketch/dom"),
    Settings = __webpack_require__(/*! sketch/settings */ "sketch/settings");

function onRandomizeAspectRatios(context) {
  var document = DOM.getSelectedDocument(),
      selection = document.selectedLayers;

  if (selection.length === 0) {
    UI.message('Select one or more layers');
  } else {
    var bounds = getBoundingBox(selection.layers);
    var rows = findRows(selection.layers); // let i = 1;

    rows.forEach(function (row) {
      randomizeAspectRatios(row, bounds.x); // numberLayers(row, `Row ${i++}`);
    });
  }
}
function onFit(context) {
  var document = DOM.getSelectedDocument(),
      selection = document.selectedLayers;

  if (selection.length === 0) {
    UI.message('Select one or more layers');
  } else {
    var bounds = getBoundingBox(selection.layers);
    var rows = findRows(selection.layers); // let i = 1;

    var y = bounds.y;
    rows.forEach(function (row) {
      fitLayers(row, bounds.x, bounds.x + bounds.width, y);
      y = row[0].frame.y + row[0].frame.height + getPadding(); // numberLayers(row, `Row ${i++}`);
    });
  }
}
function onSettings(context) {
  var padding = getPadding();
  var input = UI.getStringFromUser("Enter a padding value", padding);

  if (input != 'null') {
    var value = parseInt(input);

    if (isNaN(value) || input === '') {
      UI.message('⚠️ The padding was not changed. Try entering a number.');
    } else if (value < 0 || value > 1000) {
      UI.message('⚠️ Enter a number between 0 and 1000');
    } else {
      Settings.setSettingForKey('padding', value);
    }
  }
}

function randomizeAspectRatios(layers, x, y) {
  var aspectRatios = [1, 10 / 8, 4 / 3, 7 / 5, 3 / 2, 16 / 9, 2 / 3, 5 / 7, 3 / 4, 8 / 10];
  var padding = getPadding();
  var orderedLayers = layers.sort(function (a, b) {
    return a.frame.x - b.frame.x;
  });
  var firstLayer = orderedLayers[0];
  x = x || firstLayer.frame.x;
  y = y || firstLayer.frame.y;
  orderedLayers.forEach(function (layer) {
    layer.sketchObject.setConstrainProportions(0);
    var ratio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    var frame = layer.frame;
    var height = frame.height;
    frame.x = x;
    frame.y = y;
    frame.width = Math.round(height * ratio);
    layer.frame = frame;
    x += frame.width + padding;
  });
}

function fitLayers(layers, minX, maxX, y) {
  var orderedLayers = layers.sort(function (a, b) {
    return a.frame.x - b.frame.x;
  });
  var firstLayer = orderedLayers[0];
  var lastLayer = orderedLayers[orderedLayers.length - 1];
  var height = Math.round(median(layers.map(function (layer) {
    return layer.frame.height;
  })));
  var widths = layers.map(function (layer) {
    return layer.frame.width * height / layer.frame.height;
  });
  var totalWidth = widths.reduce(function (total, current) {
    return total + current;
  });
  minX = minX || firstLayer.frame.x;
  maxX = maxX || lastLayer.frame.x + lastLayer.frame.width;
  var padding = getPadding();
  var totalPadding = (layers.length - 1) * padding;
  var scale = (maxX - minX) / (totalWidth + totalPadding);
  var x = minX;
  y = y || firstLayer.frame.y;
  orderedLayers.forEach(function (layer) {
    layer.sketchObject.setConstrainProportions(0);
    var frame = layer.frame;
    frame.x = x;
    frame.y = y;
    frame.width = Math.round(frame.width * height / frame.height * scale);
    frame.height = Math.round(height * scale);
    layer.frame = frame;
    x += frame.width + padding;
  });
  var frame = lastLayer.frame;
  frame.width = maxX - frame.x;
  lastLayer.frame = frame;
}

function findRows(layers) {
  var rows = [];
  var remainingLayers = new Set(layers);
  var medianRowHeight = Math.round(median(layers.map(function (layer) {
    return layer.frame.height;
  })));

  var _loop = function _loop() {
    var largestRow = [];
    remainingLayers.forEach(function (layer) {
      var row = findLayersInRow(remainingLayers, layer, medianRowHeight);

      if (row.length > largestRow.length) {
        largestRow = row;
      }
    });
    largestRow.forEach(function (layer) {
      remainingLayers.delete(layer);
    });
    rows.push(largestRow);
  };

  while (remainingLayers.size > 0) {
    _loop();
  }

  return rows.sort(function (rowA, rowB) {
    return rowA[0].frame.y - rowB[0].frame.y;
  });
}

function findLayersInRow(layers, referenceLayer, rowHeight) {
  var rowCentre = getLayerCentre(referenceLayer);
  var top = rowCentre - rowHeight / 2;
  var bottom = rowCentre + rowHeight / 2;
  var layersInRow = [];
  layers.forEach(function (layer) {
    var centre = getLayerCentre(layer);

    if (centre > top && centre < bottom) {
      layersInRow.push(layer);
    }
  });
  return layersInRow;
}

function getPadding() {
  var padding = Settings.settingForKey('padding');

  if (padding === undefined) {
    padding = 16;
    Settings.setSettingForKey('padding', 16);
  }

  return padding;
}

function median(values) {
  values.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half - 1] + values[half]) / 2.0;
  }
}

function getBoundingBox(layers) {
  var lefts = layers.map(function (layer) {
    return layer.frame.x;
  }).sort(function (a, b) {
    return a - b;
  });
  var rights = layers.map(function (layer) {
    return layer.frame.x + layer.frame.width;
  }).sort(function (a, b) {
    return a - b;
  });
  var tops = layers.map(function (layer) {
    return layer.frame.y;
  }).sort(function (a, b) {
    return a - b;
  });
  var bottoms = layers.map(function (layer) {
    return layer.frame.y + layer.frame.height;
  }).sort(function (a, b) {
    return a - b;
  });
  return {
    x: lefts[0],
    y: tops[0],
    width: rights[layers.length - 1] - lefts[0],
    height: bottoms[layers.length - 1] - tops[0]
  };
}

function getLayerCentre(layer) {
  return layer.frame.y + layer.frame.height / 2;
}

function compareFlowOrder(layerA, layerB) {
  var valueA = layerA.frame.x + layerA.frame.y * 1000;
  var valueB = layerB.frame.x + layerB.frame.y * 1000;
  return valueA - valueB;
}

function numberLayers(layers, prefix) {
  var i = 1;
  layers.forEach(function (layer) {
    layer.name += "".concat(prefix, "-").concat(i++);
  });
}

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRandomizeAspectRatios'] = __skpm_run.bind(this, 'onRandomizeAspectRatios');
that['onRun'] = __skpm_run.bind(this, 'default');
that['onFit'] = __skpm_run.bind(this, 'onFit');
that['onSettings'] = __skpm_run.bind(this, 'onSettings')

//# sourceMappingURL=photo-grid.js.map