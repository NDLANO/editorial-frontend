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

export const transformApiToCleanImage = (image: ImageApiType, language: string): ImageType => {
  return {
    ...image,
    title: convertFieldWithFallback<'title'>(image, 'title', '', language),
    tags: convertFieldWithFallback<'tags', string[]>(image, 'tags', [], language),
    alttext: convertFieldWithFallback<'alttext'>(image, 'alttext', '', language),
    caption: convertFieldWithFallback<'caption'>(image, 'caption', '', language),
    language,
  };
};
