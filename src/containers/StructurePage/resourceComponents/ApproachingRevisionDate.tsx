/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import addYears from 'date-fns/addYears';
import isBefore from 'date-fns/isBefore';
import { IArticle } from '@ndla/types-draft-api';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { Time } from '@ndla/icons/common';
import { fetchDrafts } from '../../../modules/draft/draftApi';
import handleError from '../../../util/handleError';
import { getExpirationDate } from '../../ArticlePage/articleTransformers';

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled.div`
  // TODO: Update when color is added to colors
  background-color: transparent;
  border: 1px solid #c77623;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c77623;
`;

const StyledTimeIcon = styled(Time)`
  width: 24px;
  height: 24px;
  color: #c77623;
`;

interface RevisionDateProps {
  text?: string | number;
  phrasesKey: string;
}

export const RevisionDateIcon = ({ text, phrasesKey }: RevisionDateProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip tooltip={t(phrasesKey)}>
      <Wrapper>{text || text === 0 ? <StyledIcon>{text}</StyledIcon> : <StyledTimeIcon />}</Wrapper>
    </Tooltip>
  );
};

interface Props {
  articleIds?: number[];
}

export const getCountApproachingRevision = (articles: IArticle[]) => {
  const expirationDates = articles
    .map(a => getExpirationDate({ revisions: a.revisions }))
    .filter(r => !!r);

  const currentDateAddYear = addYears(new Date(), 1);
  const countApproachingRevision = expirationDates.filter(a =>
    isBefore(new Date(a!), currentDateAddYear),
  ).length;
  return countApproachingRevision;
};

const ApproachingRevisionDate = ({ articleIds = [] }: Props) => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const drafts = await fetchDrafts(articleIds);
        const count = getCountApproachingRevision(drafts ?? []);

        setCount(count);
      } catch (e) {
        handleError(e);
      }
    })();
  }, [articleIds]);

  return <RevisionDateIcon text={count} phrasesKey={'form.responsible.revisionDate'} />;
};

export default ApproachingRevisionDate;
