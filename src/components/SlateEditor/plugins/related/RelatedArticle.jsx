import React from 'react';
import PropTypes from 'prop-types';
import { RelatedArticle as RelatedArticleUI } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { mapping as iconMapping } from '../utils/relatedArticleMapping';
import { toEditArticle } from '../../../../util/routeHelpers';

const resourceType = item =>
  item.resourceTypes
    ? item.resourceTypes.find(it => iconMapping(it.id))
    : { id: '' };

const urlDomain = data => {
  const a = document.createElement('a');
  a.href = data;
  return a.hostname;
};

const RelatedArticle = ({ locale, item, t }) => (
  <RelatedArticleUI
    {...iconMapping(resourceType(item).id || item.id)}
    title={convertFieldWithFallback(item, 'title', item.title)}
    introduction={convertFieldWithFallback(
      item,
      'metaDescription',
      item.description,
    )}
    to={item.url || toEditArticle(item.id, 'standard', locale)}
    linkInfo={
      item.id === 'external-learning-resources'
        ? t('form.content.relatedArticle.urlLocation', {
            domain: urlDomain(item.url),
          })
        : ''
    }
  />
);

RelatedArticle.propTypes = {
  locale: PropTypes.string,
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default injectT(RelatedArticle);
