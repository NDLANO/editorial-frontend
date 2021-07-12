/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import { RouteComponentProps } from 'react-router';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import * as messageActions from '../Messages/messagesActions';
import { getLocale } from '../../modules/locale/locale';
import Footer from '../App/components/Footer';
import { ReduxState } from '../../interfaces';
const CreateConcept = loadable(() => import('./CreateConcept'));
const EditConcept = loadable(() => import('./EditConcept'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface BaseProps {}

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  applicationError: messageActions.applicationError,
};

const mapStateToProps = (state: ReduxState) => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
});

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;
type Props = BaseProps & tType & RouteComponentProps & PropsFromRedux;

interface State {
  previousLocation: string;
}

class ConceptPage extends PureComponent<Props, State> {
  state = {
    previousLocation: '',
  };

  componentDidMount() {
    const { fetchLicenses, licenses } = this.props;
    if (!licenses.length) {
      fetchLicenses();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ previousLocation: prevProps.location.pathname });
    }
  }

  render() {
    const { t, licenses, history, match, ...rest } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <OneColumn>
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => <CreateConcept licenses={licenses} {...rest} />}
            />
            <Route
              path={`${match.url}/:conceptId/edit/:selectedLanguage`}
              render={routeProps => (
                <EditConcept
                  licenses={licenses}
                  conceptId={routeProps.match.params.conceptId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  isNewlyCreated={this.state.previousLocation === '/concept/new'}
                  {...rest}
                />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </OneColumn>
        <Footer showLocaleSelector={false} />
      </div>
    );
  }
}

export default injectT(connect(mapStateToProps, mapDispatchToProps)(ConceptPage));
