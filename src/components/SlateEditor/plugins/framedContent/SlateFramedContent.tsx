/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, NodeEntry, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { BrushLine, Copyright } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { ContentTypeFramedContent } from "@ndla/ui";
import { FramedContentElement } from ".";
import { TYPE_FRAMED_CONTENT } from "./types";
import { useArticleContentType } from "../../../ContentTypeProvider";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";
import { TYPE_COPYRIGHT } from "../copyright/types";
import { defaultCopyrightBlock } from "../copyright/utils";

const StyledFramedContent = styled(ContentTypeFramedContent)`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: ${spacing.xsmall};
  justify-content: flex-end;
  flex: 0;
`;

const ChildrenWrapper = styled.div`
  flex: 1;
  padding: 0 ${spacing.medium} ${spacing.medium} ${spacing.medium};
`;

interface Props extends RenderElementProps {
  editor: Editor;
  element: FramedContentElement;
}

const SlateFramedContent = (props: Props) => {
  const { element, editor, attributes, children } = props;
  const { t } = useTranslation();
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

  return (
    <StyledFramedContent variant={variant} contentType={contentType} draggable {...attributes}>
      <ButtonContainer>
        {!hasSlateCopyright && (
          <IconButtonV2
            variant="ghost"
            aria-label={t("form.copyright.add")}
            title={t("form.copyright.add")}
            onClick={insertCopyright}
          >
            <Copyright />
          </IconButtonV2>
        )}
        <IconButton
          onClick={changeVariant}
          variant={variant === "colored" ? "primary" : "secondary"}
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
          colorTheme="danger"
          onMouseDown={onRemoveClick}
        />
      </ButtonContainer>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </StyledFramedContent>
  );
};

export default SlateFramedContent;
