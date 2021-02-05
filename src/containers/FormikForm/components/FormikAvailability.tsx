/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// @ts-ignore
import { RadioButtonGroup } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { FieldInputProps } from 'formik';

export const StyledDiv = styled('div')`
  section > div > input {
    display: none;
  }
  section > div > label {
    font-size: 20px;
  }
`;

interface Props {
  availability: string;
  field: FieldInputProps<string[]>;
}

const FormikAvailability = ({ availability, field, t }: Props & tType) => {
  const availabilityValues = ['everyone', 'teacher', 'student'];

  return (
    <StyledDiv>
      <RadioButtonGroup
        label={t('labelChild')}
        selected={availability}
        uniqeIds
        options={availabilityValues.map(value => ({ title: t(value), value: value }))}
        onChange={(value: string) =>
          field.onChange({
            target: {
              name: field.name,
              value: value,
            },
          })
        }
      />
    </StyledDiv>
  );
};

export default injectT(FormikAvailability, 'form.availability.');
