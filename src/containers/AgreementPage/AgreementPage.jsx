/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { HelmetWithTracker } from '@ndla/tracker';
import { withTranslation } from 'react-i18next';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import * as api from '../../modules/draft/draftApi';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import { toEditAgreement } from '../../util/routeHelpers';
import withMessages from '../Messages/withMessages';
import Footer from '../App/components/Footer';
const EditAgreement = loadable(() => import('./EditAgreement'));
const CreateAgreement = loadable(() => import('./CreateAgreement'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

class AgreementPage extends React.Component {
  constructor() {
    super();
    this.state = { isSaving: false };
    this.upsertAgreement = this.upsertAgreement.bind(this);
  }

  componentDidMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }

  async upsertAgreement(agreement) {
    const { history, applicationError, createMessage } = this.props;
    try {
      this.setState({ isSaving: true });
      if (agreement.id) {
        await api.updateAgreement(agreement);
      } else {
        const newAgreement = await api.createAgreement(agreement);
        history.push(toEditAgreement(newAgreement.id));
      }
      this.setState({ isSaving: false });
      createMessage({
        translationKey: agreement.id ? 'form.savedOk' : 'form.createdOk',
        severity: 'success',
      });
    } catch (err) {
      this.setState({ isSaving: false });
      applicationError(err);
    }
  }

  render() {
    const { i18n, match, t, licenses } = this.props;
    const locale = i18n.language;
    return (
      <Fragment>
        <HelmetWithTracker title={t('htmlTitles.agreementPage')} />
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
        <Footer showLocaleSelector={false} />
      </Fragment>
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
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
  }).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  licenses: getAllLicenses(state),
});

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

export default withTranslation()(
  withMessages(connect(mapStateToProps, mapDispatchToProps)(AgreementPage)),
);
