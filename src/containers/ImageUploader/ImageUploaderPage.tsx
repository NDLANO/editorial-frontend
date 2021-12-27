/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import loadable from '@loadable/component';
import { useImage } from '../../modules/image/imageQueries';
import ResourcePage from '../../components/ResourcePage';
const EditImage = loadable(() => import('./EditImage'));
const CreateImage = loadable(() => import('./CreateImage'));

const ImageUploaderPage = () => (
  <ResourcePage
    CreateComponent={CreateImage}
    EditComponent={EditImage}
    useHook={useImage}
    createUrl="/media/image-upload/new"
    titleTranslationKey="htmlTitles.imageUploaderPage"
  />
);

export default ImageUploaderPage;
