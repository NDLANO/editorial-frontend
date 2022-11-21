/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { ContentLoader } from '@ndla/ui';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';

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
  th:not(:first-child) {
    border-left: 1px solid ${colors.text.primary};
  }
  td {
    ${fonts.sizes('16px', '24px')};
  }
  th,
  td {
    padding: 0px ${spacing.xsmall};
  }
  tr {
    height: 30px;
  }
  tr:nth-child(even) {
    background: rgba(248, 248, 248, 0.5);
  }
`;

interface Props {
  tableTitleList: string[];
  children: ReactNode;
  isLoading: boolean;
}

const TableComponent = ({ tableTitleList, children, isLoading }: Props) => {
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
          {tableTitleList.map(title => (
            <th scope="col">{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </StyledTable>
  );
};

export default TableComponent;
