/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, NodeEntry, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { BrushLine, CopyrightLine, FileListLine } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeFramedContent, EmbedWrapper } from "@ndla/ui";
import { FramedContentElement } from "./framedContentTypes";
import { isFramedContentElement } from "./queries/framedContentQueries";
import { AI_ACCESS_SCOPE } from "../../../../constants";
import { useMessages } from "../../../../containers/Messages/MessagesProvider";
import { useSession } from "../../../../containers/Session/SessionProvider";
import { ReflectionVariables } from "../../../../modules/llm/llmApiTypes";
import { useGenerateAIMutation } from "../../../../modules/llm/llmMutations";
import { editorValueToPlainText } from "../../../../util/articleContentConverter";
import { NdlaErrorPayload } from "../../../../util/resolveJsonOrRejectWithError";
import { useArticleContentType } from "../../../ContentTypeProvider";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { isCopyrightElement } from "../copyright/queries";
import { defaultCopyrightBlock } from "../copyright/utils";
import { StyledFigureButtons } from "../embed/FigureButtons";

const FigureButtons = styled(StyledFigureButtons, {
  base: {
    top: "-xlarge",
    right: 0,
  },
});

interface Props extends RenderElementProps {
  editor: Editor;
  element: FramedContentElement;
}

const SlateFramedContent = (props: Props) => {
  const { element, editor, attributes, children } = props;
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { createMessage } = useMessages();
  const language = useArticleLanguage();
  const generateReflectionMutation = useGenerateAIMutation<ReflectionVariables>();
  const variant = element.data?.variant ?? "neutral";
  const contentType = useArticleContentType();
  const hasAIAccess = userPermissions?.includes(AI_ACCESS_SCOPE);

  const hasSlateCopyright = useMemo(() => {
    return element.children.some((child) => isCopyrightElement(child));
  }, [element.children]);

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path, match: isFramedContentElement });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, { at: path, match: isFramedContentElement, voids: true });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  const changeVariant = () => {
    const newData = { variant: element.data?.variant === "colored" ? "neutral" : "colored" };
    Transforms.setNodes(editor, { data: newData }, { at: ReactEditor.findPath(editor, element) });
  };

  const insertCopyright = () => {
    const [node, path] = Editor.node(editor, ReactEditor.findPath(editor, element)) as NodeEntry<FramedContentElement>;
    Transforms.insertNodes(editor, defaultCopyrightBlock(), { at: path.concat(node.children.length) });
  };

  const generateQuestions = async () => {
    // TODO: Handle nested information and metadata from embeds
    const articleText = editorValueToPlainText(editor.children);

    await generateReflectionMutation
      .mutateAsync({
        type: "reflection",
        text: articleText,
        language: t(`languages.${language}`),
      })
      .then((res) => {
        const [node, path] = Editor.node(
          editor,
          ReactEditor.findPath(editor, element),
        ) as NodeEntry<FramedContentElement>;

        Transforms.insertNodes(
          editor,
          { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: res }] },
          { at: path.concat(node.children.length) },
        );
      })
      .catch((err: NdlaErrorPayload) =>
        createMessage({
          message: t("textGeneration.failed.reflection", { error: err.messages }),
          severity: "danger",
          timeToLive: 0,
        }),
      );
  };

  return (
    <EmbedWrapper draggable {...attributes}>
      <FigureButtons contentEditable={false}>
        {hasAIAccess ? (
          <IconButton
            variant={variant === "colored" ? "primary" : "secondary"}
            size="small"
            title={t("textGeneration.generate.reflection")}
            aria-label={t("textGeneration.generate.reflection")}
            onClick={generateQuestions}
            loading={generateReflectionMutation.isPending}
          >
            <FileListLine />
          </IconButton>
        ) : undefined}
        {!hasSlateCopyright && (
          <IconButton
            variant="secondary"
            size="small"
            aria-label={t("form.copyright.add")}
            title={t("form.copyright.add")}
            onClick={insertCopyright}
          >
            <CopyrightLine />
          </IconButton>
        )}
        <IconButton
          onClick={changeVariant}
          variant={variant === "colored" ? "primary" : "secondary"}
          size="small"
          title={t(`framedContentForm.changeVariant.${variant === "neutral" ? "colored" : "neutral"}`)}
          aria-label={t(`framedContentForm.changeVariant.${variant === "neutral" ? "colored" : "neutral"}`)}
        >
          <BrushLine />
        </IconButton>
        <MoveContentButton onMouseDown={onMoveContent} aria-label={t("form.moveContent")} />
        <DeleteButton
          aria-label={t("form.remove")}
          tabIndex={-1}
          data-testid="remove-framedContent"
          onMouseDown={onRemoveClick}
        />
      </FigureButtons>
      <ContentTypeFramedContent variant={variant} contentType={contentType}>
        {children}
      </ContentTypeFramedContent>
    </EmbedWrapper>
  );
};

export default SlateFramedContent;
