/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useContext } from 'react';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import FormikField from '../../components/FormikField';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import { MetaImageSearch } from '.';
import AsyncSearchTags from '../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import AvailabilityField from './components/AvailabilityField';
import { UserAccessContext } from '../App/App';
import { DRAFT_ADMIN_SCOPE } from '../../constants';
import { ArticleShape } from '../../shapes';

const MetaDataField = ({ t, article, fetchSearchTags, handleSubmit, handleBlur }) => {
  const userAccess = useContext(UserAccessContext);
  const plugins = [textTransformPlugin];

  return (
    <Fragment>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        showError
        description={t('form.tags.description')}>
        {({ field, form }) => (
          <AsyncSearchTags
            initialTags={field.value}
            language={article.language}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      {userAccess.includes(DRAFT_ADMIN_SCOPE) && (
        <FormikField name="availability" label={t('form.availability.label')}>
          {({ field }) => <AvailabilityField availability={article.availability} field={field} />}
        </FormikField>
      )}
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
            handleSubmit={handleSubmit}
            {...field}
            onBlur={(event, editor) => {
              // Forcing slate field to be deselected before selecting new field.
              // Fixes a problem where slate field is not properly focused on click.
              ReactEditor.deselect(editor);

              // TODO: Can possibly be removed
              // this is a hack since formik onBlur-handler interferes with slates
              // related to: https://github.com/ianstormtaylor/slate/issues/2434
              // formik handleBlur needs to be called for validation to work (and touched to be set)
              setTimeout(() => handleBlur({ target: { name: 'metaDescription' } }), 0);
            }}
            plugins={plugins}
          />
        )}
      </FormikField>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton={false}
            {...field}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

MetaDataField.propTypes = {
  article: ArticleShape.isRequired,
  fetchSearchTags: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default injectT(MetaDataField);
