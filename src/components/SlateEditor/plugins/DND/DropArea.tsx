/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDroppable } from "@dnd-kit/core";
import { styled } from "@ndla/styled-system/jsx";

const StyledDropArea = styled("div", {
  base: {
    width: "100%",
    height: "4xsmall",
    position: "absolute",
  },
  variants: {
    variant: { top: { top: "-xxsmall" }, bottom: {} },
    visible: {
      true: {
        background: "surface.action.brand.2",
      },
    },
  },
});

interface Props {
  elementId: string;
  position: "top" | "bottom";
}

const DropArea = ({ elementId, position }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${elementId}-${position}`,
    data: { nodeId: elementId, position: position },
  });

  return <StyledDropArea contentEditable={false} ref={setNodeRef} visible={isOver} variant={position} />;
};
export default DropArea;
