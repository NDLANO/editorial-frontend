/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Children, isValidElement, ReactElement, ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import SafeLink from '@ndla/safelink';
import { colors, fonts, spacing } from '@ndla/core';
import { RssFeed } from '@ndla/icons/common';
import { Check, AlertCircle } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { IConceptSummary } from '@ndla/types-concept-api';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';
import { Time } from '@ndla/icons/common';
import config from '../../config';
import LearningpathConnection from './LearningpathConnection';
import EmbedConnection from './EmbedInformation/EmbedConnection';
import { unreachable } from '../../util/guards';

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

/** Helper component to only render splitter if children are rendering */
const Splitter = ({
  children,
  disableSplitter,
}: {
  children?: ReactNode;
  disableSplitter?: boolean;
}) => {
  const validChildren = Children.toArray(children).filter(child =>
    isValidElement(child),
  ) as ReactElement[];
  if (!Children.count(validChildren)) return null;
  return (
    <>
      {children && !disableSplitter && <StyledSplitter />}
      {children}
    </>
  );
};

interface Props {
  noStatus?: boolean;
  statusText?: string;
  isNewLanguage?: boolean;
  published: boolean;
  taxonomyPaths?: string[];
  indentLeft?: boolean;
  fontSize?: number;
  type?: string;
  id?: number;
  setHasConnections?: (hasConnections: boolean) => void;
  expirationDate?: string;
}

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  published,
  taxonomyPaths,
  indentLeft = false,
  fontSize,
  type,
  id,
  setHasConnections,
  expirationDate,
}: Props) => {
  const { t } = useTranslation();
  const [learningpaths, setLearningpaths] = useState<ILearningPathV2[]>([]);
  const [articles, setArticles] = useState<IMultiSearchSummary[]>([]);
  const [concepts, setConcepts] = useState<IConceptSummary[]>([]);

  useEffect(() => {
    const allConnections = [...learningpaths, ...articles, ...concepts];
    setHasConnections?.(allConnections.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningpaths, articles, concepts]);

  const StyledStatus = styled.p`
    ${fonts.sizes(fontSize || 18, 1.1)};
    font-weight: ${fonts.weight.semibold};
    text-transform: uppercase;
    margin: 0 ${fontSize && fontSize <= 12 ? spacing.xsmall : spacing.small} 0
      ${indentLeft ? 0 : spacing.small};
  `;

  const StyledSmallText = styled.small`
    color: ${fontSize && fontSize <= 12 ? '#000' : colors.text.light};
    padding-right: ${spacing.xsmall};
    ${fonts.sizes((fontSize && fontSize - 1) || 14, 1.1)};
    font-weight: ${fonts.weight.light};
    text-transform: uppercase;
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

  const getWarnStatus = (date?: string): 'warn' | 'expired' | undefined => {
    if (!date) return undefined;
    const parsedDate = new Date(date);

    const daysToWarn = 365;
    const errorDate = new Date();
    const warnDate = new Date();
    warnDate.setDate(errorDate.getDate() + daysToWarn);

    if (errorDate > parsedDate) return 'expired';
    if (warnDate > parsedDate) return 'warn';
  };

  const StyledTimeIcon = styled(Time)<{ status: 'warn' | 'expired' }>`
    height: ${spacing.normal};
    width: ${spacing.normal};
    fill: ${p => {
      switch (p.status) {
        case 'warn':
          return colors.support.yellow;
        case 'expired':
          return colors.support.red;
        default:
          unreachable(p.status);
      }
    }};
  `;

  const expirationColor = getWarnStatus(expirationDate);
  const revisionDateExpiration =
    (type === 'standard' || type === 'topic-article') && expirationColor ? (
      <Tooltip tooltip={t(`form.workflow.expiration.${expirationColor}`)}>
        <StyledTimeIcon status={expirationColor} />
      </Tooltip>
    ) : null;

  const multipleTaxonomyIcon = taxonomyPaths && taxonomyPaths?.length > 2 && (
    <Tooltip tooltip={t('form.workflow.multipleTaxonomy')}>
      <StyledWarnIcon title={t('form.taxonomySection')} />
    </Tooltip>
  );

  const publishedIcon = (
    <Tooltip tooltip={t('form.workflow.published')}>
      <StyledCheckIcon title={t('form.status.published')} />
    </Tooltip>
  );

  const publishedIconLink = (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${taxonomyPaths?.[0]}`}>
      {publishedIcon}
    </StyledLink>
  );

  const rssLink = type === 'podcast-series' && id !== undefined && (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}/podkast/${id}/feed.xml`}>
      <StyledRssIcon title={t('podcastSeriesForm.rss')} />
    </StyledLink>
  );

  const learningpathConnections =
    type === 'standard' || type === 'topic-article' ? (
      <LearningpathConnection
        id={id}
        learningpaths={learningpaths}
        setLearningpaths={setLearningpaths}
      />
    ) : null;

  const imageConnections = type === 'image' && (
    <EmbedConnection
      id={id}
      type="image"
      articles={articles}
      setArticles={setArticles}
      concepts={concepts}
      setConcepts={setConcepts}
    />
  );
  const audioConnections =
    type === 'audio' || type === 'podcast' ? (
      <EmbedConnection id={id} type="audio" articles={articles} setArticles={setArticles} />
    ) : null;
  const conceptConnecions =
    type === 'concept' ? (
      <EmbedConnection id={id} type="concept" articles={articles} setArticles={setArticles} />
    ) : null;
  const articleConnections =
    type === 'standard' || type === 'topic-article' ? (
      <EmbedConnection id={id} type="article" articles={articles} setArticles={setArticles} />
    ) : null;

  const StatusIcons = (
    <>
      <Splitter disableSplitter={indentLeft}>
        {articleConnections}
        {conceptConnecions}
        {learningpathConnections}
        {published &&
          (taxonomyPaths && taxonomyPaths?.length > 0 ? publishedIconLink : publishedIcon)}
        {multipleTaxonomyIcon}
        {revisionDateExpiration}
      </Splitter>
    </>
  );

  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {StatusIcons}
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (!noStatus) {
    return (
      <StyledStatusWrapper>
        {StatusIcons}
        <StyledStatus>
          <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
          {isNewLanguage ? t('form.status.new_language') : statusText || t('form.status.new')}
        </StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (type === 'image') {
    return <StyledStatusWrapper>{imageConnections}</StyledStatusWrapper>;
  } else if (type === 'audio' || type === 'podcast') {
    return <StyledStatusWrapper>{audioConnections}</StyledStatusWrapper>;
  } else if (type === 'podcast-series') {
    return <StyledStatusWrapper>{rssLink}</StyledStatusWrapper>;
  }
  return null;
};

export default HeaderStatusInformation;
