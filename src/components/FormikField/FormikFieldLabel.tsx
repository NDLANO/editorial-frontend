/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";

interface Props {
  name: string;
  label?: string;
  noBorder?: boolean;
}

const StyledLabel = styled.label`
  display: none !important;
`;

const FormikFieldLabel = ({ label, noBorder, name }: Props) => {
  if (!label) {
    return null;
  }
  if (!noBorder) {
    return <label htmlFor={name}>{label}</label>;
  }
  return <StyledLabel htmlFor={name}>{label}</StyledLabel>;
};

export default FormikFieldLabel;
