/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { SelectObjectField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import { getLocale } from '../../../modules/locale/locale';

const FormLicense = ({ t, commonFieldProps, name, licenses, disabled, locale }) => {
  const licensesWithTranslations = licenses.map(license => ({
    ...license,
    ...getLicenseByAbbreviation(license.license, locale),
  }));

  return (
    <SelectObjectField
      name={name}
      label={t('form.license.label')}
      options={licensesWithTranslations}
      idKey="license"
      labelKey="title"
      disabled={disabled}
      {...commonFieldProps}
    />
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
