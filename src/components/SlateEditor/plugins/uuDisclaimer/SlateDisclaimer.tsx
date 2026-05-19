/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UuDisclaimerMetaData } from "@ndla/types-embed";
import { EmbedWrapper, UuDisclaimerEmbed } from "@ndla/ui";
import parse from "html-react-parser";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import MoveContentButton from "../../../MoveContentButton";
import { FinalFocusElementFunction, useEditableElement } from "../../utils/useEditableElement";
import DisclaimerForm from "./DisclaimerForm";
import { DisclaimerElement } from "./types";

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  editor: Editor;
  element: DisclaimerElement;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    "& [data-uu-content]": {
      border: "1px solid",
      borderColor: "stroke.default",
      marginBlockStart: "3xsmall",
      padding: "3xsmall",
    },
  },
});

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    right: "-xxlarge",
    gap: "3xsmall",
  },
});

const finalFocusEl: FinalFocusElementFunction = (_, path) => path.concat(0);

const SlateDisclaimer = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  const { handleSave, handleRemove, handleUnwrap, handleEditingChange, dialogProps } = useEditableElement(
    element,
    editor,
    {
      finalFocusEl,
    },
  );

  const embed: UuDisclaimerMetaData | undefined = useMemo(() => {
    if (!element.data) return undefined;

    const parsedContent = element.data?.disclaimer ? (parse(element.data?.disclaimer) as string) : "";

    return {
      status: "success",
      data: { transformedContent: parsedContent },
      embedData: element.data,
      resource: "uu-disclaimer",
    };
  }, [element.data]);

  return (
    <DialogRoot {...dialogProps}>
      <StyledEmbedWrapper data-testid="slate-disclaimer-block" {...attributes}>
        {!!embed && (
          <ButtonContainer contentEditable={false}>
            <DeleteButton aria-label={t("delete")} data-testid="delete-disclaimer" onClick={handleRemove} />
            <DialogTrigger asChild>
              <IconButton
                variant="tertiary"
                size="small"
                aria-label={t("form.disclaimer.edit")}
                data-testid="edit-disclaimer"
                title={t("form.disclaimer.edit")}
              >
                <PencilFill />
              </IconButton>
            </DialogTrigger>
            <MoveContentButton
              aria-label={t("form.moveContent")}
              data-testid="move-disclaimer"
              onClick={handleUnwrap}
            />
          </ButtonContainer>
        )}
        <DisclaimerOrChildren embed={embed}>{children}</DisclaimerOrChildren>
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("form.disclaimer.title")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DisclaimerForm
              initialData={embed?.embedData}
              onCancel={() => handleEditingChange(false)}
              onSave={(data) => handleSave({ data })}
            />
          </DialogContent>
        </Portal>
      </StyledEmbedWrapper>
    </DialogRoot>
  );
};

const DisclaimerOrChildren = ({
  embed,
  children,
}: {
  embed: UuDisclaimerMetaData | undefined;
  children: ReactNode;
}) => {
  // error can never happen.
  if (!embed || embed.status === "error") return children;
  return (
    <UuDisclaimerEmbed transformedDisclaimer={embed.data.transformedContent} embed={{ ...embed }}>
      {children}
    </UuDisclaimerEmbed>
  );
};

export default SlateDisclaimer;
