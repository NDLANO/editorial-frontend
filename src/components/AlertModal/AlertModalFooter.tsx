/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement } from 'react';
import Button from '@ndla/button';
import { uuid } from '@ndla/util';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const StyledButton = styled(Button)`
  background-color: white;
  margin-left: 0;
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
    'data-testid'?: string;
  }[];
}

const AlertModalFooter = ({ component, actions = [] }: Props) =>
  component ? (
    <>{component}</>
  ) : (
    <StyledFooter>
      {actions.map(action => {
        const { text, ...rest } = action;
        return (
          <StyledButton key={uuid()} outline {...rest}>
            {text}
          </StyledButton>
        );
      })}
    </StyledFooter>
  );

export default AlertModalFooter;
