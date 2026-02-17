/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper, GridItem } from "@ndla/ui";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { GridCellForm } from "./GridCellForm";
import { GridCellElement } from "./types";

interface Props extends RenderElementProps {
  editor: Editor;
  element: GridCellElement;
}

const ButtonContainer = styled("div", {
  base: {
    position: "absolute",
    right: "3xsmall",
    top: "3xsmall",
    zIndex: "sticky",
  },
});

// TODO: We seem to render empty paragraphs in the grid cells, which messes with margin.

const GridCell = ({ editor, element, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    const path = ReactEditor.findPath(editor, element);
    setTimeout(() => Transforms.select(editor, path.concat([0, 0])), 0);
  };

  const onSave = useCallback(
    (data: GridCellElement["data"]) => {
      setOpen(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { data }, { at: path });
    },
    [editor, element],
  );

  return (
    <DialogRoot size="small" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <EmbedWrapper {...attributes}>
        <ButtonContainer contentEditable={false}>
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
              onMouseDown={(e) => e.preventDefault()}
              aria-label={t("gridCellForm.edit")}
              size="small"
              data-testid="edit-grid-cell-button"
            >
              <PencilFill />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("gridCellForm.edit")}</DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <GridCellForm onCancel={onClose} initialData={element.data} onSave={onSave} />
              </DialogBody>
            </DialogContent>
          </Portal>
        </ButtonContainer>
        <StyledGridCell data-testid="slate-grid-cell" border={element.data?.border === "true"}>
          {children}
        </StyledGridCell>
      </EmbedWrapper>
    </DialogRoot>
  );
};

const StyledGridCell = styled(GridItem, {
  base: {
    position: "relative",
    minWidth: "xxlarge",
    outlineWidth: "1px",
    outlineColor: "stroke.subtle",
    height: "100%",
  },
  variants: {
    border: {
      false: {
        outlineStyle: "dashed",
      },
      true: {
        outlineStyle: "solid",
      },
    },
  },
});

export default GridCell;
