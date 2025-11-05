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
import { PencilFill, DeleteBinLine } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { KeyFigureEmbedData } from "@ndla/types-embed";
import { EmbedWrapper, KeyFigure } from "@ndla/ui";
import KeyFigureForm from "./KeyFigureForm";
import { KeyFigureElement } from "./types";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: KeyFigureElement;
  editor: Editor;
}

const SlateKeyFigure = ({ element, editor, attributes, children }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean | undefined>(false);
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const { data } = element;

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

  const onOpenChange = (open: boolean) => {
    setIsEditing(open);
    if (open) return;
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
    (data: KeyFigureEmbedData) => {
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
    [element, editor],
  );

  useEffect(() => {
    if (data?.imageId) {
      fetchImage(data.imageId).then((image) => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [data?.imageId, setImage]);

  return (
    <DialogRoot size="large" open={isEditing} onOpenChange={(details) => onOpenChange(details.open)}>
      <EmbedWrapper {...attributes} contentEditable={false} data-testid="slate-key-figure">
        {!!data && (
          <>
            <StyledFigureButtons>
              <DialogTrigger asChild>
                <IconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("keyFigureForm.edit")}
                  title={t("keyFigureForm.edit")}
                >
                  <PencilFill />
                </IconButton>
              </DialogTrigger>
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("delete")}
                title={t("delete")}
                data-testid="remove-key-figure"
                onClick={handleRemove}
              >
                <DeleteBinLine />
              </IconButton>
            </StyledFigureButtons>
            <KeyFigure
              title={data.title}
              subtitle={data.subtitle}
              image={image ? { src: image.image.imageUrl, alt: image.alttext.alttext } : undefined}
            />
          </>
        )}
        {children}
      </EmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("keyFigureForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <KeyFigureForm onSave={onSave} initialData={data} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlateKeyFigure;
