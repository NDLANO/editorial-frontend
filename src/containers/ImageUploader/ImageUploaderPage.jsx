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
import { OneColumn } from 'ndla-ui';

import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getSaving } from '../../modules/audio/audio';
import { getLocale } from '../../modules/locale/locale';
import CreateImage from './CreateImage';
import EditImage from './EditImage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class ImageUploaderPage extends Component {
  componentWillMount() {
    const { fetchTags, fetchLicenses } = this.props;
    fetchTags();
    fetchLicenses();
  }

  render() {
    const { locale, tags, match, history, licenses, isSaving } = this.props;

    return (
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={() => (
              <CreateImage
                history={history}
                locale={locale}
                tags={tags}
                licenses={licenses}
                isSaving={isSaving}
              />
            )}
          />
          <Route
            path={`${match.url}/:imageId/edit`}
            render={props => (
              <EditImage
                imageId={props.match.params.imageId}
                history={history}
                locale={locale}
                tags={tags}
                licenses={licenses}
                isSaving={isSaving}
              />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
    );
  }
}

ImageUploaderPage.propTypes = {
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

const mapStateToProps = state => {
  const locale = getLocale(state);
  const getAllTagsSelector = getAllTagsByLanguage(locale);
  return {
    locale,
    tags: getAllTagsSelector(state),
    licenses: getAllLicenses(state),
    isSaving: getSaving(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploaderPage);
