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
import { DeleteForever } from "@ndla/icons/editor";
import { IconButton, Table } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper } from "@ndla/ui";
import { TableElement } from "./interfaces";
import { removeTable } from "./slateActions";

interface Props {
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  element: TableElement;
  children: ReactNode;
}

const StyledIconButton = styled(IconButton, {
  base: {
    position: "absolute",
    top: "0",
    left: "-xlarge",
  },
});

const SlateTable = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  return (
    <EmbedWrapper>
      <StyledIconButton
        variant="danger"
        size="small"
        onClick={() => removeTable(editor, element)}
        data-testid="table-remove"
        aria-label={t("form.content.table.table-remove")}
        title={t("form.content.table.table-remove")}
      >
        <DeleteForever />
      </StyledIconButton>
      <Table {...attributes}>{children}</Table>
    </EmbedWrapper>
  );
};

export default SlateTable;
