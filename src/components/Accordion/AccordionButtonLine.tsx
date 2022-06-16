/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, ReactNode } from 'react';

import { css, SerializedStyles } from '@emotion/core';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
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

const buttonLineStyle = (styledAppearance: AccordionType) => css`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.6rem 0;

  ${appearances[styledAppearance]};
`;

interface Props {
  appearance: AccordionType;
  children: ReactElement | ReactElement[];
  addButton?: ReactNode;
  handleToggle: () => void;
}

const AccordionButtonLine = ({ appearance, handleToggle, addButton, children }: Props) => {
  if (addButton) {
    return <div css={buttonLineStyle(appearance)}>{children}</div>;
  }
  return (
    <Button css={buttonLineStyle(appearance)} stripped onClick={handleToggle}>
      {children}
    </Button>
  );
};

export default AccordionButtonLine;
