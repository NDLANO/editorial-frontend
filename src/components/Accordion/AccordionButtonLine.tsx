/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { AccordionType } from './Accordion';

const appearances: Record<AccordionType, SerializedStyles> = {
  resourceGroup: css`
    &,
    &:hover {
      padding: 0;
      color: white;
      height: 50px;
      background: linear-gradient(180deg, white, ${colors.brand.greyLighter});
      border: 1px solid ${colors.brand.greyLighter};
    }
  `,
  taxonomy: css`
    &,
    &:hover {
      padding: 0;
      color: white;
      height: 50px;
      background: ${colors.brand.secondary};
      border: none;
    }
  `,
};

const StyledWrapper = styled('div')<{ styledAppearance: AccordionType }>`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.6rem 0;
  border-radius: 4px;
  ${props => appearances[props.styledAppearance]};
`;

interface Props {
  appearance: AccordionType;
  children: ReactElement | ReactElement[];
}

const AccordionButtonLine = ({ appearance, children }: Props) => {
  return <StyledWrapper styledAppearance={appearance}>{children}</StyledWrapper>;
};

export default AccordionButtonLine;
