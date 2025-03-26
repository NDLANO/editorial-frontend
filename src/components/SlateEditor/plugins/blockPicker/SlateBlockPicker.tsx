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
import { ReactEditor, useSlate, useSlateSelection } from "slate-react";
import { PopoverOpenChangeDetails, Portal } from "@ark-ui/react";
import { AddLine } from "@ndla/icons";
import { PopoverRoot, PopoverTrigger, IconButton, Button, Heading, PopoverContent } from "@ndla/primitives";
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
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from "../concept/block/types";
import { defaultConceptBlock } from "../concept/block/utils";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../contactBlock/types";
import { defaultContactBlock } from "../contactBlock/utils";
import { DETAILS_ELEMENT_TYPE } from "../details/detailsTypes";
import { defaultDetailsBlock } from "../details/utils";
import { TYPE_EMBED_ERROR } from "../embed/types";
import { TYPE_EXTERNAL } from "../external/types";
import { defaultExternalBlock } from "../external/utils";
import { TYPE_FILE } from "../file/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
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
import { IS_MAC } from "../toolbar/ToolbarToggle";
import { TYPE_DISCLAIMER } from "../uuDisclaimer/types";
import { defaultDisclaimerBlock } from "../uuDisclaimer/utils";
import { TYPE_EMBED_BRIGHTCOVE } from "../video/types";

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
  if (isTableCell(parent)) {
    return 100;
  }
  if (Element.isElement(parent) && parent.type === TYPE_GRID) {
    return -100;
  }

  return 78;
};

const popoverIds = {
  trigger: BLOCK_PICKER_TRIGGER_ID,
} as const;

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
      case TYPE_TABLE: {
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
      case CODE_BLOCK_ELEMENT_TYPE: {
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
        onInsertBlock(defaultGridBlock(), true);
        break;
      }
      case TYPE_KEY_FIGURE: {
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
      case TYPE_LINK_BLOCK_LIST: {
        onInsertBlock(defaultLinkBlockList());
        break;
      }
      case TYPE_GLOSS_BLOCK: {
        onInsertBlock(defaultConceptBlock("gloss"));
        break;
      }
      case TYPE_DISCLAIMER: {
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
                    {action.helpIcon}
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
