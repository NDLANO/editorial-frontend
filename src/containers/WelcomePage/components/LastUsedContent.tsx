/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DRAFT_HTML_SCOPE } from '../../../constants';
import formatDate from '../../../util/formatDate';
import { toEditArticle, toEditMarkup } from '../../../util/routeHelpers';
import { EditMarkupLink } from '../../../components/EditMarkupLink';
import { classes } from '../WelcomePage';
import { useDraft } from '../../../modules/draft/draftQueries';

interface Props {
  articleId: number;
  locale: string;
  userAccess?: string;
}

const LastUsedContent = ({ articleId, locale, userAccess }: Props) => {
  const { t } = useTranslation();

  const { data: article } = useDraft(articleId, locale);

  return (
    <div {...classes('result')}>
      {article && (
        <>
          <Link {...classes('link')} to={toEditArticle(article.id, article.articleType)}>
            {article.title?.title} ({t('article.lastUpdated')}{' '}
            {article && formatDate(article.updated)})
          </Link>
          {userAccess?.includes(DRAFT_HTML_SCOPE) ? (
            <EditMarkupLink
              to={toEditMarkup(
                articleId,
                article.supportedLanguages.includes(locale)
                  ? locale
                  : article.supportedLanguages[0],
              )}
              title={t('editMarkup.linkTitle')}
              inHeader={true}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default LastUsedContent;
