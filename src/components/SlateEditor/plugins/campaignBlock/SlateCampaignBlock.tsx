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
import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { CampaignBlock, EmbedWrapper } from "@ndla/ui";
import { CampaignBlockElement } from ".";
import CampaignBlockForm from "./CampaignBlockForm";
import { fetchImage } from "../../../../modules/image/imageApi";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: CampaignBlockElement;
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

const SlateCampaignBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const campaignBlock = element.data;
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  const onClose = useCallback(() => {
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
  }, [editor, element]);

  const onSave = useCallback(
    (data: CampaignBlockEmbedData) => {
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
    if (campaignBlock?.imageId) {
      fetchImage(campaignBlock.imageId).then((img) => setImage(img));
    }
  }, [campaignBlock?.imageId]);

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <EmbedWrapper {...attributes} data-testid="slate-campaign-block" contentEditable={false}>
        {campaignBlock && (
          <>
            <StyledFigureButtons data-white={true}>
              <ModalTrigger>
                <IconButton
                  size="small"
                  variant="secondary"
                  aria-label={t("campaignBlockForm.title")}
                  title={t("campaignBlockForm.title")}
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil />
                </IconButton>
              </ModalTrigger>
              <IconButton
                aria-label={t("campaignBlockForm.delete")}
                size="small"
                variant="danger"
                title={t("campaignBlockForm.delete")}
                data-testid="remove-campaign-block"
                onClick={handleRemove}
              >
                <DeleteForever />
              </IconButton>
            </StyledFigureButtons>
            <CampaignBlock
              title={campaignBlock.title}
              description={campaignBlock.description}
              headingLevel={campaignBlock.headingLevel}
              url={{ url: campaignBlock.url, text: campaignBlock.urlText }}
              image={
                image && {
                  src: image.image.imageUrl,
                  alt: image.alttext.alttext,
                }
              }
              imageSide={campaignBlock.imageSide}
            />
          </>
        )}
        {children}
        <ModalContent size={{ width: "large", height: "full" }}>
          <StyledModalHeader>
            <ModalTitle>{t("campaignBlockForm.title")}</ModalTitle>
            <ModalCloseButton />
          </StyledModalHeader>
          <StyledModalBody>
            <CampaignBlockForm initialData={campaignBlock} onSave={onSave} onCancel={onClose} />
          </StyledModalBody>
        </ModalContent>
      </EmbedWrapper>
    </Modal>
  );
};

export default SlateCampaignBlock;
