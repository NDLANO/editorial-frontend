/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useEffect } from 'react';
import { Remarkable } from 'remarkable';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import saveHotkeyPlugin from '../../components/SlateEditor/plugins/saveHotkey';
import { Plain } from '../../util/slatePlainSerializer';

const markdown = new Remarkable({ breaks: true });
markdown.inline.ruler.enable(['sub', 'sup']);

const renderMarkdown = (text: string, concept: boolean) => {
  if (!concept) {
    markdown.block.ruler.disable(['list']);
  }
  return markdown.render(text);
};

interface Props {
  name?: string;
  maxLength?: number;
  type?: string;
  placeholder?: string;
  preview?: boolean;
  concept?: boolean;
  handleSubmit: () => void;
}

const IngressField = ({
  name = 'introduction',
  maxLength = 300,
  placeholder,
  handleSubmit,
  preview = false,
  concept = false,
}: Props) => {
  const handleSubmitRef = useRef(handleSubmit);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit]);

  const plugins = [textTransformPlugin, saveHotkeyPlugin(() => handleSubmitRef.current())];
  const { t } = useTranslation();
  return (
    <StyledFormContainer>
      <FormikField
        noBorder
        label={t('form.introduction.label')}
        name={name}
        showMaxLength
        maxLength={maxLength}>
        {({ field, form: { isSubmitting } }) =>
          preview ? (
            <div className="article_introduction">
              {parse(renderMarkdown(Plain.serialize(field.value), concept))}
            </div>
          ) : (
            <PlainTextEditor
              id={field.name}
              {...field}
              placeholder={placeholder || t('form.introduction.label')}
              className="article_introduction"
              cy="learning-resource-ingress"
              handleSubmit={handleSubmit}
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