/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { LinkElement, ContentLinkElement } from '.';
import LinkForm from './LinkForm';
import { Model } from './Link';
import { TYPE_CONTENT_LINK, TYPE_LINK } from './types';
import {
  splitLearningPathUrl,
  splitEdPathUrl,
  splitArticleUrl,
  splitPlainUrl,
  splitTaxonomyUrl,
} from './utils';

const newTabAttributes = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const createContentLinkData = (
  id: string,
  resourceType: string | undefined,
  targetRel: { 'open-in': string },
): Partial<ContentLinkElement> => {
  return {
    type: TYPE_CONTENT_LINK,
    'content-id': id,
    'content-type': resourceType || 'article',
    ...targetRel,
  };
};

const createLinkData = (
  href: string,
  targetRel: { target?: string; rel?: string },
): Partial<LinkElement> => ({
  type: TYPE_LINK,
  href,
  ...targetRel,
});

export const isNDLAArticleUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?article\/\d*/.test(url);
export const isNDLATaxonomyUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?subject:(.*)\/topic(.*)/.test(url);
export const isNDLALearningPathUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isNDLAEdPathUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?subject-matter\/(.*)/.test(url);
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
  }
  return { resourceId: null, resourceType: '' };
};

interface Props {
  model: Partial<Model>;
  closeEditMode: () => void;
  onChange: () => void;
  editor: Editor;
  element: LinkElement | ContentLinkElement;
}

const EditLink = (props: Props) => {
  const { t } = useTranslation();

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

      Transforms.setNodes<LinkElement | ContentLinkElement>(
        editor,
        { ...data },
        {
          at: path,
          match: node =>
            Element.isElement(node) && (node.type === TYPE_LINK || node.type === TYPE_CONTENT_LINK),
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
        Element.isElement(node) && (node.type === TYPE_LINK || node.type === TYPE_CONTENT_LINK),
    });

    ReactEditor.focus(editor);
  };

  const handleChangeAndClose = (editor: Editor) => {
    const { closeEditMode } = props;

    ReactEditor.focus(editor); // Always return focus to editor

    closeEditMode();
  };

  const { model, element } = props;
  const isEdit = model && model.href !== undefined;

  return (
    <Portal isOpened>
      <Lightbox display appearance="big" onClose={onClose}>
        <div>
          <h2>{t(`form.content.link.${isEdit ? 'changeTitle' : 'addTitle'}`)}</h2>
          <LinkForm
            onClose={onClose}
            link={model}
            isEdit={isEdit}
            onRemove={handleRemove}
            onSave={handleSave}
          />
        </div>
      </Lightbox>
    </Portal>
  );
};

export default EditLink;
