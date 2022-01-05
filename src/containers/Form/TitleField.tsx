/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';

import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import saveHotkeyPlugin from '../../components/SlateEditor/plugins/saveHotkey';
import FormField from '../../components/Form/FormField';
import { ImageFormType } from '../ImageUploader/imageTransformers';

interface Props {
  maxLength?: number;
  name?: string;
  onSubmit: (values: ImageFormType) => Promise<void>;
  type?: string;
}

const TitleField = ({ maxLength = 256, name = 'title', onSubmit }: Props) => {
  const { t } = useTranslation();
  const { handleSubmit } = useFormContext();
  const handleSubmitRef = useRef(handleSubmit);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);
  const plugins = [textTransformPlugin, saveHotkeyPlugin(() => handleSubmitRef.current(onSubmit))];
  return (
    <FormField
      noBorder
      label={t('form.title.label')}
      name={name}
      title
      obligatory
      maxLength={maxLength}>
      {({ name, value, onChange, isSubmitting }) => (
        <PlainTextEditor
          id={name}
          onChange={onChange}
          value={value}
          className={'title'}
          placeholder={t('form.title.label')}
          cy="learning-resource-title"
          plugins={plugins}
          submitted={isSubmitting}
        />
      )}
    </FormField>
  );
};

export default TitleField;
