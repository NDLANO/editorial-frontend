/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { styled } from "@ndla/styled-system/jsx";

const StyledDragOverlay = styled(
  DragOverlay,
  {
    base: {
      opacity: "0.5",
    },
  },
  { baseComponent: true },
);

export const SlateDragOverlay = () => {
  const [activeElement, setActiveElement] = useState<ReactNode | null>(null);

  useDndMonitor({
    onDragStart: ({ active }) => {
      setActiveElement(active.data.current?.children);
    },
    onDragEnd: () => {
      setActiveElement(null);
    },
  });

  return <StyledDragOverlay>{activeElement}</StyledDragOverlay>;
};
