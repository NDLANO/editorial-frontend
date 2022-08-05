/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { Cross, Plus } from '@ndla/icons/action';
import { Camera, H5P, Link, Video } from '@ndla/icons/editor';
import { useState } from 'react';

const StyledButton = styled(Button)`
  height: 40px;
  width: 40px;
  border: 1px solid ${colors.brand.grey};
  border-radius: 25px;
  margin-right: 0.3rem;
  color: ${colors.brand.grey};

  &:focus,
  &:hover {
    color: ${colors.brand.grey};
    border: 1px solid ${colors.brand.grey};
    border-radius: 25px;
  }
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
    <div>
      <StyledButton stripped onClick={toggleIsOpen}>
        {isOpen ? <Cross /> : <Plus />}
      </StyledButton>
      <DisplayContainer hidden={!isOpen}>
        {visualElementButtons
          .filter(button => types.find(type => type === button.type))
          .map(button => {
            return (
              <StyledButton key={button.type} stripped onClick={() => handleSelect(button.type)}>
                {button.component}
              </StyledButton>
            );
          })}
      </DisplayContainer>
    </div>
  );
};

export default VisualElementMenu;
