/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Descendant, Editor, Element, Path, Transforms, Node } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { colors, fonts } from '@ndla/core';
import { SlateSerializer } from '../../interfaces';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { KEY_BACKSPACE, KEY_ENTER } from '../../utils/keys';
import onBackspace from './handlers/onBackspace';
import onEnter from './handlers/onEnter';
import { TYPE_DEFINTION_LIST, TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_TERM } from './types';

export interface DefinitionListElement {
  type: 'definition-list';
  children: Descendant[];
}

export interface DefinitionTermElement {
  type: 'definition-term';
  children: Descendant[];
}

export interface DefinitionDescriptionElement {
  type: 'definition-description';
  children: Descendant[];
}

const StyledDD = styled.dd`
  color: ${colors.text.light};
  font-weight: ${fonts.weight.normal};
  ${fonts.sizes('18px', '29px')};
`;

const StyledDT = styled.dt`
  color: ${colors.text.primary};
  font-weight: ${fonts.weight.bold};
  ${fonts.sizes('18px', '29px')};
`;

const normalizerParentConfig: NormalizerConfig = {
  nodes: {
    allowed: [TYPE_DEFINTION_TERM, TYPE_DEFINTION_DESCRIPTION],
    defaultType: TYPE_DEFINTION_TERM,
  },
  firstNode: {
    allowed: [TYPE_DEFINTION_TERM],
    defaultType: TYPE_DEFINTION_TERM,
  },
  lastNode: {
    allowed: [TYPE_DEFINTION_DESCRIPTION],
    defaultType: TYPE_DEFINTION_DESCRIPTION,
  },
};
const normalizerConfigCommon: NormalizerConfig = {
  parent: {
    allowed: [TYPE_DEFINTION_LIST],
  },
};
const normalizerDTConfig: NormalizerConfig = {
  ...normalizerConfigCommon,
  next: {
    allowed: [TYPE_DEFINTION_DESCRIPTION],
    defaultType: TYPE_DEFINTION_DESCRIPTION,
  },
};
const normalizerDDConfig: NormalizerConfig = {
  ...normalizerConfigCommon,
  previous: {
    allowed: [TYPE_DEFINTION_TERM],
    defaultType: TYPE_DEFINTION_TERM,
  },
};

export const definitionListSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'dl') {
      return slatejsx('element', { type: TYPE_DEFINTION_LIST }, children);
    }
    if (tag === 'dd') {
      return slatejsx('element', { type: TYPE_DEFINTION_DESCRIPTION }, children);
    }
    if (tag === 'dt') {
      return slatejsx('element', { type: TYPE_DEFINTION_TERM }, children);
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_DEFINTION_LIST) {
      return <dl>{children}</dl>;
    }
    if (node.type === TYPE_DEFINTION_TERM) {
      return <dt>{children}</dt>;
    }
    if (node.type === TYPE_DEFINTION_DESCRIPTION) {
      return <dd>{children}</dd>;
    }
  },
};

export const definitionListPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(editor, e, nextOnKeyDown);
    } else if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  editor.renderElement = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    if (element.type === TYPE_DEFINTION_LIST) {
      return <dl {...attributes}>{children}</dl>;
    } else if (element.type === TYPE_DEFINTION_DESCRIPTION) {
      return <StyledDD {...attributes}>{children}</StyledDD>;
    } else if (element.type === TYPE_DEFINTION_TERM) {
      return <StyledDT {...attributes}>{children}</StyledDT>;
    } else if (nextRenderElement) {
      return nextRenderElement(props);
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, nodepath] = entry;

    if (Element.isElement(node)) {
      if (node.type === TYPE_DEFINTION_LIST) {
        defaultBlockNormalizer(editor, entry, normalizerParentConfig);
        if (Path.hasPrevious(nodepath)) {
          // Merge list with previous list if identical type
          const prevPath = Path.previous(nodepath);
          if (Editor.hasPath(editor, prevPath)) {
            const [prevNode] = Editor.node(editor, prevPath);
            if (Element.isElement(prevNode) && prevNode.type === TYPE_DEFINTION_LIST) {
              if (node.type === prevNode.type) {
                return Transforms.mergeNodes(editor, {
                  at: nodepath,
                });
              }
            }
          }
        }

        return;
      } else if (
        (node.type === TYPE_DEFINTION_DESCRIPTION &&
          defaultBlockNormalizer(editor, entry, normalizerDDConfig)) ||
        (node.type === TYPE_DEFINTION_TERM &&
          defaultBlockNormalizer(editor, entry, normalizerDTConfig))
      ) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };
  return editor;
};
