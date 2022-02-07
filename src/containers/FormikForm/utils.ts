/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType } from 'formik';
import { defaultEmbedBlock } from '../../components/SlateEditor/plugins/embed/utils';
import { ImageEmbed } from '../../interfaces';
import { ImageApiType } from '../../modules/image/imageApiInterfaces';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { ConceptFormValues } from '../ConceptPage/conceptInterfaces';
import { ArticleFormType } from './articleFormHooks';

export const onSaveAsVisualElement = <T extends ArticleFormType>(
  image: ImageApiType,
  formikContext: FormikContextType<ConceptFormValues> | FormikContextType<T>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (image) {
    const visualElement: ImageEmbed = {
      resource: 'image',
      resource_id: image.id,
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

export const generateLanguageWarnings = (warnings: any, t: any) => {
  // @ts-ignore
  return warnings.reduce((acc, cv) => {
    const key = Object.keys(cv)[0];
    return { ...acc, [key]: t('warningMessage.fieldWithWrongLanguage', { language: [cv[key]] }) };
  }, {});
};
