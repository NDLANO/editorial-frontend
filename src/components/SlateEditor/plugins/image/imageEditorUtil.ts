/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from "react";
import { ImageEmbedFormValues } from "./types";
import config from "../../../../config";

type Transform = Pick<
  ImageEmbedFormValues,
  "focalX" | "focalY" | "upperLeftX" | "upperLeftY" | "lowerRightX" | "lowerRightY"
>;

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

  if ("touches" in e) {
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

export function getCrop(transformData: Transform) {
  if (
    transformData.upperLeftX === undefined ||
    transformData.upperLeftY === undefined ||
    transformData.lowerRightX === undefined ||
    transformData.lowerRightY === undefined
  ) {
    return undefined;
  }
  return `cropStartX=${transformData.upperLeftX}&cropStartY=${transformData.upperLeftY}&cropEndX=${transformData.lowerRightX}&cropEndY=${transformData.lowerRightY}`;
}

export function getFocalPoint(transformData: Transform) {
  if (transformData.focalX === undefined || transformData.focalY === undefined) {
    return undefined;
  }
  return `focalX=${transformData.focalX}&focalY=${transformData.focalY}`;
}

const imageWidths = [1440, 1120, 1000, 960, 800, 640, 480, 320];

export function getSrcSets(resourceId: string, imageData: Transform, language?: string) {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${resourceId}`;
  const crop = getCrop(imageData);
  const focalPoint = getFocalPoint(imageData);

  const cropString = crop ? `&${crop}` : "";
  const languageString = language ? `&language=${language}` : "";
  const focalString = focalPoint ? `&${focalPoint}` : "";

  return imageWidths.map((w) => `${src}?width=${w}${languageString}${cropString}${focalString} ${w}w`).join(", ");
}
