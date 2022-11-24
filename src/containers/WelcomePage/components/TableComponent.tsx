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
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { SVGProps } from 'react';

const ArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="#757575" />
  </svg>
);

const ArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M5.00012 8L0.669997 0.5L9.33025 0.500001L5.00012 8Z" fill="#757575" />
  </svg>
);

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  font-family: ${fonts.sans};
  margin-bottom: 0px;
  th {
    border-bottom: 1px solid ${colors.text.primary};
    font-weight: ${fonts.weight.bold};
  }
  th:not(:first-of-type) {
    border-left: 1px solid ${colors.text.primary};
  }
  td {
    ${fonts.sizes(16, 1.1)};
  }
  th,
  td {
    padding: 0px ${spacing.xsmall};
  }
  tr {
    height: 30px;
  }
  tr:nth-of-type(even) {
    background: rgba(248, 248, 248, 0.5);
  }
`;

const SortArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  justify-content: center;
  margin-left: auto;
`;

const TableTitleComponent = styled.div`
  display: flex;
  flex-direction: row;
`;

export interface TitleElement {
  title: string;
  sortableField?: string;
}

interface Props {
  tableTitleList: TitleElement[];
  tableContentList: (string | EmotionJSX.Element)[][];
  isLoading: boolean;
  setSortOption: (o: string) => void;
}

const TableComponent = ({
  tableTitleList,
  tableContentList = [[]],
  isLoading,
  setSortOption,
}: Props) => {
  if (isLoading) {
    return (
      <ContentLoader width={800} height={150}>
        <rect x="0" y="4" rx="3" ry="3" width="500" height="23" key={`rect-1`} />
        <rect x="0" y="31" rx="3" ry="3" width="600" height="23" key={`rect-2`} />
        <rect x="0" y="58" rx="3" ry="3" width="700" height="23" key={`rect-3`} />
      </ContentLoader>
    );
  }

  return (
    <StyledTable>
      <thead>
        <tr>
          {tableTitleList.map((tableTitle, index) => (
            <th key={`${index}_${tableTitle.title}`}>
              <TableTitleComponent>
                <div>{tableTitle.title}</div>
                {tableTitle.sortableField ? (
                  <SortArrowWrapper>
                    <ArrowUp
                      role="button"
                      onClick={() => setSortOption(`${tableTitle.sortableField}`)}
                    />
                    <ArrowDown
                      role="button"
                      onClick={() => setSortOption(`-${tableTitle.sortableField}`)}
                    />
                  </SortArrowWrapper>
                ) : null}
              </TableTitleComponent>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableContentList.map(contentRow => (
          <tr>
            {contentRow.map(field => (
              <td>{field}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TableComponent;
