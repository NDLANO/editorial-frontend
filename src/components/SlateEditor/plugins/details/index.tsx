/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Descendant, Editor, Path, Transforms, Node, Text, Range, Location } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { colors } from '@ndla/core';
import { SlateSerializer } from '../../interfaces';
import Details from './Details';
import { TYPE_PARAGRAPH } from '../paragraph/utils';
import hasNodeOfType from '../../utils/hasNodeOfType';
import getCurrentBlock from '../../utils/getCurrentBlock';
import containsVoid from '../../utils/containsVoid';
import {
  addSurroundingParagraphs,
  afterOrBeforeTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from '../../utils/normalizationHelpers';
import { defaultParagraphBlock } from '../paragraph/utils';
import Summary from './Summary';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { defaultSummaryBlock } from './utils';

export const TYPE_DETAILS = 'details';
export const TYPE_SUMMARY = 'summary';
const KEY_ENTER = 'Enter';
const KEY_BACKSPACE = 'Backspace';

export interface DetailsElement {
  type: 'details';
  children: Descendant[];
}

export interface SummaryElement {
  type: 'summary';
  children: Descendant[];
}

const detailsNormalizerConfig: NormalizerConfig = {
  firstNode: {
    allowed: [TYPE_SUMMARY],
    defaultElement: defaultSummaryBlock,
  },
  nodes: {
    allowed: textBlockElements,
    defaultElement: defaultParagraphBlock,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultElement: defaultParagraphBlock,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultElement: defaultParagraphBlock,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultElement: defaultParagraphBlock,
  },
};

const summaryNormalizerConfig: NormalizerConfig = {
  parent: {
    allowed: [TYPE_DETAILS],
    defaultElement: defaultParagraphBlock,
  },
};

const onEnter = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  if (hasNodeOfType(editor, TYPE_SUMMARY)) {
    e.preventDefault();
    Transforms.splitNodes(editor, {
      match: node => Element.isElement(node) && node.type === TYPE_SUMMARY,
      always: true,
    });
    return;
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

const onBackspace = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  if (
    hasNodeOfType(editor, TYPE_DETAILS) &&
    Location.isLocation(editor.selection) &&
    Range.isCollapsed(editor.selection)
  ) {
    const detailsEntry = getCurrentBlock(editor, TYPE_DETAILS);
    if (detailsEntry) {
      const [detailsNode, detailsPath] = detailsEntry;

      const summaryEntry = getCurrentBlock(editor, TYPE_SUMMARY);

      if (summaryEntry?.length) {
        const [summaryNode] = summaryEntry;
        if (Node.string(detailsNode).length > 0 && Node.string(summaryNode) === '') {
          e.preventDefault();
          Transforms.move(editor, { reverse: true });
          return;
        }
      }
      if (
        Node.string(detailsNode) === '' &&
        Element.isElement(detailsNode) &&
        !containsVoid(editor, detailsNode) &&
        detailsNode.children.length === 2
      ) {
        e.preventDefault();
        Transforms.removeNodes(editor, { at: detailsPath });
        return;
      }
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export const detailsSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() === 'summary') {
      return slatejsx('element', { type: TYPE_SUMMARY }, children);
    } else if (el.tagName.toLowerCase() === 'details') {
      return slatejsx('element', { type: TYPE_DETAILS }, children);
    }
    return;
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_SUMMARY) {
      return <summary>{children}</summary>;
    } else if (node.type === TYPE_DETAILS) {
      return <details>{children}</details>;
    }
  },
};

export const detailsPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
    shouldShowToolbar: nextShouldShowToolbar,
  } = editor;

  editor.onKeyDown = event => {
    if (event.key === KEY_ENTER) {
      onEnter(event, editor, nextOnKeyDown);
    } else if (event.key === KEY_BACKSPACE) {
      onBackspace(event, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(event);
    }
  };

  editor.shouldShowToolbar = () => {
    const [summaryEntry] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && node.type === TYPE_SUMMARY,
    });

    if (summaryEntry && Element.isElement(summaryEntry[0])) {
      return false;
    }
    if (nextShouldShowToolbar) {
      return nextShouldShowToolbar();
    }
    return true;
  };

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_SUMMARY) {
      return <Summary attributes={attributes} children={children} element={element} />;
    } else if (element.type === TYPE_DETAILS) {
      return (
        <Details attributes={attributes} children={children} editor={editor} element={element} />
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
  };

  editor.renderLeaf = (props: RenderLeafProps) => {
    const { attributes, children, leaf, text } = props;
    const path = ReactEditor.findPath(editor, text);

    const [parent] = Editor.node(editor, Path.parent(path));
    if (Element.isElement(parent) && parent.type === TYPE_SUMMARY && Node.string(leaf) === '') {
      return (
        <span style={{ position: 'relative' }}>
          <span {...attributes}>{children}</span>
          <span
            style={{
              position: 'absolute',
              top: 0,
              opacity: 0.3,
              color: `${colors.black}`,
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'inline-block',
            }}
            contentEditable={false}>
            Tittel
          </span>
        </span>
      );
    }
    return;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node)) {
      if (node.type === TYPE_DETAILS) {
        if (defaultBlockNormalizer(editor, entry, detailsNormalizerConfig)) {
          return;
        }
      }

      if (node.type === TYPE_SUMMARY) {
        for (const [child, childPath] of Node.children(editor, path)) {
          // Unwrap elements inside summary until only the text remains.
          if (Element.isElement(child)) {
            console.log('RUNS');
            Transforms.unwrapNodes(editor, { at: childPath, voids: true });
            return;
          }

          // Remove marks if any is active
          if (
            child.bold ||
            child.code ||
            child.italic ||
            child.sub ||
            child.sup ||
            child.underlined
          ) {
            Transforms.unsetNodes(editor, ['bold', 'code', 'italic', 'sub', 'sup', 'underlined'], {
              at: childPath,
            });
            return;
          }
        }
        if (defaultBlockNormalizer(editor, entry, summaryNormalizerConfig)) {
          return;
        }
      }
    }

    nextNormalizeNode(entry);
  };
  return editor;
};
