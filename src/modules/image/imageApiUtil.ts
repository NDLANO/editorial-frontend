/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { ImageApiType } from './imageApiInterfaces';
import { ImageType } from '../../interfaces';

export const transformApiToCLeanImage = (image: ImageApiType, language: string): ImageType => {
  return {
    ...image,
    title: convertFieldWithFallback(image, 'title', '', language),
    tags: convertFieldWithFallback(image, 'tags', [], language),
    alttext: convertFieldWithFallback(image, 'alttext', '', language),
    caption: convertFieldWithFallback(image, 'caption', '', language),
    language,
  };
};
