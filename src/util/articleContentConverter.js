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
import { Html, Raw } from 'slate';
import { RULES } from '../util/slateHelpers';

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

export const createEmptyState = () =>
  Raw.deserialize(
    {
      nodes: [
        {
          kind: 'block',
          type: 'section',
          nodes: [
            {
              kind: 'block',
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  text: '',
                },
              ],
            },
          ],
        },
      ],
    },
    { terse: true },
  );

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

// TODO: Find a better way to extract each section into an array.
function extractSections(html) {
  return html
    .split('</section>')
    .filter(section => section.length > 0)
    .map(section => `${section}</section>`);
}

function convertHTMLToSlateEditorState(html, isBlocks = false) {
  if (!isBlocks) {
    if (!html) {
      return createEmptyState();
    }
    const serializer = new Html({ rules: RULES });
    return serializer.deserialize(html);
  }

  let contentState;
  if (!html) {
    contentState = [
      {
        state: createEmptyState(),
        index: 0,
      },
    ];
  } else {
    const sections = extractSections(html);
    const serializer = new Html({ rules: RULES });
    contentState = sections.map((section, index) => ({
      state: serializer.deserialize(section),
      index,
    }));
  }
  return contentState;
}

function convertSlateEditorStatetoHTML(contentState, isBlocks = false) {
  const serializer = new Html({ rules: RULES });
  if (!isBlocks) {
    return serializer.serialize(contentState);
  }
  const html = [];
  contentState.map(section => html.push(serializer.serialize(section.state)));
  return html.join('');
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

function convertTextToSlateEditorState(text, withDefaultPlainState = false) {
  if (withDefaultPlainState) {
    return text ? Plain.deserialize(text) : Plain.deserialize('');
  }
  return text ? Plain.deserialize(text) : undefined;
}

function convertSlateEditorStateToText(editorState) {
  return editorState ? Plain.serialize(editorState) : '';
}

export default {
  toHtml: convertEditorStateToHTML,
  slateToHtml: convertSlateEditorStatetoHTML,
  toEditorState: convertHTMLToEditorState,
  toSlateEditorState: convertHTMLToSlateEditorState,
  toPlainSlateEditorState: convertTextToSlateEditorState,
  slateToText: convertSlateEditorStateToText,
};
