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
  DialogTitle,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { KeyFigure } from "@ndla/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { fetchImage } from "../../../../modules/image/imageApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { SelectableEmbedWrapper } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import KeyFigureForm from "./KeyFigureForm";
import { KeyFigureElement } from "./types";

interface Props extends RenderElementProps {
  element: KeyFigureElement;
  editor: Editor;
}

const SlateKeyFigure = ({ element, editor, attributes, children }: Props) => {
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);
  const { t } = useTranslation();

  const { handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  const { data } = element;

  useEffect(() => {
    if (data?.imageId) {
      fetchImage(data.imageId).then((image) => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [data?.imageId, setImage]);

  return (
    <DialogRoot size="large" {...dialogProps}>
      <SelectableEmbedWrapper {...attributes} contentEditable={false} data-testid="slate-key-figure">
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
      </SelectableEmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("keyFigureForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <KeyFigureForm onSave={(data) => handleSave({ data })} initialData={data} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlateKeyFigure;
