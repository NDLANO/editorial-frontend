/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Cross, Plus } from '@ndla/icons/action';
import { Camera, H5P, Link, Video } from '@ndla/icons/editor';
import { useState } from 'react';

const StyledButton = styled(ButtonV2)`
  border-radius: 100%;
  height: 40px;
  width: 40px;
  border: 1px solid ${colors.brand.greyMedium};
  color: ${colors.brand.grey};
  svg {
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

interface StyledDivProps {
  hidden?: boolean;
}

const DisplayContainer = styled.div<StyledDivProps>`
  display: ${p => (p.hidden ? 'none' : 'inline-block')};
`;

interface Props {
  types?: string[];
  onSelect: Function;
}

const VisualElementMenu = ({ onSelect, types = ['image', 'video', 'h5p', 'url'] }: Props) => {
  const [isOpen, setOpen] = useState(false);

  const handleSelect = (type: string) => {
    setOpen(false);
    onSelect(type);
  };

  const toggleIsOpen = () => {
    setOpen(!isOpen);
  };
  const visualElementButtons = [
    {
      type: 'image',
      component: <Camera />,
    },
    {
      type: 'video',
      component: <Video />,
    },
    {
      type: 'h5p',
      component: <H5P />,
    },
    {
      type: 'url',
      component: <Link />,
    },
  ];

  return (
    <ButtonContainer>
      <StyledButton variant="outline" onClick={toggleIsOpen} colorTheme="lighter">
        {isOpen ? <Cross /> : <Plus />}
      </StyledButton>
      {isOpen &&
        visualElementButtons
          .filter(button => types.find(type => type === button.type))
          .map(button => {
            return (
              <StyledButton
                key={button.type}
                variant="outline"
                colorTheme="lighter"
                onClick={() => handleSelect(button.type)}>
                {button.component}
              </StyledButton>
            );
          })}
    </ButtonContainer>
  );
};

export default VisualElementMenu;
