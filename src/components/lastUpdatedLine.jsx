import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import formatDate from '../util/formatDate';

const classes = new BEMHelper({
  name: 'topic-article-content',
  prefix: 'c-',
});

function LastUpdatedLine({ creators, published, t }) {
  return (
    <div {...classes('info')}>
      {creators.map(creator => creator.name).join(',')}
      {published
        ? ` - ${t('topicArticleForm.info.lastUpdated', {
            updated: formatDate(published),
          })}`
        : ''}
    </div>
  );
}

LastUpdatedLine.propTypes = {
  creators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  published: PropTypes.string,
};

export default injectT(LastUpdatedLine);
