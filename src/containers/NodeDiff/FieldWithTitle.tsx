/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldWithTitle = ({ title, children }: Props) => {
  return (
    <StyledDiv>
      <strong>{title}</strong>
      {children}
    </StyledDiv>
  );
};

export default FieldWithTitle;
