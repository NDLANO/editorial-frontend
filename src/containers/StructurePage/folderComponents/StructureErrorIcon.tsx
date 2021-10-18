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
import { SubjectTopic, SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const StructureErrorIcon = (
  item: SubjectTopic | SubjectType,
  isRoot: boolean,
  articleType?: string,
) => {
  const { t } = useTranslation();
  if (isRoot || articleType === 'topic-article') return null;
  const error = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.topic-article`),
    isType: t(`articleType.standard`),
  });

  return (
    <Tooltip tooltip={error}>
      <StyledWarnIcon title={error} />
    </Tooltip>
  );
};

export default StructureErrorIcon;
