/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { AlertCircle } from '@ndla/icons/editor';
import { colors, spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { Resource, TaxonomyElement, Topic } from '../../../modules/taxonomy/taxonomyApiInterfaces';

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const TaxonomyInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledId = styled.span`
  font-style: ${(props: { isVisible: boolean }) => !props.isVisible && 'italic'};
  color: ${(props: { isVisible: boolean }) =>
    !props.isVisible ? colors.brand.grey : colors.brand.primary};
`;

interface Props {
  articleType: string;
  taxonomy?: {
    topics?: Topic[];
    resources?: Resource[];
  };
}

const getWrongConnections = ({ articleType, taxonomy }: Props): (Resource | Topic)[] => {
  if (articleType === 'standard') {
    return taxonomy?.topics ?? [];
  } else if (articleType === 'topic-article') {
    return taxonomy?.resources ?? [];
  }
  return [];
};

const getOtherArticleType = (articleType: string): string => {
  return articleType === 'standard' ? 'topic-article' : 'standard';
};

const TaxonomyConnectionErrors = ({ taxonomy, articleType }: Props) => {
  const { t } = useTranslation();

  const wrongConnections = getWrongConnections({ articleType, taxonomy });
  if (wrongConnections.length < 1) return null;

  const wrongTooltip = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.${getOtherArticleType(articleType)}`),
    isType: t(`articleType.${articleType}`),
  });

  return (
    <>
      <FieldHeader
        title={t('taxonomy.info.wrongConnections')}
        subTitle={t('taxonomy.info.wrongConnectionsSubTitle')}
      />
      {wrongConnections.map(taxonomyElement => {
        const visibility = taxonomyElement.metadata ? taxonomyElement.metadata.visible : true;
        return (
          <TaxonomyInfoDiv key={taxonomyElement.id}>
            <Tooltip tooltip={wrongTooltip}>
              <StyledId isVisible={visibility}>
                <StyledWarnIcon title={wrongTooltip} />
                {' - '}
                {taxonomyElement.id} ({taxonomyElement.name})
              </StyledId>
            </Tooltip>
          </TaxonomyInfoDiv>
        );
      })}
    </>
  );
};

export default TaxonomyConnectionErrors;
