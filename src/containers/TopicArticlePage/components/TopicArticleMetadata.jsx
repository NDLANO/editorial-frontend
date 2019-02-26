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
import { RemainingCharacters } from '../../../components/Fields';
import FormikField from '../../../components/FormikField';
import MultiSelect from '../../../components/MultiSelect';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';

const TopicArticleMetadata = ({ t, tags }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      obligatory>
      {({ field }) => (
        <MultiSelect
          data={tags}
          {...field}
          messages={{
            createOption: t('form.tags.createOption'),
            emptyFilter: t('form.tags.emptyFilter'),
            emptyList: t('form.tags.emptyList'),
          }}
        />
      )}
    </FormikField>
    <FormikField
      name="metaDescription"
      label={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}>
      {({ field }) => (
        <Fragment>
          <PlainTextEditor
            id={field.classNamename}
            placeholder={t('form.metaDescription.label')}
            {...field}
          />
          <RemainingCharacters
            maxLength={155}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })
            }
            value={field.value.document.text}
          />
        </Fragment>
      )}
    </FormikField>
  </Fragment>
);

TopicArticleMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(TopicArticleMetadata);
