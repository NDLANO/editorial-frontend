/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { ContentState, EditorState, Entity } from 'draft-js';

function reduceAttributesArrayToObject(attributes) {
  // Reduce attributes array to object with attribute name (striped of data-) as keys.
  return attributes.reduce((all, attr) => Object.assign({}, all, { [attr.nodeName.replace('data-', '')]: attr.nodeValue }), {});
}

export function convertHTMLToContentState(html) {
  const contentState = convertFromHTML({
    htmlToBlock: (nodeName) => {
      if (nodeName === 'embed') {
        return 'atomic';
      }
      return undefined;
    },
    htmlToEntity: (nodeName, node) => {
      if (nodeName === 'embed') {
        const data = reduceAttributesArrayToObject(Array.from(node.attributes));
        return Entity.create('resource-placeholder', 'IMMUTABLE', data);
      }
      return undefined;
    },
  })(html);
  return EditorState.createWithContent(contentState);
}

export function convertEditorStateToHTML(editorState) {
  const contentState = editorState.getCurrentContent();

  const html = convertToHTML({
    blockToHTML: (block) => {
      if (block.type === 'atomic') {
        return <deleteme />;
      }
      return null;
    },
  })(contentState);

  return `<section>${html.replace(/<deleteme>a<\/deleteme>/g, '')}</section>`;
}

export const createEditorStateFromText = (text) => {
  if (text) {
    return EditorState.createWithContent(ContentState.createFromText(text));
  }
  return EditorState.createEmpty();
};

export const getPlainTextFromEditorState = editorState => editorState.getCurrentContent().getPlainText();
