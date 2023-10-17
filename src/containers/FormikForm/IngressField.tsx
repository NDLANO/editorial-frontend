/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import saveHotkeyPlugin from '../../components/SlateEditor/plugins/saveHotkey';
import { Plain } from '../../util/slatePlainSerializer';
import parseMarkdown from '../../util/parseMarkdown';

interface Props {
  name?: string;
  maxLength?: number;
  type?: string;
  placeholder?: string;
  preview?: boolean;
}

const IngressField = ({
  name = 'introduction',
  maxLength = 300,
  placeholder,
  preview = false,
}: Props) => {
  const plugins = useMemo(() => [textTransformPlugin, saveHotkeyPlugin], []);

  const { t } = useTranslation();
  return (
    <StyledFormContainer>
      <FormikField
        noBorder
        label={t('form.introduction.label')}
        name={name}
        showMaxLength
        maxLength={maxLength}
      >
        {({ field, form: { isSubmitting } }) =>
          preview ? (
            <div className="article_introduction">
              {parse(parseMarkdown({ markdown: Plain.serialize(field.value) }))}
            </div>
          ) : (
            <PlainTextEditor
              id={field.name}
              {...field}
              placeholder={placeholder || t('form.introduction.label')}
              className="article_introduction"
              data-testid="learning-resource-ingress"
              submitted={isSubmitting}
              plugins={plugins}
            />
          )
        }
      </FormikField>
    </StyledFormContainer>
  );
};

export default IngressField;
