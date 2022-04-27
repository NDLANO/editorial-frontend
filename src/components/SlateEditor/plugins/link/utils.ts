/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Range, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import Url from 'url-parse';
import { isValidLocale } from '../../../../i18n';
import { resolveUrls } from '../../../../modules/taxonomy/taxonomyApi';

export const insertLink = (editor: Editor) => {
  if (editor.selection) {
    wrapLink(editor);
  }
};

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === 'link' || n.type === 'content-link'),
  });
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === 'link' || n.type === 'content-link'),
  });
};

const wrapLink = (editor: Editor) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link = slatejsx(
    'element',
    {
      type: 'link',
    },
    [],
  );

  if (!isCollapsed) {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const splitArticleUrl = (href: string) => {
  const splittedHref = href.split('/');
  return {
    resourceId: splittedHref.pop(),
    resourceType: 'article',
  };
};

export const splitLearningPathUrl = (href: string) => {
  const splittedHref = href.split('learningpaths/');
  return {
    resourceId: splittedHref[1],
    resourceType: 'learningpath',
  };
};

export const splitPlainUrl = (href: string) => ({
  resourceId: href,
  resourceType: 'article',
});

export const splitTaxonomyUrl = async (href: string) => {
  const { pathname } = new Url(href.replace('/subjects', ''));
  const paths = pathname.split('/');
  const path = isValidLocale(paths[1]) ? paths.slice(2).join('/') : pathname;
  const resolvedTaxonomy = await resolveUrls({ path, taxonomyVersion: 'default' });
  const contentUriSplit = resolvedTaxonomy && resolvedTaxonomy.contentUri.split(':');
  const resourceId = contentUriSplit.pop();
  const resourceType = contentUriSplit.pop();
  return { resourceId, resourceType };
};

export const splitEdPathUrl = (href: string) => {
  const id = href.split('subject-matter/')[1].split('/')[1];
  return {
    resourceId: id,
    resourceType: 'article',
  };
};
