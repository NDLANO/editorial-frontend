/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { Editor, Element, Node, Location, Range, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
// @ts-ignore
import { SlateBlockMenu } from '@ndla/editor';
import styled from '@emotion/styled';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import actions, { ActionData } from './actions';
import { defaultAsideBlock } from '../aside/utils';
import { defaultDetailsBlock } from '../details/utils';
import { defaultTableBlock } from '../table/utils';
import { defaultBodyboxBlock } from '../bodybox/utils';
import { defaultCodeblockBlock } from '../codeBlock/utils';
import { defaultRelatedBlock } from '../related';
import { TYPE_LIST_ITEM } from '../list/types';

interface Props {
  editor: Editor;
  allowedPickAreas: Element['type'][];
  illegalAreas: Element['type'][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage: string;
  selectedParagraphPath: Path;
  show: boolean;
}

const StyledBlockPickerWrapper = styled.div<{ isList: boolean }>`
  position: absolute;
  left: ${props => (props.isList ? -110 : -78)}px;
  top: -14px;
`;

const SlateBlockPicker = ({
  editor,
  actionsToShowInAreas,
  articleLanguage,
  selectedParagraphPath,
  show,
  illegalAreas,
  allowedPickAreas,
}: Props) => {
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [lastActiveSelection, setLastActiveSelection] = useState<Range>();

  const [visualElementPickerOpen, setVisualElementPickerOpen] = useState(false);
  const [type, setType] = useState('');

  const { t } = useTranslation();

  useEffect(() => {
    if (Location.isLocation(editor.selection)) {
      setLastActiveSelection(editor.selection);
    }
  }, [editor.selection]);

  const onVisualElementClose = () => {
    setVisualElementPickerOpen(false);
    setType('');
  };

  const onInsertBlock = (block: Element, selectBlock?: boolean) => {
    setTimeout(() => {
      Editor.withoutNormalizing(editor, () => {
        if (selectedParagraphPath) {
          Transforms.select(editor, selectedParagraphPath);
          ReactEditor.focus(editor);
        }
        Transforms.insertNodes(editor, block, {
          at: selectedParagraphPath,
        });
        if (selectBlock && selectedParagraphPath) {
          const targetPath = Editor.start(editor, selectedParagraphPath);
          Transforms.select(editor, targetPath);
        }
      });
    }, 0);
    setBlockPickerOpen(false);
    setType('');
  };

  const onElementAdd = (data: ActionData) => {
    switch (data.type) {
      case 'bodybox': {
        onInsertBlock(defaultBodyboxBlock(), true);
        break;
      }
      case 'details': {
        onInsertBlock(defaultDetailsBlock(), true);
        break;
      }
      case 'table': {
        onInsertBlock(defaultTableBlock(2, 2), true);
        break;
      }
      case 'aside': {
        onInsertBlock(defaultAsideBlock(data.object), true);
        break;
      }
      case 'file':
      case 'embed': {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case 'related': {
        onInsertBlock(defaultRelatedBlock());
        break;
      }
      case 'code-block': {
        onInsertBlock(defaultCodeblockBlock());
        break;
      }
      default:
        setBlockPickerOpen(false);

        break;
    }
  };

  const shouldShowMenuPicker = () => {
    const [node] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && !editor.isInline(node),
      mode: 'lowest',
    });

    const [illegalBlock] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && illegalAreas.includes(node.type),
    });

    return (
      editor.shouldShowBlockPicker &&
      editor.shouldShowBlockPicker() &&
      (blockPickerOpen ||
        (node &&
          Element.isElement(node[0]) &&
          Node.string(node[0]).length === 0 &&
          node[0].children.length === 1 &&
          !illegalBlock &&
          allowedPickAreas.includes(node[0].type) &&
          ReactEditor.isFocused(editor)))
    );
  };

  const getActionsForArea = () => {
    if (!lastActiveSelection) return actions;
    if (
      !Node.has(editor, Range.start(lastActiveSelection).path) ||
      !Node.has(editor, Range.end(lastActiveSelection).path)
    ) {
      return actions;
    }

    const nodes = Editor.levels(editor, {
      match: node => Element.isElement(node) && !editor.isInline(node),
      at: Editor.unhangRange(editor, lastActiveSelection),
      reverse: true,
    });

    for (const entry of nodes) {
      const [node] = entry;
      if (!Element.isElement(node)) return actions;
      if (node.type === 'section' /*|| node.type === 'document'*/) {
        return actions;
      }
      if (actionsToShowInAreas[node.type]) {
        return actions.filter(action => actionsToShowInAreas[node.type].includes(action.data.type));
      }
    }

    return actions;
  };

  if (!show && !visualElementPickerOpen) {
    return null;
  }

  if (!shouldShowMenuPicker()) {
    return null;
  }

  const [parent] = Editor.node(editor, Path.parent(selectedParagraphPath));

  const isListItem = Element.isElement(parent) && parent.type === TYPE_LIST_ITEM;

  return (
    <StyledBlockPickerWrapper isList={isListItem} contentEditable={false}>
      {visualElementPickerOpen ? (
        <SlateVisualElementPicker
          articleLanguage={articleLanguage}
          resource={type || ''}
          onVisualElementClose={onVisualElementClose}
          onInsertBlock={onInsertBlock}
        />
      ) : (
        <div data-cy="slate-block-picker-button">
          <SlateBlockMenu
            cy="slate-block-picker"
            isOpen={blockPickerOpen}
            heading={t('editorBlockpicker.heading')}
            actions={getActionsForArea().map(action => ({
              ...action,
              label: t(`editorBlockpicker.actions.${action.data.object}`),
            }))}
            onToggleOpen={setBlockPickerOpen}
            clickItem={(data: ActionData) => {
              onElementAdd(data);
            }}
          />
        </div>
      )}
    </StyledBlockPickerWrapper>
  );
};

export default SlateBlockPicker;
