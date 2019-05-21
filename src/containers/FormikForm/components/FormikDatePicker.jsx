/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { FieldHeader, FieldRemoveButton, FieldSection } from '@ndla/forms';
import { getLocale } from '../../../modules/locale/locale';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';
import Field from '../../../components/Field';

const FormikDatePicker = ({ t, name, onReset, label, ...rest }) => {
  return (
    <Field>
      <FieldHeader title={label || t(`form.${name}.label`)} />
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
};

FormikDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  value: PropTypes.string,
  locale: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
};

FormikDatePicker.defaultProps = {
  disabled: false,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(FormikDatePicker));
