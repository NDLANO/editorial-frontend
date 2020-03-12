import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';

import {
  ArticleType,
  ContentResultType,
  ResourceType,
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
  const { contexts } = content;

  const [article, setArticle] = useState<ArticleType | undefined>(undefined);

  const fetchArticle = async (articleId: number, locale: string) => {
    const article = await fetchDraft(articleId, locale);
    setArticle(article);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId, locale);
    }
  }, []);

  let resourceType: ResourceType | any = {};
  if (contexts[0]?.resourceTypes?.length) {
    resourceType = getContentTypeFromResourceTypes(contexts[0].resourceTypes);
  } else {
    if (isLearningpath(content.url)) {
      resourceType = getContentTypeFromResourceTypes([
        { id: RESOURCE_TYPE_LEARNING_PATH },
      ]);
    }
  }

  const linkProps = resourceToLinkProps(
    content,
    resourceType.contentType,
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
