import React from 'react';
// @ts-ignore
import { RelatedArticle as RelatedArticleUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { mapping as iconMapping } from '../../utils/relatedArticleMapping';
import { urlDomain } from '../../../../util/htmlHelpers';
import { toEditArticle } from '../../../../util/routeHelpers';
import { RelatedArticleType } from './RelatedArticleBox';

const resourceTypeProps = (item: RelatedArticleType, numberInList?: number) => {
  const resourceTypes = 'resource' in item ? item?.resource[0]?.resourceTypes : undefined;
  const resourceTypeId = resourceTypes?.find(rt => iconMapping(numberInList)[rt.id])?.id ?? item.id;
  const mappingType = resourceTypeId ?? 'default';
  return iconMapping(numberInList)[mappingType];
};

interface Props {
  item: RelatedArticleType;
  numberInList?: number;
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
        'url' in item
          ? t('form.content.relatedArticle.urlLocation', {
              domain: urlDomain(item.url),
            })
          : ''
      }
    />
  );
};

export default RelatedArticle;
