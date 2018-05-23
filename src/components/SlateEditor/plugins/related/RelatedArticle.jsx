import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/fp/get';
import { RelatedArticle as RelatedArticleUI } from 'ndla-ui';
import { mapping } from '../utils/relatedArticleMapping';
import { toEditArticle } from '../../../../util/routeHelpers';

const resourceType = item =>
  item.resourceTypes
    ? item.resourceTypes.find(it => mapping(it.id))
    : { id: '' };

const urlDomain = data => {
  const a = document.createElement('a');
  a.href = data;
  return a.hostname;
};

const RelatedArticle = ({ locale, item }) => (
  <RelatedArticleUI
    {...mapping(resourceType(item).id || item.id)}
    title={get('title.title', item) || item.title}
    introduction={
      get('metaDescription.metaDescription', item) || item.description
    }
    to={item.url || toEditArticle(item.id, 'standard', locale)}
    linkInfo={
      item.id === 'external-learning-resources'
        ? `Nettside hos ${urlDomain(item.url)}`
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

export default RelatedArticle;
