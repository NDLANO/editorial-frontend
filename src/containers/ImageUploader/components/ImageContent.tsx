/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Input } from '@ndla/forms';
import TitleField from '../../Form/TitleField';
import FormField from '../../../components/Form/FormField';
import ImageFormField from './ImageFormField';
import { ImageFormType } from '../imageTransformers';

interface Props {
  onSubmit: (values: ImageFormType) => Promise<void>;
}
const ImageContent = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <TitleField onSubmit={onSubmit} />
      <ImageFormField />
      <FormField<ImageFormType, 'caption'> name="caption" showError={false}>
        {({ error, value, onChange, onBlur }) => (
          <Input
            placeholder={t('form.image.caption.placeholder')}
            label={t('form.image.caption.label')}
            container="div"
            type="text"
            autoExpand
            warningText={error?.message}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      </FormField>
      <FormField<ImageFormType, 'alttext'> name="alttext" showError={false}>
        {({ error, value, onChange, onBlur }) => (
          <Input
            placeholder={t('form.image.alt.placeholder')}
            label={t('form.image.alt.label')}
            container="div"
            type="text"
            autoExpand
            warningText={error?.message}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      </FormField>
    </>
  );
};

export default ImageContent;
