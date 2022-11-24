/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Calendar } from '@ndla/icons/editor';
import { useState } from 'react';
import { useSearch } from '../../../modules/search/searchQueries';
import { useSession } from '../../Session/SessionProvider';
import { toEditArticle } from '../../../util/routeHelpers';
import { NoShadowLink } from './NoShadowLink';
import TableComponent, { TitleElement } from './TableComponent';
import TableTitle from './TableTitle';
import WorkListDropdownWrapper from './WorkListDropdownWrapper';

const StyledWorkList = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  padding: ${spacing.nsmall};
`;

const StyledTopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const tableTitles: TitleElement[] = [
  { title: 'Navn', sortableField: 'title' },
  { title: 'Status' },
  { title: 'Innholdstype' },
  { title: 'Primærfag' },
  { title: 'Emnetilhørighet' },
  { title: 'Dato status ble endret', sortableField: 'responsibleLastUpdated' },
];

export interface FilterElement {
  id: string;
  name: string;
}

const WorkList = () => {
  const [sortOption, setSortOption] = useState<string>();

  const [filterSubject, setFilterSubject] = useState<FilterElement | undefined>();

  const { ndlaId } = useSession();
  const { t } = useTranslation();
  // Data search
  const { data, isLoading } = useSearch(
    {
      'responsible-ids': ndlaId,
      sort: sortOption ? sortOption : '-responsibleLastUpdated',
      ...(filterSubject ? { subjects: filterSubject.id } : {}),
    },
    {
      enabled: !!ndlaId,
    },
  );

  const tableContentList: (string | EmotionJSX.Element)[][] = data
    ? data.results.map(res => [
        <NoShadowLink to={toEditArticle(res.id, res.learningResourceType)}>
          {res.title?.title}
        </NoShadowLink>,
        res.status?.current ? t(`form.status.${res.status.current.toLowerCase()}`) : '',
        res.contexts?.[0]?.resourceTypes?.map(context => context.name).join(' - '),
        'n/a',
        res.contexts?.[0]?.breadcrumbs.join(' - '),
        'n/a',
      ])
    : [[]];
  console.log(data);
  return (
    <StyledWorkList>
      <StyledTopRow>
        <TableTitle
          title={t('welcomePage.worklist')}
          description={t('welcomePage.worklistDescription')}
          Icon={Calendar}
        />
        <WorkListDropdownWrapper
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
        />
      </StyledTopRow>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableContentList={tableContentList}
        setSortOption={setSortOption}
      />
    </StyledWorkList>
  );
};

export default WorkList;
