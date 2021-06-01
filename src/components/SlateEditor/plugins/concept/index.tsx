/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Descendant, Editor, Element, Node, Range, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import hasNodeOfType from '../../utils/hasNodeOfType';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import EditSlateConcept from './EditSlateConcept';

const KEY_BACKSPACE = 'Backspace';
export const TYPE_CONCEPT = 'concept';

export interface ConceptElement {
  type: 'concept';
  data: { [key: string]: string };
  children: Descendant[];
}

export const conceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'embed') return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'concept') return;
    return jsx(
      'element',
      {
        type: TYPE_CONCEPT,
        data: embedAttributes,
      },
      [
        {
          text: embedAttributes['link-text']
            ? embedAttributes['link-text']
            : 'Ukjent forklaringstekst',
        },
      ],
    );
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_CONCEPT) return;

    const data = {
      ...node.data,
      'link-text': Node.string(node),
    };

    return createEmbedTag(data);
  },
};

const onBackspace = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown?: KeyboardEventHandler<HTMLDivElement>,
) => {
  if (hasNodeOfType(editor, TYPE_CONCEPT)) {
    if (Range.isRange(editor.selection)) {
      // Replace heading with paragraph if last character is removed
      if (
        Range.isCollapsed(editor.selection) &&
        Editor.string(editor, editor.selection.anchor.path).length === 1 &&
        editor.selection.anchor.offset === 1
      ) {
        e.preventDefault();
        editor.deleteBackward('character');
        Transforms.unwrapNodes(editor, {
          match: node => Element.isElement(node) && node.type === TYPE_CONCEPT,
        });
        return;
      }
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export const conceptPlugin = (locale: string) => (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    isInline: nextIsInline,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_CONCEPT) {
      return (
        <EditSlateConcept element={element} attributes={attributes} editor={editor} locale={locale}>
          {children}
        </EditSlateConcept>
      );
    }
    return nextRenderElement && nextRenderElement(props);
  };

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_CONCEPT) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
