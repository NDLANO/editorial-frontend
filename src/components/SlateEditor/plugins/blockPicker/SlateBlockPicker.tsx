/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Node, Range, Path, Transforms } from "slate";
import { ReactEditor, useSlateSelection, useSlateSelector, useSlateStatic } from "slate-react";
import { PopoverOpenChangeDetails, Portal } from "@ark-ui/react";
import { isElementOfType, isParagraphElement } from "@ndla/editor";
import { AddLine, ExternalLinkLine } from "@ndla/icons";
import {
  PopoverRoot,
  PopoverTrigger,
  IconButton,
  Button,
  Heading,
  PopoverContent,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Action, ActionData } from "./actions";
import SlateVisualElementPicker from "./SlateVisualElementPicker";
import { BLOCK_PICKER_TRIGGER_ID } from "../../../../constants";
import { useSession } from "../../../../containers/Session/SessionProvider";
import { ASIDE_ELEMENT_TYPE } from "../aside/asideTypes";
import { defaultAsideBlock } from "../aside/utils";
import { AUDIO_ELEMENT_TYPE } from "../audio/audioTypes";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "../campaignBlock/types";
import { defaultCampaignBlock } from "../campaignBlock/utils";
import { CODE_BLOCK_ELEMENT_TYPE } from "../codeBlock/types";
import { defaultCodeblockBlock } from "../codeBlock/utils";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../comment/block/types";
import { defaultCommentBlock } from "../comment/block/utils";
import { CONCEPT_BLOCK_ELEMENT_TYPE, GLOSS_BLOCK_ELEMENT_TYPE } from "../concept/block/types";
import { defaultConceptBlock } from "../concept/block/utils";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../contactBlock/types";
import { defaultContactBlock } from "../contactBlock/utils";
import { DETAILS_ELEMENT_TYPE } from "../details/detailsTypes";
import { defaultDetailsBlock } from "../details/utils";
import { EXTERNAL_ELEMENT_TYPE } from "../external/types";
import { defaultExternalBlock } from "../external/utils";
import { FILE_ELEMENT_TYPE } from "../file/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
import { defaultFramedContentBlock } from "../framedContent/utils";
import { isGridElement } from "../grid/queries";
import { GRID_ELEMENT_TYPE } from "../grid/types";
import { defaultGridBlock } from "../grid/utils";
import { H5P_ELEMENT_TYPE } from "../h5p/types";
import { defaultH5pBlock } from "../h5p/utils";
import { IMAGE_ELEMENT_TYPE } from "../image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { defaultKeyFigureBlock } from "../keyFigure/utils";
import { defaultLinkBlockList } from "../linkBlockList";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "../linkBlockList/types";
import { TYPE_LIST_ITEM } from "../list/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { defaultPitchBlock } from "../pitch/utils";
import { defaultRelatedBlock } from "../related";
import { RELATED_ELEMENT_TYPE } from "../related/types";
import { defaultTableBlock } from "../table/defaultBlocks";
import { isAnyTableCellElement } from "../table/queries";
import { TABLE_ELEMENT_TYPE } from "../table/types";
import { IS_MAC } from "../toolbar/ToolbarToggle";
import { DISCLAIMER_ELEMENT_TYPE } from "../uuDisclaimer/types";
import { defaultDisclaimerBlock } from "../uuDisclaimer/utils";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../video/types";

interface BlockReturnType {
  type: "block";
  element: Element;
  focus?: boolean;
}

interface VisualElementReturnType {
  type: "visualElement";
  elementType: string;
}

export const getAction = (data: ActionData): BlockReturnType | VisualElementReturnType | undefined => {
  switch (data.type) {
    case FRAMED_CONTENT_ELEMENT_TYPE:
      return { type: "block", element: defaultFramedContentBlock(), focus: true };
    case DETAILS_ELEMENT_TYPE:
      return { type: "block", element: defaultDetailsBlock(), focus: true };
    case TABLE_ELEMENT_TYPE:
      return { type: "block", element: defaultTableBlock(2, 2), focus: true };
    case ASIDE_ELEMENT_TYPE:
      return { type: "block", element: defaultAsideBlock(), focus: true };
    case AUDIO_ELEMENT_TYPE:
      return { type: "visualElement", elementType: data.object };
    case H5P_ELEMENT_TYPE:
      return { type: "block", element: defaultH5pBlock() };
    case EXTERNAL_ELEMENT_TYPE:
      return { type: "block", element: defaultExternalBlock() };
    case BRIGHTCOVE_ELEMENT_TYPE:
      return { type: "visualElement", elementType: data.object };
    case IMAGE_ELEMENT_TYPE:
      return { type: "visualElement", elementType: data.object };
    case FILE_ELEMENT_TYPE:
      return { type: "visualElement", elementType: data.object };
    case RELATED_ELEMENT_TYPE:
      return { type: "block", element: defaultRelatedBlock() };
    case CODE_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultCodeblockBlock() };
    case PITCH_ELEMENT_TYPE:
      return { type: "block", element: defaultPitchBlock() };
    case CONCEPT_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultConceptBlock() };
    case GRID_ELEMENT_TYPE:
      return { type: "block", element: defaultGridBlock(), focus: true };
    case KEY_FIGURE_ELEMENT_TYPE:
      return { type: "block", element: defaultKeyFigureBlock() };
    case CONTACT_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultContactBlock() };
    case CAMPAIGN_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultCampaignBlock() };
    case LINK_BLOCK_LIST_ELEMENT_TYPE:
      return { type: "block", element: defaultLinkBlockList() };
    case GLOSS_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultConceptBlock("gloss") };
    case DISCLAIMER_ELEMENT_TYPE:
      return { type: "block", element: defaultDisclaimerBlock() };
    case COMMENT_BLOCK_ELEMENT_TYPE:
      return { type: "block", element: defaultCommentBlock() };
    default:
      return undefined;
  }
};

