/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import AudioUploaderPage from '../AudioUploader/AudioUploaderPage';
import ImageUploaderPage from '../ImageUploader/ImageUploaderPage';
import PodcastUploaderPage from '../Podcast/PodcastUploaderPage';
import PodcastSeriesPage from '../PodcastSeries/PodcastSeriesPage';

const MediaPage = () => (
  <>
    <Routes>
      <Route path="image-upload/*" element={<PrivateRoute component={<ImageUploaderPage />} />} />
      <Route path="audio-upload/*" element={<PrivateRoute component={<AudioUploaderPage />} />} />
      <Route
        path="podcast-upload/*"
        element={<PrivateRoute component={<PodcastUploaderPage />} />}
      />
      <Route path="podcast-series/*" element={<PrivateRoute component={<PodcastSeriesPage />} />} />
    </Routes>
  </>
);

export default MediaPage;
