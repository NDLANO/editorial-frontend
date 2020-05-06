/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getLocale } from '../../modules/locale/locale';
import CreateAudio from './CreateAudio';
import EditAudio from './EditAudio';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class AudioUploaderPage extends Component {
  componentDidMount() {
    this.props.fetchLicenses();
  }

  render() {
    const { match, t, ...rest } = this.props;

    return (
      <div>
        <OneColumn>
          <HelmetWithTracker title={t('htmlTitles.audioUploaderPage')} />
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => <CreateAudio {...rest} />}
            />
            <Route
              path={`${match.url}/:audioId/edit/:audioLanguage`}
              render={props => (
                <EditAudio
                  audioId={props.match.params.audioId}
                  audioLanguage={props.match.params.audioLanguage}
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

AudioUploaderPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = state => {
  const locale = getLocale(state);
  return {
    locale,
    licenses: getAllLicenses(state),
  };
};

export default injectT(
  connect(mapStateToProps, mapDispatchToProps)(AudioUploaderPage),
);
