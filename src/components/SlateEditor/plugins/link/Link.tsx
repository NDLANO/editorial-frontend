/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseSelection, Editor, Node, Transforms, Element } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Portal } from "@radix-ui/react-portal";
import { colors, spacing, stackOrder } from "@ndla/core";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { ContentLinkElement, LinkElement } from ".";
import EditLink from "./EditLink";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "./types";
import config from "../../../../config";
import { toEditGenericArticle, toLearningpathFull } from "../../../../util/routeHelpers";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { InlineBugfix } from "../../utils/InlineBugFix";

interface StyledLinkMenuProps {
  top: number;
  left: number;
}

const StyledLinkMenu = styled.div<StyledLinkMenuProps>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  padding: calc(${spacing.small} / 2);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid ${colors.brand.greyLight};
  z-index: ${stackOrder.offsetSingle};
  &[data-visible="false"] {
    display: none;
  }
`;

const fetchResourcePath = (node: ContentLinkElement, language: string, contentType: string) => {
  const id = node.data.contentId;
  return contentType === "learningpath"
    ? toLearningpathFull(id, language)
    : `${config.editorialFrontendDomain}${toEditGenericArticle(id)}`;
};

function hasHrefOrContentId(node: LinkElement | ContentLinkElement) {
  if (node.type === "content-link") {
    return !!node.data.contentId;
  } else {
    return !!node.href;
  }
}

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: LinkElement | ContentLinkElement;
  children: JSX.Element;
}

export interface Model {
  href: string;
  text: string;
  checkbox: boolean;
}

const StyledLink = styled.a`
  color: ${colors.brand.primary};
  cursor: text;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`;

const Link = ({ attributes, editor, element, children }: Props) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [model, setModel] = useState<Model | undefined>();
  const startOpen = useRef(!hasHrefOrContentId(element));
  const [editMode, setEditMode] = useState(!hasHrefOrContentId(element));
  const [editorSelection, setEditorSelection] = useState<BaseSelection | undefined>(undefined);
  const [selected, setSelected] = useState<boolean>(false);
  const language = useArticleLanguage();
  const { t } = useTranslation();

  const getMenuPosition = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  };

  const focusEditor = useCallback(() => {
    if (editorSelection) {
      ReactEditor.focus(editor);
      setTimeout(() => Transforms.select(editor, editorSelection), 0);
    }
  }, [editor, editorSelection]);

  const toggleEditMode = useCallback(
    (open: boolean) => {
      if (!open) {
        focusEditor();
      }
      setEditMode(open);
    },
    [focusEditor],
  );

  const handleRemove = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      match: (node) => Element.isElement(node) && (node.type === TYPE_LINK || node.type === TYPE_CONTENT_LINK),
      at: path,
    });
    ReactEditor.focus(editor);
  };

  useEffect(() => {
    const setStateFromNode = async () => {
      let href;
      let checkbox;
      if (element.type === "content-link") {
        const contentType = element.data.contentType || "article";
        href = `${fetchResourcePath(element, language, contentType)}`;
        checkbox = element.data.openIn === "new-context";
      } else {
        href = element.href;
        checkbox = element.target === "_blank";
      }

      setModel({
        href,
        text: Node.string(element),
        checkbox,
      });
    };
    setStateFromNode();
  }, [element, language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setSelected(false);
      const targetNode = event.target as Node | null;
      if (targetNode instanceof HTMLElement && linkRef.current && linkRef.current.contains(targetNode)) {
        setSelected(true);
      }
    };
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [setSelected, selected]);

  const { top, left } = getMenuPosition();

  return (
    <Modal defaultOpen={startOpen.current} open={editMode} onOpenChange={toggleEditMode}>
      <StyledLink {...attributes} href={model?.href} ref={linkRef}>
        <InlineBugfix />
        {children}
        <InlineBugfix />
        {model && (
          <Portal asChild>
            <StyledLinkMenu
              top={top}
              left={left}
              data-visible={selected}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditorSelection(editor.selection);
              }}
            >
              <ModalTrigger>
                <Button variant="link">{t("form.content.link.change")}</Button>
              </ModalTrigger>{" "}
              | {t("form.content.link.goTo")}{" "}
              <a href={model?.href} target="_blank" rel="noopener noreferrer">
                {model?.href}
              </a>
            </StyledLinkMenu>
          </Portal>
        )}
      </StyledLink>
      <ModalContent
        onEscapeKeyDown={(e) => e.stopPropagation()}
        onCloseAutoFocus={(e) => {
          if (!model?.href) {
            handleRemove();
          }
          e.preventDefault();
          focusEditor();
        }}
      >
        {model && (
          <EditLink
            editor={editor}
            element={element}
            model={model}
            closeEditMode={() => toggleEditMode(false)}
            handleRemove={handleRemove}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default Link;
