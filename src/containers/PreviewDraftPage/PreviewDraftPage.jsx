/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { Hero, OneColumn } from '@ndla/ui';
import { css } from '@emotion/core';
import * as draftApi from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import { queryResources } from '../../modules/taxonomy';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import LanguageSelector from './LanguageSelector';

const PreviewDraftPage = ({
  match: {
    params: { draftId, language },
  },
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(undefined);
  const [resource, setResource] = useState(undefined);

  useEffect(() => {
    const fetchDraft = async () => {
      const fetchedDraft = await draftApi.fetchDraft(draftId, language);
      const convertedArticle = await articleApi.getPreviewArticle(fetchedDraft, language);
      setDraft(convertedArticle);
    };
    fetchDraft();
    const fetchResource = async () => {
      const fetchedResource = await queryResources(draftId, language);
      setResource(fetchedResource);
    };
    fetchResource();
  }, [draftId, language]);

  if (!draft) {
    return null;
  }

  const contentTypeFromResourceType =
    resource && resource.length > 0
      ? getContentTypeFromResourceTypes(resource[0].resourceTypes)
      : undefined;

  const contentType =
    contentTypeFromResourceType && contentTypeFromResourceType.contentType
      ? contentTypeFromResourceType.contentType
      : undefined;

  return (
    <Fragment>
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
            resource={resource}
            contentType={contentType}
            language={language}
          />
        </OneColumn>
      </div>
    </Fragment>
  );
};

PreviewDraftPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      draftId: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  }),
};

export default PreviewDraftPage;
