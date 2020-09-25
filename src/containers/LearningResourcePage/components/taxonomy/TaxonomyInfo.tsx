/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import { Switch } from '@ndla/switch';
import { FieldHeader } from '@ndla/forms';
import { TaxonomyElement } from '../../../../interfaces';

type StyledIdProps = {
  isVisible: boolean;
};

const TaxonomyInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledSwitch = styled(Switch)``;

const StyledId = styled.span`
  font-style: ${(props: StyledIdProps) => !props.isVisible && 'italic'};
  color: ${(props: StyledIdProps) =>
    !props.isVisible ? colors.brand.grey : colors.brand.primary};
`;

interface Props {
  taxonomyElement: TaxonomyElement;
  updateMetadata: Function;
  t: Function;
}

const TaxonomyInfo = ({ taxonomyElement, updateMetadata, t }: Props) => {
  return (
    <>
      <FieldHeader
        title={t('taxonomy.info.title')}
        subTitle={t('taxonomy.info.subTitle')}></FieldHeader>
      <TaxonomyInfoDiv>
        <StyledId
          isVisible={
            taxonomyElement.metadata ? taxonomyElement.metadata.visible : true
          }>
          {taxonomyElement.id}
        </StyledId>
        <StyledSwitch
          onChange={updateMetadata(!taxonomyElement.metadata?.visible)}
          checked={
            taxonomyElement.metadata ? taxonomyElement.metadata.visible : true
          }
          label=""
          id={'visibility'}
        />
      </TaxonomyInfoDiv>
    </>
  );
};

export default injectT(TaxonomyInfo);
