import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import DateTimeWrapper from './DateTime/DateTimeWrapper';
import formatDate from '../util/formatDate';

const iconCss = css`
  margin-left: 0.2em;
`;

const infoCss = css`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

const buttonCss = css`
  display: inline-flex;
  align-items: center;
`;

const LastUpdatedLine = ({ creators, published, t, ...rest }) => (
  <div css={infoCss}>
    {creators.map(creator => creator.name).join(',')}
    {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
    {published && (
      <DateTimeWrapper {...rest} publishTime={published}>
        <Button link css={buttonCss}>
          {formatDate(published)} <Pencil css={iconCss} />
        </Button>
      </DateTimeWrapper>
    )}
  </div>
);

LastUpdatedLine.propTypes = {
  creators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  published: PropTypes.string,
};

export default injectT(LastUpdatedLine);
