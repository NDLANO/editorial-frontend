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
import { fetchDrafts } from '../../../modules/draft/draftApi';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
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

interface Props {
  articleIds?: number[];
}

const getCountApproachingRevision = (draftsArray: IArticle[]) => {
  const currentDateAddYear = addYears(new Date(), 1);
  const countApproachingRevision =
    countBy(draftsArray, d => isBefore(new Date(d.revisions[0].revisionDate), currentDateAddYear))
      .true ?? 0;
  return countApproachingRevision;
};

const ApproachingRevisionDate = ({ articleIds = [] }: Props) => {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

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

  return (
    <Tooltip tooltip={t('form.responsible.revisionDate')}>
      <StyledWrapper>{count}</StyledWrapper>
    </Tooltip>
  );
};

export default ApproachingRevisionDate;
