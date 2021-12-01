/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AlertCircle } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import { NodeType } from '../../../modules/taxonomy/nodes/nodeApiTypes';

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const StructureErrorIcon = (item: NodeType, isRoot: boolean, articleType?: string) => {
  const { t } = useTranslation();
  if (isRoot || articleType === 'topic-article') return null;

  const missingArticleTypeError = t('taxonomy.info.missingArticleType', {
    id: getIdFromUrn(item.contentUri),
  });

  const wrongArticleTypeError = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.topic-article`),
    isType: t(`articleType.standard`),
  });

  const error = !articleType ? missingArticleTypeError : wrongArticleTypeError;

  return (
    <Tooltip tooltip={error}>
      <StyledWarnIcon title={error} />
    </Tooltip>
  );
};

export default StructureErrorIcon;
