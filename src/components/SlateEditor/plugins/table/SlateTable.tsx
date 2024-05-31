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
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { TableStyling } from "@ndla/ui";
import { TableElement } from "./interfaces";
import { removeTable } from "./slateActions";
import DeleteButton from "../../../DeleteButton";

interface Props {
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  element: TableElement;
  children: ReactNode;
}

const StyledTable = styled.table`
  && {
    display: block;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    padding: 0 24px;
    margin-top: 64px;
    margin-bottom: 64px;
  }
  &:before {
    display: none;
  }
  &:after {
    display: none;
  }

  td,
  th {
    min-height: 29px;

    p {
      margin-top: 0;
      &:last-child {
        margin: 0;
      }
    }
  }
  figure {
    float: unset;
  }

  tbody th:first-child {
    border: 1px solid ${colors.brand.lighter} !important;
    border-right: 3px solid ${colors.brand.tertiary} !important;
  }

  td ol,
  td ol li p,
  td ul,
  td ul li p {
    font-size: unset;
    line-height: unset !important;
  }
  ${TableStyling}
`;

const StyledWrapper = styled.div`
  display: flex;
  padding: 0;
  margin: 0;
  max-width: 100% !important;
  right: unset !important;
  left: unset !important;
`;

const SlateTable = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <StyledTable {...attributes}>
        <DeleteButton
          variant="stripped"
          onClick={() => removeTable(editor, element)}
          data-testid="table-remove"
          aria-label={t("form.content.table.table-remove")}
          tabIndex={-1}
        />
        {children}
      </StyledTable>
    </StyledWrapper>
  );
};

export default SlateTable;