const getAvailableActions = (
  editor: Editor,
  actions: Action[],
  actionsToShowInAreas: { [key: string]: string[] },
): Action[] => {
  if (!editor.selection) return actions;
  if (!Node.has(editor, Range.start(editor.selection).path) || !Node.has(editor, Range.end(editor.selection).path)) {
    return actions;
  }

  const nodes = Editor.levels<Element>(editor, {
    match: (node) => Element.isElement(node) && !editor.isInline(node),
    at: Editor.unhangRange(editor, editor.selection),
    reverse: true,
  });

  for (const [node, path] of nodes) {
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

interface Props {
  actions: Action[];
  allowedPickAreas: Element["type"][];
  illegalAreas: Element["type"][];
  actionsToShowInAreas: { [key: string]: string[] };
  articleLanguage?: string;
}

const ActionButton = styled(Button, {
  base: {
    width: "100%",
    justifyContent: "flex-start",
  },
});

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledLi = styled("li", {
  base: {
    display: "flex",
    gap: "small",
    justifyContent: "space-between",
  },
});

const BlockPickerButton = styled(IconButton, {
  base: {
    position: "absolute",
    "& > svg": {
      transition: "background 200ms ease, transform 200ms ease",
    },
    _open: {
      "& > svg": {
        transform: "rotate(45deg)",
      },
    },
  },
});

const StyledHeading = styled(Heading, {
  base: {
    paddingInlineStart: "xsmall",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    // This acts more like a dropdown than a popover. We only have it as a popover because the "menu" is somewhat interactive.
    zIndex: "dropdown",
  },
});

const getLeftAdjust = (parent?: Node) => {
  if (Element.isElement(parent) && parent.type === TYPE_LIST_ITEM) {
    return 110;
  }
  if (isAnyTableCellElement(parent)) {
    return 100;
  }
  if (isGridElement(parent)) {
    return -100;
  }

  return 78;
};

const popoverIds = {
  trigger: BLOCK_PICKER_TRIGGER_ID,
} as const;

const helpBaseUrl = "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel";
const helpLink = (type: string, t: TFunction, bookmark?: string) => {
  if (bookmark) {
    return (
      <TooltipRoot key={type} openDelay={0}>
        <TooltipTrigger asChild>
          <SafeLink to={helpBaseUrl + bookmark} target="_blank">
            <ExternalLinkLine size="small" />
          </SafeLink>
        </TooltipTrigger>
        <TooltipContent>
          {t("editorBlockpicker.tooltip", { type: t(`editorBlockpicker.actions.${type}`) })}
        </TooltipContent>
      </TooltipRoot>
    );
  }
  return undefined;
};

const SlateBlockPicker = ({
  actionsToShowInAreas,
  articleLanguage,
  illegalAreas,
  allowedPickAreas,
  actions,
}: Props) => {
  const editor = useSlateStatic();
  const selection = useSlateSelection();
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [actionsForArea, setActionsForArea] = useState<Action[]>([]);
  const portalRef = useRef<HTMLButtonElement | null>(null);
  const { userPermissions } = useSession();

  const [visualElementPickerOpen, setVisualElementPickerOpen] = useState(false);
  const [type, setType] = useState("");
  const { t } = useTranslation();

  // Checks are sorted from least expensive to most expensive.
  const shouldShowBlockPicker = useSlateSelector((editor) => {
    if (!editor.selection || Range.isExpanded(editor.selection) || !portalRef.current) return false;
    const [selectedParagraphEntry] = editor.nodes({ match: isParagraphElement, mode: "lowest" });
    if (!selectedParagraphEntry?.[0]) return false;
    if (editor.shouldHideBlockPicker?.()) return false;
    if (Node.string(selectedParagraphEntry[0])) return false;
    const [illegalBlock] = editor.nodes({ match: (n) => isElementOfType(n, illegalAreas) });
    if (illegalBlock) return false;
    const [lowestBlock] = editor.nodes<Element>({
      match: (n) => Element.isElement(n) && !editor.isInline(n),
      mode: "lowest",
    });
    if (!lowestBlock) return false;
    return allowedPickAreas.includes(lowestBlock[0].type);
  });

  const blockPickerLabel = useMemo(
    () =>
      blockPickerOpen ? t("editorBlockpicker.close") : t("editorBlockpicker.open", { ctrl: IS_MAC ? "cmd" : "ctrl" }),
    [blockPickerOpen, t],
  );

  useEffect(() => {
    if (!portalRef.current) return;
    const el = portalRef.current;
    if (shouldShowBlockPicker) {
      const [selectedParagraphEntry] = editor.nodes({ match: isParagraphElement, mode: "lowest" });
      if (!selectedParagraphEntry) return;
      const [selectedParagraph, selectedParagraphPath] = selectedParagraphEntry;
      const parent = selectedParagraphPath && Editor.node(editor, Path.parent(selectedParagraphPath))?.[0];
      const leftAdjust = getLeftAdjust(parent);
      const domElement = ReactEditor.toDOMNode(editor, selectedParagraph);
      const rect = domElement.getBoundingClientRect();
      el.hidden = false;
      const left = rect.left + window.scrollX - leftAdjust;
      el.style.top = `${rect.top + window.scrollY - 14}px`;
      el.style.left = `${left}px`;
    } else {
      el.hidden = true;
    }
  }, [editor, shouldShowBlockPicker, selection]);

  const onOpenChange = useCallback(
    (details: PopoverOpenChangeDetails) => {
      if (details.open) {
        const availableActions = getAvailableActions(editor, actions, actionsToShowInAreas).filter(
          (a) => !a.requiredScope || userPermissions?.includes(a.requiredScope),
        );
        setActionsForArea(availableActions);
      }
      setBlockPickerOpen(details.open);
      if (!details.open && !visualElementPickerOpen) {
        ReactEditor.focus(editor);
      }
    },
    [actions, actionsToShowInAreas, editor, userPermissions, visualElementPickerOpen],
  );

  const onFocus = useCallback(() => {
    if (!blockPickerOpen) {
      // TODO: This should probably be deferred to the next render, but doing it breaks CI.
      ReactEditor.focus(editor);
    }
  }, [blockPickerOpen, editor]);

  const positioning = useMemo(
    () =>
      ({
        placement: "right",
        getAnchorRect: () => portalRef.current?.getBoundingClientRect() ?? null,
      }) as const,
    [],
  );

  const onVisualElementClose = useCallback(() => {
    setVisualElementPickerOpen(false);
    setType("");
    ReactEditor.focus(editor);
  }, [editor]);

  const onInsertBlock = useCallback(
    (block: Element, selectBlock?: boolean) => {
      setTimeout(() => {
        Editor.withoutNormalizing(editor, () => {
          const [paragraph] = editor.nodes({ match: isParagraphElement, mode: "lowest" });
          const selectedParagraphPath = paragraph?.[1];
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
    },
    [editor],
  );

  const onElementAdd = useCallback(
    (data: ActionData) => {
      const action = getAction(data);
      if (!action) {
        setBlockPickerOpen(false);
      } else if (action.type === "block") {
        onInsertBlock(action.element, action.focus);
      } else if (action.type === "visualElement") {
        setType(action.elementType);
        setVisualElementPickerOpen(true);
      }
    },
    [onInsertBlock],
  );

  return (
    <>
      <SlateVisualElementPicker
        isOpen={visualElementPickerOpen}
        articleLanguage={articleLanguage}
        resource={type || ""}
        onVisualElementClose={onVisualElementClose}
        onInsertBlock={onInsertBlock}
      />
      <PopoverRoot open={blockPickerOpen} positioning={positioning} onOpenChange={onOpenChange} ids={popoverIds}>
        <Portal>
          <PopoverTrigger ref={portalRef} asChild>
            <BlockPickerButton
              variant="secondary"
              data-testid="slate-block-picker"
              aria-label={blockPickerLabel}
              title={blockPickerLabel}
              data-state={blockPickerOpen ? "open" : "closed"}
              onFocus={onFocus}
            >
              <AddLine />
            </BlockPickerButton>
          </PopoverTrigger>
          <StyledPopoverContent data-testid="slate-block-picker-menu">
            <StyledHeading textStyle="title.small">{t("editorBlockpicker.heading")}</StyledHeading>
            <StyledList>
              {actionsForArea.map((action) => (
                <StyledLi key={action.data.object}>
                  <ActionButton
                    onClick={() => onElementAdd(action.data)}
                    variant="tertiary"
                    data-testid={`create-${action.data.object}`}
                    size="small"
                  >
                    {action.icon}
                    {t(`editorBlockpicker.actions.${action.data.object}`)}
                  </ActionButton>
                  {helpLink(action.data.object, t, action.bookmark)}
                </StyledLi>
              ))}
            </StyledList>
          </StyledPopoverContent>
        </Portal>
      </PopoverRoot>
    </>
  );
};

export default SlateBlockPicker;
