/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, useFormikContext } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { FieldErrorMessage, Label } from '@ndla/forms';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';
import { TopicArticleFormType } from '../../../../containers/FormikForm/articleFormHooks';
import { FormControl, FormField } from '../../../FormField';
import FormikField from '../../../FormikField';
import PlainTextEditor from '../../PlainTextEditor';
import saveHotkeyPlugin from '../saveHotkey';
import { textTransformPlugin } from '../textTransform';

const DISCLAIMER_EXAMPLES_LINK =
  'https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing';

const DisclaimerForm = () => {
  const { t } = useTranslation();
  // const context = useFormikContext<TopicArticleFormType>();
  // const { values } = context;
  const plugins = useMemo(() => [textTransformPlugin, saveHotkeyPlugin], []);

  return (
    <div>
      <Text element="p" textStyle="meta-text-medium" margin="small">
        <b>{t('form.disclaimer.exampleHeader')}</b>
      </Text>
      <Text element="p" textStyle="meta-text-small" margin="none">
        {t('form.disclaimer.exampleText')}
      </Text>
      <Text element="p" textStyle="meta-text-small">
        <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t('form.disclaimer.exampleLinkText')}</SafeLink>
      </Text>
      <Text element="p" textStyle="meta-text-medium" margin="small">
        <b>{t('form.disclaimer.editorHeader')}</b>
      </Text>
      <FormField name="disclaimerEditor">
        {({ field, meta }) => (
          <FormControl isRequired isInvalid={!!meta.error}>
            <Label visuallyHidden>{t('form.title.label')}</Label>
            <PlainTextEditor
              id={field.name}
              {...field}
              className="title"
              placeholder={t('form.title.label')}
              data-plain-text-editor=""
              data-testid="learning-resource-title"
              plugins={plugins}
              maxLength={300}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FormControl>
        )}
      </FormField>
      {/* <FormikField name="disclaimerEditor">
        {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            value={[]}
            submitted={isSubmitting}
            placeholder={t('subjectpageForm.description')}
          />
        )}
      </FormikField> */}
    </div>
  );
};

export default DisclaimerForm;
