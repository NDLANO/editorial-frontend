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
import { EmbedWrapper, Grid } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useEditableElement } from "../../utils/useEditableElement";
import { GridProvider } from "./GridContext";
import GridForm from "./GridForm";
import { GridElement } from "./types";

interface Props extends RenderElementProps {
  element: GridElement;
  editor: Editor;
}

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    right: "-xlarge",
    gap: "3xsmall",
  },
});

export const SlateGrid = ({ element, editor, children, attributes }: Props) => {
  const { t } = useTranslation();
  const { handleRemove, handleSave, handleEditingChange, dialogProps } = useEditableElement(element, editor);

  return (
    <DialogRoot size="small" {...dialogProps}>
      <EmbedWrapper>
        <ButtonContainer>
          <DeleteButton aria-label={t("delete")} data-testid="remove-grid" onClick={handleRemove} />
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
              onMouseDown={(e) => e.preventDefault()}
              aria-label={t("gridForm.title")}
              data-testid="edit-grid-button"
              size="small"
            >
              <PencilFill />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("gridForm.title")}</DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <GridForm
                  onCancel={() => handleEditingChange(false)}
                  initialData={element.data}
                  onSave={(data) => handleSave({ data })}
                />
              </DialogBody>
            </DialogContent>
          </Portal>
        </ButtonContainer>
        <GridProvider value={true}>
          <Grid border={element.data.border} columns={element.data.columns} {...attributes}>
            {children}
          </Grid>
        </GridProvider>
      </EmbedWrapper>
    </DialogRoot>
  );
};
