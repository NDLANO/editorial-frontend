/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import { Switch } from '@ndla/switch';
import { FieldHeader } from '@ndla/forms';
import { TaxonomyElement } from '../../../../../interfaces';

type StyledIdProps = {
  isVisible: boolean;
};

const TaxonomyInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledId = styled.span`
  font-style: ${(props: StyledIdProps) => !props.isVisible && 'italic'};
  color: ${(props: StyledIdProps) => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
`;

interface Props {
  taxonomyElement: TaxonomyElement;
  updateMetadata: (visible: boolean) => void;
}

const TaxonomyInfo: FC<Props & tType> = ({ taxonomyElement, updateMetadata, t }: Props & tType) => {
  return (
    <>
      <FieldHeader title={t('taxonomy.info.title')} subTitle={t('taxonomy.info.subTitle')} />
      <TaxonomyInfoDiv>
        <StyledId isVisible={taxonomyElement.metadata ? taxonomyElement.metadata.visible : true}>
          {taxonomyElement.id}
        </StyledId>
        <Switch
          onChange={() => updateMetadata(!taxonomyElement.metadata?.visible)}
          checked={taxonomyElement.metadata ? taxonomyElement.metadata.visible : true}
          label=""
          id={'visibility'}
        />
      </TaxonomyInfoDiv>
    </>
  );
};

export default injectT(TaxonomyInfo);
