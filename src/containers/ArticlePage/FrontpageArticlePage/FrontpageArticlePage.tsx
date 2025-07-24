/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreateFrontpageArticle from "./CreateFrontpageArticle";
import EditFrontpageArticle from "./EditFrontpageArticle";
import ResourcePage from "../../../components/ResourcePage";
import { WideArticleEditorProvider } from "../../../components/WideArticleEditorProvider";
import { useDraft } from "../../../modules/draft/draftQueries";

const FrontpageArticlePage = () => (
  <WideArticleEditorProvider initialValue={false}>
    <ResourcePage
      CreateComponent={CreateFrontpageArticle}
      EditComponent={EditFrontpageArticle}
      useHook={useDraft}
      isArticle
    />
  </WideArticleEditorProvider>
);

export default FrontpageArticlePage;
