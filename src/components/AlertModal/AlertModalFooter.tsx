/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";

const StyledButton = styled(ButtonV2)`
  background-color: white;
  margin-left: 0;
  &:only-child {
    margin-left: auto;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: ${spacing.small};
`;

interface Props {
  component?: ReactElement[] | ReactElement;
  actions?: {
    text: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    "data-testid"?: string;
  }[];
}

const AlertModalFooter = ({ component, actions = [] }: Props) =>
  component ? (
    <>{component}</>
  ) : (
    <StyledFooter>
      {actions.map((action, id) => {
        const { text, ...rest } = action;
        return (
          <StyledButton key={id} variant="outline" {...rest}>
            {text}
          </StyledButton>
        );
      })}
    </StyledFooter>
  );

export default AlertModalFooter;
