import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import formatDate from '../util/formatDate';

const StyledInfo = styled.div`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

const LastUpdatedLineConcept = ({ creators, published, t, ...rest }) => (
  <StyledInfo>
    {creators.map(creator => creator.name).join(', ')}
    {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
    {formatDate(published)}
  </StyledInfo>
);

LastUpdatedLineConcept.propTypes = {
  creators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  published: PropTypes.string,
};

export default injectT(LastUpdatedLineConcept);
