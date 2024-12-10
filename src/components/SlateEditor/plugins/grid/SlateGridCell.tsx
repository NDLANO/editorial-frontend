/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { PushpinFill } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GridCellElement } from ".";

interface Props extends RenderElementProps {
  editor: Editor;
  element: GridCellElement;
}

const StyledIconButton = styled(IconButton, {
  base: {
    position: "absolute",
    zIndex: "docked",
    top: "4xsmall",
    right: "4xsmall",
  },
});

// TODO: Having the sticky button messes with the actual styling of the cell (I think)
// TODO: We seem to render empty paragraphs in the grid cells, which messes with margin.

const GridCell = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const onClickSticky = useCallback(() => {
    const parallaxCell = element.data?.parallaxCell === "true" ? "false" : "true";
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { data: { ...element.data, parallaxCell } }, { at: path });
  }, [editor, element]);

  const label = useMemo(
    () => (element.data?.parallaxCell !== "true" ? t("gridForm.setSticky") : t("gridForm.unsetSticky")),
    [t, element.data?.parallaxCell],
  );

  return (
    <StyledGridCell {...attributes} data-testid="slate-grid-cell">
      <StyledIconButton
        contentEditable={false}
        onClick={onClickSticky}
        variant={element.data?.parallaxCell === "true" ? "primary" : "tertiary"}
        aria-label={label}
        title={label}
        size="small"
        data-testid="grid-cell-parallax"
      >
        <PushpinFill />
      </StyledIconButton>
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
  },
});

export default GridCell;
