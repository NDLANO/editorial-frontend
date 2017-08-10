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
import { OneColumn, Hero } from 'ndla-ui';

import { actions as tagActions, getAllTags } from '../../modules/tag/tag';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getSaving } from '../../modules/audio/audio';
import { getLocale } from '../../modules/locale/locale';
import CreateAudio from './CreateAudio';
import EditAudio from './EditAudio';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class AudioUploaderPage extends Component {
  componentWillMount() {
    const { fetchTags, fetchLicenses } = this.props;
    fetchTags();
    fetchLicenses();
  }

  render() {
    const { locale, tags, match, history, licenses, isSaving } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Hero alt />
        <OneColumn cssModifier="narrow">
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() =>
                <CreateAudio
                  history={history}
                  locale={locale}
                  tags={tags}
                  licenses={licenses}
                  isSaving={isSaving}
                />}
            />
            <Route
              path={`${match.url}/:audioId/edit`}
              render={props =>
                <EditAudio
                  audioId={props.match.params.audioId.toString()}
                  history={history}
                  locale={locale}
                  tags={tags}
                  licenses={licenses}
                  isSaving={isSaving}
                />}
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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchTags: PropTypes.func.isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchTags: tagActions.fetchTags,
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  tags: getAllTags(state),
  licenses: getAllLicenses(state),
  isSaving: getSaving(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioUploaderPage);
