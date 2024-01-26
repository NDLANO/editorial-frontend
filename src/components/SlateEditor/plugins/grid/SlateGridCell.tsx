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
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing, colors, stackOrder } from "@ndla/core";
import { Pin } from "@ndla/icons/common";
import { GridCellElement } from ".";

interface Props extends RenderElementProps {
  editor: Editor;
  element: GridCellElement;
}

const StyledButton = styled(IconButtonV2)`
  position: absolute;
  z-index: ${stackOrder.offsetDouble};
  top: ${spacing.xxsmall};
  right: ${spacing.xxsmall};
`;

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
      <StyledButton
        contentEditable={false}
        onClick={onClickSticky}
        variant={element.data?.parallaxCell === "true" ? "solid" : "ghost"}
        aria-label={label}
        title={label}
        data-testid="grid-cell-parallax"
      >
        <Pin />
      </StyledButton>
      {children}
    </StyledGridCell>
  );
};

const StyledGridCell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.brand.light};
  min-width: 50px;

  overflow-wrap: break-word;

  > p {
    padding: 0 ${spacing.xxsmall};
    word-break: break-word;
  }

  > div,
  > figure,
  > iframe {
    width: 100% !important;
    inset: 0;
  }
`;

export default GridCell;
