/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import addYears from 'date-fns/addYears';
import isBefore from 'date-fns/isBefore';
import countBy from 'lodash/countBy';
import { IArticle } from '@ndla/types-draft-api';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import isArray from 'lodash/isArray';
import { fetchDrafts } from '../../../modules/draft/draftApi';
import handleError from '../../../util/handleError';

const StyledWrapper = styled.div`
  color: ${colors.white};
  // TODO: Should be added to colors
  background-color: #e29929;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface RevisionDateProps {
  text: string | number;
  phrasesKey: string;
}

export const RevisionDateIcon = ({ text, phrasesKey }: RevisionDateProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip tooltip={t(phrasesKey)}>
      <StyledWrapper>{text}</StyledWrapper>
    </Tooltip>
  );
};

interface Props {
  articleIds?: number[];
}

export const getCountApproachingRevision = (d: IArticle | IArticle[]) => {
  const currentDateAddYear = addYears(new Date(), 1);
  const elementsArray = isArray(d) ? d : [d];

  const countApproachingRevision =
    countBy(elementsArray, elementsArray =>
      isBefore(new Date(elementsArray.revisions[0].revisionDate), currentDateAddYear),
    ).true ?? 0;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleIds]);

  return <RevisionDateIcon text={count} phrasesKey={'form.responsible.revisionDate'} />;
};

export default ApproachingRevisionDate;
