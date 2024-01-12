/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '@ndla/tabs';
import ArticleStatusContent from './ArticleStatusContent';
import {
  FAVOURITES_SUBJECT_ID,
  LMA_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
} from '../../../constants';
import { SUBJECT_NODE } from '../../../modules/nodes/nodeApiTypes';
import { useNodes } from '../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  ndlaId: string;
  favoriteSubjects: string[] | undefined;
  userDataLoading: boolean;
}

const ArticleStatuses = ({ ndlaId, favoriteSubjects, userDataLoading }: Props) => {
  const { t, i18n } = useTranslation();

  const { taxonomyVersion } = useTaxonomyVersion();

  const { data: lmaSubjectsData, isLoading: lmaSubjectsLoading } = useNodes(
    {
      language: i18n.language,
      taxonomyVersion,
      nodeType: SUBJECT_NODE,
      key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
      value: ndlaId,
    },
    { enabled: !!ndlaId },
  );

  const subjectIds = useMemo(() => lmaSubjectsData?.map((s) => s.id), [lmaSubjectsData]);

  const tabs = useMemo(
    () => [
      ...(subjectIds?.length
        ? [
            {
              title: t('welcomePage.lmaSubjects'),
              id: 'lma-subjects',
              content: (
                <ArticleStatusContent
                  ndlaId={ndlaId}
                  subjectIds={subjectIds}
                  title={t('welcomePage.lmaSubjectsHeading')}
                  description={t('welcomePage.lmaSubjectsDescription')}
                  searchPageSubjectFilter={LMA_SUBJECT_ID}
                />
              ),
            },
          ]
        : []),
      ...(favoriteSubjects?.length
        ? [
            {
              title: t('welcomePage.favoriteSubjects'),
              id: 'favorite-subjects',
              content: (
                <ArticleStatusContent
                  ndlaId={ndlaId}
                  subjectIds={favoriteSubjects}
                  title={t('welcomePage.favoriteSubjectsHeading')}
                  description={t('welcomePage.favoriteSubjectsDescription')}
                  searchPageSubjectFilter={FAVOURITES_SUBJECT_ID}
                />
              ),
            },
          ]
        : []),
    ],
    [favoriteSubjects, ndlaId, subjectIds, t],
  );

  return (
    <>
      {!!tabs.length && !lmaSubjectsLoading && !userDataLoading && (
        <Tabs variant="rounded" tabs={tabs} />
      )}
    </>
  );
};

export default ArticleStatuses;
