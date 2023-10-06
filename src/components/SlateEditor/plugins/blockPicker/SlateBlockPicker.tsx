/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, Element, Node, Location, Range, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
import styled from '@emotion/styled';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Portal } from '@radix-ui/react-portal';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { Plus } from '@ndla/icons/action';
import { shadows, colors, spacing, fonts, animations } from '@ndla/core';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import { Action, ActionData } from './actions';
import { defaultAsideBlock } from '../aside/utils';
import { defaultDetailsBlock } from '../details/utils';
import { defaultBodyboxBlock } from '../bodybox/utils';
import { defaultCodeblockBlock } from '../codeBlock/utils';
import { defaultRelatedBlock } from '../related';
import { defaultCampaignBlock } from '../campaignBlock/utils';
import { TYPE_LIST_ITEM } from '../list/types';
import { defaultConceptListBlock } from '../conceptList/utils';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from '../concept/block/types';
import { defaultConceptBlock, defaultGlossBlock } from '../concept/block/utils';
import { useSession } from '../../../../containers/Session/SessionProvider';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { isInTableCellHeader, isTableCell } from '../table/slateHelpers';
import { defaultTableBlock } from '../table/defaultBlocks';
import { TYPE_BODYBOX } from '../bodybox/types';
import { TYPE_DETAILS } from '../details/types';
import { TYPE_TABLE } from '../table/types';
import { TYPE_ASIDE } from '../aside/types';
import { TYPE_FILE } from '../file/types';
import {
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
import { TYPE_CAMPAIGN_BLOCK } from '../campaignBlock/types';
import { TYPE_LINK_BLOCK_LIST } from '../linkBlockList/types';
import { defaultLinkBlockList } from '../linkBlockList';
import { TYPE_AUDIO } from '../audio/types';

interface Props {
  editor: Editor;
  actions: Action[];
  allowedPickAreas: Element['type'][];
  illegalAreas: Element['type'][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage: string;
}

const StyledContent = styled(PopoverContent)`
  background-color: ${colors.white};
  z-index: 10;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
  ${animations.fadeInLeft(animations.durations.fast)};
`;

const BlockPickerTitle = styled.p`
  font-weight: ${fonts.weight.normal};
  text-transform: uppercase;
  font-family: ${fonts.sans};
  color: ${colors.text.light};
  margin: 0px;
`;

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  li {
    display: flex;
    flex: 1;
    gap: ${spacing.normal};
    justify-content: space-between;
    margin: 0px;
  }
`;

const ActionButton = styled(ButtonV2)`
  text-decoration: underline;
  text-underline-offset: 4px;
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  svg {
    color: ${colors.brand.tertiary};
    width: 24px;
    height: 24px;
  }
  transition: color 200ms ease;
  &:hover,
  &:focus-within {
    text-decoration: none;
    svg {
      color: ${colors.brand.primary};
    }
  }
`;

const BlockPickerButton = styled(IconButtonV2)`
  position: absolute;
  z-index: 15;
  border-color: ${colors.brand.primary};
  height: ${spacing.large};
  width: ${spacing.large};
  border-width: 2px;
  transition: background 200ms ease, transform 200ms ease;
  svg {
    transition: transform 300ms ease;
    height: ${spacing.medium};
    width: ${spacing.medium};
  }
  &:hover,
  &:focus-visible {
    border-color: ${colors.brand.primary};
    background-color: ${colors.brand.tertiary};
    color: ${colors.brand.primary};
  }
  &:active {
    transform: scale(0.9);
  }

  &[data-state='open'] {
    svg {
      transform: rotate(135deg);
    }
  }
`;

const getLeftAdjust = (parent?: Node) => {
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
  const portalRef = useRef<HTMLButtonElement | null>(null);

  const [visualElementPickerOpen, setVisualElementPickerOpen] = useState(false);
  const [type, setType] = useState('');
  const { userPermissions } = useSession();
  const { t } = useTranslation();

  const [selectedParagraph, selectedParagraphPath] = getCurrentBlock(editor, TYPE_PARAGRAPH) || [];

  useEffect(() => {
    const el = portalRef.current;
    const { selection } = editor;
    if (!el) return;

    const [node] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && !editor.isInline(node),
      mode: 'lowest',
    });

    const [illegalBlock] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && illegalAreas.includes(node.type),
    });

    if (
      !selection ||
      !selectedParagraph ||
      isInTableCellHeader(editor, selectedParagraphPath) ||
      Node.string(selectedParagraph) !== '' ||
      !editor.shouldShowBlockPicker?.() ||
      illegalBlock ||
      (Element.isElement(node[0]) && !allowedPickAreas.includes(node[0].type))
    ) {
      el.style.display = 'none';
      return;
    }
    const parent =
      selectedParagraphPath && Editor.node(editor, Path.parent(selectedParagraphPath))?.[0];
    const leftAdjust = getLeftAdjust(parent);
    const domElement = ReactEditor.toDOMNode(editor, selectedParagraph);
    const rect = domElement.getBoundingClientRect();
    el.style.display = 'block';
    const left = rect.left + window.scrollX - leftAdjust;
    el.style.top = `${rect.top + window.scrollY - 14}px`;
    el.style.left = `${left}px`;
  });

  useEffect(() => {
    if (Location.isLocation(editor.selection)) {
      setLastActiveSelection(editor.selection);
    }
  }, [editor.selection]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      setBlockPickerOpen(open);
      if (!open && !visualElementPickerOpen) {
        ReactEditor.focus(editor);
      }
    },
    [editor, visualElementPickerOpen],
  );

  const onVisualElementClose = useCallback(() => {
    setVisualElementPickerOpen(false);
    setType('');
    ReactEditor.focus(editor);
  }, [editor]);

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
      case TYPE_AUDIO: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case TYPE_FILE:
      case TYPE_EMBED_H5P:
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
      case TYPE_CAMPAIGN_BLOCK: {
        onInsertBlock(defaultCampaignBlock());
        break;
      }
      case TYPE_LINK_BLOCK_LIST: {
        onInsertBlock(defaultLinkBlockList());
        break;
      }
      case TYPE_GLOSS_BLOCK: {
        onInsertBlock(defaultGlossBlock());
        break;
      }
      default:
        setBlockPickerOpen(false);
        break;
    }
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

  return (
    <>
      <SlateVisualElementPicker
        isOpen={visualElementPickerOpen}
        articleLanguage={articleLanguage}
        resource={type || ''}
        onVisualElementClose={onVisualElementClose}
        onInsertBlock={onInsertBlock}
      />
      <Popover open={blockPickerOpen} onOpenChange={onOpenChange}>
        <Portal>
          <PopoverTrigger asChild ref={portalRef}>
            <BlockPickerButton
              colorTheme="light"
              data-testid="slate-block-picker-button"
              aria-label={blockPickerOpen ? t('slateBlockMenu.close') : t('slateBlockMenu.open')}
              title={blockPickerOpen ? t('slateBlockMenu.close') : t('slateBlockMenu.open')}
            >
              <Plus />
            </BlockPickerButton>
          </PopoverTrigger>
        </Portal>
        <StyledContent side="right" sideOffset={6} data-testid="slate-block-picker">
          <BlockPickerTitle>{t('editorBlockpicker.heading')}</BlockPickerTitle>
          <StyledList>
            {getActionsForArea()
              .filter((a) => !a.requiredScope || userPermissions?.includes(a.requiredScope))
              .map((action) => (
                <li key={action.data.object}>
                  <ActionButton onClick={() => onElementAdd(action.data)} variant="stripped">
                    {action.icon}
                    {t(`editorBlockpicker.actions.${action.data.object}`)}
                  </ActionButton>
                  {action.helpIcon}
                </li>
              ))}
          </StyledList>
        </StyledContent>
      </Popover>
    </>
  );
};

export default SlateBlockPicker;
