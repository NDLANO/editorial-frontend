/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Range } from "slate";
import { ReactEditor } from "slate-react";
import styled from "@emotion/styled";
import { colors, fonts, stackOrder } from "@ndla/core";
import { Minus, AddLine } from "@ndla/icons/action";
import { AlignCenter, AlignLeft, AlignRight } from "@ndla/icons/editor";
import { Button, IconButton } from "@ndla/primitives";
import EditColgroupsModal from "./EditColgroupsModal";
import { TableElement } from "./interfaces";
import { alignColumn } from "./slateActions";
import { isTable, isTableHead } from "./slateHelpers";
import { insertColumn, insertRow, insertTableHead, removeColumn, removeRow, toggleRowHeaders } from "./toolbarActions";
import { TYPE_TABLE_CAPTION } from "./types";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { useSession } from "../../../../containers/Session/SessionProvider";
import getCurrentBlock from "../../utils/getCurrentBlock";

const StyledTableActions = styled.div`
  background: ${colors.white};
  box-shadow: 1px 1px 8px 1px ${colors.brand.greyLighter};
  border-radius: 5px;
  position: absolute;
  bottom: -50px;
  padding: 10px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  column-gap: 10px;
  align-items: center;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledRightAlign = styled.div`
  margin-left: auto;
`;

const StyledWrapper = styled.div`
  display: ${(p: { show: boolean }) => (p.show ? "block;" : "none")};
  position: relative;
  z-index: ${stackOrder.offsetSingle};
  user-select: none;
`;

const StyledRowTitle = styled.strong`
  font-family: ${fonts.sans};
  margin-left: auto;
`;

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
    icon: <Minus />,
    name: "row-remove",
  },
];

const columnActions = [
  {
    icon: <AddLine />,
    name: "column-add",
  },
  {
    icon: <Minus />,
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

  const tablePath = ReactEditor.findPath(editor, element);
  const [table] = Editor.node(editor, tablePath);
  const captionEntry = getCurrentBlock(editor, TYPE_TABLE_CAPTION);

  if (!isTable(table) || captionEntry) {
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
  const hasTableHead = isTableHead(tableHead);
  const selectedPath = editor.selection?.anchor.path;

  const showAddHeader = selectedPath && !hasTableHead;
  const showEditColgroups = userPermissions?.includes(DRAFT_HTML_SCOPE);
  const show =
    Range.isRange(editor.selection) &&
    Range.includes(editor.selection, ReactEditor.findPath(editor, element)) &&
    ReactEditor.isFocused(editor);

  return (
    <StyledWrapper contentEditable={false} show={show}>
      <StyledTableActions>
        {!!showEditColgroups && <EditColgroupsModal element={element} />}
        <ActionGrid>
          {/* Row 1 - Row actions */}
          <StyledRowTitle>{`${t("form.content.table.row")}:`}</StyledRowTitle>
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
                title={t(`form.content.table.addHeader`)}
                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, "head-add")}
              >
                {t(`form.content.table.addHeader`)}
              </Button>
            )}
          </StyledRightAlign>
          {/* Row 2  - Column actions*/}
          <StyledRowTitle>{`${t("form.content.table.column")}:`}</StyledRowTitle>
          <ActionGroup>
            {columnActions.map((action, idx) => (
              <TableIconButton key={idx} operation={action.name} onClick={handleOnClick}>
                {action.icon}
              </TableIconButton>
            ))}
          </ActionGroup>
          <Button
            data-testid="toggle-row-headers"
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => handleOnClick(e, "toggle-row-headers")}
            aria-label={t(
              `form.content.table.${isTable(table) && table.rowHeaders ? "disable-header" : "enable-header"}`,
            )}
          >
            {t(`form.content.table.${isTable(table) && table.rowHeaders ? "disable-header" : "enable-header"}`)}
          </Button>
        </ActionGrid>
      </StyledTableActions>
    </StyledWrapper>
  );
};

export default TableActions;
