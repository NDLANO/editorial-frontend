/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef, useEffect, useState } from 'react';
import { Editor, Element, Node, Location, Range, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { injectT, tType } from '@ndla/i18n';
import { SlateBlockMenu } from '@ndla/editor';
import { Portal } from '../../../Portal';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import actions, { ActionData } from './actions';
import { defaultAsideBlock } from '../aside/utils';
import { defaultDetailsBlock } from '../details/utils';
import { defaultTableBlock } from '../table/utils';
import { defaultBodyboxBlock } from '../bodybox/utils';
import { defaultCodeblockBlock } from '../codeBlock/utils';
import { defaultRelatedBlock } from '../related';
import { TYPE_LIST_ITEM } from '../list';

interface Props {
  editor: Editor;
  allowedPickAreas: Element['type'][];
  illegalAreas: Element['type'][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage: string;
}

interface VisualElementSelect {
  isOpen: boolean;
  visualElementType?: string;
}

const SlateBlockPicker = (props: Props & tType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastActiveSelection, setLastActiveSelection] = useState<Range>();
  const [visualElementSelect, setVisualElementSelect] = useState<VisualElementSelect>({
    isOpen: false,
  });

  const slateBlockRef = useRef<HTMLDivElement>(null);
  const slateBlockButtonRef = useRef<HTMLButtonElement>();
  let zIndexTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (slateBlockRef?.current) {
      slateBlockRef.current.style.transition = 'opacity 200ms ease';
      slateBlockRef.current.style.position = 'absolute';
    }
  }, []);

  useEffect(() => {
    if (Location.isLocation(props.editor.selection)) {
      setLastActiveSelection(props.editor.selection);
    }
  }, [props.editor.selection]);

  useEffect(() => showPicker());

  const onVisualElementClose = () => {
    setVisualElementSelect({ isOpen: false, visualElementType: '' });
  };

  const onInsertBlock = (block: Element) => {
    const { editor } = props;
    setIsOpen(false);
    ReactEditor.focus(editor);
    Editor.insertNode(editor, block);
  };

  const onElementAdd = (data: ActionData) => {
    switch (data.type) {
      case 'bodybox': {
        onInsertBlock(defaultBodyboxBlock());
        break;
      }
      case 'details': {
        onInsertBlock(defaultDetailsBlock());
        break;
      }
      case 'table': {
        onInsertBlock(defaultTableBlock(2, 2));
        break;
      }
      case 'aside': {
        onInsertBlock(defaultAsideBlock(data.object));
        break;
      }
      case 'file':
      case 'embed': {
        setVisualElementSelect({
          isOpen: true,
          visualElementType: data.object,
        });
        break;
      }
      case 'related': {
        onInsertBlock(defaultRelatedBlock());
        break;
      }
      // case 'related': {
      //   this.onInsertBlock(defaultRelatedBlock());
      //   break;
      // }
      case 'code-block': {
        onInsertBlock(defaultCodeblockBlock());
        break;
      }
      default:
        setIsOpen(false);
        break;
    }
  };

  const toggleIsOpen = (open: boolean) => {
    setIsOpen(open);
  };

  const update = async () => {
    const { editor } = props;
    if (
      slateBlockRef.current &&
      slateBlockButtonRef.current &&
      ReactEditor.isFocused(editor) &&
      Location.isLocation(editor.selection)
    ) {
      await new Promise(resolve => setTimeout(resolve, 50));

      // Find location of text selection to calculate where to move slateBlock
      const range = ReactEditor.toDOMRange(editor, editor.selection);
      const rect = range.getBoundingClientRect();

      const [[, path]] = Editor.nodes(editor, {
        match: node => Element.isElement(node) && !editor.isInline(node),
        mode: 'lowest',
      });

      const [parent] = Editor.node(editor, Path.parent(path));

      const isListItem = path && Element.isElement(parent) && parent.type === TYPE_LIST_ITEM;

      slateBlockRef.current.style.top = `${rect.top + window.scrollY - 14}px`;
      slateBlockRef.current.style.left = `${rect.left +
        window.scrollX -
        (isListItem ? 110 : 78) -
        rect.width / 2}px`;
      slateBlockRef.current.style.position = 'absolute';
      slateBlockRef.current.style.opacity = '1';

      slateBlockButtonRef.current.setAttribute('aria-hidden', 'false');
      slateBlockButtonRef.current.tabIndex = 0;
      slateBlockButtonRef.current.disabled = false;
      if (zIndexTimeout) {
        clearTimeout(zIndexTimeout);
      }
      zIndexTimeout = setTimeout(() => {
        if (slateBlockRef.current) {
          slateBlockRef.current.style.zIndex = '1';
        }
      }, 100);
    }
  };

  const shouldShowMenuPicker = () => {
    const { editor, illegalAreas, allowedPickAreas } = props;

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
      (isOpen ||
        (node &&
          Element.isElement(node[0]) &&
          Node.string(node[0]).length === 0 &&
          node[0].children.length === 1 &&
          !illegalBlock &&
          allowedPickAreas.includes(node[0].type) &&
          ReactEditor.isFocused(editor)))
    );
  };

  const showPicker = () => {
    if (shouldShowMenuPicker()) {
      update();
    } else {
      if (slateBlockRef.current) {
        slateBlockRef.current.style.opacity = '0';
      }
      if (slateBlockButtonRef.current) {
        slateBlockButtonRef.current.setAttribute('aria-hidden', 'true');
        slateBlockButtonRef.current.tabIndex = -1;
        slateBlockButtonRef.current.disabled = true;
      }

      if (zIndexTimeout) {
        clearTimeout(zIndexTimeout);
      }
      zIndexTimeout = setTimeout(() => {
        if (slateBlockRef.current) {
          slateBlockRef.current.style.zIndex = '-1';
        }
      }, 100);
    }
  };

  const getActionsForArea = () => {
    const { actionsToShowInAreas, editor } = props;
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

  const { t, articleLanguage } = props;

  return (
    <>
      <Portal isOpened={visualElementSelect.isOpen}>
        <SlateVisualElementPicker
          articleLanguage={articleLanguage}
          resource={visualElementSelect.visualElementType}
          onVisualElementClose={onVisualElementClose}
          onInsertBlock={onInsertBlock}
        />
      </Portal>
      <Portal isOpened={!visualElementSelect.isOpen}>
        <div data-cy="slate-block-picker-button" ref={slateBlockRef}>
          <SlateBlockMenu
            ref={slateBlockButtonRef}
            cy="slate-block-picker"
            isOpen={isOpen}
            heading={t('editorBlockpicker.heading')}
            actions={getActionsForArea().map(action => ({
              ...action,
              label: t(`editorBlockpicker.actions.${action.data.object}`),
            }))}
            onToggleOpen={toggleIsOpen}
            clickItem={(data: ActionData) => {
              onElementAdd(data);
            }}
          />
        </div>
      </Portal>
    </>
  );
};

export default injectT(SlateBlockPicker);
