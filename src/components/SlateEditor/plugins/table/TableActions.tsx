/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Range } from "slate";
import { ReactEditor, useSlateSelection } from "slate-react";
import { SubtractLine, AddLine, AlignCenter, AlignLeft, AlignRight } from "@ndla/icons";
import { Button, IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import EditColgroupsDialog from "./EditColgroupsDialog";
import { TableElement } from "./interfaces";
import { isTableElement, isTableHeadElement } from "./queries";
import { alignColumn } from "./slateActions";
import { insertColumn, insertRow, insertTableHead, removeColumn, removeRow, toggleRowHeaders } from "./toolbarActions";
import { TABLE_CAPTION_ELEMENT_TYPE } from "./types";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { useSession } from "../../../../containers/Session/SessionProvider";
import getCurrentBlock from "../../utils/getCurrentBlock";

const StyledTableActions = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "3xsmall",
    background: "background.default",
    boxShadow: "large",
    borderRadius: "xsmall",
    position: "absolute",
    bottom: "-large",
    padding: "xsmall",
  },
});

const ActionGrid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(3, auto)",
    columnGap: "xsmall",
    rowGap: "3xsmall",
    alignItems: "center",
  },
});

const ActionGroup = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "5xsmall",
  },
});

const StyledRightAlign = styled("div", {
  base: {
    marginInlineStart: "auto",
  },
});

const StyledWrapper = styled("div", {
  base: {
    position: "relative",
    zIndex: "docked",
    userSelect: "none",
  },
});

const StyledText = styled(Text, {
  base: {
    marginInlineStart: "auto",
  },
});

interface TableIconButtonProps {
  operation: string;
  onClick: (e: MouseEvent<HTMLButtonElement>, operation: string) => void;
  children: ReactNode;
}

const rowActions = [
  {
    icon: <AddLine />,
    name: "row-add",
  },
  {
    icon: <SubtractLine />,
    name: "row-remove",
  },
];

const columnActions = [
  {
    icon: <AddLine />,
    name: "column-add",
  },
  {
    icon: <SubtractLine />,
    name: "column-remove",
  },
  {
    icon: <AlignLeft />,
    name: "column-left",
  },
  {
    icon: <AlignCenter />,
    name: "column-center",
  },
  {
    icon: <AlignRight />,
    name: "column-right",
  },
];

const TableIconButton = ({ operation, onClick, children }: TableIconButtonProps) => {
  const { t } = useTranslation();
  return (
    <IconButton
      variant="tertiary"
      size="small"
      type="button"
      data-testid={operation}
      aria-label={t(`form.content.table.${operation}`)}
      title={t(`form.content.table.${operation}`)}
      onMouseDown={(e: MouseEvent<HTMLButtonElement>) => onClick(e, operation)}
    >
      {children}
    </IconButton>
  );
};

interface Props {
  editor: Editor;
  element: TableElement;
}

const TableActions = ({ editor, element }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const tablePath = useMemo(() => ReactEditor.findPath(editor, element), [editor, element]);
  const selection = useSlateSelection();

  const [table] = Editor.node(editor, tablePath);
  const captionEntry = getCurrentBlock(editor, TABLE_CAPTION_ELEMENT_TYPE);
  const show = Range.isRange(selection) && Range.includes(selection, tablePath) && ReactEditor.isFocused(editor);

  if (!isTableElement(table) || captionEntry) {
    return null;
  }

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>, operation: string) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedPath = editor.selection?.anchor.path;

    if (selectedPath && Path.isDescendant(selectedPath, tablePath)) {
      switch (operation) {
        case "row-remove": {
          removeRow(editor, selectedPath);
          break;
        }
        case "row-add":
          insertRow(editor, element, selectedPath);
          break;
        case "head-add":
          insertTableHead(editor);
          break;
        case "column-remove":
          removeColumn(editor, element, selectedPath);
          break;
        case "column-add":
          insertColumn(editor, element, selectedPath);
          break;
        case "column-left":
          alignColumn(editor, tablePath, "left");
          break;
        case "column-center":
          alignColumn(editor, tablePath, "center");
          break;
        case "column-right":
          alignColumn(editor, tablePath, "right");
          break;
        case "toggle-row-headers":
          toggleRowHeaders(editor, tablePath);
          break;
        default:
      }
    }
  };

  const tableHead = table.children[1];
  const hasTableHead = isTableHeadElement(tableHead);
  const selectedPath = editor.selection?.anchor.path;

  const showAddHeader = selectedPath && !hasTableHead;
  const showEditColgroups = userPermissions?.includes(DRAFT_HTML_SCOPE);

  return (
    <StyledWrapper contentEditable={false} hidden={!show}>
      <StyledTableActions>
        {!!showEditColgroups && <EditColgroupsDialog element={element} />}
        <ActionGrid>
          {/* Row 1 - Row actions */}
          <StyledText textStyle="label.medium" fontWeight="bold">{`${t("form.content.table.row")}:`}</StyledText>
          <ActionGroup>
            {rowActions.map((action, idx) => (
              <TableIconButton key={idx} operation={action.name} onClick={handleOnClick}>
                {action.icon}
              </TableIconButton>
            ))}
          </ActionGroup>
          <StyledRightAlign>
            {!!showAddHeader && (
              <Button
                data-testid="head-add"
                size="small"
                title={t(`form.content.table.addHeader`)}
                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, "head-add")}
              >
                {t(`form.content.table.addHeader`)}
              </Button>
            )}
          </StyledRightAlign>
          {/* Row 2  - Column actions*/}
          <StyledText textStyle="label.medium" fontWeight="bold">{`${t("form.content.table.column")}:`}</StyledText>
          <ActionGroup>
            {columnActions.map((action, idx) => (
              <TableIconButton key={idx} operation={action.name} onClick={handleOnClick}>
                {action.icon}
              </TableIconButton>
            ))}
          </ActionGroup>
          <Button
            size="small"
            data-testid="toggle-row-headers"
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, "toggle-row-headers")}
          >
            {t(`form.content.table.${isTableElement(table) && table.rowHeaders ? "disable-header" : "enable-header"}`)}
          </Button>
        </ActionGrid>
      </StyledTableActions>
    </StyledWrapper>
  );
};

export default TableActions;
