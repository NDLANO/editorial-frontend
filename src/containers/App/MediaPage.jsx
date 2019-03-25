/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import AudioUploaderPage from '../AudioUploader/AudioUploaderPage';
import ImageUploaderPage from '../ImageUploader/ImageUploaderPage';
import Footer from './components/Footer';

const MediaPage = ({ match }) => (
  <Fragment>
    <Switch>
      <PrivateRoute
        path={`${match.url}/image-upload`}
        component={ImageUploaderPage}
      />
      <PrivateRoute
        path={`${match.url}/audio-upload`}
        component={AudioUploaderPage}
      />
      <Route component={NotFoundPage} />
    </Switch>
    <Footer showLocaleSelector={false} />
  </Fragment>
);

MediaPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(MediaPage);
