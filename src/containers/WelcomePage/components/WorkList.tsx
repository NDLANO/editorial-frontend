/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useSearch } from '../../../modules/search/searchQueries';
import { useSession } from '../../Session/SessionProvider';
import { toEditArticle } from '../../../util/routeHelpers';
import { NoShadowLink } from './NoShadowLink';
import TableComponent from './TableComponent';

const tableTitles = [
  'Navn',
  'Status',
  'Innholdstype',
  'Primærfag',
  'Emnetilhørighet',
  'Dato',
  'Kommentar',
];

const WorkList = () => {
  const { ndlaId } = useSession();
  const { data, isLoading } = useSearch(
    { 'responsible-ids': ndlaId, sort: '-responsibleLastUpdated' },
    {
      enabled: !!ndlaId,
    },
  );

  if (!data || isLoading) {
    return <div />;
  }

  return (
    <TableComponent isLoading={!data || isLoading} tableTitleList={tableTitles}>
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
    </TableComponent>
  );
};

export default WorkList;
