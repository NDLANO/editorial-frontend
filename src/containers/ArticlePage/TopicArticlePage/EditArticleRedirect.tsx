/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useContext, useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import EditTopicArticle from './EditTopicArticle';
import { LocaleContext } from '../../App/App';
import { fetchDraft } from '../../../modules/draft/draftApi';

interface Props {
  match: {
    url: string;
    params: {
      articleId: string;
    };
  };
}
const EditArticleRedirect = ({ match, ...rest }: Props) => {
  const locale = useContext(LocaleContext);
  const { articleId } = match.params;
  const [supportedLanguage, setSupportedLanguage] = useState<string>();

  useEffect(() => {
    fetchDraft(parseInt(articleId)).then(article => {
      const lang =
        article.supportedLanguages.find(l => l === locale) || article.supportedLanguages[0];
      setSupportedLanguage(lang);
    });
  }, [articleId, locale]);

  return (
    <Switch>
      <Route
        path={`${match.url}/:selectedLanguage`}
        render={props => (
          <EditTopicArticle
            articleId={articleId}
            selectedLanguage={props.match.params.selectedLanguage}
            {...rest}
          />
        )}
      />
      {supportedLanguage && (
        <Redirect push from={match.url} to={`${match.url}/${supportedLanguage}`} />
      )}
    </Switch>
  );
};

export default EditArticleRedirect;
