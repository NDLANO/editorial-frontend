/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { transform } from "@ndla/article-converter";
import { PencilFill } from "@ndla/icons";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UuDisclaimerEmbedData, UuDisclaimerMetaData } from "@ndla/types-embed";
import { EmbedWrapper, UuDisclaimerEmbed } from "@ndla/ui";
import DisclaimerForm from "./DisclaimerForm";
import { DisclaimerElement, TYPE_DISCLAIMER } from "./types";
import { usePreviewArticle } from "../../../../modules/article/articleGqlQueries";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import MoveContentButton from "../../../MoveContentButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setModalOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const articleLanguage = useArticleLanguage();

  const articleContentData = usePreviewArticle(element.data?.disclaimer, articleLanguage, undefined, false, {
    enabled: !!element.data?.disclaimer.length,
  });

  const transformedContent = useMemo(() => {
    return transform(articleContentData?.data ?? "", {});
  }, [articleContentData?.data]);

  const embed: UuDisclaimerMetaData | undefined = useMemo(() => {
    if (!element.data) return undefined;

    return {
      status: "success",
      data: { transformedContent: "" },
      embedData: element.data,
      resource: "uu-disclaimer",
    };
  }, [element]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      setModalOpen(open);
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

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DISCLAIMER,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const handleRemoveDisclaimer = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DISCLAIMER,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onSaveDisclaimerText = useCallback(
    (values: UuDisclaimerEmbedData) => {
      setModalOpen(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        {
          data: values,
          isFirstEdit: false,
        },
        { at: path },
      );
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [setModalOpen, editor, element],
  );

  return (
    <DialogRoot
      open={modalOpen}
      onOpenChange={(details) => onOpenChange(details.open)}
      onInteractOutside={(e) => e.preventDefault()}
      onPointerDownOutside={() => onOpenChange(false)}
    >
      <StyledEmbedWrapper data-testid="slate-disclaimer-block" {...attributes}>
        {!!embed && !!transformedContent && (
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
            <UuDisclaimerEmbed transformedDisclaimer={transformedContent} embed={{ ...embed }}>
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
