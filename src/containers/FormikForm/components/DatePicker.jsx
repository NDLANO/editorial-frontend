/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { FieldHeader, FieldRemoveButton, FieldSection } from '@ndla/forms';
import { LocaleContext } from '../../App/App';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';
import Field from '../../../components/Field';

const DatePicker = ({ name, onReset, label, ...rest }) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  return (
    <Field>
      <FieldHeader title={label || t(`form.${name}.label`)} />
      <FieldSection>
        <DateTimeInput name={name} locale={locale} {...rest} />
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

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
};

DatePicker.defaultProps = {
  disabled: false,
};

export default DatePicker;
