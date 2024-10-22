/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import escapeHtml from "escape-html";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, NodeEntry, Text, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { BlogPost, BrushLine, Copyright } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { ContentTypeFramedContent, EmbedWrapper } from "@ndla/ui";
import { FramedContentElement } from ".";
import { TYPE_FRAMED_CONTENT } from "./types";
import { useArticleContentType } from "../../../ContentTypeProvider";
import DeleteButton from "../../../DeleteButton";
import { claudeHaikuDefaults, getTextFromHTML, invokeModel } from "../../../LLM/helpers";
import MoveContentButton from "../../../MoveContentButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { TYPE_COPYRIGHT } from "../copyright/types";
import { defaultCopyrightBlock } from "../copyright/utils";
import { StyledFigureButtons } from "../embed/FigureButtons";

const FigureButtons = styled(StyledFigureButtons)`
  position: absolute;
  top: -${spacing.large};
  right: 0;
  display: flex;
  justify-content: flex-end;
`;

interface Props extends RenderElementProps {
  editor: Editor;
  element: FramedContentElement;
}

const SlateFramedContent = (props: Props) => {
  const { element, editor, attributes, children } = props;
  const { t } = useTranslation();
  const language = useArticleLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const variant = element.data?.variant ?? "neutral";
  const contentType = useArticleContentType();
  const hasSlateCopyright = useMemo(() => {
    return element.children.some((child) => Element.isElement(child) && child.type === TYPE_COPYRIGHT);
  }, [element.children]);

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FRAMED_CONTENT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FRAMED_CONTENT,
      voids: true,
    });
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

  const serialize = (node: any) => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);
      if (node.bold) {
        string = `<strong>${string}</strong>`;
      }
      return string;
    }

    const children = node.children.map((n: any) => serialize(n)).join("");

    switch (node.type) {
      case "quote":
        return `<blockquote><p>${children}</p></blockquote>`;
      case "paragraph":
        return `<p>${children}</p>`;
      case "link":
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      default:
        return children;
    }
  };

  const generateQuestions = async () => {
    const articleHTML = await serialize(editor.children[0]);
    const articleText = getTextFromHTML(articleHTML);
    if (!articleText) {
      console.error("No article content provided to generate meta description");
      return;
    }
    setIsLoading(true);
    try {
      const generatedText = await invokeModel({
        prompt: t("textGeneration.reflectionQuestions.prompt", { language: t(`languages.${language}`) }) + articleText,
        ...claudeHaikuDefaults,
      });
      generatedText ? editor.insertText(generatedText) : console.error("No generated text");
    } catch (error) {
      console.error("Error generating reflection questions", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmbedWrapper draggable {...attributes}>
      <FigureButtons contentEditable={false}>
        <IconButton
          variant={variant === "colored" ? "primary" : "secondary"}
          size="small"
          title={t("textGeneration.reflectionQuestions.button")}
          aria-label={t("textGeneration.reflectionQuestions.button")}
          onClick={generateQuestions}
          loading={isLoading}
        >
          <BlogPost />
        </IconButton>
        {!hasSlateCopyright && (
          <IconButton
            variant="tertiary"
            size="small"
            aria-label={t("form.copyright.add")}
            title={t("form.copyright.add")}
            onClick={insertCopyright}
          >
            <Copyright />
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
