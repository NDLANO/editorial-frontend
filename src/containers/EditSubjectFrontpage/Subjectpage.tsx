/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { OneColumn } from "@ndla/ui";

import CreateSubjectpage from "./CreateSubjectpage";
import EditSubjectpage from "./EditSubjectpage";
import { usePreviousLocation } from "../../util/routeHelpers";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const Subjectpage = () => {
  const previousLocation = usePreviousLocation();

  return (
    <>
      <OneColumn>
        <Routes>
          <Route
            path=":elementId/:subjectpageId/edit/:selectedLanguage"
            element={<EditSubjectpage isNewlyCreated={/\/subjectpage\/(.*)\/new/.test(previousLocation ?? "")} />}
          />
          <Route path=":elementId/new/:selectedLanguage" element={<CreateSubjectpage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </OneColumn>
    </>
  );
};

export default Subjectpage;
