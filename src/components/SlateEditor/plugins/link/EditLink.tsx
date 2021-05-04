/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Node, Transforms, Element } from 'new-slate';
import { ReactEditor } from 'new-slate-react';
import { injectT, tType } from '@ndla/i18n';
import Url from 'url-parse';
import { isValidLocale } from '../../../../i18n';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { TYPE_LINK, TYPE_CONTENT_LINK, LinkElement, ContentLinkElement } from '.';
import LinkForm from './LinkForm';
import { resolveUrls } from '../../../../modules/taxonomy/taxonomyApi';
import { Model } from './Link';

const newTabAttributes = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const createContentLinkData = (id, resourceType, targetRel) => {
  return {
    type: TYPE_CONTENT_LINK,
    'content-id': id,
    'content-type': resourceType || 'article',
    resource: 'content-link',
    ...targetRel,
  };
};

const createLinkData = (href, targetRel) => ({
  type: TYPE_LINK,
  href,
  ...targetRel,
});

export const isNDLAArticleUrl = url =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?article\/\d*/.test(url);
export const isNDLATaxonomyUrl = url =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?(.*)\/topic(.*)/.test(url);
export const isNDLALearningPathUrl = url =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isNDLAEdPathUrl = url =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?subject-matter\/(.*)/.test(url);
export const isPlainId = url => /^\d+/.test(url);

const getIdAndTypeFromUrl = async href => {
  // Removes search queries before split
  const baseHref = href.split(/\?/)[0];
  if (isNDLAArticleUrl(baseHref)) {
    const splittedHref = baseHref.split('/');
    return {
      resourceId: splittedHref.pop(),
      resourceType: 'article',
    };
  } else if (isNDLALearningPathUrl(baseHref)) {
    const splittedHref = baseHref.split('learningpaths/');
    return {
      resourceId: splittedHref[1],
      resourceType: 'learningpath',
    };
  } else if (isPlainId(baseHref)) {
    return {
      resourceId: baseHref,
      resourceType: 'article',
    };
  } else if (isNDLATaxonomyUrl(baseHref)) {
    const { pathname } = new Url(baseHref.replace('/subjects', ''));
    const paths = pathname.split('/');
    const path = isValidLocale(paths[1]) ? paths.slice(2).join('/') : pathname;
    const resolvedTaxonomy = await resolveUrls(path);

    const contentUriSplit = resolvedTaxonomy && resolvedTaxonomy.contentUri.split(':');

    const resourceId = contentUriSplit.pop();
    const resourceType = contentUriSplit.pop();

    return { resourceId, resourceType };
  } else if (isNDLAEdPathUrl(baseHref)) {
    const splittedHref = baseHref.split('/');
    return {
      resourceId: splittedHref[5],
      resourceType: 'article',
    };
  }
  return { resourceId: null };
};

interface Props {
  model: {
    href?: string;
    text?: string;
    checkbox?: boolean;
  };
  closeEditMode: () => void;
  onChange: () => void;
  editor: Editor;
  element: LinkElement | ContentLinkElement;
}

const EditLink = (props: Props & tType) => {
  const onClose = () => {
    const { editor, model } = props;
    if (!model.href) {
      handleRemove();
    } else {
      handleChangeAndClose(editor);
    }
  };

  const handleSave = async (model: Model) => {
    const { editor, element } = props;
    const { href, text, checkbox } = model;

    const { resourceId, resourceType } = await getIdAndTypeFromUrl(href);

    const targetRel = checkbox ? { 'open-in': 'new-context' } : { 'open-in': 'current-context' };

    const data = resourceId
      ? createContentLinkData(resourceId, resourceType, targetRel)
      : createLinkData(href, checkbox ? newTabAttributes : {});

    if (element) {
      const path = ReactEditor.findPath(editor, element);

      Transforms.insertText(editor, text, { at: path });

      Transforms.setNodes(
        editor,
        { ...data },
        {
          at: path,
          match: node =>
            Element.isElement(node) && (node.type === 'link' || node.type === 'content-link'),
        },
      );
      handleChangeAndClose(editor);
    }
  };

  const handleRemove = () => {
    const { editor } = props;
    const path = ReactEditor.findPath(editor, element);

    Transforms.unwrapNodes(editor, {
      at: path,
      match: node =>
        Element.isElement(node) && (node.type === 'link' || node.type === 'content-link'),
    });

    ReactEditor.focus(editor);
  };

  const handleChangeAndClose = (editor: Editor) => {
    const { closeEditMode } = props;

    ReactEditor.focus(editor); // Always return focus to editor

    closeEditMode();
  };

  const { t, model, element } = props;
  const isEdit = model !== undefined && model.href !== undefined;

  return (
    <Portal isOpened>
      <Lightbox display appearance="big" onClose={onClose}>
        <h2>{t(`form.content.link.${isEdit ? 'changeTitle' : 'addTitle'}`)}</h2>
        <LinkForm
          onClose={onClose}
          link={model}
          node={element}
          isEdit={isEdit}
          onRemove={handleRemove}
          onSave={handleSave}
        />
      </Lightbox>
    </Portal>
  );
};

export default injectT(EditLink);
