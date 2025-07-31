/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { CreatePodcastPage } from "./CreatePodcast";
import { EditPodcastPage } from "./EditPodcast";
import { PodcastRedirect } from "./PodcastRedirect";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const PodcastUploderPage = () => (
  <Routes>
    <Route path="new" element={<PrivateRoute component={<CreatePodcastPage />} />} />
    <Route path=":id/edit" element={<PrivateRoute component={<PodcastRedirect />} />}>
      <Route index element={<PrivateRoute component={<EditPodcastPage />} />} />
      <Route path=":selectedLanguage" element={<PrivateRoute component={<EditPodcastPage />} />} />
    </Route>
  </Routes>
);

export default PodcastUploderPage;
