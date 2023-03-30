/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement } from 'react';
import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const StyledButton = styled(ButtonV2)`
  background-color: white;
  margin-left: 0;
`;

const StyledFooter = styled.div<{ buttonCount: number }>`
  display: flex;
  justify-content: ${(p) => (p.buttonCount === 1 ? 'flex-end' : 'space-between')};
  align-items: flex-end;
  margin-top: ${spacing.small};
`;

interface Props {
  component?: ReactElement[] | ReactElement;
  actions?: {
    text: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    'data-testid'?: string;
  }[];
}

const AlertModalFooter = ({ component, actions = [] }: Props) =>
  component ? (
    <>{component}</>
  ) : (
    <StyledFooter buttonCount={actions.length ?? 0}>
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
