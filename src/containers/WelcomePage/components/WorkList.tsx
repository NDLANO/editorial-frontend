/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ContentLoader } from '@ndla/ui';
import styled from '@emotion/styled';
import { useSearch } from '../../../modules/search/searchQueries';
import { useSession } from '../../Session/SessionProvider';
import { toEditArticle } from '../../../util/routeHelpers';
import { NoShadowLink } from './NoShadowLink';

const StyledLi = styled.li`
  list-style: none;
  margin: 0;
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

  return (
    <ul>
      {data.results.map(res => {
        return (
          <StyledLi>
            <NoShadowLink to={toEditArticle(res.id, res.learningResourceType)}>
              {res.title?.title}
            </NoShadowLink>
          </StyledLi>
        );
      })}
    </ul>
  );
};

export default WorkList;
