/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEmpty from 'lodash/isEmpty';
import { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import Spinner from '../../../components/Spinner';

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: separate;
  width: 100%;
  min-width: var(--table-min-width);
  border-spacing: 0;
  font-family: ${fonts.sans};
  margin-bottom: 0px;
  display: inline-table;
  table-layout: fixed;

  td {
    ${fonts.sizes(16, 1.1)};
    padding: ${spacing.xsmall};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  tr:nth-of-type(even) {
    background: ${colors.brand.lightest};
  }
  thead tr th {
    position: sticky;
    top: 0;
  }
`;

const StyledTableHeader = styled.th`
  font-weight: ${fonts.weight.bold};
  padding: 0px ${spacing.xsmall};
  border-bottom: 1px solid ${colors.text.primary};
  background-color: ${colors.brand.lighter};
  width: var(--header-width);

  :not(:first-of-type) {
    border-left: 1px solid ${colors.text.primary};
  }
`;

const SortArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: auto;
`;

const TableTitleComponent = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledError = styled.p`
  color: ${colors.support.red};
`;

const SpinnerWrapper = styled.div`
  padding: ${spacing.small};
`;

const NoResultsText = styled.div`
  display: flex;
  justify-content: center;
  ${fonts.sizes('16px', '20px')};
  color: ${colors.text.light};
  margin-bottom: ${spacing.nsmall};
`;

const ContentWrapper = styled.div`
  height: ${spacing.nsmall};
  display: flex;
`;

const orderButtonStyle = (isHidden: boolean) => css`
  cursor: pointer;
  color: ${colors.text.primary};
  visibility: ${isHidden ? 'hidden' : 'visible'};
`;

export interface FieldElement {
  id: string;
  data: ReactNode;
}

export type Prefix<P extends string, S extends string> = `${P}${S}` | S;

export interface TitleElement<T extends string> {
  title: string;
  sortableField?: T;
  width?: string;
}

interface Props<T extends string> {
  tableTitleList: TitleElement<T>[];
  tableData: FieldElement[][];
  isLoading: boolean;
  setSortOption?: (o: Prefix<'-', T>) => void;
  noResultsText?: string;
  sortOption?: string;
  error?: string;
  minWidth?: string;
}

const TableComponent = <T extends string>({
  tableTitleList,
  tableData = [[]],
  isLoading,
  setSortOption,
  noResultsText,
  sortOption,
  error,
  minWidth,
}: Props<T>) => {
  const { t } = useTranslation();
  if (error) return <StyledError>{error}</StyledError>;

  return (
    <TableWrapper>
      <StyledTable style={{ '--table-min-width': minWidth } as CSSProperties}>
        <thead>
          <tr>
            {tableTitleList.map((tableTitle, index) => (
              <StyledTableHeader
                key={`${index}_${tableTitle.title}`}
                style={{ '--header-width': tableTitle.width } as CSSProperties}
              >
                <TableTitleComponent>
                  {tableTitle.title}

                  {setSortOption && (
                    <SortArrowWrapper>
                      <Tooltip tooltip={t('welcomePage.workList.sortAsc')}>
                        <ContentWrapper>
                          <ExpandLess
                            role="button"
                            onClick={() => setSortOption(tableTitle.sortableField!)}
                            css={orderButtonStyle(!tableTitle.sortableField || sortOption === tableTitle.sortableField)}
                          />
                        </ContentWrapper>
                      </Tooltip>
                      <Tooltip tooltip={t('welcomePage.workList.sortDesc')}>
                        <ContentWrapper>
                          <ExpandMore
                            role="button"
                            onClick={() => setSortOption(`-${tableTitle.sortableField!}`!)}
                            css={orderButtonStyle(
                              !tableTitle.sortableField || sortOption === `-${tableTitle.sortableField}`,
                            )}
                          />
                        </ContentWrapper>
                      </Tooltip>
                    </SortArrowWrapper>
                  )}
                </TableTitleComponent>
              </StyledTableHeader>
            ))}
          </tr>
        </thead>
        {!isLoading ? (
          <tbody>
            {tableData.map((contentRow, index) => (
              <tr key={`tablerow_${contentRow?.[0]?.id}_${index}`}>
                {contentRow.map((field) => (
                  <td key={field.id} title={typeof field.data === 'string' ? field.data : ''}>
                    {field.data}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : null}
      </StyledTable>
      {isLoading ? (
        <SpinnerWrapper>
          <Spinner appearance="small" />
        </SpinnerWrapper>
      ) : noResultsText && isEmpty(tableData.flat()) ? (
        <NoResultsText>{noResultsText}</NoResultsText>
      ) : null}
    </TableWrapper>
  );
};

export default TableComponent;
