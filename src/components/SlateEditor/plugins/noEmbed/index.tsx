/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from 'slate';
import { SlateSerializer } from '../../interfaces';
import { defaultEmbedBlock, isSlateEmbed } from '../embed/utils';
import { parseEmbedTag } from '../../../../util/embedTagHelpers';
import { Embed } from '../../../../interfaces';
import { TYPE_NDLA_EMBED } from '../embed/types';

export const noEmbedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node: Descendant) {
    if (isSlateEmbed(node)) {
      // @ts-ignore delemete does not exist in JSX.
      return <deleteme></deleteme>;
    }
  },
};

export const noEmbedPlugin = (editor: Editor) => {
  return editor;
};
