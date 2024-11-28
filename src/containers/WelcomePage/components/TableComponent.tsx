/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEmpty from "lodash/isEmpty";
import { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore } from "@ndla/icons/action";
import { Spinner, Table, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const TableWrapper = styled("div", {
  base: {
    width: "100%",
    overflowX: "auto",
  },
});

const StyledTable = styled(Table, {
  base: {
    width: "100%",
    tableLayout: "fixed",
    minWidth: "var(--table-min-width)",
    display: "inline-table",

    "& td": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
});

const TableTitleComponent = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "xxsmall",
  },
});
const StyledTableHeader = styled("th", {
  base: { width: "var(--header-width)" },
});

const ContentWrapper = styled("div", {
  base: {
    height: "small",
    display: "flex",
    cursor: "pointer",
  },
});

const LoadingNoContentWrapper = styled("div", {
  base: {
    padding: "small",
    display: "flex",
    justifyContent: "center",
  },
});

export interface FieldElement {
  id: string;
  data: ReactNode;
}

export type Prefix<P extends string, S extends string> = `${P}${S}` | S;

export interface TitleElement<T extends string> {
  title: ReactNode;
  sortableField?: T;
  width?: string;
}

interface Props<T extends string> {
  tableTitleList: TitleElement<T>[];
  tableData: FieldElement[][];
  isPending: boolean;
  setSortOption?: (o: Prefix<"-", T>) => void;
  noResultsText?: string;
  sortOption?: string;
  error?: string;
  minWidth?: string;
}

const TableComponent = <T extends string>({
  tableTitleList,
  tableData = [[]],
  isPending,
  setSortOption,
  noResultsText,
  sortOption,
  error,
  minWidth,
}: Props<T>) => {
  const { t } = useTranslation();
  if (error) return <Text color="text.error">{error}</Text>;

  return (
    <TableWrapper>
      <StyledTable style={{ "--table-min-width": minWidth } as CSSProperties}>
        <thead>
          <tr>
            {tableTitleList.map((tableTitle, index) => (
              <StyledTableHeader
                key={`${index}_${tableTitle.title}`}
                style={{ "--header-width": tableTitle.width } as CSSProperties}
              >
                <TableTitleComponent>
                  {tableTitle.title}
                  {!!setSortOption && !!tableTitle.sortableField && (
                    <div>
                      <ContentWrapper>
                        <ExpandLess
                          aria-label={t("welcomePage.workList.sortAsc")}
                          role="button"
                          onClick={() => setSortOption(tableTitle.sortableField!)}
                          data-hidden={!tableTitle.sortableField || sortOption === tableTitle.sortableField}
                          title={t("welcomePage.workList.sortAsc")}
                          size="small"
                        />
                      </ContentWrapper>
                      <ContentWrapper>
                        <ExpandMore
                          aria-label={t("welcomePage.workList.sortDesc")}
                          role="button"
                          onClick={() => setSortOption(`-${tableTitle.sortableField!}`!)}
                          data-hidden={!tableTitle.sortableField || sortOption === `-${tableTitle.sortableField}`}
                          title={t("welcomePage.workList.sortDesc")}
                          size="small"
                        />
                      </ContentWrapper>
                    </div>
                  )}
                </TableTitleComponent>
              </StyledTableHeader>
            ))}
          </tr>
        </thead>
        {!isPending ? (
          <tbody>
            {tableData.map((contentRow, index) => (
              <tr key={`tablerow_${contentRow?.[0]?.id}_${index}`}>
                {contentRow.map((field) => (
                  <td key={field.id} title={typeof field.data === "string" ? field.data : ""}>
                    {field.data}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : null}
      </StyledTable>
      {isPending ? (
        <LoadingNoContentWrapper>
          <Spinner />
        </LoadingNoContentWrapper>
      ) : noResultsText && isEmpty(tableData.flat()) ? (
        <LoadingNoContentWrapper>
          <Text>{noResultsText}</Text>
        </LoadingNoContentWrapper>
      ) : null}
    </TableWrapper>
  );
};

export default TableComponent;
