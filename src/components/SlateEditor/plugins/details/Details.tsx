/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms, Element } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { ExpandableBox, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper } from "@ndla/ui";
import { TYPE_DETAILS } from "./types";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const ButtonContainer = styled("div", {
  base: {
    position: "absolute",
    right: "0",
    top: "-xlarge",
    display: "flex",
    gap: "3xsmall",
    justifyContent: "flex-end",
  },
});

interface Props {
  editor: Editor;
}

const StyledIconButton = styled(IconButton, {
  base: {
    _open: {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  },
});

const StyledExpandableBox = styled(ExpandableBox, {
  base: {
    "& [data-embed-type='expandable-box-summary']": {
      cursor: "text",
      position: "relative",
      _before: {
        position: "absolute",
        content: "'▶'",
        fontSize: "0.7em",
        display: "block",
      },
      "& >:first-child": {
        marginInlineStart: "small",
      },
    },
    "&:not([open]) >:not([data-embed-type='expandable-box-summary'])": {
      display: "none",
    },
    _open: {
      "& [data-embed-type='expandable-box-summary']": {
        _before: {
          content: "'▼'",
        },
      },
    },
  },
});

const Details = ({ children, editor, element, attributes }: Props & RenderElementProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const toggleOpen = () => {
    setIsOpen((open) => !open);
  };

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DETAILS,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DETAILS,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  const openAttribute = isOpen ? { "data-open": "" } : {};
  const toggleOpenTitle = isOpen ? t("form.close") : t("form.open");

  return (
    <EmbedWrapper {...attributes} draggable>
      <ButtonContainer contentEditable={false}>
        <StyledIconButton
          {...openAttribute}
          size="small"
          variant="secondary"
          onClick={toggleOpen}
          aria-label={toggleOpenTitle}
          title={toggleOpenTitle}
        >
          <ArrowDownShortLine />
        </StyledIconButton>
        <MoveContentButton onMouseDown={onMoveContent} aria-label={t("form.moveContent")} />
        <DeleteButton data-testid="remove-details" aria-label={t("form.remove")} onMouseDown={onRemoveClick} />
      </ButtonContainer>
      <StyledExpandableBox open={isOpen} asChild consumeCss>
        <div>{children}</div>
      </StyledExpandableBox>
    </EmbedWrapper>
  );
};

export default Details;
