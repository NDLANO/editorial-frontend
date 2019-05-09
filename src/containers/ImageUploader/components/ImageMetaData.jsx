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
import Contributors from '../../../components/Contributors';
import FormikField from '../../../components/FormikField';
import MultiSelect from '../../../components/MultiSelect';
import { FormikLicense } from '../../FormikForm';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ImageMetaData = props => {
  const { t, tags, licenses } = props;
  return (
    <Fragment>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        obligatory
        description={t('form.tags.description')}>
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

      <FormikField name="license">
        {({ field }) => <FormikLicense licenses={licenses} {...field} />}
      </FormikField>

      <FormikField label={t('form.origin.label')} name="origin" />

      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <FormikField
            showError={false}
            key={`formik_contributor_${contributorType}`}
            name={contributorType}>
            {({ field, form }) => {
              const { errors, touched } = form;
              const error =
                touched[field.name] && errors[field.name]
                  ? errors[field.name]
                  : '';
              return (
                <Contributors
                  label={label}
                  labelRemove={t(`form.${contributorType}.labelRemove`)}
                  showError={!!errors[field.name]}
                  errorMessages={
                    touched[field.name] && errors[field.name] ? [error] : []
                  }
                  {...field}
                />
              );
            }}
          </FormikField>
        );
      })}
    </Fragment>
  );
};
ImageMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(ImageMetaData);
