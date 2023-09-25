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
import { spanPlugin } from '../../components/SlateEditor/plugins/span';
import { markPlugin } from '../../components/SlateEditor/plugins/mark';
import { toolbarPlugin } from '../../components/SlateEditor/plugins/toolbar';

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
}

const TitleField = ({ maxLength = 256, name = 'title' }: Props) => {
  const { t } = useTranslation();

  const plugins = useMemo(
    () => [spanPlugin, toolbarPlugin, markPlugin, textTransformPlugin, saveHotkeyPlugin],
    [],
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
        />
      )}
    </FormikField>
  );
};

export default memo(TitleField);
