/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { AudioRedirect } from "./AudioRedirect";
import { CreateAudioPage } from "./CreateAudio";
import { EditAudioPage } from "./EditAudio";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const AudioUploaderPage = () => {
  return (
    <Routes>
      <Route path="new" element={<PrivateRoute component={<CreateAudioPage />} />} />
      <Route path=":id/edit" element={<PrivateRoute component={<AudioRedirect />} />}>
        <Route index element={<PrivateRoute component={<EditAudioPage />} />} />
        <Route path=":selectedLanguage" element={<PrivateRoute component={<EditAudioPage />} />} />
      </Route>
    </Routes>
  );
};

export default AudioUploaderPage;
