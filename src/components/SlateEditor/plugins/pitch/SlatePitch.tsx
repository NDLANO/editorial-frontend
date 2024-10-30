/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import {
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { PitchEmbedData } from "@ndla/types-embed";
import { Pitch, EmbedWrapper } from "@ndla/ui";
import PitchForm from "./PitchForm";
import { PitchElement } from "./types";
import config from "../../../../config";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: PitchElement;
  editor: Editor;
}

const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/`;

const SlatePitch = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { data } = element;

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onSave = useCallback(
    (data: PitchEmbedData) => {
      setIsEditing(false);
      const properties = {
        data,
        isFirstEdit: false,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [editor, element],
  );

  return (
    <DialogRoot size="large" open={isEditing} onOpenChange={(details) => setIsEditing(details.open)}>
      <EmbedWrapper {...attributes} data-testid="slate-pitch" contentEditable={false}>
        {data && (
          <>
            <StyledFigureButtons>
              <DialogTrigger asChild>
                <IconButton
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(true)}
                  aria-label={t("pitchForm.title")}
                  title={t("pitchForm.title")}
                >
                  <Pencil />
                </IconButton>
              </DialogTrigger>
              <IconButton
                aria-label={t("delete")}
                variant="danger"
                size="small"
                title={t("delete")}
                data-testid="remove-pitch"
                onClick={handleRemove}
              >
                <DeleteForever />
              </IconButton>
            </StyledFigureButtons>
            <Pitch
              title={data.title}
              description={data.description}
              url={data.url}
              metaImage={{
                url: `${imageUrl}/${data.imageId}`,
                alt: "",
              }}
            />
          </>
        )}
        {children}
      </EmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pitchForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <PitchForm onSave={onSave} initialData={data} onCancel={onClose} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlatePitch;
