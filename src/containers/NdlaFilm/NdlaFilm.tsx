/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import NdlaFilmEditor from "./NdlaFilmEditor";

const NdlaFilm = () => {
  return (
    <Routes>
      <Route path=":selectedLanguage" element={<NdlaFilmEditor />} />
      <Route path="" element={<NdlaFilmEditor />} />
    </Routes>
  );
};

export default NdlaFilm;
