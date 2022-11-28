/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentLoader } from '@ndla/ui';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { useEffect, useRef, ReactNode } from 'react';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import { css } from '@emotion/react';
import Spinner from '../../../components/Spinner';

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: separate;
  width: 100%;
  border-spacing: 0;
  font-family: ${fonts.sans};
  margin-bottom: 0px;
  table-layout: fixed;
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
  }
  tr {
    height: 30px;
  }
  tr:nth-of-type(even) {
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
  max-height: 340px;
  overflow-y: auto;
`;

const orderButtonStyle = (isHidden: boolean) => css`
  cursor: pointer;
  color: ${colors.text.primary};
  visibility: ${isHidden ? 'hidden' : 'visible'};
`;

export interface FieldElement {
  id: string;
  data: string | ReactNode;
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
  sortOption?: string;
}

const TableComponent = ({
  tableTitleList,
  tableData = [[]],
  isLoading,
  setSortOption,
  sortOption,
}: Props) => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (isLoading && !isMounted.current) {
    return (
      <ContentLoader width={800} height={100}>
        <rect x="0" y="4" rx="3" ry="3" width="500" height="23" key={`rect-1`} />
        <rect x="0" y="31" rx="3" ry="3" width="600" height="23" key={`rect-2`} />
        <rect x="0" y="58" rx="3" ry="3" width="700" height="23" key={`rect-3`} />
      </ContentLoader>
    );
  }

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
                    {tableTitle.sortableField ? (
                      <SortArrowWrapper>
                        <ExpandLess
                          role="button"
                          onClick={() => setSortOption(`${tableTitle.sortableField}`)}
                          css={orderButtonStyle(sortOption === tableTitle.sortableField)}
                        />
                        <ExpandMore
                          role="button"
                          onClick={() => setSortOption(`-${tableTitle.sortableField}`)}
                          css={orderButtonStyle(sortOption === `-${tableTitle.sortableField}`)}
                        />
                      </SortArrowWrapper>
                    ) : null}
                  </TableTitleComponent>
                </th>
              ))}
            </tr>
          </thead>
          {!isLoading ? (
            <tbody>
              {tableData.map((contentRow, index) => (
                <tr key={`tablerow_${contentRow[0].id}_index`}>
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
        <div css={{ padding: `${spacing.small}` }}>
          <Spinner appearance="small" />
        </div>
      ) : null}
    </>
  );
};

export default TableComponent;
