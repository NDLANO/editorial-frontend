/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { MouseEvent } from 'react';
import config from '../config';

export interface TransformData {
  'focal-x'?: string;
  'focal-y'?: string;
  'upper-left-x'?: string;
  'upper-left-y'?: string;
  'lower-right-x'?: string;
  'lower-right-y'?: string;
}

export function getElementOffset(el: HTMLImageElement) {
  const rect = el.getBoundingClientRect();
  const docEl = document.documentElement;
  const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
  const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;
  return {
    top: rectTop,
    left: rectLeft,
  };
}

export function getClientPos(e: MouseEvent<HTMLButtonElement> | TouchEvent) {
  let x;
  let y;

  if ('touches' in e) {
    x = e.touches[0].pageX;
    y = e.touches[0].pageY;
  } else {
    x = e.pageX;
    y = e.pageY;
  }

  return { x, y };
}

export function getImageDimensions(e: HTMLImageElement) {
  return {
    natural: {
      width: e.naturalWidth,
      height: e.naturalHeight,
    },
    current: {
      width: e.width,
      height: e.height,
    },
  };
}

export function getCrop(transformData: TransformData) {
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

export function getFocalPoint(transformData: TransformData) {
  if (transformData['focal-x'] === undefined || transformData['focal-y'] === undefined) {
    return undefined;
  }
  return `focalX=${transformData['focal-x']}&focalY=${transformData['focal-y']}`;
}

const imageWidths = [1440, 1120, 1000, 960, 800, 640, 480, 320];

export function getSrcSets(imageId: string, transformData?: TransformData, language?: string) {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${imageId}`;
  const crop = transformData ? getCrop(transformData) : undefined;
  const focalPoint = transformData ? getFocalPoint(transformData) : undefined;

  const cropString = crop ? `&${crop}` : '';
  const languageString = language ? `&language=${language}` : '';
  const focalString = focalPoint ? `&${focalPoint}` : '';

  return imageWidths
    .map(w => `${src}?width=${w}${languageString}${cropString}${focalString} ${w}w`)
    .join(', ');
}
