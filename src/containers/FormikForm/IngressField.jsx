/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import parse from 'html-react-parser';
import Plain from 'slate-plain-serializer';
import { injectT } from '@ndla/i18n';

import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import textTransformPlugin from '../../components/SlateEditor/plugins/textTransform';

const markdown = new Remarkable({ breaks: true });
markdown.inline.ruler.enable(['sub', 'sup']);

const renderMarkdown = (text, concept) => {
  if (!concept) {
    markdown.block.ruler.disable(['list']);
  }
  return markdown.render(text);
};

const plugins = [textTransformPlugin()];

const FormikIngress = ({
  t,
  name,
  maxLength,
  placeholder,
  handleSubmit,
  preview = false,
  concept = false,
  onBlur,
}) => (
  <StyledFormContainer>
    <FormikField
      noBorder
      label={t('form.introduction.label')}
      name={name}
      showMaxLength
      maxLength={maxLength}>
      {({ field }) =>
        preview ? (
          <p className="article_introduction">
            {parse(renderMarkdown(Plain.serialize(field.value), concept))}
          </p>
        ) : (
          <PlainTextEditor
            id={field.name}
            {...field}
            placeholder={placeholder || t('form.introduction.label')}
            className="article_introduction"
            data-cy="learning-resource-ingress"
            handleSubmit={handleSubmit}
            onBlur={onBlur}
            plugins={plugins}
          />
        )
      }
    </FormikField>
  </StyledFormContainer>
);

FormikIngress.defaultProps = {
  name: 'introduction',
  maxLength: 300,
  type: 'ingress',
};

FormikIngress.propTypes = {
  name: PropTypes.string,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  preview: PropTypes.bool,
  concept: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default injectT(FormikIngress);
