/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import config from '../config';

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
  let x;
  let y;

  if (e.touches) {
    x = e.touches[0].pageX;
    y = e.touches[0].pageY;
  } else {
    x = e.pageX;
    y = e.pageY;
  }

  return { x, y };
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

export function getCrop(transformData) {
  if (
    transformData['upper-left-x'] === undefined ||
    transformData['upper-left-y'] === undefined ||
    transformData['lower-right-x'] === undefined ||
    transformData['lower-right-y'] === undefined
  ) {
    return undefined;
  }
  return `cropStartX=${transformData['upper-left-x']}&cropStartY=${transformData['upper-left-y']}&cropEndX=${transformData['lower-right-x']}&cropEndY=${transformData['lower-right-y']}`;
}

export function getFocalPoint(transformData) {
  if (transformData['focal-x'] === undefined || transformData['focal-y'] === undefined) {
    return undefined;
  }
  return `focalX=${transformData['focal-x']}&focalY=${transformData['focal-y']}`;
}

export function getSrcSets(imageId, transformData, language) {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${imageId}`;
  const crop = transformData ? getCrop(transformData) : undefined;
  const focalPoint = transformData ? getFocalPoint(transformData) : undefined;

  const cropString = crop ? `&${crop}` : '';
  const languageString = language ? `&language=${language}` : '';
  const focalString = focalPoint ? `&${focalPoint}` : '';
  return [
    `${src}?width=1440${languageString}${cropString}${focalString} 1440w`,
    `${src}?width=1120${languageString}${cropString}${focalString} 1120w`,
    `${src}?width=1000${languageString}${cropString}${focalString} 1000w`,
    `${src}?width=960${languageString}${cropString}${focalString} 960w`,
    `${src}?width=800${languageString}${cropString}${focalString} 800w`,
    `${src}?width=640${languageString}${cropString}${focalString} 640w`,
    `${src}?width=480${languageString}${cropString}${focalString} 480w`,
    `${src}?width=320${languageString}${cropString}${focalString} 320w`,
    `${src}?width=320${languageString}${cropString}${focalString} 320w`,
  ].join(', ');
}
