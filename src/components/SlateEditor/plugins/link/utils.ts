/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Range, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { isValidLocale } from "../../../../i18n";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { resolveUrls } from "../../../../modules/taxonomy/taxonomyApi";

export const insertLink = (editor: Editor) => {
  if (editor.selection) {
    wrapLink(editor);
  }
};

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (n.type === "link" || n.type === "content-link"),
  });
  return !!link;
};

export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (n.type === "link" || n.type === "content-link"),
  });
};

const wrapLink = (editor: Editor) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
    return;
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link = slatejsx(
    "element",
    {
      type: "link",
      isFirstEdit: true,
    },
    [],
  );

  if (!isCollapsed) {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const splitArticleUrl = (href: string) => {
  const splittedHref = href.split("/");
  return {
    resourceId: splittedHref.pop(),
    resourceType: "article",
  };
};

export const splitLearningPathUrl = (href: string) => {
  const splittedHref = href.split("learningpaths/");
  const path = splittedHref[1];
  return {
    resourceId: path.split("/")[0],
    resourceType: "learningpath",
  };
};

export const splitPlainUrl = (href: string) => ({
  resourceId: href,
  resourceType: "article",
});

export const splitTaxonomyUrl = async (href: string) => {
  const { pathname } = new URL(href.replace("/subjects", ""));
  const paths = pathname.split("/");
  const path = isValidLocale(paths[1]) ? paths.slice(2).join("/") : pathname;
  const resolvedTaxonomy = await resolveUrls({
    path,
    taxonomyVersion: "default",
  });
  const contentUriSplit = resolvedTaxonomy && resolvedTaxonomy.contentUri.split(":");
  const resourceId = contentUriSplit.pop();
  const resourceType = contentUriSplit.pop();
  return { resourceId, resourceType };
};

export const splitTaxonomyContextUrl = async (href: string) => {
  const { pathname } = new URL(href);
  const paths = pathname.split("/");
  const language = isValidLocale(paths[1]) ? paths[1] : "nb";
  const contextId = paths.at(-1);
  const nodes = await fetchNodes({
    contextId,
    language,
    taxonomyVersion: "default",
  });
  if (!nodes.length) {
    return { resourceId: null, resourceType: null };
  }

  const contentUriSplit = nodes[0].contentUri?.split(":") ?? [];
  const resourceId = contentUriSplit.pop();
  const resourceType = contentUriSplit.pop();
  return { resourceId, resourceType };
};

export const splitEdPathUrl = (href: string) => {
  const id = href.split("subject-matter/")[1].split("/")[1];
  return {
    resourceId: id,
    resourceType: "article",
  };
};

export const splitEdPreviewUrl = (href: string) => {
  const id = href.split("preview/")[1].split("/")[0];
  return {
    resourceId: id,
    resourceType: "article",
  };
};

export const isNDLAArticleUrl = (url: string) => /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?article\/\d*/.test(url);
export const isNDLATaxonomyUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?subject:(.*)\/topic(.*)/.test(url);
export const isNDLATaxonomyContextUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?(e|r)\/(.*)\/?(.*)\/?[a-z0-9]{10}/.test(url);
export const isNDLALearningPathUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isNDLAEdPathUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?subject-matter\/(.*)/.test(url);
export const isNDLAEdPreviewUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?preview\/(.*)/.test(url);
export const isPlainId = (url: string) => /^\d+/.test(url);

export const getIdAndTypeFromUrl = async (href: string) => {
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
  } else if (isNDLATaxonomyContextUrl(baseHref)) {
    return await splitTaxonomyContextUrl(baseHref);
  } else if (isNDLAEdPathUrl(baseHref)) {
    return splitEdPathUrl(baseHref);
  } else if (isNDLAEdPreviewUrl(baseHref)) {
    return splitEdPreviewUrl(baseHref);
  }
  return { resourceId: null, resourceType: "" };
};
