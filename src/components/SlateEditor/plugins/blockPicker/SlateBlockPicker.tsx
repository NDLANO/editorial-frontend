/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef, useEffect, useState } from 'react';
import { Editor, Element, Node, Location, Range, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
import { Portal } from '@radix-ui/react-portal';
import { SlateBlockMenu } from '@ndla/editor';
import styled from '@emotion/styled';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import { Action, ActionData } from './actions';
import { defaultAsideBlock } from '../aside/utils';
import { defaultDetailsBlock } from '../details/utils';
import { defaultBodyboxBlock } from '../bodybox/utils';
import { defaultCodeblockBlock } from '../codeBlock/utils';
import { defaultRelatedBlock } from '../related';
import { TYPE_LIST_ITEM } from '../list/types';
import { defaultConceptListBlock } from '../conceptList/utils';
import { TYPE_CONCEPT_BLOCK } from '../concept/block/types';
import { defaultConceptBlock } from '../concept/block/utils';
import { useSession } from '../../../../containers/Session/SessionProvider';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { isParagraph } from '../paragraph/utils';
import { isTableCell } from '../table/slateHelpers';
import { defaultTableBlock } from '../table/defaultBlocks';
import { TYPE_BODYBOX } from '../bodybox/types';
import { TYPE_DETAILS } from '../details/types';
import { TYPE_TABLE } from '../table/types';
import { TYPE_ASIDE } from '../aside/types';
import { TYPE_FILE } from '../file/types';
import {
  TYPE_EMBED_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from '../embed/types';
import { TYPE_RELATED } from '../related/types';
import { TYPE_CODEBLOCK } from '../codeBlock/types';
import { TYPE_CONCEPT_LIST } from '../conceptList/types';
import { TYPE_KEY_FIGURE } from '../keyFigure/types';
import { defaultKeyFigureBlock } from '../keyFigure/utils';
import { TYPE_CONTACT_BLOCK } from '../contactBlock/types';
import { TYPE_BLOGPOST } from '../blogPost/types';
import { defaultBlogPostBlock } from '../blogPost/utils';
import { TYPE_GRID } from '../grid/types';
import { defaultGridBlock } from '../grid/utils';
import { defaultContactBlock } from '../contactBlock/utils';

interface Props {
  editor: Editor;
  actions: Action[];
  allowedPickAreas: Element['type'][];
  illegalAreas: Element['type'][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage: string;
}

const StyledBlockPickerWrapper = styled.div`
  position: absolute;
  z-index: 1;
`;

const SlateBlockPicker = ({
  editor,
  actionsToShowInAreas,
  articleLanguage,
  illegalAreas,
  allowedPickAreas,
  actions,
}: Props) => {
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [lastActiveSelection, setLastActiveSelection] = useState<Range>();

  const [visualElementPickerOpen, setVisualElementPickerOpen] = useState(false);
  const [type, setType] = useState('');

  const { userPermissions } = useSession();
  const { t } = useTranslation();

  const [selectedParagraph, selectedParagraphPath] = getCurrentBlock(editor, TYPE_PARAGRAPH) || [];

  const selection = editor.selection;

  const getLeftAdjust = () => {
    const parent =
      selectedParagraphPath && Editor.node(editor, Path.parent(selectedParagraphPath))?.[0];

    if (Element.isElement(parent) && parent.type === TYPE_LIST_ITEM) {
      return 110;
    }
    if (isTableCell(parent)) {
      return 100;
    }
    if (Element.isElement(parent) && parent.type === TYPE_GRID) {
      return -100;
    }

    return 78;
  };

  const show =
    isParagraph(selectedParagraph) &&
    Node.string(selectedParagraph) === '' &&
    selectedParagraph.children.length === 1 &&
    selectedParagraphPath &&
    selection &&
    Path.isDescendant(selection.anchor.path, selectedParagraphPath) &&
    Range.isCollapsed(selection);

  const portalRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      updateMenu();
    }, 0);
  });

  const updateMenu = () => {
    const menu = portalRef.current;
    if (!menu) {
      return;
    }
    if (!show || !selectedParagraph) {
      menu.removeAttribute('style');
      return;
    }

    if (!editor.shouldShowToolbar()) {
      menu.removeAttribute('style');
      return;
    }

    const domElement = ReactEditor.toDOMNode(editor, selectedParagraph);
    const rect = domElement.getBoundingClientRect();

    const left = rect.left + window.scrollX - getLeftAdjust();
    menu.style.top = `${rect.top + window.scrollY - 14}px`;
    menu.style.left = `${left}px`;
  };

  useEffect(() => {
    if (Location.isLocation(editor.selection)) {
      setLastActiveSelection(editor.selection);
    }
  }, [editor.selection]);

  const onVisualElementClose = () => {
    setVisualElementPickerOpen(false);
    setType('');
    ReactEditor.focus(editor);
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
      case TYPE_BODYBOX: {
        onInsertBlock(defaultBodyboxBlock(), true);
        break;
      }
      case TYPE_DETAILS: {
        onInsertBlock(defaultDetailsBlock(), true);
        break;
      }
      case TYPE_TABLE: {
        onInsertBlock(defaultTableBlock(2, 2), true);
        break;
      }
      case TYPE_ASIDE: {
        onInsertBlock(defaultAsideBlock(data.object), true);
        break;
      }
      case TYPE_FILE:
      case TYPE_EMBED_H5P:
      case TYPE_EMBED_AUDIO:
      case TYPE_EMBED_IMAGE:
      case TYPE_EMBED_ERROR:
      case TYPE_EMBED_EXTERNAL:
      case TYPE_EMBED_BRIGHTCOVE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case TYPE_RELATED: {
        onInsertBlock(defaultRelatedBlock());
        break;
      }
      case TYPE_CODEBLOCK: {
        onInsertBlock(defaultCodeblockBlock());
        break;
      }
      case TYPE_BLOGPOST: {
        onInsertBlock(defaultBlogPostBlock());
        break;
      }
      case TYPE_CONCEPT_LIST: {
        onInsertBlock({ ...defaultConceptListBlock(), isFirstEdit: true });
        break;
      }
      case TYPE_CONCEPT_BLOCK: {
        onInsertBlock(defaultConceptBlock());
        break;
      }
      case TYPE_GRID: {
        onInsertBlock(defaultGridBlock());
        break;
      }
      case TYPE_KEY_FIGURE: {
        onInsertBlock(defaultKeyFigureBlock());
        break;
      }
      case TYPE_CONTACT_BLOCK: {
        onInsertBlock(defaultContactBlock());
        break;
      }
      default:
        setBlockPickerOpen(false);
        break;
    }
  };

  const shouldShowMenuPicker = () => {
    const [node] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && !editor.isInline(node),
      mode: 'lowest',
    });

    const [illegalBlock] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && illegalAreas.includes(node.type),
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
          allowedPickAreas.includes(node[0].type)))
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
      match: (node) => Element.isElement(node) && !editor.isInline(node),
      at: Editor.unhangRange(editor, lastActiveSelection),
      reverse: true,
    });

    for (const entry of nodes) {
      const [node, path] = entry;
      if (!Element.isElement(node)) return actions;
      if (node.type === 'section') {
        return actions;
      }
      const [parent] = Editor.parent(editor, path);
      if (Element.isElement(parent) && actionsToShowInAreas[parent.type]) {
        return actions.filter(
          (action) =>
            actionsToShowInAreas[parent.type].includes(action.data.type) ||
            actionsToShowInAreas[parent.type].includes(action.data.object),
        );
      }
    }

    return actions;
  };

  if ((!shouldShowMenuPicker() || !show) && !visualElementPickerOpen) {
    return null;
  }

  return (
    <>
      <SlateVisualElementPicker
        isOpen={visualElementPickerOpen}
        articleLanguage={articleLanguage}
        resource={type || ''}
        onVisualElementClose={onVisualElementClose}
        onInsertBlock={onInsertBlock}
      />
      {!visualElementPickerOpen && (
        <Portal>
          <StyledBlockPickerWrapper ref={portalRef} data-cy="slate-block-picker-button">
            <SlateBlockMenu
              cy="slate-block-picker"
              isOpen={blockPickerOpen}
              heading={t('editorBlockpicker.heading')}
              actions={getActionsForArea()
                .filter((action) => {
                  return !action.requiredScope || userPermissions?.includes(action.requiredScope);
                })
                .map((action) => ({
                  ...action,
                  label: t(`editorBlockpicker.actions.${action.data.object}`),
                }))}
              onToggleOpen={(open) => {
                ReactEditor.focus(editor);
                setBlockPickerOpen(open);
              }}
              clickItem={(data: ActionData) => {
                onElementAdd(data);
              }}
            />
          </StyledBlockPickerWrapper>
        </Portal>
      )}
    </>
  );
};

export default SlateBlockPicker;
