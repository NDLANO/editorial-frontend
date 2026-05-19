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
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { Pitch } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import config from "../../../../config";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { SelectableEmbedWrapper } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import PitchForm from "./PitchForm";
import { PitchElement } from "./types";

interface Props extends RenderElementProps {
  element: PitchElement;
  editor: Editor;
}

const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/`;

const SlatePitch = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const { handleEditingChange, handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);
  const { data } = element;

  return (
    <DialogRoot size="large" {...dialogProps}>
      <SelectableEmbedWrapper {...attributes} data-testid="slate-pitch" contentEditable={false}>
        {!!data && (
          <>
            <StyledFigureButtons>
              <DialogTrigger asChild>
                <IconButton
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditingChange(true)}
                  aria-label={t("pitchForm.title")}
                  title={t("pitchForm.title")}
                >
                  <PencilFill />
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
                <DeleteBinLine />
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
      </SelectableEmbedWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pitchForm.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <PitchForm
              onSave={(data) => handleSave({ data })}
              initialData={data}
              onCancel={() => handleEditingChange(false)}
            />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default SlatePitch;
