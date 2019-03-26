/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { Hero, OneColumn } from '@ndla/ui';
import * as draftApi from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import { queryResources } from '../../modules/taxonomy';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';

const StyledHero = styled.div`
  margin-top: -${spacing.spacingUnit * 4}px;
`;

const PreviewDraftPage = ({
  match: {
    params: { draftId, language },
  },
}) => {
  const [draft, setDraft] = useState(undefined);
  const [resource, setResource] = useState(undefined);

  const fetchDraft = async () => {
    console.log(draftApi);
    const fetchedDraft = await draftApi.fetchDraft(draftId, language);
    const convertedArticle = await articleApi.getPreviewArticle(
      fetchedDraft,
      language,
    );
    setDraft(convertedArticle);
  };

  const fetchResource = async () => {
    const fetchedResource = await queryResources(draftId, language);
    setResource(fetchedResource);
  };

  useEffect(() => {
    fetchDraft();
    fetchResource();
  }, [draftId, language]);

  if (!draft) {
    return null;
  }
  const contentType = resource
    ? getContentTypeFromResourceTypes(resource[0].resourceTypes)
    : undefined;
  return (
    <Fragment>
      {contentType && (
        <StyledHero>
          <Hero contentType={contentType.contentType} />
        </StyledHero>
      )}
      <OneColumn>
        <PreviewDraft
          article={draft}
          resource={resource}
          contentType={contentType ? contentType.contentType : undefined}
        />
      </OneColumn>
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
