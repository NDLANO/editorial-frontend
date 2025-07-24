/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";

import CreateSubjectpage from "./CreateSubjectpage";
import EditSubjectpage from "./EditSubjectpage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const Subjectpage = () => {
  return (
    <Routes>
      <Route path=":elementId/:subjectpageId/edit/:selectedLanguage" element={<EditSubjectpage />} />
      <Route path=":elementId/new/:selectedLanguage" element={<CreateSubjectpage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Subjectpage;
