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
import { Pencil, DeleteBinLine } from "@ndla/icons/action";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { ContactBlock, ContactBlockBackground, EmbedWrapper } from "@ndla/ui";
import { ContactBlockElement } from ".";
import ContactBlockForm from "./ContactBlockForm";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: ContactBlockElement;
  editor: Editor;
}

const SlateContactBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const contactBlock = element.data;
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const onClose = () => {
    ReactEditor.focus(editor);
    setIsEditing(false);
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
    (data: ContactBlockEmbedData) => {
      setIsEditing(false);

      const properties = {
        data: data,
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
    [setIsEditing, editor, element],
  );

  useEffect(() => {
    if (contactBlock?.imageId) {
      fetchImage(contactBlock.imageId).then((img) => setImage(img));
    }
  }, [contactBlock?.imageId, setImage]);

  const handleRemove = () =>
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });

  return (
    <DialogRoot size="large" open={isEditing} onOpenChange={(details) => setIsEditing(details.open)}>
      <EmbedWrapper {...attributes} contentEditable={false} data-testid="slate-contact-block">
        {contactBlock && image && (
          <>
            <StyledFigureButtons>
              <DialogTrigger asChild>
                <IconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("contactBlockForm.edit")}
                  title={t("contactBlockForm.edit")}
                >
                  <Pencil />
                </IconButton>
              </DialogTrigger>
              <IconButton
                aria-label={t("contactBlockForm.delete")}
                title={t("contactBlockForm.delete")}
                variant="danger"
                size="small"
                onClick={handleRemove}
                data-testid="remove-contact-block"
              >
                <DeleteBinLine />
              </IconButton>
            </StyledFigureButtons>
            <ContactBlock
              image={image}
              embedAlt={element.data?.alt}
              jobTitle={contactBlock.jobTitle}
              name={contactBlock.name}
              description={contactBlock.description}
              email={contactBlock.email}
              backgroundColor={contactBlock.background as ContactBlockBackground | undefined}
            />
          </>
        )}
        {children}
      </EmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactBlockForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <ContactBlockForm initialData={contactBlock} onSave={onSave} onCancel={onClose} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlateContactBlock;
