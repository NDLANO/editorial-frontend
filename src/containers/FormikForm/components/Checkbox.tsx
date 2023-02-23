/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, CSSProperties, ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import FormikField from '../../../components/FormikField';

interface InputCheckboxProps {
  display: CSSProperties['display'];
}
const StyledInputCheckbox = styled.input<InputCheckboxProps>`
  appearance: checkbox !important;
  margin-right: ${spacing.small};
  display: ${p => p.display};
  width: auto;
`;

interface Props extends ComponentProps<typeof FormikField> {
  display?: CSSProperties['display'];
}
const Checkbox = ({ display = 'block', children, ...rest }: Props) => {
  return (
    <FormikField {...rest}>
      {({ field }) => (
        <>
          <StyledInputCheckbox display={display} type="checkbox" checked={field.value} {...field} />
          {children}
        </>
      )}
    </FormikField>
  );
};

export default Checkbox;
