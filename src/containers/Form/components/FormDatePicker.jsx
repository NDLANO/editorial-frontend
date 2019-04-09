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
import { css } from '@emotion/core';
import { FieldHeader, FieldSection, FieldRemoveButton } from '@ndla/forms';
import { getLocale } from '../../../modules/locale/locale';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';
import { Field } from '../../../components/Fields';

const FormDatePicker = ({ t, name, onReset, ...rest }) => (
  <Field>
    <FieldHeader title={t(`form.${name}.label`)} />
    <FieldSection>
      <DateTimeInput name={name} {...rest} />
      {onReset && (
        <FieldRemoveButton
          onClick={onReset}
          css={css`
            padding-top: 0;
          `}>
          {t(`form.${name}.reset`)}
        </FieldRemoveButton>
      )}
    </FieldSection>
  </Field>
);

FormDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onReset: PropTypes.func,
};

FormDatePicker.defaultProps = {
  disabled: false,
  name: 'license',
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(FormDatePicker));
