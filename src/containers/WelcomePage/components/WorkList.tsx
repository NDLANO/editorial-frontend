/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
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

  const tableContentList: (string | EmotionJSX.Element)[][] = data.results.map(res => [
    <NoShadowLink to={toEditArticle(res.id, res.learningResourceType)}>
      {res.title?.title}
    </NoShadowLink>,
    res.revisions?.[0]?.status,
    res.learningResourceType,
    'Primærfag',
    res.contexts?.[0]?.subject,
    formatDate(res.lastUpdated),
    res.revisions?.[0]?.note,
  ]);
  console.log(data);

  return (
    <TableComponent
      isLoading={!data || isLoading}
      tableTitleList={tableTitles}
      tableContentList={tableContentList}
    />
  );
};

export default WorkList;
