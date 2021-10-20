import React from 'react';
// @ts-ignore
import { RelatedArticle as RelatedArticleUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { mapping as iconMapping } from '../../utils/relatedArticleMapping';
import { urlDomain } from '../../../../util/htmlHelpers';
import { toEditArticle } from '../../../../util/routeHelpers';
import { RelatedArticleType } from './RelatedArticleBox';

const resourceTypeProps = (item: RelatedArticleType, numberInList: number) => {
  const resourceType =
    'resource' in item
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

interface Props {
  item: RelatedArticleType;
  numberInList: number;
}

const RelatedArticle = ({ item, numberInList }: Props) => {
  const { t } = useTranslation();
  return (
    <RelatedArticleUI
      {...resourceTypeProps(item, numberInList)}
      title={convertFieldWithFallback(item, 'title', item.title)}
      introduction={
        'url' in item ? item.description : convertFieldWithFallback(item, 'metaDescription', '')
      }
      to={'url' in item ? item.url : toEditArticle(item.id, 'standard')}
      target="_blank"
      linkInfo={
        item.id === 'external-learning-resources'
          ? t('form.content.relatedArticle.urlLocation', {
              domain: urlDomain(item.url),
            })
          : ''
      }
    />
  );
};

export default RelatedArticle;
