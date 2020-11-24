/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { tType } from '@ndla/i18n';

import { DRAFT_HTML_SCOPE } from '../../../constants';
import formatDate from '../../../util/formatDate';
import { ArticleType } from '../../../interfaces';
import { toEditArticle, toEditMarkup } from '../../../util/routeHelpers';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { EditMarkupLink } from '../../../components/EditMarkupLink';
import { classes } from '../WelcomePage';

interface Props {
  articleId: number;
  locale: string;
  userAccess: string;
}

const LastUsedContent: FC<Props & tType> = ({
  articleId,
  locale,
  userAccess,
  t,
}) => {
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

  return (
    <div {...classes('result')}>
      {article && (
        <>
          <Link
            {...classes('link')}
            to={toEditArticle(article.id, article.articleType)}>
            {article.title.title} ({t('article.lastUpdated')}{' '}
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

const mapStateToProps = (state: { session: { user: { scope: string } } }) => ({
  userAccess: state.session.user.scope,
});

export default connect(mapStateToProps)(LastUsedContent);
