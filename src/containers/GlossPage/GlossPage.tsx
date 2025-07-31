/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateGlossPage } from "./CreateGloss";
import { EditGlossPage } from "./EditGloss";
import { GlossRedirect } from "./GlossRedirect";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const GlossPage = () => (
  <Routes>
    <Route path="new" element={<PrivateRoute component={<CreateGlossPage />} />} />
    <Route path=":id/edit" element={<PrivateRoute component={<GlossRedirect />} />}>
      <Route index element={<PrivateRoute component={<EditGlossPage />} />} />
      <Route path=":selectedLanguage" element={<PrivateRoute component={<EditGlossPage />} />} />
    </Route>
  </Routes>
);

export default memo(GlossPage);
