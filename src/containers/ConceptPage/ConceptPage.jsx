import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import * as messageActions from '../Messages/messagesActions';
import CreateConcept from './CreateConcept';
import EditConcept from './EditConcept';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getLocale } from '../../modules/locale/locale';

class ConceptPage extends PureComponent {
  componentDidMount() {
    const { fetchLicenses, licenses } = this.props;
    if (!licenses.length) {
      fetchLicenses();
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
              render={() => (
                <CreateConcept
                  licenses={licenses}
                  history={history}
                  {...rest}
                />
              )}
            />
            <Route
              path={`${match.url}/:conceptId/edit/:selectedLanguage`}
              render={routeProps => (
                <EditConcept
                  licenses={licenses}
                  conceptId={routeProps.match.params.conceptId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  {...rest}
                />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </OneColumn>
      </div>
    );
  }
}
ConceptPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  userAccess: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  applicationError: messageActions.applicationError,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
});

export default injectT(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConceptPage),
);
