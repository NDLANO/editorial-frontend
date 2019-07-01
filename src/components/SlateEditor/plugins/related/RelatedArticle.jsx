import React from 'react';
import PropTypes from 'prop-types';
import { RelatedArticle as RelatedArticleUI } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { mapping as iconMapping } from '../../utils/relatedArticleMapping';
import { urlDomain } from '../../../../util/htmlHelpers';
import { toEditArticle } from '../../../../util/routeHelpers';

const resourceTypeProps = (item, numberInList) => {
  const resourceType = item.resource
    ? item.resource.length &&
      item.resource[0].resourceTypes &&
      item.resource[0].resourceTypes.find(
        resourceType => iconMapping(numberInList)[resourceType.id],
      )
    : { id: item.id }; // if no resource it is external article
  if (resourceType) {
    return iconMapping(numberInList)[resourceType.id];
  }
  return iconMapping(numberInList).default;
};

const RelatedArticle = ({ locale, item, t, numberInList }) => (
  <RelatedArticleUI
    {...resourceTypeProps(item, numberInList)}
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
    description: PropTypes.string,
    url: PropTypes.string,
  }),
  numberInList: PropTypes.number,
};

export default injectT(RelatedArticle);
