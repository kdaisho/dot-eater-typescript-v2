// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Vec2.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vec2 =
/** @class */
function () {
  function Vec2(x, y) {
    this.x = x;
    this.y = y;
  }

  return Vec2;
}();

exports.default = Vec2;
},{}],"Character.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Character =
/** @class */
function () {
  function Character(aa) {
    this.aa = aa;
  }

  return Character;
}();

exports.default = Character;
},{}],"app.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vec2_1 = __importDefault(require("./Vec2"));

var Character_1 = __importDefault(require("./Character"));

var cell = {
  none: 0,
  wall: 1,
  dot: 2,
  max: 3,
  maxHeight: 8
};
var direction = {
  up: 0,
  left: 1,
  down: 2,
  right: 3
};
var directions = [new Vec2_1.default(0, -1), new Vec2_1.default(-1, 0), new Vec2_1.default(0, 1), new Vec2_1.default(1, 0)];
var cells = [[1, 1, 1, 1, 0, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 1, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 1, 0, 1], [1, 0, 1, 1, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 0, 1, 1, 1, 1]];
var ai = {
  random: 0,
  chase: 1
};
var character = {
  player: 0,
  enemy1: 1,
  enemy2: 2
};
var cellAA = ["<span class=\"none\"></span>", "<span class=\"wall\"></span>", "<span class=\"dot\"><span></span></span>"]; // function Character(aa) {
// 	this.aa = aa;
// }

var characters = [new Character_1.default("<span class=\"character\"><span>😎</span></span>"), new Character_1.default("<span class=\"character\"><span>👹</span></span>"), new Character_1.default("<span class=\"character\"><span>👺</span></span>")];
var player = characters[character.player];
var enemies = [];
var intervalId = null;
var lock = false;

function init() {
  lock = false;
  player.pos = new Vec2_1.default(4, 1);
  setDots();
  enemies[0] = characters[character.enemy1];
  enemies[1] = characters[character.enemy2];
  enemies[0].pos = new Vec2_1.default(1, 4);
  enemies[1].pos = new Vec2_1.default(7, 4);
  enemies[0].ai = ai.random;
  enemies[1].ai = ai.chase;

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].lastPos = new Vec2_1.default(enemies[i].pos.x, enemies[i].pos.y);
  }

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(interval, 1000);
  addEventListener("keydown", onKeyDown);
  draw();
}

function setDots() {
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      if (!(player.pos.y === i && player.pos.x === j) && cells[i][j] === cell.none) {
        cells[i][j] = cell.dot;
      }
    }
  }
}

function onKeyDown(event) {
  if (lock) return;
  var targetPos = new Vec2_1.default(player.pos.x, player.pos.y);

  switch (event.key) {
    case "ArrowUp":
      targetPos.y--;
      break;

    case "ArrowDown":
      targetPos.y++;
      break;

    case "ArrowLeft":
      targetPos.x--;
      break;

    case "ArrowRight":
      targetPos.x++;
      break;
  }

  loopPos(targetPos);

  if (cells[targetPos.y][targetPos.x] >= cell.max) {
    return;
  }

  switch (cells[targetPos.y][targetPos.x]) {
    case cell.none:
      player.pos = new Vec2_1.default(targetPos.x, targetPos.y);

    case cell.wall:
      break;

    case cell.dot:
      cells[targetPos.y][targetPos.x] = cell.none;
      player.pos = new Vec2_1.default(targetPos.x, targetPos.y);
      break;

    default:
      console.log("No element found");
  }

  isEnd();
  draw();
}

function interval() {
  for (var i = 0; i < enemies.length; i++) {
    enemyMove(enemies[i]);
  }

  draw();
}

function enemyMove(enemy) {
  var pos = [];
  var v = null;

  for (var i = 0; i < Object.keys(direction).length; i++) {
    v = new Vec2_1.default(enemy.pos.x + directions[i].x, enemy.pos.y + directions[i].y);
    loopPos(v);

    if (cells[v.y][v.x] === cell.wall) {
      continue;
    }

    if (v.x === enemy.lastPos.x && v.y === enemy.lastPos.y) {
      continue;
    }

    pos.push(v);
  }

  enemy.lastPos = new Vec2_1.default(enemy.pos.x, enemy.pos.y);

  switch (enemy.ai) {
    case ai.random:
      var r = parseInt(Math.random() * pos.length);
      enemy.pos = pos[r];
      break;

    case ai.chase:
      var nearest = pos[0];

      for (var i = 1; i < pos.length; i++) {
        if (distanceToPlayer(nearest) > distanceToPlayer(pos[i])) {
          nearest = pos[i];
        }
      }

      distanceToPlayer(v);
      enemy.pos = nearest;

    default:
      console.log("No AI type found");
  }

  isEnd();

  function distanceToPlayer(v) {
    return Math.sqrt(Math.pow(player.pos.x - v.x, 2) + Math.pow(player.pos.y - v.y, 2));
  }
}

function loopPos(v) {
  if (v.x < 0) {
    v.x = cells[0].length - 1;
  }

  if (v.x >= cells[0].length) {
    v.x = 0;
  }

  if (v.y < 0) {
    v.y = cells.length - 1;
  }

  if (v.y >= cells.length) {
    v.y = 0;
  }
}

function isEnd() {
  if (lock) return;

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].pos.x === player.pos.x && enemies[i].pos.y === player.pos.y) {
      displayMessage(true);
      return true;
    }
  }

  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      if (cells[i][j] === cell.dot) {
        return false;
      }
    }
  }

  displayMessage();
  return true;
}

function displayMessage(dead) {
  if (lock) return;
  clearInterval(intervalId);
  var backdrop = document.createElement("div");
  backdrop.setAttribute("id", "backdrop");
  backdrop.setAttribute("class", "backdrop");
  document.body.appendChild(backdrop);
  var msg = document.createElement("div");
  var txt = dead ? document.createTextNode("You're dead. Click to restart.") : document.createTextNode("Congrats! Click to restart.");
  msg.appendChild(txt);
  msg.setAttribute("id", "msg");
  msg.setAttribute("class", "msg");
  backdrop.addEventListener("click", restore);
  document.body.appendChild(msg);

  function restore() {
    document.body.removeChild(document.getElementById("backdrop"));
    document.body.removeChild(document.getElementById("msg"));
    init();
  }

  lock = true;
}

function draw() {
  var root = document.getElementById("root");
  var html = "";
  var str = "";

  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      str = cellAA[cells[i][j]];

      for (var k = 0; k < characters.length; k++) {
        if (i === characters[k].pos.y && j === characters[k].pos.x) {
          str = characters[k].aa;
        }
      }

      html += str;
    }

    html += "<br>";
  }

  root.innerHTML = html;
}

init();
},{"./Vec2":"Vec2.ts","./Character":"Character.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44675" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map