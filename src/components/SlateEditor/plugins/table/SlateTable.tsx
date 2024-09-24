/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { Table } from "@ndla/primitives";
import { TableElement } from "./interfaces";
import { removeTable } from "./slateActions";
import DeleteButton from "../../../DeleteButton";

interface Props {
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  element: TableElement;
  children: ReactNode;
}

const SlateTable = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  return (
    <Table {...attributes}>
      <DeleteButton
        onClick={() => removeTable(editor, element)}
        data-testid="table-remove"
        aria-label={t("form.content.table.table-remove")}
        tabIndex={-1}
      />
      {children}
    </Table>
  );
};

export default SlateTable;
