/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';
import addYears from 'date-fns/addYears';
import isBefore from 'date-fns/isBefore';
import { IRevisionMeta } from '@ndla/types-draft-api';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { Time } from '@ndla/icons/common';
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
  revisions: (IRevisionMeta[] | undefined)[];
}

export const isApproachingRevision = (revisions?: IRevisionMeta[]) => {
  if (!revisions?.length) return false;
  const expirationDate = getExpirationDate({ revisions: revisions });
  if (!expirationDate) return false;
  const currentDateAddYear = addYears(new Date(), 1);
  return isBefore(new Date(expirationDate), currentDateAddYear);
};

const ApproachingRevisionDate = ({ revisions }: Props) => {
  const approachingRevision = useMemo(
    () => revisions.map((r) => isApproachingRevision(r)).filter((a) => !!a).length,
    [revisions],
  );

  return (
    <RevisionDateIcon text={approachingRevision} phrasesKey={'form.responsible.revisionDate'} />
  );
};

export default ApproachingRevisionDate;
