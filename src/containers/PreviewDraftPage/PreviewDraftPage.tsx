/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { HelmetWithTracker } from '@ndla/tracker';
//@ts-ignore
import { Hero, OneColumn } from '@ndla/ui';
import { css } from '@emotion/core';
import * as draftApi from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import { queryResources } from '../../modules/taxonomy';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import LanguageSelector from './LanguageSelector';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { Resource } from '../../modules/taxonomy/taxonomyApiInterfaces';

interface MatchProps {
  draftId: string;
  language: string;
}

interface Props extends RouteComponentProps<MatchProps> {}

const PreviewDraftPage = ({
  match: {
    params: { draftId, language },
  },
}: Props) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ArticleConverterApiType | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchDraft = async () => {
      const fetchedDraft = await draftApi.fetchDraft(parseInt(draftId), language);
      const convertedArticle = await articleApi.getPreviewArticle(fetchedDraft, language);
      setDraft(convertedArticle);
    };
    fetchDraft();
    const fetchResource = async () => {
      const fetchedResources = await queryResources(draftId, language);
      setResources(fetchedResources);
    };
    fetchResource();
  }, [draftId, language]);

  if (!draft) {
    return null;
  }

  const hasResourceTypes = resources.length > 0;
  const contentTypeFromResourceType = hasResourceTypes
    ? getContentTypeFromResourceTypes(resources[0].resourceTypes)
    : undefined;

  const contentType = contentTypeFromResourceType?.contentType;
  const label = (hasResourceTypes && resources[0].resourceTypes[0]?.name) || '';

  return (
    <>
      <div
        css={css`
          overflow: auto;
        `}>
        <Hero contentType={contentType}>
          <LanguageSelector supportedLanguages={draft.supportedLanguages} />
        </Hero>
        <HelmetWithTracker title={`${draft.title} ${t('htmlTitles.titleTemplate')}`} />
        <OneColumn>
          <PreviewDraft
            article={draft}
            contentType={contentType}
            language={language}
            label={label}
          />
        </OneColumn>
      </div>
    </>
  );
};

export default PreviewDraftPage;
