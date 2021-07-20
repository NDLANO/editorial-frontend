import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import DateTimeWrapper from './DateTime/DateTimeWrapper';
import formatDate from '../util/formatDate';
import { Author } from '../interfaces';

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

const LastUpdatedLine = ({ creators, published, t, ...rest }: Props & tType) => (
  <div css={infoCss}>
    {creators.map(creator => creator.name).join(', ')}
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

interface Props {
  creators: Author[];
  published: string;
}

// LastUpdatedLine.propTypes = {
//   creators: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string,
//     }),
//   ),
//   published: PropTypes.string,
// };

export default injectT(LastUpdatedLine);
