/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { CampaignBlock } from "@ndla/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { SelectableEmbedWrapper } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import CampaignBlockForm from "./CampaignBlockForm";
import { CampaignBlockElement } from "./types";

interface Props extends RenderElementProps {
  element: CampaignBlockElement;
  editor: Editor;
}

const SlateCampaignBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const campaignBlock = element.data;
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);
  const { handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  useEffect(() => {
    if (campaignBlock?.imageId) {
      fetchImage(campaignBlock.imageId).then((img) => setImage(img));
    }
  }, [campaignBlock?.imageId]);

  return (
    <DialogRoot size="large" {...dialogProps}>
      <SelectableEmbedWrapper {...attributes} data-testid="slate-campaign-block" contentEditable={false}>
        {!!campaignBlock && (
          <>
            <StyledFigureButtons data-white={true}>
              <DialogTrigger asChild>
                <IconButton
                  size="small"
                  variant="secondary"
                  aria-label={t("campaignBlockForm.title")}
                  title={t("campaignBlockForm.title")}
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
              <CampaignBlockForm initialData={campaignBlock} onSave={(data) => handleSave({ data })} />
            </DialogBody>
          </DialogContent>
        </Portal>
      </SelectableEmbedWrapper>
    </DialogRoot>
  );
};

export default SlateCampaignBlock;
