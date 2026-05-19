/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons";
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogBody,
  DialogHeader,
  IconButton,
  DialogTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CopyrightMetaData } from "@ndla/types-embed";
import { CopyrightEmbed, EmbedWrapper } from "@ndla/ui";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import MoveContentButton from "../../../MoveContentButton";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import { EmbedCopyrightForm } from "./EmbedCopyrightForm";
import { CopyrightElement } from "./types";

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  editor: Editor;
  element: CopyrightElement;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    "& [data-copyright-content]": {
      border: "1px solid",
      borderColor: "stroke.default",
      padding: "xsmall",
    },
  },
});

const ButtonContainer = styled(StyledFigureButtons, {
  base: {
    top: "-xlarge",
    right: 0,
  },
});

const SlateCopyright = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  const { handleRemove, handleUnwrap, handleSave, handleEditingChange, dialogProps } = useEditableElement(
    element,
    editor,
  );

  const embed: CopyrightMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: "success",
            data: undefined,
            embedData: element.data,
            resource: element.data?.resource,
          }
        : undefined,
    [element.data],
  );

  return (
    <StyledEmbedWrapper data-testid="slate-copyright-block" {...attributes}>
      <ButtonContainer contentEditable={false}>
        <DeleteButton aria-label={t("delete")} data-testid="delete-copyright" onClick={handleRemove} />
        <DialogRoot {...dialogProps}>
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("form.copyright.edit")}
              data-testid="edit-copyright"
              title={t("form.copyright.edit")}
            >
              <PencilFill />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("form.copyright.title")}</DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <EmbedCopyrightForm
                  embedData={element.data}
                  onCancel={() => handleEditingChange(false)}
                  onSave={(data) => handleSave({ data })}
                />
              </DialogBody>
            </DialogContent>
          </Portal>
        </DialogRoot>
        <MoveContentButton aria-label={t("form.moveContent")} data-testid="move-copyright" onClick={handleUnwrap} />
      </ButtonContainer>
      {!!embed && <CopyrightEmbed embed={embed}>{children}</CopyrightEmbed>}
    </StyledEmbedWrapper>
  );
};

export default SlateCopyright;
