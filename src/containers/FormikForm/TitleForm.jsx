/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

import textTransformPlugin from '../../components/SlateEditor/plugins/textTransform';

const plugins = [textTransformPlugin()];

const FormikTitle = ({ t, maxLength, name, handleSubmit, onBlur }) => (
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

FormikTitle.defaultProps = {
  name: 'slatetitle',
  maxLength: 256,
  type: 'title',
};

FormikTitle.propTypes = {
  maxLength: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default injectT(FormikTitle);
