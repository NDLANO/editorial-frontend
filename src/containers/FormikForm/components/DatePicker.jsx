/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { FieldHeader, FieldRemoveButton, FieldSection } from '@ndla/forms';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';
import Field from '../../../components/Field';

const StyledFieldRemoveButton = styled(FieldRemoveButton)`
  padding-top: 0;
`;

const DatePicker = ({ name, onReset, label, ...rest }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  return (
    <Field>
      <FieldHeader title={label || t(`form.${name}.label`)} />
      <FieldSection>
        <DateTimeInput name={name} locale={locale} {...rest} />
        {onReset && (
          <StyledFieldRemoveButton onClick={onReset}>
            {t(`form.${name}.reset`)}
          </StyledFieldRemoveButton>
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
