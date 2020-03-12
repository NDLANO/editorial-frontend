import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';

import {
  ArticleType,
  ContentResultType,
  TranslateType,
} from '../../../interfaces';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import {
  getContentTypeFromResourceTypes,
  resourceToLinkProps,
} from '../../../util/resourceHelpers';
import { isLearningpath } from '../../../util/routeHelpers';
import formatDate from '../../../util/formatDate';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { classes } from '../WelcomePage';

interface Props {
  articleId: number;
  content: ContentResultType;
  locale: string;
  t: TranslateType;
}

const LastUsedContent: FC<Props> = ({ articleId, content, locale, t }) => {
  const [article, setArticle] = useState<ArticleType>();

  const fetchArticle = async (articleId: number, locale: string) => {
    const article = await fetchDraft(articleId, locale);
    setArticle(article);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId, locale);
    }
  }, []);

  const getResourceType = () => {
    const resourceTypes =
      content.contexts?.find(context => context.resourceTypes)?.resourceTypes ||
      [];

    if (resourceTypes.length) {
      return getContentTypeFromResourceTypes(resourceTypes);
    } else {
      if (isLearningpath(content.url)) {
        return getContentTypeFromResourceTypes([
          { id: RESOURCE_TYPE_LEARNING_PATH },
        ]);
      }
      return {};
    }
  };

  const linkProps = resourceToLinkProps(
    content,
    getResourceType().contentType,
    locale,
  );

  return (
    <div {...classes('result')}>
      {linkProps && linkProps.href ? (
        <a {...classes('link')} {...linkProps}>
          {content.title.title}
        </a>
      ) : (
        <Link {...classes('link')} to={linkProps.to}>
          {content.title.title} ({t('article.lastUpdated')}{' '}
          {article && formatDate(article.updated)})
        </Link>
      )}
    </div>
  );
};

export default injectT(LastUsedContent);
