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
import MultiSelect from '../../../components/MultiSelect';
import Contributors from '../../../components/Contributors';
import FormLicense from '../../Form/components/FormLicense';
import FormikField from '../../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const AudioMetaData = props => {
  const { t, tags, licenses } = props;
  return (
    <Fragment>
      <FormikField name="tags" label={t('form.tags.label')}>
        {({ field }) => (
          <MultiSelect
            data={tags}
            obligatory
            {...field}
            description={t('form.tags.description')}
            messages={{
              createOption: t('form.tags.createOption'),
              emptyFilter: t('form.tags.emptyFilter'),
              emptyList: t('form.tags.emptyList'),
            }}
          />
        )}
      </FormikField>
      <FormikField name="license" label={t('form.license.label')}>
        {({ field }) => <FormLicense licenses={licenses} {...field} />}
      </FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <FormikField
            label={label}
            key={`formik_contributor_${contributorType}`}
            name={contributorType}
            showError={false}>
            {({ field, form }) => {
              const { errors, touched, isSubmitting } = form;
              const error =
                touched[field.name] && errors[field.name]
                  ? errors[field.name](label)
                  : '';
              return (
                <Contributors
                  label={label}
                  labelRemove={t(`form.${contributorType}.labelRemove`)}
                  submitted={isSubmitting}
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

AudioMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(AudioMetaData);
