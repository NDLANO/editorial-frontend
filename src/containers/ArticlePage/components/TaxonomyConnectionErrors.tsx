/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { AlertCircle } from '@ndla/icons/editor';
import { colors, spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { InformationOutline } from '@ndla/icons/common';
import { Resource, Topic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { toStructure } from '../../../util/routeHelpers';

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

const StyledId = styled.span<{ isVisible: boolean }>`
  font-style: ${props => !props.isVisible && 'italic'};
  ${props => (!props.isVisible ? `color: ${colors.brand.grey}` : '')}
`;

interface Props {
  articleType: string;
  taxonomy?: {
    topics?: Topic[];
    resources?: Resource[];
  };
}

const iconCSS = css`
  color: ${colors.brand.tertiary};

  &:hover,
  &:focus {
    color: ${colors.brand.primary};
  }
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

export const HelpIcon = styled(InformationOutline)`
  ${iconCSS}
`;

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
        subTitle={t('taxonomy.info.wrongConnectionsSubTitle')}>
        <Tooltip tooltip={t('taxonomy.info.canBeFixedInDatabase')}>
          <HelpIcon />
        </Tooltip>
      </FieldHeader>
      {wrongConnections.map(taxonomyElement => {
        const visibility = taxonomyElement.metadata ? taxonomyElement.metadata.visible : true;
        const errorElement = ` - ${taxonomyElement.id} (${taxonomyElement.name})`;
        const LinkWrapper = ({ children }: { children: ReactNode }) => {
          if (!taxonomyElement.path) {
            return <>{children}</>;
          }
          return <Link to={toStructure(taxonomyElement.path)}>{children}</Link>;
        };

        return (
          <TaxonomyInfoDiv key={taxonomyElement.id}>
            <Tooltip tooltip={wrongTooltip}>
              <LinkWrapper>
                <StyledId isVisible={visibility}>
                  <StyledWarnIcon title={wrongTooltip} />
                  {errorElement}
                </StyledId>
              </LinkWrapper>
            </Tooltip>
          </TaxonomyInfoDiv>
        );
      })}
    </>
  );
};

export default TaxonomyConnectionErrors;
