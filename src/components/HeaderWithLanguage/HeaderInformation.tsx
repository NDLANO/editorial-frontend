/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactChild, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
// @ts-ignore
import { ContentTypeBadge, constants } from '@ndla/ui';
import { colors, fonts, spacing } from '@ndla/core';
import { Camera, Concept, Filter, SquareAudio } from '@ndla/icons/editor';
import { Podcast } from '@ndla/icons/common';
import { List } from '@ndla/icons/action';
import HeaderStatusInformation from './HeaderStatusInformation';
import { toEditArticle } from '../../util/routeHelpers';
import * as draftApi from '../../modules/draft/draftApi';
import Spinner from '../Spinner';
import handleError from '../../util/handleError';
import { useMessages } from '../../containers/Messages/MessagesProvider';

export const StyledSplitter = styled.div`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0 ${spacing.xsmall};
  margin: ${spacing.normal} 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.light};
`;

const StyledTitleHeaderWrapper = styled.div`
  padding-left: ${spacing.small};
  display: flex;
  align-items: center;
  h1 {
    ${fonts.sizes(26, 1.1)};
    font-weight: ${fonts.weight.semibold};
    margin: ${spacing.small} ${spacing.normal} ${spacing.small} ${spacing.small};
    color: ${colors.text.primary};
  }
`;

const { contentTypes } = constants;

export const types: Record<string, { form: string; cssModifier: string; icon: ReactChild }> = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="small" />,
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: <ContentTypeBadge type={contentTypes.TOPIC} background size="small" />,
  },
  subjectpage: {
    form: 'subjectpageForm',
    cssModifier: 'article',
    icon: <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />,
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
  podcast: {
    form: 'podcastForm',
    cssModifier: 'multimedia',
    icon: <Podcast />,
  },
  'podcast-series': {
    form: 'podcastSeriesForm',
    cssModifier: 'multimedia',
    icon: <List />,
  },
  concept: {
    form: 'conceptform',
    cssModifier: 'concept',
    icon: <Concept />,
  },
  filter: {
    form: 'filterform',
    cssModifier: 'filter',
    icon: <Filter />,
  },
};

interface Props {
  noStatus: boolean;
  statusText?: string;
  published?: boolean;
  type: string;
  getEntity?: () => any;
  isNewLanguage: boolean;
  title?: string;
  formIsDirty?: boolean;
  taxonomyPaths?: string[];
  id?: number;
}

const HeaderInformation = ({
  type,
  noStatus,
  id,
  statusText,
  published = false,
  isNewLanguage,
  title,
  formIsDirty,
  getEntity,
  taxonomyPaths,
}: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();
  const onSaveAsNew = async () => {
    if (!getEntity) return;
    try {
      if (formIsDirty) {
        createMessage({
          translationKey: 'form.mustSaveFirst',
          severity: 'danger',
          timeToLive: 0,
        });
      } else {
        setLoading(true);
        const article = getEntity();
        const newArticle = await draftApi.cloneDraft(article.id, article.language);
        // we don't set loading to false as the redirect will unmount this component anyway
        navigate(toEditArticle(newArticle.id, newArticle.articleType, article.language));
      }
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  };

  return (
    <StyledHeader>
      <StyledTitleHeaderWrapper>
        {types[type].icon}
        <h1>
          {title ? `${t(`${types[type].form}.title`)}: ${title}` : t(`${types[type].form}.title`)}
        </h1>
        {(type === 'standard' || type === 'topic-article') && (
          <Button
            stripped
            css={css`
              white-space: nowrap;
            `}
            onClick={onSaveAsNew}
            data-testid="saveAsNew">
            {t('form.workflow.saveAsNew')}
            {loading && <Spinner appearance="absolute" />}
          </Button>
        )}
      </StyledTitleHeaderWrapper>
      <HeaderStatusInformation
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        published={published}
        taxonomyPaths={taxonomyPaths}
        type={type}
        id={id}
      />
    </StyledHeader>
  );
};

export default HeaderInformation;
