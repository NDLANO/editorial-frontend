/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { FieldHeader } from '@ndla/forms';
import { getLocale } from '../../../modules/locale/locale';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';
import { Field } from '../../../components/Fields';

const FormDatePicker = ({ t, name, ...rest }) => {
  return (
    <Field>
      <FieldHeader title={t(`form.${name}.label`)} />
      <DateTimeInput name={name} {...rest} />
    </Field>
  );
};

FormDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

FormDatePicker.defaultProps = {
  disabled: false,
  name: 'license',
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(FormDatePicker));
