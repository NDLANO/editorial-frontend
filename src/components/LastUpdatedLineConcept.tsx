import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import formatDate from '../util/formatDate';
import { Author } from '../interfaces';

const StyledInfo = styled.div`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

interface Props {
  creators: Author[];
  published?: string;
}

const LastUpdatedLineConcept = ({ creators, published, t }: Props & tType) => (
  <StyledInfo>
    {creators.map(creator => creator.name).join(', ')}
    {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
    {formatDate(published)}
  </StyledInfo>
);

export default injectT(LastUpdatedLineConcept);
