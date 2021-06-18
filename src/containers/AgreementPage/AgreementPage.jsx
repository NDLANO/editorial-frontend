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
import { injectT } from '@ndla/i18n';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import { getLocale } from '../../modules/locale/locale';
import * as api from '../../modules/draft/draftApi';
import * as messageActions from '../Messages/messagesActions';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import { toEditAgreement } from '../../util/routeHelpers';
const Footer = loadable(() => import('../App/components/Footer'));

const EditAgreement = loadable(() => import('../../modules/locale/locale'));
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
    const { history, applicationError, addMessage } = this.props;
    try {
      this.setState({ isSaving: true });
      if (agreement.id) {
        await api.updateAgreement(agreement);
      } else {
        const newAgreement = await api.createAgreement(agreement);
        history.push(toEditAgreement(newAgreement.id));
      }
      this.setState({ isSaving: false });
      addMessage({
        translationKey: agreement.id ? 'form.savedOk' : 'form.createdOk',
        severity: 'success',
      });
    } catch (err) {
      this.setState({ isSaving: false });
      applicationError(err);
    }
  }

  render() {
    const { locale, match, t, licenses } = this.props;
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
  locale: PropTypes.string.isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  addMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
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

export default injectT(connect(mapStateToProps, mapDispatchToProps)(AgreementPage));
