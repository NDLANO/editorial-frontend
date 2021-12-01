/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import NoEmbedMessage from './NoEmbedMessage';
import { SlateSerializer } from '../../interfaces';
import { TYPE_EMBED } from '../embed';
import { defaultEmbedBlock } from '../embed/utils';
import { parseEmbedTag } from '../../../../util/embedTagHelpers';
import { Embed } from '../../../../interfaces';

export const noEmbedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_EMBED) return;

    return defaultEmbedBlock((parseEmbedTag(el.outerHTML) as unknown) as Embed);
  },
  serialize(node: Descendant) {
    if (Element.isElement(node) && node.type === TYPE_EMBED) {
      // @ts-ignore delemete does not exist in JSX.
      return <deleteme></deleteme>;
    }
  },
};

export const noEmbedPlugin = (editor: Editor) => {
  const { renderElement } = editor;

  editor.renderElement = ({ attributes, element, children }) => {
    if (Element.isElement(element) && element.type === TYPE_EMBED) {
      return <NoEmbedMessage attributes={attributes} element={element} />;
    }
    return renderElement && renderElement({ attributes, element, children });
  };
  return editor;
};
