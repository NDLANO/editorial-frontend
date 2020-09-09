/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useState } from 'react';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import { Cross, Plus } from '@ndla/icons/action';
import { H5P, Camera, Video, Link } from '@ndla/icons/editor';
import { visualElementClasses } from '../FormikForm/components/FormikVisualElement';
import { defaultBlocks } from '../../components/SlateEditor/utils';

const visualElementButtonStyle = css`
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

interface Props {
  types: string[];
  onSelect: Function;
  editor: any;
  visualElement: any;
}

const VisualElementMenu: FC<Props> = ({
  onSelect,
  types = ['image', 'video', 'h5p', 'url'],
  editor,
  visualElement
}) => {
  const [isOpen, setOpen] = useState(false);
  const typeClassName = isOpen ? '' : 'hidden';

  const handleSelect = (type: string) => {
    console.log(visualElement)
    const blockToInsert = defaultBlocks.defaultEmbedBlock(visualElement);
    console.log(blockToInsert)
    editor.insertBlock(blockToInsert)
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
      <Button stripped css={visualElementButtonStyle} onClick={toggleIsOpen}>
        {isOpen ? <Cross /> : <Plus />}
      </Button>
      <div {...visualElementClasses('type', typeClassName)}>
        {visualElementButtons
          .filter(button => types.find(type => type === button.type))
          .map(button => {
            return (
              <Button
                stripped
                css={visualElementButtonStyle}
                onClick={() => handleSelect(button.type)}>
                {button.component}
              </Button>
            );
          })}
      </div>
    </div>
  );
};

export default VisualElementMenu;
