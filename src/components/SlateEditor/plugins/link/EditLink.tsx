/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Transforms, Element, Path } from "slate";
import { ReactEditor } from "slate-react";
import styled from "@emotion/styled";
import { CloseLine } from "@ndla/icons/action";
import { ModalBody, ModalHeader, ModalTitle } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { LinkElement, ContentLinkElement } from ".";
import { Model } from "./Link";
import LinkForm from "./LinkForm";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "./types";
import {
  splitArticleUrl,
  splitEdPathUrl,
  splitEdPreviewUrl,
  splitLearningPathUrl,
  splitPlainUrl,
  splitTaxonomyUrl,
} from "./utils";

const newTabAttributes = {
  target: "_blank",
  rel: "noopener noreferrer",
};

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0;
`;

const createContentLinkData = (
  id: string,
  resourceType: string | undefined,
  openIn: string,
): Partial<ContentLinkElement> => {
  return {
    type: TYPE_CONTENT_LINK,
    data: {
      resource: TYPE_CONTENT_LINK,
      contentId: id,
      contentType: resourceType || "article",
      openIn,
    },
  };
};

const createLinkData = (href: string, targetRel: { target?: string; rel?: string }): Partial<LinkElement> => ({
  type: TYPE_LINK,
  href,
  ...targetRel,
});

export const isNDLAArticleUrl = (url: string) => /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?article\/\d*/.test(url);
export const isNDLATaxonomyUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?subject:(.*)\/topic(.*)/.test(url);
export const isNDLALearningPathUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isNDLAEdPathUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?subject-matter\/(.*)/.test(url);
export const isNDLAEdPreviewUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?preview\/(.*)/.test(url);
export const isPlainId = (url: string) => /^\d+/.test(url);

const getIdAndTypeFromUrl = async (href: string) => {
  // Removes search queries before split
  const baseHref = href.split(/\?/)[0];
  if (isNDLAArticleUrl(baseHref)) {
    return splitArticleUrl(baseHref);
  } else if (isNDLALearningPathUrl(baseHref)) {
    return splitLearningPathUrl(baseHref);
  } else if (isPlainId(baseHref)) {
    return splitPlainUrl(baseHref);
  } else if (isNDLATaxonomyUrl(baseHref)) {
    return await splitTaxonomyUrl(baseHref);
  } else if (isNDLAEdPathUrl(baseHref)) {
    return splitEdPathUrl(baseHref);
  } else if (isNDLAEdPreviewUrl(baseHref)) {
    return splitEdPreviewUrl(baseHref);
  }
  return { resourceId: null, resourceType: "" };
};

interface Props {
  model: Model;
  closeEditMode: () => void;
  editor: Editor;
  element: LinkElement | ContentLinkElement;
  handleRemove: () => void;
}

const EditLink = ({ model, closeEditMode, editor, element, handleRemove }: Props) => {
  const { t } = useTranslation();

  const onClose = () => {
    if (model.href) {
      handleChange();
    }
    closeEditMode();
  };

  const handleSave = async ({ href, text, checkbox }: Model) => {
    const { resourceId, resourceType } = await getIdAndTypeFromUrl(href);

    const targetRel = checkbox ? "new-context" : "current-context";

    const data = resourceId
      ? createContentLinkData(resourceId, resourceType, targetRel)
      : createLinkData(href, checkbox ? newTabAttributes : {});

    if (element) {
      const path = ReactEditor.findPath(editor, element);

      Transforms.insertText(editor, text, { at: path });
      Transforms.setNodes<LinkElement | ContentLinkElement>(
        editor,
        { ...data },
        {
          at: path,
          match: (node) => Element.isElement(node) && (node.type === TYPE_LINK || node.type === TYPE_CONTENT_LINK),
        },
      );
      handleChange();
      closeEditMode();
    }
  };

  const handleChange = () => {
    ReactEditor.focus(editor);
    Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
    Transforms.collapse(editor, { edge: "start" });
  };

  const isEdit = model && model.href !== undefined;

  return (
    <>
      <StyledModalHeader>
        <ModalTitle>{t(`form.content.link.${isEdit ? "changeTitle" : "addTitle"}`)}</ModalTitle>
        <IconButton variant="tertiary" aria-label={t("close")} title={t("close")} onClick={onClose}>
          <CloseLine />
        </IconButton>
      </StyledModalHeader>
      <StyledModalBody>
        <LinkForm onClose={onClose} link={model} isEdit={isEdit} onRemove={handleRemove} onSave={handleSave} />
      </StyledModalBody>
    </>
  );
};

export default EditLink;
