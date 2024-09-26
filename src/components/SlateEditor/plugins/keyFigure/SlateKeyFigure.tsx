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
import styled from "@emotion/styled";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { KeyFigureEmbedData } from "@ndla/types-embed";
import { EmbedWrapper, KeyFigure } from "@ndla/ui";
import { KeyFigureElement } from ".";
import KeyFigureForm from "./KeyFigureForm";
import { fetchImage } from "../../../../modules/image/imageApi";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: KeyFigureElement;
  editor: Editor;
}

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
  h2 {
    margin: 0px;
  }
`;

const SlateKeyFigure = ({ element, editor, attributes, children }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean | undefined>(element.isFirstEdit);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const { t } = useTranslation();

  const { data } = element;

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

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
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <EmbedWrapper {...attributes} contentEditable={false} data-testid="slate-key-figure">
        {data && (
          <>
            <StyledFigureButtons>
              <ModalTrigger>
                <IconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("keyFigureForm.edit")}
                  title={t("keyFigureForm.edit")}
                >
                  <Pencil />
                </IconButton>
              </ModalTrigger>
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("delete")}
                title={t("delete")}
                data-testid="remove-key-figure"
                onClick={handleRemove}
              >
                <DeleteForever />
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
      <ModalContent>
        <StyledModalHeader>
          <ModalTitle>{t("keyFigureForm.title")}</ModalTitle>
          <ModalCloseButton />
        </StyledModalHeader>
        <StyledModalBody>
          <KeyFigureForm onSave={onSave} initialData={data} onCancel={onClose} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlateKeyFigure;
