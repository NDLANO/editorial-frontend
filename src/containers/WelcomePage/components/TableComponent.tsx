/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { ReactNode } from 'react';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import { css } from '@emotion/react';
import isEmpty from 'lodash/isEmpty';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../components/Spinner';

const TableWrapper = styled.div`
  height: 250px;
`;

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: separate;
  width: 100%;
  border-spacing: 0;
  font-family: ${fonts.sans};
  margin-bottom: 0px;
  table-layout: fixed;
  display: inline-table;
  overflow: hidden;
  th {
    font-weight: ${fonts.weight.bold};
    padding: 0px ${spacing.xsmall};
    border-bottom: 1px solid ${colors.text.primary};
    background-color: ${colors.brand.lighter};
  }
  th:not(:first-of-type) {
    border-left: 1px solid ${colors.text.primary};
  }
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
}

interface Props<T extends string> {
  tableTitleList: TitleElement<T>[];
  tableData: FieldElement[][];
  isLoading: boolean;
  setSortOption: (o: Prefix<'-', T>) => void;
  noResultsText?: string;
  sortOption?: string;
  error?: string;
}

const TableComponent = <T extends string>({
  tableTitleList,
  tableData = [[]],
  isLoading,
  setSortOption,
  noResultsText,
  sortOption,
  error,
}: Props<T>) => {
  const { t } = useTranslation();
  if (error) return <StyledError>{error}</StyledError>;

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {tableTitleList.map((tableTitle, index) => (
              <th key={`${index}_${tableTitle.title}`}>
                <TableTitleComponent>
                  <div>{tableTitle.title}</div>

                  <SortArrowWrapper>
                    <Tooltip tooltip={t('welcomePage.workList.sortAsc')}>
                      <ContentWrapper>
                        <ExpandLess
                          role="button"
                          onClick={() => setSortOption(tableTitle.sortableField!)}
                          css={orderButtonStyle(
                            !tableTitle.sortableField || sortOption === tableTitle.sortableField,
                          )}
                        />
                      </ContentWrapper>
                    </Tooltip>
                    <Tooltip tooltip={t('welcomePage.workList.sortDesc')}>
                      <ContentWrapper>
                        <ExpandMore
                          role="button"
                          onClick={() => setSortOption(`-${tableTitle.sortableField!}`!)}
                          css={orderButtonStyle(
                            !tableTitle.sortableField ||
                              sortOption === `-${tableTitle.sortableField}`,
                          )}
                        />
                      </ContentWrapper>
                    </Tooltip>
                  </SortArrowWrapper>
                </TableTitleComponent>
              </th>
            ))}
          </tr>
        </thead>
        {!isLoading ? (
          <tbody>
            {tableData.map((contentRow, index) => (
              <tr key={`tablerow_${contentRow?.[0]?.id}_${index}`}>
                {contentRow.map((field) => (
                  <td key={field.id}>{field.data}</td>
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
