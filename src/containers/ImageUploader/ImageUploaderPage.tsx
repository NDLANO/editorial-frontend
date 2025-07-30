/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import { CreateImagePage } from "./CreateImage";
import { EditImagePage } from "./EditImage";
import { ImageRedirect } from "./ImageRedirect";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const ImageUploaderPage = () => {
  return (
    <Routes>
      <Route path="new" element={<PrivateRoute component={<CreateImagePage />} />} />
      <Route path=":id/edit" element={<PrivateRoute component={<ImageRedirect />} />}>
        <Route index element={<PrivateRoute component={<EditImagePage />} />} />
        <Route path=":selectedLanguage" element={<PrivateRoute component={<EditImagePage />} />} />
      </Route>
    </Routes>
  );
};

export default ImageUploaderPage;
