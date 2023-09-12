/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType } from 'formik';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ImageEmbedData } from '@ndla/types-embed';
import { defaultEmbedBlock } from '../../components/SlateEditor/plugins/embed/utils';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { ConceptFormValues } from '../ConceptPage/conceptInterfaces';
import { ArticleFormType } from './articleFormHooks';

export const onSaveAsVisualElement = <T extends ArticleFormType>(
  image: IImageMetaInformationV3,
  formikContext: FormikContextType<ConceptFormValues> | FormikContextType<T>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (image) {
    const visualElement: ImageEmbedData = {
      resource: 'image',
      resourceId: image.id,
      size: 'full',
      align: '',
      alt: convertFieldWithFallback(image as Object, 'alttext', ''),
      caption: convertFieldWithFallback(image as Object, 'caption', '') || '',
    };
    setFieldValue('visualElement', [defaultEmbedBlock(visualElement)]);
    setTimeout(() => {
      setFieldTouched('visualElement', true, false);
    }, 0);
  }
};
