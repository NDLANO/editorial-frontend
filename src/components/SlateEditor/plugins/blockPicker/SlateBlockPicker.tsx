/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Node, Location, Range, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import styled from "@emotion/styled";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Portal } from "@radix-ui/react-portal";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { animations, colors, fonts, shadows, spacing, stackOrder } from "@ndla/core";
import { Plus } from "@ndla/icons/action";
import { Heading } from "@ndla/typography";
import { Action, ActionData } from "./actions";
import SlateVisualElementPicker from "./SlateVisualElementPicker";
import { BLOCK_PICKER_TRIGGER_ID } from "../../../../constants";
import { useSession } from "../../../../containers/Session/SessionProvider";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { TYPE_ASIDE } from "../aside/types";
import { defaultAsideBlock } from "../aside/utils";
import { TYPE_AUDIO } from "../audio/types";
import { TYPE_CAMPAIGN_BLOCK } from "../campaignBlock/types";
import { defaultCampaignBlock } from "../campaignBlock/utils";
import { TYPE_CODEBLOCK } from "../codeBlock/types";
import { defaultCodeblockBlock } from "../codeBlock/utils";
import { TYPE_COMMENT_BLOCK } from "../comment/block/types";
import { defaultCommentBlock } from "../comment/block/utils";
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from "../concept/block/types";
import { defaultConceptBlock } from "../concept/block/utils";
import { TYPE_CONTACT_BLOCK } from "../contactBlock/types";
import { defaultContactBlock } from "../contactBlock/utils";
import { TYPE_DETAILS } from "../details/types";
import { defaultDetailsBlock } from "../details/utils";
import { TYPE_EMBED_ERROR } from "../embed/types";
import { TYPE_EXTERNAL } from "../external/types";
import { defaultExternalBlock } from "../external/utils";
import { TYPE_FILE } from "../file/types";
import { TYPE_FRAMED_CONTENT } from "../framedContent/types";
import { defaultFramedContentBlock } from "../framedContent/utils";
import { TYPE_GRID } from "../grid/types";
import { defaultGridBlock } from "../grid/utils";
import { TYPE_H5P } from "../h5p/types";
import { defaultH5pBlock } from "../h5p/utils";
import { TYPE_IMAGE } from "../image/types";
import { TYPE_KEY_FIGURE } from "../keyFigure/types";
import { defaultKeyFigureBlock } from "../keyFigure/utils";
import { defaultLinkBlockList } from "../linkBlockList";
import { TYPE_LINK_BLOCK_LIST } from "../linkBlockList/types";
import { TYPE_LIST_ITEM } from "../list/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { TYPE_PITCH } from "../pitch/types";
import { defaultPitchBlock } from "../pitch/utils";
import { defaultRelatedBlock } from "../related";
import { TYPE_RELATED } from "../related/types";
import { defaultTableBlock } from "../table/defaultBlocks";
import { isInTableCellHeader, isTableCell } from "../table/slateHelpers";
import { TYPE_TABLE } from "../table/types";
import { IS_MAC } from "../toolbar/ToolbarButton";
import { TYPE_DISCLAIMER } from "../uuDisclaimer/types";
import { defaultDisclaimerBlock } from "../uuDisclaimer/utils";
import { TYPE_EMBED_BRIGHTCOVE } from "../video/types";

interface Props {
  editor: Editor;
  actions: Action[];
  allowedPickAreas: Element["type"][];
  illegalAreas: Element["type"][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage?: string;
}

const StyledContent = styled(PopoverContent)`
  background-color: ${colors.white};
  z-index: ${stackOrder.popover};
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
  ${animations.fadeInLeft(animations.durations.fast)};
`;

const BlockPickerLabel = styled(Heading)`
  font-weight: ${fonts.weight.normal};
  color: ${colors.text.light};
`;

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;

  li {
    display: flex;
    gap: ${spacing.normal};
    justify-content: space-between;
    padding: 0px;
  }
`;

const ActionButton = styled(ButtonV2)`
  text-decoration: underline;
  text-underline-offset: 4px;
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  svg {
    color: ${colors.brand.tertiary};
    width: ${spacing.normal};
    height: ${spacing.normal};
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
  z-index: ${stackOrder.trigger + stackOrder.offsetSingle};
  border: 2px solid ${colors.brand.primary};
  height: ${spacing.large};
  width: ${spacing.large};
  transition:
    background 200ms ease,
    transform 200ms ease;
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

  &[data-state="open"] {
    svg {
      transform: rotate(135deg);
    }
  }
  &[hidden] {
    display: none;
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
  const [type, setType] = useState("");
  const { userPermissions } = useSession();
  const { t } = useTranslation();

  const blockPickerLabel = useMemo(
    () =>
      blockPickerOpen ? t("editorBlockpicker.close") : t("editorBlockpicker.open", { ctrl: IS_MAC ? "cmd" : "ctrl" }),
    [blockPickerOpen, t],
  );

  const [selectedParagraph, selectedParagraphPath] = getCurrentBlock(editor, TYPE_PARAGRAPH) || [];

  useEffect(() => {
    const el = portalRef.current;
    const { selection } = editor;
    if (!el) return;

    const [node] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && !editor.isInline(node),
      mode: "lowest",
    });

    const [illegalBlock] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && illegalAreas.includes(node.type),
    });

