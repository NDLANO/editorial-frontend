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
import Spinner from '../../../components/Spinner';

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: separate;
  width: 100%;
  border-spacing: 0;
  font-family: ${fonts.sans};
  margin-bottom: 0px;
  table-layout: fixed;
  min-width: 850px;
  display: inline-table;
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
    padding: ${spacing.xsmall} ${spacing.xsmall};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  tr {
    height: 30px;
  }
  tr:nth-of-type(odd) {
    background: rgba(248, 248, 248, 0.5);
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

const ScrollableTableWrapper = styled.div`
  max-height: 250px;
  overflow-y: auto;
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

const orderButtonStyle = (isHidden: boolean) => css`
  cursor: pointer;
  color: ${colors.text.primary};
  visibility: ${isHidden ? 'hidden' : 'visible'};
`;

export interface FieldElement {
  id: string;
  data: ReactNode;
}

export interface TitleElement {
  title: string;
  sortableField?: string;
}

interface Props {
  tableTitleList: TitleElement[];
  tableData: FieldElement[][];
  isLoading: boolean;
  setSortOption: (o: string) => void;
  noResultsText?: string;
  sortOption?: string;
  error?: string;
}

const TableComponent = ({
  tableTitleList,
  tableData = [[]],
  isLoading,
  setSortOption,
  noResultsText,
  sortOption,
  error,
}: Props) => {
  if (error) return <StyledError>{error}</StyledError>;

  return (
    <>
      <ScrollableTableWrapper>
        <StyledTable>
          <thead>
            <tr>
              {tableTitleList.map((tableTitle, index) => (
                <th key={`${index}_${tableTitle.title}`}>
                  <TableTitleComponent>
                    <div>{tableTitle.title}</div>

                    <SortArrowWrapper>
                      <ExpandLess
                        role="button"
                        onClick={() => setSortOption(`${tableTitle.sortableField}`)}
                        css={orderButtonStyle(
                          !tableTitle.sortableField || sortOption === tableTitle.sortableField,
                        )}
                      />
                      <ExpandMore
                        role="button"
                        onClick={() => setSortOption(`-${tableTitle.sortableField}`)}
                        css={orderButtonStyle(
                          !tableTitle.sortableField ||
                            sortOption === `-${tableTitle.sortableField}`,
                        )}
                      />
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
                  {contentRow.map(field => (
                    <td key={field.id}>{field.data}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : null}
        </StyledTable>
      </ScrollableTableWrapper>
      {isLoading ? (
        <SpinnerWrapper>
          <Spinner appearance="small" />
        </SpinnerWrapper>
      ) : noResultsText && isEmpty(tableData.flat()) ? (
        <NoResultsText>{noResultsText}</NoResultsText>
      ) : null}
    </>
  );
};

export default TableComponent;
