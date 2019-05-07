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
import FormLicense from './components/FormLicense';
import { CommonFieldPropsShape } from '../../shapes';
import Contributors from '../../components/Contributors';
import { AgreementConnection } from '.';
import { getErrorMessages } from '../../util/formHelper';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const FormCopyright = ({ t, commonFieldProps, licenses, model }) => {
  const disabled = !!model.agreementId;
  return (
    <Fragment>
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

      <AgreementConnection
        commonFieldProps={commonFieldProps}
        model={model}
        width={3 / 4}
      />
      <FormLicense
        disabled={disabled}
        licenses={licenses}
        {...commonFieldProps.bindInput('license')}
      />
    </Fragment>
  );
};

FormCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  model: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
};

export default injectT(FormCopyright);
