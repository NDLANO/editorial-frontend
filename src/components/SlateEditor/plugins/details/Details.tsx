/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import { ArrowDownShortLine } from "@ndla/icons";
import { ExpandableBox, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper } from "@ndla/ui";
import { isDetailsElement } from "./queries/detailsQueries";
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
      overflow: "unset",
      "& [data-embed-type='expandable-box-summary']": {
        _before: {
          content: "'▼'",
        },
      },
    },
  },
});

const Details = ({ children, element, attributes }: RenderElementProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const editor = useSlate();

  const toggleOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const onRemoveClick = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.select(editor, path);
    Transforms.collapse(editor);
    Transforms.removeNodes(editor, { at: path, match: isDetailsElement });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

  const onMoveContent = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.select(editor, path);
    Transforms.collapse(editor, { edge: "start" });
    Transforms.unwrapNodes(editor, { at: path, match: isDetailsElement, voids: true });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

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
          onMouseDown={(e) => e.preventDefault()}
          aria-label={toggleOpenTitle}
          title={toggleOpenTitle}
        >
          <ArrowDownShortLine />
        </StyledIconButton>
        <MoveContentButton
          onClick={onMoveContent}
          aria-label={t("form.moveContent")}
          onMouseDown={(e) => e.preventDefault()}
        />
        <DeleteButton
          data-testid="remove-details"
          aria-label={t("form.remove")}
          onClick={onRemoveClick}
          onMouseDown={(e) => e.preventDefault()}
        />
      </ButtonContainer>
      <StyledExpandableBox open={isOpen} asChild consumeCss>
        <div>{children}</div>
      </StyledExpandableBox>
    </EmbedWrapper>
  );
};

export default memo(Details);
