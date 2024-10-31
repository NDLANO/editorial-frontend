/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Cross, Plus } from "@ndla/icons/action";
import { Audio } from "@ndla/icons/common";
import { Camera, H5P, Link, Video } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";

const StyledHStack = styled(HStack, {
  base: {
    marginTop: "xsmall",
  },
});

interface Props {
  types?: VisualElementType[];
  onSelect: Function;
}

export type VisualElementType = "image" | "video" | "h5p" | "url" | "audio";

const VisualElementMenu = ({ onSelect, types = ["image", "video", "h5p", "url"] }: Props) => {
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
      type: "image",
      component: <Camera />,
    },
    {
      type: "video",
      component: <Video />,
    },
    {
      type: "h5p",
      component: <H5P />,
    },
    {
      type: "url",
      component: <Link />,
    },
    {
      type: "audio",
      component: <Audio />,
    },
  ];

  return (
    <StyledHStack gap="xsmall">
      <Button variant="secondary" onClick={toggleIsOpen}>
        {isOpen ? <Cross /> : <Plus />}
      </Button>
      {isOpen &&
        visualElementButtons
          .filter((button) => types.find((type) => type === button.type))
          .map((button) => {
            return (
              <Button key={button.type} variant="secondary" onClick={() => handleSelect(button.type)}>
                {button.component}
              </Button>
            );
          })}
    </StyledHStack>
  );
};

export default VisualElementMenu;
