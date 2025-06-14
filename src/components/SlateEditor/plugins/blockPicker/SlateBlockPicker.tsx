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
import { Editor, Element, Node, Location, Range, Path, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection } from "slate-react";
import { PopoverOpenChangeDetails, Portal } from "@ark-ui/react";
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
import getCurrentBlock from "../../utils/getCurrentBlock";
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
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { defaultPitchBlock } from "../pitch/utils";
import { defaultRelatedBlock } from "../related";
import { RELATED_ELEMENT_TYPE } from "../related/types";
import { defaultTableBlock } from "../table/defaultBlocks";
import { isAnyTableCellElement } from "../table/queries";
import { isInTableCellHeader } from "../table/slateHelpers";
import { TABLE_ELEMENT_TYPE } from "../table/types";
import { IS_MAC } from "../toolbar/ToolbarToggle";
import { DISCLAIMER_ELEMENT_TYPE } from "../uuDisclaimer/types";
import { defaultDisclaimerBlock } from "../uuDisclaimer/utils";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../video/types";

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
  const editor = useSlate();
  const selection = useSlateSelection();
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
    if (Location.isLocation(selection)) {
      setLastActiveSelection(selection);
    }
  }, [selection]);

  const onOpenChange = useCallback(
    (details: PopoverOpenChangeDetails) => {
      setBlockPickerOpen(details.open);
      if (!details.open && !visualElementPickerOpen) {
        ReactEditor.focus(editor);
      }
    },
    [editor, visualElementPickerOpen],
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
    [editor, selectedParagraphPath],
  );

  const onElementAdd = (data: ActionData) => {
    switch (data.type) {
      case FRAMED_CONTENT_ELEMENT_TYPE: {
        onInsertBlock(defaultFramedContentBlock(), true);
        break;
      }
      case DETAILS_ELEMENT_TYPE: {
        onInsertBlock(defaultDetailsBlock(), true);
        break;
      }
      case TABLE_ELEMENT_TYPE: {
        onInsertBlock(defaultTableBlock(2, 2), true);
        break;
      }
      case ASIDE_ELEMENT_TYPE: {
        onInsertBlock(defaultAsideBlock(), true);
        break;
      }
      case AUDIO_ELEMENT_TYPE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case H5P_ELEMENT_TYPE: {
        onInsertBlock(defaultH5pBlock());
        break;
      }
      case EXTERNAL_ELEMENT_TYPE: {
        onInsertBlock(defaultExternalBlock());
        break;
      }
      case BRIGHTCOVE_ELEMENT_TYPE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case IMAGE_ELEMENT_TYPE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case FILE_ELEMENT_TYPE: {
        setVisualElementPickerOpen(true);
        setType(data.object);
        break;
      }
      case RELATED_ELEMENT_TYPE: {
        onInsertBlock(defaultRelatedBlock());
        break;
      }
      case CODE_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultCodeblockBlock());
        break;
      }
      case PITCH_ELEMENT_TYPE: {
        onInsertBlock(defaultPitchBlock());
        break;
      }
      case CONCEPT_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultConceptBlock());
        break;
      }
      case GRID_ELEMENT_TYPE: {
        onInsertBlock(defaultGridBlock(), true);
        break;
      }
      case KEY_FIGURE_ELEMENT_TYPE: {
        onInsertBlock(defaultKeyFigureBlock());
        break;
      }
      case CONTACT_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultContactBlock());
        break;
      }
      case CAMPAIGN_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultCampaignBlock());
        break;
      }
      case LINK_BLOCK_LIST_ELEMENT_TYPE: {
        onInsertBlock(defaultLinkBlockList());
        break;
      }
      case GLOSS_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultConceptBlock("gloss"));
        break;
      }
      case DISCLAIMER_ELEMENT_TYPE: {
        onInsertBlock(defaultDisclaimerBlock());
        break;
      }
      case COMMENT_BLOCK_ELEMENT_TYPE: {
        onInsertBlock(defaultCommentBlock());
        break;
      }
      default:
        setBlockPickerOpen(false);
        break;
    }
  };

  const actionsForArea = useMemo(() => {
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
  }, [actions, actionsToShowInAreas, editor, lastActiveSelection]);

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
              {actionsForArea
                .filter((a) => !a.requiredScope || userPermissions?.includes(a.requiredScope))
                .map((action) => (
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
