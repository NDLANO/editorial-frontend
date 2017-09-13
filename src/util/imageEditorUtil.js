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

export function getSrcSets(imageId, transformData) {
  const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${imageId}`;
  const cropString = `cropStartX=${transformData[
    'upper-left-x'
  ]}&cropStartY=${transformData['upper-left-y']}&cropEndX=${transformData[
    'lower-right-x'
  ]}&cropEndY=${transformData['lower-right-y']}`;
  const focalString = `focalX=${transformData[
    'focal-x'
  ]}&focalY=${transformData['focal-y']}`;
  return [
    `${src}?width=1440&${cropString}&${focalString} 1440w`,
    `${src}?width=1120&${cropString}&${focalString} 1120w`,
    `${src}?width=1000&${cropString}&${focalString} 1000w`,
    `${src}?width=960&${cropString}&${focalString} 960w`,
    `${src}?width=800&${cropString}&${focalString} 800w`,
    `${src}?width=640&${cropString}&${focalString} 640w`,
    `${src}?width=480&${cropString}&${focalString} 480w`,
    `${src}?width=320&${cropString}&${focalString} 320w`,
    `${src}?width=320&${cropString}&${focalString} 320w`,
  ].join(', ');
}
