/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill, DeleteBinLine } from "@ndla/icons";
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
import { ContactBlock, ContactBlockBackground } from "@ndla/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { SelectableEmbedWrapper } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import ContactBlockForm from "./ContactBlockForm";
import { ContactBlockElement } from "./types";

interface Props extends RenderElementProps {
  element: ContactBlockElement;
  editor: Editor;
}

const SlateContactBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const contactBlock = element.data;
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);
  const { handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  useEffect(() => {
    if (contactBlock?.imageId) {
      fetchImage(contactBlock.imageId).then((img) => setImage(img));
    }
  }, [contactBlock?.imageId, setImage]);

  return (
    <DialogRoot size="large" {...dialogProps}>
      <SelectableEmbedWrapper {...attributes} contentEditable={false} data-testid="slate-contact-block">
        {!!contactBlock && !!image && (
          <>
            <StyledFigureButtons>
              <DialogTrigger asChild>
                <IconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("contactBlockForm.edit")}
                  title={t("contactBlockForm.edit")}
                >
                  <PencilFill />
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
      </SelectableEmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactBlockForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <ContactBlockForm initialData={contactBlock} onSave={(data) => handleSave({ data })} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlateContactBlock;
