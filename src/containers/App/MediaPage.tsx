/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import PropTypes from 'prop-types';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import AudioUploaderPage from '../AudioUploader/AudioUploaderPage';
import ImageUploaderPage from '../ImageUploader/ImageUploaderPage';
import PodcastUploaderPage from '../Podcast/PodcastUploaderPage';
import PodcastSeriesPage from '../PodcastSeries/PodcastSeriesPage';
import Footer from './components/Footer';

const MediaPage = ({ match }: RouteComponentProps) => (
  <>
    <Switch>
      <PrivateRoute path={`${match.url}/image-upload`} component={ImageUploaderPage} />
      <PrivateRoute path={`${match.url}/audio-upload`} component={AudioUploaderPage} />
      <PrivateRoute path={`${match.url}/podcast-upload`} component={PodcastUploaderPage} />
      <PrivateRoute path={`${match.url}/podcast-series`} component={PodcastSeriesPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Footer showLocaleSelector={false} />
  </>
);

MediaPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(MediaPage);
