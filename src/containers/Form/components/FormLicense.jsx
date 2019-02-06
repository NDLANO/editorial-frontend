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
import { connect } from 'react-redux';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { FormHeader, FormSections, FormDropdown } from '@ndla/forms';
import { CommonFieldPropsShape } from '../../../shapes';
import { getLocale } from '../../../modules/locale/locale';
import HowToHelper from '../../../components/HowTo/HowToHelper';

const FormLicense = ({
  t,
  commonFieldProps,
  name,
  licenses,
  disabled,
  locale,
}) => {
  const licensesWithTranslations = licenses.map(license => ({
    ...license,
    ...getLicenseByAbbreviation(license.license, locale),
  }));

  return (
    <Fragment>
      <FormHeader title={t('form.license.label')} width={3 / 4}>
        <HowToHelper
          pageId="userLicense"
          tooltip={t('form.license.helpLabel')}
        />
      </FormHeader>
      <FormSections>
        <div>
          <FormDropdown
            disabled={disabled}
            value=""
            {...commonFieldProps.bindInput(name)}>
            {licensesWithTranslations.map(license => (
              <option value={license.license} key={license.license}>
                {license.title}
              </option>
            ))}
          </FormDropdown>
        </div>
      </FormSections>
    </Fragment>
  );
};

FormLicense.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

FormLicense.defaultProps = {
  disabled: false,
  name: 'license',
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(FormLicense));
