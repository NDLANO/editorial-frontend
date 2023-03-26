global.requestAnimationFrame = function raf(callback) {
  setTimeout(callback, 0);
};

function polyfill() {
  return {
    matches: false,
    addListener: function() {}, // eslint-disable-line
    removeListener: function() {}, // eslint-disable-line
  };
}

window.matchMedia = window.matchMedia || polyfill;
