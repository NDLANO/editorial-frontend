/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import ConceptList from './ConceptList';
import { TYPE_CONCEPT_LIST } from './types';
import { defaultConceptListBlock } from './utils';

export interface ConceptListElement {
  type: 'concept-list';
  data: {
    tag: string;
    title: string;
  };
  isFirstEdit?: boolean;
  children: Descendant[];
}

export const conceptListSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'embed') return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'concept-list') return;
    const tag = embedAttributes.tag || '';
    const title = embedAttributes.title || '';
    return defaultConceptListBlock(tag, title);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_CONCEPT_LIST) return;

    const data = {
      ...node.data,
      resource: 'concept-list',
    };
    return createEmbedTag(data);
  },
};

export const conceptListPlugin = (locale: string) => (editor: Editor) => {
  const { renderElement, isVoid } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_CONCEPT_LIST) {
      return (
        <ConceptList attributes={attributes} element={element} locale={locale} editor={editor}>
          {children}
        </ConceptList>
      );
    }
    return renderElement && renderElement(props);
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_CONCEPT_LIST) {
      return true;
    }
    return isVoid(element);
  };

  return editor;
};
