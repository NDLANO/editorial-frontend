/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';

function reduceAttributesArrayToObject(attributes) {
  // Reduce attributes array to object with attribute name (striped of data-) as keys.
  return attributes.reduce(
    (all, attr) =>
      Object.assign({}, all, {
        [attr.nodeName.replace('data-', '')]: attr.nodeValue,
      }),
    {},
  );
}

function convertHTMLToEditorState(html) {
  const embeds = [];
  const contentState = convertFromHTML({
    htmlToBlock: nodeName => {
      if (nodeName === 'embed') {
        return 'atomic';
      }
      return undefined;
    },
    htmlToEntity: (nodeName, node) => {
      if (nodeName === 'embed') {
        const data = reduceAttributesArrayToObject(Array.from(node.attributes));
        embeds.push(data);
        return embeds.length.toString();
      }
      return undefined;
    },
  })(html);
  embeds.forEach(embed =>
    contentState.createEntity('resource-placeholder', 'IMMUTABLE', embed),
  );
  return EditorState.createWithContent(contentState);
}

function convertEditorStateToHTML(editorState) {
  const contentState = editorState.getCurrentContent();

  const html = convertToHTML({
    blockToHTML: block => {
      if (block.type === 'atomic') {
        return <deleteme />;
      }
      return null;
    },
  })(contentState);

  return `<section>${html.replace(/<deleteme>a<\/deleteme>/g, '')}</section>`;
}

export default {
  toHtml: convertEditorStateToHTML,
  toEditorState: convertHTMLToEditorState,
};
