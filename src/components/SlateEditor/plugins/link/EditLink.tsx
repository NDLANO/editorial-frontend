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
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?(.*)\/topic(.*)/.test(url);
export const isNDLALearningPathUrl = (url: string) =>
  /^http(s)?:\/\/((.*)\.)?ndla.no\/((.*)\/)?learningpaths\/(.*)/.test(url);
export const isNDLAEdPathUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?subject-matter\/(.*)/.test(url);
export const isPlainId = (url: string) => /^\d+/.test(url);

const getIdAndTypeFromUrl = async (href: string) => {
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

      Transforms.setNodes(
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
            node={element}
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
