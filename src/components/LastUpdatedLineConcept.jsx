import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import formatDate from '../util/formatDate';

const infoCss = css`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

const LastUpdatedLineConcept = ({ creators, published, t, ...rest }) => (
  <div css={infoCss}>
    {creators.map(creator => creator.name).join(',')}
    {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
    {formatDate(published)}
  </div>
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
