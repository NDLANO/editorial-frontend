/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import SafeLink from '@ndla/safelink';
import { colors, fonts, spacing } from '@ndla/core';
import { RssFeed, Time } from '@ndla/icons/common';
import { Check, AlertCircle } from '@ndla/icons/editor';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import config from '../../config';
import LearningpathConnection from './LearningpathConnection';
import EmbedConnection from './EmbedInformation/EmbedConnection';
import formatDate from '../../util/formatDate';

export const StyledSplitter = styled.div`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const StyledStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const getWarnStatus = (date?: string): 'warn' | 'expired' | undefined => {
  if (!date) return undefined;
  const parsedDate = new Date(date);

  const daysToWarn = 365;
  const errorDate = new Date();
  const warnDate = new Date();
  warnDate.setDate(errorDate.getDate() + daysToWarn);

  if (errorDate > parsedDate) return 'expired';
  if (warnDate > parsedDate) return 'warn';
};

export const StyledTimeIcon = styled(Time)`
  &[data-status='warn'] {
    fill: ${colors.tasksAndActivities.dark};
  }
  &[data-status='expired'] {
    fill: ${colors.support.red};
  }
  width: 24px;
  height: 24px;
`;

interface Props {
  compact?: boolean;
  noStatus?: boolean;
  statusText?: string;
  isNewLanguage?: boolean;
  published: boolean;
  multipleTaxonomy?: boolean;
  type?: string;
  id?: number;
  setHasConnections?: (hasConnections: boolean) => void;
  expirationDate?: string;
  responsibleName?: string;
  hasRSS?: boolean;
}

const StyledStatus = styled.p`
  ${fonts.sizes('16', '1.1')};
  font-weight: ${fonts.weight.semibold};
  margin: 0 ${spacing.small} 0;
  color: ${colors.brand.primary};
  &[data-compact='true'] {
    ${fonts.sizes('10', '1.1')};
    margin: 0 ${spacing.xsmall} 0;
  }
`;

const StyledSmallText = styled.small`
  color: ${colors.text.light};
  ${fonts.sizes('16', '1.1')};
  padding-right: ${spacing.xsmall};
  font-weight: ${fonts.weight.normal};
  color: ${colors.brand.primary};
  &[data-compact='true'] {
    color: #000;
    ${fonts.sizes('9', '1.1')};
  }
`;

const StyledCheckIcon = styled(Check)`
  height: ${spacing.normal};
  width: ${spacing.normal};
  fill: ${colors.support.green};
`;

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.normal};
  width: ${spacing.normal};
  fill: ${colors.support.yellow};
`;

const StyledRssIcon = styled(RssFeed)`
  height: ${spacing.normal};
  width: ${spacing.normal};
  fill: ${colors.support.green};
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  published,
  multipleTaxonomy,
  compact,
  type,
  id,
  setHasConnections,
  expirationDate,
  responsibleName,
  hasRSS,
}: Props) => {
  const { t } = useTranslation();
  const [learningpaths, setLearningpaths] = useState<ILearningPathV2[]>([]);
  const [articles, setArticles] = useState<IMultiSearchSummary[]>([]);
  const [concepts, setConcepts] = useState<IConceptSummary[]>([]);

  useEffect(() => {
    setHasConnections?.(!!learningpaths?.length ?? !!articles?.length ?? !!concepts?.length);
  }, [learningpaths, articles, concepts, setHasConnections]);

  const expirationColor = useMemo(() => getWarnStatus(expirationDate), [expirationDate]);

  if (!noStatus || isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {type === 'standard' || type === 'topic-article' ? (
          <>
            <EmbedConnection id={id} type="article" articles={articles} setArticles={setArticles} />
            <LearningpathConnection
              id={id}
              learningpaths={learningpaths}
              setLearningpaths={setLearningpaths}
            />
            {!!expirationColor && !!expirationDate && (
              <StyledTimeIcon
                data-status={expirationColor}
                title={t(`form.workflow.expiration.${expirationColor}`, {
                  date: formatDate(expirationDate),
                })}
                aria-label={t(`form.workflow.expiration.${expirationColor}`, {
                  date: formatDate(expirationDate),
                })}
                aria-hidden={false}
              />
            )}
          </>
        ) : type === 'concept' ? (
          <EmbedConnection id={id} type="concept" articles={articles} setArticles={setArticles} />
        ) : null}
        {published && (
          <StyledLink
            target="_blank"
            aria-label={t('form.workflow.published')}
            title={t('form.workflow.published')}
            to={`${config.ndlaFrontendDomain}/article/${id}`}
          >
            <StyledCheckIcon />
          </StyledLink>
        )}
        {multipleTaxonomy && (
          <StyledWarnIcon
            aria-label={t('form.workflow.multipleTaxonomy')}
            title={t('form.workflow.multipleTaxonomy')}
            aria-hidden={false}
          />
        )}
        <StyledStatus data-compact={compact}>
          <div>
            <StyledSmallText data-compact={compact}>{`${t(
              'form.responsible.label',
            )}:`}</StyledSmallText>
            {responsibleName || t('form.responsible.noResponsible')}
          </div>
          {noStatus ? (
            t('form.status.new_language')
          ) : (
            <div>
              <StyledSmallText data-compact={compact}>
                {t('form.workflow.statusLabel')}:
              </StyledSmallText>
              {isNewLanguage ? t('form.status.new_language') : statusText || t('form.status.new')}
            </div>
          )}
        </StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (type === 'image') {
    return (
      <StyledStatusWrapper>
        <EmbedConnection
          id={id}
          type="image"
          articles={articles}
          setArticles={setArticles}
          concepts={concepts}
          setConcepts={setConcepts}
        />
      </StyledStatusWrapper>
    );
  } else if (type === 'audio' || type === 'podcast') {
    return (
      <StyledStatusWrapper>
        <EmbedConnection id={id} type="audio" articles={articles} setArticles={setArticles} />
      </StyledStatusWrapper>
    );
  } else if (type === 'podcast-series' && hasRSS && id !== undefined) {
    return (
      <StyledStatusWrapper>
        <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}/podkast/${id}/feed.xml`}>
          <StyledRssIcon title={t('podcastSeriesForm.rss')} />
        </StyledLink>
      </StyledStatusWrapper>
    );
  }
  return null;
};

export default HeaderStatusInformation;
