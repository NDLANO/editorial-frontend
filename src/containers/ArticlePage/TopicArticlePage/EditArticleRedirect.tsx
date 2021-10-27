/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Action, ActionFunction1 } from 'redux-actions';
import EditTopicArticle from './EditTopicArticle';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';

interface Props extends RouteComponentProps<{ articleId: string }> {
  isNewlyCreated: boolean;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
}
const EditArticleRedirect = ({ match, createMessage, applicationError, isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
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
            createMessage={createMessage}
            applicationError={applicationError}
            articleId={articleId}
            selectedLanguage={props.match.params.selectedLanguage}
            isNewlyCreated={isNewlyCreated}
          />
        )}
      />
      {supportedLanguage && (
        <Redirect push from={match.url} to={`${match.url}/${supportedLanguage}`} />
      )}
    </Switch>
  );
};

export default withRouter(EditArticleRedirect);
