/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import css from '@emotion/css';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { ContentTypeBadge, constants } from '@ndla/ui';
import { colors, fonts, spacing } from '@ndla/core';
import { Camera, SquareAudio, Concept } from '@ndla/icons/editor';
import HeaderStatusInformation from './HeaderStatusInformation';
import { toEditArticle } from '../../util/routeHelpers';
import * as draftApi from '../../modules/draft/draftApi';
import Spinner from '../Spinner';
import handleError from '../../util/handleError';

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

export const types = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge
        type={contentTypes.SUBJECT_MATERIAL}
        background
        size="small"
      />
    ),
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />
    ),
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
  concept: {
    form: 'conceptform',
    cssModifier: 'concept',
    icon: <Concept />,
  },
};

const HeaderInformation = ({
  type,
  noStatus,
  statusText,
  published,
  isNewLanguage,
  title,
  t,
  formIsDirty,
  createMessage,
  getArticle,
  history,
  hasMultipleTaxonomyEntries,
}) => {
  const [loading, setLoading] = useState(false);
  const onSaveAsNew = async () => {
    try {
      if (formIsDirty) {
        createMessage({
          translationKey: 'form.mustSaveFirst',
          severity: 'danger',
        });
      } else {
        setLoading(true);
        const article = getArticle();
        const newArticle = await draftApi.cloneDraft(
          article.id,
          article.language,
        );
        // we don't set loading to false as the redirect will unmount this component anyway
        history.push(
          toEditArticle(
            newArticle.id,
            newArticle.articleType,
            article.language,
          ),
        );
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
          {title
            ? `${t(`${types[type].form}.title`)}: ${title}`
            : t(`${types[type].form}.title`)}
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
        hasMultipleTaxonomyEntries={hasMultipleTaxonomyEntries}
      />
    </StyledHeader>
  );
};

HeaderInformation.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  published: PropTypes.bool,
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
  getArticle: PropTypes.func,
  isNewLanguage: PropTypes.bool,
  title: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.func }),
  formIsDirty: PropTypes.bool,
  createMessage: PropTypes.func,
  hasMultipleTaxonomyEntries: PropTypes.bool,
};

export default injectT(HeaderInformation);
