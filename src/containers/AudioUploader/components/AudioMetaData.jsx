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
import { CommonFieldPropsShape } from '../../../shapes';
import Contributors from '../../../components/Contributors';
import FormLicense from '../../Form/components/FormLicense';
import { getErrorMessages } from '../../../util/formHelper';
import FormikField from '../../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const AudioMetaData = props => {
  const { t, onChange, tags, licenses } = props;
  return (
    <Fragment>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        render={({ field }) => 
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
        }
      />
      <FormikField
        name="license"
        render={({ field }) => 
          <FormLicense
            licenses={licenses}
            {...field}
          />
        }
      />
      <FormikField
        label={t('form.origin.label')}
        name="origin"
      />
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <Contributors
            name={contributorType}
            label={label}
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

AudioMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(AudioMetaData);
