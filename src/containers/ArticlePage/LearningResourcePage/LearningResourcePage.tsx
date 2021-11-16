/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import EditResourceRedirect from './EditResourceRedirect';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { usePreviousLocation } from '../../../util/routeHelpers';

interface BaseProps {}

interface ParamsType {
  articleId: string;
}

type Props = BaseProps & RouteComponentProps<ParamsType>;

const LearningResourcePage = ({ match, history, location }: Props) => {
  const previousLocation = usePreviousLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={routeProps => <CreateLearningResource {...routeProps} />}
          />
          <Route path={`${match.url}/:articleId/edit/`}>
            {(params: RouteComponentProps<ParamsType>) => {
              return (
                <EditResourceRedirect
                  match={params.match}
                  history={history}
                  location={location}
                  isNewlyCreated={previousLocation === '/subject-matter/learning-resource/new'}
                />
              );
            }}
          </Route>

          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
    </div>
  );
};

export default LearningResourcePage;
