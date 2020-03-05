import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { ContentResultShape } from '../../../shapes';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import {
  getContentTypeFromResourceTypes,
  resourceToLinkProps,
} from '../../../util/resourceHelpers';
import { isLearningpath } from '../../../util/routeHelpers';
import formatDate from '../../../util/formatDate';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { classes } from '../WelcomePage';

const LastUsedContent = ({ articleId, content, locale, t }) => {
  const { contexts } = content;

  const [article, setArticle] = useState(undefined);

  const fetchArticle = async (articleId, locale) => {
    const article = await fetchDraft(articleId, locale);
    setArticle(article);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId, locale);
    }
  }, []);

  let resourceType = {};
  if (
    contexts &&
    contexts.length > 0 &&
    contexts[0].resourceTypes &&
    contexts[0].resourceTypes.length > 0
  ) {
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
          {content.title.title} ({t('form.saved')}{' '}
          {article && formatDate(article.created)})
        </Link>
      )}
    </div>
  );
};

LastUsedContent.propTypes = {
  articleId: PropTypes.number,
  content: ContentResultShape,
  locale: PropTypes.string.isRequired,
};

export default injectT(LastUsedContent);
