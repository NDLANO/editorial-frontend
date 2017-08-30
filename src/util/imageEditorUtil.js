/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function getElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const docEl = document.documentElement;

  const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
  const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

  return {
    top: rectTop,
    left: rectLeft,
  };
}

export function getClientPos(e) {
  let pageX;
  let pageY;

  if (e.touches) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return {
    x: pageX,
    y: pageY,
  };
}

export function getImageDimensions(el) {
  return {
    natural: {
      width: el.naturalWidth,
      height: el.naturalHeight,
    },
    current: {
      width: el.width,
      height: el.height,
    },
  };
}
