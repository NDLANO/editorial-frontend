/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDroppable } from "@dnd-kit/core";
import { styled } from "@ndla/styled-system/jsx";
import { memo } from "react";
import { Element } from "slate";

const StyledDropArea = styled("div", {
  base: {
    width: "100%",
    height: "4xsmall",
    position: "absolute",
  },
  variants: {
    variant: {
      top: {
        top: "0%",
      },
      bottom: {
        bottom: "0%",
      },
    },
    visible: {
      true: {
        background: "stroke.default",
      },
    },
  },
});

interface Props {
  element: Element;
  position: "top" | "bottom";
  accepts?: Element["type"][];
}
export const DropArea = memo(({ element, position, accepts }: Props) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `${element.id}-${position}`,
    data: { element, position: position, accepts },
    disabled: !!accepts && accepts.length === 0,
  });

  return (
    <StyledDropArea
      data-embed-wrapper=""
      contentEditable={false}
      ref={setNodeRef}
      visible={!!isOver && (!accepts || !!accepts.includes(active?.data.current?.element.type ?? ""))}
      variant={position}
    />
  );
});
