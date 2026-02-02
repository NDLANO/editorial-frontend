/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { isElementOfType } from "@ndla/editor";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentLinkEmbedData } from "@ndla/types-embed";
import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Transforms, Path } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { ContentLinkElement, LinkElement } from ".";
import config from "../../../../config";
import { routes, toEditGenericArticle } from "../../../../util/routeHelpers";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { InlineBugfix } from "../../utils/InlineBugFix";
import LinkForm from "./LinkForm";
import { LinkData, LinkEmbedData, LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE } from "./types";

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    flexDirection: "row",
    gap: "xsmall",
    zIndex: "dropdown",
  },
});

const getResourcePath = (node: ContentLinkElement, language: string, contentType: string) => {
  const id = node.data.contentId;
  return contentType === "learningpath"
    ? `${config.editorialFrontendDomain}${routes.learningpath.edit(parseInt(id), language)}`
    : `${config.editorialFrontendDomain}${toEditGenericArticle(id)}`;
};

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

const Link = ({ attributes, editor, element, children }: Props) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const editorWrapperRef = useRef<HTMLElement>(null);
  const [editMode, setEditMode] = useState(false);
  const language = useArticleLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (linkRef.current) {
      editorWrapperRef.current = linkRef.current.closest("[data-slate-wrapper]");
    }
  }, []);

  useEffect(() => {
    setEditMode(!!element.isFirstEdit);
  }, [element]);

  const linkData: LinkData = useMemo(() => {
    const text = Node.string(element);
    if (!element.data) {
      return { href: "", text, openInNew: false };
    }
    if (element.type === "content-link") {
      const contentType = element.data.contentType ?? "article";
      const resourcePath = getResourcePath(element, language, contentType);
      return { href: resourcePath, text, openInNew: element.data.openIn === "new-context" };
    } else {
      return { href: element.data.href, text, openInNew: element.data.target === "_blank" };
    }
  }, [element, language]);

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      match: (node) => isElementOfType(node, [LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE]),
      at: path,
    });
    ReactEditor.focus(editor);
  }, [editor, element]);

  const toggleEditMode = useCallback(
    (open: boolean) => {
      if (!open && element.isFirstEdit) {
        handleRemove();
      }
      setEditMode(open);
    },
    [element.isFirstEdit, handleRemove],
  );

  const handleSave = (data: ContentLinkEmbedData | LinkEmbedData, text: string) => {
    const path = ReactEditor.findPath(editor, element);

    Transforms.insertText(editor, text, { at: path });

    if ("href" in data) {
      Transforms.setNodes(
        editor,
        { type: LINK_ELEMENT_TYPE, data, isFirstEdit: false },
        {
          at: path,
          match: (node) => isElementOfType(node, [LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE]),
        },
      );
    } else {
      Transforms.setNodes(
        editor,
        {
          type: CONTENT_LINK_ELEMENT_TYPE,
          data: { ...data, resource: "content-link" },
          isFirstEdit: false,
        },
        {
          at: path,
          match: (node) => isElementOfType(node, [LINK_ELEMENT_TYPE, CONTENT_LINK_ELEMENT_TYPE]),
        },
      );
    }
    setEditMode(false);
    setTimeout(() => {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: "start" });
      ReactEditor.focus(editor);
    }, 0);
  };

  return (
    <DialogRoot open={editMode} onOpenChange={(details) => toggleEditMode(details.open)}>
      <PopoverRoot
        modal={false}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
        onOpenChange={(details) => {
          if (!details.open) {
            ReactEditor.focus(editor);
          }
        }}
      >
        <PopoverTrigger asChild consumeCss>
          <a {...attributes} href={linkData.href} ref={linkRef}>
            <InlineBugfix />
            {children}
            <InlineBugfix />
          </a>
        </PopoverTrigger>
        <Portal container={{ current: editorWrapperRef.current }}>
          <StyledPopoverContent>
            <DialogTrigger asChild>
              <Button variant="link">{t("form.content.link.change")}</Button>
            </DialogTrigger>
            <a href={linkData.href} target="_blank" rel="noopener noreferrer">
              {`${t("form.content.link.goTo")} ${linkData.href}`}
            </a>
          </StyledPopoverContent>
        </Portal>
      </PopoverRoot>
      <Portal container={{ current: editorWrapperRef.current }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(`form.content.link.${element.data ? "changeTitle" : "addTitle"}`)}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <LinkForm linkData={linkData} onSave={handleSave} onRemove={handleRemove} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default Link;
