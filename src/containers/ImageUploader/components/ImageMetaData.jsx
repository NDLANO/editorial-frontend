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
import { MultiSelectField, TextField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Contributors from '../../../components/Contributors';
import FormLicense from '../../Form/components/FormLicense';
import { getErrorMessages } from '../../../util/formHelper';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ImageMetaData = props => {
  const { t, commonFieldProps, tags, licenses } = props;
  return (
    <Fragment>
      <MultiSelectField
        obligatory
        name="tags"
        data={tags}
        label={t('form.tags.label')}
        description={t('form.tags.description')}
        messages={{
          createOption: t('form.tags.createOption'),
          emptyFilter: t('form.tags.emptyFilter'),
          emptyList: t('form.tags.emptyList'),
        }}
        {...commonFieldProps}
      />
      <FormLicense
        licenses={licenses}
        {...commonFieldProps.bindInput('license')}
      />
      <TextField
        label={t('form.origin.label')}
        name="origin"
        {...commonFieldProps}
      />
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <Contributors
            name={contributorType}
            label={label}          
            showError={commonFieldProps.submitted}
            errorMessages={getErrorMessages(
              label,
              contributorType,
              commonFieldProps.schema,
            )}
            {...commonFieldProps.bindInput(contributorType)}
          />
        );
      })}
    </Fragment>
  );
};
ImageMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(ImageMetaData);
