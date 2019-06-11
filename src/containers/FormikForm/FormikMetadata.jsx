/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import FormikField from '../../components/FormikField';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import { FormikMetaImageSearch } from '.';
import MultiSelectDropdown from '../../components/Dropdown/MultiSelectDropdown';

const FormikMetadata = ({ t, tags }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      obligatory>
      {({ field }) => <MultiSelectDropdown {...field} data={tags} />}
    </FormikField>
    <FormikField
      name="metaDescription"
      maxLength={155}
      showMaxLength
      label={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}>
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          placeholder={t('form.metaDescription.label')}
          {...field}
        />
      )}
    </FormikField>
    <FormikField name="metaImageId">
      {({ field }) => (
        <FormikMetaImageSearch metaImageId={field.value} {...field} />
      )}
    </FormikField>
  </Fragment>
);

FormikMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(FormikMetadata);
