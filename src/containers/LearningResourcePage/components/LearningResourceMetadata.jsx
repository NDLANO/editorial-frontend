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
import { FieldHeader } from '@ndla/forms';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { FormikMetaImageSearch } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';

const LearningResourceMetadata = ({ t, tags }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      obligatory>
      {({ field }) => (
        <Fragment>
          <FieldHeader title={t('form.tags.label')}>
            <HowToHelper
              pageId="MetaKeyword"
              tooltip={t('form.tags.helpLabel')}
            />
          </FieldHeader>
          <MultiSelectDropdown data={tags} {...field} />
        </Fragment>
      )}
    </FormikField>
    <FormikField
      name="metaDescription"
      maxLength={155}
      showMaxLength
      label={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}>
      {({ field }) => (
        <Fragment>
          <FieldHeader title={t('form.metaDescription.label')}>
            <HowToHelper
              pageId="MetaDescription"
              tooltip={t('form.metaDescription.helpLabel')}
            />
          </FieldHeader>
          <PlainTextEditor
            id={field.name}
            placeholder={t('form.metaDescription.label')}
            {...field}
          />
        </Fragment>
      )}
    </FormikField>
    <FormikField name="metaImageId">
      {({ field }) => (
        <FormikMetaImageSearch metaImageId={field.value} {...field} />
      )}
    </FormikField>
  </Fragment>
);

LearningResourceMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(LearningResourceMetadata);
