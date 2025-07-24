/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreateImage from "./CreateImage";
import EditImage from "./EditImage";
import ResourcePage from "../../components/ResourcePage";
import { useImage } from "../../modules/image/imageQueries";

const ImageUploaderPage = () => (
  <ResourcePage
    CreateComponent={CreateImage}
    EditComponent={EditImage}
    useHook={useImage}
    titleTranslationKey="htmlTitles.imageUploaderPage"
  />
);

export default ImageUploaderPage;
