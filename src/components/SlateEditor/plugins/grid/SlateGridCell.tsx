/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { styled } from "@ndla/styled-system/jsx";
import { GridCellElement } from "./types";

interface Props extends RenderElementProps {
  editor: Editor;
  element: GridCellElement;
}

// TODO: We seem to render empty paragraphs in the grid cells, which messes with margin.

const GridCell = ({ attributes, children }: Props) => {
  return (
    <StyledGridCell {...attributes} data-testid="slate-grid-cell">
      {children}
    </StyledGridCell>
  );
};

const StyledGridCell = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    border: "1px solid",
    borderColor: "stroke.default",
    minWidth: "xxlarge",
    paddingInline: "medium",
  },
});

export default GridCell;
