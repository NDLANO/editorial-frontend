//@ts-ignore
import { RelatedArticle as RelatedArticleUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { mapping as iconMapping } from '../../utils/relatedArticleMapping';
import { urlDomain } from '../../../../util/htmlHelpers';
import { toEditArticle } from '../../../../util/routeHelpers';
import { RelatedArticleType } from './RelatedArticleBox';

const resourceTypeProps = (item: RelatedArticleType, numberInList?: number) => {
  if ('resource' in item) {
    const resourceType =
      item.resource[0]?.resourceTypes.find(
        resourceType => iconMapping(numberInList)[resourceType.id],
      )?.id || 'default';
    return iconMapping(numberInList)[resourceType];
  }
  return iconMapping(numberInList)[item.id];
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
      title={convertFieldWithFallback<'title'>(item, 'title', item.title)}
      introduction={
        'url' in item
          ? item.description
          : convertFieldWithFallback<'metaDescription'>(item, 'metaDescription', '')
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
