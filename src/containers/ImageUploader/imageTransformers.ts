/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { IImageMetaInformationV2 as ImageApiType } from '@ndla/types-image-api';
import { Descendant } from 'slate';
import { Author } from '../../interfaces';
import { plainTextToEditorValue } from '../../util/articleContentConverter';

export interface ImageFormikType {
  id?: number;
  language: string;
  supportedLanguages: string[];
  title: Descendant[];
  alttext: string;
  caption: string;
  imageFile?: string;
  tags: string[];
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  origin: string;
  license?: string;
  modelReleased: string;
  filepath?: string;
}

export const imageApiTypeToFormType = (
  image: ImageApiType | undefined,
  language: string,
): ImageFormikType => {
  return {
    id: image?.id ? parseInt(image.id) : undefined,
    language,
    supportedLanguages: image?.supportedLanguages ?? [language],
    title: plainTextToEditorValue(image?.title.title || ''),
    alttext: image?.alttext.alttext ?? '',
    caption: image?.caption.caption ?? '',
    imageFile: image?.imageUrl,
    tags: image?.tags.tags ?? [],
    creators: image?.copyright.creators ?? [],
    processors: image?.copyright.processors ?? [],
    rightsholders: image?.copyright.rightsholders ?? [],
    origin: image?.copyright.origin ?? '',
    license: image?.copyright.license.license,
    modelReleased: image?.modelRelease ?? 'not-set',
  };
};
