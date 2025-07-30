/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { ConceptRedirect } from "./ConceptRedirect";
import { CreateConceptPage } from "./CreateConcept";
import { EditConceptPage } from "./EditConcept";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const ConceptPage = () => (
  <Routes>
    <Route path="new" element={<PrivateRoute component={<CreateConceptPage />} />} />
    <Route path=":id/edit" element={<PrivateRoute component={<ConceptRedirect />} />}>
      <Route index element={<PrivateRoute component={<EditConceptPage />} />} />
      <Route path=":selectedLanguage" element={<PrivateRoute component={<EditConceptPage />} />} />
    </Route>
  </Routes>
);

export default memo(ConceptPage);
