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
import { DeleteBinLine, PencilFill } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { CampaignBlock, EmbedWrapper } from "@ndla/ui";
import { CampaignBlockElement } from ".";
import CampaignBlockForm from "./CampaignBlockForm";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: CampaignBlockElement;
  editor: Editor;
}

const SlateCampaignBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const campaignBlock = element.data;
  const [image, setImage] = useState<IImageMetaInformationV3DTO | undefined>(undefined);

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const onOpenChange = useCallback(
    (open: boolean) => {
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
    },
    [editor, element],
  );

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

  const handleRemove = useCallback(() => {
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
  }, [editor, element]);

  return (
    <DialogRoot size="large" open={isEditing} onOpenChange={(details) => onOpenChange(details.open)}>
      <EmbedWrapper {...attributes} data-testid="slate-campaign-block" contentEditable={false}>
        {!!campaignBlock && (
          <>
            <StyledFigureButtons data-white={true}>
              <DialogTrigger asChild>
                <IconButton
                  size="small"
                  variant="secondary"
                  aria-label={t("campaignBlockForm.title")}
                  title={t("campaignBlockForm.title")}
                  onClick={() => setIsEditing(true)}
                >
                  <PencilFill />
                </IconButton>
              </DialogTrigger>
              <IconButton
                aria-label={t("campaignBlockForm.delete")}
                size="small"
                variant="danger"
                title={t("campaignBlockForm.delete")}
                data-testid="remove-campaign-block"
                onClick={handleRemove}
              >
                <DeleteBinLine />
              </IconButton>
            </StyledFigureButtons>
            <CampaignBlock
              title={campaignBlock.title}
              description={campaignBlock.description}
              headingLevel={campaignBlock.headingLevel}
              url={{ url: campaignBlock.url, text: campaignBlock.urlText }}
              image={
                image
                  ? {
                      src: image.image.imageUrl,
                      alt: image.alttext.alttext,
                    }
                  : undefined
              }
              imageSide={campaignBlock.imageSide}
            />
          </>
        )}
        {children}
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("campaignBlockForm.title")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <CampaignBlockForm initialData={campaignBlock} onSave={onSave} />
            </DialogBody>
          </DialogContent>
        </Portal>
      </EmbedWrapper>
    </DialogRoot>
  );
};

export default SlateCampaignBlock;
