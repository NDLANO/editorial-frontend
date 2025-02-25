/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { CloseLine, AddLine, VoiceprintLine, CameraFill, H5P, LinkMedium, MovieLine } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    marginBlockStart: "xsmall",
    flexDirection: "row",
    gap: "xsmall",
  },
});

interface Props {
  types?: VisualElementType[];
  onSelect: (type: string) => void;
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
      component: <CameraFill />,
    },
    {
      type: "video",
      component: <MovieLine />,
    },
    {
      type: "h5p",
      component: <H5P />,
    },
    {
      type: "url",
      component: <LinkMedium />,
    },
    {
      type: "audio",
      component: <VoiceprintLine />,
    },
  ];

  const filteredButtons = visualElementButtons.filter((button) => types.find((type) => type === button.type));

  if (filteredButtons.length === 1) {
    const [button] = filteredButtons;
    return (
      <Button key={button.type} variant="secondary" onClick={() => handleSelect(button.type)}>
        {button.component}
      </Button>
    );
  }
  return (
    <ButtonWrapper>
      <Button variant="secondary" onClick={toggleIsOpen}>
        {isOpen ? <CloseLine /> : <AddLine />}
      </Button>
      {!!isOpen &&
        filteredButtons.map((button) => {
          return (
            <Button key={button.type} variant="secondary" onClick={() => handleSelect(button.type)}>
              {button.component}
            </Button>
          );
        })}
    </ButtonWrapper>
  );
};

export default VisualElementMenu;
