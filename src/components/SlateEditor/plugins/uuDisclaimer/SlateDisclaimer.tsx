/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UuDisclaimerEmbedData, UuDisclaimerMetaData } from "@ndla/types-embed";
import { EmbedWrapper, UuDisclaimerEmbed } from "@ndla/ui";
import DisclaimerForm from "./DisclaimerForm";
import { isDisclaimerElement } from "./queries";
import { DisclaimerElement } from "./types";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import MoveContentButton from "../../../MoveContentButton";

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

const SlateDisclaimer = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

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

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (open) return;
      ReactEditor.focus(editor);
      if (element.isFirstEdit) {
        Transforms.removeNodes(editor, {
          at: ReactEditor.findPath(editor, element),
          voids: true,
        });
      }
      const path = ReactEditor.findPath(editor, element);
      if (Editor.hasPath(editor, path)) {
        setTimeout(() => {
          Transforms.select(editor, path);
        }, 0);
      }
    },
    [editor, element],
  );

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path, match: isDisclaimerElement, voids: true });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const handleRemoveDisclaimer = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, { at: path, match: isDisclaimerElement, voids: true });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  const onSaveDisclaimerText = useCallback(
    (values: UuDisclaimerEmbedData) => {
      setOpen(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        {
          data: values,
          isFirstEdit: false,
        },
        { at: path },
      );
      setTimeout(() => {
        Transforms.select(editor, path.concat(0));
      }, 0);
    },
    [editor, element],
  );

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <StyledEmbedWrapper data-testid="slate-disclaimer-block" {...attributes}>
        {!!embed && (
          <>
            <ButtonContainer contentEditable={false}>
              <DeleteButton aria-label={t("delete")} data-testid="delete-disclaimer" onClick={handleDelete} />
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
                onMouseDown={handleRemoveDisclaimer}
              />
            </ButtonContainer>
            <UuDisclaimerEmbed transformedDisclaimer={embed.data.transformedContent} embed={{ ...embed }}>
              {children}
            </UuDisclaimerEmbed>
          </>
        )}
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("form.disclaimer.title")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DisclaimerForm initialData={embed?.embedData} onOpenChange={onOpenChange} onSave={onSaveDisclaimerText} />
          </DialogContent>
        </Portal>
      </StyledEmbedWrapper>
    </DialogRoot>
  );
};

export default SlateDisclaimer;
