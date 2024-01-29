/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";

const StyledContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  > * {
    width: 100%;
  }
  & form {
    background-color: white;
  }
`;

interface Props {
  children: ReactNode;
}

const AddResourceModal = ({ children }: Props) => {
  return <StyledContent>{children}</StyledContent>;
};

export default AddResourceModal;
