/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Switch, withRouter } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps } from 'react-router-dom';
import EditArticleRedirect from './EditArticleRedirect';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { usePreviousLocation } from '../../../util/routeHelpers';

interface Props extends RouteComponentProps<{ articleId: string }> {}

const TopicArticlePage = ({ match }: Props) => {
  const previousLocation = usePreviousLocation();

  return (
    <OneColumn>
      <Switch>
        <Route path={`${match.url}/new`} render={() => <CreateTopicArticle />} />
        <Route path={`${match.url}/:articleId/edit/`}>
          <EditArticleRedirect
            isNewlyCreated={previousLocation === '/subject-matter/topic-article/new'}
          />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default withRouter(TopicArticlePage);
