/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { CreatePodcastSeriesPage } from "./CreatePodcastSeries";
import { EditPodcastSeriesPage } from "./EditPodcastSeries";
import { PodcastSeriesRedirect } from "./PodcastSeriesRedirect";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const PodcastSeriesPage = () => (
  <Routes>
    <Route path="new" element={<PrivateRoute component={<CreatePodcastSeriesPage />} />} />
    <Route path=":id/edit" element={<PrivateRoute component={<PodcastSeriesRedirect />} />}>
      <Route index element={<PrivateRoute component={<EditPodcastSeriesPage />} />} />
      <Route path=":selectedLanguage" element={<PrivateRoute component={<EditPodcastSeriesPage />} />} />
    </Route>
  </Routes>
);

export default PodcastSeriesPage;
