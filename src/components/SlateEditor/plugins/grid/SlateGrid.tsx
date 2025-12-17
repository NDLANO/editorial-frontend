/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
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
import { EmbedWrapper, Grid, GridType } from "@ndla/ui";
import { GridProvider } from "./GridContext";
import GridForm from "./GridForm";
import { GridElement } from "./types";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";

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
  const [isEditing, setIsEditing] = useState(false);

  const handleRemove = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onClose = () => {
    setIsEditing(false);
    const path = ReactEditor.findPath(editor, element);
    setTimeout(() => Transforms.select(editor, path.concat([0, 0])), 0);
  };

  const onSave = useCallback(
    (data: GridType) => {
      setIsEditing(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { data }, { at: path });
    },
    [editor, element],
  );

  return (
    <DialogRoot open={isEditing} size="small" onOpenChange={(details) => setIsEditing(details.open)}>
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
                <GridForm onCancel={onClose} initialData={element.data} onSave={onSave} />
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
