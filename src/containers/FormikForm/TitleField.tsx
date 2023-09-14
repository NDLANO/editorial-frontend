/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import saveHotkeyPlugin from '../../components/SlateEditor/plugins/saveHotkey';

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
  handleSubmit: () => void;
}

const TitleField = ({ maxLength = 256, name = 'title', handleSubmit }: Props) => {
  const { t } = useTranslation();

  const plugins = useMemo(
    () => [textTransformPlugin, saveHotkeyPlugin(handleSubmit)],
    [handleSubmit],
  );

  return (
    <FormikField noBorder label={t('form.title.label')} name={name} title maxLength={maxLength}>
      {({ field, form: { isSubmitting } }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          className={'title'}
          placeholder={t('form.title.label')}
          data-testid="learning-resource-title"
          plugins={plugins}
          submitted={isSubmitting}
          handleSubmit={handleSubmit}
        />
      )}
    </FormikField>
  );
};

export default memo(TitleField);
