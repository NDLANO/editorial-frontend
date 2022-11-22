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
import formatDate from '../../../util/formatDate';

const tableTitles = [
  'Navn',
  'Status',
  'Innholdstype',
  'Primærfag',
  'Emnetilhørighet',
  'Dato status ble endret',
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

  console.log(data);
  return (
    <TableComponent isLoading={!data || isLoading} tableTitleList={tableTitles}>
      {data.results.map(res => {
        return (
          <tr key={res.id}>
            <td>
              <NoShadowLink to={toEditArticle(res.id, res.learningResourceType)}>
                {res.title?.title}
              </NoShadowLink>
            </td>
            <td>{res.revisions?.[0]?.status}</td>
            <td>{res.learningResourceType}</td>
            <td>Fag</td>
            <td>{res.contexts?.[0]?.subject}</td>
            <td>{formatDate(res.lastUpdated)}</td>
            <td>{res.revisions?.[0]?.note}</td>
          </tr>
        );
      })}
    </TableComponent>
  );
};

export default WorkList;
