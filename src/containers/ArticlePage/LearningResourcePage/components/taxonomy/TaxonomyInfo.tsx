/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { Switch } from '@ndla/switch';
import { FieldHeader } from '@ndla/forms';
import { AlertCircle } from '@ndla/icons/editor';
import { TaxonomyElement } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';

type StyledIdProps = {
  isVisible: boolean;
};

const TaxonomyInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const StyledId = styled.span`
  font-style: ${(props: StyledIdProps) => !props.isVisible && 'italic'};
  color: ${(props: StyledIdProps) => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
`;

type LocalElement = Omit<TaxonomyElement, 'metadata'> & Partial<Pick<TaxonomyElement, 'metadata'>>;

interface Props {
  mainTaxonomyElement?: LocalElement;
  nonMainTaxonomyElements: LocalElement[];
  updateMetadata: (visible: boolean) => void;
}

const ElementInfoDiv = ({
  taxonomyElement,
  updateMetadata,
  isMain,
}: {
  taxonomyElement: LocalElement;
  isMain: boolean;
  updateMetadata: (visible: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <TaxonomyInfoDiv>
      <StyledId isVisible={taxonomyElement.metadata ? taxonomyElement.metadata.visible : true}>
        {!taxonomyElement.id.startsWith('urn:resource:') && (
          <>
            <StyledWarnIcon
              title={t('taxonomy.info.wrongArticleType', {
                placedAs: t('articleType.topic-article'),
                isType: t('articleType.standard'),
              })}
            />
            {' - '}
          </>
        )}
        {taxonomyElement.id}
      </StyledId>
      <Switch
        disabled={!isMain}
        onChange={() => updateMetadata(!taxonomyElement.metadata?.visible)}
        checked={taxonomyElement.metadata ? taxonomyElement.metadata.visible : true}
        label=""
        id={'visibility'}
      />
    </TaxonomyInfoDiv>
  );
};

const TaxonomyInfo = ({ mainTaxonomyElement, nonMainTaxonomyElements, updateMetadata }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldHeader title={t('taxonomy.info.title')} subTitle={t('taxonomy.info.subTitle')} />
      {mainTaxonomyElement && (
        <ElementInfoDiv
          taxonomyElement={mainTaxonomyElement}
          isMain={true}
          updateMetadata={updateMetadata}
        />
      )}
      {nonMainTaxonomyElements.map(taxonomyElement => {
        return (
          <ElementInfoDiv
            key={taxonomyElement.id}
            taxonomyElement={taxonomyElement}
            isMain={false}
            updateMetadata={updateMetadata}
          />
        );
      })}
    </>
  );
};

export default TaxonomyInfo;
