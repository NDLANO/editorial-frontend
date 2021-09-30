/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AlertCircle } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';
import { fetchDraft } from '../../../modules/draft/draftApi';

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const StructureErrorIcon = ({
  contentUri,
  isSubject,
}: {
  contentUri?: string;
  isSubject: boolean;
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let shouldUpdateState = true;

    const fetchAndSetError = async (contentUri: string) => {
      const articleId = contentUri.split(':').pop();
      if (articleId) {
        try {
          const fetched = await fetchDraft(Number(articleId));
          if (fetched.articleType !== 'topic-article') {
            if (shouldUpdateState) {
              const wrongTooltip = t('taxonomy.info.wrongArticleType', {
                placedAs: t(`articleType.topic-article`),
                isType: t(`articleType.standard`),
              });
              setError(wrongTooltip);
            }
          }
        } catch (e) {
          if (shouldUpdateState) {
            if (typeof e.messages === 'string') setError(e.message);
            else setError(t('errorMessage.errorWhenFetchingTaxonomyArticle'));
          }
        }
      }
    };

    if (isSubject || !contentUri) return;

    fetchAndSetError(contentUri);
    return () => {
      shouldUpdateState = false;
    };
  }, [isSubject, contentUri]);

  if (!error) return null;

  return (
    <Tooltip tooltip={error}>
      <StyledWarnIcon title={error} />
    </Tooltip>
  );
};

export default StructureErrorIcon;