    if (
      // If there is no selection, return.
      !selection ||
      // If the current selection is not a paragraph, return.
      !selectedParagraph ||
      // Do not show block picker in table headers.
      isInTableCellHeader(editor, selectedParagraphPath) ||
      // If the current paragraph contains text, return.
      Node.string(selectedParagraph) !== "" ||
      // If `shouldHideBlockPicker` returns true, hide it.
      editor.shouldHideBlockPicker?.() ||
      illegalBlock ||
      // If the node is an element and it is not included in the allowed pick areas, return.
      (Element.isElement(node[0]) && !allowedPickAreas.includes(node[0].type))
    ) {
      el.hidden = true;
      return;
    }
    const parent = selectedParagraphPath && Editor.node(editor, Path.parent(selectedParagraphPath))?.[0];
    const leftAdjust = getLeftAdjust(parent);
    const domElement = ReactEditor.toDOMNode(editor, selectedParagraph);
    const rect = domElement.getBoundingClientRect();
    el.hidden = false;
    const left = rect.left + window.scrollX - leftAdjust;
    el.style.top = `${rect.top + window.scrollY - 14}px`;
    el.style.left = `${left}px`;
  });

  useEffect(() => {
    if (Location.isLocation(editor.selection)) {
      setLastActiveSelection(editor.selection);
    }
    !editor.selection && lastActiveSelection && (editor.selection = lastActiveSelection);
  }, [editor, editor.selection, lastActiveSelection]);

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
    setType("");
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
    setType("");
  };

  const onElementAdd = (data: ActionData) => {
    switch (data.type) {
      case TYPE_FRAMED_CONTENT: {
        onInsertBlock(defaultFramedContentBlock(), true);
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
        onInsertBlock(defaultAsideBlock(), true);
        break;
      }
      case TYPE_AUDIO: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case TYPE_H5P: {
        onInsertBlock(defaultH5pBlock());
        break;
      }
      case TYPE_EXTERNAL: {
        onInsertBlock(defaultExternalBlock());
        break;
      }
      case TYPE_EMBED_BRIGHTCOVE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case TYPE_IMAGE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case TYPE_FILE:
      case TYPE_EMBED_ERROR: {
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
      case TYPE_PITCH: {
        onInsertBlock(defaultPitchBlock());
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
        onInsertBlock(defaultConceptBlock("gloss"));
        break;
      }
      case TYPE_DISCLAIMER: {
        onInsertBlock(defaultDisclaimerBlock(t("form.disclaimer.default")));
        break;
      }
      case TYPE_COMMENT_BLOCK: {
        onInsertBlock(defaultCommentBlock());
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
      if (node.type === "section") {
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
        resource={type || ""}
        onVisualElementClose={onVisualElementClose}
        onInsertBlock={onInsertBlock}
      />
      <Popover open={blockPickerOpen} onOpenChange={onOpenChange}>
        <Portal>
          <PopoverTrigger asChild ref={portalRef}>
            <BlockPickerButton
              colorTheme="light"
              data-testid="slate-block-picker"
              id={BLOCK_PICKER_TRIGGER_ID}
              aria-label={blockPickerLabel}
              title={blockPickerLabel}
            >
              <Plus />
            </BlockPickerButton>
          </PopoverTrigger>
        </Portal>
        <StyledContent side="right" sideOffset={6} data-testid="slate-block-picker-menu" avoidCollisions={false}>
          <BlockPickerLabel element="h1" headingStyle="list-title" margin="none">
            {t("editorBlockpicker.heading")}
          </BlockPickerLabel>
          <StyledList>
            {getActionsForArea()
              .filter((a) => !a.requiredScope || userPermissions?.includes(a.requiredScope))
              .map((action) => (
                <li key={action.data.object}>
                  <ActionButton
                    onClick={() => onElementAdd(action.data)}
                    variant="stripped"
                    data-testid={`create-${action.data.object}`}
                  >
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
