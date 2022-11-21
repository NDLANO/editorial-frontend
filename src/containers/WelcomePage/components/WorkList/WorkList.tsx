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
import { useSearch } from '../../../../modules/search/searchQueries';
import { useSession } from '../../../Session/SessionProvider';
import { toEditArticle } from '../../../../util/routeHelpers';
import { NoShadowLink } from '../NoShadowLink';

const StyledTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  font-family: ${fonts.sans};
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

const WorkList = () => {
  const { ndlaId } = useSession();
  const { data, isLoading } = useSearch(
    { 'responsible-ids': ndlaId, sort: '-responsibleLastUpdated' },
    {
      enabled: !!ndlaId,
    },
  );

  if (!data || isLoading) {
    return (
      <ContentLoader width={800} height={150}>
        <rect x="0" y="4" rx="3" ry="3" width="500" height="23" key={`rect-1`} />
        <rect x="0" y="31" rx="3" ry="3" width="600" height="23" key={`rect-2`} />
        <rect x="0" y="58" rx="3" ry="3" width="700" height="23" key={`rect-3`} />
      </ContentLoader>
    );
  }
  console.log(data);
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Status</th>
          <th>Innholdstype</th>
          <th>Primærfag</th>
          <th>Emnetilhørighet</th>
          <th>Dato</th>
          <th>Kommentar</th>
        </tr>
      </thead>
      <tbody>
        {data.results.map(res => {
          return (
            <tr>
              <td>
                <NoShadowLink to={toEditArticle(res.id, res.learningResourceType)}>
                  {res.title?.title}
                </NoShadowLink>
              </td>
              <td>{res.status?.current}</td>
              <td>{res.learningResourceType}</td>
              <td>Fag</td>
              <td>test</td>
              <td>10.10.2022</td>
              <td>test</td>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default WorkList;
