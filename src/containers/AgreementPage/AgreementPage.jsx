/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from 'ndla-ui';

import { getLocale } from '../../modules/locale/locale';
import EditAgreement from './EditAgreement';
import CreateAgreement from './CreateAgreement';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import * as api from '../../modules/draft/draftApi';
import * as messageActions from '../Messages/messagesActions';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { toEditAgreement } from '../../util/routeHelpers';

class AgreementPage extends React.Component {
  constructor() {
    super();
    this.state = { isSaving: false };
    this.upsertAgreement = this.upsertAgreement.bind(this);
  }
  componentWillMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }
  async upsertAgreement(agreement) {
    const { history, applicationError, addMessage } = this.props;
    try {
      await this.setState({ isSaving: true });
      if (agreement.id) {
        await api.updateAgreement(agreement);
      } else {
        const newAgreement = await api.createAgreement(agreement);
        await history.push(toEditAgreement(newAgreement.id));
      }
      await this.setState({ isSaving: false });
      await addMessage({
        translationKey: agreement.id ? 'form.savedOk' : 'form.createdOk',
      });
    } catch (err) {
      this.setState({ isSaving: false });
      applicationError(err);
    }
  }

  render() {
    const { locale, match, licenses } = this.props;
    return (
      <div>
        <OneColumn>
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => (
                <CreateAgreement
                  locale={locale}
                  isSaving={this.state.isSaving}
                  upsertAgreement={this.upsertAgreement}
                  licenses={licenses}
                />
              )}
            />
            <Route
              path={`${match.url}/:agreementId/edit`}
              render={routeProps => (
                <EditAgreement
                  fetchAgreement={this.fetchAgreement}
                  agreementId={routeProps.match.params.agreementId}
                  locale={locale}
                  isSaving={this.state.isSaving}
                  upsertAgreement={this.upsertAgreement}
                  licenses={licenses}
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

AgreementPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
});

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
  addMessage: messageActions.addMessage,
  fetchLicenses: licenseActions.fetchLicenses,
};

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
