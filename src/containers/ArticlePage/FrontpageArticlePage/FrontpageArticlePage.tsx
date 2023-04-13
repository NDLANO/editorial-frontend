/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useDraft } from '../../../modules/draft/draftQueries';
import ResourcePage from '../../../components/ResourcePage';
import CreateFrontpageArticle from './CreateFrontpageArticle';
import EditFrontpageArticle from './EditFrontpageArticle';

const FrontpageArticlePage = () => (
  <ResourcePage
    CreateComponent={CreateFrontpageArticle}
    EditComponent={EditFrontpageArticle}
    useHook={useDraft}
    createUrl="/subject-matter/frontpage-article/new"
    isArticle={true}
  />
);

export default FrontpageArticlePage;
