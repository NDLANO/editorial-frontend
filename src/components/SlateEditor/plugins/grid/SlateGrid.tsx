/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { Pencil } from "@ndla/icons/action";
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
import { GridElement } from ".";
import { GridProvider } from "./GridContext";
import GridForm from "./GridForm";
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

export const SlateGrid = ({ element, editor, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => Transforms.select(editor, Path.next(path)), 0);
    }
  };

  const onSave = useCallback(
    (data: GridType) => {
      setIsEditing(false);
      const properties = {
        data: data,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => Transforms.select(editor, Path.next(path)), 0);
      }
    },
    [editor, element],
  );

  return (
    <DialogRoot open={isEditing} size="small" onOpenChange={(details) => setIsEditing(details.open)}>
      <EmbedWrapper>
        <ButtonContainer>
          <DeleteButton aria-label={t("delete")} data-testid="remove-grid" onClick={handleRemove} />
          <DialogTrigger asChild>
            <IconButton variant="tertiary" aria-label={t("gridForm.title")} data-testid="edit-grid-button" size="small">
              <Pencil />
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
          <Grid border="none" columns={element.data.columns} background={element.data.background}>
            {children}
          </Grid>
        </GridProvider>
      </EmbedWrapper>
    </DialogRoot>
  );
};
