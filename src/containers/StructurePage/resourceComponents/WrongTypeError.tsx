/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { AlertCircle } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';

const StyledWarnIcon = styled(AlertCircle)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.red};
`;

const getArticleTypeFromId = (id?: string) => {
  if (id?.startsWith('urn:topic:')) return 'topic-article';
  else if (id?.startsWith('urn:resource:')) return 'standard';
  return undefined;
};

interface Props {
  resource: ResourceWithNodeConnection;
  articleType?: string;
}

const WrongTypeError = ({ resource, articleType }: Props) => {
  const { t } = useTranslation();
  const isArticle = resource.contentUri?.startsWith('urn:article');
  if (!isArticle) return null;

  const expectedArticleType = getArticleTypeFromId(resource.id);
  if (expectedArticleType === articleType) return null;

  const missingArticleTypeError = t('taxonomy.info.missingArticleType', {
    id: getIdFromUrn(resource.contentUri),
  });

  const wrongArticleTypeError = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.${expectedArticleType}`),
    isType: t(`articleType.${articleType}`),
  });

  const errorText = articleType ? wrongArticleTypeError : missingArticleTypeError;

  return (
    <Tooltip tooltip={errorText}>
      <div>
        <StyledWarnIcon title={undefined} />
      </div>
    </Tooltip>
  );
};

export default WrongTypeError;
