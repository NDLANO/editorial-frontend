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
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useEditableElement } from "../../utils/useEditableElement";
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
  const { handleEditingChange, handleSave, dialogProps } = useEditableElement(element, editor);

  return (
    <DialogRoot size="small" {...dialogProps}>
      <EmbedWrapper {...attributes}>
        <ButtonContainer contentEditable={false}>
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
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
                <GridCellForm
                  onCancel={() => handleEditingChange(false)}
                  initialData={element.data}
                  onSave={(data) => handleSave({ data })}
                />
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
