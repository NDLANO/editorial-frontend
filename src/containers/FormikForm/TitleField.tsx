/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Editor } from 'slate';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import textTransformPlugin from '../../components/SlateEditor/plugins/textTransform';

const plugins = [textTransformPlugin()];

interface Props {
  maxLength?: number;
  name?: string;
  handleSubmit: () => Promise<void>;
  onBlur: (event: Event, editor: Editor, next: Function) => void;
  type?: string;
}

const TitleField = ({ maxLength = 256, name = 'slatetitle', handleSubmit, onBlur }: Props) => {
  const { t } = useTranslation();
  return (
    <FormikField noBorder label={t('form.title.label')} name={name} title maxLength={maxLength}>
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          className={'title'}
          placeholder={t('form.title.label')}
          data-cy="learning-resource-title"
          plugins={plugins}
          handleSubmit={handleSubmit}
          onBlur={onBlur}
        />
      )}
    </FormikField>
  );
};

TitleField.defaultProps = {
  name: 'slatetitle',
  maxLength: 256,
  type: 'title',
};

TitleField.propTypes = {
  maxLength: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default TitleField;
